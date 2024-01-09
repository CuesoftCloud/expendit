export const getLocalStorageItem = (key: string): string | null | any => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};
