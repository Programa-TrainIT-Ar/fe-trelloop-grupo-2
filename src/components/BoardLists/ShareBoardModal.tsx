"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { XMarkIcon, LinkIcon } from "@heroicons/react/24/outline";
import {
  searchUsers,
  getBoardDetails,
  addBoardMember,
  updateBoardMemberRole,
  removeBoardMember,
} from "../../services/boardService";

interface ShareBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
}

type ServerRole = "owner" | "admin" | "member";
type UiRole = "Administrador" | "Miembro";

interface BoardMember {
  id: string;             // user_id
  name: string;
  email: string;
  avatar: string;
  role: UiRole;           // para UI
  roleServer: ServerRole; // real backend
}

// Para mostrar en la UI
const toUiRole = (r: ServerRole): UiRole =>
  r === "admin" || r === "owner" ? "Administrador" : "Miembro";

// Para enviar al backend (solo acepta admin|member en POST /members)
type MemberAdmin = "admin" | "member";
const toMemberAdmin = (r: UiRole): MemberAdmin =>
  r === "Administrador" ? "admin" : "member";

export default function ShareBoardModal({ isOpen, onClose, boardId }: ShareBoardModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UiRole>("Miembro");
  const [boardLink] = useState("www.url1.com");

  const [members, setMembers] = useState<BoardMember[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string; email: string; avatar_url?: string }>>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; email: string } | null>(null);

  const [currentUserRole, setCurrentUserRole] = useState<ServerRole | null>(null);
  const canManage = useMemo(() => currentUserRole === "owner" || currentUserRole === "admin", [currentUserRole]);

  const typingRef = useRef<number | undefined>(undefined);

  // Cargar miembros & rol actual al abrir
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const data = await getBoardDetails(boardId);
        setCurrentUserRole((data?.current_user_role || null) as ServerRole | null);

        const ms: BoardMember[] = (data?.members || []).map((m: any) => ({
          id: String(m.id),
          name: `${m.name}${m.last_name ? " " + m.last_name : ""}`.trim(),
          email: m.email,
          avatar: m.avatar_url || "/assets/icons/avatar1.png",
          roleServer: (m.role || "member") as ServerRole,
          role: toUiRole((m.role || "member") as ServerRole),
        }));
        setMembers(ms);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isOpen, boardId]);

  // Búsqueda con debounce
  useEffect(() => {
    if (!isOpen) return;
    if (typingRef.current) window.clearTimeout(typingRef.current);
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSelectedUser(null);
      return;
    }
    typingRef.current = window.setTimeout(async () => {
      try {
        const res = await searchUsers(searchQuery.trim());
        setSuggestions(
          (res || []).map((u: any) => ({
            id: String(u.id),
            name: `${u.name}${u.last_name ? " " + u.last_name : ""}`.trim(),
            email: u.email,
            avatar_url: u.avatar_url,
          }))
        );
      } catch {
        setSuggestions([]);
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Compartir (agregar miembro)
  const handleShare = async () => {
    if (!selectedUser) return;
      try {
        await addBoardMember(boardId, {
    email: selectedUser.email,
    role: toMemberAdmin(selectedRole),
  });
  
      const data = await getBoardDetails(boardId);
      const ms: BoardMember[] = (data?.members || []).map((m: any) => ({
        id: String(m.id),
        name: `${m.name}${m.last_name ? " " + m.last_name : ""}`.trim(),
        email: m.email,
        avatar: m.avatar_url || "/assets/icons/avatar1.png",
        roleServer: (m.role || "member") as ServerRole,
        role: toUiRole((m.role || "member") as ServerRole),
      }));
      setMembers(ms);
      setSearchQuery("");
      setSelectedUser(null);
      setSuggestions([]);
    } catch (e: any) {
      alert(e?.message || "No se pudo agregar el miembro");
    }
  };

  const handleCopyLink = () => navigator.clipboard.writeText(boardLink);

  // Cambiar rol / eliminar
  const handleRoleChange = async (memberId: string, newUiRole: UiRole | "Eliminar") => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    try {
      if (newUiRole === "Eliminar") {
        if (!canManage || member.roleServer === "owner") return;
        await removeBoardMember(boardId, memberId);
      } else {
        await updateBoardMemberRole(boardId, memberId, toMemberAdmin(newUiRole));
      }
      const data = await getBoardDetails(boardId);
      const ms: BoardMember[] = (data?.members || []).map((m: any) => ({
        id: String(m.id),
        name: `${m.name}${m.last_name ? " " + m.last_name : ""}`.trim(),
        email: m.email,
        avatar: m.avatar_url || "/assets/icons/avatar1.png",
        roleServer: (m.role || "member") as ServerRole,
        role: toUiRole((m.role || "member") as ServerRole),
      }));
      setMembers(ms);
      setCurrentUserRole((data?.current_user_role || null) as ServerRole | null);
    } catch (e: any) {
      alert(e?.message || "Operación no permitida");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute top-14 right-8 bg-[#1e1e1e] rounded-lg w-[800px] max-h-[85vh] border border-[#3a3a3a] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <h2 className="text-xl font-semibold text-white">Compartir tablero</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Búsqueda + Compartir */}
          <div className="space-y-4 border-b border-[#3a3a3a] pb-6">
            <div className="space-y-2">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email..."
                    value={selectedUser ? selectedUser.email : searchQuery}
                    onChange={(e) => { setSelectedUser(null); setSearchQuery(e.target.value); }}
                    className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#6a5fff] focus:border-transparent outline-none"
                  />
                  {suggestions.length > 0 && !selectedUser && (
                    <div className="absolute z-10 mt-1 w-full bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg max-h-56 overflow-auto">
                      {suggestions.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => { setSelectedUser({ id: u.id, name: u.name, email: u.email }); setSuggestions([]); }}
                          className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-white"
                        >
                          <div className="flex items-center gap-2">
                            <img src={u.avatar_url || "/assets/icons/avatar1.png"} className="w-6 h-6 rounded-full" />
                            <div className="flex flex-col">
                              <span className="text-sm">{u.name}</span>
                              <span className="text-xs text-gray-400">{u.email}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UiRole)}
                  className="px-6 py-2 bg-[#000000] border border-[#000000] rounded-lg text-white focus:ring-2 focus:ring-[#6a5fff] focus:border-transparent outline-none"
                  disabled={!canManage}
                >
                  <option value="Miembro">Miembro</option>
                  <option value="Administrador">Administrador</option>
                </select>

                <button
                  onClick={handleShare}
                  disabled={!selectedUser || !canManage}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    !selectedUser || !canManage
                      ? "bg-[#3e3e3e] text-gray-300 cursor-not-allowed"
                      : "bg-[#6A5FFF] text-white hover:bg-[#5a4fef]"
                  }`}
                >
                  + Compartir
                </button>
              </div>

              {/* Enlace (visual) */}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 p-4 bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] w-full">
                    <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-white font-mono text-sm w-full">{boardLink}</span>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <button onClick={handleCopyLink} className="text-white hover:text-[#5a4fef] text-sm underline">
                      Copiar enlace
                    </button>
                    <button className="text-white hover:text-red-300 text-sm underline">
                      Eliminar enlace
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-4 max-w-[200px]">Cualquiera que tenga el enlace puede unirse como miembro</p>
              </div>
            </div>
          </div>

          {/* Miembros */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Miembros del tablero</h3>
              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{members.length}</span>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {members.map((member) => {
                const showDelete = canManage && member.roleServer !== "owner";
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-white text-sm">{member.role}</p>
                      </div>
                    </div>
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as UiRole | "Eliminar")}
                      className="px-4 py-2 bg-[#000000] border border-[#000000] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#6a5fff] focus:border-transparent outline-none"
                      disabled={!canManage}
                    >
                      <option value="Miembro">Miembro</option>
                      <option value="Administrador">Administrador</option>
                      {showDelete && <option value="Eliminar" className="text-red-400">Eliminar</option>}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}