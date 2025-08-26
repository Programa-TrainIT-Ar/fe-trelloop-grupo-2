import React, { useState } from "react";
import AddListModal from "./AddListButton";
import { useBoardLists } from "hooks/useBoardLists";
import { updateListService } from "../../services/updateListService";
import DeleteListButton from "./DeleteListButton";

interface Tarea {
  board_id: number;
  id: number;
  etiquetas: string;
  descripcion: string;
  personas: number;
  comentarios: number;
}

const VistaListas: React.FC<{ boardId: string; isBoardOwner?: boolean }> = ({
  boardId,
  isBoardOwner = false,
}) => {
  const { boardLists, loading, error, getBoardLists } = useBoardLists(boardId);

  const [editandoListaId, setEditandoListaId] = useState<number | null>(null);
  const [nuevoTitulo, setNuevoTitulo] = useState("");

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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex gap-4 p-4 bg-[#1a1a1a] overflow-x-auto scrollbar-custom w-full h-full">
      {Array.isArray(boardLists) &&
        boardLists.length > 0 &&
        boardLists.map((list) => (
          <div
            key={list.id}
            className="w-[280px] bg-[#222] rounded-lg p-3 flex flex-col h-full flex-shrink-0"
          >
            {/* Encabezado */}
            <div className="flex items-center px-3 py-1 rounded-t-md bg-neutral-600">
              {/* Contenedor título/input */}
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
                    className="bg-transparent border-b border-white text-white font-semibold focus:outline-none w-full"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-white font-semibold truncate">
                    {list.name}
                  </h2>
                )}
              </div>

              {/* Contenedor íconos */}
              <div className="flex items-center gap-2 flex-shrink-0 ">
                {/* Contador de tareas */}
                <span className="text-white">{list.cards.length}</span>
                {/* Icono de edición */}
                <img
                  src="/assets/icons/square-pen-white.svg"
                  alt="Editar lista"
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => iniciarEdicion(list.id, list.name)}
                />
                {/* Botón eliminar lista */}
                <DeleteListButton
                  boardId={boardId}
                  list={{
                    id: list.id,
                    name: list.name,
                    cards: list.cards,
                  }}
                  getBoardLists={getBoardLists}
                  isBoardOwner={isBoardOwner}
                />
              </div>
            </div>

            {/* Lista de tareas */}
            <div className="flex-1 overflow-y-auto overflow-x-auto space-y-2">
              {list.cards.map((tarea) => (
                <div
                  key={tarea.id}
                  className="bg-[#3a3a3a] rounded-md p-3 border-l-4"
                >
                  <div className="text-gray-400 text-sm mb-2">
                    {tarea.etiquetas}
                  </div>
                  <div className="text-white text-sm mb-2">
                    {tarea.descripcion}
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>👥 {tarea.personas}</span>
                    <span>💬 {tarea.comentarios}</span>
                  </div>
                </div>
              ))}

              {/* Botón agregar tarea */}
            </div>
            <button className="mt-2 py-2 px-3 w-full bg-purple-600 text-white rounded-md hover:bg-purple-700">
              + Agregar tarea
            </button>
          </div>
        ))}
      {/* Botón agregar lista */}
      <div className="relative">
        <AddListModal boardId={boardId} getBoardLists={getBoardLists} />
      </div>

      {/* Mensaje si no hay listas */}
      {(!Array.isArray(boardLists) || boardLists.length === 0) && (
        <p className="text-white mt-2">
          No hay listas creadas en este tablero.
        </p>
      )}
    </div>
  );
};

export default VistaListas;
