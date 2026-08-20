# Genre Roulette

Spin a genre, get a starter playlist, save it to Spotify.

## Stack
- Frontend: Vite + React + Tailwind (`src/`)
- Backend: Express (`server/`) — handles Spotify OAuth so the client secret
  never reaches the browser

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a Spotify app at https://developer.spotify.com/dashboard and set
   its redirect URI to `http://localhost:3001/api/auth/callback`.

3. Copy `.env.example` to `.env` and fill in your client ID/secret:
   ```
   cp .env.example .env
   ```

4. Run both processes (two terminals):
   ```
   npm run server
   npm run dev
   ```

5. Visit `http://localhost:5173`. Hit `http://localhost:3001/api/auth/login`
   in a browser tab to start the OAuth flow (a "Connect Spotify" button
   wired to this endpoint is the next piece to add to the UI).

## What's wired up vs. stubbed

**Working:**
- Spin animation and reel mechanic (`ReelCard.jsx`)
- Wild card / Adjacent mode toggle (UI only — doesn't affect track fetching yet)
- Spotify OAuth login + callback + token exchange (server)

**Stubbed (marked with TODO in code):**
- `/api/tracks` — needs to call Spotify's Search endpoint with a `genre:`
  filter (the old `/recommendations` genre-seed endpoint is deprecated as
  of Nov 2024 and doesn't return results)
- `/api/playlists` — needs to create a playlist and add tracks for the
  authenticated user
- Genre list is currently a small hardcoded array in `App.jsx` — needs to
  be replaced with a real curated list (Spotify no longer exposes
  `/recommendations/available-genre-seeds`)
- Flavor text per genre (not yet designed)
- Color/animation theming per genre family (not yet designed)
- Inline 30-second audio previews on track rows (Spotify only returns
  `preview_url` for some tracks — need a fallback for tracks without one)
