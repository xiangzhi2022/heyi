/**
 * @deprecated ThemeContext has been replaced by useThemeStore (Zustand).
 * This file can be safely deleted.
 */
export const ThemeProvider = ({ children }) => <>{children}</>;
export const useTheme = () => {
    throw new Error('ThemeContext is deprecated. Use useThemeStore instead.');
};
