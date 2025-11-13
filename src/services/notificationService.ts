import { getToken } from "../store/authStore";

const API = process.env.NEXT_PUBLIC_API_URL;

export type NotificationStatus = "UNREAD" | "READ";
export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH";

export interface NotificationData {
  id: number;
  user_id: number;
  card_id?: number;
  card_title?: string;
  description: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  created_at: string;
}

// Headers con JWT
function authHeadersJSON() {
  const token = getToken?.();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Obtener notificaciones
export async function fetchNotifications(): Promise<NotificationData[]> {
  const res = await fetch(`${API}/api/notifications`, {
    method: "GET",
    headers: authHeadersJSON(),
  });

  if (!res.ok) throw new Error("Error al obtener notificaciones");

  const data = await res.json();
  return data.notifications || [];
}

// Marcar una como leída
export async function markAsRead(notificationId: number): Promise<NotificationData> {
  const res = await fetch(`${API}/api/notifications/${notificationId}`, {
    method: "POST",
    headers: authHeadersJSON(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Error al marcar notificación como leída");

  return data.notification;
}

// Marcar todas como leídas
export async function markAllAsRead(notificationIds: number[]): Promise<NotificationData[]> {
  return Promise.all(notificationIds.map((id) => markAsRead(id)));
}

// Crear notificación de prueba
export async function createTestNotification(): Promise<NotificationData> {
  const res = await fetch(`${API}/api/notifications/test_create`, {
    method: "POST",
    headers: authHeadersJSON(),
    body: JSON.stringify({
      description: "Notificación de prueba creada desde el frontend",
      card_id: Math.floor(Math.random() * 10) + 1,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Error al crear notificación");

  return data.notification;
}

