import { useState, useCallback } from 'react';

const DEFAULT_CRAZY_HOPS = 5;
const MAX_CRAZY_HOPS = 50;

export function useCrazyMode({ getRandomInternalLink, fetchArticleByTitle, appendPath }) {
  const [crazyHops, setCrazyHops] = useState(DEFAULT_CRAZY_HOPS);
  const [isCrazyModeActive, setIsCrazyModeActive] = useState(false);

  const executeCrazyHops = useCallback(async (startTitle) => {
    const traversedPaths = [startTitle];
    let currentIdx = 0;
    let hopsDone = 0;
    const maxHops = Math.min(crazyHops, MAX_CRAZY_HOPS);
    const visited = new Set([startTitle]);

    while (hopsDone < maxHops) {
      const current = traversedPaths[currentIdx];
      const { nextLink, resolvedTitle } = await getRandomInternalLink(current);

      if (resolvedTitle !== current) {
        traversedPaths[currentIdx] = resolvedTitle;
      }

      if (!nextLink) {
        if (currentIdx > 0) {
          currentIdx--;
        } else {
          break;
        }
      } else {
        if (visited.has(nextLink)) {
          currentIdx = 0;
          continue;
        }
        visited.add(nextLink);
        traversedPaths.push(nextLink);
        currentIdx = traversedPaths.length - 1;
        hopsDone++;
      }
    }

    if (traversedPaths.length > 0) {
      appendPath(traversedPaths);
    }

    const last = traversedPaths[traversedPaths.length - 1];
    await fetchArticleByTitle(last);
  }, [crazyHops, getRandomInternalLink, fetchArticleByTitle, appendPath]);

  const toggleCrazyMode = useCallback(() => {
    setIsCrazyModeActive((prev) => !prev);
  }, []);

  return {
    crazyHops, setCrazyHops,
    isCrazyModeActive, setIsCrazyModeActive,
    toggleCrazyMode,
    executeCrazyHops,
    DEFAULT_CRAZY_HOPS,
    MAX_CRAZY_HOPS
  };
}
