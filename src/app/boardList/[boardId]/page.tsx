"use client";

import DashboardSidebar from "components/home/DashboardSidebar";
import UserNavbar from "components/home/UserNavbar";
import { useParams } from "next/navigation";
import VistaListas from "components/BoardLists/VistaListas";
import VistaBacklog from "components/BoardLists/VistaBacklog";
import ShareBoardModal from "components/BoardLists/ShareBoardModal";
import { useState, useEffect } from "react";
// NEW: traemos los detalles del tablero para conocer el rol actual del usuario
import { getBoardDetails } from "services/boardService"; // ajusta la ruta si tu alias difiere

interface BoardListProps {
  params: { boardId: string };
}

export default function BoardListPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const [vistaActiva, setVistaActiva] = useState<string>("backlog");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [boardPermissions, setBoardPermissions] = useState({
    isOwner: false,
    isMember: false,
    loading: true,
  });

  // NEW: canManage controla visibilidad del botón plus.svg (owner/admin)
  const [canManage, setCanManage] = useState(false);

  console.log("=== DEBUG BOARDLISTPAGE ===");
  console.log("boardPermissions.isOwner:", boardPermissions.isOwner);
  console.log("boardPermissions.isMember:", boardPermissions.isMember);
  console.log("============================");

  useEffect(() => {
    if (!boardId) return;

    (async () => {
      try {
        // NEW: usamos el mismo enfoque que en VistaBacklog
        const details = await getBoardDetails(String(boardId));
        const role = (details?.current_user_role || null) as
          | "owner"
          | "admin"
          | "member"
          | null;

        const can = role === "owner" || role === "admin";
        setCanManage(can); // NEW

        setBoardPermissions({
          isOwner: can, // owner o admin pueden gestionar
          isMember: role === "owner" || role === "admin" || role === "member",
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching board permissions:", error);
        setBoardPermissions((prev) => ({ ...prev, loading: false }));
        setCanManage(false); // NEW
      }
    })();
  }, [boardId]);

  const handleVistaChange = (vista: string) => {
    setVistaActiva(vista);
  };

  return (
    <div className="flex bg-[#1A1A1A] h-screen overflow-hidden">
      {/* Sidebar lateral */}
      <DashboardSidebar />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar autenticado con buscador, iconos y sin botón */}
        <UserNavbar showCreateBoardButton={false} />
        <div className="flex flex-col justify-start items-end w-full px-6 pt-4 pb-6 relative max-w-full">
          <div className="flex items-center justify-between w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-[10px] px-4 pr-10 py-2 border border-[#3a3a3a] outline-none focus:ring-2 focus:ring-[#6a5fff] transition">
            <div className="flex-grow font-poppins flex items-center justify-start gap-4">
              <button
                type="button"
                className={`px-5 py-1.5 text-1x1 rounded-lg transition-colors ${
                  vistaActiva === "backlog"
                    ? "bg-[#6A5FFF] text-white"
                    : "hover:bg-[#6A5FFF] hover:text-white"
                }`}
                onClick={() => handleVistaChange("backlog")}
              >
                Backlog
              </button>
              <div className="border-r border-[#3a3a3a] h-6"></div>
              <button
                type="button"
                className={`px-5 py-1.5 text-1x1 font-medium rounded-lg transition-colors ${
                  vistaActiva === "listas"
                    ? "bg-[#6A5FFF] text-white"
                    : "hover:bg-[#6A5FFF] hover:text-white"
                }`}
                onClick={() => handleVistaChange("lists")}
              >
                Listas
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-500">
                <img src="/assets/icons/avatar1.png" alt="Avatar 1" />
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-400">
                <img src="/assets/icons/avatar2.png" alt="Avatar 2" />
              </div>

              {/* NEW: el plus.svg solo aparece para owner/admin */}
              {canManage && (
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-6 h-6 rounded-full border border-[#3a3a3a] bg-dark flex items-center justify-center text-gray-400 font-bold text-xl"
                  aria-label="Compartir tablero"
                  title="Compartir tablero"
                >
                  <img src="/assets/icons/plus.svg" alt="Agregar" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Renderizado de componentes condicional */}
        <section className="flex-1 min-h-0 overflow-hidden flex">
          {vistaActiva === "backlog" && <VistaBacklog />}
          {vistaActiva === "lists" &&
            (boardId ? (
              <VistaListas
                boardId={boardId}
                isBoardOwner={boardPermissions.isOwner}
                isBoardMember={boardPermissions.isMember}
              />
            ) : (
              <p>Cargando...</p>
            ))}
        </section>
      </main>

      {/* Modal de compartir tablero (el backend reforzará permisos igualmente) */}
      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        boardId={boardId as string}
      />
    </div>
  );
}