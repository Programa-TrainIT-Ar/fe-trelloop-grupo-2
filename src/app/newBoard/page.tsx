"use client";

import Image from "next/image";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import UserCard from "@/components/UserCard";
// import TagChip from "@/components/TagChip";

const NewBoard = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  // const [members, setMembers] = useState("");
  // const [tags, setTags] = useState("");

  const [members, setMembers] = useState([
    {
      id: "member1",
      name: "nombre de usuario 1",
      username: "@user",
      img: "/assets/images/chico1.webp",
    },
    {
      id: "member2",
      name: "nombre de usuario 2",
      username: "@user2",
      img: "/assets/images/chico2.webp",
    },
  ]);

  const [tags, setTags] = useState([
    { id: "tag1", name: "Etiqueta" },
    { id: "tag2", name: "Etiqueta" },
    { id: "tag3", name: "Etiqueta" },
  ]);

  const router = useRouter();
  const goToHome = () => {
    router.push("/");
  };

  const deleteMember = (idToRemove: string) => {
    // aqui va la logica que envia un request al backend para eliminar un miembro asociado al  tablero
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== idToRemove)
    ); //elimina visualmente el miembro
  };

  const deleteTag = (idToRemove: string) => {
    // aqui va la logica que envia un request al backend para eliminar una etiqueta del tablero
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== idToRemove)); // elimina visualmente la tag
  };

  const [memberInput, setMemberInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [selectedMembers, setSelectedMembers] = useState<
    { name: string; username: string }[]
  >([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  //constantes de prueba
  const existingUsers = [
    { name: "Nombre completo", username: "@usuario" },
    { name: "Juan Pérez", username: "@jperez" },
    { name: "Ana López", username: "@alopez" },
  ];

  const existingTags = ["Etiqueta", "Frontend", "Backend", "Urgente"];

  //lógica para la busqueda y filtración de miembros y etiquetas

  const filteredUsers = existingUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(memberInput.toLowerCase()) ||
      user.username.toLowerCase().includes(memberInput.toLowerCase())
  );

  const filteredTags = existingTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleSelectMember = (user: { name: string; username: string }) => {
    if (!selectedMembers.some((m) => m.username === user.username)) {
      setSelectedMembers([...selectedMembers, user]);
      setMemberInput("");
    }
  };

  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validar que existan nombre y descripción:
    if (!name || !description) {
      setError("Por favor llena todos los campos.");
      return;
    }
    //si todo está bien, limpiar el error
    setError("");
    console.log("todo bien al 100");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="w-full bg-[#1A1A1A] text-white min-h-screen flex flex-col px-4">
        <h2 className="text-m font-semibold whitespace-nowrap p-2">
          Crear tablero
        </h2>

        <div className="flex justify-center items-center">
          <div className="min-h-screen w-1/2 text-white flex flex-col gap-4 relative overflow-visible">
            <div className="flex justify-end">
              <button
                className="text-white bg-[#6A5FFF] rounded-[20px] w-[40px] h-[40px] flex justify-center items-center"
                onClick={goToHome}
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
            </div>
            <div className="flex flex-col gap-2">
              <label className="block mb-1 text-sm">Nombre de tablero</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe aquí..."
                className="px-4 py-1 rounded-md bg-[#1a1a1a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block mb-1 text-sm">Descripción</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escribe aquí..."
                className="h-16 px-4 rounded-md bg-[#1a1a1a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <div className="text-white text-[14px] font-[500] mt-[6px] mb-[4px]">
                Miembros
              </div>

              <div className="relative w-[575px]">
                <input
                  type="text"
                  placeholder="Buscar por nombre o @usuario..."
                  className="w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-[10px] px-4 pr-10 py-2 border border-[#3a3a3a] outline-none focus:ring-2 focus:ring-[#6a5fff] transition"
                />

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

              <div className="container-miembros flex mt-[5px]">
                {members.map((member) => {
                  return (
                    <div
                      className="member flex items-center mr-[15px]"
                      key={member.id}
                    >
                      <div className="member-img mr-[5px]">
                        <Image
                          src={member.img}
                          alt="member-img"
                          width={28}
                          height={28}
                          className="pt-144 pl-498 rounded-2xl border-radius: 1rem"
                        />
                        {/* <img src="favicon.ico" className='rounded-[100px]' alt="member-img" /> */}
                      </div>
                      <div className="member-data">
                        <div className="member-name text-white">
                          {member.name}
                        </div>
                        <div className="member-username text-white">
                          {member.username}
                        </div>
                      </div>
                      <button
                        className="member-action text-white  ml-[25px]"
                        onClick={() => deleteMember(member.id)}
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
                  );
                })}
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <label className="block mb-1 text-sm">Miembros</label>
              <input
                type="text"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                placeholder="Buscar por nombre o @usuario..."
                className="px-4 py-1 rounded-md bg-[#1a1a1a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {memberInput && (
                <ul className="absolute bg-[#2a2a2a] w-full mt-1 rounded-md z-10">
                  {filteredUsers.map((user) => (
                    <li
                      key={user.username}
                      onClick={() => handleSelectMember(user)}
                      className="px-4 py-2 hover:bg-[#444] cursor-pointer flex items-center gap-2"
                    >
                      <span>👤</span>
                      <span>{user.name}</span>
                      <span className="text-gray-400">{user.username}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((m) => (
                  <div
                    key={m.username}
                    className="px-2 py-1 bg-[#333] rounded-full flex items-center gap-1 text-sm"
                  >
                    <span>👤</span>
                    {m.username}
                  </div>
                ))}
              </div>
            </div> */}

            <div className="flex flex-col gap-2">
              <label className="block mb-1 text-sm">Etiquetas</label>
              <div className="relative w-[575px]">
                <input
                  type="text"
                  placeholder="Escribe un nombre de etiqueta para crearla..."
                  className="w-full h-[41px] bg-[#1e1e1e] text-white placeholder-[#797676] rounded-[10px] px-4 pr-10 py-2 border border-[#3a3a3a] outline-none focus:ring-2 focus:ring-[#6a5fff] transition"
                />

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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </div>
              <div className="tags mt-[8px] flex ">
                {tags.map((tag) => {
                  return (
                    <div
                      className="tag w-[120px] h-[24px] border rounded-[16px] flex flex-row items-center justify-evenly mr-[10px]"
                      key={tag.id}
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
                      <div className="tag-name flex items-center text-[12px] font-[500] text-white ">
                        {tag.name}
                      </div>
                      <button
                        className="tag-action flex items-center text-white"
                        onClick={() => deleteTag(tag.id)}
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
                  );
                })}
              </div>
              {/* <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Escribe un nombre de etiqueta para crearla..."
                className="px-4 py-1 rounded-md bg-[#1a1a1a] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {tagInput && (
                <ul className="absolute bg-[#2a2a2a] w-full mt-1 rounded-md z-10">
                  {filteredTags.map((tag) => (
                    <li
                      key={tag}
                      onClick={() => handleSelectTag(tag)}
                      className="px-4 py-2 hover:bg-[#444] cursor-pointer"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )} */}
            </div>
            {/* <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="px-2 py-1 bg-[#333] rounded-full text-sm"
                >
                  #{tag}
                </div>
              ))}
            </div> */}

            {/* <div className="flex items-center">
              <input
                id="link-radio"
                type="radio"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Privado
              </label>
            </div> */}

            <div className="visibility-container text-white mt-[40px] mb-[40px]">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  id="private"
                  className="mr-[8px]"
                />
                <label htmlFor="private" className="flex items-center">
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  <div className="private-text-container ml-[8px]">
                    <div className="private-text">Privado</div>
                    <div className="private-description">
                      (Solo tu y los miembros invitados pueden verlo)
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  id="public"
                  className="mr-[8px]"
                />
                <label htmlFor="public" className="flex items-center">
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
                      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                    />
                  </svg>
                  <div className="public-text-container ml-[8px]">
                    <div className="public-text">Público</div>
                    <div className="public-description">
                      (Cualquier miembro del equipo puede acceder)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="link-radio"
                type="radio"
                value=""
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Público
              </label>
            </div>

            <div className="grid grid-cols-2 gap-x-6 pb-8">
              <button className="w-full bg-[#1a1a1a1a] hover:bg-[#1a1a1a] text-primary-600 py-1 border border-primary-600 rounded-md transition duration-200">
                Cancelar creación
              </button>
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-1 rounded-md transition duration-200">
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
