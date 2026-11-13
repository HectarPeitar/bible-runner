# NWT book names per locale — English, Dutch, Russian, Georgian

Resolves `.scratch/bible-runner/issues/02-research-nwt-names.md`.

**Verification legend used throughout**

- **[P]** = verified from a primary source (jw.org locale page, WOL = Watchtower Online Library, or official legal text). Quote/table reproduced as-is.
- **[S]** = secondary source (independent Bible sites, bibliographic standards, an online Bible edition). Reliable for "what people actually say", not for NWT spelling.
- **[I]** = researcher inference / interpretation, not stated by any source.

Legal, font and "what to do" statements are **[I]** unless a source is cited. No scripture text was fetched or used; only the names-and-order tables.

---

## Summary

The NWT's own ordered 66-book list is published per locale at `jw.org/.../nwt/books/` and, in static HTML, at `wol.jw.org` (docid `1001061103`). I pulled the complete name + abbreviation list for **English** [P], **Russian** [P], **Georgian** [P], and the complete name list for **Dutch** [P] (Dutch abbreviations only partly [P]). The English list is name-identical to the common English list; Dutch differs in a handful of spellings; **Russian differs materially for 6 books** (`1/2 Самуила`, `1/2 Царей`, `Летопись`, `Псалмы`, `Песня Соломона`, `Экклезиаст`) plus a systematic dropped preposition; **Georgian differs for essentially every plural/construct name** — most dangerously `კანონი` for Deuteronomy where every other Georgian Bible says `მეორე რჯული`. Book names and their order are **not protected by copyright** in the US (37 CFR 202.1(a); *Feist*), and the 66-book order is the universal Protestant canon, not Watch Tower's creation — but **jw.org's Terms of Use separately forbid bundling site text into an application**, so derive the data from public-domain Bibles and use jw.org only as a cross-check. Latin+Cyrillic and Georgian cannot be covered by one Noto file: you need `Noto Sans` **plus** `Noto Sans Georgian`.

---

## 1. Where the authoritative list lives

| What | URL | Notes |
|---|---|---|
| NWT "Names and Order of the Books", English, with abbreviations and page numbers | https://wol.jw.org/en/wol/d/r1/lp-e/1001061103 | **Primary.** Static HTML table. **Best machine-readable target.** |
| Same page, Russian (study edition) | https://wol.jw.org/ru/wol/d/r2/lp-u/1001061103 | **Primary.** Russian row included. |
| Same page, Georgian | https://wol.jw.org/ka/wol/d/r20/lp-ge/1001061103 | **Primary.** Georgian row included. |
| NWT books index, English | https://www.jw.org/en/library/bible/study-bible/books/ | **Primary.** Names only (links); no abbreviations. |
| NWT "Tabel van de Bijbelboeken", Dutch | https://www.jw.org/nl/bibliotheek/bijbel/nwt/bijbelboeken-lijst/ | **Primary.** Names in order, no abbreviations. |
| NWT books index, Dutch | https://www.jw.org/nl/bibliotheek/bijbel/nwt/boeken/ | Names are rendered client-side (JS); only usable via the study-edition page's extracted table. |
| NWT 2006 edition books index, Georgian | https://www.jw.org/ka/ბიბლიოთეკა/ბიბლია/bi12/წიგნები/ | **Primary**, older edition. Names agree 66/66 with the current WOL list. |
| NWT publishers' page (per-book copyright years) | https://www.jw.org/en/library/bible/study-bible/title-page-nwt/ | **Primary.** Lists all 66 names, each followed by `© <year>`. Relevant to §6. |

Locale path segments are localised (`/nl/bibliotheek/bijbel/...`, `/ka/ბიბლიოთეკა/ბიბლია/...`); the English path with a locale prefix returns **404** (`/ka/library/...` 404s). Use `wol.jw.org` docid `1001061103` if you need it programmatically — it is the only one of these that returned a plain static table for all three non-English locales.

Section headings in the NWT are `HEBREW-ARAMAIC SCRIPTURES` / `CHRISTIAN GREEK SCRIPTURES`, not "Old Testament" / "New Testament" [P]: `ᲔᲑᲠᲐᲣᲚ-ᲐᲠᲐᲛᲔᲣᲠᲘ ᲬᲔᲠᲘᲚᲔᲑᲘ` / `ᲥᲠᲘᲡᲢᲘᲐᲜᲣᲚ-ᲑᲔᲠᲫᲜᲣᲠᲘ ᲬᲔᲠᲘᲚᲔᲑᲘ` (ka), `ЕВРЕЙСКО-АРАМЕЙСКИЕ ПИСАНИЯ` / `ХРИСТИАНСКИЕ ГРЕЧЕСКИЕ ПИСАНИЯ` (ru), `Boeken van de Hebreeuwse Geschriften` / `Griekse Geschriften` (nl). **[I]** For a game, keep 39/27 grouping but you do not need these labels.

---

## 2. The 66 names, per locale

### 2.1 English — NWT vs common English

Every one of the 66 NWT names equals the standard English name [P]. The differences are *abbreviations* and one bracketed alternate.

| # | NWT name | NWT abbr. | Common name | Differs? |
|---|---|---|---|---|
| 1 | Genesis | Ge | Genesis | no |
| 2 | Exodus | Ex | Exodus | no |
| 3 | Leviticus | Le | Leviticus | no |
| 4 | Numbers | Nu | Numbers | no |
| 5 | Deuteronomy | De | Deuteronomy | no |
| 6 | Joshua | Jos | Joshua | no |
| 7 | Judges | Jg | Judges | no |
| 8 | Ruth | Ru | Ruth | no |
| 9 | 1 Samuel | 1Sa | 1 Samuel (I Samuel) | no |
| 10 | 2 Samuel | 2Sa | 2 Samuel (II Samuel) | no |
| 11 | 1 Kings | 1Ki | 1 Kings | no |
| 12 | 2 Kings | 2Ki | 2 Kings | no |
| 13 | 1 Chronicles | 1Ch | 1 Chronicles | no |
| 14 | 2 Chronicles | 2Ch | 2 Chronicles | no |
| 15 | Ezra | Ezr | Ezra | no |
| 16 | Nehemiah | Ne | Nehemiah | no |
| 17 | Esther | Es | Esther | no |
| 18 | Job | Job | Job | no |
| 19 | Psalms | Ps | Psalms | no |
| 20 | Proverbs | Pr | Proverbs | no |
| 21 | Ecclesiastes | Ec | Ecclesiastes | no |
| 22 | Song of Solomon (Canticles) | Ca | Song of Solomon / Song of Songs | **alt. name** |
| 23 | Isaiah | Isa | Isaiah | no |
| 24 | Jeremiah | Jer | Jeremiah | no |
| 25 | Lamentations | La | Lamentations | no |
| 26 | Ezekiel | Eze | Ezekiel | no |
| 27 | Daniel | Da | Daniel | no |
| 28 | Hosea | Ho | Hosea | no |
| 29 | Joel | Joe | Joel | no |
| 30 | Amos | Am | Amos | no |
| 31 | Obadiah | Ob | Obadiah | no |
| 32 | Jonah | Jon | Jonah | no |
| 33 | Micah | Mic | Micah | no |
| 34 | Nahum | Na | Nahum | no |
| 35 | Habakkuk | Hab | Habakkuk | no |
| 36 | Zephaniah | Zep | Zephaniah | no |
| 37 | Haggai | Hag | Haggai | no |
| 38 | Zechariah | Zec | Zechariah | no |
| 39 | Malachi | Mal | Malachi | no |
| 40 | Matthew | Mt | Matthew | no |
| 41 | Mark | **Mr** | Mark (abbr. usually Mk) | abbr. only |
| 42 | Luke | Lu | Luke | no |
| 43 | John | Joh | John | no |
| 44 | Acts | Ac | Acts (of the Apostles) | no |
| 45 | Romans | Ro | Romans | no |
| 46 | 1 Corinthians | 1Co | 1 Corinthians | no |
| 47 | 2 Corinthians | 2Co | 2 Corinthians | no |
| 48 | Galatians | Ga | Galatians | no |
| 49 | Ephesians | Eph | Ephesians | no |
| 50 | Philippians | Php | Philippians | no |
| 51 | Colossians | Col | Colossians | no |
| 52 | 1 Thessalonians | 1Th | 1 Thessalonians | no |
| 53 | 2 Thessalonians | 2Th | 2 Thessalonians | no |
| 54 | 1 Timothy | 1Ti | 1 Timothy | no |
| 55 | 2 Timothy | 2Ti | 2 Timothy | no |
| 56 | Titus | Tit | Titus | no |
| 57 | Philemon | Phm | Philemon | no |
| 58 | Hebrews | Heb | Hebrews | no |
| 59 | James | Jas | James | no |
| 60 | 1 Peter | 1Pe | 1 Peter | no |
| 61 | 2 Peter | 2Pe | 2 Peter | no |
| 62 | 1 John | 1Jo | 1 John | no |
| 63 | 2 John | 2Jo | 2 John | no |
| 64 | 3 John | 3Jo | 3 John | no |
| 65 | Jude | Jude | Jude | no (abbr. spelled out) |
| 66 | Revelation | **Re** | Revelation (Apocalypse) | abbr. only |

Source for the whole table incl. abbreviations: WOL `1001061103` (en) [P]. Note the WOL page itself prints **"Song of Solomon (Canticles)"** — the parenthetical is NWT-supplied [P], useful as a free alias.

### 2.2 Dutch — NWT vs common Dutch

Names verified in order from the NWT's own "Tabel van de Bijbelboeken" [P]. Abbreviations were only partly visible (the study-edition books page is JS-rendered); the abbreviated forms shown in the `Abbr.` column are the ones actually captured [P], `—` means **not captured — do not invent**.

Common-Dutch column: `Richteren`, `Ruth`, `1 Samuël` … per HSV / Statenvertaling / Open Vertaling / the OCLC–FOBID Dutch bibliographic vocabulary [S]; NBV21 variants noted in the Differs column [S].

| # | NWT name | Abbr. | Common (HSV/SV) | Differs? |
|---|---|---|---|---|
| 1 | Genesis | Gen. / Ge | Genesis | no |
| 2 | Exodus | Ex. / Ex | Exodus | no |
| 3 | Leviticus | Lev. / Le | Leviticus | no |
| 4 | Numeri | Num. / Nu | Numeri | no |
| 5 | Deuteronomium | Deut. / De | Deuteronomium | no |
| 6 | Jozua | — | Jozua | no |
| 7 | **Rechters** | — | **Richteren** | **YES** (NBV: Rechters) |
| 8 | Ruth | — | Ruth | no |
| 9 | 1 Samuël | 1 Sam. / 1Sa | 1 Samuël | no |
| 10 | 2 Samuël | 2 Sam. / 2Sa | 2 Samuël | no |
| 11 | 1 Koningen | 1 Kon. / 1Kon | 1 Koningen | no |
| 12 | 2 Koningen | — | 2 Koningen | no |
| 13 | 1 Kronieken | — | 1 Kronieken | no |
| 14 | 2 Kronieken | — | 2 Kronieken | no |
| 15 | Ezra | — | Ezra | no |
| 16 | Nehemia | — | Nehemia | no |
| 17 | **Esther** | — | **Esther** (NBV: Ester) | NBV only |
| 18 | Job | — | Job | no |
| 19 | Psalmen | — | Psalmen | no |
| 20 | Spreuken | — | Spreuken | no |
| 21 | Prediker | — | Prediker | no |
| 22 | Hooglied | — | Hooglied | no |
| 23 | Jesaja | — | Jesaja | no |
| 24 | Jeremia | Jer. / Jer | Jeremia | no |
| 25 | Klaagliederen | Klaagl. / Klg | Klaagliederen | no |
| 26 | Ezechiël | — | Ezechiël | no |
| 27 | Daniël | — | Daniël | no |
| 28 | Hosea | — | Hosea | no |
| 29 | Joël | Joël / Joë | Joël | no |
| 30 | Amos | — | Amos | no |
| 31 | Obadja | Obad. / Ob | Obadja | no |
| 32 | Jona | — | Jona | no |
| 33 | Micha | — | Micha | no |
| 34 | Nahum | Nah. / Na | Nahum | no |
| 35 | Habakuk | Hab. / Hab | Habakuk | no |
| 36 | Zefanja | Zef. / Ze | Zefanja | no |
| 37 | Haggaï | Hag. / Hag | Haggaï | no |
| 38 | Zacharia | — | Zacharia | no |
| 39 | Maleachi | Mal. / Mal | Maleachi | no |
| 40 | **Mattheüs** | — | **Mattheüs** (NBV21: Matteüs) | NBV21 only |
| 41 | Markus | — | Markus | no |
| 42 | Lukas | — | Lukas | no |
| 43 | Johannes | — | Johannes | no |
| 44 | Handelingen | — | Handelingen | no |
| 45 | Romeinen | — | Romeinen | no |
| 46 | **1 Korinthiërs** | 2 Kor.-pattern | **1 Korinthiërs** (NBV21: 1 Korintiërs) | NBV21 only |
| 47 | 2 Korinthiërs | 2 Kor. / 2Kor | 2 Korinthiërs | NBV21 only |
| 48 | Galaten | — | Galaten | no |
| 49 | Efeziërs | — | Efeziërs | no |
| 50 | Filippenzen | — | Filippenzen | no |
| 51 | Kolossenzen | — | Kolossenzen | no |
| 52 | 1 Thessalonicenzen | 1 Thess. / 1Th | 1 Thessalonicenzen | NBV21: Tessalonicenzen |
| 53 | 2 Thessalonicenzen | — | 2 Thessalonicenzen | NBV21: Tessalonicenzen |
| 54 | 1 Timotheüs | — | 1 Timotheüs | NBV21: Timoteüs |
| 55 | 2 Timotheüs | — | 2 Timotheüs | NBV21: Timoteüs |
| 56 | Titus | — | Titus | no |
| 57 | Filemon | — | Filemon | no |
| 58 | Hebreeën | — | Hebreeën | no |
| 59 | Jakobus | — | Jakobus | no |
| 60 | 1 Petrus | — | 1 Petrus | no |
| 61 | 2 Petrus | — | 2 Petrus | no |
| 62 | 1 Johannes | — | 1 Johannes | no |
| 63 | 2 Johannes | — | 2 Johannes | no |
| 64 | 3 Johannes | — | 3 Johannes | no |
| 65 | Judas | — | Judas | no |
| 66 | Openbaring | — | Openbaring | no |

Dutch NWT keeps **all diacritics**: `Samuël`, `Joël`, `Mattheüs`, `Korinthiërs`, `Efeziërs`, `Thessalonicenzen`, `Timotheüs`, `Hebreeën`, `Ezechiël`, `Daniël`, `Haggaï` [P]. Also note `Thessalonicenzen` contains **`ss`** before `c` — Dutch players routinely type one `s`; and `Korinthiërs`/`Efeziërs`/`Hebreeën` end in `-ië` (diaeresis, not `ie`). **[I]** Strip-diacritics matching is effectively mandatory for the Dutch locale, or players lose on `ë`/`ï`/`ü` alone.

### 2.3 Russian — NWT vs common Russian (Synodal)

Names verified in order from WOL `1001061103` (ru) [P]. The Russian NWT is the edition behind `jw.org/ru`; the WOL page is the study-edition contents table and carries the names and one-letter-per-consonant abbreviations listed below.

Common-Russian column = Synodal (1876) naming as used by bible.by, biblia.chat, bible.net.ua and Orthodox calendars [S] — four independent secondary sources agree on the forms quoted here; I did **not** reach an official church-publisher page.

| # | NWT name | Abbr. | Common (Synodal) | Differs? |
|---|---|---|---|---|
| 1 | Бытие | Бт | Бытие | no |
| 2 | Исход | Исх | Исход | no |
| 3 | Левит | Лв | Левит | no |
| 4 | Числа | Чс | Числа | no |
| 5 | Второзаконие | Вт | Второзаконие | no |
| 6 | Иисус Навин | ИсН | Иисус Навин | no |
| 7 | Судей | Сд | Судей / Судьи | minor |
| 8 | Руфь | Рф | Руфь | no |
| 9 | **1 Самуила** | 1См | **1 Царств** | **YES** |
| 10 | **2 Самуила** | 2См | **2 Царств** | **YES** |
| 11 | **1 Царей** | 1Цр | **3 Царств** | **YES** |
| 12 | **2 Царей** | 2Цр | **4 Царств** | **YES** |
| 13 | **1 Летопись** | 1Лт | **1 Паралипоменон** | **YES** |
| 14 | **2 Летопись** | 2Лт | **2 Паралипоменон** | **YES** |
| 15 | Ездра | Езд | Ездра | no |
| 16 | Неемия | Не | Неемия | no |
| 17 | **Эсфирь** | Эсф | **Есфирь** | spelling |
| 18 | Иов | Иов | Иов | no |
| 19 | **Псалмы** | Пс | **Псалтирь** | **YES** |
| 20 | Притчи | Пр | Притчи | no |
| 21 | **Экклезиаст** | Эк | **Екклесиаст** | spelling |
| 22 | **Песня Соломона** | Псн | **Песнь Песней** | **YES** |
| 23 | Исайя | Иса | Исаия | spelling |
| 24 | Иеремия | Иер | Иеремия | no |
| 25 | Плач Иеремии | Пл | Плач Иеремии | no |
| 26 | Иезекииль | Иез | Иезекииль | no |
| 27 | Даниил | Дан | Даниил | no |
| 28 | Осия | Ос | Осия | no |
| 29 | Иоиль | Ил | Иоиль | no |
| 30 | Амос | Ам | Амос | no |
| 31 | Авдий | Авд | Авдий | no |
| 32 | Иона | Ион | Иона | no |
| 33 | Михей | Мх | Михей | no |
| 34 | Наум | На | Наум | no |
| 35 | Аввакум | Авв | Аввакум | no |
| 36 | Софония | Сф | Софония | no |
| 37 | Аггей | Аг | Аггей | no |
| 38 | Захария | Зх | Захария | no |
| 39 | Малахия | Мл | Малахия | no |
| 40 | **Матфея** | Мф | **От Матфея** | prefix dropped |
| 41 | Марка | Мк | От Марка | prefix dropped |
| 42 | Луки | Лк | От Луки | prefix dropped |
| 43 | Иоанна | Ин | От Иоанна | prefix dropped |
| 44 | Деяния | Де | Деяния | no |
| 45 | Римлянам | Рм | К Римлянам | prefix dropped |
| 46 | 1 Коринфянам | 1Кр | 1 Коринфянам | prefix dropped |
| 47 | 2 Коринфянам | 2Кр | 2 Коринфянам | prefix dropped |
| 48 | Галатам | Гл | К Галатам | prefix dropped |
| 49 | Эфесянам | Эф | К Ефесянам | pre+spelling |
| 50 | Филиппийцам | Фп | К Филиппийцам | prefix dropped |
| 51 | Колоссянам | Кл | К Колоссянам | prefix dropped |
| 52 | 1 Фессалоникийцам | 1Фс | 1 Фессалоникийцам | prefix dropped |
| 53 | 2 Фессалоникийцам | 2Фс | 2 Фессалоникийцам | prefix dropped |
| 54 | 1 Тимофею | 1Тм | 1 Тимофею | prefix dropped |
| 55 | 2 Тимофею | 2Тм | 2 Тимофею | prefix dropped |
| 56 | Титу | Тит | К Титу | prefix dropped |
| 57 | Филимону | Фм | К Филимону | prefix dropped |
| 58 | Евреям | Евр | К Евреям | prefix dropped |
| 59 | Иакова | Иак | Иакова | no |
| 60 | 1 Петра | 1Пт | 1 Петра | no |
| 61 | 2 Петра | 2Пт | 2 Петра | no |
| 62 | 1 Иоанна | 1Ин | 1 Иоанна | no |
| 63 | 2 Иоанна | 2Ин | 2 Иоанна | no |
| 64 | 3 Иоанна | 3Ин | 3 Иоанна | no |
| 65 | **Иуды** | **Иуды** | Иуды (abbr. usually Иуд) | abbr. only |
| 66 | Откровение | Отк | Откровение | no |

Russian NWT abbreviations are **Cyrillic, dotless, and built from 2–3 letters** (`Бт`, `ИсН`, `1Фс`) — quite unlike the familiar Synodal abbreviations (`Быт.`, `Нав.`, `1 Фес.`) [P for the NWT set]. `Иуды` is the only abbreviation printed with 4 letters [P].

### 2.4 Georgian — NWT vs common Georgian

Names verified in order from WOL `1001061103` (ka, NWT); the standalone `jw.org/ka` NWT-2006 books index agrees on **all 66** names [P+P]. This is the locale with the most divergence.

Common-Georgian column: forms used by (a) the Georgian Orthodox Bible listing on orthodox.do.am, (b) mybible.ge's Georgian Bible, (c) the book-form glossary at ph4.org — three independent secondary sources that agree on the *forms* quoted [S]. **I did not reach the Georgian Bible Society's own catalogue** (see §8); treat this column as "high-confidence but secondary".

| # | NWT name | Abbr. | Common Georgian | Differs? |
|---|---|---|---|---|
| 1 | დაბადება | დბ. | დაბადება | no |
| 2 | გამოსვლა | გმ. | გამოსვლა | no |
| 3 | **ლევიანები** | ლვ. | **ლევიანნი** | **YES** |
| 4 | **რიცხვები** | რც. | **რიცხვნი** | **YES** |
| 5 | **კანონი** | კნ. | **მეორე რჯული** | **YES — different word entirely** |
| 6 | იესო ნავეს ძე | იეს. | იესო ნავეს ძე | no |
| 7 | **მსაჯულები** | მსჯ. | **მსაჯულნი** | **YES** |
| 8 | რუთი | რთ. | რუთი | no |
| 9 | **1 სამუელი** | 1სმ. | **პირველი მეფეთა** | **YES — different book name** |
| 10 | **2 სამუელი** | 2სმ. | **მეორე მეფეთა** | **YES** |
| 11 | **1 მეფეები** | 1მფ. | **მესამე მეფეთა** | **YES — numbering shifts** |
| 12 | **2 მეფეები** | 2მფ. | **მეოთხე მეფეთა** | **YES — numbering shifts** |
| 13 | **1 მატიანე** | 1მტ. | **პირველი ნეშტთა** | **YES** |
| 14 | **2 მატიანე** | 2მტ. | **მეორე ნეშტთა** | **YES** |
| 15 | ეზრა | ეზრ. | ეზრა / პირველი ეზრა | minor |
| 16 | ნეემია | ნემ. | ნეემია | no |
| 17 | ესთერი | ესთ. | ესთერი | no |
| 18 | იობი | იობ. | იობი | no |
| 19 | **ფსალმუნები** | ფს. | **ფსალმუნნი** | **YES** |
| 20 | **იგავები** | იგ. | **იგავნი სოლომონისა** | **YES** |
| 21 | ეკლესიასტე | ეკ. | ეკლესიასტე | no |
| 22 | ქებათა ქება | ქბ. | ქებათა-ქება | hyphen only |
| 23 | ესაია | ეს. | ესაია (+ წინასწარმეტყველი) | no |
| 24 | იერემია | იერ. | იერემია | no |
| 25 | **გოდება** | გდ. | **გოდება იერემიასი** | **YES** (shorter) |
| 26 | ეზეკიელი | ეზკ. | ეზეკიელი | no |
| 27 | დანიელი | დნ. | დანიელი | no |
| 28 | ოსია | ოს. | ოსია | no |
| 29 | იოელი | იოლ. | იოელი / იოველ | spelling variant |
| 30 | ამოსი | ამ. | ამოსი | no |
| 31 | აბდია | აბდ. | აბდია | no |
| 32 | იონა | იონ. | იონა | no |
| 33 | მიქა | მქ. | მიქა | no |
| 34 | ნაუმი | ნამ. | ნაუმი | no |
| 35 | აბაკუმი | აბკ. | აბაკუმი | no |
| 36 | სოფონია | სფ. | სოფონია | no |
| 37 | ანგია | ანგ. | ანგია | no |
| 38 | ზაქარია | ზქ. | ზაქარია | no |
| 39 | მალაქია | მლ. | მალაქია | no |
| 40 | **მათე** | მთ. | **მათეს (სახარება)** | **YES** (case ending) |
| 41 | **მარკოზი** | **მრ.** | **მარკოზის** | **YES** (+odd abbr.) |
| 42 | **ლუკა** | ლკ. | **ლუკას** | **YES** |
| 43 | **იოანე** | ინ. | **იოანეს** | **YES** |
| 44 | **საქმეები** | სქ. | **საქმე წმიდათა მოციქულთა** | **YES** |
| 45 | **რომაელები** | რმ. | **რომაელთა** | **YES** |
| 46 | **1 კორინთელები** | 1კრ. | **1 კორინთელთა** | **YES** |
| 47 | **2 კორინთელები** | 2კრ. | **2 კორინთელთა** | **YES** |
| 48 | **გალატელები** | გლ. | **გალატელთა** | **YES** |
| 49 | **ეფესოელები** | ეფ. | **ეფესელთა** | **YES** (stem differs) |
| 50 | **ფილიპელები** | ფლ. | **ფილიპელთა** | **YES** |
| 51 | **კოლოსელები** | კლ. | **კოლასელთა** | **YES** (stem differs) |
| 52 | **1 თესალონიკელები** | 1თს. | **1 თესალონიკელთა** | **YES** |
| 53 | **2 თესალონიკელები** | 2თს. | **2 თესალონიკელთა** | **YES** |
| 54 | **1 ტიმოთე** | 1ტმ. | **1 ტიმოთეს** | **YES** |
| 55 | **2 ტიმოთე** | 2ტმ. | **2 ტიმოთეს** | **YES** |
| 56 | **ტიტე** | ტიტ. | **ტიტეს** | **YES** |
| 57 | **ფილიმონი** | ფლმ. | **ფილიმონის** | **YES** |
| 58 | **ებრაელები** | ებ. | **ებრაელთა** | **YES** |
| 59 | **იაკობი** | იაკ. | **იაკობის** | **YES** |
| 60 | **1 პეტრე** | 1პტ. | **1 პეტრეს** | **YES** |
| 61 | **2 პეტრე** | 2პტ. | **2 პეტრეს** | **YES** |
| 62 | **1 იოანე** | 1ინ. | **1 იოანეს** | **YES** |
| 63 | **2 იოანე** | 2ინ. | **2 იოანეს** | **YES** |
| 64 | **3 იოანე** | 3ინ. | **3 იოანეს** | **YES** |
| 65 | **იუდა** | იუდ. | **იუდას** | **YES** |
| 66 | **გამოცხადება** | გმც. | **გამოცხადება იოანესი** | **YES** (shorter) |

**[I]** The pattern is systematic: the NWT Georgian uses *modern, uninflected, plural-nominative* book names (`-ები`), while traditional Georgian Bibles use *inflected/genitive or `-თა` plural* forms (`რომაელთა`, `მათეს`, `იოანეს`) or the older `-ნი` plural (`ლევიანნი`, `რიცხვნი`, `ფსალმუნნი`, `მსაჯულნი`). A Georgian player who knows their Bible will type the second column. Two entries cannot be derived by stripping an ending and **must** be hard-coded aliases: **`კანონი` ↔ `მეორე რჯული`** (Deuteronomy) and **`1/2 სამუელი` + `1/2 მეფეები` ↔ `პირველი–მეოთხე მეფეთა`** (the Georgian tradition numbers Samuel+Kings as Kings I–IV, so the mapping is 1Sam→I, 2Sam→II, 1Kgs→III, 2Kgs→IV).

---

## 3. Diff summary — the part that makes players lose

| Locale | Hard name conflicts (different words/numbering) | Spelling-only conflicts | Systematic quirk |
|---|---|---|---|
| English | 0 | 0 | NWT abbrevs differ (`Mr`, `Ca`, `Re`, `Jude`); "Canticles" alternate |
| Dutch | **1**: `Rechters` vs `Richteren` | 4, and they split by *which* Dutch Bible the player knows: NWT sides with HSV/SV on `Mattheüs`, `Korinthiërs`, `Thessalonicenzen`, `Timotheüs`, `Esther`; NBV21 uses `Matteüs`, `Korintiërs`, `Tessalonicenzen`, `Timoteüs`, `Ester` | heavy diacritics (`ë`, `ï`, `ü`) |
| Russian | **6**: `1/2 Самуила`↔`1/2 Царств`, `1/2 Царей`↔`3/4 Царств`, `Летопись`↔`Паралипоменон`, `Псалмы`↔`Псалтирь`, `Песня Соломона`↔`Песнь Песней`, `+Судей/Судьи` | 3: `Эсфирь`/`Есфирь`, `Экклезиаст`/`Екклесиаст`, `Исайя`/`Исаия` | NWT drops `От`/`К` in all 21 NT letters+gospels |
| Georgian | **~29** (see §2.4) | ~4 | NWT uses modern `-ები` forms; tradition uses `-ნი`/`-თა`/genitive; Kings renumbered |

**[I]** If the game accepts only the NWT string, the Russian and Georgian locales are effectively unplayable for anyone who learned their Bible in church. Accepting the alias column is not a nicety there; it is the difference between "hard quiz" and "wrong answer marked".

---

## 4. Alias candidates worth shipping (per locale)

Derived from §2 tables plus the sources above. **[I]** on which are worth including; the strings themselves are [P]/[S] as marked.

**English** — `Song of Songs`, `Canticles`, `Apocalypse` (for Revelation), `Psalm`/`Psalms`, `I Samuel`/`II Samuel`/`First Samuel`/`1st Samuel` (same pattern for Kings, Corinthians, Thessalonians, Timothy, Peter, John), `Revelation of John`.

**Dutch** — `Richteren`, `Matteüs`, `1 Korintiërs`, `2 Korintiërs`, `1 Tessalonicenzen`, `2 Tessalonicenzen`, `1 Timoteüs`, `2 Timoteüs`, `Ester`, `Openbaring van Johannes`, `Handelingen van de apostelen`, `Het Hooglied`, `De Prediker`, `Eerste Samuel`… (ordinal-word forms).

**Russian** — `1 Царств`/`Первая Царств`/`1-я Царств`, `2 Царств`, `3 Царств`, `4 Царств`, `1 Паралипоменон`, `2 Паралипоменон`, `Псалтирь`, `Псалтырь` (common misspelling), `Песнь Песней`, `Песня Песней`, `Екклесиаст`, `Есфирь`, `Исаия`, `Судьи`, `От Матфея`, `От Марка`, `От Луки`, `От Иоанна`, `К Римлянам`, `1-е Коринфянам`, `Откровение Иоанна Богослова`, `Апокалипсис`, `Притчи Соломоновы`, `Деяния святых Апостолов`.

**Georgian** — `მეორე რჯული`, `პირველი მეფეთა`, `მეორე მეფეთა`, `მესამე მეფეთა`, `მეოთხე მეფეთა`, `1 მეფეთა`–`4 მეფეთა`, `პირველი ნეშტთა`, `მეორე ნეშტთა`, `1 ნეშტთა`, `2 ნეშტთა`, `ფსალმუნნი`, `იგავნი სოლომონისა`, `ლევიანნი`, `რიცხვნი`, `მსაჯულნი`, `გოდება იერემიასი`, `ქებათა-ქება`, `მათეს სახარება`, `მარკოზის სახარება`, `ლუკას სახარება`, `იოანეს სახარება`, `საქმე მოციქულთა`, `რომაელთა`, `1 კორინთელთა`, `2 კორინთელთა`, `გალატელთა`, `ეფესელთა`, `ფილიპელთა`, `კოლასელთა`, `1 თესალონიკელთა`, `2 თესალონიკელთა`, `1 ტიმოთეს`, `2 ტიმოთეს`, `ტიტეს`, `ფილიმონის`, `ებრაელთა`, `იაკობის`, `1 პეტრეს`, `2 პეტრეს`, `1 იოანეს`, `2 იოანეს`, `3 იოანეს`, `იუდას`, `გამოცხადება იოანესი`, `იოველ` (for იოელი), `პირველი ეზრა` (for ეზრა).

---

## 5. Numbering and abbreviation quirks

- **Digits, not Roman numerals**, in all four locales [P]: `1 Samuel`, `1 Samuël`, `1 Самуила`, `1 სამუელი`. Players *say* `I Samuel`, `1st Samuel`, `Первая Царств`, `პირველი მეფეთა` — alias those, don't render them.
- Where the digit sits: English/Dutch/Russian put it first (`1 Samuel`); Georgian also puts it first but with a space (`1 სამუელი`) [P]. The Georgian *abbreviation* glues it on (`1სმ.`) [P].
- **Psalms is plural as a book title, singular in a citation** [P]: `Psalms`/`Psalm 23`; `Psalmen`/`Psalm 23`; `Псалмы`/`Псалом 23`; `ფსალმუნები`/`ფსალმუნი 23`. **[I]** If the content file stores one string per book, store the plural; handle citation-style input only if you ever ask for references (out of scope here).
- **"Song of …" has no single form** [P/S]: en `Song of Solomon` (NWT adds `(Canticles)`), nl `Hooglied`, ru `Песня Соломона` (common `Песнь Песней`), ka `ქებათა ქება` (also `ქებათა-ქება`, archaic `სიმღერაჲ სიმღერათაჲ`).
- **NWT abbreviation sets are house-specific** and much shorter than what players know: en `Ge, Ex, Le, Nu, De, Jos, Jg, Ru, 1Sa … Mr … Ca … Re` [P] (note `Mr` for Mark, `Re` for Revelation); ru `Бт, Исх, Лв, Чс, Вт, ИсН, Сд, Рф, 1См, 1Цр, 1Лт, Езд, Не, Эсф, Иов, Пс, Пр, Эк, Псн, Иса … Мф, Мк, Лк, Ин, Де, Рм, 1Кр, Гл, Эф, Фп, Кл, 1Фс, 1Тм, Тит, Фм, Евр, Иак, 1Пт, 1Ин, Иуды, Отк` [P]; ka `დბ., გმ., ლვ., რც., კნ., იეს., მსჯ., რთ., 1სმ., 1მფ., 1მტ., ეზრ., ნემ., ესთ., იობ., ფს., იგ., ეკ., ქბ., ეს., იერ., გდ., ეზკ., დნ., ოს., იოლ., ამ., აბდ., იონ., მქ., ნამ., აბკ., სფ., ანგ., ზქ., მლ. | მთ., მრ., ლკ., ინ., სქ., რმ., 1კრ., 2კრ., გლ., ეფ., ფლ., კლ., 1თს., 2თს., 1ტმ., 2ტმ., ტიტ., ფლმ., ებ., იაკ., 1პტ., 2პტ., 1ინ., 2ინ., 3ინ., იუდ., გმც.` [P]. **[I]** Abbreviations are *not* safe answer keys — accept them as aliases at most, and never require them.
- Dutch prints a **two-column** abbreviation scheme (`Gen.` and `Ge`, `1 Sam.` and `1Sa`, `Jer.` and `Jer`, `Klaagl.` and `Klg`) [P, partial] — the second column mirrors the English NWT abbreviations. **[I]** Skip Dutch abbreviations in the game; I only captured a sample and the full list is behind a JS-rendered page.

---

## 6. Copyright: are the names and order protectable?

**Short answer: the names are not protectable; the order is the universal Protestant canon and in my reading not protectable either; but jw.org's Terms of Use create a separate, real, practical constraint on how you obtain and ship the data.**

Verified points:

1. **Names and titles are outside copyright in the US.** 37 CFR § 202.1(a) lists as *not* subject to copyright: "Words and short phrases such as names, titles, and slogans; familiar symbols or designs; mere variations of typographic ornamentation, lettering or coloring; **mere listing of ingredients or contents**." [P] — https://www.copyright.gov/title37/202/37cfr202-1.html (also eCFR § 202.1, LII mirror). A book name, and a bare ordered list of book names, sits squarely in that clause. [I]
2. **Facts are not copyrightable, and compilation protection is thin.** *Feist Publications v. Rural Telephone*, 499 U.S. 340 (1991): "facts do not owe their origin to an act of authorship, they are not original and, thus, are not copyrightable"; a compilation is protected "only if its facts have been 'selected, coordinated, or arranged in such a way that the resulting work as a whole constitutes an original work of authorship'"; and "a subsequent compiler remains free to use the facts contained in another's publication … so long as the competing work does not feature the same selection and arrangement." [P] — https://www.law.cornell.edu/supremecourt/text/499/340
3. **The selection and arrangement here is not Watch Tower's.** The 39+27 Protestant canon in this exact order is what Catholic-adjacent, Orthodox-tradition and Protestant Bibles in these four languages all print — the Dutch, Russian-Synodal and Georgian lists I collected in §2.2–§2.4 are the *same books in the same order* as the NWT's [P, direct comparison of my own data]. Watch Tower did not select or arrange this set. **[I]** Under *Feist*'s originality requirement, there is nothing original in "which 66 books, in what order" to protect, and the merger doctrine leaves essentially one conventional way to express it.
4. **Watch Tower does assert copyright — over the books, not over the names.** The publishers' page prints a `©` year after each of the 66 names (`Genesis © 2017`, … `Revelation © 2017`) and `© 2015, 2026 WATCH TOWER BIBLE AND TRACT SOCIETY OF PENNSYLVANIA` [P] — https://www.jw.org/en/library/bible/study-bible/title-page-nwt/. **[I]** That notice covers the translated text of each book and the edition's editorial matter. A copyright notice cannot attach to subject matter that is unprotectable (§202.1(a)); a list of names is not made protectable by printing `©` beside it. Note the page states "This publication is not for sale."
5. **The Terms of Use are the binding constraint, and they are stricter than copyright.** Under https://www.jw.org/en/terms-of-use/ [P], you may view/download/print for personal non-commercial use, but you **may not** "distribute artwork, electronic publications, trademarks, music, photos, **text**, or videos from this website **with or as part of any software application**", nor reproduce them for a commercial purpose, nor build tools "specifically made to collect, copy, download, extract, harvest, or scrape data". **[I]** This is contract law about *jw.org as a source*, not about the ideas: copying a table out of jw.org into an app is a ToS breach even if the table's contents are unprotectable. Practical consequence: **do not ship data transcribed from jw.org.** Generate the list from a public-domain source with the same canon (KJV, World English Bible, the CC0 *Open Vertaling*, a public-domain Synodal text, a public-domain Georgian Bible), then use jw.org **only** as a manual cross-check of NWT spelling — which is exactly what this document is.
6. **Trademark is a separate, narrower issue.** "New World Translation", "NWT", "JW.ORG" function as marks [I — I did not run a trademark register search]. Nominative use ("book names follow the New World Translation") to describe the naming convention is normally acceptable; naming the game *as* an official JW product is not. **[I]** Keep the product name generic and add a one-line "not affiliated with / endorsed by Watch Tower" note.
7. **No scripture text anywhere.** All of the above is about 66 short names + an ordering. The moment you include verses, you are inside the protected translation (per-book `©` years, §6.4), and the ToS problem becomes a copyright problem. [I]

**Residual legal risk [I]:** a rights-holder can still send a takedown or a demand regardless of merit, and I found no case law specifically about Bible book-name lists (see §8). The safe posture is: public-domain source of truth, no jw.org transcription, no scripture text, generic product name, and a note that names follow the NWT.

`source_check` was run against the copyright claim and returned **"unclear / confidence 0.30"** with no automated support assessment — it surfaced *Feist* and the jw.org pages but did not adjudicate. Per the tool's own guidance I inspected the primary texts directly instead (37 CFR 202.1, *Feist*, jw.org ToS, jw.org publishers' page); those are the citations above. **The validation is manual, not automated.**

---

## 7. Scripts and fonts

| Locale | Script | Unicode blocks needed | Notes |
|---|---|---|---|
| English | Latin | Basic Latin, Latin-1 Supplement | ASCII only for all 66 names [P] |
| Dutch | Latin | Basic Latin, Latin-1 Supplement (or Latin Extended-A) | Needs `ë ï ü` — `Samuël, Joël, Mattheüs, Korinthiërs, Efeziërs, Thessalonicenzen, Timotheüs, Hebreeën, Ezechiël, Daniël, Haggaï` [P] |
| Russian | Cyrillic | Cyrillic (U+0400–U+04FF) | `Ё`/`ё` not needed for any of the 66 names [I, from the list above]; `Э`, `Ы`, `Ю` are needed (`Эсфирь`, `Экклезиаст`, `Исайя`, `Фессалоникийцам`) [P] |
| Georgian | **Mkhedruli** (mkhedruli, `ქართული`) | Georgian (U+10A0–U+10FF) + Georgian Extended (U+1C90–U+1CBF) for Mtavruli caps | No case in Mkhedruli proper; Mtavruli is the all-caps style used in Georgian headings — jw.org's own Georgian headings render as Mtavruli (`ᲬᲘᲒᲜᲘ`) [P] |

Font facts, verified from the Noto project's own specimens:

- **Noto Sans** is "an unmodulated ('sans serif') design for texts in the **Latin, Cyrillic and Greek** scripts"; 3,741 glyphs, 2,840 characters, 30 Unicode blocks [P] — https://notofonts.github.io/noto-docs/specimen/NotoSans/. It contains **no Georgian**.
- **Noto Sans Georgian** supports "186 characters from 4 Unicode blocks: **Georgian, Georgian Extended, Georgian Supplement, Combining Diacritical Marks**"; 225 glyphs [P] — https://notofonts.github.io/noto-docs/specimen/NotoSansGeorgian/. The Georgian Extended block is Mtavruli capitals, U+1C90–U+1CBF [P] — https://www.unicode.org/Public/UCD/latest/charts/PDF/U1C90.pdf. It contains **no Latin and no Cyrillic** — a third-party specimen states this explicitly ("Noto Sans Georgian has no Latin letters") [S], and the 4-block coverage above implies it [I→P].
- Both are **SIL OFL 1.1** [P for Noto Sans Georgian via `@fontsource/noto-sans-georgian` package metadata and the openSUSE font package `noto-sans-georgian-fonts` `License: OFL-1.1`; Noto Sans is likewise OFL on Google Fonts]. **[I]** OFL permits bundling in an app and on a server; keep the licence file and don't sell the fonts alone.

**Answered for the stack ticket [I]: no single Noto Sans file covers Latin + Cyrillic + Georgian.** You need two families and per-glyph fallback, which the browser does natively:

```css
font-family: "Noto Sans", "Noto Sans Georgian", system-ui, sans-serif;
```

with `unicode-range` subsets preloaded so the Georgian font only downloads for `ka` (about 1 MB unpacked per the fontsource package, 214 files — shippable as woff2 subsets). Do **not** hand-roll a `ka → only Georgian font` override: `1 სამუელი` mixes ASCII digits with Mkhedruli in one string [P], so the Georgian locale needs both fonts *simultaneously*. Also don't `text-transform: uppercase` the Georgian names — store and render them as-is (Mtavruli glyphs exist if a designer insists, but upper-casing mix-cased strings is a defensive-coding trap) [I].

---

## 8. What I could not verify (do not fill these gaps by guessing)

1. **Georgian Bible Society's own book-name list.** I did not reach a Georgia Bible Society / `bible.ge` catalogue page. All common-Georgian names in §2.4 come from three secondary sources (orthodox.do.am Orthodox Bible index, mybible.ge, ph4.org). They agree on the *forms*, but if the game will ship Georgian aliases, someone should confirm against `shop.bible.ge` or a printed Georgian Bible.
2. **Dutch NWT abbreviation list — incomplete.** The page at `jw.org/nl/bibliotheek/bijbel/studiebijbel/boeken/` renders the book table client-side; I captured only the rows that appeared in an extracted snapshot (`Gen./Ge`, `Ex./Ex`, `Lev./Le`, `Num./Nu`, `Deut./De`, `1 Sam./1Sa`, `2 Sam./2Sa`, `1 Kon./1Kon`, `Jer./Jer`, `Klaagl./Klg`, `Joël/Joë`, `Obad./Ob`, `Nah./Na`, `Hab./Hab`, `Zef./Ze`, `Hag./Hag`, `Mal./Mal`, `2 Kor./2Kor`, `1 Thess./1Th`). Everything else is marked `—` in §2.2. Do not ship Dutch abbreviations.
3. **Russian common names** are from Bible websites, not an official church-publisher page. The forms quoted (`1 Царств`, `Паралипоменон`, `Псалтирь`, `Песнь Песней`) are stable across four independent sites, but this is [S], not [P].
4. **No case law specifically on Bible book-name lists** was found. §6 rests on the general rule (37 CFR 202.1(a)), *Feist*, and the absence of originality in the canon — not on a directly on-point holding.
5. **No trademark register search** (USPTO/EUIPO) for "New World Translation" / "NWT".
6. **The Georgian NWT edition number behind WOL `r20/lp-ge`.** The WOL page title is "წიგნების სახელწოდებები" with page numbers running 41→1897, i.e. a complete Bible, and its 66 names match the 2006-edition `bi12` books index 66/66 [P]. I did not separately confirm which printing year `r20` is. jw.org/ka currently offers "ბიბლია — „ახალი ქვეყნიერების თარგმანი“ (2020)" as the current edition and "(2006 წლის გამოცემა)" as the older one [P]; the names are stable across the two as far as my data shows.
7. **`source_check` did not validate the copyright claim** (returned "unclear", confidence 0.30, no automated assessment). Manual primary-source inspection was used instead; see §6.
8. **Not legal advice.** §6 is a research reading of primary legal texts, not a lawyer's opinion.

---

## 9. Sources

**Kept**

- *Names and Order of the Books*, WOL, English — https://wol.jw.org/en/wol/d/r1/lp-e/1001061103 — **the** primary table: all 66 names + NWT abbreviations + page numbers; also prints "Song of Solomon (Canticles)".
- *Содержание* (same table), WOL, Russian — https://wol.jw.org/ru/wol/d/r2/lp-u/1001061103 — 66 Russian NWT names + abbreviations, verbatim.
- *წიგნების სახელწოდებები* (same table), WOL, Georgian — https://wol.jw.org/ka/wol/d/r20/lp-ge/1001061103 — 66 Georgian NWT names + abbreviations, verbatim, with Mtavruli section heads.
- *NWT Study Bible books index*, English — https://www.jw.org/en/library/bible/study-bible/books/ — independent primary confirmation of the English names and the Hebrew-Aramaic / Christian Greek grouping.
- *Tabel van de Bijbelboeken*, Dutch — https://www.jw.org/nl/bibliotheek/bijbel/nwt/bijbelboeken-lijst/ — 66 Dutch NWT names in order, static HTML.
- *NWT 2006 edition books index*, Georgian — https://www.jw.org/ka/ბიბლიოთეკა/ბიბლია/bi12/წიგნები/ — second primary Georgian source; agrees 66/66 with WOL.
- *NWT Study Edition publishers' page* — https://www.jw.org/en/library/bible/study-bible/title-page-nwt/ — per-book `©` years; "not for sale".
- *jw.org Terms of Use* — https://www.jw.org/en/terms-of-use/ — the "no text as part of any software application" and no-scraping clauses that actually constrain this project.
- *37 CFR § 202.1* — https://www.copyright.gov/title37/202/37cfr202-1.html — names/titles/short phrases and "mere listing of … contents" not copyrightable.
- *Feist Publications v. Rural Telephone*, 499 U.S. 340 (1991) — https://www.law.cornell.edu/supremecourt/text/499/340 — facts uncopyrightable; thin compilation protection; originality of selection/arrangement is the test.
- *Noto Sans specimen*, Noto docs — https://notofonts.github.io/noto-docs/specimen/NotoSans/ — Latin + Cyrillic + Greek; no Georgian.
- *Noto Sans Georgian specimen*, Noto docs — https://notofonts.github.io/noto-docs/specimen/NotoSansGeorgian/ — 4 Georgian-related blocks; no Latin/Cyrillic.
- *Unicode chart, Georgian Extended U+1C90–U+1CBF* — https://www.unicode.org/Public/UCD/latest/charts/PDF/U1C90.pdf — Mtavruli capitals block.
- *Alle Bijbelboeken* (ichthusboekhandel) — https://www.ichthusboekhandel.nl/alle-bijbelboeken/ — Dutch `Richteren` as the trade-standard name.
- *Nederlandstalige vocabulaire voor Werken gerelateerd aan de Bijbel* (RDA-commissie) — https://rdacommissie.home.blog/bijbelboeken/ and OCLC GGC appendix — Dutch bibliographic standard names (`Richteren`).
- NBV21 book list — https://www.paulverheijen.nl/menu-bijbel-nt.php and https://shop.bijbelgenootschap.nl/app/data/uploads/sites/2/2026/06/9789065395610_fragm-docb.pdf — NBV21 forms (`Matteüs`, `1 Korintiërs`, `1 Tessalonicenzen`, `1 Timoteüs`).
- HSV table of contents — https://www.ichthusboekhandel.nl/pdf/w6lay/9789065395122/hsv-bijbel-hardcover-teksteditie-inkijkexemplaar.pdf — HSV forms (`RICHTEREN`, `MATTHEÜS` convention).
- Synodal book lists, four independent mirrors — https://bible.by/syn/, https://biblia.chat/ru/bible/rus/SYNO, https://bible.net.ua/ru/translation/syn/, https://orthodoxday.org/ru/bibliya — common Russian names.
- Georgian common names — https://orthodox.do.am/publ/ts_39_mida_ts_39_erili/dzveli_aghtkma_tanamedrove_kartul_enaze/2-1-0-25 (Orthodox index), https://mybible.ge/biblia/ (Georgian Bible), https://www.ph4.org/btraduk_allbooks.php?gr=empty&l=ka (book-form glossary).

**Rejected / deprioritised**

- `ph4.org` as a *name list* — its minor-prophet numbering is off by one (Obadiah/Jonah/Micah/Nahum/Habakkuk/Zephaniah/Haggai/Zechariah/Malachi are shifted and "ამოს წინასწარმეტყველი" appears twice). Used only to corroborate *morphological forms*, never as an ordered list.
- `bible.knowing-jesus.com/Dutch`, `bijbelassistent.nl`, `openvertaling.nl` — same Dutch name set as the retained sources, no added value; `openvertaling.nl` also mixes in deuterocanonical books.
- `archiv-vegelahn.de` NWT scan, `watch-tower.com` WEB FAQ, `copyrightencyclopedia.com` — tangential or non-authoritative for anything claimed here.
- `sellingjesus.org`, `avvo.com` answers, various law-review PDFs surfaced by `source_check` — commentary/Q&A, weaker than the statute and *Feist* for the claims made; not cited.
- `fontfam.net`, `fontfyi.com`, `fonttest.com`, `glyph-sleuth` — SEO/specimen aggregators; kept only as a secondary confirmation that Noto Sans Georgian lacks Latin, which the Noto docs already imply.

---

## 10. Recommended next steps

1. Build the content file from a **public-domain** source for the ordered list (any Protestant 66-book Bible), then copy the four NWT name columns from §2 (they are names, not text) — and keep the jw.org provenance note in the repo so the ToS decision is documented.
2. Get the Georgian alias column confirmed by a Georgian speaker against a printed Georgian Bible before shipping `ka`. `მეორე რჯული` vs `კანონი` is the single highest-value alias in the whole project.
3. Decide the matching policy per locale now, because it changes the schema: English/Dutch ≈ exact + diacritic-insensitive; Russian = exact + alias table + `От`/`К`-optional prefix; Georgian = alias table mandatory + "მეფეთა" mapping. Do not auto-derive Georgian aliases from morphology.
4. Stack ticket: two font families (`Noto Sans`, `Noto Sans Georgian`), OFL licence files shipped, `unicode-range` subsets, no forced uppercase for `ka`.

---

*Scope note: no git commands were run, no file other than this one was created or edited, and no scripture text was fetched, quoted, or stored.*
