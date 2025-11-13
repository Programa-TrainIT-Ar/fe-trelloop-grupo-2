import React from "react";

interface DeleteCardButtonProps {
  boardId: string;
  listId: string;
  card: { id: number; title: string; description?: string };
  isBoardOwner?: boolean;
  isBoardMember?: boolean;
  getBoardLists: () => Promise<void>;
  onMenuClose?: () => void;
  onDeleteClick: () => void;
}

const DeleteCardButton: React.FC<DeleteCardButtonProps> = ({
  boardId,
  listId,
  card,
  isBoardOwner = false,
  isBoardMember = false,
  getBoardLists,
  onMenuClose,
  onDeleteClick,
}) => {
  const canDelete = isBoardOwner || isBoardMember;

  const openConfirm = () => {
    if (!canDelete) {
      alert("No tienes permisos para eliminar esta tarjeta");
      return;
    }
    onMenuClose?.();
    onDeleteClick();
  };

  return (
    <button
      onClick={openConfirm}
      className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
    >
      <img src="/assets/icons/trash.png" alt="Eliminar" className="w-4 h-4" />
      <span className="text-white text-sm font-medium">Eliminar tarjeta</span>
    </button>
  );
};

export default DeleteCardButton;