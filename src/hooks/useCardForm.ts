"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "store/authStore";
import { getCardById as apiGetCardById, updateListCardById } from "services/cardService";

const initialFormState: any = {
  title: "",
  description: "",
  assignees: [],      // responsables
  members: [],        
  priority: "",
  status: "",
  tags: [],
  startDate: null,
  endDate: null,
  reminderDate: null,
};

export function useCardForm() {
  const { boardId, listId, cardId } = useParams<{ boardId: string; listId: string; cardId: string }>();
  const router = useRouter();
  const [form, setForm] = useState<any>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reminderValue, setReminderValue] = useState(0);

  const boardIdNum = Number(boardId);
  const listIdNum = Number(listId);
  const cardIdNum = Number(cardId);

  useEffect(() => {
    const fetchCard = async () => {
      const token = getToken();
      if (!token) {
        setError("No estás autenticado.");
        setLoading(false);
        return;
      }
      try {
        const payload = await apiGetCardById(boardIdNum, listIdNum, cardIdNum);
        const card = payload?.card || payload;

        // Responsables (assignees de la tarjeta)
        const assignees = (card.assignees || []).map((user: any) => ({
          id: String(user.id),
          name: `${user.name} ${user.last_name}`.trim(),
          username: user.email?.split("@")[0] || "usuario",
          email: user.email,
          img: user.avatar_url,
        }));

        // Miembros del tablero (board_members del backend)
        const members = (card.board_members || []).map((m: any) => ({
          id: String(m.id),
          name: `${m.name} ${m.last_name}`.trim(),
          email: m.email,
          img: m.avatar_url,
          role: m.role, // owner/admin/member
        }));

        const prMap: any = { Alta: "high", Media: "medium", Baja: "low" };

        setForm({
          title: card.title || "",
          description: card.description || "",
          assignees,
          members,
          priority: prMap[card.priority] || card.priority || "",
          status: card.status || "",
          tags: card.tags || [],
          startDate: card.start_date ? new Date(card.start_date) : null,
          endDate: card.end_date ? new Date(card.end_date) : null,
          reminderDate: card.reminder_date ? new Date(card.reminder_date) : null,
        });

        if (card.end_date && card.reminder_date) {
          const endDate = new Date(card.end_date);
          const reminder = new Date(card.reminder_date);
          const diffDays = Math.round((endDate.getTime() - reminder.getTime()) / (1000 * 60 * 60 * 24));
          setReminderValue(diffDays);
        }
      } catch (err: any) {
        setError(err?.message || "No se pudo cargar la tarjeta.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [boardIdNum, listIdNum, cardIdNum]);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setForm((prev: any) => ({ ...prev, startDate: start, endDate: end }));
  };

  const handleReminderChange = (value: number) => {
    setReminderValue(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let reminderDate: Date | null = null;
      if (form.endDate && reminderValue > 0) {
        const d = new Date(form.endDate);
        d.setDate(d.getDate() - reminderValue);
        reminderDate = d;
      }

      const priorityMap: any = { Alta: "high", Media: "medium", Baja: "low", high: "high", medium: "medium", low: "low" };

      const adaptFormData = {
        title: form.title,
        description: form.description,
        priority: priorityMap[form.priority] || null,
        assignee_ids: (form.assignees || []).map((m: any) => m.email), // mantiene responsables
        tags: (form.tags || []).map((t: any) => t.name),
        start_date: form.startDate ? new Date(form.startDate).toISOString().split("T")[0] : undefined,
        end_date: form.endDate ? new Date(form.endDate).toISOString().split("T")[0] : undefined,
        reminder_date: reminderDate ? reminderDate.toISOString().split("T")[0] : undefined,
        reminder_message: reminderValue > 0 ? `Recordatorio: ${reminderValue} día(s) antes` : undefined,
      } as any;

      await updateListCardById(boardIdNum, listIdNum, cardIdNum, adaptFormData);
      router.push(`/boardList/${boardId}`);
    } catch (error) {
      console.error("Error al actualizar tarjeta:", error);
    }
  };

  return { form, loading, error, reminderValue, handleFormChange, handleDateChange, handleReminderChange, handleSubmit, setForm };
}