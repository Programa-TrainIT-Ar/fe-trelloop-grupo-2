'use client';

import React from 'react';
import { ActionsProps } from '../types'; 

const Actions: React.FC<ActionsProps> = ({ onCancel, onSave }) => {
  return (
    <div className='flex justify-between w-[575px] mt-[20px]'>
      <button
        className="text-[16px] text-[#6a5fff] border border-[#6a5fff] rounded-[8px] text-center w-[279px] h-[40px]"
        onClick={onCancel}
      >
        Cancelar edición
      </button>
      <button
        className="text-[16px] text-white bg-[#6a5fff] rounded-[8px] text-center w-[279px] h-[40px]"
        onClick={onSave}
      >
        Actualizar tablero
      </button>
    </div>
  );
};

export default Actions;
