import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import DeleteCardButton from "./DeleteCardButton";
import { formatToDDMMYYYY, truncateDate } from "utils/dates";

interface Assignee {
  avatar_url: string;
  name: string;
}

interface TarjetaProps {
  descripcion: string;
  etiquetas: string[];
  assignees: Assignee[];
  comentarios: number;
  prioridad?: string;
  editURL?: string; // compatibilidad, no se usa

  // props para delete
  boardId: string;
  listId: string;
  card: {
    id: number;
    title: string;
    description?: string;
    endDate?: string | null;
  };
  isBoardOwner?: boolean;
  isBoardMember?: boolean;
  getBoardLists: () => Promise<void>;
}

const Tarjeta: React.FC<TarjetaProps> = ({
  descripcion,
  etiquetas,
  assignees,
  comentarios,
  prioridad,
  editURL: _editURL, // no usado a propósito
  boardId,
  listId,
  card,
  isBoardOwner = false,
  isBoardMember = false,
  getBoardLists,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // ======== RUTAS CORRECTAS (SIEMPRE) ========
  const basePath = `/boardList/${boardId}/lists/${listId}/cards/${card.id}`;
  const viewURL = basePath;
  const editURLResolved = `${basePath}/edit`;
  // ===========================================

  const endDate = card.endDate ? truncateDate(new Date(`${card.endDate}T00:00:00`)) : null;

  const ahoraArgentina = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })
  );
  const hoyArgentina = truncateDate(ahoraArgentina);
  const isOverdue = endDate ? endDate < hoyArgentina : false;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const getPriorityColor = (prioridad?: string) => {
    switch (prioridad?.toLowerCase()) {
      case "alta":
        return "border-[#A70000]";
      case "media":
        return "border-[#DF8200]";
      case "baja":
        return "border-[#667085]";
      default:
        return "border-purple-600";
    }
  };

  const getVisibleTags = (tags: string[]) => {
    const maxChars = 45;
    const maxTags = 2;
    let total = 0;
    const visibles: string[] = [];
    for (const tag of tags) {
      if (visibles.length >= maxTags) break;
      const lengthWithSpace = tag.length + (visibles.length > 0 ? 1 : 0);
      if (total + lengthWithSpace <= maxChars) {
        visibles.push(tag);
        total += lengthWithSpace;
      } else {
        break;
      }
    }
    return visibles;
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const { deleteCardById } = await import("services/cardService");
      await deleteCardById(Number(boardId), Number(listId), card.id);
      setShowDeleteModal(false);
      await getBoardLists();
    } catch (err: any) {
      console.error("Error al eliminar tarjeta:", err);
      alert(err?.message || "Error al eliminar la tarjeta");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`relative bg-[#3a3a3a] w-[240px] h-[101px] rounded-md p-1 border-l-4 flex flex-col justify-between ${getPriorityColor(
          prioridad
        )}`}
      >
        {/* Fila superior: etiquetas + menú */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {getVisibleTags(etiquetas).map((tag, idx) => (
              <div
                key={idx}
                className="rounded-[16px] bg-[#414141] text-[#E5E7EB] text-[11px] font-poppins px-3 py-0.5 w-fit"
              >
                {tag.length > 25 ? tag.slice(0, 22) + "..." : tag}
              </div>
            ))}
          </div>
          <button onClick={() => setShowMenu(!showMenu)}>
            <img src="/assets/icons/ellipsis.svg" alt="Opciones" className="w-6 h-6 rotate-90" />
          </button>
        </div>

        {/* Título con máximo 2 líneas */}
        <div
          className="ml-1 text-[13px] font-poppins text-[#E5E7EB]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {descripcion}
        </div>

        {/* Fila inferior: avatars + comentarios */}
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {assignees.length <= 2 ? (
                assignees.map((user, idx) => (
                  <img
                    key={idx}
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-6 h-6 rounded-full border-[0.5px] border-black"
                  />
                ))
              ) : (
                <>
                  {assignees.slice(0, 2).map((user, idx) => (
                    <img
                      key={idx}
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-6 h-6 rounded-full border-[0.5px] border-black"
                    />
                  ))}
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border-[0.5px] border-gray-400 bg-[#3a3a3a] text-white text-xs leading-none font-medium">
                    {assignees.length}
                  </div>
                </>
              )}
            </div>
            {isOverdue && endDate && (
              <span className="text-black text-xs px-2 py-1 rounded-xl bg-[#FFAEA6] flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
                  <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
                </svg>
                {formatToDDMMYYYY(endDate)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white mr-1 text-sm">{comentarios}</span>
            <img src="/assets/icons/workflow.svg" alt="Comentarios" className="w-5 h-5" />
          </div>
        </div>

        {/* Menú contextual */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-5 left-56 z-50 w-[223px] h-[150px] rounded-md bg-[#272727] shadow-lg p-4 flex flex-col gap-2 animate-fade-in"
          >
            {/* VER TARJETA -> detalle */}
            <button
              onClick={() => router.push(viewURL)}
              className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
            >
              <img src="/assets/icons/eyes.svg" alt="Ver" className="w-5 h-5" />
              <span className="text-white text-sm font-medium">Ver tarjeta</span>
            </button>

            {/* EDITAR TARJETA -> /edit */}
            <button
              onClick={() => router.push(editURLResolved)}
              className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
            >
              <img src="/assets/icons/edit.png" alt="Editar" className="w-4 h-4" />
              <span className="text-white text-sm font-medium">Editar tarjeta</span>
            </button>

            <DeleteCardButton
              boardId={boardId}
              listId={listId}
              card={card}
              isBoardOwner={isBoardOwner}
              isBoardMember={isBoardMember}
              getBoardLists={getBoardLists}
              onMenuClose={() => setShowMenu(false)}
              onDeleteClick={handleDeleteClick}
            />
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
            <img src="/assets/icons/alert.png" alt="Alerta" className="w-[72px] h-[72px] mt-2" />
            <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
              ¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no será reversible.
            </p>
            <div className="flex justify-between mt-auto mb-4 gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] hover:opacity-90 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-60"
              >
                {isDeleting ? "Eliminando..." : "Eliminar tarjeta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tarjeta;