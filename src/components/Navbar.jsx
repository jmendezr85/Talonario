import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-emerald-500 text-white shadow">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <a href="/" className="text-xl font-bold">
          <img src='/talonario_2-01.png' alt="Logo" className="h-12 cursor-pointer" />
        </a>

        <button className="md:hidden">
          <svg
            className="w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
