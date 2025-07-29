import React, { useRef, useEffect } from 'react';

export default function MoreMenu({ options, onClose }) {
  const menuRef = useRef();
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);
  return (
    <div
      ref={menuRef}
      className="absolute z-30 right-0 bottom-0 bg-white border rounded shadow-lg min-w-[110px] py-2"
    >
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={opt.onClick}
          className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}