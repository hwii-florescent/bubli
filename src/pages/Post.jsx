import React from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

import { Fox } from "../models";
import useAlert from "../hooks/useAlert";
import { Alert, Loader } from "../components";

const Post = () => {
  const formRef = useRef();
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  // Extract songSuggestion and generatedPrompt from useLocation
  const location = useLocation();
  const { songSuggestion, generatedPrompt } = location.state || {};

  // Initialize the form state with the generatedPrompt value
  const [form, setForm] = useState({
    content: "",
    prompt: generatedPrompt || "Write how you feel today", // default value in case it's undefined
  });

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setCurrentAnimation("hit");

    // Simulating submission process
    setTimeout(() => {
      setLoading(false);
      showAlert({
        show: true,
        text: "Blog submitted successfully! 🎉",
        type: "success",
      });

      setTimeout(() => {
        hideAlert();
        setCurrentAnimation("idle");

        // Reset form and set prompt back to generatedPrompt
        setForm({
          content: "",
          prompt: generatedPrompt || "", // reset to the passed prompt
        });
      }, 3000);
    }, 2000);
  };

  return (
    <section className='relative flex lg:flex-row flex-col max-container'>
      {alert.show && <Alert {...alert} />}

      <div className='flex-1 min-w-[50%] flex flex-col'>
        <h1 className='head-text'>Write Your Blog</h1>

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
            disabled={loading}
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
