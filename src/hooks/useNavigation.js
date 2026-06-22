import { useState, useCallback } from 'react';

export function useNavigation() {
  const [path, setPath] = useState([]);

  const addToPath = useCallback((title) => {
    setPath((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === title) return prev;
      return [...prev, title];
    });
  }, []);

  const updateLastPathEntry = useCallback((title) => {
    setPath((prev) => {
      if (prev.length === 0) return [title];
      const newPath = [...prev];
      newPath[newPath.length - 1] = title;
      return newPath;
    });
  }, []);

  const appendPath = useCallback((titles) => {
    if (titles.length === 0) return;
    setPath((prev) => {
      const newPath = [...prev];
      const startIdx = newPath.length > 0 && newPath[newPath.length - 1] === titles[0] ? 1 : 0;
      for (let i = startIdx; i < titles.length; i++) {
        if (newPath.length === 0 || newPath[newPath.length - 1] !== titles[i]) {
          newPath.push(titles[i]);
        }
      }
      return newPath;
    });
  }, []);

  const clearPath = useCallback(() => setPath([]), []);

  return { path, setPath, addToPath, updateLastPathEntry, appendPath, clearPath };
}
