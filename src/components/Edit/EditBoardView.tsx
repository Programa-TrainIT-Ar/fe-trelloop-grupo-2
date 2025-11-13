import DashboardSidebar from "components/home/DashboardSidebar";
import UserNavbarEditView from "components/ui/UserNavbarEditView";
import CloseButton from "components/ui/CloseButton";
import Form from "components/Edit/form/index";
import { useEffect, useState } from "react";

type Props = {
  boardId: string;
};

export default function EditBoardView({ boardId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // En el futuro: aquí puedes hacer el fetch
  useEffect(() => {
    if (!boardId) {
      setError("ID de tablero inválido");
      setLoading(false);
      return;
    }

    // Simula delay de carga (borra esto cuando agregues el fetch real)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [boardId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#1A1A1A] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A5FFF] mx-auto mb-4"></div>
          <div className="text-white text-lg">Cargando tablero...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#1A1A1A]">
      {/*Dashboard lateral */}
      <div className="shrink-0">
        <DashboardSidebar />
      </div>

      {/*Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header con navbar */}
        <UserNavbarEditView />

        {/* Header con título y botón de cierre */}
        <div className="flex w-full items-center justify-between px-6 mb-8">
          <h1 className="text-white text-xl font-medium">Edición de tablero</h1>
          <CloseButton  />
        </div>

        {/* Contenido central */}
        <main className="flex-1 items-center w-full px-6 py-2 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Formulario centrado */}
            <Form boardId={boardId} /> {/* pasarlo al formulario por si se necesita*/}
          </div>
        </main>
      </div>
    </div>
  );
}
