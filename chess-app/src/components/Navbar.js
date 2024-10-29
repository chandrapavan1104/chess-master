import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="w-full md:w-1/4 bg-gray-200 text-black p-4">
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/"
            exact
            className="block px-4 py-2 rounded-lg text-lg hover:bg-blue-500 hover:text-white transition"
            activeClassName="bg-blue-600 text-white font-semibold"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/play-self"
            className="block px-4 py-2 rounded-lg text-lg hover:bg-blue-500 hover:text-white transition"
            activeClassName="bg-blue-600 text-white font-semibold"
          >
            Play Self
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/play-online"
            className="block px-4 py-2 rounded-lg text-lg hover:bg-blue-500 hover:text-white transition"
            activeClassName="bg-blue-600 text-white font-semibold"
          >
            Play Online
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/play-computer"
            className="block px-4 py-2 rounded-lg text-lg hover:bg-blue-500 hover:text-white transition"
            activeClassName="bg-blue-600 text-white font-semibold"
          >
            Play Computer
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/solve-puzzles"
            className="block px-4 py-2 rounded-lg text-lg hover:bg-blue-500 hover:text-white transition"
            activeClassName="bg-blue-600 text-white font-semibold"
          >
            Solve Puzzles
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analyse-position"
            className="block px-4 py-2 rounded-lg text-lg hover:bg-blue-500 hover:text-white transition"
            activeClassName="bg-blue-600 text-white font-semibold"
          >
            Analyse Position
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
