import React from 'react';

const ReusableCard = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {icon && <div className="text-2xl text-gray-700 mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ReusableCard;
