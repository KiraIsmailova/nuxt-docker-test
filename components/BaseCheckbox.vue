<template>
  <input
    type="checkbox"
    :checked="modelValue"
    class="base-checkbox"
    :class="computedClasses"
    v-bind="$attrs"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  class?: string | string[] | Record<string, boolean>;
}

const props = withDefaults(defineProps<Props>(), {
  class: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const computedClasses = computed(() => props.class);

function onChange(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
}
</script>

<style lang="scss" scoped>
.base-checkbox {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
}
</style>
