import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Import icons for toggle button


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" bg-gray-800 h-screen p-6">
      {/* Header and Toggle Button for mobile */}
      <div className="flex justify-between items-center md:hidden">
        <button onClick={toggleMenu} className="text-gray-200 focus:outline-none">
          {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu Links */}
      <ul
        className={`${
          isOpen ? 'block' : 'hidden'
        } mt-4 space-y-6 md:mt-0`}
      >
        {[
          { to: '/', label: 'Home' },
          { to: '/play-self', label: 'Play Self' },
          { to: '/play-online', label: 'Play Online' },
          { to: '/play-computer', label: 'Play Computer' },
          { to: '/solve-puzzles', label: 'Solve Puzzles' },
          { to: '/analyse-position', label: 'Analyse Position' },
        ].map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
