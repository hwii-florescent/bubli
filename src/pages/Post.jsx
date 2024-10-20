import React, { useEffect, useState, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Fox } from "../models";
import useAlert from "../hooks/useAlert";
import { Alert, Loader } from "../components";

import { AuthContext } from "../App";

const Post = () => {
  const formRef = useRef();
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");
  const {user, setUser} = useContext(AuthContext);
  const [coins, setCoins] = useState(0);

  const location = useLocation();
  const { songSuggestion, generatedPrompt, llamaResponse, inputSentence } = location.state || {};

  const [form, setForm] = useState({
    content: "",
    prompt: generatedPrompt || "Write how you feel today",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const getCoinsFromDatabase = async (userEmail) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userEmail}/coins/`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch coin data.");
      }
  
      const coins = await response.json(); 
      return coins[0];  
    } catch (error) {
      console.error("Error fetching coins:", error);
      return 0; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentAnimation("hit");

    if (!user) {
      showAlert({
        show: true,
        text: "You must be logged in to submit a blog.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const jsonString = llamaResponse.replace(/([a-zA-Z0-9_]+):/g, '"$1":').replace(/'/g, '"');
    const llamaResponseJSON = JSON.parse(jsonString);
    console.log(llamaResponseJSON)

    const apiUrl = `http://127.0.0.1:8000/users/${user.email}/activities/`;
    const coinApiUrl = `http://127.0.0.1:8000/users/${user.email}/coins/`;

    const activityData = {
      date: new Date().toISOString().split("T")[0],
      details: {
        prompt: form.prompt,
        answer: form.content,
        mood_answer: inputSentence || "", 
        mood_rating: parseInt(llamaResponseJSON.valence * 10), 
        songId: songSuggestion?.[0]?.id || "", 
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        showAlert({
          show: true,
          text: "Blog submitted successfully! 🎉",
          type: "success",
        });
       
      const currentCoinsData = await getCoinsFromDatabase(user.email); 
      const updatedCoins = currentCoinsData + 1;

      const coinResponse = await fetch(`${coinApiUrl}?coins=${updatedCoins}`, {
        method: "PUT",
      });

      if (coinResponse.ok) {
        setCoins(updatedCoins); 
      }
      } else {
        showAlert({
          show: true,
          text: "Failed to submit blog. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      showAlert({
        show: true,
        text: "An error occurred. Please try again later.",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setCurrentAnimation("idle");

      setForm({
        content: "",
        prompt: generatedPrompt || "",
      });

      setTimeout(() => {
        hideAlert();
      }, 3000);
    }
  };

  return (
    <section className='relative flex lg:flex-row flex-col max-container'>
      {alert.show && <Alert {...alert} />}
      <div className='flex-1 min-w-[50%] flex flex-col'>
        <h1 className='head-text'>Write Your Blog</h1>
        {user ? (
          <p>Welcome, {user.email}</p>
        ) : (
          <p>Please log in to submit a blog.</p>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='w-full flex flex-col gap-7 mt-14'
        >
          <label className='text-black-500 font-semibold'>
            Prompt
            <textarea
              name='prompt'
              className='textarea'
              rows='3'
              disabled
              value={form.prompt}
            />
          </label>

          <label className='text-black-500 font-semibold'>
            Content
            <textarea
              name='content'
              rows='8'
              className='textarea'
              placeholder='Write your thoughts here...'
              required
              value={form.content}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <button
            type='submit'
            disabled={loading || !user}
            className='btn'
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {loading ? "Submitting..." : "Submit Blog"}
          </button>
        </form>
      </div>

      <div className='lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]'>
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
        >
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.629, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Post;
