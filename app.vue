<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useNotesStore } from "~/store/notes";

const store = {
  notesStore: useNotesStore(),
};

onMounted(() => {
  store.notesStore.init();
});
</script>
