"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardSidebar from "components/home/DashboardSidebar";
import UserNavbar from "components/home/UserNavbar";
import { useCardForm } from "hooks/useCardForm";
import { deleteCardById, moveCardToList } from "services/cardService";
import { getBoardListsService } from "services/boardListService";

/* ---------- Utils ---------- */
const norm = (s: string) => s?.toLowerCase().replace(/[_-]/g, " ").trim();

function getPriorityChip(priorityRaw: string | undefined) {
  const p = norm(String(priorityRaw || ""));
  if (!p) return null;
  if (["alta", "high"].includes(p))
    return { label: "Alta prioridad", style: { backgroundColor: "rgba(167,0,0,1)", color: "#fff" } };
  if (["media", "medium"].includes(p))
    return { label: "Media", style: { backgroundColor: "rgba(223,130,0,1)", color: "#111" } };
  if (["baja", "low"].includes(p))
    return { label: "Baja", style: { backgroundColor: "rgba(102,112,133,1)", color: "#fff" } };
  return null;
}

const PALETTE = ["#2E90FA", "#12B76A", "#F59E0B", "#A855F7", "#EF4444", "#06B6D4", "#F97316", "#22C55E", "#EAB308", "#DB2777"];
const hashIndex = (str: string, mod: number) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % mod;
};
const contrastText = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#111" : "#fff";
};

function Pill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      className="px-3 py-0.5 rounded-[16px] text-[11px]"
      style={{ backgroundColor: "#414141", color: "#E5E7EB", ...style }}
    >
      {children}
    </span>
  );
}

/* ---------- Subtareas (mock) ---------- */
type MockSubtask = { id: number; title: string; assignee: string; due?: string | null; done: boolean };
const MOCK_SUBTASKS: MockSubtask[] = [
  { id: 1, title: "Implementar diseño", assignee: "Iván Andrade", due: null, done: true },
  { id: 2, title: "Implementar diseño", assignee: "Iván Andrade", due: "DD-MM-YYYY", done: false },
  { id: 3, title: "Implementar diseño", assignee: "Iván Andrade", due: "DD-MM-YYYY", done: false },
];

/* ---------- Comentarios (mock) ---------- */
type CommentItem = { id: number; author: string; avatar?: string; body: string; dateLabel: string };
function CommentsPanel() {
  const [comments, setComments] = React.useState<CommentItem[]>([
    {
      id: 1,
      author: "Nombre completo",
      avatar: "/assets/icons/avatar3.png", // ← icono solicitado
      body:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      dateLabel: "hace 8 horas",
    },
    {
      id: 2,
      author: "Nombre completo",
      avatar: "/assets/icons/avatar3.png", // ← icono solicitado
      body:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      dateLabel: "ayer",
    },
  ]);

  const [newComment, setNewComment] = React.useState("");
  const addComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => [
      { id: Date.now(), author: "Tú", avatar: "/assets/icons/avatar3.png", body: text, dateLabel: "ahora" },
      ...prev,
    ]);
    setNewComment("");
  };

  const isEmpty = newComment.trim().length === 0;

  return (
    <div className="rounded-lg bg-[#272727] p-4 border border-[rgba(60,60,60,0.7)]">
      {/* Título con icono correcto */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src="/assets/icons/messages-square.png"
          alt="Comentarios"
          width={18}
          height={18}
          className="opacity-80"
        />
        <span className="text-[13px] font-medium">Comentarios</span>
      </div>

      {/* Caja de entrada + botón (en columna, botón debajo) */}
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1f1f1f] flex items-center justify-center shrink-0">
            <img
              src="/assets/icons/avatar3.png"
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e: any) => (e.currentTarget.style.display = "none")}
            />
          </div>

          {/* Input con medidas exactas */}
          <textarea
            placeholder="Escribe aquí..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="placeholder-[#797676] focus:outline-none"
            style={{
              width: 332,
              height: 80,
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(60, 60, 60, 0.7)",
              borderRadius: 10,
              padding: "10px 10px",
              backdropFilter: "blur(3.6px)",
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "100%",
              color: "#E5E7EB",
            }}
          />
        </div>

        {/* Botón Enviar (debajo, alineado a la derecha) */}
        <div className="flex justify-end mt-2 pl-11">
          <button
            type="button"
            onClick={addComment}
            disabled={isEmpty}
            style={{
              width: 110,
              height: 37,
              background: "rgba(106, 95, 255, 1)",
              opacity: isEmpty ? 0.5 : 1,          // ← cambia con el contenido
              borderRadius: 8,
              padding: "8px 16px",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "100%",
              color: "rgba(255, 255, 255, 1)",
              cursor: isEmpty ? "not-allowed" : "pointer",
            }}
            className="transition-opacity"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="mt-4 max-h-[420px] overflow-y-auto pr-2 flex flex-col gap-5">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 overflow-hidden">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1f1f1f] flex-shrink-0">
              <img
                src={c.avatar || "/assets/icons/avatar3.png"}
                alt={c.author}
                className="w-full h-full object-cover"
                onError={(e: any) => (e.currentTarget.src = "/assets/icons/avatar3.png")}
              />
            </div>

            {/* Contenido */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">{c.author}</span>
                  <span className="text-[11px] opacity-60">{c.dateLabel}</span>
                </div>
                <button className="p-1 rounded hover:bg-[#333]" title="Opciones">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-[13px] leading-[1.4] opacity-90">{c.body}</p>
              <button type="button" className="mt-2 text-[11px] opacity-70 hover:opacity-100">
                Responder
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

/* ---------- Vista Detallada ---------- */
export default function CardDetail() {
  const router = useRouter();
  const params = useParams<{ boardId: string; listId: string; cardId: string }>();
  const boardId = Number(params.boardId);
  const listId = Number(params.listId);
  const cardId = Number(params.cardId);

  const { form, loading, error, handleFormChange, handleDateChange, handleSubmit } = useCardForm();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showMoveArea, setShowMoveArea] = useState(true); // área del select visible por defecto
  const [lists, setLists] = useState<{ id: number; name: string }[]>([]);
  const [moving, setMoving] = useState(false);
  const [targetList, setTargetList] = useState<number | null>(null);

  // confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tabs locales
  const [activeTab, setActiveTab] = useState<"detallada" | "secciones">("detallada");

  // subtareas locales
  const [subtasks, setSubtasks] = useState(MOCK_SUBTASKS);
  const completed = subtasks.filter((t) => t.done).length;
  const progressPct = subtasks.length ? Math.round((completed / subtasks.length) * 100) : 0;

  // Fecha – helpers para DD-MM-YYYY + date picker anclado
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const formatDDMMYYYY = (d: Date | null) => {
    if (!d) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };
  const parseDDMMYYYY = (str: string): Date | null => {
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(str.trim());
    if (!m) return null;
    const dd = Number(m[1]), mm = Number(m[2]), yyyy = Number(m[3]);
    const d = new Date(yyyy, mm - 1, dd);
    return d && d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd ? d : null;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getBoardListsService(String(boardId));
        setLists((data || []).map((l: any) => ({ id: l.id, name: l.name })));
      } catch {}
    })();
  }, [boardId]);

  const priorityChip = useMemo(() => getPriorityChip(form.priority), [form.priority]);
  const currentListName = lists.find((l) => l.id === listId)?.name || "";
  const listBg = useMemo(
    () => (currentListName ? PALETTE[hashIndex(currentListName, PALETTE.length)] : "#2B2B2B"),
    [currentListName]
  );
  const listText = useMemo(() => contrastText(listBg), [listBg]);

  // ---- Mover tarjeta
  const onMove = async () => {
    if (!targetList) return;
    try {
      setMoving(true);
      await moveCardToList(boardId, listId, cardId, targetList);
      router.push(`/boardList/${boardId}`);
    } catch {
      alert("No se pudo mover la tarjeta");
    } finally {
      setMoving(false);
      setMenuOpen(false);
    }
  };

  // ---- Eliminar (confirm modal)
  const openDeleteConfirm = () => {
    setMenuOpen(false);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCardById(boardId, listId, cardId);
      router.push(`/boardList/${boardId}`);
    } catch (e: any) {
      alert(e?.message || "Error eliminando la tarjeta");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // cerrar menú al hacer click fuera o ESC
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowDeleteModal(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  if (loading) return <div className="p-6 text-white">Cargando tarjeta...</div>;
  if (error) return <div className="p-6 text-red-300">{error}</div>;

  return (
    <div className="flex min-h-screen w-full bg-[#191919]">
      {/* Sidebar */}
      <div
        className="shrink-0 minh-screen min-h-screen"
        style={{ background: "rgba(0, 0, 0, 0.07)", borderRight: "1px solid rgba(43, 43, 43, 1)" }}
      >
        <DashboardSidebar />
      </div>

      {/* Contenido */}
      <div className="min-w-0 w-full text-white">
        <UserNavbar showCreateBoardButton={false} />

        <div className="px-6 pb-10">
          {/* Barra superior */}
          <div className="w-[1124px] max-w-full mx-auto">
            <div className="flex items-center justify-between h-[40px] rounded-lg border border-[rgba(60,60,60,0.7)] bg-[#272727] px-4">
              {/* Izquierda: volver */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/boardList/${boardId}`)}
                  className="p-1 rounded hover:bg-[#333]"
                  aria-label="Volver"
                >
                  <img src="/assets/icons/arrow-left.png" alt="Volver" className="w-5 h-5" />
                </button>
                <span className="opacity-70">Volver</span>
              </div>

              {/* Derecha: menú + cerrar */}
              <div className="relative flex items-center gap-1" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1 rounded hover:bg-[#333]"
                  aria-label="Opciones"
                >
                  <img src="/assets/icons/ellipsis.svg" className="w-6 h-6 rotate-90" alt="opciones" />
                </button>

                <button
                  onClick={() => router.push(`/boardList/${boardId}`)}
                  className="p-1 rounded hover:bg-[#333]"
                  aria-label="Cerrar"
                  title="Cerrar"
                >
                  <img src="/assets/icons/x.png" className="w-4 h-4" alt="Cerrar" />
                </button>

                {/* Modal de opciones (tres puntos) */}
                {menuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 z-20 rounded-[8px]"
                    style={{
                      width: 249,
                      background: "rgba(0,0,0,1)",
                      padding: "16px 20px 16px 16px",
                    }}
                  >
                    {/* Item: Mover tarjeta de lista */}
                    <button
                      type="button"
                      onClick={() => setShowMoveArea((v) => !v)}
                      className="w-full flex items-center gap-2 rounded hover:bg-[#111]"
                      style={{ padding: "8px 16px" }}
                    >
                      <img src="/assets/icons/arrow-left-right.png" width={20} height={20} alt="" />
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "100%",
                        }}
                      >
                        Mover tarjeta de lista
                      </span>
                    </button>

                    {/* Área con select + botón (ajustada para no desbordar) */}
                    {showMoveArea && (
                      <div className="mt-2 px-4 w-full">
                        <div className="flex items-center gap-2 w-full">
                          <select
                            className="flex-1 min-w-0 bg-[#2b2b2b] border border-[rgba(60,60,60,0.7)] rounded px-2 py-1"
                            value={targetList ?? ""}
                            onChange={(e) => setTargetList(Number(e.target.value))}
                          >
                            <option value="" disabled>
                              Selecciona una lista
                            </option>
                            {lists.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.name}
                              </option>
                            ))}
                          </select>
                          <button
                            disabled={!targetList || moving}
                            onClick={onMove}
                            className="shrink-0 px-3 py-1 rounded bg-[#6A5FFF] text-white disabled:opacity-50"
                          >
                            Mover
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Item: Eliminar tarjeta */}
                    <button
                      type="button"
                      onClick={openDeleteConfirm}
                      className="mt-2 w-full flex items-center gap-2 rounded hover:bg-[#111]"
                      style={{ padding: "8px 16px" }}
                    >
                      <img src="/assets/icons/lucide_trash-2.png" width={18} height={18} alt="" />
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: "100%",
                        }}
                      >
                        Eliminar tarjeta
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cuerpo principal (GRID para alinear Comentarios con la Descripción) */}
          <div className="mt-4 w-[1124px] max-w-full mx-auto grid grid-cols-[1fr_360px] gap-4 items-start">
            {/* Fila 1, Col 1: Chips + título */}
            <div className="rounded-lg bg-[#272727] p-4 border border-[rgba(60,60,60,0.7)]">
              <div className="flex items-center gap-2 mb-3">
                {priorityChip && <Pill style={priorityChip.style}>{priorityChip.label}</Pill>}
                {currentListName && <Pill style={{ backgroundColor: listBg, color: listText }}>{currentListName}</Pill>}
              </div>
              <input
                className="bg-transparent text-xl font-semibold focus:outline-none placeholder-gray-400 w-full"
                placeholder="Título de la tarjeta"
                value={form.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>

            {/* Fila 1, Col 2: vacío a propósito para que la columna de comentarios arranque en la fila 2 */}
            <div />

            {/* Fila 2, Col 1: resto del contenido izquierdo */}
            <div className="flex flex-col gap-4">
              {/* Descripción */}
              <div className="rounded-lg bg-[#272727] p-4 border border-[rgba(60,60,60,0.7)]">
                <label className="block mb-2 opacity-70">Descripción</label>
                <textarea
                  className="w-full h-[124px] bg-[#1f1f1f] rounded p-3 border border-[rgba(60,60,60,0.7)] focus:outline-none"
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Escribe aquí..."
                />
              </div>

              {/* Responsable / Miembros / Fecha */}
              <div className="rounded-lg bg-[#272727] p-4 border border-[rgba(60,60,60,0.7)]">
                <div className="grid grid-cols-3 gap-4">
                  {/* Responsables */}
                  <div>
                    <div className="text-sm opacity-70 mb-1">Responsable</div>
                    <div className="flex -space-x-2">
                      {(form.assignees || []).slice(0, 5).map((m: any) => (
                        <img
                          key={`a-${m.id}`}
                          src={m.img || "/assets/avatars/default.png"}
                          alt={m.name}
                          className="w-7 h-7 rounded-full border border-black object-cover"
                          onError={(e: any) => (e.currentTarget.src = "/assets/avatars/default.png")}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Miembros */}
                  <div>
                    <div className="text-sm opacity-70 mb-1">Miembros</div>
                    <div className="flex -space-x-2">
                      {(form.members || []).slice(0, 5).map((m: any) => (
                        <img
                          key={`m-${m.id}`}
                          src={m.img || "/assets/avatars/default.png"}
                          alt={m.name}
                          title={m.role ? `${m.name} · ${m.role}` : m.name}
                          className="w-7 h-7 rounded-full border border-black object-cover"
                          onError={(e: any) => (e.currentTarget.src = "/assets/avatars/default.png")}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Fecha de tarjeta — estilos + picker anclado */}
                  <div>
                    <div className="text-sm opacity-70 mb-1">Fecha de tarjeta</div>
                    <div
                      className="relative"
                      style={{
                        width: 215.6839,
                        height: 40,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(60,60,60,0.7)",
                        borderRadius: 8,
                        padding: "0 16px",     // el padding lo manejamos con pr en el input
                      }}
                    >
                      {/* Input ocupa todo y deja espacio a la derecha para el icono */}
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="DD-MM-YYYY"
                        value={formatDDMMYYYY(form.endDate)}
                        onChange={(e) => {
                          const d = parseDDMMYYYY(e.target.value);
                          handleDateChange([form.startDate ? new Date(form.startDate) : null, d]);
                        }}
                        className="w-full h-full bg-transparent outline-none text-[14px] pr-10"
                        style={{ fontFamily: "Roboto", fontWeight: 400, lineHeight: "100%", color: "rgba(113,113,113,1)" }}
                      />

                      {/* Icono POSICIONADO ABSOLUTO dentro del contenedor */}
                      <button
                        type="button"
                        onClick={() => datePickerRef.current?.showPicker?.() || datePickerRef.current?.click()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-[1] p-1 rounded hover:bg-[#2f2f2f]"
                        title="Abrir calendario"
                      >
                        <img src="/assets/icons/calendar-days.png" alt="calendar" width={20} height={20} />
                      </button>

                      {/* input date oculto para lanzar el picker (anclado al mismo sitio) */}
                      <input
                        ref={datePickerRef}
                        type="date"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0"
                        style={{ width: 1, height: 1, pointerEvents: "none" }}
                        value={form.endDate ? new Date(form.endDate).toISOString().slice(0, 10) : ""}
                        onChange={(e) => {
                          const v = e.target.value; // YYYY-MM-DD
                          const d = v ? new Date(v) : null;
                          handleDateChange([form.startDate ? new Date(form.startDate) : null, d]);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista: Detallada / Secciones */}
              <div className="flex items-center gap-2">
                <span
                  className="select-none"
                  style={{
                    width: 39.5,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: "100%",
                  }}
                >
                  Vista:
                </span>

                <div
                  className="flex items-center"
                  style={{
                    width: 302,
                    height: 48,
                    gap: 24,
                    padding: 8,
                    background: "rgba(33,33,33,1)",
                    border: "1px solid rgba(33,33,33,1)",
                    borderRadius: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("detallada")}
                    className="flex items-center justify-center gap-2"
                    style={{
                      width: 135,
                      height: 32,
                      borderRadius: 8,
                      padding: "4px 8px",
                      background: activeTab === "detallada" ? "rgba(106,95,255,1)" : "rgba(33,33,33,1)",
                      opacity: 1,
                    }}
                  >
                    <img src="/assets/icons/layout-dashboard.png" width={24} height={24} alt="" />
                    <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 14, lineHeight: "100%" }}>
                      Detallada
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("secciones")}
                    className="flex items-center justify-center gap-2 border border-[rgba(60,60,60,0.7)]"
                    style={{
                      width: 135,
                      height: 32,
                      borderRadius: 8,
                      padding: "4px 8px",
                      background: activeTab === "secciones" ? "rgba(106,95,255,1)" : "rgba(33,33,33,1)",
                      opacity: activeTab === "secciones" ? 1 : 0.9,
                    }}
                  >
                    <img src="/assets/icons/panel-right-open.png" width={24} height={24} alt="" />
                    <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 14, lineHeight: "100%" }}>
                      Secciones
                    </span>
                  </button>
                </div>
              </div>

              {/* Subtareas */}
              <div className="rounded-lg bg-[#272727] p-4 border border-[rgba(60,60,60,0.7)]">
                <div className="mb-2 font-semibold">Subtareas</div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm opacity-80">
                    <span>
                      <b>{completed}</b> de <b>{subtasks.length}</b> completadas
                    </span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="mt-2 h-[6px] rounded bg-[#3A3A3A] overflow-hidden">
                    <div className="h-full bg-[#6A5FFF]" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-[28px,1fr,220px,160px,120px] items-center text-sm opacity-70 pb-2 border-b border-[rgba(60,60,60,0.7)]">
                    <div />
                    <div>Descripción</div>
                    <div>Responsable</div>
                    <div>Fecha límite</div>
                    <div className="text-center">Acciones</div>
                  </div>

                  <div className="max-h-[210px] overflow-y-auto pr-1 mt-1">
                    {subtasks.map((t) => (
                      <div
                        key={t.id}
                        className="grid grid-cols-[28px,1fr,220px,160px,120px] items-center text-sm py-3 border-b border-[rgba(60,60,60,0.4)]"
                      >
                        <div>
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() =>
                              setSubtasks((prev) => prev.map((s) => (s.id === t.id ? { ...s, done: !s.done } : s)))
                            }
                            className="w-[16px] h-[16px] rounded-[3px] appearance-none cursor-pointer"
                            style={{
                              // desmarcado: borde gris exacto
                              border: t.done ? "1px solid #6A5FFF" : "1px solid rgba(116, 113, 113, 1)",
                              backgroundColor: t.done ? "#6A5FFF" : "transparent",
                              // marcado: check blanco
                              backgroundImage: t.done
                                ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M6.1 11.2l-3-3 .8-.8 2.2 2.1 4.9-4.9.8.8z'/%3E%3C/svg%3E\")"
                                : "none",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundSize: "12px 12px",
                              transition: "all 120ms ease-in-out",
                            }}
                          />
                        </div>

                        <div className={t.done ? "line-through opacity-60" : ""}>{t.title}</div>
                        <div className="opacity-80">{t.assignee}</div>
                        <div className="opacity-70">{t.due || "DD-MM-YYYY"}</div>
                        <div className="flex items-center justify-center gap-4">
                          <button className="opacity-80 hover:opacity-100" title="Editar" type="button">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </button>
                          <button
                            className="opacity-80 hover:opacity-100"
                            title="Eliminar"
                            type="button"
                            onClick={() => setSubtasks((prev) => prev.filter((s) => s.id !== t.id))}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSubtasks((prev) => [
                        ...prev,
                        { id: Date.now(), title: "Nueva subtarea", assignee: "Iván Andrade", due: "DD-MM-YYYY", done: false },
                      ])
                    }
                    className="mt-3 w-full h-[36px] rounded-[8px] border border-[rgba(60,60,60,0.7)] hover:bg-[#2f2f2f] flex items-center justify-center gap-2"
                  >
                    <span className="text-lg leading-none">+</span> Agregar subtarea
                  </button>
                </div>
              </div>

              {/* Seguimiento (mock) */}
              <div className="rounded-lg bg-[#272727] p-4 border border-[rgba(60,60,60,0.7)]">
                <div className="mb-3 font-semibold">Seguimiento</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-[88px] rounded-lg border border-[rgba(60,60,60,0.7)] bg-[rgba(46,144,250,1)] p-4">
                    <div className="text-sm">Tiempo estimado</div>
                    <div className="text-2xl font-bold">40 horas</div>
                  </div>
                  <div className="h-[88px] rounded-lg border border-[rgba(60,60,60,0.7)] bg-[rgba(223,130,0,1)] p-4">
                    <div className="text-sm">Tiempo trabajado</div>
                    <div className="text-2xl font-bold">20 horas</div>
                  </div>
                  <div className="h-[88px] rounded-lg border border-[rgba(60,60,60,0.7)] bg-[rgba(167,0,0,1)] p-4">
                    <div className="text-sm">% Progreso</div>
                    <div className="text-2xl font-bold">33%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila 2, Col 2: Comentarios (arranca a la altura de la Descripción) */}
            <div className="">
              <CommentsPanel />
            </div>
          </div>

          {/* Botones al final */}
          <div className="mt-6 w-[1124px] max-w-full mx-auto flex justify-end gap-4">
            <button
              onClick={() => router.push(`/boardList/${boardId}`)}
              className="w-[332px] h-[37px] rounded-[8px] border border-[#6A5FFF] hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit as any}
              className="w-[332px] h-[37px] rounded-[8px] bg-[#6A5FFF] hover:bg-[#5A4FEF] text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Modal confirmación eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60">
          <div className="w-[460px] h-[274px] bg-[#222222] rounded-[16px] flex flex-col items-center px-6 py-4 relative">
            <img src="/assets/icons/alert.png" alt="Alerta" className="w-[72px] h-[72px] mt-2" />
            <p className="text-white text-center font-poppins text-[14px] font-normal leading-[180%] mt-6">
              ¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no será reversible.
            </p>
            <div className="flex justify-between mt-auto mb-4 gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setActiveTab("detallada");
                }}
                disabled={isDeleting}
                className="w-[180px] h-[32px] border border-[#6A5FFF] rounded-[8px] text-white text-[14px] hover:opacity-90 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-[180px] h-[32px] bg-[#FB7A7A] rounded-[8px] text-white text-[14px] font-medium hover:opacity-90 disabled:opacity-60"
              >
                {isDeleting ? "Eliminando..." : "Eliminar tarjeta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}