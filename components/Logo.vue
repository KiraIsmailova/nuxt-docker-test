<template>
  <NuxtLink to="/" class="logo" aria-label="На главную">
    <svg
      class="logo__icon"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#4caf50" />
      <path
        d="M10 16L14 20L22 12"
        stroke="white"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="logo__text">TodoApp</span>
  </NuxtLink>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #1f2937;
  transition: opacity 0.2s ease;

  @media (max-width: 576px) {
    gap: 5px;
  }

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 1px solid #076c1a;
    outline-offset: 4px;
    border-radius: 4px;
  }

  &__icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;

    @media (max-width: 576px) {
      width: 28px;
      height: 28px;
    }
  }

  &__text {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #034206;

    @media (max-width: 576px) {
      font-size: 18px;
    }
  }
}
</style>
