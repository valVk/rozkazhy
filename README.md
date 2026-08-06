# Розкажи (Rozkazhy)

## UA

Мобільний застосунок для дітей, які мають труднощі зі спілкуванням, що допомагає будувати змістовні фрази за допомогою карток "фото + записаний голос". Дитина торкається картки — програється голос рідної людини (або TTS, якщо голосу немає) і картка додається до "стрічки речення" зверху екрана.

### Що є всередині

- **Картки спілкування**: фото предмета/дії + слово, записане голосом дорослого
- **Стрічка речення**: послідовне додавання карток, відтворення "речення" одним натисканням, очищення
- **Послідовності**: збереження стрічки як готової послідовності для повторного відтворення; позначення "улюбленою" вручну або автоматично після N відтворень (поріг налаштовується)
- **Панель для дорослих** (за 4-значним PIN, довге натискання на ⚙️):
  - Додавання картки: фото з камери або галереї, запис голосу (нативний рекордер) або завантаження аудіофайлу
  - Управління картками: редагування, видалення, окрема заміна фото чи голосу без перестворення картки
  - Дашборд: найчастіше вживані слова, останні 20 відтворених речень
  - Налаштування: поріг автоматичного улюбленого для послідовностей
- Дані та медіафайли (фото/аудіо) зберігаються локально на пристрої — SQLite для записів, окремі файли для фото та аудіо. Немає хмарної синхронізації.

### Технології

- Vue 3 + TypeScript + Vite
- Capacitor (нативна обгортка для Android): SQLite, Filesystem, Camera, Preferences, запис голосу
- GitHub Actions збирає debug APK автоматично при публікації релізу на GitHub

### Структура репозиторію

```
pomogayka/
├── app/                  Vue3 + Capacitor проєкт
│   ├── src/               вихідний код застосунку
│   └── android/            згенерований нативний Android-проєкт
├── .github/workflows/     CI: збірка APK при релізі
└── index (1).html, ...    оригінальний прототип (референс, PWA-версія)
```

### Розробка

```bash
cd app
npm install
npm run dev          # веб-версія в браузері для швидкої розробки
npm run build         # білд + перевірка типів
npx cap sync android   # синхронізація в нативний Android-проєкт
npx cap open android   # відкрити в Android Studio
```

---

## EN

A mobile app for children who experience communication difficulties, that helps build meaningful phrases using picture cards paired with a recorded voice. The child taps a card — it plays the recorded voice of a familiar person (or falls back to text-to-speech) and the card is added to a "sentence strip" at the top of the screen.

### What's inside

- **Communication cards**: a photo of an object/action + a word, spoken in an adult's recorded voice
- **Sentence strip**: tap cards to build a sequence, play the whole "sentence" with one button, clear it
- **Sequences**: save the current strip as a reusable sequence for replay; mark favorites manually, or automatically after N replays (threshold is configurable)
- **Parent panel** (behind a 4-digit PIN, long-press the ⚙️ icon):
  - Add card: photo via camera or gallery, voice via native recorder or uploaded audio file
  - Manage cards: edit, delete, replace just the photo or just the voice without recreating the card
  - Dashboard: most-tapped words, last 20 played sentences
  - Settings: auto-favorite threshold for sequences
- All data and media (photos/audio) live on-device — SQLite for records, separate files for photos and audio. No cloud sync.

### Tech stack

- Vue 3 + TypeScript + Vite
- Capacitor (native Android wrapper): SQLite, Filesystem, Camera, Preferences, voice recording
- GitHub Actions builds a debug APK automatically whenever a GitHub release is published

### Repository layout

```
pomogayka/
├── app/                  Vue3 + Capacitor project
│   ├── src/               app source code
│   └── android/            generated native Android project
├── .github/workflows/     CI: build APK on release
└── index (1).html, ...    original prototype (reference, PWA version)
```

### Development

```bash
cd app
npm install
npm run dev          # web version in browser, fast iteration
npm run build         # build + typecheck
npx cap sync android   # sync into the native Android project
npx cap open android   # open in Android Studio
```

### Signing a release build

See the workflow at `.github/workflows/build-apk.yml`. It currently builds an unsigned `assembleDebug` APK. To switch to a signed `assembleRelease` build, generate a keystore locally with `keytool`, add `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` as repo secrets, and update the workflow accordingly.

### License

MIT — see [LICENSE](LICENSE). / MIT — див. [LICENSE](LICENSE).
