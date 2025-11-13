// CardMenu.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "./types";
import DeleteCardButton from "../DeleteCardButton";
import Portal from "../Portal";

interface Props {
  card: Card;
  boardId: string;
  listId: string | number;
  isBoardOwner?: boolean;
  isBoardMember?: boolean;
  getBoardLists: () => Promise<void>;
  onClose: () => void;
  onDeleteClick: () => void;
  position: { top: number; left: number };
}

const CardMenu: React.FC<Props> = ({
  card,
  boardId,
  listId,
  isBoardOwner,
  isBoardMember,
  getBoardLists,
  onClose,
  onDeleteClick,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // RUTAS: view vs edit
  const basePath = `/boardList/${boardId}/lists/${listId}/cards/${card.id}`;
  const viewURL = basePath; // /boardList/:boardId/lists/:listId/cards/:cardId
  const editURL = `${basePath}/edit`; // /boardList/:boardId/lists/:listId/cards/:cardId/edit

  return (
    <Portal>
      <div
        ref={menuRef}
        className="fixed z-[9999] w-[223px] h-[150px] rounded-md bg-[#272727] shadow-lg p-4 flex flex-col gap-2 animate-fade-in"
        style={{ top: position.top, left: position.left }}
      >
        {/* Ver tarjeta -> navega a viewURL */}
        <button
          onClick={() => {
            onClose();
            router.push(viewURL);
          }}
          className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
        >
          <img src="/assets/icons/eyes.svg" alt="Ver" className="w-5 h-5" />
          <span className="text-white text-sm font-medium">Ver tarjeta</span>
        </button>

 
        <button
          onClick={() => {
            onClose();
            router.push(editURL);
          }}
          className="flex items-center gap-2 w-full h-[37px] px-4 rounded-md hover:bg-[#3A3A3A]"
        >
          <img src="/assets/icons/edit.png" alt="Editar" className="w-4 h-4" />
          <span className="text-white text-sm font-medium">Editar tarjeta</span>
        </button>

        <DeleteCardButton
          boardId={boardId}
          listId={String(listId)}
          card={card}
          isBoardOwner={isBoardOwner}
          isBoardMember={isBoardMember}
          getBoardLists={getBoardLists}
          onMenuClose={onClose}
          onDeleteClick={onDeleteClick}
        />
      </div>
    </Portal>
  );
};

export default CardMenu;
