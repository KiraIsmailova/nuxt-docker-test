<template>
  <div class="layout">
    <Header />
    <main class="layout__main">
      <slot />
    </main>
    <footer>
      <p>Контакты</p>
      <ul>
        <li>Блог</li>
        <li>Почта</li>
        <li>Телефон</li>
      </ul>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.layout__main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
