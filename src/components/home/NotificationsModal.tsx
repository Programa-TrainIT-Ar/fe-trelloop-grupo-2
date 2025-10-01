"use client";

import React, { forwardRef } from "react";
import { NotificationData } from "../../services/notificationService";

type NotificationsModalProps = {
  notifications: NotificationData[];
  loading: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onCreateTest: () => void;
  onNotificationClick: (notif: NotificationData) => void;
};

const NotificationsModal = forwardRef<HTMLDivElement, NotificationsModalProps>(
  (
    {
      notifications,
      loading,
      onClose,
      onMarkAllAsRead,
      onCreateTest,
      onNotificationClick,
    },
    ref
  ) => {
    return (
      <div
        ref={ref} 
        className="absolute top-[24px] right-16 w-[520px] max-h-[500px] rounded-lg bg-[#222] shadow-[0_4px_6px_rgba(0,0,0,0.25)] z-50 flex flex-col"
      >
        <div className="p-4 border-b border-[#444] flex justify-between items-center">
          <h3 className="text-white font-medium text-xs">Notificaciones</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[350px]">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No tienes notificaciones
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-[#333] hover:bg-[#3A3A3A] transition ${
                  notification.status === "UNREAD" ? "bg-[#1a1a2e]" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.priority === "HIGH"
                          ? "bg-red-500"
                          : notification.priority === "MEDIUM"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      <img
                        src="/assets/images/perfil.jpg"
                        alt="Usuario"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                    {notification.status === "UNREAD" && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {notification.card_title
                        ? `Nueva tarea: ${notification.card_title}`
                        : "Nueva notificación"}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      {notification.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400 text-xs">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={() => onNotificationClick(notification)}
                        className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300"
                      >
                        Ver detalle <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-[#222] rounded-lg">
          <div className="mt-3">
            <button
              onClick={onCreateTest}
              className="flex items-center gap-2 text-green-400 text-sm hover:text-green-300 w-full justify-center bg-green-900/20 px-4 py-2 rounded border border-green-800"
            >
              <span className="w-4 h-4 flex items-center justify-center">+</span>
              Crear notificación de prueba
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center px-4 py-2">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-2 text-white text-xs hover:text-gray-300"
            disabled={notifications.every((n) => n.status === "READ")}
          >
            <span className="w-4 h-4 bg-gray-600 text-xs rounded flex items-center justify-center">
              ✓✓
            </span>
            Marcar todas como leídas
          </button>
          <button className="text-white text-xs hover:text-gray-300">
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    );
  }
);

export default NotificationsModal;
