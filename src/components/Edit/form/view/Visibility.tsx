import { ChangeEvent } from 'react';
import { VisibilityProps } from '../types';

const Visibility = ({ value, onChange }: VisibilityProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value as 'PRIVATE' | 'PUBLIC';
    onChange(selected);
  };

  return (
    <div className="space-y-6">
      {/* Opción Privado */}
      <label className="flex items-start space-x-3 cursor-pointer group">
        <div className="flex-shrink-0 mt-0.5">
          <input
            type="radio"
            value="PRIVATE"
            checked={value === 'PRIVATE'}
            onChange={(e) => onChange(e.target.value as 'PRIVATE')}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${value === 'PRIVATE'
              ? 'border-[#6A5FFF] bg-[#6A5FFF]'
              : 'border-gray-500 group-hover:border-gray-400'
            }`}>
            {value === 'PRIVATE' && (
              <div className="w-1.5 h-1.5 bg-[#6A5FFF] rounded-full"></div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Icono candado */}
          <div className="w-6 h-6 rounded-md bg-[#2B2B2B] border border-[#404040] flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="text-white text-sm">
            <p>Privado</p>
            <p>
              (Solo tú y los miembros invitados pueden verlo)
            </p>
          </div>
        </div>
      </label>

      {/* Opción Público */}
      <label className="flex items-start space-x-3 cursor-pointer group">
        <div className="flex-shrink-0 mt-0.5">
          <input
            type="radio"
            value="PUBLIC"
            checked={value === 'PUBLIC'}
            onChange={(e) => onChange(e.target.value as 'PUBLIC')}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${value === 'PUBLIC'
              ? 'border-[#6A5FFF] bg-[#6A5FFF]'
              : 'border-gray-500 group-hover:border-gray-400'
            }`}>
            {value === 'PUBLIC' && (
              <div className="w-1.5 h-1.5 bg-[#6A5FFF] rounded-full"></div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Icono mundo */}
          <div className="w-6 h-6 rounded-md bg-[#2B2B2B] border border-[#404040] flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="text-white text-sm">
            <p>Público</p>
            <p>
              (Cualquier miembro del equipo puede acceder)
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default Visibility;
