import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-base-100 text-primary text-sm shadow-inner px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} <span className="font-semibold font-lovehouse">Kanade</span>. All rights reserved.
        </p>
        <p className="text-center md:text-right text-xs">
          <span className="cursor-pointer hover:text-blue-500 transition hover:underline">Version 3.0.0</span>
          <span> • </span>
          <a href='https://github.com/ShindouAris/LocketUploader_BE-main.git' className="cursor-pointer hover:text-blue-500 transition hover:underline">API custom v1</a>
          <span className="cursor-pointer ml-2 hidden sm:inline text-secondary hover:underline">• Read more</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
