
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 bg-secondary/30 text-center">
      <div className="container mx-auto">
        <p className="text-sm text-foreground/70">
          &copy; {new Date().getFullYear()} FaceRecg - Advanced Emotion Recognition
        </p>
        <p className="text-xs text-foreground/50 mt-1">
          Privacy-focused: All processing is done locally in your browser
        </p>
      </div>
    </footer>
  );
};

export default Footer;
