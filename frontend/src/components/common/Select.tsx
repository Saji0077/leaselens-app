// Select dropdown component for LeaseLens

import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
}

export function Select({
  label,
  options,
  placeholder = 'Select an option',
  error,
  value,
  onChange,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`mb-6 ${className}`}>
      {/* Label */}
      <label
        htmlFor={selectId}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>

      {/* Select field */}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3
            bg-gray-50
            border-2 rounded-xl
            text-gray-900
            appearance-none
            cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            hover:bg-white
            ${error ? 'border-red-500' : 'border-gray-200 hover:border-purple-300'}
          `}
          {...props}
        >
          {/* Placeholder option */}
          <option value="" disabled>
            {placeholder}
          </option>

          {/* Options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
