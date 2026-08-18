import { ref } from "vue";

const REPO = "valVk/rozkazhy";
const REPO_URL = `https://github.com/${REPO}`;

interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GithubRelease {
  tag_name: string;
  html_url: string;
  assets: GithubReleaseAsset[];
}

const version = ref<string | null>(null);
const apkUrl = ref<string | null>(null);
const releaseUrl = ref<string>(REPO_URL);
const loaded = ref(false);

export function useLatestRelease() {
  async function load(): Promise<void> {
    if (loaded.value) return;
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/releases/latest`,
      );
      if (!res.ok) return;
      const release: GithubRelease = await res.json();
      version.value = release.tag_name.replace(/^v/, "");
      releaseUrl.value = release.html_url;
      apkUrl.value =
        release.assets.find((a) => a.name.endsWith(".apk"))
          ?.browser_download_url ?? null;
    } catch {
      // Offline or rate-limited — buttons fall back to the repo/releases
      // page, which is always a safe, correct place to send someone.
    } finally {
      loaded.value = true;
    }
  }

  return { version, apkUrl, releaseUrl, loaded, load, REPO_URL };
}
