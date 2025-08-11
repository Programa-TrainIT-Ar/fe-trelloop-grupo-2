import React from "react";
import AddListModal from "./AddListButton";

interface Tarea {
  board_id: number;
  id: number;
  etiquetas: string;
  descripcion: string;
  personas: number;
  comentarios: number;
}

interface Columna {
  id: number;
  titulo: string;
  color: string;
  bordeColor: string; // Nueva propiedad para el color del borde
  tareas: Tarea[];
}

// interface Columna {
//   id: number;
//   titulo: string;
//   color: string; // clases Tailwind para color de encabezado
//   tareas: Tarea[];
// }

const VistaListas: React.FC = () => {
  //   const columnas: Columna[] = [
  //     {
  //       id: 1,
  //       titulo: "Por hacer",
  //       color: "bg-[#6d4c41]", // Marrón
  //       tareas: [
  //         { id: 1, etiquetas: "Etiquetas", descripcion: "Ut enim ad minim veniam, quis nostrud", personas: 3, comentarios: 3 },
  //         { id: 2, etiquetas: "Etiquetas", descripcion: "Ut enim ad minim veniam, quis nostrud", personas: 3, comentarios: 5 },
  //         { id: 3, etiquetas: "Etiquetas", descripcion: "Ut enim ad minim veniam, quis nostrud", personas: 3, comentarios: 7 },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       titulo: "En progreso",
  //       color: "bg-[#0288d1]", // Azul
  //       tareas: [
  //         { id: 4, etiquetas: "Etiquetas", descripcion: "Ut enim ad minim veniam, quis nostrud", personas: 3, comentarios: 5 },
  //       ],
  //     },
  //   ];
  const columnas: Columna[] = [
    {
      id: 1,
      titulo: "Por hacer",
      color: "bg-[#6d4c41]",
      bordeColor: "border-l-red-500", // Borde rojo
      tareas: [
        {
          board_id: 2,
          id: 1,
          etiquetas: "Etiquetas",
          descripcion: "Ut enim ad minim veniam, quis nostrud",
          personas: 3,
          comentarios: 3,
        },
        {
          board_id: 2,
          id: 2,
          etiquetas: "Etiquetas",
          descripcion: "Ut enim ad minim veniam, quis nostrud",
          personas: 3,
          comentarios: 5,
        },
        {
          board_id: 2,
          id: 3,
          etiquetas: "Etiquetas",
          descripcion: "Ut enim ad minim veniam, quis nostrud",
          personas: 3,
          comentarios: 7,
        },
      ],
    },
    {
      id: 2,
      titulo: "En progreso",
      color: "bg-[#0288d1]",
      bordeColor: "border-l-orange-500", // Borde naranja
      tareas: [
        {
          board_id: 2,
          id: 4,
          etiquetas: "Etiquetas",
          descripcion: "Ut enim ad minim veniam, quis nostrud",
          personas: 3,
          comentarios: 5,
        },
      ],
    },
  ];

  return (
    <div className="flex gap-4 p-4 bg-[#1a1a1a] h-full">
      {columnas.map((columna) => (
        <div key={columna.id} className="flex flex-col w-64">
          {/* Encabezado */}
          <div
            className={`flex justify-between items-center px-3 py-2 rounded-t-md ${columna.color}`}
          >
            <h2 className="text-white font-semibold">{columna.titulo}</h2>
            <span className="text-white">{columna.tareas.length}</span>
          </div>

          {/* Lista de tareas */}
          <div className="flex flex-col gap-3 bg-[#2b2b2b] p-3 rounded-b-md flex-1">
            {columna.tareas.map((tarea) => (
              <div
                key={tarea.id}
                className={`bg-[#3a3a3a] rounded-md p-3 border-l-4 ${columna.bordeColor}`}
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
            <button className="mt-2 py-2 px-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              + Agregar tarea
            </button>
          </div>
        </div>
      ))}
      <div className="relative">
        <AddListModal
          boardId={columnas[0].tareas[0].board_id}
        />
      </div>
    </div>
  );
};

export default VistaListas;
