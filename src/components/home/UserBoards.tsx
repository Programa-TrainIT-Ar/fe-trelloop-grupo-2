"use client";

import React, { useEffect, useState } from "react";
import { getUserBoards } from "../../services/boardService";
import { mockBoards } from "../../services/mockBoards";

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

const UserBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    async function fetchBoards() {
      const result = await getUserBoards();
      if (result.length > 0) {
        const favorite = result.find((b: any) => b.tags.includes("favorito"));
        const rest = result.filter((b: any) => !b.tags.includes("favorito"));
        const processedBoards = [favorite, ...rest].filter(Boolean) as Board[];
        setBoards(processedBoards);
      } else {
        setBoards(mockBoards as unknown as Board[]);
      }
    }
    fetchBoards();
  }, []);

  const favoriteBoard = boards.find((b) => b.tags.includes("favorito") || b.isFavorite);
  const createdBoards = boards.filter((b) => !b.tags.includes("favorito") && !b.isFavorite);

  return (
    <div className="min-h-screen bg-[#1A1A1A] px-8 pt-2 pb-20 space-y-14 text-white font-poppins">
      <h1 className="text-[20px] font-medium text-white">Tablero</h1>

      {/* Favoritos */}
      {favoriteBoard && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mt-4">
            <h2 className="text-white text-[14px] font-semibold">Favoritos</h2>
            <hr className="border-[#2B2B2B] flex-1" />
          </div>

          <div
            className="w-[250px] h-[240px] rounded-[16px] bg-cover bg-center relative flex flex-col justify-start p-4 mt-4"
            style={{
              backgroundImage: `url(${favoriteBoard.board_image_url || favoriteBoard.coverImage})`,
            }}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-[14px] font-semibold text-white leading-tight">
                {favoriteBoard.name || favoriteBoard.title}
              </h3>
              <div className="w-10 h-10 rounded-full bg-[#161616] flex items-center justify-center">
                <img src="/assets/icons/heart-pink.svg" alt="Favorito" className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[12px] font-normal text-[#ccc] line-clamp-1 mb-2">
              {favoriteBoard.description}
            </p>

            <div className="flex space-x-[-8px] mb-3">
              {favoriteBoard.members.slice(0, 2).map((member, i) => (
                <img
                  key={i}
                  src={member.avatar}
                  alt={member.name}
                  className="w-6 h-6 rounded-full border border-black"
                />
              ))}
            </div>

            <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between">
              <button className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center border border-black">
                <img src="/assets/icons/eye.svg" alt="Ver" className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 bg-[#161616] px-4 h-8 rounded-full">
                <span className="text-white text-[12px] font-medium">Ingresar</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 ml-1">
            <div className="flex items-center border border-[#979797] rounded-[16px] px-3 py-1">
              <img src="/assets/icons/label.svg" alt="Etiqueta" className="w-[18px] h-[18px] mr-1" />
              <span className="text-[12px] font-medium text-[#979797]">Etiqueta</span>
            </div>
            <div className="w-6 h-6 rounded-full border border-[#979797] bg-[#272727] text-white text-[12px] font-medium flex items-center justify-center">
              10
            </div>
          </div>
        </section>
      )}

      {/* Tableros creados */}
      <div className="flex items-center gap-4">
        <h2 className="text-white text-[14px] font-semibold">Tableros creados</h2>
        <hr className="border-[#2B2B2B] flex-1" />
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-20 mt-4">
        {createdBoards.slice(0, 8).map((board, index) => {
          const memberAvatars = [
            "/assets/icons/avatar1.png",
            "/assets/icons/avatar2.png",
            "/assets/icons/avatar3.png",
            "/assets/icons/avatar4.png",
          ];

          return (
            <div
              key={board.id}
              className="w-[250px] h-[240px] rounded-[16px] bg-cover bg-center relative flex flex-col justify-start p-4"
              style={{
                backgroundImage: `url(${board.board_image_url || board.coverImage})`,
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-[14px] font-semibold text-white leading-tight">
                  {board.name || board.title}
                </h3>
                <div className="w-10 h-10 rounded-full bg-[#161616] flex items-center justify-center">
                  <img
                      src={index === 3 ? "/assets/icons/heart-pink.svg" : "/assets/icons/heart.svg"}
                      alt="Favorito"
                      className="w-5 h-5"
                  />
                </div>
              </div>

              <p className="text-[12px] font-normal text-[#ccc] line-clamp-1 mb-2">
                {board.description}
              </p>

              <div className="flex space-x-[-8px] mb-3">
                {memberAvatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt="Miembro"
                    className="w-6 h-6 rounded-full border border-black"
                  />
                ))}
                <div className="w-6 h-6 rounded-full border border-[#979797] bg-[#272727] text-white text-[12px] font-medium flex items-center justify-center">
                  7
                </div>
              </div>

              <div className="absolute bottom-6 left-4 right-4 flex items-center gap-2 justify-start">
                <button className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center border border-black">
                  <img src="/assets/icons/ellipsis.svg" alt="Opciones" className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center border border-black">
                  <img src="/assets/icons/eye.svg" alt="Ver" className="w-4 h-4" />
                </button>
                <button className="ml-auto flex items-center gap-2 bg-[#161616] px-4 h-8 rounded-full">
                  <span className="text-white text-[12px] font-medium">Ingresar</span>
                </button>
              </div>

              <div className="absolute -bottom-10 left-0 flex items-center gap-2">
                <div className="flex items-center border border-[#979797] rounded-[16px] px-3 py-1">
                  <img src="/assets/icons/label.svg" alt="Etiqueta" className="w-[18px] h-[18px] mr-1" />
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