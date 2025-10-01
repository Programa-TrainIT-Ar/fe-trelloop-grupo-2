"use client";

import React, { useState, useEffect, useRef } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import AddListModal from "./AddListButton";
import { useRouter } from "next/navigation";
import { useBoardLists } from "hooks/useBoardLists";
import { updateListService } from "../../services/updateListService";
import DeleteListButton from "./DeleteListButton";
import DroppableList from "./dragdrop/DroppableList";
import DraggableTarjeta from "./dragdrop/DraggableTarjeta";
import { Card, List } from "./dragdrop/types";
import { updateCardPosition } from "./services/cardService";
import { getToken } from "../../store/authStore";

const PALETTE = [
  "#2E90FA",
  "#12B76A",
  "#F59E0B",
  "#A855F7",
  "#EF4444",
  "#06B6D4",
  "#F97316",
  "#22C55E",
  "#EAB308",
  "#DB2777",
];

const hashIndex = (str: string, mod: number) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % mod;
};

const contrastText = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#111" : "#fff";
};

const VistaListas: React.FC<{ boardId: string; isBoardOwner?: boolean; isBoardMember?: boolean }> = ({
  boardId,
  isBoardOwner = false,
  isBoardMember = false,
}) => {
  const { boardLists: originalLists, loading, error, getBoardLists } = useBoardLists(boardId);

  const dragInfoRef = useRef<{ cardId: number; sourceListId: number; sourceIndex: number } | null>(null);
  const uiIndexToBackendPos = (listLength: number, uiIndex: number) => {
    return Math.max(0, listLength - 1 - uiIndex);
  };

  const [localLists, setLocalLists] = useState<List[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [editandoListaId, setEditandoListaId] = useState<number | null>(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");

  useEffect(() => {
    if (!originalLists || !Array.isArray(originalLists)) return;

    setLocalLists((prev) => {
      if (prev.length === 0) return originalLists;

      const same =
        prev.length === originalLists.length &&
        prev.every((pl, idx) => {
          const ol = originalLists[idx];
          if (!ol) return false;
          return pl.id === ol.id && pl.cards.length === ol.cards.length;
        });

      return same ? prev : originalLists;
    });
  }, [originalLists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const iniciarEdicion = (listId: number, nombreActual: string) => {
    setEditandoListaId(listId);
    setNuevoTitulo(nombreActual);
  };

  const guardarTitulo = async (listId: number) => {
    if (!nuevoTitulo.trim()) return;
    try {
      await updateListService(Number(boardId), listId, nuevoTitulo);
      setEditandoListaId(null);
      getBoardLists();
    } catch (err) {
      console.error("Error actualizando lista", err);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = typeof active.id === "string" ? Number(active.id) : (active.id as number);

    for (const list of localLists) {
      const idx = list.cards.findIndex((c) => c.id === activeId);
      if (idx >= 0) {
        dragInfoRef.current = { cardId: activeId, sourceListId: list.id, sourceIndex: idx };
        setActiveCard(list.cards[idx]);
        return;
      }
    }

    dragInfoRef.current = null;
    setActiveCard(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = typeof active.id === "string" ? Number(active.id) : (active.id as number);
    const overIdRaw = over.id;

    if (typeof overIdRaw === "string" && overIdRaw.startsWith("list-")) {
      const targetListId = Number(overIdRaw.replace("list-", ""));
      setLocalLists((currentLists) => {
        let activeCardLocal: Card | null = null;
        let sourceListId: number | null = null;

        for (const list of currentLists) {
          const cardIndex = list.cards.findIndex((card) => card.id === activeId);
          if (cardIndex >= 0) {
            activeCardLocal = list.cards[cardIndex];
            sourceListId = list.id;
            break;
          }
        }

        if (!activeCardLocal || sourceListId === null) {
          return currentLists;
        }

        if (sourceListId === targetListId) return currentLists;

        return currentLists.map((list) => {
          if (list.id === sourceListId) {
            return { ...list, cards: list.cards.filter((card) => card.id !== activeId) };
          } else if (list.id === targetListId) {
            return { ...list, cards: [...list.cards, activeCardLocal!] };
          }
          return list;
        });
      });

      return;
    }

    const overId = typeof overIdRaw === "string" ? Number(overIdRaw) : (overIdRaw as number);
    if (isNaN(overId)) return;

    setLocalLists((currentLists) => {
      let sourceListId: number | null = null;
      let sourceIndex = -1;
      let overListId: number | null = null;
      let overIndex = -1;
      let activeCardLocal: Card | null = null;

      for (const list of currentLists) {
        const idxActive = list.cards.findIndex((c) => c.id === activeId);
        if (idxActive >= 0) {
          sourceListId = list.id;
          sourceIndex = idxActive;
          activeCardLocal = list.cards[idxActive];
        }

        const idxOver = list.cards.findIndex((c) => c.id === overId);
        if (idxOver >= 0) {
          overListId = list.id;
          overIndex = idxOver;
        }

        if (sourceListId !== null && overListId !== null) break;
      }

      if (!activeCardLocal || sourceListId === null || overListId === null) return currentLists;

      if (sourceListId === overListId) {
        if (sourceIndex === overIndex) return currentLists;
        return currentLists.map((list) => {
          if (list.id !== sourceListId) return list;
          return { ...list, cards: arrayMove(list.cards, sourceIndex, overIndex) };
        });
      }

      return currentLists.map((list) => {
        if (list.id === sourceListId) {
          return { ...list, cards: list.cards.filter((c) => c.id !== activeId) };
        }
        if (list.id === overListId) {
          const newCards = [...list.cards];
          let insertIndex = overIndex;
          if (overIndex === list.cards.length - 1) {
            insertIndex = list.cards.length;
          }
          newCards.splice(insertIndex, 0, activeCardLocal!);
          return { ...list, cards: newCards };
        }
        return list;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveCard(null);
      dragInfoRef.current = null;
      return;
    }

    const activeId = typeof active.id === "string" ? Number(active.id) : (active.id as number);
    let targetListId: number | null = null;
    let targetUiIndex = -1;

    if (typeof over.id === "string" && over.id.startsWith("list-")) {
      targetListId = Number(over.id.replace("list-", ""));
      const targetList = localLists.find((l) => l.id === targetListId);
      if (!targetList) {
        setActiveCard(null);
        dragInfoRef.current = null;
        return;
      }
      targetUiIndex = targetList.cards.length;
    } else {
      const overId = typeof over.id === "string" ? Number(over.id) : (over.id as number);
      for (const list of localLists) {
        const idx = list.cards.findIndex((c) => c.id === overId);
        if (idx >= 0) {
          targetListId = list.id;
          targetUiIndex = idx;
          break;
        }
      }
    }

    if (targetListId === null || targetUiIndex < 0) {
      setActiveCard(null);
      dragInfoRef.current = null;
      return;
    }

    const dragInfo = dragInfoRef.current;
    let sourceListId: number | null = dragInfo?.sourceListId ?? null;
    if (sourceListId === null) {
      for (const l of localLists) {
        if (l.cards.some((c) => c.id === activeId)) {
          sourceListId = l.id;
          break;
        }
      }
    }
    if (sourceListId === null) {
      setActiveCard(null);
      dragInfoRef.current = null;
      return;
    }

    setLocalLists((prevLists) => {
      const sourceListIndex = prevLists.findIndex((l) => l.id === sourceListId);
      const targetListIndex = prevLists.findIndex((l) => l.id === targetListId);
      if (sourceListIndex === -1 || targetListIndex === -1) return prevLists;

      const newLists = prevLists.map((l) => ({ ...l, cards: [...l.cards] }));

      const sourceCardIndex = newLists[sourceListIndex].cards.findIndex((c) => c.id === activeId);
      if (sourceCardIndex === -1) return prevLists;

      const [movedCard] = newLists[sourceListIndex].cards.splice(sourceCardIndex, 1);
      newLists[targetListIndex].cards.splice(targetUiIndex, 0, movedCard);

      return newLists;
    });

    const targetListOld = localLists.find((l) => l.id === targetListId);
    const oldTargetLength = targetListOld ? targetListOld.cards.length : 0;
    const newTargetLength = oldTargetLength + (sourceListId !== targetListId ? 1 : 0);
    const backendPosition = uiIndexToBackendPos(newTargetLength, targetUiIndex);

    try {
      await updateCardPosition(
        boardId,
        targetListId,
        activeId,
        backendPosition,
        getToken()!
      );
    } catch (error) {
      console.error("❌ Error updating card (optimistic):", error);
      try {
        await getBoardLists();
      } catch (e) {
        console.error("❌ Error refetching board after failed update:", e);
      }
    } finally {
      setActiveCard(null);
      dragInfoRef.current = null;
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const router = useRouter();
  const goToAddTask = (listId: string | number) => {
    router.push(`/boardList/${boardId}/lists/${listId}/addtask`);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 pt-1 bg-[#1a1a1a] overflow-x-auto scrollbar-custom w-full h-full">
        {Array.isArray(localLists) && localLists.length > 0 ? (
          localLists.map((list) => {
            const listBg = list && list.name ? PALETTE[hashIndex(String(list.name), PALETTE.length)] : "#2B2B2B";
            const listText = contrastText(listBg);

            return (
              <DroppableList key={list.id} listId={list.id}>
                <div className="w-[280px] bg-[#222] rounded-lg p-2  pt-0 flex flex-col flex-shrink-0">
                  {/* Encabezado con colores dinámicos */}
                  <div
                    className="flex items-center px-3 py-1 rounded-t-md"
                    style={{ backgroundColor: listBg }}
                  >
                    <div className="flex-1 min-w-0">
                      {editandoListaId === list.id ? (
                        <input
                          type="text"
                          value={nuevoTitulo}
                          onChange={(e) => setNuevoTitulo(e.target.value)}
                          onBlur={() => guardarTitulo(list.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") guardarTitulo(list.id);
                            if (e.key === "Escape") setEditandoListaId(null);
                          }}
                          className="bg-transparent border-b focus:outline-none w-full font-semibold"
                          style={{ color: listText }}
                          autoFocus
                        />
                      ) : (
                        <h2
                          className="truncate font-semibold"
                          style={{ color: listText }}
                          title={list.name}
                        >
                          {list.name}
                        </h2>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span style={{ color: listText }}>{list.cards.length}</span>
                      <img
                        src="/assets/icons/square-pen-white.svg"
                        alt="Editar lista"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => iniciarEdicion(list.id, list.name)}
                      />
                      <DeleteListButton
                        boardId={boardId}
                        list={list}
                        getBoardLists={getBoardLists}
                        isBoardOwner={isBoardOwner}
                      />
                    </div>
                  </div>

                  {/* Lista de tareas */}
                  <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div
                      className="flex flex-col gap-3 bg-[#2b2b2b] p-1 rounded-b-md 
                        min-h-[455px] max-h-[450px] 
                        overflow-y-auto overflow-x-hidden scrollbar-custom"
                    >
                      {list.cards.length > 0 ? (
                        list.cards.map((tarea) => (
                          <DraggableTarjeta
                            key={tarea.id}
                            card={tarea}
                            boardId={boardId}
                            listId={list.id.toString()}
                            isBoardOwner={isBoardOwner}
                            isBoardMember={isBoardMember}
                            getBoardLists={getBoardLists}
                          />
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm"></div>
                      )}
                    </div>
                  </SortableContext>

                  <button
                    onClick={() => goToAddTask(list.id)}
                    className="mt-2 py-2 px-3 w-full bg-[#6A5FFF] text-white rounded-xl"
                  >
                    + Agregar tarea
                  </button>
                </div>
              </DroppableList>
            );
          })
        ) : (
          <p className="text-white mt-2"> No hay listas creadas en este tablero. </p>
        )}

        {/* Botón agregar lista */}
        <div className="relative">
          <AddListModal boardId={boardId} getBoardLists={getBoardLists} />
        </div>
      </div>

      {/* Overlay para la tarjeta arrastrada */}
      <DragOverlay>
        {activeCard ? (
          <DraggableTarjeta
            card={activeCard}
            boardId={boardId}
            listId={"overlay"}
            isBoardOwner={isBoardOwner}
            isBoardMember={isBoardMember}
            getBoardLists={getBoardLists}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default VistaListas;
