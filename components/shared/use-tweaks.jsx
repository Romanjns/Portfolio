import React from 'react';

// Shared state + tweaks hook used by every page.
// Persists settings in localStorage so theme flows between pages.

const RJ_STORAGE_KEY = 'rj-portfolio-tweaks';
const RJ_DEFAULTS = {
  dark: false,
  accent: '#d03b08',
  bg: 'mesh',
  effect: 'typewriter',
  showTerminal: true,
  showCards: true,
};

function loadTw() {
  try {
    const raw = localStorage.getItem(RJ_STORAGE_KEY);
    if (!raw) return { ...RJ_DEFAULTS };
    const saved = JSON.parse(raw);
    return { ...RJ_DEFAULTS, ...saved };
  } catch { return { ...RJ_DEFAULTS }; }
}

function saveTw(tw) {
  try { localStorage.setItem(RJ_STORAGE_KEY, JSON.stringify(tw)); } catch {}
}

function useTweaks() {
  const [tw, setTwState] = React.useState(() => ({ ...loadTw() }));

  const setTw = React.useCallback((patch) => {
    setTwState(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      saveTw(next);
      return next;
    });
  }, []);

  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === RJ_STORAGE_KEY && e.newValue) {
        try { setTwState(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { tw, setTw };
}

export { useTweaks, RJ_DEFAULTS, loadTw, saveTw };
