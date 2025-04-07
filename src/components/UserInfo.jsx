import React from 'react';

const UserInfo = ({ username }) => {
  return (
    <div className="bg-[#2F855A] text-white p-2 rounded-md shadow-md w-[84%] text-center ml-[10px]">
      <span className="block text-sm font-bold">{username}</span>
    </div>
  );
};

export default UserInfo;
