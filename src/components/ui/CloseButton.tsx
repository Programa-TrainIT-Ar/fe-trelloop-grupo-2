"use client";

import { useRouter } from "next/navigation";

interface CloseButtonProps {
  redirectTo?: string;
  onClick?: () => void;
}

const CloseButton = ({ redirectTo, onClick }: CloseButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // permite lógica personalizada si la pasas
      return;
    }
    if (redirectTo) {
      router.push(redirectTo); // redirige a la ruta que le pases
    }
  };

  return (
    <button
      className="text-white bg-[#6A5FFF] hover:bg-[#5A4FEF] transition-colors duration-200 rounded-[20px] w-[40px] h-[40px] flex justify-center items-center shadow-md"
      onClick={handleClick}
      aria-label="Cerrar vista"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  );
};

export default CloseButton;
