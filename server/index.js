const axios = require("axios");
const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.listen(3001, () => {
  console.log("servidor rolando");
});

const omdbApiKey = "d9e1660d";

server.get("/search/movies/:query", async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query}`,
    );
    if (response.data.Error) {
      return res.status(404).json({ error: response.data.Error });
    }
    const movies = response.data.Search.filter((item) => item.Type === "movie");
    res.json(movies);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "Failed to search movies" });
  }
});

server.get("/infomovie/:imdbID", async (req, res) => {
  const imdbID = req.params.imdbID;
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbID}`,
    );

    if (response.data.Error) {
      return res.status(404).json({ error: response.data.Error });
    }

    //Only send the fields that you actually need.
    const movieDetails = {
      Title: response.data.Title,
      Year: response.data.Year,
      Director: response.data.Director,
      Plot: response.data.Plot,
    };

    res.json(movieDetails);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

server.get("/infoseries/:imdbID", async (req, res) => {
  const imdbID = req.params.imdbID;
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbID}`,
    );

    if (response.data.Error) {
      return res.status(404).json({ error: response.data.Error });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

server.get("/seasoninfo/:imdbID/:seasonNumber", async (req, res) => {
  const imdbID = req.params.imdbID;
  const seasonNumber = req.params.seasonNumber;

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbID}&Season=${seasonNumber}`, // Note "Season" parameter
    );

    if (response.data.Error) {
      return res.status(404).json({ error: response.data.Error });
    }

    // Send the relevant season data back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching season details:", error);
    res.status(500).json({ error: "Failed to fetch season details" });
  }
});

server.get("/search/tv/:query", async (req, res) => {
  const query = req.params.query;
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query}`,
    );
    if (response.data.Error) {
      return res.status(404).json({ error: response.data.Error });
    }
    const tvShows = response.data.Search.filter(
      (item) => item.Type === "series",
    );
    res.json(tvShows);
  } catch (error) {
    console.error("Error searching TV shows:", error);
    res.status(500).json({ error: "Failed to search TV shows" });
  }
});
