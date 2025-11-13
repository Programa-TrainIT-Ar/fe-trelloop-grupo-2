"use client";
import React, { useState } from "react";
import { deleteListService } from "services/listService";

interface DeleteListButtonProps {
  boardId: string;
  list: { id: number; name: string; cards?: any[] };
  isBoardOwner?: boolean;
  isBoardMember?: boolean;
  getBoardLists: () => Promise<void>;
  onOptimisticDelete?: (listId: number) => void; // ✅ Nuevo callback
}

const DeleteListButton: React.FC<DeleteListButtonProps> = ({
  boardId,
  list,
  isBoardOwner = false,
  isBoardMember = false,
  getBoardLists,
  onOptimisticDelete, // ✅ Recibimos el callback
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasCards = (list.cards?.length || 0) > 0;
  const canDelete = !hasCards || isBoardOwner || isBoardMember;

  const openConfirm = () => {
    if (!canDelete) return;
    setOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await deleteListService({ boardId: Number(boardId), listId: list.id });
      setOpen(false);

      // ✅ Actualización optimista inmediata
      if (onOptimisticDelete) {
        onOptimisticDelete(list.id);
      }

      await getBoardLists(); // Aún sincronizamos con el backend
    } catch (err: any) {
      alert(err?.message || "Error al eliminar la lista");
      console.error(err);
      // En caso de error, resincronizamos
      await getBoardLists();
    } finally {
      setLoading(false);
    }
  };

  const confirmMessage =
    "¿Estás seguro de que deseas eliminar esta lista? Esta acción no será reversible.";

  return (
    <>
      <button
        onClick={openConfirm}
        disabled={!canDelete}
        aria-disabled={!canDelete}
        title={
          canDelete
            ? "Borrar lista"
            : "No puedes borrar: la lista tiene tarjetas y no eres el creador"
        }
        className={`w-[22px] h-[22px] grid place-items-center rounded-[4px] 
  ${canDelete ? "bg-transparent cursor-pointer" : "bg-transparent opacity-50 cursor-not-allowed"}`}
      >
        <img src="/assets/icons/trash.png" alt="Eliminar" className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
            <img
              src="/assets/icons/alert.png"
              alt="Alerta"
              className="w-[72px] h-[72px] mt-2"
            />
            <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
              {confirmMessage}
            </p>
            <div className="flex justify-between mt-auto mb-4 gap-4">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] font-normal leading-[117%] hover:opacity-90"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium leading-[117%] hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Eliminando..." : "Eliminar lista"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteListButton;