import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import fetchMovies from "./helpers/fetchMovies";

const App = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [movieList, setMovieList] = useState({});
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      console.log(isLoading);
      fetchMovies(setIsLoading, setErrorMessage, setMovieList);
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
                     <p className="text-white">Loading ...</p>
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
