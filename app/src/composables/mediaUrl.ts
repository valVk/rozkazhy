import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";

const PICTURES_DIR = "pictures";
const AUDIO_DIR = "audio";

let dirsReady: Promise<void> | null = null;

async function ensureDirs(): Promise<void> {
  if (!dirsReady) {
    dirsReady = (async () => {
      for (const dir of [PICTURES_DIR, AUDIO_DIR]) {
        try {
          await Filesystem.mkdir({
            path: dir,
            directory: Directory.Data,
            recursive: true,
          });
        } catch {
          // already exists
        }
      }
    })();
  }
  return dirsReady;
}

function extFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("m4a") || mime.includes("aac")) return "m4a";
  if (mime.includes("mp4")) return "mp4";
  return "jpg";
}

export async function writePictureFromBase64(
  base64Data: string,
  mimeType = "image/jpeg",
): Promise<string> {
  await ensureDirs();
  const filename = `${crypto.randomUUID()}.${extFromMime(mimeType)}`;
  const relativePath = `${PICTURES_DIR}/${filename}`;
  await Filesystem.writeFile({
    path: relativePath,
    data: base64Data,
    directory: Directory.Data,
  });
  return relativePath;
}

export async function writeAudioFromBase64(
  base64Data: string,
  mimeType = "audio/webm",
): Promise<string> {
  await ensureDirs();
  const filename = `${crypto.randomUUID()}.${extFromMime(mimeType)}`;
  const relativePath = `${AUDIO_DIR}/${filename}`;
  await Filesystem.writeFile({
    path: relativePath,
    data: base64Data,
    directory: Directory.Data,
  });
  return relativePath;
}

export async function deleteMediaFile(relativePath: string): Promise<void> {
  try {
    await Filesystem.deleteFile({
      path: relativePath,
      directory: Directory.Data,
    });
  } catch {
    // already gone, nothing to clean up
  }
}

export async function resolveMediaUrl(
  relativePath: string | null,
): Promise<string | null> {
  if (!relativePath) return null;
  try {
    const { uri } = await Filesystem.getUri({
      path: relativePath,
      directory: Directory.Data,
    });
    return Capacitor.convertFileSrc(uri);
  } catch {
    return null;
  }
}
