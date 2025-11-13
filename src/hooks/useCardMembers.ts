import { updateListCardById } from 'services/cardService';

export function useCardMembers(form: any, setForm: Function, boardId: number, listId: number, cardId: number) {

  const handleDeleteResponsible = async (id: string) => {
    try {
      const updatedMembers = form.assignees.filter((m: any) => m.id !== id);
      await updateListCardById(boardId, listId, cardId, {
        assignee_ids: updatedMembers.map((m: any) => m.email),
      });
      setForm((prevForm: any) => ({ ...prevForm, assignees: updatedMembers }));
    } catch (error) {
      console.error("Error al eliminar responsable:", error);
    }
  };

  const handleAddResponsible = async (user: any) => {
    try {
      const exists = form.assignees.some((m: any) => m.id === user.id);
      if (exists) return;
      const updatedMembers = [...form.assignees, user];
      await updateListCardById(boardId, listId, cardId, {
        assignee_ids: updatedMembers.map((m) => m.email),
      });
      setForm((prevForm: any) => ({ ...prevForm, assignees: updatedMembers }));
    } catch (error) {
      console.error("Error al agregar responsable:", error);
    }
  };

  return {
    handleDeleteResponsible,
    handleAddResponsible,
  };
}
