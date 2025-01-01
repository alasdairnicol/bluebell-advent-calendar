"use client"

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const STORAGE_KEY = 'advent-calendar-open-windows';
const POSITION_KEY = 'advent-calendar-positions';

const Snowflake = ({ delay, duration, left }) => (
  <div
    className="absolute text-white text-opacity-80 animate-fall pointer-events-none"
    style={{
      left: `${left}%`,
      animation: `fall ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      top: '-20px',
    }}
  >
    ❄
  </div>
);

const SnowEffect = () => {
  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          left={flake.left}
          delay={flake.delay}
          duration={flake.duration}
        />
      ))}
    </div>
  );
};

const AdventCalendar = () => {
  const [openWindows, setOpenWindows] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing stored windows:', e);
        return new Set();
      }
    }
    return new Set();
  });

  const [positions, setPositions] = useState(() => {
    const saved = localStorage.getItem(POSITION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored positions:', e);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (!positions) {
      const numbers = Array.from({ length: 24 }, (_, i) => i + 1);
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      setPositions(numbers);
      localStorage.setItem(POSITION_KEY, JSON.stringify(numbers));
    }
  }, [positions]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  const isWindowAvailable = (day) => {
    return currentMonth === 11 && currentDay >= day;
  };
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...openWindows]));
  }, [openWindows]);
  
  const handleWindowClick = (day) => {
    if (isWindowAvailable(day)) {
      setOpenWindows(prev => new Set([...prev, day]));
    }
  };
  
  const clearAllWindows = () => {
    setOpenWindows(new Set());
    localStorage.removeItem(STORAGE_KEY);
    const numbers = Array.from({ length: 24 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setPositions(numbers);
    localStorage.setItem(POSITION_KEY, JSON.stringify(numbers));
  };
  
  if (!positions) return null;

  return (
    <Card className="p-6 bg-green-100 max-w-4xl mx-auto relative">
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            100% {
              transform: translateY(calc(100vh)) rotate(360deg);
            }
          }
          .animate-fall {
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
        `}
      </style>
      
      <SnowEffect />
      
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-2xl font-bold text-center text-green-800">Bluebell Advent Calendar</h1>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-green-700">
            Today: {currentMonth === 11 ? `December ${currentDay}` : 'Not December yet!'}
          </div>
          <button 
            onClick={clearAllWindows}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset Calendar
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 relative">
        {positions.map((day, index) => {
          const isAvailable = isWindowAvailable(day);
          const imageUrl = `images/days/${day}.jpeg`;

          return (
            <div 
              key={index}
              onClick={() => !openWindows.has(day) && handleWindowClick(day)}
              className={`
                relative aspect-square transition-transform duration-300
                ${!openWindows.has(day) && isAvailable ? 'cursor-pointer' : ''}
                ${openWindows.has(day) ? 'rotate-y-180' : isAvailable ? 'hover:scale-105' : 'cursor-not-allowed opacity-70'}
              `}
            >
              {openWindows.has(day) ? (
                <div className="w-full h-full bg-white rounded-lg shadow-lg p-2 flex items-center justify-center">
                  <a 
                    href={imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img 
                      src={imageUrl}
                      alt={`Cat ${day}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </a>
                </div>
              ) : (
                <div className={`
                  w-full h-full rounded-lg shadow-lg p-2 flex items-center justify-center
                  ${isAvailable ? 'bg-red-600' : 'bg-gray-400'}
                `}>
                  <span className="text-xl font-bold text-white">{day}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-center mt-4 text-green-700 relative">
        {currentMonth === 11 ?
          (currentDay < 24 ?
            currentDay === 1
              ? "Find and open door 1. Come back each day for a new picture of Bluebell!"
              : `Find and open doors 1-${currentDay}. Come back each day for a new picture of Bluebell!`
            : "All advent calendar doors are now available!")
          : "The advent calendar will be available in December!"}
      </p>
    </Card>
  );
};

export default AdventCalendar;
