import React from 'react';
import logoImage from '../assets/imagenLogin.png';

const Logo = () => {
  return (
    <div className="flex justify-center items-center mb-4">
      <img src={logoImage} alt="Logo" className="w-245px h-111px" />
    </div>
  );
};

export default Logo;