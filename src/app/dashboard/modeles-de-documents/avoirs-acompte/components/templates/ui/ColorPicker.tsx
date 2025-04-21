// File: components/ui/ColorPicker.jsx
import { memo } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function ColorPicker({ label, value, onChange, className = '' }: ColorPickerProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label className="flex items-center w-full">
        <span className="text-gray-700 flex-grow">{label}</span>
        <div className="flex">
          <input 
            type="color" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-8 p-1 border border-gray-300 rounded-l-lg"
          />
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 px-2 py-1 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#E05D5D]"
          />
        </div>
      </label>
    </div>
  );
}

export default memo(ColorPicker);