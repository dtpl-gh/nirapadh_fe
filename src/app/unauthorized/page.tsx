// pages/unauthorized.tsx
'use client';
import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-700">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
