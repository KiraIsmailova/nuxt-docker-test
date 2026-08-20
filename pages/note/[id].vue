<template>
  <div class="edit-page">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="!note" class="not-found">
      <p>Заметка не найдена</p>
      <NuxtLink to="/">Вернуться на главную</NuxtLink>
    </div>
    <div v-else class="edit-container">
      <h1 class="edit-title">Редактирование заметки</h1>
      <form @submit.prevent="saveNote">
        <div class="field">
          <label for="note-title">Название заметки</label>
          <input
            id="note-title"
            v-model="editableTitle"
            type="text"
            class="input"
            placeholder="Введите название"
            required
          />
        </div>

        <div class="todos-section">
          <h2>Задачи</h2>
          <ul class="todo-list">
            <li
              v-for="(todo, index) in editableTodos"
              :key="todo.id"
              class="todo-item"
            >
              <input
                type="checkbox"
                :checked="todo.completed"
                class="todo-checkbox"
                @change="toggleTodo(index)"
              />
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
          <button type="button" class="btn btn-secondary" @click="addTodo">
            Добавить задачу
          </button>
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-primary">Сохранить</button>
          <button type="button" class="btn" @click="askCancel">
            Отменить редактирование
          </button>
          <button type="button" class="btn btn-danger" @click="askDelete">
            Удалить заметку
          </button>
        </div>
      </form>
    </div>

    <BaseModal v-model="showDeleteModal" title="Удалить заметку?">
      <p>Вы уверены, что хотите удалить эту заметку?</p>
      <template #footer>
        <button class="btn" @click="showDeleteModal = false">Отмена</button>
        <button class="btn btn-danger" @click="confirmDelete">Удалить</button>
      </template>
    </BaseModal>

    <BaseModal v-model="showCancelModal" title="Отменить редактирование?">
      <p>Все несохранённые изменения будут потеряны. Продолжить?</p>
      <template #footer>
        <button class="btn" @click="showCancelModal = false">Остаться</button>
        <button class="btn btn-danger" @click="confirmCancel">Отменить</button>
      </template>
    </BaseModal>

    <BaseModal v-model="showRestoreDraftModal" title="Найден черновик">
      <p>Обнаружены несохранённые изменения. Восстановить их?</p>
      <template #footer>
        <button class="btn" @click="discardDraft">Отклонить</button>
        <button class="btn btn-primary" @click="restoreDraft">
          Восстановить
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "~/store/notes";
import type { Note, Todo } from "~/types/note";
import { useHistory } from "~/composables/useHistory";

const route = useRoute();
const router = useRouter();
const notesStore = useNotesStore();
const history = useHistory();

const loading = ref(true);
const noteId = Number(route.params.id as string);
const note = ref<Note | null>(null);

const editableTitle = ref("");
const editableTodos = ref<Todo[]>([]);

const showDeleteModal = ref(false);
const showCancelModal = ref(false);
const showRestoreDraftModal = ref(false);
const draftToRestore = ref<Note | null>(null);
const isRestoringDraft = ref(false);
const isApplyingHistory = ref(false);
const isInitializing = ref(true);

let oldTitle = "";
let titleChangeTimer: ReturnType<typeof setTimeout> | null = null;
const todoTimers = new Map<string | number, ReturnType<typeof setTimeout>>();
const oldTodoTexts = new Map<string | number, string>();

function buildDraftNote(): Note | null {
  if (!note.value) return null;
  return {
    ...note.value,
    title: editableTitle.value,
    todos: editableTodos.value.map((todo) => ({ ...todo })),
  };
}

watch(
  [editableTitle, editableTodos],
  () => {
    if (
      isInitializing.value ||
      isApplyingHistory.value ||
      isRestoringDraft.value
    )
      return;
    if (note.value) {
      const draft = buildDraftNote();
      if (draft) notesStore.saveDraft(noteId, draft);
    }
  },
  { deep: true },
);

watch(editableTitle, (newVal, oldVal) => {
  if (isApplyingHistory.value) return;
  oldTitle = oldVal;
  if (titleChangeTimer) clearTimeout(titleChangeTimer);
  titleChangeTimer = setTimeout(() => {
    if (oldTitle !== newVal) {
      history.addEntry({
        type: "updateTitle",
        payload: { oldTitle, newTitle: newVal },
        undo: ({ oldTitle }) => {
          editableTitle.value = oldTitle;
        },
        redo: ({ newTitle }) => {
          editableTitle.value = newTitle;
        },
      });
      oldTitle = newVal;
    }
  }, 500);
});

watch(
  editableTodos,
  (newTodos, oldTodos) => {
    if (isApplyingHistory.value) return;
    newTodos.forEach((todo, index) => {
      const oldTodo = oldTodos[index];
      if (oldTodo && todo.text !== oldTodo.text) {
        const oldText = oldTodo.text;
        if (!oldTodoTexts.has(todo.id)) {
          oldTodoTexts.set(todo.id, oldText);
        }
        const timer = todoTimers.get(todo.id);
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
          if (todo.text !== oldText) {
            history.addEntry({
              type: "updateTodoText",
              payload: { todoId: todo.id, oldText, newText: todo.text },
              undo: ({ todoId, oldText }) => {
                const target = editableTodos.value.find((t) => t.id === todoId);
                if (target) target.text = oldText;
              },
              redo: ({ todoId, newText }) => {
                const target = editableTodos.value.find((t) => t.id === todoId);
                if (target) target.text = newText;
              },
            });
            oldTodoTexts.set(todo.id, todo.text);
          }
          todoTimers.delete(todo.id);
        }, 500);
        todoTimers.set(todo.id, newTimer);
      }
    });
  },
  { deep: true },
);

function addTodo() {
  const newTodo: Todo = {
    id: Date.now() + Math.random(),
    text: "",
    completed: false,
  };
  editableTodos.value.push(newTodo);
  const index = editableTodos.value.length - 1;
  history.addEntry({
    type: "addTodo",
    payload: { todo: newTodo, index },
    undo: ({ index }) => editableTodos.value.splice(index, 1),
    redo: ({ todo, index }) => editableTodos.value.splice(index, 0, todo),
  });
}

function removeTodo(index: number) {
  const todo = editableTodos.value[index];
  editableTodos.value.splice(index, 1);
  history.addEntry({
    type: "deleteTodo",
    payload: { todo, index },
    undo: ({ todo, index }) => editableTodos.value.splice(index, 0, todo),
    redo: ({ index }) => editableTodos.value.splice(index, 1),
  });
}

function toggleTodo(index: number) {
  const todo = editableTodos.value[index];
  if (todo) {
    todo.completed = !todo.completed;
  }

  history.addEntry({
    type: "toggleTodo",
    payload: { todoId: todo?.id },
    undo: ({ todoId }) => {
      const target = editableTodos.value.find((t) => t.id === todoId);
      if (target) target.completed = !target.completed;
    },
    redo: ({ todoId }) => {
      const target = editableTodos.value.find((t) => t.id === todoId);
      if (target) target.completed = !target.completed;
    },
  });
}

function applyUndo() {
  isApplyingHistory.value = true;
  history.undo();
  isApplyingHistory.value = false;
}

function applyRedo() {
  isApplyingHistory.value = true;
  history.redo();
  isApplyingHistory.value = false;
}

function handleGlobalKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  const isFormField =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;

  const isCtrlOrMeta = event.ctrlKey || event.metaKey;
  const isZKey = event.key.toLowerCase() === "z";

  if (isFormField && isCtrlOrMeta && isZKey) {
    if (event.shiftKey) {
      event.preventDefault();
      applyRedo();
    }
    return;
  }

  if (isCtrlOrMeta && isZKey) {
    event.preventDefault();
    if (event.shiftKey) {
      applyRedo();
    } else {
      applyUndo();
    }
  }
}

function saveNote() {
  if (!note.value) return;
  if (!editableTitle.value.trim()) return;
  const updatedNote: Note = {
    ...note.value,
    title: editableTitle.value.trim(),
    todos: editableTodos.value.map((todo) => ({
      ...todo,
      text: todo.text.trim() || "Без названия",
    })),
  };
  notesStore.updateNote(updatedNote);
  history.reset();
  notesStore.clearDraft(noteId);
  router.push("/");
}

function askDelete() {
  showDeleteModal.value = true;
}

function confirmDelete() {
  if (note.value) {
    notesStore.deleteNote(note.value.id);
    showDeleteModal.value = false;
    router.push("/");
  }
}

function askCancel() {
  showCancelModal.value = true;
}

function confirmCancel() {
  history.reset();
  notesStore.clearDraft(noteId);
  showCancelModal.value = false;
  router.push("/");
}

function restoreDraft() {
  if (draftToRestore.value) {
    isRestoringDraft.value = true;
    editableTitle.value = draftToRestore.value.title;
    editableTodos.value = JSON.parse(
      JSON.stringify(draftToRestore.value.todos),
    );
    isRestoringDraft.value = false;
    history.reset();
  }
  showRestoreDraftModal.value = false;
  notesStore.clearDraft(noteId);
}

function discardDraft() {
  notesStore.clearDraft(noteId);
  showRestoreDraftModal.value = false;
}

function checkNoteExists() {
  const found = notesStore.getNoteById(noteId);
  if (!found) {
    note.value = null;
    router.push("/");
  }
}

onMounted(() => {
  notesStore.init();

  const found = notesStore.getNoteById(noteId);
  if (found) {
    note.value = found;
    editableTitle.value = found.title;
    editableTodos.value = JSON.parse(JSON.stringify(found.todos));
    oldTitle = found.title;
  }
  loading.value = false;
  isInitializing.value = false;

  if (note.value && import.meta.client) {
    const draft = notesStore.loadDraft(noteId);
    if (draft) {
      draftToRestore.value = draft;
      showRestoreDraftModal.value = true;
    }
  }

  document.addEventListener("keydown", handleGlobalKeydown);

  if (import.meta.client) {
    window.addEventListener("storage", checkNoteExists);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleGlobalKeydown);
  if (import.meta.client) {
    window.removeEventListener("storage", checkNoteExists);
  }
});
</script>

<style scoped>
.loading,
.not-found {
  text-align: center;
  padding: 40px;
}

.edit-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.edit-title {
  text-align: center;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 20px;
}

.input,
.todo-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
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
  margin: 0 0 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.todo-checkbox {
  flex-shrink: 0;
}

.todo-input {
  flex: 1;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
