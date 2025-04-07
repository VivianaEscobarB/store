import React from 'react';

export const Card = ({ icon, text, onClick }) => {
  return (
    <div
      className="flex items-center bg-[#D1BBFF] text-black p-1 rounded-lg shadow-md mb-[5px] w-[80%] hover:bg-[#BFA3E6] transition-colors cursor-pointer transform translate-x-2"
      onClick={onClick}
    >
      <span className="text-sm mr-1">{icon}</span>
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
};
