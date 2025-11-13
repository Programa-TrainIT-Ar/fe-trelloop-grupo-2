"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface BackHeaderProps {
  title?: string;
  /** Ruta destino al presionar la flecha. Por defecto "/" */
  href?: string;
  /** Si se provee, se ejecuta en lugar de navegar (útil para mostrar modal). */
  onBack?: () => void;
}

export default function BackHeader({ title = "", href = "/", onBack }: BackHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();   // deja que el padre decida (modal, etc.)
    if (href) return router.push(href); // ir siempre a la ruta indicada
    router.back();                 // fallback por compatibilidad
  };

  return (
    <div
      onClick={handleBack}
      className="flex items-center space-x-2 cursor-pointer ps-7 h-[64px] bg-header border-b border-[#2B2B2B]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}