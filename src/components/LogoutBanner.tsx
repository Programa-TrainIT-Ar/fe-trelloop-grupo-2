"use client";

import { XMarkIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";
import { LogoutReason } from "../store/authStore";

interface LogoutBannerProps {
  reason: LogoutReason;
  onDismiss: () => void;
}

// Configuración de mensajes según la razón
const getAlertConfig = (reason: LogoutReason) => {
  switch (reason) {
    case 'inactivity':
      return {
        message: "Tu sesión expiró por seguridad. Por favor, inicia sesión nuevamente para continuar.",
        bgColor: "bg-amber-900/20",
        borderColor: "border-amber-500/50",
        textColor: "text-amber-200",
        iconColor: "text-amber-400"
      };
    case 'session_expired':
      return {
        message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        bgColor: "bg-red-900/20",
        borderColor: "border-red-500/50",
        textColor: "text-red-200",
        iconColor: "text-red-400"
      };
    default:
      return {
        message: "Por favor, inicia sesión para continuar.",
        bgColor: "bg-blue-900/20",
        borderColor: "border-blue-500/50",
        textColor: "text-blue-200",
        iconColor: "text-blue-400"
      };
  }
};

const LogoutBanner = ({ reason, onDismiss }: LogoutBannerProps) => {
  const config = getAlertConfig(reason);

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border-l-4 p-4 mb-4 rounded-r-lg backdrop-blur-sm
          animate-in slide-in-from-top duration-500
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Icono */}
            <ShieldExclamationIcon 
              className={`h-5 w-5 mt-0.5 ${config.iconColor} flex-shrink-0`} 
            />
            
            {/* Contenido del mensaje */}
            <div className="flex-1">
              <div className="font-medium text-sm">
                Sesión Expirada
              </div>
              <div className="text-sm mt-1 opacity-90">
                {config.message}
              </div>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onDismiss}
            className={`
              ${config.iconColor} hover:opacity-75 transition-opacity
              ml-4 flex-shrink-0 p-1 rounded-full hover:bg-white/10
            `}
            aria-label="Cerrar alerta"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutBanner;