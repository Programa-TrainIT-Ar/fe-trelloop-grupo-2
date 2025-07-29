"use client";

import React from "react";

const UserNavbar = () => {
  return (
    <div className="flex flex-col justify-start items-end w-full bg-[#1A1A1A] px-6 pt-4 pb-6">
      {/* Línea superior: buscador + iconos */} 
      <div className="flex justify-between items-center w-full">
        {/* Buscador + Filtro juntos */}
        <div className="flex items-center gap-2">
          {/* Buscador */}
          <div className="flex items-center gap-2 bg-[#2B2B2B] px-4 py-2 rounded-[8px] w-[320px]">
            <img
              src="/assets/icons/search.svg"
              alt="Buscar"
              className="w-4 h-4"
            />
            <input
              type="text"
              placeholder="Buscar tableros..."
              className="bg-transparent outline-none text-white text-sm placeholder:text-[#999] w-full"
            />
          </div>

          {/* Filtro */}
          <button className="w-8 h-8 bg-[#2B2B2B] rounded-md flex items-center justify-center">
            <img
              src="/assets/icons/filter.svg"
              alt="Filtrar"
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Iconos derecha (campana, usuario) */}
        <div className="flex items-center gap-4">
          {/* Campana */}
          <button className="w-8 h-8 bg-[#2B2B2B] rounded-md flex items-center justify-center">
            <img
              src="/assets/icons/bell.svg"
              alt="Notificación"
              className="w-4 h-4"
            />
          </button>

          {/* Usuario */}
          <button className="w-8 h-8 bg-[#2B2B2B] rounded-full flex items-center justify-center">
            <img
              src="/assets/icons/user.svg"
              alt="Perfil"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>

      {/* Botón Crear tablero */}
      <div className="mt-4">
        <button className="flex items-center gap-2 bg-[#6A5FFF] text-white px-4 py-2 rounded-md text-sm font-medium">
          <img
            src="/assets/icons/plus.svg"
            alt="Crear"
            className="w-4 h-4"
          />
          Crear tablero
        </button>
      </div>
    </div>
  );
};

export default UserNavbar;