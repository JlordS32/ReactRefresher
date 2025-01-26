const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;
const API_OPTIONS = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
   },
};

const fetchMovies = async (setIsLoading, setErrorMessage, setMovieList) => {
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

export default fetchMovies;