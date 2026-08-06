import { Camera } from "@capacitor/camera";
import { VoiceRecorder } from "capacitor-voice-recorder";

export function usePermissions() {
  async function ensureCameraPermission(): Promise<boolean> {
    const status = await Camera.checkPermissions();
    if (status.camera === "granted") return true;
    const req = await Camera.requestPermissions({ permissions: ["camera"] });
    return req.camera === "granted";
  }

  async function ensurePhotosPermission(): Promise<boolean> {
    const status = await Camera.checkPermissions();
    if (status.photos === "granted") return true;
    const req = await Camera.requestPermissions({ permissions: ["photos"] });
    return req.photos === "granted";
  }

  async function ensureMicrophonePermission(): Promise<boolean> {
    try {
      const status = await VoiceRecorder.hasAudioRecordingPermission();
      if (status.value) return true;
      const req = await VoiceRecorder.requestAudioRecordingPermission();
      return req.value;
    } catch {
      return false;
    }
  }

  return {
    ensureCameraPermission,
    ensurePhotosPermission,
    ensureMicrophonePermission,
  };
}
