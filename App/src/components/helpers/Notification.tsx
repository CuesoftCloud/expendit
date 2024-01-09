"use client"
import React from 'react';

const Notification = ({ msg, type }: { msg: string, type: string }) => {
  return (
    <span 
      className={`
        px-6 py-4 border-b-4 bg-grayTheme
        md:text-base sm:text-sm text-xs
        fixed z-20 top-10 right-10 shadow-md
        ${type === "error" ? "text-red-600" : "text-green-600"}
       border-black rounded-b-md fadeInOut`
      }
    >
      {msg}
    </span>
  )
}

export default Notification