<template>
  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label for="create-note-title">Название заметки</label>
      <input
        id="create-note-title"
        v-model="title"
        type="text"
        class="input"
        placeholder="Введите название"
        required
      />
    </div>

    <div class="todos-section">
      <h3>Задачи</h3>
      <ul class="todo-list">
        <li v-for="(todo, index) in todos" :key="todo.id" class="todo-item">
          <input
            v-model="todo.text"
            type="text"
            class="todo-input"
            placeholder="Текст задачи"
          />
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="removeTodo(index)"
          >
            Удалить
          </button>
        </li>
      </ul>
      <button type="button" class="btn btn-secondary btn-sm" @click="addTodo">
        + Добавить задачу
      </button>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">Создать</button>
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

<style scoped>
.field {
  margin-bottom: 16px;
}
.input,
.todo-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
.input:focus,
.todo-input:focus {
  outline: none;
  border-color: #4caf50;
}
.todos-section {
  margin-bottom: 20px;
}
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.todo-input {
  flex: 1;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
}
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.btn:hover {
  background: #e0e0e0;
}
.btn-primary {
  background: #4caf50;
  color: white;
  border: none;
}
.btn-primary:hover {
  background: #43a047;
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
.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
