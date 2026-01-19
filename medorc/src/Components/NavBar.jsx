import React from "react";

export default function NavBar() {
  return (
    <div
      className="sticky top-0 z-50 h-20 w-full px-2 flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Logobg.png')" }}
    >
      <div className="w-full flex items-center justify-center bg-gray-100 rounded-full px-10 py-1 shadow-md">
        <img src="/Logo.png" width="150px" alt="" />
      </div>
    </div>
  );
}
