import React, { useState } from 'react';
import { ColorTheme } from '../../lib/theme/types';
import ColorPicker from './ColorPicker';

interface GradientStop {
  color: string;
  position: number;
}

interface GradientBuilderProps {
  gradient: ColorTheme['gradients'][0];
  onChange: (gradient: ColorTheme['gradients'][0]) => void;
}

export default function GradientBuilder({ gradient, onChange }: GradientBuilderProps) {
  const [selectedStop, setSelectedStop] = useState<number>(0);

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], ...updates };
    onChange({ ...gradient, stops: newStops });
  };

  const addStop = () => {
    const newStops = [...gradient.stops, { color: '#ffffff', position: 100 }];
    onChange({ ...gradient, stops: newStops });
    setSelectedStop(newStops.length - 1);
  };

  const removeStop = (index: number) => {
    if (gradient.stops.length <= 2) return; // Maintain minimum 2 stops
    const newStops = gradient.stops.filter((_, i) => i !== index);
    onChange({ ...gradient, stops: newStops });
    setSelectedStop(0);
  };

  return (
    <div className="space-y-4">
      <div className="h-8 rounded-lg" style={{
        background: `linear-gradient(to right, ${
          gradient.stops.map(stop => `${stop.color} ${stop.position}%`).join(', ')
        })`
      }} />
      
      <div className="relative h-8">
        {gradient.stops.map((stop, index) => (
          <button
            key={index}
            className={`absolute w-4 h-4 -mt-2 -ml-2 rounded-full border-2 ${
              selectedStop === index ? 'border-blue-500' : 'border-white'
            } shadow-lg`}
            style={{
              backgroundColor: stop.color,
              left: `${stop.position}%`,
              top: '50%'
            }}
            onClick={() => setSelectedStop(index)}
          />
        ))}
      </div>

      {selectedStop !== null && (
        <div className="space-y-4">
          <ColorPicker
            color={gradient.stops[selectedStop].color}
            onChange={(color) => updateStop(selectedStop, { color })}
            label="Stop Color"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={gradient.stops[selectedStop].position}
              onChange={(e) => updateStop(selectedStop, { position: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => removeStop(selectedStop)}
              disabled={gradient.stops.length <= 2}
              className="text-red-600 disabled:text-gray-400"
            >
              Remove Stop
            </button>
            <button
              onClick={addStop}
              className="text-blue-600"
            >
              Add Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}