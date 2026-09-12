import streamlit as st
import requests

st.title("CineAI Movie Recommender")
st.write("Search for movies using your live Render backend.")

# User input text box
user_query = st.text_input("What kind of movie are you looking for?", "action movie with supervillains")

if st.button("Get Recommendations"):
    if user_query:
        with st.spinner("Connecting to backend..."):
            try:
                # Sends a POST request to your live Render backend URL
                response = requests.post(
                    "https://cineai-backend-1zxp.onrender.com/api/v1/recommend",
                    json={"user_query": user_query}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    st.success(data.get("reply", "Found matches:"))
                    
                    # Display each recommended movie safely
                    for movie in data.get("recommendations", []):
                        title = movie.get('title', 'Unknown Title')
                        rating = movie.get('rating', 'N/A')
                        genre = movie.get('genre', 'N/A')
                        price = movie.get('price', 'N/A')
                        # Check multiple possible key names for description
                        description = movie.get('description', movie.get('plot', movie.get('summary', 'No description available.')))
                        
                        st.subheader(f"{title} (Rating: ⭐{rating})")
                        st.write(f"**Genre:** {genre}")
                        st.write(f"**Price:** ₹{price}")
                        st.write(f"**Description:** {description}")
                        st.markdown("---")
                else:
                    st.error(f"Server returned error code: {response.status_code}")
            except Exception as e:
                st.error(f"Could not connect to backend: {e}")
    else:
        st.warning("Please type a search query.")