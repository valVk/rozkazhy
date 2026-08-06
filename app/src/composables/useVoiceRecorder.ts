import { ref } from "vue";
import { Capacitor } from "@capacitor/core";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { writeAudioFromBase64 } from "./mediaUrl";
import { usePermissions } from "./usePermissions";

let webMediaRecorder: MediaRecorder | null = null;
let webChunks: Blob[] = [];
let webStream: MediaStream | null = null;

export function useVoiceRecorder() {
  const isRecording = ref(false);
  const { ensureMicrophonePermission } = usePermissions();

  async function startNative(): Promise<void> {
    await VoiceRecorder.startRecording();
  }

  async function stopNative(): Promise<string | null> {
    const result = await VoiceRecorder.stopRecording();
    const base64 = result.value?.recordDataBase64;
    const mimeType = result.value?.mimeType ?? "audio/aac";
    if (!base64) return null;
    return writeAudioFromBase64(base64, mimeType);
  }

  async function startWeb(): Promise<void> {
    webStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    webChunks = [];
    webMediaRecorder = new MediaRecorder(webStream);
    webMediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) webChunks.push(e.data);
    };
    webMediaRecorder.start();
  }

  function stopWeb(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!webMediaRecorder) {
        resolve(null);
        return;
      }
      webMediaRecorder.onstop = async () => {
        const blob = new Blob(webChunks, { type: "audio/webm" });
        webStream?.getTracks().forEach((t) => t.stop());
        webStream = null;
        webMediaRecorder = null;
        const base64 = await blobToBase64(blob);
        const path = await writeAudioFromBase64(base64, "audio/webm");
        resolve(path);
      };
      webMediaRecorder.stop();
    });
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1] ?? "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function start(): Promise<boolean> {
    const granted = await ensureMicrophonePermission();
    if (!granted) return false;
    try {
      if (Capacitor.isNativePlatform()) {
        await startNative();
      } else {
        await startWeb();
      }
      isRecording.value = true;
      return true;
    } catch {
      isRecording.value = false;
      return false;
    }
  }

  async function stop(): Promise<string | null> {
    isRecording.value = false;
    try {
      if (Capacitor.isNativePlatform()) {
        return await stopNative();
      }
      return await stopWeb();
    } catch {
      return null;
    }
  }

  return { isRecording, start, stop };
}
