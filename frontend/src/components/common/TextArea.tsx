// TextArea component for LeaseLens

import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: string;
}

export function TextArea({
  label,
  helperText,
  error,
  id,
  className = '',
  ...props
}: TextAreaProps) {
  const textAreaId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`mb-6 ${className}`}>
      {/* Label */}
      <label
        htmlFor={textAreaId}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>

      {/* TextArea field */}
      <textarea
        id={textAreaId}
        className={`
          w-full px-4 py-3
          bg-gray-50
          border-2 rounded-xl
          text-gray-900
          placeholder-gray-400
          resize-y
          min-h-[200px]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          hover:bg-white
          ${error ? 'border-red-500' : 'border-gray-200 hover:border-purple-300'}
        `}
        {...props}
      />

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
