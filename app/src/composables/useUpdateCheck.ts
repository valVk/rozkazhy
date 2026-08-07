import { ref } from "vue";

const REPO = "valVk/rozkazhy";

const updateAvailable = ref(false);
const latestVersion = ref<string | null>(null);
const latestApkUrl = ref<string | null>(null);
const latestReleaseUrl = ref<string | null>(null);

let checked = false;

interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name: string;
  html_url: string;
  assets: GithubReleaseAsset[];
}

function parseVersion(v: string): [number, number, number] | null {
  const match = v.trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isNewer(latest: string, current: string): boolean {
  const a = parseVersion(latest);
  const b = parseVersion(current);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return false;
}

export function useUpdateCheck() {
  async function checkForUpdate(): Promise<void> {
    if (checked) return;
    checked = true;
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/releases/latest`,
      );
      if (!res.ok) return;
      const release: GithubRelease = await res.json();
      if (!isNewer(release.tag_name, __APP_VERSION__)) return;

      const apkAsset = release.assets.find((a) => a.name.endsWith(".apk"));
      updateAvailable.value = true;
      latestVersion.value = release.tag_name.replace(/^v/, "");
      latestApkUrl.value = apkAsset?.browser_download_url ?? null;
      latestReleaseUrl.value = release.html_url;
    } catch {
      // Offline or rate-limited — silently skip, not worth bothering the user.
    }
  }

  return {
    updateAvailable,
    latestVersion,
    latestApkUrl,
    latestReleaseUrl,
    currentVersion: __APP_VERSION__,
    checkForUpdate,
  };
}
