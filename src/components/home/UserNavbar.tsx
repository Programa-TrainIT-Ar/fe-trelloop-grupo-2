"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import React, { useState, useRef, useEffect } from "react";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  createTestNotification,
  NotificationData,
} from "../../services/notificationService";
import NotificationsModal from "./NotificationsModal";

const UserNavbar = ({ showCreateBoardButton = true }) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const goTonewBoard = () => {
    router.push("/newBoard");
  };

  const goToProfile = () => {
    router.push("/profile");
    setShowProfileMenu(false);
  };

  const goToChangePassword = () => {
    router.push("/change-password");
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    console.log("Cerrando sesión...");
    setShowProfileMenu(false);
  };

  const toggleNotificationsMenu = async () => {
    if (!showNotificationsMenu) {
      await loadNotifications();
    }
    setShowNotificationsMenu(!showNotificationsMenu);
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const updated = await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => n.status === "UNREAD")
        .map((n) => n.id);
      const updatedNotifications = await markAllAsRead(unreadIds);
      setNotifications((prev) =>
        prev.map((n) =>
          unreadIds.includes(n.id) ? { ...n, status: "READ" } : n
        )
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleCreateTestNotification = async () => {
    try {
      const newNotif = await createTestNotification();
      setNotifications((prev) => [newNotif, ...prev]);
      console.log("✅ Notificación de prueba creada");
    } catch (error) {
      console.error("Error creating test notification:", error);
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    if (notification.status === "UNREAD")
      await handleMarkAsRead(notification.id);
    if (notification.card_id) router.push(`/cards/${notification.card_id}`);
    setShowNotificationsMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    loadNotifications();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col justify-start items-end w-full bg-[#1A1A1A] px-6 pt-4 pb-6 relative">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#2B2B2B] px-4 py-2 rounded-[8px] w-[320px]">
            <img
              src="/assets/icons/search.svg"
              alt="Buscar"
              className="w-4 h-4"
            />
            <input
              type="text"
              placeholder="Buscar tableros..."
              className="bg-transparent outline-none text-white text-sm placeholder:text-[#999] w-full"
            />
          </div>
          <button className="w-8 h-8 bg-[#2B2B2B] rounded-md flex items-center justify-center">
            <img
              src="/assets/icons/filter.svg"
              alt="Filtrar"
              className="w-4 h-4"
            />
          </button>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Botón de notificaciones y modal */}
          <button onClick={toggleNotificationsMenu}>
          <img src="/assets/icons/bell.svg" alt="Notificación" className="w-4 h-4" />
          </button>

          {/* Modal de notificaciones */}
          {showNotificationsMenu && (
            <NotificationsModal
              ref={notificationRef}
              notifications={notifications}
              loading={loading}
              onClose={() => setShowNotificationsMenu(false)}
              onMarkAllAsRead={handleMarkAllAsRead}
              onCreateTest={handleCreateTestNotification}
              onNotificationClick={handleNotificationClick}
            />
          )}

          {/* Perfil */}
          <button
            className="w-8 h-8 bg-[#2B2B2B] rounded-full flex items-center justify-center"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src="/assets/icons/user.svg"
              alt="Perfil"
              className="w-4 h-4"
            />
          </button>

          {showProfileMenu && (
            <div
              ref={menuRef}
              className="absolute top-[48px] right-0 w-[266px] h-[299px] rounded-[16px] bg-[#272727] shadow-[0_4px_6px_rgba(0,0,0,0.25)] p-4 z-50 flex flex-col gap-6"
            >
              {/* Usuario */}
              <div className="flex items-center gap-3">
                <img
                  src="/assets/images/perfil.jpg"
                  alt="Perfil"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium text-[14px] leading-none">
                    Nombre del usuario
                  </p>
                  <p className="text-white font-normal text-[12px] leading-none mt-1">
                    Administrador
                  </p>
                </div>
              </div>

              {/* Opciones */}
              <div className="flex flex-col gap-4 text-white font-medium text-[14px]">
                <button
                  onClick={() => router.push("/not-found")}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition"
                >
                  <img
                    src="/assets/icons/user.png"
                    alt="Perfil"
                    className="w-5 h-5"
                  />
                  Perfil de usuario
                </button>

                <button
                  onClick={() => router.push("/not-found")}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition"
                >
                  <img
                    src="/assets/icons/key.png"
                    alt="Contraseña"
                    className="w-5 h-5"
                  />
                  Contraseña
                </button>

                <hr className="border-[#444]" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#3A3A3A] transition"
                >
                  <img
                    src="/assets/icons/log-out.png"
                    alt="Salir"
                    className="w-5 h-5"
                  />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateBoardButton && (
        <div className="mt-4">
          <button
            className="flex items-center gap-2 bg-[#6A5FFF] text-white px-4 py-2 rounded-md text-sm font-medium"
            onClick={goTonewBoard}
          >
            <img src="/assets/icons/plus.svg" alt="Crear" className="w-4 h-4" />
            Crear tablero
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;
