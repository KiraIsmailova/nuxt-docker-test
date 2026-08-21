<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label class="field__label" for="create-note-title"
        >Название заметки</label
      >
      <BaseInput
        id="create-note-title"
        v-model="title"
        type="text"
        placeholder="Введите название"
        required
      />
    </div>

    <div class="todos-section">
      <h3>Задачи</h3>
      <ul class="todos-section__list">
        <li
          v-for="(todo, index) in todos"
          :key="todo.id"
          class="todos-section__item"
        >
          <BaseInput
            v-model="todo.text"
            type="text"
            placeholder="Текст задачи"
            required
          />
          <BaseButton variant="danger" size="sm" @click="removeTodo(index)"
            >Удалить</BaseButton
          >
        </li>
      </ul>

      <BaseButton variant="secondary" size="sm" @click="addTodo"
        >+ Добавить задачу</BaseButton
      >
    </div>

    <div class="form-actions">
      <BaseButton variant="primary" type="submit">Создать</BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Todo, Note } from "~/types/note";

const emit = defineEmits<{
  (e: "submit", note: Omit<Note, "id">): void;
}>();

const title = ref("");
const todos = ref<Todo[]>([]);

let nextTodoId = 1;

function addTodo() {
  todos.value.push({
    id: `temp-${nextTodoId++}`,
    text: "",
    completed: false,
  });
}

function removeTodo(index: number) {
  todos.value.splice(index, 1);
}

function handleSubmit() {
  if (!title.value.trim()) return;

  const newNote: Omit<Note, "id"> = {
    title: title.value.trim(),
    todos: todos.value
      .filter((todo) => todo.text.trim() !== "")
      .map((todo) => ({
        id: todo.id,
        text: todo.text.trim(),
        completed: false,
      })),
  };

  emit("submit", newNote);

  title.value = "";
  todos.value = [];
  nextTodoId = 1;
}
</script>

<style lang="scss" scoped>
.field {
  margin-bottom: 16px;

  &__label {
    display: inline-block;
    margin-bottom: 14px;
    font-weight: 500;
  }
}

.todos-section {
  margin-bottom: 20px;

  &__list {
    list-style: none;
    padding: 0;
    margin: 0 0 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
