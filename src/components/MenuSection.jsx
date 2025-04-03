import React from 'react';
import { Card } from './Card';

const MenuSection = ({ title, options, onOptionClick }) => {
  return (
    <div className="w-full mt-2 mb-[30px] ml-[10px]">
      <h2 className="text-sm font-bold mb-1 text-black ml-[10px]">{title}</h2>
      {options.map((option, index) => (
        <Card
          key={index}
          icon={option.icon}
          text={option.text}
          onClick={() => onOptionClick(option.text)}
        />
      ))}
    </div>
  );
};

export default MenuSection;
