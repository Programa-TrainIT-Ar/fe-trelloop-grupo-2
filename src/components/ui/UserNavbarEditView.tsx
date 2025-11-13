"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import React, { useState, useRef, useEffect } from "react";

const UserNavbarEditView = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const goToProfile = () => {
    router.push("/profile");
    setShowProfileMenu(false);
  };

  const goToChangePassword = () => {
    router.push("/change-password");
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    await logout();   //Limpia Zustand y borra el token
    router.push("/login"); // Redirige al login
    console.log("Cerrando sesión...");
    setShowProfileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full bg-[#1A1A1A] px-6 py-4">
      {/* Buscador + Filtro */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#2B2B2B] px-4 py-2 rounded-[8px] w-[320px]">
          <img src="/assets/icons/search.svg" alt="Buscar" className="w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tableros..."
            className="bg-transparent outline-none text-white text-sm placeholder:text-[#999] w-full"
          />
        </div>
        <button className="w-8 h-8 bg-[#2B2B2B] rounded-md flex items-center justify-center">
          <img src="/assets/icons/filter.svg" alt="Filtrar" className="w-4 h-4" />
        </button>
      </div>

      {/* Iconos derecha */}
      <div className="flex items-center gap-4 relative">
        <button className="w-8 h-8 bg-[#2B2B2B] rounded-md flex items-center justify-center">
          <img src="/assets/icons/bell.svg" alt="Notificación" className="w-4 h-4" />
        </button>

        {/* Botón de perfil */}
        <button
          className="w-8 h-8 bg-[#2B2B2B] rounded-full flex items-center justify-center"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img src="/assets/icons/user.svg" alt="Perfil" className="w-4 h-4" />
        </button>

        {/* Dropdown de perfil */}
        {showProfileMenu && (
          <div
            ref={menuRef}
            className="absolute top-[48px] right-0 w-[266px] h-[299px] rounded-[16px] bg-[#272727] shadow-[0_4px_6px_rgba(0,0,0,0.25)] p-4 z-50 flex flex-col gap-6"
          >
            {/* Usuario */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/perfil.jpg"
                alt="Perfil"
                className="w-[60px] h-[60px] rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium text-[14px] leading-none">Nombre del usuario</p>
                <p className="text-white font-normal text-[12px] leading-none mt-1">Administrador</p>
              </div>
            </div>

            {/* Opciones */}
            <div className="flex flex-col gap-4 text-white font-medium text-[14px]">
              <button
                onClick={goToProfile}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition"
              >
                <img src="/assets/icons/user.png" alt="Perfil" className="w-5 h-5" />
                Perfil de usuario
              </button>

              <button
                onClick={goToChangePassword}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition"
              >
                <img src="/assets/icons/key.png" alt="Contraseña" className="w-5 h-5" />
                Contraseña
              </button>

              <hr className="border-[#444]" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition"
              >
                <img src="/assets/icons/log-out.png" alt="Salir" className="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNavbarEditView;