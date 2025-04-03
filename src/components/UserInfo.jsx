import React from 'react';

const UserInfo = ({ username }) => {
  return (
    <div className="text-sm text-gray-600">
      Usuario: <span className="font-bold">{username}</span>
    </div>
  );
};

export default UserInfo;
