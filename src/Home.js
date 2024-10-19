import React, { useState } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { queryLlama3 } from "./API call/mood_detect";
import { SpotifySongSuggestion } from "./Song";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [inputSentence, setInputSentence] = useState("");
  const [llamaResponse, setLlamaResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [songSuggestion, setSongSuggestion] = useState(null);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await queryLlama3(inputSentence);
      setLlamaResponse(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  useEffect(() => {
    const suggestSong = async () => {
      if (llamaResponse) {
        // Check if llamaResponse is not null or undefined
        try {
          const response = await SpotifySongSuggestion(
            llamaResponse.valence,
            llamaResponse.tempo,
            llamaResponse.energy
          );
          setSongSuggestion(response);
          console.log(response);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    suggestSong(); // Call the function whenever useEffect is triggered
  }, [llamaResponse]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 20,
        }}
      >
        <h1>Welcome to the Home Page</h1>
        {/* Logout Button */}
        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            placeholder="How are you feeling today?"
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "300px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>
        )}

        {llamaResponse && (
          <div style={{ marginTop: "20px" }}>
            <h2>Test Llama 3 suggestion</h2>
            <pre>{JSON.stringify(llamaResponse, null, 2)}</pre>
          </div>
        )}
        {songSuggestion && (
          <div style={{ marginTop: "20px" }}>
            <h2>Spotify Song Suggestion</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <iframe
                src={`https://open.spotify.com/embed/track/${songSuggestion[0].id}`}
                width="300"
                height="80"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
