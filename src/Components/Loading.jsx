import React from "react";
import Navbar from "./NavBar";

/**
 * A reusable loading spinner component.
 * @param {object} props - The component props.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner.
 * @param {string} [props.className=''] - Additional class names to apply to the spinner.
 */
const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="w-full bg-white h-screen flex items-center justify-center">
     
      <div
        className={`
        animate-spin
        rounded-full
        border-solid
        border-gray-200
        border-t-blue-500
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
