"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { BoardInfoProps } from "../types";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/djw3lkdam/image/upload/v1757691992/cloudinary-icon-_f32b9t.png";

export default function BoardInfo({
  name,
  description,
  imageUrl,
  onNameChange,
  onDescriptionChange,
  onImageUrlChange,
}: BoardInfoProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      onImageUrlChange(file);
    }
  };

  const resolvedImageUrl: string =
    previewImage ||
    (typeof imageUrl === "string" && imageUrl.trim() !== ""
      ? imageUrl.trim()
      : DEFAULT_IMAGE_URL);

  return (
    <div className="text-white space-y-2">
      <div className="flex justify-start">
        <div className="relative">
          <div className="cursor-pointer group" onClick={handleImageClick}>
            <div className="w-[130px] h-[130px] rounded-2xl overflow-hidden border border-[#404040] hover:border-[#6A5FFF] transition-all duration-300 relative">
              <Image
                src={DEFAULT_IMAGE_URL}
                alt="Imagen del tablero"
                width={130}
                height={130}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input de archivo oculto */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Nombre del tablero */}
      <div className="space-y-2">
        <label className="block text-white font-medium pt-4">
          Nombre de tablero
        </label>
        <div className="relative w-[575px]">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Escribe aquí..."
            className="w-full h-[48px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl px-2 py-2 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6A5FFF] focus:border-[#6A5FFF] transition-all duration-200"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label className="block text-white font-medium pt-3">
          Descripción
        </label>
        <div className="relative w-[575px]">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Escribe aquí..."
            rows={4}
            className="w-full bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl px-2 py-2 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6A5FFF] focus:border-[#6A5FFF] transition-all duration-200 resize-none"
          />
        </div>
        <div className="text-xs text-gray-500">
          {description.length}/500 caracteres
        </div>
      </div>
    </div>
  );
}
