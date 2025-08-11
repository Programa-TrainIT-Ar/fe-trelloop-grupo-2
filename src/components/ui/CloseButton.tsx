"use client";

import { useRouter } from "next/navigation";

interface CloseButtonProps {
  redirectTo?: string;
}

const CloseButton = ({ redirectTo = "/home" }: CloseButtonProps) => {
  const router = useRouter();

  const handleClose = () => {
    router.push(redirectTo);
  };

  return (
    <button
      className="text-white bg-[#6A5FFF] hover:bg-[#5A4FEF] transition-colors duration-200 rounded-[20px] w-[40px] h-[40px] flex justify-center items-center shadow-md"
      onClick={handleClose}
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CloseButton;