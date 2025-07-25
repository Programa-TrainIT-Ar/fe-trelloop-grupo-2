"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <Image src="/icon-check-circle.webp" alt="Ícono de Éxito" width={60} height={60} className="mx-auto" />
        <h2 className="text-lg font-semibold text-neutral-100 mt-4">Te has registrado con éxito</h2>
        <button
          onClick={handleClose}
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}