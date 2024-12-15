import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { TextField, IconButton, Box, Typography, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Card, CardContent, CardMedia } from "@mui/material";

const Filmes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const modalRef = useRef(null);
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    if (selectedMovie) {
      modalRef.current.style.display = "block";
    } else {
      modalRef.current.style.display = "none";
    }
  }, [selectedMovie]);

  const handleMovieClick = async (movieId) => {
    try {
      setSelectedMovie(movieId);
      setVideoUrl(`https://multiembed.mov/?video_id=${movieId}`);

      const response = await axios.get(
        `http://localhost:3001/infomovie/${movieId}`,
      );
      if (response.status === 200 && response.data) {
        setMovieDetails(response.data);
      } else {
        setError("Error fetching movie details.");
      }
    } catch (error) {
      console.error("Error fetching video/details:", error);
      setError("Error fetching video or details. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setVideoUrl("");
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      if (searchTerm.trim() === "") return;

      const response = await axios.get(
        `http://localhost:3001/search/movies/${searchTerm}`,
      );
      if (response.status === 200 && response.data) {
        setMovies(response.data);
      } else {
        setError(response.statusText || "Search Failed.");
      }
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const styles = {
    container: {
      maxWidth: "100%",
      margin: "20px auto",
      textAlign: "center",
    },
    movieItem: {
      width: "230px", // Fixed width
      height: "440px", // Fixed height
      border: "1px solid #ccc",
      boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
      borderRadius: "5px",
      overflow: "hidden",
      padding: 0,
      margin: "10px", //Added margin for spacing
      display: "flex", // Enable flexbox for better layout
      flexDirection: "column", // Stack items vertically
    },
    movieImage: {
      width: "100%", // Image takes full width
      height: "100%", // Image takes full height
      objectFit: "cover", // Cover the entire area
    },
    movieDetails: {
      padding: "10px",
      flex: 1, // Details occupy remaining space after image
      textAlign: "center", // Center text
    },

    movieList: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
    },
    searchContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
      gap: "10px",
    },
    error: { color: "red" },
    loading: { fontSize: "1.2em", fontWeight: "bold" },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      maxWidth: "800px",
      width: "90%",
      zIndex: 1000, // Ensure modal is on top
    },
    videoContainer: {
      width: "100%",
      marginBottom: "10px",
    },
    iframe: {
      width: "100%",
      height: "400px",
      border: "none",
    },
    closeButton: {
      position: "fixed", //Make it fixed
      top: "20px",
      left: "20px", // Adjust position as needed
      backgroundColor: "red",
      color: "white",
      padding: "10px 15px",
      borderRadius: "5px",
      zIndex: 1001, // Ensure it's on top of modal
      cursor: "pointer",
    },
    detailsContainer: {
      marginTop: "20px",
      padding: "10px",
    },
    detailItem: {
      marginBottom: "10px",
    },
    overlay: {
      // Style for the overlay
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 999, // Ensure it's below the modal
      display: "none", //Initially hidden
    },
    overlayOpen: {
      // Style for the overlay when open
      display: "block", //Show the overlay
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <TextField
          label="Pesquise por título do filme..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <IconButton aria-label="search" onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </div>
      {loading && <p style={styles.loading}>Carregando...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {Array.isArray(movies) && movies.length > 0 && (
        <div style={styles.movieList}>
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              onClick={() => handleMovieClick(movie.imdbID)}
              style={{ cursor: "pointer" }}
            >
              <Card style={styles.movieItem} key={movie.imdbID}>
                {movie.Poster !== "N/A" && (
                  <CardMedia
                    component="img"
                    height="auto"
                    image={movie.Poster}
                    alt={movie.Title}
                    style={styles.movieImage}
                  />
                )}
                <CardContent style={styles.movieDetails}>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.Title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({movie.Year})
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
      <div
        style={{ ...styles.overlay, ...(selectedMovie && styles.overlayOpen) }}
        onClick={handleCloseModal}
      ></div>
      <div ref={modalRef} style={styles.modal} className="modal">
        {" "}
        {/* Modal is now correctly controlled by the ref */}
        {selectedMovie && (
          <>
            <div style={styles.videoContainer}>
              {videoUrl && (
                <iframe
                  src={videoUrl}
                  title="Embedded Video"
                  style={styles.iframe}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
              {!videoUrl && error && <p>{error}</p>}
            </div>
            {movieDetails && ( // Ensure movieDetails is available before rendering
              <Paper style={styles.detailsContainer} elevation={3}>
                <Box>
                  <Typography variant="h6">{movieDetails.Title}</Typography>
                  <Typography variant="body1">{movieDetails.Year}</Typography>
                  <Typography variant="body1">
                    {movieDetails.Director}
                  </Typography>
                  <Typography variant="body1">{movieDetails.Plot}</Typography>
                </Box>
              </Paper>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Filmes;
