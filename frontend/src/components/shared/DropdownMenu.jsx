import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';

export const DropdownMenu = ({ label, options, selected, onChange }) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div className="relative mt-2">
          {/* 1. UPDATED Label classes */}
          <Listbox.Label 
            className={`absolute -top-2.5 left-3 z-10 bg-white px-1 text-xs font-medium 
                        transition-colors 'text-blue-600' : 'text-gray-700'}`}
          >
            {label}
          </Listbox.Label>
          <Listbox.Button 
            className="relative w-full cursor-default rounded-md border border-gray-300 bg-white 
                       py-2.5 pl-3 pr-10 text-left text-base shadow-sm 
                       focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {/* 2. UPDATED text color logic to show placeholder style */}
            <span 
              className={`block truncate ${selected ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {selected || `Select ${label.toLowerCase()}`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {option}
                      </span>

                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                            active ? 'text-white' : 'text-blue-600'
                          }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};