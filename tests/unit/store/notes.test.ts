import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useNotesStore } from "~/store/notes";
import type { Note } from "~/types/note";

vi.mock("~/data/notes", () => ({
  mockNotes: [
    {
      id: 999,
      title: "Test Note",
      todos: [
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: true },
      ],
    },
  ],
}));

describe("useNotesStore", () => {
  let store: ReturnType<typeof useNotesStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useNotesStore();
    store.init();
  });

  it("should load initial notes from localStorage or mock", () => {
    const note = store.notes.find((n) => n.id === 999);
    expect(note).toBeDefined();
    expect(note?.title).toBe("Test Note");
  });

  it("should add a new note", () => {
    const newNote: Note = {
      id: 888,
      title: "New Note",
      todos: [],
    };

    store.addNote(newNote);
    const added = store.notes.find((n) => n.id === 888);
    expect(added).toEqual(newNote);
  });

  it("should update an existing note", () => {
    const updatedNote: Note = {
      id: 999,
      title: "Updated Title",
      todos: [{ id: 1, text: "Updated Task", completed: true }],
    };

    store.updateNote(updatedNote);
    const updated = store.notes.find((n) => n.id === 999);
    expect(updated).toEqual(updatedNote);
  });

  it("should delete a note", () => {
    store.deleteNote(999);
    const exists = store.notes.some((n) => n.id === 999);
    expect(exists).toBe(false);
  });

  it("should save and load draft", async () => {
    const draft: Note = {
      id: 777,
      title: "Draft Title",
      todos: [{ id: 1, text: "Draft Task", completed: false }],
    };

    store.saveDraft(777, draft);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const loaded = store.loadDraft(777);
    expect(loaded).toEqual(draft);
  });

  it("should clear draft", () => {
    const draft: Note = {
      id: 666,
      title: "Draft to Clear",
      todos: [],
    };

    store.saveDraft(666, draft);
    store.clearDraft(666);

    const loaded = store.loadDraft(666);
    expect(loaded).toBeNull();
  });
});
