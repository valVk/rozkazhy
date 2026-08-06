<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useParentPin } from "../composables/useParentPin";

const emit = defineEmits<{
  (e: "unlocked"): void;
  (e: "cancel"): void;
}>();

const { hasPinSet, createPin, verifyPin } = useParentPin();

const pinBuffer = ref("");
const isCreateMode = ref(false);
const errorMsg = ref("");

onMounted(async () => {
  isCreateMode.value = !(await hasPinSet());
});

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

async function pressKey(k: string) {
  if (k === "⌫") {
    pinBuffer.value = pinBuffer.value.slice(0, -1);
    return;
  }
  if (k === "" || pinBuffer.value.length >= 4) return;
  pinBuffer.value += k;
  if (pinBuffer.value.length === 4) {
    await handleComplete();
  }
}

async function handleComplete() {
  if (isCreateMode.value) {
    await createPin(pinBuffer.value);
    emit("unlocked");
    return;
  }
  const ok = await verifyPin(pinBuffer.value);
  if (ok) {
    emit("unlocked");
  } else {
    errorMsg.value = "Невірний PIN";
    pinBuffer.value = "";
    setTimeout(() => (errorMsg.value = ""), 1500);
  }
}
</script>

<template>
  <div id="pinScreen">
    <h2>Режим для дорослих</h2>
    <p>
      {{
        isCreateMode
          ? "Створіть 4-значний PIN для дорослих"
          : "Введіть PIN"
      }}
    </p>
    <div id="pinDots">
      <div
        v-for="i in 4"
        :key="i"
        class="pin-dot"
        :class="{ filled: i <= pinBuffer.length }"
      ></div>
    </div>
    <div id="pinPad">
      <button
        v-for="(k, idx) in keys"
        :key="idx"
        :style="{ visibility: k === '' ? 'hidden' : 'visible' }"
        @click="pressKey(k)"
      >
        {{ k }}
      </button>
    </div>
    <button class="btn btn-secondary" style="margin-top: 20px" @click="emit('cancel')">
      Скасувати
    </button>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    <p v-else-if="isCreateMode" id="pinHint">
      Цей код буде потрібен щоразу, щоб відкрити панель дорослого. Запам'ятайте його.
    </p>
  </div>
</template>

<style scoped>
#pinScreen {
  position: fixed;
  inset: 0;
  background: var(--cream);
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}
#pinDots {
  display: flex;
  gap: 14px;
  margin: 20px 0;
}
.pin-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ddd;
}
.pin-dot.filled {
  background: var(--pink);
}
#pinPad {
  display: grid;
  grid-template-columns: repeat(3, 72px);
  gap: 14px;
}
#pinPad button {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;
  background: white;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
#pinHint {
  color: var(--gray);
  font-size: 13px;
  margin-top: 16px;
  max-width: 300px;
}
.error {
  color: var(--danger);
  font-weight: 700;
  margin-top: 16px;
}
</style>
