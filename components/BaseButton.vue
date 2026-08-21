<template>
  <button :type="type" :class="buttonClasses" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  type?: "button" | "submit" | "reset";
  variant?: "default" | "primary" | "secondary" | "danger" | "note";
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "default",
  size: "md",
});

const buttonClasses = computed(() => {
  return ["btn", `btn-${props.variant}`, props.size === "sm" ? "btn-sm" : ""]
    .filter(Boolean)
    .join(" ");
});
</script>

<style lang="scss" scoped>
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

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
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

.btn-note {
  background: #4caf50;
  color: white;
  border: none;
}

.btn-note:hover {
  background: #43a047;
}
</style>
