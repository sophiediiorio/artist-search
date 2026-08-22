import { useState, useEffect } from "react";
import ReelCard from "./ReelCard.jsx";

const GENRES = [
  "dungeon synth",
  "yacht rock",
  "shoegaze",
  "cumbia sonidera",
  "vaporwave",
  "math rock",
  "phonk",
  "new jack swing",
  "riot grrrl",
  "tropicalia"
];

const PLACEHOLDER_TRACKS = [
  { title: "Wolf and Raven", artist: "Winterfylleth Hall" },
  { title: "Torchlit Keep", artist: "Moss and Mirrorlake" },
  { title: "Barrow Wind", artist: "Ashfall Keep" }
];

export default function App() {
  const [mode, setMode] = useState("wild");
  const [currentGenre, setCurrentGenre] = useState(GENRES[0]);
  const [tracks, setTracks] = useState(PLACEHOLDER_TRACKS);
  const [isConnected, setIsConnected] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      setIsConnected(true);
      setCheckingAuth(false);
      // strip the query param so refreshing doesn't re-trigger this branch
      window.history.replaceState({}, "", "/");
    } else {
      fetch("/api/auth/status")
        .then((res) => res.json())
        .then((data) => {
          setIsConnected(data.authenticated);
          setCheckingAuth(false);
        })
        .catch(() => setCheckingAuth(false));
    }
  }, []);

  function handleSettled(genre) {
    setCurrentGenre(genre);
    // TODO: replace with a real call once the backend is wired up, e.g.
    // fetch(`/api/tracks?genre=${encodeURIComponent(genre)}&mode=${mode}`)
    //   .then((res) => res.json())
    //   .then((data) => setTracks(data.tracks));
  }

  function handleSave() {
    // TODO: POST to /api/playlists to create + populate a Spotify playlist
    // for the authenticated user with the current `tracks` and `currentGenre`.
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-[20px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[15px] font-medium">Genre Roulette</span>
            <i className="ti ti-history text-lg text-neutral-500" aria-hidden="true"></i>
          </div>

          {checkingAuth ? (
            <p className="text-xs text-neutral-400 text-center mb-4">
              Checking Spotify connection...
            </p>
          ) : isConnected ? (
            <div className="flex items-center justify-center gap-2 mb-4 text-sm text-green-700">
              <i className="ti ti-circle-check" aria-hidden="true"></i>
              <span>Connected to Spotify</span>
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="block w-full text-center py-2.5 mb-4 text-sm font-medium bg-green-600 text-white rounded-lg"
              target="_blank"
            >
              Connect Spotify
            </a>
          )}

          <div className="flex bg-surface border border-neutral-200 rounded-lg p-[3px] mb-5">
            <button
              onClick={() => setMode("wild")}
              className={
                "flex-1 text-sm py-2 rounded-md " +
                (mode === "wild" ? "bg-neutral-900 text-white" : "text-neutral-500")
              }
            >
              Wild card
            </button>
            <button
              onClick={() => setMode("adjacent")}
              className={
                "flex-1 text-sm py-2 rounded-md " +
                (mode === "adjacent" ? "bg-neutral-900 text-white" : "text-neutral-500")
              }
            >
              Adjacent
            </button>
          </div>

          <ReelCard genres={GENRES} onSettled={handleSettled} />

          <div className="flex flex-col gap-1.5 mt-6">
            {tracks.map((track, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 py-2 px-1 border-b border-neutral-200 last:border-none"
              >
                <div className="w-8 h-8 rounded bg-surface flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate m-0">{track.title}</p>
                  <p className="text-xs text-neutral-500 m-0">{track.artist}</p>
                </div>
                <i className="ti ti-player-play text-neutral-500" aria-hidden="true"></i>
              </div>
            ))}
            <p className="text-xs text-neutral-400 text-center mt-1">17 more tracks</p>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-[11px] text-sm font-medium bg-transparent text-neutral-900 border border-neutral-300 rounded-lg mt-4 flex items-center justify-center gap-2"
          >
            <i className="ti ti-device-floppy" aria-hidden="true"></i>
            <span>Save to Spotify</span>
          </button>
        </div>
        <p className="text-xs text-neutral-400 text-center mt-3">
          Currently spinning: {currentGenre}
        </p>
      </div>
    </div>
  );
}