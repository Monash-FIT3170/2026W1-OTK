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
        <span className="text-xs text-gray-600">
          {current}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-md">
        <div
          className={`h-full ${getHealthColor()} transition-all duration-300 flex items-center justify-center`}
          style={{ width: `${healthPercentage}%` }}
        >
          {healthPercentage > 15 && (
            <span className="text-xs font-bold text-white">
              {Math.round(healthPercentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
