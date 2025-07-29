"use client";

import Image from "next/image";
import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside
      className="w-[210px] h-[1210px] bg-[rgba(0,0,0,0.07)] border-r border-[#2B2B2B] flex flex-col items-start px-4 py-4 gap-6"
    >
      {/* Logo + TrainIT */}
      <div className="flex items-center gap-2 mt-2">
        <Image
          src="/assets/icons/group-flecha.svg"
          alt="Logo Flecha"
          width={40}
          height={40}
        />
        <span className="text-white font-poppins text-[16px] font-medium leading-none">
          TrainIT
        </span>
      </div>

      {/* Botón Tableros */}
      <Link
        href="/home"
        className="flex items-center gap-2 w-[178px] h-[40px] rounded-[8px] bg-[#6A5FFF] px-4 text-white text-[14px] font-poppins font-normal"
      >
        <Image
          src="/assets/icons/icon-tablero.svg"
          alt="Icono Tablero"
          width={24}
          height={24}
        />
        Tableros
      </Link>

      {/* Botón Miembros */}
      <Link
        href="#"
        className="flex items-center gap-2 w-[178px] h-[40px] rounded-[8px] px-4 text-white text-[14px] font-poppins font-normal"
      >
        <Image
          src="/assets/icons/mdi-users-outline.svg"
          alt="Icono Miembros"
          width={24}
          height={24}
        />
        Miembros
      </Link>

      {/* Botón Configuración */}
      <Link
        href="#"
        className="flex items-center gap-2 w-[178px] h-[40px] rounded-[8px] px-4 text-white text-[14px] font-poppins font-normal"
      >
        <Image
          src="/assets/icons/lucide-settings.svg"
          alt="Icono Configuración"
          width={24}
          height={24}
        />
        Configuración
      </Link>
    </aside>
  );
}