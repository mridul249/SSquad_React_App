// Loader.js
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="loader border-t-transparent border-4 border-green-500 w-12 h-12 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
