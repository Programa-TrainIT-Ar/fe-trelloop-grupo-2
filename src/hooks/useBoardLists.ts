import { useEffect, useState, useCallback } from "react";
import { getBoardListsService } from "services/boardListService";
import { BoardList } from "types/boardList";


export function useBoardLists(boardId: string) {
  const [boardLists, setBoardLists] = useState<BoardList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener listas de tableros (memorizada para evitar recreación)
  const getBoardLists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBoardListsService(boardId);
      setBoardLists(data);
    } catch (err: any) {
      setError(err.message || "Error al obtener listas de tableros");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      await getBoardLists();
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false; // Evita setState en un componente desmontado
    };
  }, [getBoardLists]);

  return {
    boardLists,
    loading,
    error,
    getBoardLists,
  };
}