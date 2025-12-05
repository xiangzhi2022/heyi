/**
 * @deprecated NotificationContext has been replaced by useNotificationStore (Zustand).
 * This file can be safely deleted.
 */
export const NotificationProvider = ({ children }) => <>{children}</>;
export const useNotifications = () => {
    throw new Error('NotificationContext is deprecated. Use useNotificationStore instead.');
};
