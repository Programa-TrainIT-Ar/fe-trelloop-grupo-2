'use client';

import { useState, useEffect } from 'react';

interface ReminderSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ReminderSelect({ value, onChange }: ReminderSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Ninguno',
    '1 día antes',
    '2 días antes',
    '3 días antes',
  ]);

  const getSelectedText = (val: number): string => {
    if (val === 0) return 'Ninguno';
    const option = options.find(o => parseInt(o) === val);
    return option || `${val} días antes`;
  };

  const [selected, setSelected] = useState<string>(getSelectedText(value));

  useEffect(() => {
    setSelected(getSelectedText(value));
  }, [value, options]);

  const handleSelect = (option: string) => {
    let numericValue = 0;
    if (option === 'Ninguno') {
      numericValue = 0;
    } else {
      const match = option.match(/\d+/);
      if (match) {
        numericValue = parseInt(match[0], 10);
      }
    }
    onChange(numericValue);
    setSelected(option);
    setIsOpen(false);
  };

  const handleAddOption = () => {
    const numericValue = parseInt(customValue, 10);
    if (!isNaN(numericValue) && numericValue > 0) {
      const newOption = `${numericValue} días antes`;
      if (!options.includes(newOption)) {
        setOptions([...options, newOption]);
      }
      onChange(numericValue);
      setSelected(newOption);
      setCustomValue('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="font-poppins w-full p-2 rounded-lg outline-none bg-[#2a2a2a] text-gray-400 border border-[#3a3a3a] text-left relative flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selected}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-xl bg-[#2a2a2a] py-1 shadow-lg border border-[#3a3a3a] max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-2 cursor-pointer text-white font-poppins transition-colors duration-100 ${
                selected === option ? 'bg-[#6a5fff]' : 'hover:bg-[#3a3a3a]'
              }`}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-200 ${
                    selected === option ? 'bg-[#6a5fff] border-[#6a5fff]' : ''
                  }`}>
                  {selected === option && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="ml-2">{option}</span>
              </div>
            </div>
          ))}
          <div>
            <div className="relative flex items-center m-2">
              <input
                type="number"
                placeholder="Agregar días"
                value={customValue}
                onChange={e => setCustomValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleAddOption();
                  }
                }}
                className="w-full p-2 rounded-xl outline-none bg-[#2a2a2a] text-white focus:ring-2 focus:ring-[#6a5fff]"
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="ml-2 flex-shrink-0 p-2 rounded-full hover:bg-[#5A4FEF] text-white transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
