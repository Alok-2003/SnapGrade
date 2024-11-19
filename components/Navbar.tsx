"use client"
import React from 'react'

const Navbar = () => {
  return (
    <div >
      

      <nav className="relative h-16 flex items-center justify-center overflow-hidden  p-[1px] focus:outline-none">
      {/* Border Animation */}
      <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)]"></span>
      
      {/* Navbar Content */}
      <span className="relative inline-flex h-full w-full items-center justify-center bg-slate-950 text-white text-xl font-semibold backdrop-blur-3xl">
        Snap Grade
      </span>
    </nav>
    </div>
  )
}

export default Navbar