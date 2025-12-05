/**
 * @deprecated SearchContext has been replaced by useSearchStore (Zustand).
 * This file can be safely deleted.
 */
export const SearchProvider = ({ children }) => <>{children}</>;
export const useSearch = () => {
    throw new Error('SearchContext is deprecated. Use useSearchStore instead.');
};
