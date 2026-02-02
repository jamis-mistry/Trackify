import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
