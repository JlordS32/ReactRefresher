import { useState, useEffect } from "react";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { Client } from "appwrite";
import { updateSearchCount, getTrendingMovies } from "./appwrite";

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
   const [movieList, setMovieList] = useState([]);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

   useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

   const fetchMovies = async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      try {
         const endpoint = query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

         if (query && data.results.length > 0) {
            console.log("Updating search count...");
            updateSearchCount(query, data.results[0]);
         }
      } catch (err) {
         console.error(`Error fetching movies: ${err}`);
         setErrorMessage(err.message);
      } finally {
         setIsLoading(false);
      }
   };

   const loadTrendingMovies = async () => {
      try {
         const movies = await getTrendingMovies();
         setTrendingMovies(movies);
         console.log(movies);
      } catch (err) {
         console.error(`Error fetching movies: ${err}`);
      }
   };

   useEffect(() => {
      updateSearchCount();
      fetchMovies(debouncedSearchTerm);
   }, [debouncedSearchTerm]);

   useEffect(() => {
      loadTrendingMovies();
   }, []);

   useEffect(() => {
      console.log(trendingMovies);
   }, [trendingMovies]);

   return (
      <main>
         <div className="pattern">
            <div className="wrapper">
               <header>
                  <img src="./hero-img.png" alt="Hero Image" />
                  <h1>
                     Find <span className="text-gradient">Movies</span>{" "}
                     You&apos;ll Enjoy Without the Hassle!
                  </h1>
                  <Search
                     searchTerm={searchTerm}
                     setSearchTerm={setSearchTerm}
                  />
               </header>

               {trendingMovies && trendingMovies.length > 0 && (
                  <section className="trending">
                     <h2>Trending Movies</h2>

                     <ul>
                        {trendingMovies.map((movie, index) => {
                           return (
                              <li key={movie.$id}>
                                 <p>{index + 1}</p>
                                 <img src={movie.poster_url} alt={movie.title} />
                              </li>
                           );
                        })}
                     </ul>
                  </section>
               )}

               <section className="all-movies pt-7">
                  <h2>All Movies</h2>

                  {isLoading ? (
                     <p className="text-white">Loading ...</p>
                  ) : errorMessage ? (
                     <p className="text-red-500">{errorMessage}</p>
                  ) : movieList.length === 0 ? (
                     <p>No movies found.</p>
                  ) : (
                     <ul>
                        {movieList.map((movie) => (
                           <MovieCard key={movie.id} movie={movie} />
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
