// src/components/Toast.jsx
import React, { useEffect } from 'react';
import { FiX, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-xl" />;
      case 'error':
        return <FiXCircle className="text-xl" />;
      default:
        return <FiInfo className="text-xl" />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 ${getColorClasses()} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 min-w-[300px] animate-slide-in`}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-80 transition-opacity">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;