import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { queryLlama3 } from "../API call/mood_detect";
import { SpotifySongSuggestion } from "../Song";
import { generatePrompt } from "../API call/question_gen";  // Assuming generatePrompt is in apiService.js
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Loader } from "../components";

const Prompt = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [inputSentence, setInputSentence] = useState("");
  const [llamaResponse, setLlamaResponse] = useState(null);
  const [songSuggestion, setSongSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(""); 
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  const handleChange = ({ target: { value } }) => {
    setInputSentence(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCurrentAnimation("hit");

    try {
      const promptResponse = await generatePrompt(inputSentence);
      setGeneratedPrompt(promptResponse);

      const response = await queryLlama3(inputSentence);
      setLlamaResponse(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCurrentAnimation("idle");
    }
  };

  useEffect(() => {
    const suggestSong = async () => {
      if (llamaResponse) {
        try {
          const response = await SpotifySongSuggestion(
            llamaResponse.valence,
            llamaResponse.tempo,
            llamaResponse.energy
          );
          setSongSuggestion(response);

          // Navigate to Post component and pass the data
          navigate("/post", {
            state: { songSuggestion: response, generatedPrompt: generatedPrompt }
          });
        } catch (err) {
          setError(err.message);
        }
      }
    };

    suggestSong();
  }, [llamaResponse, generatedPrompt, navigate]);

  return (
    <section className="relative flex lg:flex-row flex-col max-container">
      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">How are you feeling?</h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-7 mt-14"
        >
          <label className="text-black-500 font-semibold">
            Enter your mood or feelings:
            <input
              type="text"
              name="inputSentence"
              className="input"
              placeholder="How are you feeling today?"
              value={inputSentence}
              onChange={handleChange}
              onFocus={() => setCurrentAnimation("walk")}
              onBlur={() => setCurrentAnimation("idle")}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn"
            onFocus={() => setCurrentAnimation("walk")}
            onBlur={() => setCurrentAnimation("idle")}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {/* Display the suggested song based on mood */}
        {songSuggestion && (
          <div style={{ marginTop: "20px" }}>
            <h2>Spotify Song Suggestion</h2>
            <div>
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

      <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <Suspense fallback={<Loader />}>
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Prompt;
