import React, { useState } from 'react';
import { TagsProps } from '../types';

const Tags = ({ tags, onAdd, onDelete }: TagsProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        onAdd(newTag);
      }
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-white font-medium pt-1">
        Etiquetas
      </label>
      <div className="relative w-[575px]">
        <input
          type="text"
          placeholder="Escribe un nombre de etiqueta para crearla..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl pl-2 pr-10 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>

      <div className='tags mt-[8px] flex flex-wrap'>
        {tags.map((tag) => (
          <div
            key={tag}
            className='tag w-[120px] h-[24px] border rounded-[16px] flex flex-row items-center justify-evenly mr-[10px] mb-[8px]'
          >
            <div className="tag-icon flex items-center">
              <svg className='size-[18px]' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 4.25H12C12.3362 4.25 12.6359 4.41506 12.8145 4.66797V4.66895L15.8857 8.99902L12.8145 13.3232V13.3242C12.6328 13.5815 12.331 13.75 12 13.75H3.75C3.48478 13.75 3.23051 13.6446 3.04297 13.457C2.85543 13.2695 2.75 13.0152 2.75 12.75V5.25C2.75 4.98478 2.85543 4.73051 3.04297 4.54297C3.23051 4.35543 3.48478 4.25 3.75 4.25Z" stroke="#979797" />
              </svg>
            </div>
            <div className='tag-name flex items-center text-[12px] font-[500] text-white'>
              {tag}
            </div>
            <button className="tag-action flex items-center text-white" onClick={() => onDelete(tag)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[16px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
