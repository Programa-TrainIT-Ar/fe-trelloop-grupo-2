"use client";

import React from "react";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteCardModal: React.FC<Props> = ({ onCancel, onConfirm, isDeleting }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60" style={{ zIndex: 10000 }}>
    <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
      <img src="/assets/icons/alert.png" alt="Alerta" className="w-[72px] h-[72px] mt-2" />
      <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
        ¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no será reversible.
      </p>
      <div className="flex justify-between mt-auto mb-4 gap-4">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] font-normal leading-[117%] hover:opacity-90 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium leading-[117%] hover:opacity-90 disabled:opacity-60"
        >
          {isDeleting ? "Eliminando..." : "Eliminar tarjeta"}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteCardModal;
