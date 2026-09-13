from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
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

@app.get("/")
def root():
    return {"message": "CineAI Vector Search RAG Backend Online"}

@app.post("/api/v1/recommend", response_model=RecommendationResponse)
async def recommend(payload: QueryRequest):
    # Retrieve top 2 matches within max similarity distance threshold (1.25)
    matches = query_similar_movies(payload.user_query, max_distance=1.25, top_k=2)

    if matches:
        reply = f"I analyzed your preferences using vector search and found {len(matches)} top matching show(s) near Hyderabad:"
    else:
        reply = "Sorry, no matching shows were found for your query. Try searching for superhero action or water survival thrillers!"

    return RecommendationResponse(reply=reply, recommendations=matches)