import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  PORT = 3001
} = process.env;

// In-memory token store for local dev only. Swap for a real session/store
// before this touches more than one user.
let tokenStore = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null
};

// Step 1: redirect the user to Spotify's consent screen.
app.get("/api/auth/login", (req, res) => {
  const scope = [
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-private"
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: SPOTIFY_REDIRECT_URI
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// Step 2: Spotify redirects back here with a code; exchange it for tokens.
app.get("/api/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    tokenStore = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000
    };

    res.redirect("http://127.0.0.1:5173?connected=true");
  } catch (err) {
    console.error("Token exchange failed:", err);
    res.status(500).send("Token exchange failed");
  }
});

// Simple helper the frontend can poll to check auth state.
app.get("/api/auth/status", (req, res) => {
  res.json({ authenticated: !!tokenStore.accessToken });
});

// TODO: /api/tracks?genre=...&mode=...
// Should call Spotify's Search endpoint with a genre: filter, since
// the old /recommendations genre-seed flow is deprecated. Sort/filter
// by track popularity for the wild-card vs adjacent distinction.
app.get("/api/tracks", async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

// TODO: /api/playlists (POST)
// Should create a playlist for the authenticated user and add the
// generated tracks to it.
app.post("/api/playlists", async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

app.listen(PORT, () => {
  console.log(`Genre Roulette server running on http://localhost:${PORT}`);
});