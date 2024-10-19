import { NavLink } from "react-router-dom";

import { logo } from "../assets/images";

const Navbar = () => {
  return (
    <header className='header'>
      <NavLink to='/'>
        <img src={logo} alt='logo' className='w-18 h-18 object-contain' />
      </NavLink>
      <nav className='flex text-lg gap-7 font-medium'>
        <NavLink to='/login' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
          Login
        </NavLink>
        <NavLink to='/register' className={({ isActive }) => isActive ? "text-blue-600" : "text-black"}>
          Register
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
