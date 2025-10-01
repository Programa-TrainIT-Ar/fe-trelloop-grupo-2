import React, { useState, useEffect } from "react";
import { getBoardDetails } from "../../services/boardService";
import { useParams } from "next/navigation";

interface BacklogItem {
  id: number;
  descripcion: string;
  responsables: string;
  prioridad: "Alta" | "Media" | "Baja";
  estado: string; // nombre de la lista
  estadoColor: string; // color dinámico de la lista
  miembros: {
    avatar_url: string;
    email: string;
    id: number;
    last_name: string;
    name: string;
  }[];
  fecha: string;
}

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

const VistaBacklog: React.FC = () => {
  const [backlog, setBacklog] = useState<BacklogItem[]>([]);
  const params = useParams();
  const boardId = params.boardId as string;

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) return;
      try {
        const boardDetails = await getBoardDetails(boardId);
        console.log("Board Details:", boardDetails);

        const backlogItems = boardDetails.lists.flatMap((list: any) => {
          const listColor = PALETTE[hashIndex(String(list.name), PALETTE.length)];

          return list.cards.map((card: any) => ({
            id: card.id,
            descripcion: card.description,
            responsables:
              card.assignees && card.assignees.length > 0 && card.assignees[0]
                ? card.assignees[0].name
                : "N/A",
            prioridad: card.priority,
            estado: list.name,
            estadoColor: listColor,
            miembros: card.assignees ? card.assignees : [],
            fecha: formatFecha(card.start_date),
          }));
        });

        setBacklog(backlogItems);
        console.log("Backlog Items:", backlogItems);
      } catch (error) {
        console.error("Error fetching board details:", error);
      }
    };

    fetchBoardData();
  }, [boardId]);

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-500";
      case "Media":
        return "bg-orange-500";
      case "Baja":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  const agregarNuevoItem = () => {
    const nuevoItem: BacklogItem = {
      id: backlog.length + 1,
      descripcion: "Nueva tarea",
      responsables: "Usuario",
      prioridad: "Media",
      estado: "Nueva lista",
      estadoColor: "#6A5FFF",
      miembros: [],
      fecha: formatFecha(new Date().toISOString()),
    };
    setBacklog([...backlog, nuevoItem]);
  };

  const formatFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    const opciones: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const formato = new Intl.DateTimeFormat("es-ES", opciones).format(fecha);
    const [dia, , mes, , año] = formato.split(" ");
    return `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${dia} de ${año}`;
  };

  return (
    <div className="p-6 bg-[#1a1a1a] w-full overflow-y-auto text-white">
      <div className="overflow-x-auto w-full">
        <table className="min-w-[900px] w-full border-separate border-spacing-y-2">
          {/* Encabezados */}
          <thead className="bg-[#212121] mb-3 border border-[rgba(60,60,60,0.7)]">
            <tr className="border border-red-500 rounded-[8px] ">
              <th className="p-4 rounded-l-[8px] border-l border-y border-[rgba(60,60,60,0.7)]">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#6A5FFF] hover:bg-[#6A5FFF]"
                />
              </th>
              <th className="text-left font-medium p-4 border-y border-[rgba(60,60,60,0.7)]">
                Descripción
              </th>
              <th className="text-left font-medium p-4 border-y border-[rgba(60,60,60,0.7)]">
                Responsables
              </th>
              <th className="text-left font-medium p-4 border-y border-[rgba(60,60,60,0.7)]">
                Prioridad
              </th>
              <th className="text-left font-medium p-4 border-y border-[rgba(60,60,60,0.7)]">
                Estado
              </th>
              <th className="text-left font-medium p-4 border-y border-[rgba(60,60,60,0.7)]">
                Miembros
              </th>
              <th className="text-left font-medium p-4 border-y border-[rgba(60,60,60,0.7)]">
                Fecha
              </th>
              <th className="rounded--[8px] text-left font-medium p-4 border-r border-y border-[rgba(60,60,60,0.7)]">
                Acciones
              </th>
            </tr>
          </thead>

          {/* Filas */}
          <tbody>
            {backlog.map((item) => (
              <tr key={item.id} className="bg-[#212121] rounded-lg">
                <td className="p-4 rounded-l-[8px] border-l border-y border-[rgba(60,60,60,0.7)]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[#6A5FFF] hover:bg-[#6A5FFF]"
                  />
                </td>

                <td className="p-4 border-y border-[rgba(60,60,60,0.7)]">
                  {item.descripcion}
                </td>
                <td className="p-4 border-y border-[rgba(60,60,60,0.7)]">
                  {item.responsables}
                </td>

                <td className="p-4 border-y border-[rgba(60,60,60,0.7)]">
                  <span
                    className={`${getPrioridadColor(
                      item.prioridad
                    )} text-white text-xs px-2 py-1 rounded-md`}
                  >
                    {item.prioridad}
                  </span>
                </td>

                {/* Estado con color de lista */}
                <td className="p-4 border-y border-[rgba(60,60,60,0.7)] whitespace-nowrap">
                  <span
                    className="text-white text-xs px-2 py-1 rounded-md"
                    style={{ backgroundColor: item.estadoColor }}
                  >
                    {item.estado}
                  </span>
                </td>

                <td className="p-4 border-y border-[rgba(60,60,60,0.7)]">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-[-8px]">
                      {item.miembros.slice(0, 4).map((member) => (
                        <img
                          key={member.id}
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-6 h-6 rounded-full border border-black"
                        />
                      ))}
                      {item.miembros.length > 4 && (
                        <div className="w-6 h-6 rounded-full border border-[#979797] bg-[#272727] text-white text-[12px] font-medium flex items-center justify-center">
                          +{item.miembros.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="p-4 border-y border-[rgba(60,60,60,0.7)] text-sm">
                  {item.fecha}
                </td>

                <td className="p-4 border-r rounded-r-[8px] border-y border-[rgba(60,60,60,0.7)]">
                  <div className="flex items-center space-x-2">
                    <button className="text-white hover:text-gray-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button className="text-white hover:text-red-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón flotante */}
      <button
        onClick={agregarNuevoItem}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#6A5FFF] text-white rounded-full flex items-center justify-center text-2xl hover:bg-purple-700 transition-colors shadow-lg"
      >
        +
      </button>
    </div>
  );
};

export default VistaBacklog;