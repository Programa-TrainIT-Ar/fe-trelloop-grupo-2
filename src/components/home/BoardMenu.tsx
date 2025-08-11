"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBoardById } from "../../services/boardService";

interface Props {
  onClose: () => void;
  boardId: string;
}

const BoardMenu: React.FC<Props> = ({ onClose, boardId }) => {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEdit = () => {
    router.push(`/edit/${boardId}`);
    onClose();
  };

  const confirmDelete = async () => {
    try {
      await deleteBoardById(boardId);
      setShowConfirmation(false);
      onClose();
      router.refresh();
    } catch (error) {
      alert("Error al eliminar el tablero");
      console.error(error);
    }
  };

  return (
    <>
      <div
        className="absolute top-10 right-0 z-50 w-[223px] h-[123px] rounded-md bg-[#272727] shadow-lg p-4 flex flex-col gap-2 animate-fade-in"
      >
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
        >
          <img src="/assets/icons/edit.png" alt="Editar" className="w-4 h-4" />
          <span className="text-white text-sm font-medium">Editar tablero</span>
        </button>

        <button
          onClick={() => setShowConfirmation(true)}
          className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
        >
          <img src="/assets/icons/trash.png" alt="Eliminar" className="w-4 h-4" />
          <span className="text-white text-sm font-medium">Eliminar tablero</span>
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
            <img
              src="/assets/icons/alert.png"
              alt="Alerta"
              className="w-[72px] h-[72px] mt-2"
            />
            <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
              ¿Estás seguro de que quieres proceder con esta acción? No será reversible.
            </p>
            <div className="flex justify-between mt-auto mb-4 gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] font-normal leading-[117%] hover:opacity-90"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium leading-[117%] hover:opacity-90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default BoardMenu;