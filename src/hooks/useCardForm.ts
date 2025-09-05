import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getToken } from 'store/authStore';
import { updateListCardById } from 'services/cardService';

const initialFormState = {
  title: '',
  description: '',
  assignees: [],
  priority: '',
  status: '',
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
        setError('No estás autenticado.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('No se pudo cargar el tablero.');
        }

        const data = await res.json();
        const list = data.lists.find((l: any) => l.id === listIdNum);
        const card = list?.cards.find((c: any) => c.id === cardIdNum);

        if (card) {
          const assignees = (card.assignees || []).map((user: any) => ({
            id: String(user.id),
            name: `${user.name} ${user.last_name}`.trim(),
            username: user.email?.split('@')[0] || 'usuario',
            email: user.email,
            img: user.avatar_url,
          }));

          const startDate = card.start_date ? new Date(card.start_date) : null;
          const endDate = card.end_date ? new Date(card.end_date) : null;
          const reminderDate = card.reminder_date ? new Date(card.reminder_date) : null;

          const priorityMap: { [key: string]: string } = {
            'Alta': 'high',
            'Media': 'medium',
            'Baja': 'low',
          };

          setForm({
            title: card.title || '',
            description: card.description || '',
            assignees: assignees,
            priority: priorityMap[card.priority] || card.priority || '',
            status: card.status || '',
            tags: card.tags || [],
            startDate: startDate,
            endDate: endDate,
            reminderDate: reminderDate,
          });

          if (endDate && reminderDate) {
            const diffTime = endDate.getTime() - reminderDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            setReminderValue(diffDays);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [boardId, listIdNum, cardIdNum]);

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
      let reminderDate = null;
      if (form.endDate && reminderValue > 0) {
        reminderDate = new Date(form.endDate);
        reminderDate.setDate(reminderDate.getDate() - reminderValue);
      }

      const priorityMap: { [key: string]: string } = {
        'Alta': 'high',
        'Media': 'medium',
        'Baja': 'low',
        'high': 'high',
        'medium': 'medium',
        'low': 'low',
      };

      const adaptFormData = {
        title: form.title,
        description: form.description,
        priority: priorityMap[form.priority] || null,
        assignee_ids: form.assignees.map((m: any) => m.email),
        tags: form.tags.map((t: any) => t.name),
        start_date: form.startDate?.toISOString().split('T')[0],
        end_date: form.endDate?.toISOString().split('T')[0],
        reminder_date: reminderDate?.toISOString().split('T')[0],
        reminder_message: reminderValue > 0 ? `Recordatorio: ${reminderValue} día(s) antes` : null,
      };

      await updateListCardById(boardIdNum, listIdNum, cardIdNum, adaptFormData);
      router.push(`/boardList/${boardId}`);
    } catch (error) {
      console.error('Error al actualizar tarjeta:', error);
    }
  };

  return {
    form,
    loading,
    error,
    reminderValue,
    handleFormChange,
    handleDateChange,
    handleReminderChange,
    handleSubmit,
    setForm, // por si necesita manipulacion directa del estado 
  };
}
