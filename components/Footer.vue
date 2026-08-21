<template>
  <footer class="footer">
    <div class="footer__container">
      <Logo />
      <div class="footer__contacts">
        <h3 class="footer__title">Контакты</h3>
        <ul class="footer__list">
          <li class="footer__item">
            <a href="/blog" class="footer__link footer__link--icon">
              <svg
                class="footer__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Блог
            </a>
          </li>
          <li class="footer__item">
            <a
              href="mailto:info@example.com"
              class="footer__link footer__link--icon"
            >
              <svg
                class="footer__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Почта
            </a>
          </li>
          <li class="footer__item">
            <a href="tel:+79991234567" class="footer__link footer__link--icon">
              <svg
                class="footer__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Телефон
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__copyright">© {{ currentYear }} Все права защищены</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style lang="scss" scoped>
.footer {
  background-color: #e8f5e9;
  color: #2e3b2e;
  padding: 2rem 1rem 1rem;

  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem 0.75rem;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 2rem;
    }
  }

  &__tagline {
    margin-top: 1rem;
    font-size: 0.95rem;
    color: #4a5f4a;
    line-height: 1.5;

    @media (max-width: 480px) {
      font-size: 0.875rem;
    }
  }

  &__contacts {
    flex: 1;
    min-width: 250px;

    @media (max-width: 768px) {
      min-width: 100%;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    margin-top: 0;
    color: #1a2e1a;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 0.75rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #2e3b2e;
    text-decoration: none;
    font-size: 1rem;
    transition: all 0.2s ease;
    padding: 0.4rem 0;
    -webkit-tap-highlight-color: transparent;

    @media (max-width: 768px) {
      font-size: 0.95rem;
    }

    &:hover {
      color: #1b5e20;
      transform: translateX(4px);
    }

    &:focus {
      outline: 2px solid #4caf50;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &__bottom {
    max-width: 1200px;
    margin: 2.5rem auto 0;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(46, 59, 46, 0.15);
    text-align: center;
  }

  &__copyright {
    font-size: 0.875rem;
    color: #5a6e5a;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__link {
      transition: none;

      &:hover {
        transform: none;
      }
    }
  }
}
</style>
