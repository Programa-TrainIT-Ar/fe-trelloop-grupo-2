import { useEffect, useState } from "react";
import { getToken } from "../../../../store/authStore"; // Asegúrate que esta ruta sea válida

type UserResult = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
};

export const useMemberSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      const fetchUsers = async () => {
        const token = getToken();

        if (!token) {
          console.warn("No se encontró token para autenticación.");
          return;
        }

        setLoading(true);

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?q=${encodeURIComponent(query)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error en la respuesta: ${res.status} - ${text}`);
          }

          const data = await res.json();
          setResults(data || []);
        } catch (error) {
          console.error("Error buscando usuarios:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
  };
};
