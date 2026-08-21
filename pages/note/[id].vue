<template>
  <div class="edit-page">
    <div v-if="loading" class="edit-page__loading">Загрузка...</div>
    <div v-else-if="!note" class="edit-page__not-found-wrap">
      <p class="edit-page__not-found">Заметка не найдена</p>
      <NuxtLink to="/" class="edit-page__back">Вернуться на главную</NuxtLink>
    </div>
    <div v-else class="edit-container">
      <h1 class="edit-container__title">Редактирование заметки</h1>
      <form @submit.prevent="saveNote">
        <div class="edit-container__field">
          <label class="edit-container__label" for="note-title"
            >Название заметки</label
          >
          <BaseInput
            id="note-title"
            v-model="editableTitle"
            type="text"
            placeholder="Введите название"
            required
          />
        </div>

        <div class="edit-container__todos-section">
          <h2>Задачи</h2>
          <ul class="edit-container__todo-list">
            <li
              v-for="(todo, index) in editableTodos"
              :key="todo.id"
              class="edit-container__todo-item"
            >
              <BaseCheckbox
                v-model="todo.completed"
                @change="toggleTodo(index)"
              />
              <BaseInput
                v-model="todo.text"
                type="text"
                class="edit-container__todo-input"
                placeholder="Текст задачи"
                required
              />
              <BaseButton variant="danger" size="sm" @click="removeTodo(index)"
                >Удалить</BaseButton
              >
            </li>
          </ul>
          <BaseButton variant="secondary" @click="addTodo"
            >Добавить задачу</BaseButton
          >
        </div>

        <div class="edit-container__actions">
          <BaseButton variant="primary" type="submit">Сохранить</BaseButton>
          <BaseButton @click="askCancel">Отменить редактирование</BaseButton>
          <BaseButton variant="danger" @click="askDelete"
            >Удалить заметку</BaseButton
          >
        </div>
      </form>
    </div>

    <BaseModal v-model="showDeleteModal" title="Удалить заметку?">
      <p>Вы уверены, что хотите удалить эту заметку?</p>
      <template #footer>
        <BaseButton @click="showDeleteModal = false">Отмена</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Удалить</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="showCancelModal" title="Отменить редактирование?">
      <p>Все несохранённые изменения будут потеряны. Продолжить?</p>
      <template #footer>
        <BaseButton @click="showCancelModal = false">Остаться</BaseButton>
        <BaseButton variant="danger" @click="confirmCancel"
          >Отменить</BaseButton
        >
      </template>
    </BaseModal>

    <BaseModal v-model="showRestoreDraftModal" title="Найден черновик">
      <p>Обнаружены несохранённые изменения. Восстановить их?</p>
      <template #footer>
        <BaseButton @click="discardDraft">Отклонить</BaseButton>
        <BaseButton variant="primary" @click="restoreDraft"
          >Восстановить</BaseButton
        >
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

const initialTitle = ref("");
const initialTodos = ref<Todo[]>([]);

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

function hasChanges(): boolean {
  if (editableTitle.value !== initialTitle.value) return true;
  if (editableTodos.value.length !== initialTodos.value.length) return true;

  for (let i = 0; i < editableTodos.value.length; i++) {
    const current = editableTodos.value[i];
    const initial = initialTodos.value[i];
    if (
      !initial ||
      current?.text !== initial.text ||
      current?.completed !== initial.completed
    ) {
      return true;
    }
  }
  return false;
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

    if (note.value && hasChanges()) {
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

    initialTitle.value = found.title;
    initialTodos.value = JSON.parse(JSON.stringify(found.todos));

    oldTitle = found.title;
  }
  loading.value = false;

  setTimeout(() => {
    isInitializing.value = false;
  }, 100);

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

<style lang="scss" scoped>
.edit-page {
  &__loading {
    text-align: center;
    padding: 40px;
    font-size: 24px;
    margin: 0;
    color: #034206;
  }

  &__not-found {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin: 0;
    color: #034206;
  }

  &__back {
    text-align: center;
    font-size: 20px;
    margin: 0;
    color: #034206;
  }

  &__not-found-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    padding: 40px 0;
  }
}

.edit-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;

  &__title {
    text-align: center;
    margin-bottom: 20px;
  }

  &__field {
    margin-bottom: 20px;
  }

  &__todos-section {
    margin-bottom: 20px;
  }

  &__todo-list {
    list-style: none;
    padding: 0;
    margin: 0 0 12px;
  }

  &__todo-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__todo-input {
    flex: 1;
  }

  &__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__label {
    display: inline-block;
    margin-bottom: 14px;
  }
}
</style>
