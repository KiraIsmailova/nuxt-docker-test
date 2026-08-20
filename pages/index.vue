<template>
  <div class="main-page">
    <div class="main-page__title-wrap">
      <h1 class="main-page__title">Мои заметки</h1>
      <button class="btn btn-primary" @click="showCreateModal = true">
        Создать заметку
      </button>
    </div>

    <div class="main-page__grid">
      <NoteCard
        v-for="note in store.notesStore.notes"
        :key="note.id"
        :note="note"
        :limit="3"
        @edit="goToEdit(note.id)"
        @delete="askDelete(note)"
      />
    </div>
    <BaseModal v-model="showCreateModal" title="Новая заметка">
      <NoteCreationForm @submit="handleCreateNote" />
    </BaseModal>

    <BaseModal v-model="showDeleteModal" title="Удалить заметку?">
      <p>Вы уверены, что хотите удалить заметку «{{ noteToDelete?.title }}»?</p>
      <template #footer>
        <button class="btn" @click="showDeleteModal = false">Отмена</button>
        <button class="btn btn-danger" @click="confirmDelete">Удалить</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Note, Todo } from "~/types/note";
import { useNotesStore } from "~/store/notes";

const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const noteToDelete = ref<Note | null>(null);

const store = {
  notesStore: useNotesStore(),
};

function goToEdit(id: Note["id"]) {
  navigateTo(`/note/${id}`);
}

function askDelete(note: Note) {
  noteToDelete.value = note;
  showDeleteModal.value = true;
}

function confirmDelete() {
  if (noteToDelete.value) {
    store.notesStore.deleteNote(noteToDelete.value.id);
    noteToDelete.value = null;
  }
  showDeleteModal.value = false;
}

function handleCreateNote(data: Omit<Note, "id">) {
  const newNote: Note = {
    id: Date.now() + Math.random(),
    title: data.title,
    todos: data.todos.map((todo: Todo) => ({
      ...todo,
      id: Date.now() + Math.random(),
      completed: false,
    })),
  };
  store.notesStore.addNote(newNote);
  showCreateModal.value = false;
}
</script>

<style lang="scss">
body {
  margin: 0;
}

.main-page {
  margin: 24px 0;

  &__title {
    margin: 0;
    color: #034206;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  &__title-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 16px;
    }
  }
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }

  &-primary {
    background: #4caf50;
    color: white;
    border: none;

    &:hover {
      background: #43a047;
    }
  }

  &-danger {
    background: #f44336;
    color: white;
    border: none;

    &:hover {
      background: #e53935;
    }
  }
}
</style>
