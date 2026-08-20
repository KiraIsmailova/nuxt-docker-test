export interface HistoryEntry {
  type: string;
  payload: any;
  undo: (payload: any) => void;
  redo: (payload: any) => void;
}

export function useHistory(limit = 50) {
  const history = ref<HistoryEntry[]>([]);
  const historyIndex = ref(-1);

  function addEntry(entry: HistoryEntry) {
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }

    history.value.push(entry);

    historyIndex.value = history.value.length - 1;

    if (history.value.length > limit) {
      history.value.shift();
      historyIndex.value = history.value.length - 1;
    }
  }

  function undo() {
    if (historyIndex.value < 0) return;

    const entry = history.value[historyIndex.value];
    entry?.undo(entry.payload);
    historyIndex.value--;
  }

  function redo() {
    if (historyIndex.value + 1 >= history.value.length) return;

    const nextIndex = historyIndex.value + 1;
    const entry = history.value[nextIndex];
    entry?.redo(entry.payload);
    historyIndex.value = nextIndex;
  }

  function reset() {
    history.value = [];
    historyIndex.value = -1;
  }

  return {
    history,
    historyIndex,
    addEntry,
    undo,
    redo,
    reset,
  };
}
