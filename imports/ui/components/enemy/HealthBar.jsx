import React from 'react';

export const HealthBar = ({ current, max, name }) => {
  const healthPercentage = (current / max) * 100;
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="health-bar-container mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-800">{name}</span>
      </div>
      <div className="relative w-full bg-red-900 rounded-none h-10 overflow-hidden shadow-md">
        <div
          className={`h-full ${getHealthColor()} transition-all duration-300`}
          style={{ width: `${healthPercentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            style={{ fontFamily: '"Micro 5", monospace' }}
            className="text-white text-3xl leading-none"
          >
            {current}/{max}
          </span>
        </div>
      </div>
    </div>
  );
};
