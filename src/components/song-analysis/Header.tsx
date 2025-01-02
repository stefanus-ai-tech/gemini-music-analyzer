import React from 'react';

const Header = () => {
  return (
    <div className="text-center space-y-4 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D6BCFA] to-[#8B5CF6]">
        Music Analysis
      </h1>
      <p className="text-[#E5DEFF] text-lg md:text-xl">
        Upload your song and let AI analyze its essence
      </p>
    </div>
  );
};

export default Header;