"use client";

import Image from "next/image";
import React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { TagChip } from "../../components/newBoard/TagChip";
import { UserBoard } from "../../components/newBoard/UserBoard";

import { createBoardController } from "controllers/boardController";
import { ValidationError } from "../../types/validatesError";

import { searchUsersController } from "controllers/userController";

import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";

const NewBoard = () => {
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState('')
  const nameInputRef = useRef(null)

  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const [boardImage, setBoardImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const goToHome = () => {
    router.push("/home");
  };

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [memberInput, setMemberInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [selectedMembers, setSelectedMembers] = useState<
    {
      id: number;
      name: string;
      last_name: string;
      email: string;
      avatar_url: string;
    }[]
  >([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [status, setStatus] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");

  const [searchMember, setSearchMember] = useState("");
  const [results, setResults] = useState<
    Array<{
      id: number;
      name: string;
      last_name: string;
      email: string;
      avatar_url: string;
    }>
  >([]);

  //verificacion de datos previa a la creación del tablero

  // @ts-ignore
  const validateName = (value) => {
    if (!value.trim()) return 'El nombre no puede estar vacío.';
    if (value.trim().length > 70) return 'El nombre debe tener máximo 70 caracteres.';
    return '';
  };

  // @ts-ignore
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameTouched) {
      setNameError(validateName(e.target.value));
    }
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    setNameError(validateName(name))
  };


  //lógica para la busqueda y filtración de miembros y etiquetas

  const handleSearchInputChange = (query: string) => {
    setSearchMember(query);
    if (query.length < 2) {
      setResults([]); // Limpiar resultados si la query es muy corta
      return;
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length < 2) return;

    try {
      const users = await searchUsersController(query);
      setResults(users);
    } catch (error) {
      console.error("❌ Error buscando miembros:", error);
      setResults([]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Función para la selección de miembros
  const handleSelectMember = (member: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    avatar_url: string;
  }) => {
    // Verificar que no esté seleccionado
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
      setSearchMember("");
      setResults([]);
    }
  };

  // Función para remover miembros
  const handleRemoveMember = (idToRemove: number) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== idToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //validar nombre
    const nameValidationError = validateName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      setNameTouched(true);
      // @ts-ignore
      nameInputRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("status", status);

    if (boardImage) {
      formData.append("image", boardImage);
    }

    selectedTags.forEach((tag) => formData.append("tags", tag));
    selectedMembers.forEach((m) => formData.append("members", m.id.toString()));

    try {
      await createBoardController(formData);
      router.push("/home");
    } catch (err) {
      if (err instanceof ValidationError) {
        setFormErrors({ [err.field || "general"]: err.message });
      } else {
        setFormErrors({ general: "Error inesperado" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="w-full bg-[#1A1A1A] text-white min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-medium">Crear tablero</h2>
          <button
            className="text-white bg-[#6A5FFF] rounded-[20px] w-[40px] h-[40px] flex justify-center items-center"
            onClick={goToHome}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Campos obligatorios (Nombre y descripción) y foto*/}
        <div className="flex-1 items-center w-full px-80 py-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-white pb-1 space-y-2">
              <div
                className="w-[130px] h-[130px] bg-[#1e1e1e] rounded-2xl flex items-center justify-center hover:bg-[#2a2a2a] cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {boardImage ? (
                  <img
                    src={URL.createObjectURL(boardImage)}
                    alt="preview"
                    width={130}
                    height={130}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <CameraIcon className="h-6 w-6 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setBoardImage(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white font-medium pt-4">
                Nombre de tablero
              </label>
              <div className="relative w-[575px]">
                <input
                  type="text"
                  value={name}
                  ref={nameInputRef}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  placeholder="Escribe aquí..."
                  className="w-full h-[48px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl px-2 py-2 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6A5FFF] focus:border-[#6A5FFF] transition-all duration-200"
                />
                {nameError && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {nameError}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-white font-medium pt-4">
                Descripción
              </label>
              <div className="relative w-[575px]">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe aquí..."
                  rows={4}
                  className="w-full bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl px-2 py-2 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6A5FFF] focus:border-[#6A5FFF] transition-all duration-200 resize-none"
                />
              </div>
              <div className="text-xs text-gray-500">
                {description.length}/500 caracteres
              </div>
            </div>

            {/* Miembros */}
            <div className="space-y-2 mt-8">
              <label className="block text-white font-medium pt-1">
                Miembros
              </label>

              <div className="relative w-[575px]">
                <input
                  type="text"
                  placeholder="Buscar por nombre o @usuario..."
                  value={searchMember}
                  className="w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl pl-2 pr-10 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchMember(value);

                    if (value.length >= 2) {
                      handleSearch(value);
                    } else {
                      setResults([]);
                    }
                  }}
                />

                {results.length > 0 && (
                  <ul className="absolute z-50 w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-md mt-1 max-h-40 overflow-y-auto">
                    {results.map((member) => (
                      <li
                        key={member.id}
                        className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer text-white border-b border-[#3a3a3a]"
                        onClick={() => handleSelectMember(member)}
                      >
                        {`${member.name} ${member.last_name}`}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
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
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </div>

              <div className="container-miembros flex flex-wrap mt-[5px] gap-x-2">
                {selectedMembers.map((member) => (
                  <div className="flex flex-wrap ml-1">
                    <UserBoard
                      key={member.id}
                      name={`${member.name} ${member.last_name}`}
                      username={member.name}
                      img={member.avatar_url}
                    />
                    <button
                      className="text-white ml-[10px]"
                      onClick={() => handleRemoveMember(member.id)}
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Etiquetas */}
            <div className="space-y-2 pt-8">
              <label className="block text-white font-medium pt-1">
                Etiquetas
              </label>
              <div className="relative w-[575px]">
                <input
                  type="text"
                  placeholder="Escribe un nombre de etiqueta para crearla..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-xl pl-2 pr-10 border border-[#3c3c3c] outline-none focus:ring-1 focus:ring-[#6a5fff] focus:border-[#6a5fff] transition-all duration-200"
                />

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    onClick={handleAddTag}
                    className="size-6 cursor-pointer hover:stroke-[#6A5FFF] transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </div>

              <div className="tags mt-[8px] flex flex-wrap">
                {selectedTags.map((tag, index) => (
                  <div
                    key={index}
                    className="tag w-[120px] h-[24px] border rounded-[16px] flex flex-row items-center justify-evenly mr-[10px] mb-[8px]"
                  >
                    <div className="tag-icon flex items-center">
                      <svg
                        className="size-[18px]"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.75 4.25H12C12.3362 4.25 12.6359 4.41506 12.8145 4.66797V4.66895L15.8857 8.99902L12.8145 13.3232V13.3242C12.6328 13.5815 12.331 13.75 12 13.75H3.75C3.48478 13.75 3.23051 13.6446 3.04297 13.457C2.85543 13.2695 2.75 13.0152 2.75 12.75V5.25C2.75 4.98478 2.85543 4.73051 3.04297 4.54297C3.23051 4.35543 3.48478 4.25 3.75 4.25Z"
                          stroke="#979797"
                        />
                      </svg>
                    </div>
                    <div className="tag-name flex items-center text-[12px] font-[500] text-white">
                      {tag}
                    </div>
                    <button
                      className="tag-action flex items-center text-white"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-[16px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacidad*/}
            <div className="space-y-6 mt-9">
              {/* Opción Privado */}
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="flex-shrink-0 mt-3">
                  <input
                    type="radio"
                    value="PRIVATE"
                    checked={status === "PRIVATE"}
                    onChange={() => setStatus("PRIVATE")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${status === "PRIVATE"
                        ? "border-[#6A5FFF] bg-[#6A5FFF]"
                        : "border-gray-500 group-hover:border-gray-400"
                      }`}
                  >
                    {status === "PRIVATE" && (
                      <div className="w-1.5 h-1.5 bg-[#6A5FFF] rounded-full"></div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Icono candado */}
                  <div className="w-6 h-6 rounded-md bg-[#2B2B2B] border border-[#404040] flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>

                  <div className="text-white text-sm">
                    <p>Privado</p>
                    <p>(Solo tú y los miembros invitados pueden verlo)</p>
                  </div>
                </div>
              </label>

              {/* Opción Público */}
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="flex-shrink-0 mt-3">
                  <input
                    type="radio"
                    value="PUBLIC"
                    checked={status === "PUBLIC"}
                    onChange={() => setStatus("PUBLIC")}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${status === "PUBLIC"
                        ? "border-[#6A5FFF] bg-[#6A5FFF]"
                        : "border-gray-500 group-hover:border-gray-400"
                      }`}
                  >
                    {status === "PUBLIC" && (
                      <div className="w-1.5 h-1.5 bg-[#6A5FFF] rounded-full"></div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Icono mundo */}
                  <div className="w-6 h-6 rounded-md bg-[#2B2B2B] border border-[#404040] flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <div className="text-white text-sm">
                    <p>Público</p>
                    <p>(Cualquier miembro del equipo puede acceder)</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Botones crear y cancelar */}
            <div className="flex justify-between w-[575px] mt-14">
              <button
                className="text-[16px] text-[#6a5fff] border border-[#6a5fff] rounded-[8px] text-center w-[279px] h-[40px]"
                onClick={goToHome}
              >
                Cancelar creación
              </button>
              <button className="text-[16px] text-white bg-[#6a5fff] rounded-[8px] text-center w-[279px] h-[40px]">
                Crear tablero
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewBoard;
