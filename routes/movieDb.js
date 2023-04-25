const express = require("express");
const router = express.Router();
const axios = require("axios");
const e = require("express");
const { NotFoundError } = require("../expressError");

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `9a114ae809d1fc32f0105fcd87afe983`;

/** GET movies with search form --> SearchForm */
router.get("/search", async (req, res, next) => {
  const { searchText } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: searchText,
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.log(err);
    return res.send(NotFoundError);
  }
});

/** GET popular movies on mount --> Homepage */

router.get("/popular", async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/day`, {
      params: {
        api_key: API_KEY,
      },
    });
    return res.send(response.data);
  } catch (err) {
    res.send(NotFoundError);
  }
});

/** GET upcoming movie releases on mount --> Homepage */
router.get("/upcoming", async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
      },
    });
    return res.send(response.data);
  } catch (err) {
    res.send(NotFoundError);
  }
});

/** GET movie details --> MovieDetails */
router.get("/movie/:movie_id", async (req, res, next) => {
  const { movie_id } = req.params;
  console.log(movie_id);

  try {
    const detailsResponse = await axios.get(`${BASE_URL}/movie/${movie_id}`, {
      params: {
        api_key: API_KEY,
      },
    });
    const providerResponse = await axios.get(
      `${BASE_URL}/movie/${movie_id}/watch/providers?api_key=${API_KEY}`
    );
    const castResponse = await axios.get(
      `${BASE_URL}/movie/${movie_id}/credits?api_key=${API_KEY}`
    );
    // const movieRatingResponse = await axios.get(
    //   `${BASE_URL}/movie/${movie_id}/ratings?=api_key=${API_KEY}`
    // );
    const data = {};
    data.details = detailsResponse.data;
    data.cast = castResponse.data.cast;
    data.movieRatings;
    data.providers = providerResponse.data.results.US;
    console.log(data);
    return res.json({ data });
  } catch (err) {
    console.log(err);
    return res.send(NotFoundError);
  }
});

router.get("/movie/:movie_id/recommendations", async (req, res, next) => {
  const { movie_id } = req.params;
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movie_id}/recommendations`,
      {
        params: {
          api_key: API_KEY,
        },
      }
    );
    return res.json(response.data);
  } catch (err) {
    res.send(NotFoundError);
  }
});

router.get("/genres", async (req, res, next) => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
      },
    });
    return res.json(response.data);
  } catch (err) {
    res.send(NotFoundError);
  }
});

router.get("/movie/:movie_id/ratings", async (req, res, next) => {
  const { movie_id } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movie_id}/ratings`, {
      params: {
        api_key: API_KEY,
      },
    });
    return res.json(response.data);
  } catch (err) {
    res.send(NotFoundError);
  }
});

/** Get watch providers
 *
 * /movie/{movie_id}/watch/providers
 */
router.get(
  "/movie/:movie_id/watch/providers/:countryCode",
  async (req, res, next) => {
    const { movie_id, countryCode } = req.params;
    console.log(movie_id, countryCode);
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${movie_id}/watch/providers?${API_KEY}&country=${countryCode}`,
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      return res.json(response.data);
    } catch (err) {
      res.send(NotFoundError);
    }
  }
);

module.exports = router;
