<script setup lang="ts">
import { mdiCloudOffOutline, mdiLockOutline, mdiScaleBalance } from "@mdi/js";
import MdiIcon from "./MdiIcon.vue";

const points = [
  {
    icon: mdiCloudOffOutline,
    title: "Без хмари",
    text: "Фото, аудіо та всі записи зберігаються тільки на пристрої.",
  },
  {
    icon: mdiLockOutline,
    title: "Панель дорослого за PIN-кодом",
    text: "Додавання й редагування карток захищене 4-значним кодом.",
  },
  {
    icon: mdiScaleBalance,
    title: "Відкритий код, MIT",
    text: "Безкоштовно, без реклами, без збору даних. Код відкритий на GitHub.",
  },
];
</script>

<template>
  <section class="py-16 sm:py-24 bg-white">
    <div class="max-w-4xl mx-auto px-6">
      <div class="grid sm:grid-cols-3 gap-8">
        <div v-for="p in points" :key="p.title" class="text-center sm:text-left">
          <div class="w-11 h-11 rounded-full bg-paper flex items-center justify-center mx-auto sm:mx-0">
            <MdiIcon :path="p.icon" :size="22" />
          </div>
          <h3 class="mt-4 font-bold text-lg">{{ p.title }}</h3>
          <p class="mt-2 text-mist text-sm leading-relaxed">{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
