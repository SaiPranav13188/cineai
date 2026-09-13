from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import json
import os
from vector_store import init_vector_db, query_similar_movies

app = FastAPI(title="CineAI API")

# Updated CORS middleware to allow requests from your live Vercel frontend and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from Vercel and any other frontend origin
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "booked_seats.json"

def load_booked_seats() -> Dict[str, List[str]]:
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_booked_seats(data: Dict[str, List[str]]):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

# Persistent store backed by a local JSON file to survive server restarts/spin-downs
booked_seats_db: Dict[str, List[str]] = load_booked_seats()

# Populate/initialize ChromaDB vector collection on server startup
@app.on_event("startup")
def startup_event():
    init_vector_db()

class QueryRequest(BaseModel):
    user_query: str

class MovieSchema(BaseModel):
    id: str
    title: str
    rating: str
    genre: str
    poster: str
    price: float

class RecommendationResponse(BaseModel):
    reply: str
    recommendations: List[MovieSchema]

class BookingRequest(BaseModel):
    movie_id: str
    showtime: str
    seats: List[str]

@app.get("/")
def root():
    return {"message": "CineAI Vector Search RAG Backend Online"}

@app.get("/api/seats/{movie_id}")
def get_booked_seats(movie_id: str, showtime: str):
    # Always reload fresh from disk to catch any independent updates
    global booked_seats_db
    booked_seats_db = load_booked_seats()
    
    key = f"{movie_id}_{showtime}"
    return {"booked_seats": booked_seats_db.get(key, [])}

@app.post("/api/book")
def book_seats(booking: BookingRequest):
    global booked_seats_db
    booked_seats_db = load_booked_seats()
    
    key = f"{booking.movie_id}_{booking.showtime}"
    current_booked = booked_seats_db.setdefault(key, [])
    
    # Prevent double-booking race conditions for this specific movie showtime
    for seat in booking.seats:
        if seat in current_booked:
            raise HTTPException(
                status_code=400, 
                detail=f"Seat {seat} is already occupied for this showtime.",
                headers={"X-Booked-Seats": json.dumps(current_booked)}
            )
    
    current_booked.extend(booking.seats)
    save_booked_seats(booked_seats_db)  # Persist changes to disk immediately
    return {"message": "Booking successful!", "booked_seats": current_booked}

@app.post("/api/v1/recommend", response_model=RecommendationResponse)
async def recommend(payload: QueryRequest):
    # Retrieve top 2 matches within max similarity distance threshold (1.25)
    matches = query_similar_movies(payload.user_query, max_distance=1.25, top_k=2)

    if matches:
        reply = f"I analyzed your preferences using vector search and found {len(matches)} top matching show(s) near Hyderabad:"
    else:
        reply = "Sorry, no matching shows were found for your query. Try searching for superhero action or water survival thrillers!"

    return RecommendationResponse(reply=reply, recommendations=matches)