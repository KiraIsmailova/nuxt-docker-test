import { defineStore } from "pinia";
import type { Note } from "~/types/note";
import { mockNotes } from "~/data/notes";
import type { StorageSchema } from "~/types/storageSchema";

const STORAGE_KEY = "notes_app_data_v1";
const DRAFT_KEY_PREFIX = "notes_draft_";
const SAVE_DEBOUNCE_MS = 500;

function loadInitialNotes(): Note[] {
  if (import.meta.client) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StorageSchema;
        if (parsed.version === 1 && Array.isArray(parsed.notes)) {
          return parsed.notes;
        }
      } catch (e) {
        console.error("Failed to parse stored notes", e);
      }
    }
  }
  return [...mockNotes];
}

export const useNotesStore = defineStore("notes", () => {
  const notes = ref<Note[]>([]);

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  const draftTimers = new Map<string, ReturnType<typeof setTimeout>>();

  function init() {
    notes.value = loadInitialNotes();
    if (import.meta.client) {
      window.addEventListener("storage", handleStorageEvent);
    }
  }

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      notes.value = loadInitialNotes();
    }
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      persistNotes();
    }, SAVE_DEBOUNCE_MS);
  }

  function persistNotes() {
    if (!import.meta.client) return;
    const data: StorageSchema = {
      version: 1,
      notes: notes.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function addNote(note: Note) {
    notes.value.push(note);
    scheduleSave();
  }

  function updateNote(updatedNote: Note) {
    const index = notes.value.findIndex((n) => n.id === updatedNote.id);
    if (index !== -1) {
      notes.value[index] = updatedNote;
      scheduleSave();
    }
  }

  function deleteNote(id: Note["id"]) {
    notes.value = notes.value.filter((n) => n.id !== id);
    scheduleSave();
    clearDraft(id);
  }

  function getNoteById(id: Note["id"]): Note | undefined {
    return notes.value.find((n) => n.id === id);
  }

  function saveDraft(noteId: Note["id"], draft: Note) {
    if (!import.meta.client) return;
    const key = DRAFT_KEY_PREFIX + noteId;

    const existingTimer = draftTimers.get(key);
    if (existingTimer) clearTimeout(existingTimer);

    const timer = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify({ version: 1, note: draft }));
      draftTimers.delete(key);
    }, SAVE_DEBOUNCE_MS);

    draftTimers.set(key, timer);
  }

  function loadDraft(noteId: Note["id"]): Note | null {
    if (!import.meta.client) return null;
    const key = DRAFT_KEY_PREFIX + noteId;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.version === 1 && parsed.note) {
          return parsed.note as Note;
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    return null;
  }

  function clearDraft(noteId: Note["id"]) {
    if (!import.meta.client) return;
    const key = DRAFT_KEY_PREFIX + noteId;
    localStorage.removeItem(key);

    const timer = draftTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      draftTimers.delete(key);
    }
  }

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    saveDraft,
    loadDraft,
    clearDraft,
    init,
  };
});
