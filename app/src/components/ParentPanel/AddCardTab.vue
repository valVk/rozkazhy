<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { Card } from "../../types/card";
import { useCards } from "../../composables/useCards";
import { useCamera } from "../../composables/useCamera";
import { useVoiceRecorder } from "../../composables/useVoiceRecorder";
import { resolveMediaUrl, writeAudioFromBase64 } from "../../composables/mediaUrl";
import { useAppStore } from "../../stores/appStore";

const props = defineProps<{ editingCard: Card | null }>();
const emit = defineEmits<{ (e: "saved"): void }>();

const store = useAppStore();
const { addCard, updateCardMeta, updateCardImage, updateCardAudio } =
  useCards();
const { capturePhoto, pickPhoto } = useCamera();
const { isRecording, start, stop } = useVoiceRecorder();

const title = ref("");
const imagePreviewUrl = ref<string | null>(null);
const audioPreviewUrl = ref<string | null>(null);
const pendingImagePath = ref<string | null>(null);
const pendingAudioPath = ref<string | null>(null);
const imageDirty = ref(false);
const audioDirty = ref(false);
const recStatus = ref("");
const audioFileInput = ref<HTMLInputElement | null>(null);

function resetForm() {
  title.value = "";
  imagePreviewUrl.value = null;
  audioPreviewUrl.value = null;
  pendingImagePath.value = null;
  pendingAudioPath.value = null;
  imageDirty.value = false;
  audioDirty.value = false;
  recStatus.value = "";
}

async function loadFromEditingCard() {
  if (!props.editingCard) {
    resetForm();
    return;
  }
  resetForm();
  title.value = props.editingCard.title;
  imagePreviewUrl.value = await resolveMediaUrl(props.editingCard.imagePath);
  audioPreviewUrl.value = await resolveMediaUrl(props.editingCard.audioPath);
}

onMounted(loadFromEditingCard);
watch(() => props.editingCard, loadFromEditingCard);

async function onTakePhoto() {
  const path = await capturePhoto();
  if (!path) return;
  pendingImagePath.value = path;
  imageDirty.value = true;
  imagePreviewUrl.value = await resolveMediaUrl(path);
}

async function onPickPhoto() {
  const path = await pickPhoto();
  if (!path) return;
  pendingImagePath.value = path;
  imageDirty.value = true;
  imagePreviewUrl.value = await resolveMediaUrl(path);
}

async function onToggleRecord() {
  if (isRecording.value) {
    const path = await stop();
    if (path) {
      pendingAudioPath.value = path;
      audioDirty.value = true;
      audioPreviewUrl.value = await resolveMediaUrl(path);
      recStatus.value = "Запис збережено ✓";
    }
    return;
  }
  const ok = await start();
  recStatus.value = ok ? "Йде запис… 🔴" : "Немає доступу до мікрофона";
}

function onChooseAudioFile() {
  audioFileInput.value?.click();
}

async function onAudioFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const base64 = await fileToBase64(file);
  const path = await writeAudioFromBase64(base64, file.type || "audio/mpeg");
  pendingAudioPath.value = path;
  audioDirty.value = true;
  audioPreviewUrl.value = await resolveMediaUrl(path);
  recStatus.value = "Аудіофайл додано ✓";
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function onSave() {
  const trimmed = title.value.trim();
  if (!trimmed) {
    store.showToast("Введіть слово");
    return;
  }

  if (props.editingCard) {
    const id = props.editingCard.id;
    if (trimmed !== props.editingCard.title) {
      await updateCardMeta(id, trimmed);
    }
    if (imageDirty.value && pendingImagePath.value) {
      await updateCardImage(id, pendingImagePath.value);
    }
    if (audioDirty.value) {
      await updateCardAudio(id, pendingAudioPath.value);
    }
    store.showToast("Картку оновлено ✓");
  } else {
    if (!pendingImagePath.value) {
      store.showToast("Додайте фото");
      return;
    }
    await addCard({
      title: trimmed,
      imagePath: pendingImagePath.value,
      audioPath: pendingAudioPath.value,
    });
    store.showToast("Картку додано ✓");
  }
  resetForm();
  emit("saved");
}
</script>

<template>
  <div>
    <label class="field-label">Фото предмета</label>
    <div id="photoPreviewWrap">
      <img v-if="imagePreviewUrl" :src="imagePreviewUrl" />
      <span v-else>Немає фото</span>
    </div>
    <div class="row" style="margin-top: 10px">
      <button class="btn btn-secondary" @click="onTakePhoto">📷 Камера</button>
      <button class="btn btn-secondary" @click="onPickPhoto">🖼 Галерея</button>
    </div>

    <label class="field-label">Слово або фраза</label>
    <input type="text" v-model="title" placeholder="Наприклад: ложка" />

    <label class="field-label">Голос дорослого</label>
    <div class="row">
      <button
        class="btn btn-secondary"
        :class="{ recording: isRecording }"
        @click="onToggleRecord"
      >
        {{ isRecording ? "⏹ Зупинити запис" : "🎙 Записати" }}
      </button>
      <button class="btn btn-secondary" @click="onChooseAudioFile">📁 Файл</button>
    </div>
    <input
      ref="audioFileInput"
      type="file"
      accept="audio/*"
      style="display: none"
      @change="onAudioFileSelected"
    />
    <div class="rec-status">{{ recStatus }}</div>
    <audio v-if="audioPreviewUrl" :src="audioPreviewUrl" controls style="width: 100%; margin-top: 8px" />

    <button class="btn btn-primary" @click="onSave">
      {{ editingCard ? "💾 Зберегти зміни" : "💾 Зберегти картку" }}
    </button>
  </div>
</template>

<style scoped>
#photoPreviewWrap {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 18px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 10px;
  color: var(--gray);
  font-size: 15px;
  text-align: center;
}
#photoPreviewWrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.recording {
  background: var(--danger) !important;
  color: white;
}
.rec-status {
  font-size: 14px;
  color: var(--gray);
  margin-top: 8px;
  min-height: 20px;
}
</style>
