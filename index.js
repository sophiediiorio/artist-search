// Load environment variables from .env
require("dotenv").config();

// Import libraries
const express = require("express");
const querystring = require("querystring");
const axios = require("axios");

// Create Express app
const app = express();

// Server settings
const PORT = 3000;

// Spotify credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// Must match Spotify Dashboard exactly
const REDIRECT_URI = "http://127.0.0.1:3000/callback";

// Store access token after login
let accessToken = "";


// ======================
// HOME PAGE
// ======================
app.get("/", (req, res) => {
  res.send(`
    <h1>Artist Search 🎧</h1>

    <p>
      Search for artist information using the Spotify API.
    </p>

    <a href="/login">
      Login with Spotify
    </a>
  `);
});


// ======================
// LOGIN ROUTE
// ======================
app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";

  const authURL =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope,
      redirect_uri: REDIRECT_URI,
    });

  res.redirect(authURL);
});


// ======================
// CALLBACK ROUTE
// ======================
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("No authorization code received.");
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",

      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),

      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    // Save token for later API requests
    accessToken = response.data.access_token;

    // Send user directly to search page
    res.redirect("/search");

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).send(`
      <h2>Token Exchange Failed</h2>
      <p>Check the server console for details.</p>
    `);
  }
});


// ======================
// SEARCH PAGE
// ======================
app.get("/search", (req, res) => {
    
  res.send(`
    <h1>Artist Search 🎧</h1>

    <form action="/artist" method="GET">

      <input
        type="text"
        name="artist"
        placeholder="Enter artist name"
        required
      />

      <button type="submit">
        Search
      </button>

    </form>
  `);
});

// ======================
// ARTIST SEARCH ROUTE
// ======================
app.get("/artist", async (req, res) => {
//   const artistName = req.query.artist;

//   try {
//     const response = await axios.get(
//       "https://api.spotify.com/v1/search",
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },

//         params: {
//           q: artistName,
//           type: "artist",
//           limit: 1,
//         },
//       }
//     );

//     const artist = response.data.artists.items[0];

//     if (!artist) {
//       return res.send(`
//         <h2>Artist not found.</h2>
//         <a href="/search">Try Again</a>
//       `);
//     }

//     res.send(`
//       <h1>${artist.name}</h1>

//       <p>
//         Followers:
//         ${artist.followers.total.toLocaleString()}
//       </p>

//       <p>
//         Genres:
//         ${artist.genres.join(", ") || "None listed"}
//       </p>

//       <a href="/search">
//         Search Another Artist
//       </a>
//     `);

//   } catch (error) {
//     console.error(error.response?.data || error.message);

//     res.status(500).send(`
//       <h2>Search Failed</h2>
//       <p>Something went wrong while searching Spotify.</p>
//       <a href="/search">Try Again</a>
//     `);
//   }

console.log("ARTIST ROUTE HIT");

  const artistName = req.query.artist;

  console.log("Searching for:", artistName);
  console.log("Access Token:", accessToken);

  try {
    console.log("About to call Spotify...");

    const response = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: artistName,
          type: "artist",
          limit: 1,
        },
      }
    );

    console.log("Spotify responded!");

    res.send("Success");
  } catch (error) {
    console.log("Spotify request failed");

    console.error(error.response?.status);
    console.error(error.response?.data);

    res.send("Failed");
  }
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});