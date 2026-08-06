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

### Як користуватися застосунком

#### Головний екран (для дитини)

- **Верхня панель**: назва "👋 Розкажи" зліва; праворуч — кнопка **⭐** (відкриває збережені послідовності) та кнопка **⚙️** (шестерня — довге натискання ~0.7 с відкриває панель для дорослих через PIN-код; коротке натискання нічого не робить).
- **Стрічка речення** (біла смуга під верхньою панеллю): порожня стрічка показує підказку "Торкніться картки, щоб почати". Праворуч стрічки три круглі кнопки:
  - **💾** — зберегти поточну стрічку як послідовність для повторного відтворення (неактивна, якщо стрічка порожня).
  - **▶** — відтворити всю стрічку по черзі (кожна картка озвучується з невеликою паузою між ними), після відтворення речення записується в лог дашборду (неактивна, якщо стрічка порожня).
  - **🗑** — очистити стрічку (неактивна, якщо стрічка порожня).
- **Сітка карток** (основна область екрана): дотик на картку — картка додається у стрічку, одразу програється її голос (записаний або синтезований), і лічильник використання картки збільшується на 1. Якщо карток ще немає, показується підказка звернутися до дорослого.

#### PIN-екран (доступ до панелі дорослого)

- Відкривається довгим натисканням на **⚙️**.
- **Перший запуск**: екран просить створити 4-значний PIN — введіть 4 цифри на цифровій клавіатурі, вони одразу зберігаються (у вигляді хешу) і панель дорослого відкривається.
- **Наступні рази**: введіть той самий PIN. Невірний код показує повідомлення "Невірний PIN" і скидає введені цифри.
- Кнопка **⌫** на клавіатурі стирає останню цифру.
- Кнопка **Скасувати** закриває PIN-екран без входу в панель дорослого.

#### Панель для дорослих

Складається з чотирьох вкладок угорі (**➕ Додати**, **🗂 Картки**, **📊 Дашборд**, **⚙️**) та кнопки **✕** для закриття всієї панелі.

**Вкладка ➕ Додати** (створення нової картки або редагування наявної):

- **Фото предмета**: попередній перегляд фото (сірий прямокутник "Немає фото", якщо ще нічого не обрано).
  - **📷 Камера** — відкриває камеру пристрою, зробити фото.
  - **🖼 Галерея** — обрати наявне зображення з галереї телефону.
- **Слово або фраза**: текстове поле для назви картки (обов'язкове; саме цей текст озвучується синтезованим голосом, якщо немає запису).
- **🔊 Прослухати, як говоритиме картка**: програє поточний запис голосу, якщо він уже є, або синтезований голос введеного слова — зручно перевірити звучання ще до збереження картки.
- **Голос дорослого**:
  - **🎙 Записати / ⏹ Зупинити запис** — натисніть, щоб почати запис голосу мікрофоном (застосунок попросить дозвіл на використання мікрофона при першому запуску), натисніть ще раз (кнопка стане червоною і матиме напис "Зупинити запис"), щоб зупинити й зберегти запис.
  - **📁 Файл** — обрати вже наявний аудіофайл із пристрою замість запису.
  - Після запису/вибору файлу з'являється звичайний аудіоплеєр для прослуховування.
- **💾 Зберегти картку** (або **💾 Зберегти зміни** в режимі редагування): зберігає картку. Для нової картки обов'язкові слово та фото; голос — необов'язковий (буде використано синтез мовлення). У режимі редагування можна змінити лише фото, лише голос або лише текст — решта полів залишиться без змін.

**Вкладка 🗂 Картки** (управління наявними картками):

- Список усіх карток із мініатюрою та назвою.
- **✏️** — відкриває картку у вкладці "Додати" для редагування (фото, голос чи текст можна замінити окремо, без пересворення картки).
- **🗑** — видаляє картку (з підтвердженням через діалогове вікно); видаляються також файли фото та аудіо цієї картки.

**Вкладка 📊 Дашборд** (статистика):

- **Найчастіші слова**: список карток, відсортований за кількістю натискань (лічильник праворуч кожного слова).
- **Останні речення**: до 20 останніх відтворених речень зі стрічки, з датою/часом і словами через " • ".

**Вкладка ⚙️ (Налаштування)**:

- Поле для порогу автоматичного "улюблення" послідовностей — число, скільки разів треба відтворити послідовність, щоб вона автоматично отримала позначку ⭐ (за замовчуванням 5).
- **💾 Зберегти** — зберігає нове значення порогу.

#### Панель послідовностей (кнопка ⭐ на головному екрані)

- Список збережених послідовностей (назва — це або власна назва, або перелічені через " • " слова карток); зверху завжди йдуть улюблені.
- Дотик на назву послідовності — **відтворює** її: картки завантажуються в стрічку речення і програються по черзі, лічильник використання послідовності збільшується (після досягнення порогу з Налаштувань послідовність автоматично стає улюбленою).
- **⭐ / ☆** — вручну позначити/зняти позначку "улюблена" (ручне зняття позначки має пріоритет над автоматичною логікою).
- **✏️** — відкриває редактор послідовності (див. нижче).
- **🗑** — видаляє послідовність повністю (без підтвердження).

#### Редактор послідовності

- Список карток послідовності з мініатюрами.
- **⠿** (ручка зліва від картки) — затиснути та перетягнути картку вгору/вниз, щоб змінити порядок відтворення.
- **✕** праворуч від картки — видаляє цю картку з послідовності (сама картка в застосунку не видаляється, лише прибирається з цієї послідовності).
- **Скасувати** — закрити редактор без збереження змін.
- **💾 Зберегти** — застосувати нові порядок/склад карток; якщо видалити всі картки й зберегти, послідовність буде видалено повністю.

### Встановлення APK (застосунок не публікується в Google Play)

APK збирається автоматично при кожному релізі на GitHub (див. вкладку **Releases** цього репозиторію) і не проходить через Google Play — тому Android за замовчуванням блокує його встановлення як "додатку з невідомого джерела". Це нормально й безпечно, якщо ви завантажуєте APK з офіційних релізів цього репозиторію.

1. На телефоні відкрийте сторінку **Releases** репозиторію в браузері та завантажте файл `rozkazhy-<версія>.apk` з потрібного релізу (наприклад, `rozkazhy-1.2.0.apk` для релізу з тегом `v1.2.0` — версія береться з тегу релізу й одночасно проставляється в `package.json` та у версії Android-застосунку).
2. Спробуйте відкрити завантажений файл (зазвичай через "Файли" або сповіщення про завантаження) — Android покаже попередження на кшталт "Заборонено встановлення з цього джерела".
3. Натисніть **Налаштування** у цьому діалозі (або перейдіть вручну: **Налаштування → Застосунки → Особливий доступ → Встановлення невідомих застосунків**) і оберіть застосунок, яким ви відкривали APK (наприклад, "Файли" або браузер), увімкніть перемикач **Дозволити з цього джерела**.
4. Поверніться назад і повторно відкрийте APK-файл — з'явиться стандартний діалог встановлення. Натисніть **Встановити**.
5. Після встановлення можна вимкнути дозвіл із кроку 3, якщо не плануєте встановлювати оновлення вручну надалі.

Це підписана release-збірка (власним ключем, не через Google Play), тому Android все одно може показати попередження про "невідомого розробника" — це очікувано для застосунків поза Google Play, і не означає, що збірку не підписано.

### Технології

- Vue 3 + TypeScript + Vite
- Capacitor (нативна обгортка для Android): SQLite, Filesystem, Camera, Preferences, запис голосу
- GitHub Actions збирає підписаний release APK автоматично при публікації релізу на GitHub

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

### How to use the app

#### Main screen (for the child)

- **Top bar**: "👋 Розкажи" title on the left; on the right, a **⭐** button (opens saved sequences) and a **⚙️** gear button (long-press ~0.7s opens the parent panel behind a PIN; a short tap does nothing).
- **Sentence strip** (white bar under the top bar): shows a "Tap a card to start" hint when empty. Three round buttons on the right of the strip:
  - **💾** — save the current strip as a reusable sequence (disabled while the strip is empty).
  - **▶** — play the whole strip in order (each card's voice plays with a short pause between them); after playback the sentence is logged for the dashboard (disabled while empty).
  - **🗑** — clear the strip (disabled while empty).
- **Card grid** (main area): tapping a card adds it to the strip, immediately plays its voice (recorded or synthesized), and increments that card's tap counter by 1. An empty grid shows a hint to ask an adult to add cards.

#### PIN screen (parent panel access)

- Opened by long-pressing **⚙️**.
- **First time**: prompts you to create a 4-digit PIN — enter 4 digits on the number pad; they're saved immediately (as a hash) and the parent panel opens.
- **Every time after**: enter the same PIN. A wrong code shows "Wrong PIN" and clears the entry.
- **⌫** on the keypad deletes the last digit.
- **Cancel** closes the PIN screen without entering the parent panel.

#### Parent panel

Four tabs at the top (**➕ Add**, **🗂 Cards**, **📊 Dashboard**, **⚙️**) and a **✕** button to close the whole panel.

**➕ Add tab** (create a new card, or edit an existing one):

- **Photo**: preview area (shows "No photo" until one is picked).
  - **📷 Camera** — opens the device camera to take a photo.
  - **🖼 Gallery** — pick an existing image from the phone's gallery.
- **Word or phrase**: text field for the card's label (required; this exact text is spoken via text-to-speech if no recording is provided).
- **🔊 Listen to how the card will sound**: plays the current recording if one exists, or the synthesized voice for the typed word — lets you check it before saving.
- **Adult's voice**:
  - **🎙 Record / ⏹ Stop recording** — tap to start recording via the microphone (the app requests microphone permission the first time); tap again (button turns red, label changes to "Stop recording") to stop and save the recording.
  - **📁 File** — pick an existing audio file from the device instead of recording.
  - Once recorded/picked, a normal audio player appears for playback.
- **💾 Save card** (or **💾 Save changes** in edit mode): saves the card. A new card requires a word and a photo; voice is optional (falls back to text-to-speech). In edit mode you can change just the photo, just the voice, or just the text — untouched fields are left alone.

**🗂 Cards tab** (manage existing cards):

- List of all cards with thumbnail and title.
- **✏️** — opens the card in the Add tab for editing (photo, voice, or text can each be replaced independently, without recreating the card).
- **🗑** — deletes the card (with a confirmation dialog); its photo and audio files are deleted too.

**📊 Dashboard tab** (stats):

- **Most-used words**: cards sorted by tap count (count shown to the right of each word).
- **Recent sentences**: the last 20 sentences played from the strip, with timestamp and words joined by " • ".

**⚙️ Settings tab**:

- A number field for the sequence auto-favorite threshold — how many replays before a sequence automatically gets the ⭐ mark (default 5).
- **💾 Save** — saves the new threshold value.

#### Sequences panel (⭐ button on the main screen)

- List of saved sequences (the name is either a custom name or the joined titles of its cards, separated by " • "); favorites are always listed first.
- Tapping a sequence's name **replays** it: its cards load into the sentence strip and play in order, and the sequence's usage count increases (once the Settings threshold is reached, it's marked favorite automatically).
- **⭐ / ☆** — manually mark/unmark as favorite (a manual unmark takes priority over the automatic logic).
- **✏️** — opens the sequence editor (below).
- **🗑** — deletes the sequence entirely (no confirmation).

#### Sequence editor

- List of the sequence's cards with thumbnails.
- **⠿** (handle on the left of each card) — press and drag up/down to reorder playback.
- **✕** on the right of each card — removes that card from the sequence (the card itself is not deleted from the app, just from this sequence).
- **Cancel** — close the editor without saving changes.
- **💾 Save** — apply the new order/set of cards; if you remove every card and save, the sequence is deleted entirely.

### Installing the APK (the app is not on Google Play)

The APK is built automatically on every GitHub release (see the **Releases** tab of this repo) and doesn't go through Google Play — so Android blocks installing it by default as an "app from an unknown source." That's expected and safe as long as you get the APK from this repo's official releases.

1. On your phone, open this repo's **Releases** page in a browser and download `rozkazhy-<version>.apk` from the release you want (e.g. `rozkazhy-1.2.0.apk` for a release tagged `v1.2.0` — the version comes from the release tag and is also stamped into `package.json` and the Android app's version).
2. Try opening the downloaded file (usually via "Files" or the download notification) — Android will show a warning like "Install blocked" / "For your security, your phone is not allowed to install unknown apps from this source."
3. Tap **Settings** in that dialog (or go manually: **Settings → Apps → Special app access → Install unknown apps**), select the app you opened the APK with (e.g. "Files" or your browser), and toggle **Allow from this source**.
4. Go back and open the APK file again — the normal install dialog will appear. Tap **Install**.
5. After installing, you can turn that permission back off if you don't plan to sideload updates manually going forward.

This is a release build signed with our own key (not through Google Play), so Android may still show an "unknown developer" warning — expected for apps distributed outside Google Play, and doesn't mean the build is unsigned.

### Tech stack

- Vue 3 + TypeScript + Vite
- Capacitor (native Android wrapper): SQLite, Filesystem, Camera, Preferences, voice recording
- GitHub Actions builds a signed release APK automatically whenever a GitHub release is published

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

CI builds a signed `assembleRelease` APK (see `.github/workflows/build-apk.yml`). Signing is driven by four repo secrets — `KEYSTORE_BASE64` (the keystore file, base64-encoded), `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` — decoded and passed as env vars during the build; `app/android/app/build.gradle` reads them via `signingConfigs.release`, which only activates when those env vars are present (so local/unsigned builds are unaffected). Rotate the keystore by generating a new one with `keytool`, re-encoding it (`base64 -i release.jks | tr -d '\n'`), and updating the secrets — but note this changes the app's signing identity, so it can never be used to update an existing installed release built with the old key.

The build's version comes from the GitHub release tag (`v1.2.0` → app version `1.2.0`; a leading `v` is stripped). The workflow writes that version into `package.json` and passes it to Gradle as `versionName`, while `versionCode` is set to the GitHub Actions run number (a monotonically increasing integer, satisfying Android's requirement that each published `versionCode` be higher than the last). Manual `workflow_dispatch` runs (no release tag) fall back to whatever version is currently in `package.json`. The output APK is named `rozkazhy-<version>.apk`.

### License

MIT — see [LICENSE](LICENSE). / MIT — див. [LICENSE](LICENSE).
