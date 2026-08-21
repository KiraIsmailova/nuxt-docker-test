<template>
  <div class="layout">
    <Header />
    <main class="layout__main">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.layout__main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
