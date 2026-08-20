<template>
  <ul class="features" aria-label="Преимущества приложения">
    <li class="feature">
      <svg
        class="feature__icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          stroke="#4caf50"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="feature__text">Быстро</span>
    </li>
    <li class="feature">
      <svg
        class="feature__icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="#4caf50"
          stroke-width="2"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="#4caf50"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="feature__text">Удобно</span>
    </li>
    <li class="feature">
      <svg
        class="feature__icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          stroke="#4caf50"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="feature__text">Просто</span>
    </li>
  </ul>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.features {
  list-style: none;
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;

  @media (max-width: 576px) {
    gap: 10px;
  }
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;

  &__text {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    white-space: nowrap;
  }

  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}
</style>
