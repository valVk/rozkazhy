<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useCards } from "../../composables/useCards";
import { useSentenceLog } from "../../composables/useSentenceLog";

const { cards, refresh: refreshCards } = useCards();
const { logs, refresh: refreshLogs } = useSentenceLog();

onMounted(() => {
  refreshCards();
  refreshLogs();
});

const sortedCards = computed(() =>
  [...cards.value].sort((a, b) => b.tapCount - a.tapCount),
);

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("uk-UA");
}
</script>

<template>
  <div>
    <h3 style="margin-top: 0">Найчастіші слова</h3>
    <p v-if="sortedCards.length === 0" class="empty">Даних ще немає.</p>
    <div v-for="c in sortedCards" :key="c.id" class="stat-row">
      <span>{{ c.title }}</span>
      <span class="count">{{ c.tapCount }}</span>
    </div>

    <h3>Останні речення</h3>
    <p v-if="logs.length === 0" class="empty">Ще немає речень.</p>
    <div v-for="l in logs" :key="l.id" class="log-entry">
      <span class="time">{{ formatDate(l.playedAt) }}</span>
      {{ l.words.join(" • ") }}
    </div>
  </div>
</template>

<style scoped>
.empty {
  color: var(--gray);
}
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 8px;
}
.stat-row .count {
  background: var(--teal);
  color: white;
  font-weight: 800;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 14px;
  min-width: 28px;
  text-align: center;
}
.log-entry {
  background: white;
  border-radius: 14px;
  padding: 10px 14px;
  margin-bottom: 8px;
  font-size: 15px;
}
.log-entry .time {
  color: var(--gray);
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
}
</style>
