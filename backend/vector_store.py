import os
import chromadb
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

chroma_client = chromadb.Client()
collection_name = "movies_rag"

# Calls Hugging Face's free API (0 MB local memory footprint)
embedding_fn = HuggingFaceInferenceAPIEmbeddings(
    api_key=os.getenv("HF_TOKEN"),
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

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
    collection = chroma_client.get_or_create_collection(name=collection_name)
    
    if collection.count() == 0:
        documents = [m["description"] for m in MOVIES_DATA]
        metadatas = [
            {
                "id": m["id"],
                "title": m["title"],
                "rating": m["rating"],
                "genre": m["genre"],
                "poster": m["poster"],
                "price": m["price"]
            }
            for m in MOVIES_DATA
        ]
        ids = [m["id"] for m in MOVIES_DATA]

        embeddings = embedding_fn.embed_documents(documents)
        collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
    return collection

def query_similar_movies(user_query: str, max_distance: float = 1.25, top_k: int = 3):
    """
    Queries ChromaDB and filters out candidates with distance above `max_distance`.
    Lower distance values indicate higher semantic similarity.
    """
    collection = chroma_client.get_collection(name=collection_name)
    query_embedding = embedding_fn.embed_query(user_query)
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["metadatas", "distances"]
    )
    
    recommendations = []
    if results and "metadatas" in results and results["metadatas"]:
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]
        
        for item, dist in zip(metadatas, distances):
            # Only include recommendations that meet the similarity threshold
            if dist <= max_distance:
                recommendations.append(item)
            
    return recommendations

def format_movies_context(recommendations: list) -> str:
    """Formats retrieved movie matches into plain text context for the LLM."""
    if not recommendations:
        return "No movies found matching the user query."

    context_lines = []
    for m in recommendations:
        context_lines.append(
            f"- Title: {m['title']} | Genre: {m['genre']} | Rating: ⭐{m['rating']} | Price: ₹{m['price']}"
        )
    return "\n".join(context_lines)