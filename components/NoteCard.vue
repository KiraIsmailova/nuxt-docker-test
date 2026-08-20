<template>
  <div class="note-card" @click="$emit('edit')">
    <h2 class="note-card__title">{{ note.title }}</h2>
    <ul class="note-card__list">
      <li v-for="todo in visibleTodos" :key="todo.id" class="note-card__todo">
        <input type="checkbox" :checked="todo.completed" disabled />
        <span>{{ todo.text }}</span>
      </li>
    </ul>
    <p
      v-if="note.todos.length > (limit ?? note.todos.length)"
      class="note-card__more"
    >
      еще задач: {{ note.todos.length - (limit ?? note.todos.length) }}
    </p>
    <div class="node-card__actions" @click.stop>
      <button class="btn btn-secondary" @click="$emit('edit')">Изменить</button>
      <button class="btn btn-danger" @click="$emit('delete')">Удалить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from "~/types/note";

interface Props {
  note: Note;
  limit?: number;
}

const props = defineProps<Props>();

defineEmits<{
  (e: "edit"): void;
  (e: "delete"): void;
}>();

const visibleTodos = computed(() => {
  return props.limit === undefined
    ? props.note.todos
    : props.note.todos.slice(0, props.limit);
});
</script>

<style lang="scss" scoped>
.note-card {
  border: 1px solid #13b40b;
  border-radius: 8px;
  padding: 16px;
  background-color: #eff4f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    cursor: pointer;
  }

  &__title {
    text-align: center;
    margin: 0 0 12px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__todo {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  &__more {
    margin: 8px 0 0;
    font-size: 0.9em;
    color: #6a6363;
    text-align: center;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  }

  .btn {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 12px;
    transition: background 0.2s;
  }

  .btn:hover {
    background: #e0e0e0;
  }

  .btn-secondary {
    background: #607d8b;
    color: white;
    border: none;
  }

  .btn-secondary:hover {
    background: #546e7a;
  }

  .btn-danger {
    background: #f44336;
    color: white;
    border: none;
  }

  .btn-danger:hover {
    background: #e53935;
  }
}
</style>
