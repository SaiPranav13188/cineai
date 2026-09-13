MOVIES_DATA = [
    {
        "id": "1",
        "title": "Spider-Man",
        "rating": "4.8",
        "genre": "Action / Sci-Fi",
        "poster": "/movies/movie1.jpg",
        "price": 250.0,
        "description": "A high-octane action-packed superhero film featuring wall-crawling action, futuristic science, and epic battles against supervillains."
    },
    {
        "id": "2",
        "title": "Jaws",
        "rating": "4.5",
        "genre": "Thriller / Adventure",
        "poster": "/movies/movie2.jpg",
        "price": 180.0,
        "description": "A tense survival thriller set on open waters where a giant maneating shark terrorizes a small beach community."
    },
    {
        "id": "3",
        "title": "The Avengers",
        "rating": "4.7",
        "genre": "Action / Sci-Fi",
        "poster": "/movies/movie3.jpg",
        "price": 300.0,
        "description": "Earth's mightiest heroes team up to fight off an alien invasion in an explosive, fast-paced action sci-fi spectacle."
    }
]

def init_vector_db():
    return MOVIES_DATA

def query_similar_movies(user_query: str, max_distance: float = 1.25, top_k: int = 3):
    """
    Keyword match function with stop-word filtering to prevent filler words 
    like 'i', 'want', 'a' from triggering false positive matches.
    """
    stop_words = {"i", "want", "a", "an", "the", "to", "tonight", "show", "me", "find"}
    query_words = [word.lower() for word in user_query.split() if word.lower() not in stop_words]
    
    scored_movies = []
    
    for movie in MOVIES_DATA:
        text = (movie["title"] + " " + movie["genre"] + " " + movie["description"]).lower()
        score = sum(1 for word in query_words if word in text)
        if score > 0:  # Only keep movies that match meaningful keywords
            scored_movies.append((score, movie))
    
    scored_movies.sort(key=lambda x: x[0], reverse=True)
    results = [movie for score, movie in scored_movies[:top_k]]
    return results

def format_movies_context(recommendations: list) -> str:
    if not recommendations:
        return "No movies found matching the user query."

    context_lines = []
    for m in recommendations:
        context_lines.append(
            f"- Title: {m['title']} | Genre: {m['genre']} | Rating: ⭐{m['rating']} | Price: ₹{m['price']}"
        )
    return "\n".join(context_lines)