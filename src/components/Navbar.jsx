
import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { AiOutlineHome } from "react-icons/ai"; 
import { FaCoins } from "react-icons/fa"; 
import { AuthContext } from "../App";
import { apiUrl } from "../constant";

const Navbar = () => {
  const {user, setUser} = useContext(AuthContext);
  const [coins, setCoins] = useState(0);  // State to track coins
  const [ssong, setSong] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); 

      if (currentUser) {
        getCoinsFromDatabase(user.email);
        getCurrentSong(user.email);
      }
    });

    return () => unsubscribe(); 
  }, [user]); 


  const getCurrentSong = async (userEmail) => {
    try {
      const response = await fetch(`${apiUrl}/users/${userEmail}/activities`);
      if (!response.ok) {
        throw new Error("Failed to fetch coin data.");
      }
      const ssong = await response.json();
      console.log(ssong);
      setSong(ssong[0].songId);
      return ssong[0].songId;
    } catch (error) {
      console.error("error", error);
      return 0;
    }
  }

  const getCoinsFromDatabase = async (userEmail) => {
    try {
      const response = await fetch(`${apiUrl}/users/${userEmail}/coins/`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch coin data.");
      }

      const coins = await response.json(); 
      setCoins(coins[0]);
      return coins[0];  
    } catch (error) {
      console.error("Error fetching coins:", error);
      return 0; 
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCoins(0); 
      setSong('');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header className='header bg-white-500 shadow-lg py-4 px-6 w-full mb-0'>
        {/* Home Icon */}
        <NavLink to='/' className="text-black hover:text-blue-600 text-3xl">
          <AiOutlineHome />
        </NavLink>
        {ssong && (
          <div className="mt-4">
          <iframe
            src={`https://open.spotify.com/embed/track/${ssong}`}
            width="300"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            title="Spotify Player"
          ></iframe>
        </div>
        )}
        
        {/* Coin Tracker Icon */}
        <div className="flex items-center gap-2 text-xl text-white">
          <FaCoins className="text-yellow-500" />
          <span className="text-black">{coins}</span>  {/* Display the number of coins */}
        </div>
  
        <nav className='flex gap-7 font-medium'>
          {!user ? (
            <>
              <NavLink to='/login' className={({ isActive }) => (isActive ? "text-blue-600" : "text-black")}>
                Login
              </NavLink>
              <NavLink to='/register' className={({ isActive }) => (isActive ? "text-blue-600" : "text-black")}>
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="text-black font-medium">Welcome, {user.username || user.email}</span>
              <button
                onClick={handleLogout}
                className='text-black font-medium hover:text-blue-600'
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;