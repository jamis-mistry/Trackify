import React from "react";

const Badge = ({ text, color = "gray" }) => {
  const colorClasses = {
    gray: "bg-gray-200 text-gray-800",
    green: "bg-green-200 text-green-800",
    red: "bg-red-200 text-red-800",
    yellow: "bg-yellow-200 text-yellow-800",
    purple: "bg-purple-200 text-purple-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${colorClasses[color] || colorClasses.gray}`}
    >
      {text}
    </span>
  );
};

export default Badge;
