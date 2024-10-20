// App.jsx
import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // Adjust the path to your firebase configuration
import { Footer, Navbar } from "./components";
import { Home, Register, Login, Post, Prompt, FunUI } from "./pages";
import ProtectedRoute from "./components/ProtectedRoute"; // Adjust the path

// Create a context for authentication
export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <main className='bg-slate-300/20'>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/funui' element={<FunUI />} />
            <Route
              path='/post'
              element={
                <ProtectedRoute>
                  <Post />
                </ProtectedRoute>
              }
            />
            <Route
              path='/prompt'
              element={
                <ProtectedRoute>
                  <Prompt />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </main>
    </AuthContext.Provider>
  );
};

export default App;
