// components/Spinner.jsx
import React from 'react';

export default function Spinner({ size = 6, message = '로딩 중...', color = 'text-gray-600' }) {
  return (
    <div className={`flex justify-center items-center gap-2 ${color}`}>
      <div className={`w-${size} h-${size} border-4 border-t-transparent border-gray-400 rounded-full animate-spin`}></div>
      {message && <span className="text-sm">{message}</span>}
    </div>
  );
}
