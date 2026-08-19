<template>
  <h1 class="main-title">Мои заметки</h1>
  <div class="main-grid">
    <NoteCard
      v-for="note in store.notesStore.notes"
      :key="note.id"
      :note="note"
      :limit="3"
    />
  </div>
</template>
<script setup lang="ts">
import { useNotesStore } from "~/store/notes";

const store = {
  notesStore: useNotesStore(),
};
</script>

<style lang="scss" scoped>
.main-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>
