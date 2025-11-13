"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import useInactivityLogout from "utils/useInactivityLogout";
import LoadingSkeleton from "./LoadingSkeleton";

interface Props {
    children: React.ReactNode;
}

const AuthGuard = ({ children }: Props) => {
    const router = useRouter();
    const { isAuthenticated, loading, hydrate, stopInactivityTimer } = useAuthStore();

    // Hook para manejar el auto-logout por inactividad
    useInactivityLogout();

    // Hidratación inicial del estado
    useEffect(() => {
        hydrate(); // solo la primera vez
    }, [hydrate]);

    // Redirigir si no está autenticado y ya terminó de hidratar
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        }
    }, [loading, isAuthenticated, router]);

    // Limpiar temporizador cuando el componente se desmonte (usuario cierra pestaña/ventana)
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopInactivityTimer();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // También limpiamos el temporizador si el componente se desmonta
            stopInactivityTimer();
        };
    }, [stopInactivityTimer]);

    // Mientras se hidrata
    if (loading) return <LoadingSkeleton message="Verificando sesión..."/>;

    // Mostrar contenido si está autenticado
    return <>{children}</>;
};

export default AuthGuard;
