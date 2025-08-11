"use client";

import React, { useEffect, useState } from "react";
import { getUserBoards } from "../../services/boardService";
import { useRouter } from 'next/navigation';
import BoardMenu from "./BoardMenu";
import { toggleFavoriteBoard } from "../../services/boardService";

interface Board {
  id: string;
  name?: string;
  title?: string;
  description: string;
  board_image_url?: string;
  coverImage?: string;
  isFavorite?: boolean;
  members: { id: string; name: string; avatar: string; username?: string; email?: string }[];
  tags: string[];
}

const assignedImages = [
  "/assets/images/img4.jpg",
  "/assets/images/img2.jpg",
  "/assets/images/img3.jpg",
  "/assets/images/img1.jpg",
  "/assets/images/img5.jpg",
  "/assets/images/img6.jpg",
  "/assets/images/img7.jpg",
  "/assets/images/img8.jpg",
];

// Componente BoardPreview
interface BoardPreviewProps {
  board: Board;
  onClose: () => void;
  onToggleFavorite: (boardId: string) => void;
  onEnterBoard: (boardId: string) => void;
  menuVisible: string | null;
  setMenuVisible: React.Dispatch<React.SetStateAction<string | null>>;
  sectionType: 'favorite' | 'created';
}

const BoardPreview: React.FC<BoardPreviewProps> = ({
  board,
  onClose,
  onToggleFavorite,
  onEnterBoard,
  menuVisible,
  setMenuVisible,
  sectionType
}) => {
  const isFavorite = board.isFavorite;

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="col-span-3">
      <div className="w-full h-[280px] rounded-[16px] bg-[#2a2a2a] relative overflow-hidden">

        {/* Imagen de fondo en la parte superior derecha */}
        <div
          className="absolute top-0 left-0 w-[73%] h-[60px] rounded-[16px] bg-cover bg-center"
          style={{ backgroundImage: `url(${board.coverImage})` }}
        >
          {/* Overlay para mejor contraste */}
          <div className="absolute inset-0 bg-[#2a2a2a] bg-opacity-30 pointer-events-none"></div>

          {/* Botones en la esquina superior derecha de la imagen */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center relative z-30"
              onClick={(e) => handleButtonClick(e, () => onToggleFavorite(board.id))}
              style={{ pointerEvents: 'auto' }}
            >
              <img
                src={
                  isFavorite
                    ? "/assets/icons/heart-pink.svg"
                    : "/assets/icons/heart.png"
                }
                alt="Favorito"
                className={`object-contain ${isFavorite ? "w-[20px] h-[20px]" : "w-[28px] h-[28px] scale-[1.15] -m-[2px]"
                  }`}
              />
            </button>

            <div className="relative z-30">
              <button
                className="w-8 h-8 rounded-full bg-[#161616] hover:bg-black flex items-center justify-center border border-black"
                onClick={(e) => handleButtonClick(e, () =>
                  setMenuVisible(menuVisible === `preview-${sectionType}-${board.id}`
                    ? null
                    : `preview-${sectionType}-${board.id}`)
                )}
                style={{ pointerEvents: 'auto' }}
              >
                <img
                  src="/assets/icons/ellipsis.svg"
                  alt="Opciones"
                  className="w-4 h-4"
                />
              </button>

              {menuVisible === `preview-${sectionType}-${board.id}` && (
                <div className="relative z-40">
                  <BoardMenu
                    boardId={board.id}
                    onClose={() => setMenuVisible(null)}
                  />
                </div>
              )}
            </div>

            <button
              className="w-8 h-8 rounded-full bg-[#161616] hover:bg-black flex items-center justify-center border border-black"
              onClick={(e) => handleButtonClick(e, onClose)}
              style={{ pointerEvents: 'auto' }}
            >
              <img
                src="/assets/icons/eye-closed.svg"
                alt="Cerrar vista previa"
                className="w-4 h-4"
              />
            </button>

            <button
              className="flex items-center gap-2 bg-[#161616] px-6 h-8 rounded-full hover:bg-black transition-colors"
              onClick={(e) => handleButtonClick(e, () => onEnterBoard(board.id))}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="text-white text-[12px] font-medium">Ingresar</span>
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 flex h-full">
          {/* Lado izquierdo - Información del tablero */}
          <div className="flex-1 p-6 flex flex-col">
            {/* Título */}
            <h3 className="text-[14px] font-semibold text-white leading-tight mb-10 max-w-[300px]">
              {board.name || board.title}
            </h3>

            {/* Descripción expandida */}
            <p className="text-[12px] font-normal text-[#ccc] mb-6 leading-relaxed">
              {board.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."}
            </p>

            {/* Etiquetas - máximo 15 en 3 filas de 5 */}
            <div className="flex flex-wrap gap-2 max-w-[400px]">
              {board.tags && board.tags.length > 0 ? (
                board.tags.slice(0, 15).map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center border border-[#979797] rounded-[16px] px-3 py-1"
                  >
                    <img
                      src="/assets/icons/label.svg"
                      alt="Etiqueta"
                      className="w-[18px] h-[18px] mr-1"
                    />
                    <span className="text-[12px] font-medium text-[#979797]">{tag}</span>
                  </div>
                ))
              ) : (
                ['Etiqueta', 'Etiqueta', 'Etiqueta', 'Etiqueta', 'Etiqueta'].map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center border border-[#979797] rounded-[16px] px-3 py-1"
                  >
                    <img
                      src="/assets/icons/label.svg"
                      alt="Etiqueta"
                      className="w-[18px] h-[18px] mr-1"
                    />
                    <span className="text-[12px] font-medium text-[#979797]">{tag}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel lateral derecho - Miembros */}
          <div className="w-[200px] p-2 flex flex-col">
            <div className="rounded-[12px] p-3 h-full">
              <div className="space-y-3 max-h-[180px] overflow-y-auto">
                {board.members.length > 0 ? (
                  board.members.slice(0, 5).map((member, index) => (
                    <div key={member.id || index} className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[12px] font-medium truncate">
                          {member.name}
                        </p>
                        <p className="text-gray-300 text-[11px] truncate">
                          @{member.username || member.email?.split("@")[0] || `usuario${index + 1}`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-[12px] py-4">
                    No hay miembros asignados
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserBoards = () => {
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const router = useRouter();

  const [boards, setBoards] = useState<Board[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [initialBoardOrder, setInitialBoardOrder] = useState<string[]>([]);

  const [previewVisible, setPreviewVisible] = useState<{ id: string; section: 'favorite' | 'created' } | null>(null);

  // Función para toggle preview con identificación de sección
  const togglePreview = (boardId: string, sectionType: 'favorite' | 'created') => {
    setPreviewVisible(
      previewVisible?.id === boardId && previewVisible?.section === sectionType
        ? null
        : { id: boardId, section: sectionType }
    );
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function fetchBoards() {
      const userBoards = await getUserBoards();

      const loadedBoards: Board[] = userBoards.map((b: any, index: number) => ({
        id: b.id.toString(),
        name: b.name,
        title: b.name,
        description: b.description || "",
        board_image_url: b.boardImageUrl || "",
        coverImage: b.boardImageUrl || assignedImages[index] || "/assets/images/default-board.jpg",
        isFavorite: b.is_favorite ?? favoriteIds.has(b.id.toString()),
        members: Array.isArray(b.members)
          ? b.members.filter((m: any, i: number, self: any[]) =>
            self.findIndex((x) => (typeof x === "object" ? x.id : x) === (typeof m === "object" ? m.id : m)) === i
          ).map((m: any, i: number) => {
            const id = typeof m === "object" ? m.id : m;
            // Aplicando la misma lógica que en Members.tsx
            if (typeof m === "object" && m.name && m.last_name) {
              return {
                id: id.toString(),
                name: `${m.name} ${m.last_name}`.trim(),
                username: m.email?.split("@")[0] || `usuario${i + 1}`,
                email: m.email,
                avatar: m.avatar_url || `/assets/icons/avatar${(i % 4) + 1}.png`,
              };
            }
            return {
              id: id.toString(),
              name: `Miembro ${i + 1}`,
              username: `usuario${i + 1}`,
              avatar: `/assets/icons/avatar${(i % 4) + 1}.png`,
            };
          })
          : [],
        tags: b.tags || [],
      }));

      setBoards(loadedBoards);

      if (userBoards.length > 0) {
        const newIds = userBoards.map((b: any) => b.id.toString());
        setInitialBoardOrder((prev) => {
          const updatedOrder = [...prev];
          for (const id of newIds) {
            if (!updatedOrder.includes(id)) {
              updatedOrder.push(id);
            }
          }
          return updatedOrder;
        });
      }

      const favoriteSet = new Set(
        userBoards.filter((b: any) => b.is_favorite).map((b: any) => b.id.toString())
      );
      setFavoriteIds(favoriteSet as Set<string>);
    }

    fetchBoards();
    intervalId = setInterval(() => {
      fetchBoards();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [Array.from(favoriteIds).sort().join(",")]);

  const toggleFavorite = async (boardId: string) => {
    const updated = new Set(favoriteIds);
    if (updated.has(boardId)) {
      updated.delete(boardId);
    } else {
      updated.add(boardId);
    }
    setFavoriteIds(updated);

    try {
      await toggleFavoriteBoard(boardId);
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
    }
  };

  const favoriteBoards = boards.filter((b) => favoriteIds.has(b.id));
  const createdBoards = initialBoardOrder.length > 0
    ? initialBoardOrder.map(id => boards.find(b => b.id === id)!).filter(Boolean)
    : boards;

  const goToBoardList = (boardId: string) => {
    router.push(`/boardList/${boardId}`);
  }

  // Renderiza cada card de tablero
  const renderBoardCard = (board: Board, sectionType: 'favorite' | 'created') => {
    const isFavorite = favoriteIds.has(board.id);
    const isPreviewActive = previewVisible?.id === board.id && previewVisible?.section === sectionType;

    // Si está en modo card expandida, renderiza BoardPreview
    if (isPreviewActive) {
      return (
        <BoardPreview
          key={`${sectionType}-${board.id}`}
          board={board}
          onClose={() => setPreviewVisible(null)}
          onToggleFavorite={toggleFavorite}
          onEnterBoard={goToBoardList}
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          sectionType={sectionType}
        />
      );
    }

    // Card normal
    return (
      <div
        key={`${sectionType}-${board.id}`}
        className="w-[240px] h-[240px] rounded-[16px] bg-cover bg-center relative flex flex-col justify-start p-4"
        style={{ backgroundImage: `url(${board.coverImage})` }}
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-[14px] font-semibold text-white leading-tight">
            {board.name || board.title}
          </h3>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            onClick={() => toggleFavorite(board.id)}
          >
            <img
              src={
                isFavorite
                  ? "/assets/icons/heart-pink.svg"
                  : "/assets/icons/heart.png"
              }
              alt="Favorito"
              className={`object-contain ${isFavorite ? "w-[20px] h-[20px]" : "w-[28px] h-[28px] scale-[1.15] -m-[2px]"
                }`}
            />
          </button>
        </div>

        <p className="text-[12px] font-normal text-[#ccc] line-clamp-1 mb-2">
          {board.description}
        </p>

        <div className="flex space-x-[-8px] mb-3">
          {board.members.slice(0, 4).map((member, i) => (
            <img
              key={i}
              src={member.avatar}
              alt={member.name}
              className="w-6 h-6 rounded-full border border-black"
            />
          ))}
          {board.members.length > 4 && (
            <div className="w-6 h-6 rounded-full border border-[#979797] bg-[#272727] text-white text-[12px] font-medium flex items-center justify-center">
              +{board.members.length - 4}
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-4 right-4 flex items-center gap-2 justify-start">
          <div className="relative">
            <button
              className="w-8 h-8 rounded-full bg-[#161616] hover:bg-black flex items-center justify-center border border-black"
              onClick={() => {
                const key = `${sectionType}-${board.id}`;
                setMenuVisible(menuVisible === key ? null : key);
              }}
            >
              <img
                src="/assets/icons/ellipsis.svg"
                alt="Opciones"
                className="w-4 h-4"
              />
            </button>

            {menuVisible === `${sectionType}-${board.id}` && (
              <BoardMenu
                boardId={board.id}
                onClose={() => setMenuVisible(null)}
              />
            )}
          </div>

          <button
            className="w-8 h-8 rounded-full bg-[#161616] hover:bg-black flex items-center justify-center border border-black"
            onClick={() => togglePreview(board.id, sectionType)}
          >
            <img
              src="/assets/icons/eye.svg"
              alt="Vista previa"
              className="w-4 h-4"
            />
          </button>

          <button
            className="ml-auto flex items-center gap-2 bg-[#161616] hover:bg-black px-4 h-8 rounded-full"
            onClick={() => goToBoardList(board.id)}
          >
            <span className="text-white text-[12px] font-medium">Ingresar</span>
          </button>
        </div>

        <div className="absolute -bottom-10 left-0 flex items-center gap-2">
          <div className="flex items-center border border-[#979797] rounded-[16px] px-3 py-1">
            <img
              src="/assets/icons/label.svg"
              alt="Etiqueta"
              className="w-[18px] h-[18px] mr-1"
            />
            <span className="text-[12px] font-medium text-[#979797]">Etiqueta</span>
          </div>
          <div className="w-6 h-6 rounded-full border border-[#979797] bg-[#272727] text-white text-[12px] font-medium flex items-center justify-center">
            10
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] px-1 pt-1 pb-10 space-y-14 text-white font-poppins">
      <h1 className="text-[20px] font-medium text-white">Tablero</h1>

      {/* Favoritos */}
      {favoriteBoards.length > 0 && (
        <section className="mb-1">
          <div className="flex items-center gap-4 mt-4">
            <h2 className="text-white text-[14px] font-semibold">Favoritos</h2>
            <hr className="border-[#2B2B2B] flex-1" />
          </div>

          <div className="grid grid-cols-4 gap-x-10 gap-y-20 mt-4">
            {favoriteBoards.map((board) => renderBoardCard(board, 'favorite'))}
          </div>
        </section>
      )}

      {/* Tableros creados */}
      <div className="flex items-center gap-4">
        <h2 className="text-white text-[14px] font-semibold">Tableros creados</h2>
        <hr className="border-[#2B2B2B] flex-1" />
      </div>

      <div className="grid grid-cols-4 gap-x-10 gap-y-20 mt-4">
        {createdBoards.map((board) => renderBoardCard(board, 'created'))}
      </div>
    </div>
  );
};

export default UserBoards;