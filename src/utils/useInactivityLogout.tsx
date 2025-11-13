import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Hook para detectar actividad del usuario y reiniciar el temporizador de inactividad
 * Este hook debe usarse en componentes que estén siempre montados, como AuthGuard
 */
export const useInactivityLogout = () => {
  const { resetInactivityTimer, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Solo configurar los listeners si el usuario está autenticado
    if (!isAuthenticated) return;

    // Lista de eventos que consideramos como "actividad"
    const activityEvents = [
      'mousemove',
      'click', 
      'keydown',
      'scroll',
      'touchstart'
    ];

    // Función que se ejecuta cuando hay actividad
    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Agregar listeners para todos los eventos de actividad
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // También detectamos cuando la ventana pierde el foco (usuario cambió de pestaña)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Cuando la ventana vuelve a tener foco, reiniciamos el temporizador
        resetInactivityTimer();
      }
    };

    // Listener para cambios de visibilidad de la pestaña
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup: remover todos los listeners cuando el componente se desmonte
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, resetInactivityTimer]);
};

export default useInactivityLogout