import React, { useState, useEffect } from 'react';

export const FloatingLabelInput = ({ id, label, type = 'text', value, onChange, as: Component = 'input', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));

  // Update hasValue if the prop changes
  useEffect(() => {
    setHasValue(Boolean(value));
  }, [value]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(Boolean(e.target.value));
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    if (onChange) {
      onChange(e);
    }
  };

  const isActive = isFocused || hasValue;

  return (
    // We add mt-2 to give the floating label space
    <div className="relative w-full mt-2">
      <label
        htmlFor={id}
        className={`absolute left-3 transform transition-all duration-200 ease-out origin-[0]
                    
                    ${/* 1. This controls POSITION (cutout vs placeholder) */
                      isActive 
                        ? '-top-2.5 bg-white px-1 text-xs' 
                        : 'top-2.5 text-base pointer-events-none'
                    }
                    
                    ${/* 2. This controls COLOR (blue vs gray) */
                      isFocused
                        ? 'text-blue-600' // Blue when focused
                        : (isActive ? 'text-gray-700' : 'text-gray-500') // Gray when blurred (with or without value)
                    }
                `}
      >
        {label}
      </label>
      
      <Component
        {...props}
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=" " // Use a space so the placeholder is invisible but present
        className={`w-full rounded-md border border-gray-300 px-3 py-2.5 text-base text-gray-900 
                    placeholder-transparent 
                    focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                    ${Component === 'textarea' ? 'min-h-[100px] resize-y pt-4' : ''} 
                   `} 
      />
    </div>
  );
};