import { NotificationType } from "@/types/props/notificationType";
import { usePageStore } from "../store/pageStore";

export const notify = (notification: NotificationType) => {
  const allNotifications = usePageStore.getState().notifications;
  const isAlreadyIn = allNotifications.some(
    (notif) => notif.id === notification.id,
  ) || allNotifications.some(
    (notif) => notif.title === notification.title && notif.message === notification.message,
  );
  if (isAlreadyIn) return;
  usePageStore.getState().addNotification(notification);
};
