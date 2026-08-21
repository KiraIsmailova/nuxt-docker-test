<template>
  <div class="main-page">
    <div class="main-page__title-wrap">
      <h1 class="main-page__title">Мои заметки</h1>
      <BaseButton variant="note" @click="showCreateModal = true"
        >Создать заметку</BaseButton
      >
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
        <BaseButton @click="showDeleteModal = false">Отмена</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Удалить</BaseButton>
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
.main-page {
  margin: 24px 0;

  &__title {
    margin: 0;
    color: #034206;
    font-size: 36px;

    @media (max-width: 992px) {
      font-size: 28px;
    }

    @media (max-width: 576px) {
      font-size: 24px;
    }
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
      gap: 10px;
    }
  }
}
</style>
