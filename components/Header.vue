<template>
  <header class="header">
    <div class="header__container">
      <Logo />
      <FeatureList />
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.header {
  background-color: #eff4f0;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 32px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 576px) {
    padding: 12px 16px;
  }

  @media (prefers-contrast: high) {
    border-bottom: 2px solid #000;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
