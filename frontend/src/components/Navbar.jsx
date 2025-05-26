import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
  };
  return (
    <div className="flex justify-between items-center text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        className="w-44 h-20 cursor-pointer"
        src={assets.logo}
        alt=""
        onClick={() => navigate("/")}
      />
      <ul className="hidden md:flex items-start gap-5 font-medium text-lg">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <button
              onClick={() => navigate("/askai")}
              className="bg-primary text-white py-3 px-6 ml-4 text-md rounded-full font-light hidden md:block"
            >
              Ask AI Recommendation
            </button>
            <img className="w-8 h-10 rounded-full" src={userData.image} />
            <img className="w-2.5" src={assets.dropdown_icon} />
            <div className="absolute top-10 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => navigate("/my-profile")}
                >
                  My Profile
                </p>
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => navigate("/my-appointments")}
                >
                  My Appointments
                </p>
                <p className="hover:text-black cursor-pointer" onClick={logout}>
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white py-3 px-6 ml-4 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
          src={assets.menu_icon}
          className="w-6 md:hidden"
          onClick={() => setShowMenu(true)}
        />

        {/* mobile menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          }  md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center px-5 py-6 justify-between">
            <img src={assets.logo} className="w-44 h-20" />
            <img
              src={assets.cross_icon}
              className="w-6"
              onClick={() => setShowMenu(false)}
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded inline-block"
              to="/"
            >
              <p>HOME</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded inline-block"
              to="/doctors"
            >
              <p>ALL DOCTORS</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded inline-block"
              to="/about"
            >
              <p>ABOUT</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded inline-block"
              to="/contact"
            >
              <p>CONTACT</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded inline-block underline underline-offset-4"
              to="/askai"
            >
              <p>Ask AI Recommendation</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
