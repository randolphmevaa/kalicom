// File: components/ui/Checkbox.tsx
import { memo } from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  defaultChecked?: boolean; // Added to match usage in FormattingStep
}

function Checkbox({ 
  label, 
  checked, 
  onChange, 
  id, 
  className = '',
  // ignoring defaultChecked since this is a controlled component
}: CheckboxProps) {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <input 
        type="checkbox" 
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" 
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

export default memo(Checkbox);