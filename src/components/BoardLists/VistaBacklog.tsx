import React, { useState } from "react";

interface BacklogItem {
  id: number;
  descripcion: string;
  responsables: string;
  prioridad: "Alta" | "Media" | "Baja";
  estado: "Por hacer" | "En progreso" | "Hecho";
  miembros: number;
  fecha: string;
}

const VistaBacklog: React.FC = () => {
  const [backlog, setBacklog] = useState<BacklogItem[]>([
    {
      id: 1,
      descripcion: "Implementar login",
      responsables: "Iván Andrade",
      prioridad: "Media",
      estado: "Hecho",
      miembros: 7,
      fecha: "Julio 15 de 2025",
    },
    {
      id: 2,
      descripcion: "Diseño dashboard",
      responsables: "Iván Andrade",
      prioridad: "Alta",
      estado: "En progreso",
      miembros: 7,
      fecha: "Julio 15 de 2025",
    },
    {
      id: 3,
      descripcion: "Implementar diseño",
      responsables: "Iván Andrade",
      prioridad: "Baja",
      estado: "Por hacer",
      miembros: 7,
      fecha: "Julio 15 de 2025",
    },
  ]);

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

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Hecho":
        return "bg-green-500";
      case "En progreso":
        return "bg-blue-500";
      case "Por hacer":
        return "bg-gray-600";
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
      estado: "Por hacer",
      miembros: 1,
      fecha: new Date().toLocaleDateString('es-ES', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
    };
    setBacklog([...backlog, nuevoItem]);
  };

  return (
    <div className="p-6 bg-[#1a1a1a] min-h-screen w-full text-white">

      {/* Tabla de backlog */}
      <div className="bg-[#2b2b2b] rounded-lg">
        {/* Headers de columnas */}
        <div className="grid grid-cols-8 gap-4 p-4 bg-gray-800 rounded-t-lg">
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded" />
          </div>
          <div className="text-white font-medium">Descripción</div>
          <div className="text-white font-medium">Responsables</div>
          <div className="text-white font-medium">Prioridad</div>
          <div className="text-white font-medium">Estado</div>
          <div className="text-white font-medium">Miembros</div>
          <div className="text-white font-medium">Fecha</div>
          <div className="text-white font-medium">Acciones</div>
        </div>

               {/* Filas de datos - cada una como un contenedor grid separado */}
               <div className="p-4">
          {backlog.map((item, index) => (
            <div 
              key={item.id} 
              className={`bg-[#2b2b2b] rounded-lg hover:bg-gray-700 transition-colors ${
                index < backlog.length - 1 ? 'mb-3' : ''
              }`}
            >
              <div className="grid grid-cols-8 gap-4 p-4">
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded" />
                </div>
                
                <div className="text-white">{item.descripcion}</div>
                
                <div className="text-white">{item.responsables}</div>
                
                <div>
                  <span className={`${getPrioridadColor(item.prioridad)} text-white text-xs px-2 py-1 rounded-md`}>
                    {item.prioridad}
                  </span>
                </div>
                
                <div>
                  <span className={`${getEstadoColor(item.estado)} text-white text-xs px-2 py-1 rounded-md`}>
                    {item.estado}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white">
                    {item.miembros}
                  </div>
                </div>
                
                <div className="text-white text-sm">{item.fecha}</div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-white hover:text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="text-white hover:text-red-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>


      {/* Botón flotante para agregar */}
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