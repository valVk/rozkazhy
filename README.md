# Розкажи (Rozkazhy)

## UA

Мобільний застосунок для дітей, які мають труднощі зі спілкуванням, що допомагає будувати змістовні фрази за допомогою карток "фото + записаний голос". Дитина торкається картки — програється голос рідної людини (або TTS, якщо голосу немає) і картка додається до "стрічки речення" зверху екрана.

### Що є всередині

- **Картки спілкування**: фото предмета/дії + слово, записане голосом дорослого
- **Стрічка речення**: послідовне додавання карток, відтворення "речення" одним натисканням, пауза/продовження з обраної картки, очищення
- **Послідовності**: збереження стрічки як готової послідовності для повторного відтворення; позначення "улюбленою" вручну або автоматично після N відтворень (поріг налаштовується)
- **Кольорове кодування карток за типом слова** (опціонально, вимкнено за замовчуванням): позначення карток кольором за системою, схожою на ту, якою часто користуються логопеди — детальніше нижче
- **Сповіщення про оновлення застосунку**: якщо вийшла нова версія, застосунок сам про це повідомляє і пропонує завантажити її
- **Панель для дорослих** (за 4-значним PIN, довге натискання на іконку-шестерню):
  - Додавання картки: фото з камери або галереї, запис голосу (нативний рекордер) або завантаження аудіофайлу, необов'язковий тип слова для кольорового кодування
  - Управління картками: редагування, видалення, окрема заміна фото чи голосу без перестворення картки, призначення/зміна типу слова заднім числом, фільтр за типом слова
  - Дашборд: найчастіше вживані слова, останні 20 відтворених речень
  - Налаштування: поріг автоматичного улюбленого для послідовностей, увімкнення й налаштування кольорового кодування карток
- Дані та медіафайли (фото/аудіо) зберігаються локально на пристрої — SQLite для записів, окремі файли для фото та аудіо. Немає хмарної синхронізації.

### Як користуватися застосунком

#### Головний екран (для дитини)

- **Верхня панель**: назва "Розкажи" зліва; праворуч — кнопка із зіркою (відкриває збережені послідовності) та кнопка-шестерня (довге натискання ~0.7 с відкриває панель для дорослих через PIN-код; коротке натискання нічого не робить). Якщо доступна нова версія застосунку, на шестерні з'являється маленький червоний індикатор — він лише інформує, натискати на нього окремо не потрібно; деталі та кнопка завантаження — у панелі дорослого (вкладка Налаштування).
- **Стрічка речення та кнопки керування** — об'єднані в одну панель під верхньою панеллю. Порожня стрічка показує підказку по центру "Торкніться картки, щоб почати". Три кнопки під стрічкою:
  - **Дискета (зліва)** — зберегти поточну стрічку як послідовність для повторного відтворення (неактивна, якщо стрічка порожня).
  - **Велика кругла кнопка по центру** — відтворити всю стрічку по черзі; під час відтворення та сама кнопка стає кнопкою паузи. Картка, що звучить зараз, підсвічується жовтою рамкою і автоматично прокручується у видиму область, якщо стрічка не вміщується цілком. Після повного відтворення речення записується в лог дашборду. Під час паузи можна торкнутися будь-якої картки в стрічці, щоб продовжити відтворення саме з неї.
  - **Кошик (справа)** — очистити стрічку (неактивна, якщо стрічка порожня; також зупиняє відтворення, якщо воно триває).
- **Сітка карток** (основна область екрана):
  - Якщо кольорове кодування карток увімкнено (див. Налаштування), над сіткою з'являється рядок кольорових кнопок-фільтрів — "Усі" (скидає фільтр) та по одній кнопці на кожен тип слова (Людина/Дія/Предмет/Ознака/Соціальна фраза). Торкніться кольору, щоб показати лише картки цього типу; торкніться "Усі", щоб знову побачити всі картки.
  - Дотик на картку — картка додається у стрічку, одразу програється її голос (записаний або синтезований), і лічильник використання картки збільшується на 1.
  - Картки з призначеним типом слова мають суцільний колір під назвою картки (колір відповідає типу слова) з автоматично підібраним контрастним кольором тексту, щоб назва завжди легко читалась.
  - Якщо карток ще немає, показується підказка звернутися до дорослого.

#### PIN-екран (доступ до панелі дорослого)

- Відкривається довгим натисканням на шестерню.
- **Перший запуск**: екран просить створити 4-значний PIN — введіть 4 цифри на цифровій клавіатурі, вони одразу зберігаються (у вигляді хешу) і панель дорослого відкривається.
- **Наступні рази**: введіть той самий PIN. Невірний код показує повідомлення "Невірний PIN" і скидає введені цифри.
- Кнопка **⌫** на клавіатурі стирає останню цифру.
- Кнопка **Скасувати** закриває PIN-екран без входу в панель дорослого.

#### Панель для дорослих

Тепер відкривається **на весь екран** (а не спливаючим вікном знизу). Чотири вкладки зверху (Додати, Картки, Дашборд, Налаштування) та кнопка закриття поруч із заголовком — вона прокручується разом із вмістом вкладки, а не залишається "прилиплою". Якщо доступна нова версія застосунку — на вкладці Налаштування з'являється такий самий маленький червоний індикатор, як і на головному екрані.

**Вкладка "Додати"** (створення нової картки або редагування наявної):

- **Фото предмета**: попередній перегляд фото ("Немає фото", якщо ще нічого не обрано).
  - **Камера** — відкриває камеру пристрою, зробити фото.
  - **Галерея** — обрати наявне зображення з галереї телефону.
- **Слово або фраза**: текстове поле для назви картки (обов'язкове; саме цей текст озвучується синтезованим голосом, якщо немає запису).
- **Тип слова** (з'являється лише якщо в Налаштуваннях увімкнено кольорове кодування карток): ряд кольорових кнопок — Людина, Дія, Предмет, Ознака, Соціальна фраза — та кнопка "Без категорії". Обраний тип визначає колір картки в сітці.
- **"Прослухати, як говоритиме картка"**: програє поточний запис голосу, якщо він уже є, або синтезований голос введеного слова — зручно перевірити звучання ще до збереження картки.
- **Голос дорослого**:
  - **Записати / Зупинити запис** — натисніть, щоб почати запис голосу мікрофоном (застосунок попросить дозвіл на використання мікрофона при першому запуску), натисніть ще раз, щоб зупинити й зберегти запис.
  - **Файл** — обрати вже наявний аудіофайл із пристрою замість запису.
  - Після запису/вибору файлу з'являється звичайний аудіоплеєр для прослуховування.
- **Зберегти картку** (або **Зберегти зміни** в режимі редагування): зберігає картку. Для нової картки обов'язкові слово та фото; голос і тип слова — необов'язкові. У режимі редагування можна змінити лише фото, лише голос, лише текст або лише тип слова — решта полів залишиться без змін.

**Вкладка "Картки"** (управління наявними картками):

- Якщо кольорове кодування ввімкнено — над списком з'являється той самий рядок кольорових фільтрів, що й на головному екрані, і список повідомляє окремо "Немає карток цього типу", якщо фільтр не дав результатів (на відміну від "Ще немає карток", коли карток узагалі немає).
- Список усіх (або відфільтрованих) карток із мініатюрою та назвою, кнопкою редагування (олівець) і кнопкою видалення (кошик, з підтвердженням через діалогове вікно — видаляються також файли фото та аудіо цієї картки).
- Якщо кольорове кодування ввімкнено — під кожною карткою: тонка розділювальна лінія, короткий підпис із поточним типом слова цієї картки (або "Без категорії") і ряд маленьких кольорових кружечків. Торкніться кружечка, щоб одразу призначити чи змінити тип слова цій картці, без відкриття вкладки редагування — це основний спосіб проставити тип слова вже наявним карткам після ввімкнення функції.

**Вкладка "Дашборд"** (статистика):

- **Найчастіші слова**: список карток, відсортований за кількістю натискань (лічильник праворуч кожного слова).
- **Останні речення**: до 20 останніх відтворених речень зі стрічки, з датою/часом і словами через " • ".

**Вкладка "Налаштування"**:

- Якщо доступна нова версія застосунку — вгорі з'являється помітний червоний банер "Доступна нова версія X.Y.Z — натисніть, щоб оновити". Дотик відкриває вікно з версією та кнопкою "Завантажити оновлення", яка відкриває сторінку завантаження у системному браузері телефону.
- Поле для порогу автоматичного "улюблення" послідовностей — число, скільки разів треба відтворити послідовність, щоб вона автоматично отримала позначку улюбленої (за замовчуванням 5). Кнопка "Зберегти" зберігає нове значення.
- **Кольорове кодування карток за типом слова**:
  - Перемикач "Увімкнено" / "Вимкнено" (за замовчуванням вимкнено — підходить не всім дітям, тому це свідомий вибір дорослого).
  - Коли ввімкнено — короткий пояснювальний текст і для кожного з 5 типів слова (Людина/Дія/Предмет/Ознака/Соціальна фраза) ряд кольорових зразків на вибір (не довільний колір — підібраний набір, який гарантовано добре читається на картках).
  - Кнопка "Скинути кольори до типових".

#### Панель послідовностей (кнопка із зіркою на головному екрані)

- Список збережених послідовностей (назва — це або власна назва, або перелічені через " • " слова карток); зверху завжди йдуть улюблені.
- Дотик на назву послідовності — **відтворює** її: картки завантажуються в стрічку речення і програються по черзі, лічильник використання послідовності збільшується (після досягнення порогу з Налаштувань послідовність автоматично стає улюбленою).
- Кнопка-зірка — вручну позначити/зняти позначку "улюблена" (ручне зняття позначки має пріоритет над автоматичною логікою).
- Кнопка-олівець — відкриває редактор послідовності (див. нижче).
- Кнопка-кошик — видаляє послідовність повністю (без підтвердження).

#### Редактор послідовності

- Список карток послідовності з мініатюрами.
- Ручка зліва від картки — затиснути та перетягнути картку вгору/вниз, щоб змінити порядок відтворення.
- Кнопка закриття праворуч від картки — видаляє цю картку з послідовності (сама картка в застосунку не видаляється, лише прибирається з цієї послідовності).
- **Скасувати** — закрити редактор без збереження змін.
- **Зберегти** — застосувати нові порядок/склад карток; якщо видалити всі картки й зберегти, послідовність буде видалено повністю.

### Встановлення APK (застосунок не публікується в Google Play)

APK збирається автоматично при кожному релізі на GitHub (див. вкладку **Releases** цього репозиторію) і не проходить через Google Play — тому Android за замовчуванням блокує його встановлення як "додатку з невідомого джерела". Це нормально й безпечно, якщо ви завантажуєте APK з офіційних релізів цього репозиторію.

1. На телефоні відкрийте сторінку **Releases** репозиторію в браузері та завантажте файл `rozkazhy-<версія>.apk` з потрібного релізу (наприклад, `rozkazhy-1.2.0.apk` для релізу з тегом `v1.2.0` — версія береться з тегу релізу й одночасно проставляється в `package.json` та у версії Android-застосунку).
2. Спробуйте відкрити завантажений файл (зазвичай через "Файли" або сповіщення про завантаження) — Android покаже попередження на кшталт "Заборонено встановлення з цього джерела".
3. Натисніть **Налаштування** у цьому діалозі (або перейдіть вручну: **Налаштування → Застосунки → Особливий доступ → Встановлення невідомих застосунків**) і оберіть застосунок, яким ви відкривали APK (наприклад, "Файли" або браузер), увімкніть перемикач **Дозволити з цього джерела**.
4. Поверніться назад і повторно відкрийте APK-файл — з'явиться стандартний діалог встановлення. Натисніть **Встановити**.
5. Після встановлення можна вимкнути дозвіл із кроку 3, якщо не плануєте встановлювати оновлення вручну надалі.

Це підписана release-збірка (власним ключем, не через Google Play), тому Android все одно може показати попередження про "невідомого розробника" — це очікувано для застосунків поза Google Play, і не означає, що збірку не підписано.

Якщо в застосунку з'явиться сповіщення "Доступна нова версія" (див. панель дорослого → Налаштування), кнопка "Завантажити оновлення" відкриє сторінку релізу в системному браузері телефону — далі ті самі кроки 2-5 вище.

### Технології

- Vue 3 + TypeScript + Vite
- Tailwind CSS v4 (уся кольорова палітра й типографіка задані в одному конфігураційному блоці) + шрифт PT Sans (підтримує кирилицю) + іконки `@mdi/js`
- Capacitor (нативна обгортка для Android): SQLite, Filesystem, Camera, Preferences, запис голосу, системний браузер (для завантаження оновлень)
- Перевірка оновлень — публічний GitHub Releases API (без авторизації, раз на запуск застосунку)
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

Щоб перевірити поточний код на телефоні без збірки APK: `npm run dev -- --host`, і на телефоні (в тій самій Wi-Fi мережі) відкрити `http://<IP-адреса комп'ютера в мережі>:5173/` у браузері. У цьому режимі нативні можливості (SQLite, камера, мікрофон, TTS) працюють через веб-фолбеки, а не через нативні Android-плагіни — інтерфейс і логіка ідентичні, деякі деталі (якість TTS-голосу, системні діалоги дозволів) можуть відрізнятися від справжньої збірки.

---

## EN

A mobile app for children who experience communication difficulties, that helps build meaningful phrases using picture cards paired with a recorded voice. The child taps a card — it plays the recorded voice of a familiar person (or falls back to text-to-speech) and the card is added to a "sentence strip" at the top of the screen.

### What's inside

- **Communication cards**: a photo of an object/action + a word, spoken in an adult's recorded voice
- **Sentence strip**: tap cards to build a sequence, play the whole "sentence" with one button, pause/resume from any card, clear it
- **Sequences**: save the current strip as a reusable sequence for replay; mark favorites manually, or automatically after N replays (threshold is configurable)
- **Category color coding** (optional, off by default): tag cards by word type using a scheme similar to what speech therapists often use — details below
- **Update notifications**: the app checks for a newer release and offers to download it when one's available
- **Parent panel** (behind a 4-digit PIN, long-press the gear icon):
  - Add card: photo via camera or gallery, voice via native recorder or uploaded audio file, optional word type for color coding
  - Manage cards: edit, delete, replace just the photo or just the voice without recreating the card, tag/retag a card's word type after the fact, filter by word type
  - Dashboard: most-tapped words, last 20 played sentences
  - Settings: auto-favorite threshold for sequences, enabling and customizing category color coding
- All data and media (photos/audio) live on-device — SQLite for records, separate files for photos and audio. No cloud sync.

### How to use the app

#### Main screen (for the child)

- **Top bar**: "Розкажи" title on the left; on the right, a star button (opens saved sequences) and a gear button (long-press ~0.7s opens the parent panel behind a PIN; a short tap does nothing). If a newer app version is available, a small red dot appears on the gear — it's purely informational, not a separate tap target; the actual download action lives in the parent panel's Settings tab.
- **Sentence strip and playback controls** — unified into one panel under the top bar. An empty strip shows a centered "Tap a card to start" hint. Three buttons under the strip:
  - **Save icon (left)** — save the current strip as a reusable sequence (disabled while the strip is empty).
  - **Big round button (center)** — play the whole strip in order; the same button becomes a pause button during playback. The card currently sounding is highlighted with a yellow outline and auto-scrolled into view if the strip doesn't fully fit. After full playback the sentence is logged for the dashboard. While paused, tap any card in the strip to resume playback from that one.
  - **Trash icon (right)** — clear the strip (disabled while empty; also stops playback if it's running).
- **Card grid** (main area):
  - If category color coding is enabled (see Settings), a row of colored filter chips appears above the grid — "All" (resets the filter) plus one chip per word type (Person/Verb/Noun/Descriptor/Social). Tap a color to show only cards of that type; tap "All" to see every card again.
  - Tapping a card adds it to the strip, immediately plays its voice (recorded or synthesized), and increments that card's tap counter by 1.
  - Cards with a word type assigned show a solid color behind their title (matching the type's color) with an automatically-chosen contrasting text color, so the label always stays easy to read.
  - An empty grid shows a hint to ask an adult to add cards.

#### PIN screen (parent panel access)

- Opened by long-pressing the gear icon.
- **First time**: prompts you to create a 4-digit PIN — enter 4 digits on the number pad; they're saved immediately (as a hash) and the parent panel opens.
- **Every time after**: enter the same PIN. A wrong code shows "Wrong PIN" and clears the entry.
- **⌫** on the keypad deletes the last digit.
- **Cancel** closes the PIN screen without entering the parent panel.

#### Parent panel

Now opens **full-screen** (rather than a popup sheet from the bottom). Four tabs at the top (Add, Cards, Dashboard, Settings) and a close button next to the title — it scrolls away with the tab's content rather than staying pinned. If a newer app version is available, the same small red dot appears on the Settings tab as on the main screen's gear icon.

**"Add" tab** (create a new card, or edit an existing one):

- **Photo**: preview area ("No photo" until one is picked).
  - **Camera** — opens the device camera to take a photo.
  - **Gallery** — pick an existing image from the phone's gallery.
- **Word or phrase**: text field for the card's label (required; this exact text is spoken via text-to-speech if no recording is provided).
- **Word type** (appears only when category color coding is enabled in Settings): a row of colored buttons — Person, Verb, Noun, Descriptor, Social — plus a "No category" option. The chosen type determines the card's color in the grid.
- **"Listen to how the card will sound"**: plays the current recording if one exists, or the synthesized voice for the typed word — lets you check it before saving.
- **Adult's voice**:
  - **Record / Stop recording** — tap to start recording via the microphone (the app requests microphone permission the first time); tap again to stop and save the recording.
  - **File** — pick an existing audio file from the device instead of recording.
  - Once recorded/picked, a normal audio player appears for playback.
- **Save card** (or **Save changes** in edit mode): saves the card. A new card requires a word and a photo; voice and word type are optional. In edit mode you can change just the photo, just the voice, just the text, or just the word type — untouched fields are left alone.

**"Cards" tab** (manage existing cards):

- If category color coding is enabled, the same colored filter row from the main screen appears above the list, and the list separately says "No cards of this type" when the filter matches nothing (as opposed to "No cards yet" when there are none at all).
- List of all (or filtered) cards with thumbnail and title, an edit button (pencil) and a delete button (trash, with a confirmation dialog — its photo and audio files are deleted too).
- If category color coding is enabled — under each card: a hairline divider, a short caption with that card's current word type (or "No category"), and a row of small colored dots. Tap a dot to assign or change that card's word type right there, without opening the edit tab — this is the main way to retroactively tag existing cards after turning the feature on.

**"Dashboard" tab** (stats):

- **Most-used words**: cards sorted by tap count (count shown to the right of each word).
- **Recent sentences**: the last 20 sentences played from the strip, with timestamp and words joined by " • ".

**"Settings" tab**:

- If a newer app version is available, a prominent red banner appears at the top: "A new version is available X.Y.Z — tap to update." Tapping it opens a dialog with the version info and a "Download update" button, which opens the release page in the phone's system browser.
- A number field for the sequence auto-favorite threshold — how many replays before a sequence automatically gets marked favorite (default 5). A "Save" button saves the new value.
- **Category color coding**:
  - An "Enabled" / "Disabled" toggle (off by default — it doesn't suit every child, so it's a deliberate opt-in for the adult).
  - When enabled — a short explanation, and for each of the 5 word types (Person/Verb/Noun/Descriptor/Social) a row of preset color swatches to choose from (not a free-form color picker — a curated set guaranteed to stay legible on cards).
  - A "Reset colors to default" button.

#### Sequences panel (star button on the main screen)

- List of saved sequences (the name is either a custom name or the joined titles of its cards, separated by " • "); favorites are always listed first.
- Tapping a sequence's name **replays** it: its cards load into the sentence strip and play in order, and the sequence's usage count increases (once the Settings threshold is reached, it's marked favorite automatically).
- Star button — manually mark/unmark as favorite (a manual unmark takes priority over the automatic logic).
- Pencil button — opens the sequence editor (below).
- Trash button — deletes the sequence entirely (no confirmation).

#### Sequence editor

- List of the sequence's cards with thumbnails.
- Handle on the left of each card — press and drag up/down to reorder playback.
- Close button on the right of each card — removes that card from the sequence (the card itself is not deleted from the app, just from this sequence).
- **Cancel** — close the editor without saving changes.
- **Save** — apply the new order/set of cards; if you remove every card and save, the sequence is deleted entirely.

### Installing the APK (the app is not on Google Play)

The APK is built automatically on every GitHub release (see the **Releases** tab of this repo) and doesn't go through Google Play — so Android blocks installing it by default as an "app from an unknown source." That's expected and safe as long as you get the APK from this repo's official releases.

1. On your phone, open this repo's **Releases** page in a browser and download `rozkazhy-<version>.apk` from the release you want (e.g. `rozkazhy-1.2.0.apk` for a release tagged `v1.2.0` — the version comes from the release tag and is also stamped into `package.json` and the Android app's version).
2. Try opening the downloaded file (usually via "Files" or the download notification) — Android will show a warning like "Install blocked" / "For your security, your phone is not allowed to install unknown apps from this source."
3. Tap **Settings** in that dialog (or go manually: **Settings → Apps → Special app access → Install unknown apps**), select the app you opened the APK with (e.g. "Files" or your browser), and toggle **Allow from this source**.
4. Go back and open the APK file again — the normal install dialog will appear. Tap **Install**.
5. After installing, you can turn that permission back off if you don't plan to sideload updates manually going forward.

This is a release build signed with our own key (not through Google Play), so Android may still show an "unknown developer" warning — expected for apps distributed outside Google Play, and doesn't mean the build is unsigned.

If the app shows an "Update available" notice (parent panel → Settings), tapping "Download update" opens the release page in the phone's system browser — then follow steps 2-5 above.

### Tech stack

- Vue 3 + TypeScript + Vite
- Tailwind CSS v4 (the whole color palette and type scale live in one config block) + PT Sans (Cyrillic-supporting) + `@mdi/js` icons
- Capacitor (native Android wrapper): SQLite, Filesystem, Camera, Preferences, voice recording, system browser (for opening update downloads)
- Update checks use the public GitHub Releases API (no auth needed, once per app launch)
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

To check the current code on your phone without building an APK: `npm run dev -- --host`, then on your phone (same Wi-Fi network) open `http://<your computer's LAN IP>:5173/` in a browser. In this mode native capabilities (SQLite, camera, mic, TTS) run through web fallbacks instead of native Android plugins — the UI and logic are identical, but some details (TTS voice quality, system permission dialogs) will differ from a real build.

### Signing a release build

CI builds a signed `assembleRelease` APK (see `.github/workflows/build-apk.yml`). Signing is driven by four repo secrets — `KEYSTORE_BASE64` (the keystore file, base64-encoded), `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` — decoded and passed as env vars during the build; `app/android/app/build.gradle` reads them via `signingConfigs.release`, which only activates when those env vars are present (so local/unsigned builds are unaffected). Rotate the keystore by generating a new one with `keytool`, re-encoding it (`base64 -i release.jks | tr -d '\n'`), and updating the secrets — but note this changes the app's signing identity, so it can never be used to update an existing installed release built with the old key.

The build's version comes from the GitHub release tag (`v1.2.0` → app version `1.2.0`; a leading `v` is stripped). The workflow writes that version into `package.json` and passes it to Gradle as `versionName`, while `versionCode` is set to the GitHub Actions run number (a monotonically increasing integer, satisfying Android's requirement that each published `versionCode` be higher than the last). Manual `workflow_dispatch` runs (no release tag) fall back to whatever version is currently in `package.json`. The output APK is named `rozkazhy-<version>.apk`.

### License

MIT — see [LICENSE](LICENSE). / MIT — див. [LICENSE](LICENSE).
