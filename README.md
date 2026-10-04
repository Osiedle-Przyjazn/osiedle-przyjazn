# Osiedle Przyjaźń — strona sąsiedzka

Strona **https://osiedleprzyjazn.waw.pl** — drewniane osiedle na warszawskich Jelonkach (od 1952 r.).
Historia, ludzie stąd, interaktywna Tablica sąsiedzka, Kuźnia pomysłów i mapa miejsc osiedla w sieci.

Robiona po godzinach i z serca. **Chcesz coś zmienić albo dopisać? Zobacz [CONTRIBUTING.md](CONTRIBUTING.md)** — są tam trzy drogi, od najprostszej (bez znajomości kodu) po pełną.

## Co tu jest

| Plik / katalog | Co robi |
|---|---|
| `index.html` | Cała strona: treść, style (CSS w `<style>`) i skrypty tablicy (JS na końcu pliku). Jeden plik, celowo. |
| `og.jpg` | Obrazek do podglądu linku (Facebook, Messenger, WhatsApp). 1200×630. |
| `img/` | Logo Inicjatywy i zdjęcia wgrane z edytora. |
| `robots.txt`, `sitemap.xml` | Dla wyszukiwarek. |
| `CNAME` | Domena dla GitHub Pages. **Nie ruszać.** |
| `worker/` | Backend Tablicy sąsiedzkiej (Cloudflare Worker + baza D1) oraz panele: `/edytor` (klikalna edycja tekstów), `/pisarz` (edytor kodu z podglądem), `/redakcja` (bot), `/gospodarz` (moderacja tablicy). Wdraża tylko gospodarz strony. |

## Jak to działa

- **Hosting:** GitHub Pages z gałęzi `master`. Każda zmiana scalona do `master` jest na stronie po około minucie. Nie ma żadnego „builda”.
- **Tablica sąsiedzka:** kartki lecą do `https://api.osiedleprzyjazn.waw.pl` (Worker w `worker/src/index.js`, baza D1 `tablica_przyjazn`). Kartki wiszą 60 dni. Panel gospodarza: `/gospodarz` na tym samym adresie (zdejmowanie kartek wymaga klucza).
- **Edycja bez gita:** `/edytor` (klikasz tekst na stronie i poprawiasz) oraz `/pisarz` (edytor kodu HTML/CSS/JS z podglądem i diffem). Oba wymagają klucza od gospodarza. Z kluczem pisarza zmiana trafia jako pull request, z kluczem redakcji od razu na stronę. Szczegóły w [CONTRIBUTING.md](CONTRIBUTING.md).
- **Sekcje strony** (w `index.html` po `id`): `historia`, `ludzie`, `tablica`, `kuznia`, `wsieci` + stopka. Nawigacja u góry linkuje do tych `id`.

## Praca lokalnie

Strona to statyczny HTML, więc wystarczy:

```bash
git clone https://github.com/Osiedle-Przyjazn/osiedle-przyjazn.git
cd osiedle-przyjazn
python3 -m http.server 8000     # albo po prostu otwórz index.html w przeglądarce
```

Tablica na lokalnej kopii łączy się z produkcyjnym API, więc kartki dodane „na próbę” pojawią się naprawdę. Do testów formularza lepiej wpisać coś ewidentnie testowego w tytule i poprosić gospodarza o zdjęcie, albo nie wysyłać.

### Worker (tylko gospodarz)

```bash
cd worker
npx wrangler login
npx wrangler d1 execute tablica_przyjazn --remote --file=schema.sql   # pierwszy raz
npx wrangler secret put ADMIN_KEY                                      # klucz panelu /gospodarz (i wszystkiego innego)
npx wrangler secret put REDAKCJA_KEY                                   # klucz dla redaktorów: /edytor, /redakcja, /pisarz z publikacją
npx wrangler secret put PISARZ_KEY                                     # klucz dla pisarzy: /pisarz, zmiany tylko jako pull request
npx wrangler secret put GITHUB_TOKEN                                   # fine-grained PAT: Contents read/write, Pull requests read/write
npx wrangler deploy
```

## Ton i zasady treści

Krótko: piszemy jak sąsiad do sąsiada. Szczegóły w [CONTRIBUTING.md](CONTRIBUTING.md#o-czym-i-jak-piszemy).

## Licencja i źródła

Treść historyczna za Wikipedią ([Osiedle Przyjaźń](https://pl.wikipedia.org/wiki/Osiedle_Przyja%C5%BA%C5%84_(Warszawa))). Kod strony można swobodnie podglądać i przerabiać na potrzeby osiedla.
