import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { writePictureFromBase64 } from "./mediaUrl";
import { usePermissions } from "./usePermissions";

export function useCamera() {
  const { ensureCameraPermission, ensurePhotosPermission } = usePermissions();

  async function capturePhoto(): Promise<string | null> {
    const granted = await ensureCameraPermission();
    if (!granted) return null;
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 80,
    });
    if (!photo.base64String) return null;
    return writePictureFromBase64(
      photo.base64String,
      `image/${photo.format ?? "jpeg"}`,
    );
  }

  async function pickPhoto(): Promise<string | null> {
    const granted = await ensurePhotosPermission();
    if (!granted) return null;
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      quality: 80,
    });
    if (!photo.base64String) return null;
    return writePictureFromBase64(
      photo.base64String,
      `image/${photo.format ?? "jpeg"}`,
    );
  }

  return { capturePhoto, pickPhoto };
}
