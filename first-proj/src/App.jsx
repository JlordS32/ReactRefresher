import React, { useState, useEffect } from "react";
import Search from "./components/Search";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
   },
};

const App = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [movieList, setMovieList] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   const fetchMovies = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
         const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
         const response = await fetch(endpoint, API_OPTIONS);

         if (!response.ok) {
            throw new Error("Failed to fetch movies!");
         }

         const data = await response.json();

         if (data.Response === "False") {
            setErrorMessage(data.Error || "Failed to fetch movies!");
            setMovieList([]);
            return;
         }

         setMovieList(data.results || []);
      } catch (err) {
         console.error(`Error fetching movies: ${err}`);
         setErrorMessage(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      console.log(isLoading);
      fetchMovies();
   }, []);

   return (
      <main>
         <div className="pattern">
            <div className="wrapper">
               <header>
                  <img src="./hero-img.png" alt="Hero Image" />
                  <h1>
                     Find <span className="text-gradient">Movies</span> You'll
                     Enjoy Without the Hassle!
                  </h1>
               </header>

               <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

               <section className="all-movies">
                  <h2>All Movies</h2>

                  {isLoading ? (
                     <p>Loading ...</p>
                  ) : errorMessage ? (
                     <p className="text-red-500">{errorMessage}</p>
                  ) : movieList.length === 0 ? (
                     <p>No movies found.</p>
                  ) : (
                     <ul >
                        {movieList.map((movie) => (
                           <li key={movie.id} className="text-white">
                              {movie.title}
                           </li>
                        ))}
                     </ul>
                  )}
               </section>
            </div>
         </div>
      </main>
   );
};

export default App;
