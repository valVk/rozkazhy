<script setup lang="ts">
const categories = [
  { label: "Людина", color: "var(--color-cat-person)", text: "var(--color-label-dark)" },
  { label: "Дія", color: "var(--color-cat-verb)", text: "var(--color-label-light)" },
  { label: "Предмет", color: "var(--color-cat-noun)", text: "var(--color-label-dark)" },
  { label: "Ознака", color: "var(--color-cat-descriptor)", text: "var(--color-label-light)" },
  { label: "Соціальна фраза", color: "var(--color-cat-social)", text: "var(--color-label-light)" },
];
</script>

<template>
  <section class="py-16 sm:py-24">
    <div class="max-w-3xl mx-auto px-6 text-center">
      <p class="text-xs font-bold tracking-widest uppercase text-mist mb-3">
        Опціональна функція
      </p>
      <h2 class="text-3xl font-bold">Кольори, які вже знайомі дитині</h2>
      <p class="mt-4 text-mist max-w-xl mx-auto leading-relaxed">
        Картки можна позначати кольором за типом слова — за системою, яку
        часто використовують логопеди. Якщо дитина вже вчиться за нею,
        застосунок підхопить ту саму логіку, а не вигадає нову.
      </p>

      <div class="flex flex-wrap justify-center gap-3 mt-8">
        <span
          v-for="cat in categories"
          :key="cat.label"
          class="px-4 py-2 rounded-full font-bold text-sm"
          :style="{ background: cat.color, color: cat.text }"
        >
          {{ cat.label }}
        </span>
      </div>

      <p class="mt-6 text-sm text-mist">
        Вимкнено за замовчуванням — вмикається й налаштовується дорослим,
        коли це доречно.
      </p>
    </div>
  </section>
</template>
