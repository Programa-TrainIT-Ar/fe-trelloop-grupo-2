import React from "react";
import { useRouter } from "next/navigation";
import { deleteBoardById } from "../../services/boardService";

interface Props {
  onClose: () => void;
  boardId: string;
}

const BoardMenu: React.FC<Props> = ({ onClose, boardId }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/Edit");
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteBoardById(boardId);
      onClose();
      router.refresh(); // para actualizar los datos
    } catch (error) {
      alert("Error al eliminar el tablero");
      console.error(error);
    }
  };

  return (
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
        onClick={handleDelete}
        className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
      >
        <img src="/assets/icons/trash.png" alt="Eliminar" className="w-4 h-4" />
        <span className="text-white text-sm font-medium">Eliminar tablero</span>
      </button>

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
    </div>
  );
};

export default BoardMenu;