<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :required="required"
    class="base-input"
    :class="computedClasses"
    v-bind="$attrs"
    @input="onInput"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string | number;
  type?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  class?: string | string[] | Record<string, boolean>;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  required: false,
  placeholder: "",
  id: undefined,
  class: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const computedClasses = computed(() => {
  return props.class;
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<style lang="scss" scoped>
.base-input {
  width: stretch;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
}
</style>
