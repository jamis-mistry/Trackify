import React from "react";

const Input = ({ label, className = "", rightElement, ...props }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        <input
          {...props}
          className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-colors ${props.inputClassName || ''} ${rightElement ? 'pr-10' : ''}`}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;