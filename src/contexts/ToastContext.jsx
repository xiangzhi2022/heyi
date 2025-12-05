/**
 * @deprecated ToastContext has been replaced by useToastStore (Zustand).
 * This file can be safely deleted.
 */
export const ToastProvider = ({ children }) => <>{children}</>;
export const useToast = () => {
    throw new Error('ToastContext is deprecated. Use useToastStore instead.');
};
