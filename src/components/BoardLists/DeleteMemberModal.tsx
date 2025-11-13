import { useState } from "react";
import { removeBoardMember } from "../../services/boardService";

export default function DeleteMemberModal({
    // @ts-ignore
  isOpen,
    // @ts-ignore
  onClose,
    // @ts-ignore
  member,
    // @ts-ignore
  boardId,
    // @ts-ignore
  refreshMembers,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !member) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await removeBoardMember(boardId, member.id);
      refreshMembers();
      onClose();
    } catch (error) {
      console.error("Error eliminando miembro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
        <img
          src="/assets/icons/alert.png"
          alt="Alerta"
          className="w-[72px] h-[72px] mt-2"
        />
        <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
          ¿Seguro que deseas eliminar a{" "}
          <span className="font-bold">{member.name}</span>?
        </p>
        <div className="flex justify-between mt-auto mb-4 gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] font-normal leading-[117%] hover:opacity-90"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium leading-[117%] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Eliminando..." : "Eliminar miembro"}
          </button>
        </div>
      </div>
    </div>
  );
}
