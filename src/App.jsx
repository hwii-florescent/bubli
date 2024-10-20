import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Footer, Navbar } from "./components";
import { Home, Register, Login, Post, Prompt } from "./pages";

const App = () => {
  return (
    <main className='bg-slate-300/20'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/*'
            element={
              <>
                <Routes>
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/post' element={<Post />} />
                  <Route path='/prompt' element={<Prompt />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
