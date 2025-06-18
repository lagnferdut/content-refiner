
import React from 'react';
import { ChevronDownIcon } from './icons';

interface SelectDropdownProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  className?: string;
}

const SelectDropdown = <T extends string,>({ 
  id, 
  label, 
  value, 
  options, 
  onChange, 
  className = '' 
}: SelectDropdownProps<T>): React.ReactNode => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="appearance-none block w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md py-2.5 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors duration-150"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-700 text-slate-100">
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default SelectDropdown;
    