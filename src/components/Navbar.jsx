import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { logo } from "../assets/images";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth"; 

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className='header'>
      <NavLink to='/'>
        <img src={logo} alt='logo' className='w-18 h-18 object-contain' />
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium'>
        {!user ? (
          <>
            <NavLink to='/login' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
              Login
            </NavLink>
            <NavLink to='/register' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
              Register
            </NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className='text-black font-medium hover:text-blue-600'
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;