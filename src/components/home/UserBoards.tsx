"use client";

import React, { useEffect, useState } from "react";
import { getUserBoards } from "../../services/boardService";
import { useRouter } from 'next/navigation';
import BoardMenu from "./BoardMenu";

interface Board {
  id: string;
  name?: string;
  title?: string;
  description: string;
  board_image_url?: string;
  coverImage?: string;
  isFavorite?: boolean;
  members: { id: string; name: string; avatar: string }[];
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

const UserBoards = () => {
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const router = useRouter();

  const [boards, setBoards] = useState<Board[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

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
      isFavorite: favoriteIds.has(b.id.toString()),
      members: Array.isArray(b.members)
        ? b.members.filter((m: any, i: number, self: any[]) =>
            self.findIndex((x) => (typeof x === "object" ? x.id : x) === (typeof m === "object" ? m.id : m)) === i
          ).map((m: any, i: number) => {
            const id = typeof m === "object" ? m.id : m;
            return {
              id: id.toString(),
              name: `Miembro ${i + 1}`,
              avatar: `/assets/icons/avatar${(i % 4) + 1}.png`,
            };
          })
        : [],
    }));

    setBoards(loadedBoards);
  }

  // Ejecutar la primera vez
  fetchBoards();

  // 🔁 Auto-actualizar cada 5 segundos
  intervalId = setInterval(() => {
    fetchBoards();
  }, 3000);

  // Limpiar el intervalo al desmontar
  return () => clearInterval(intervalId);
}, [Array.from(favoriteIds).sort().join(",")]);
  const toggleFavorite = (boardId: string) => {
    const updated = new Set(favoriteIds);
    if (updated.has(boardId)) {
      updated.delete(boardId);
    } else {
      updated.add(boardId);
    }
    setFavoriteIds(updated);
  };

  const favoriteBoards = boards.filter((b) => favoriteIds.has(b.id));
  const createdBoards = boards;

  return (
    <div className="min-h-screen bg-[#1A1A1A] px-8 pt-2 pb-20 space-y-14 text-white font-poppins">
      <h1 className="text-[20px] font-medium text-white">Tablero</h1>

      {/* Favoritos */}
      {favoriteBoards.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mt-4">
            <h2 className="text-white text-[14px] font-semibold">Favoritos</h2>
            <hr className="border-[#2B2B2B] flex-1" />
          </div>

          <div className="grid grid-cols-4 gap-x-6 gap-y-10 mt-4">
            {favoriteBoards.map((board) => (
              <div
                key={board.id}
                className="w-[250px] h-[240px] rounded-[16px] bg-cover bg-center relative flex flex-col justify-start p-4 mb-10"
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
                    src="/assets/icons/heart-pink.svg"
                    alt="Favorito"
                    className="w-[20px] h-[20px] object-contain"
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

                <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between">
                  <button className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center border border-black">
                    <img src="/assets/icons/eye.svg" alt="Ver" className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 bg-[#161616] px-4 h-8 rounded-full">
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
            ))}
          </div>
        </section>
      )}

      {/* Tableros creados */}
      <div className="flex items-center gap-4">
        <h2 className="text-white text-[14px] font-semibold">Tableros creados</h2>
        <hr className="border-[#2B2B2B] flex-1" />
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-20 mt-4">
        {createdBoards.map((board) => {
          const memberAvatars = [
            "/assets/icons/avatar1.png",
            "/assets/icons/avatar2.png",
            "/assets/icons/avatar3.png",
            "/assets/icons/avatar4.png",
          ];

          const isFavorite = favoriteIds.has(board.id);
          const backgroundImage = board.coverImage;

          return (
            <div
              key={board.id}
              className="w-[250px] h-[240px] rounded-[16px] bg-cover bg-center relative flex flex-col justify-start p-4"
              style={{ backgroundImage: `url(${backgroundImage})` }}
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
                          : "/assets/icons/heart.svg"
                      }
                      alt="Favorito"
                      className="w-[20px] h-[20px] object-contain"
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
                    className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center border border-black"
                    onClick={() =>
                      setMenuVisible(menuVisible === board.id ? null : board.id)
                    }
                  >
                    <img
                      src="/assets/icons/ellipsis.svg"
                      alt="Opciones"
                      className="w-4 h-4"
                    />
                  </button>

                  {menuVisible === board.id && (
                    <BoardMenu
                      boardId={board.id}
                      onClose={() => setMenuVisible(null)}
                    />
                  )}
                </div>
                <button className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center border border-black">
                  <img src="/assets/icons/eye.svg" alt="Ver" className="w-4 h-4" />
                </button>
                <button className="ml-auto flex items-center gap-2 bg-[#161616] px-4 h-8 rounded-full">
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
        })}
      </div>
    </div>
  );
};

export default UserBoards;