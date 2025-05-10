
import React from 'react';
import { Smile } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-primary/90 to-accent/90 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smile size={32} className="text-white" />
          <h1 className="text-2xl sm:text-3xl font-bold">FaceRecg</h1>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-light">Emotion Recognition Tool</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
