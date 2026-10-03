# Jak zmienić stronę osiedla

Ta strona jest sąsiedzka, więc sąsiedzi mogą ją współtworzyć. Nie trzeba być programistą. Wybierz drogę, która Ci pasuje.

## Droga 1: napisz, co zmienić (bez kodu, 5 minut)

Masz poprawkę do historii, nowe wydarzenie do „Przyjaźń w sieci”, literówkę, pomysł do Kuźni? Wystarczy opisać.

1. Załóż darmowe konto na GitHubie (jeśli nie masz): https://github.com/signup
2. Wejdź tu: **https://github.com/gicaking/osiedle-przyjazn/issues/new/choose** i wybierz „Propozycja zmiany”.
3. Napisz **co** i **gdzie** (np. „w sekcji Historia, rok 1955, zamiast X powinno być Y”). Jeśli masz gotowy tekst, wklej go.

Gospodarz strony wprowadzi zmianę i odpisze w tym samym wątku. Zwykle w ciągu kilku dni.

Bez konta GitHub? Powieś kartkę na [Tablicy sąsiedzkiej](https://osiedleprzyjazn.waw.pl/#tablica) z tytułem zaczynającym się od „Do gospodarza strony:”. Też dotrze.

## Droga 2: zmień sam w przeglądarce (bez instalowania czegokolwiek)

Dla osób, które chcą same poprawić tekst. GitHub ma wbudowany edytor.

1. Zaloguj się na GitHub i otwórz plik: **https://github.com/gicaking/osiedle-przyjazn/blob/master/index.html**
2. Kliknij ikonę ołówka („Edit this file”). GitHub sam zrobi Twoją kopię (fork), nie zepsujesz niczego na żywej stronie.
3. Znajdź fragment do zmiany (Ctrl+F po tekście, który widzisz na stronie). Treść jest w tym samym pliku co style, więc zmieniaj tylko to, co rozumiesz. Tekst między `<p>` a `</p>`, nagłówki między `<h2>`/`<h3>`.
4. Kliknij „Commit changes”, wpisz jednym zdaniem, co zmieniasz (np. „Poprawiam rok wprowadzenia się studentów”).
5. Kliknij „Propose changes”, potem „Create pull request”. Gotowe. Gospodarz obejrzy zmianę, ewentualnie coś dopyta, i scali. Po scaleniu strona odświeża się sama w ciągu minuty.

Gdzie co leży w `index.html`:

| Chcesz zmienić | Szukaj |
|---|---|
| Historię (oś czasu) | `<section id="historia"` |
| O nas (tekst Inicjatywy, cele, postulaty, kontakt) | `<section id="onas"` |
| Ludzi stąd (Ratowniczka, Kronikarz) | `<section id="ludzie"` |
| Tablicę (opisy, formularz) | `<section id="tablica"` |
| Kuźnię pomysłów | `<section id="kuznia"` |
| Przyjaźń w sieci (linki do Inicjatywy, BCK) | `<section id="wsieci"` |
| Stopkę | `<footer` |
| Kolory | `:root{` na początku `<style>` (nazwy: tynk, smoła, sosna, okiennica, domek, deska, papier) |
| Opis strony w Google i na Facebooku | `<meta name="description"` i `og:` w `<head>` |

Czego **nie** ruszać bez rozmowy z gospodarzem: `CNAME`, `robots.txt`, `sitemap.xml`, katalog `worker/`, skrypt tablicy na końcu `index.html` (od `<script>`), tekst sekcji „O nas” (oficjalny tekst Inicjatywy).

## Droga 2a: edytor w przeglądarce bez GitHuba (klucz od gospodarza)

Dla sąsiadów, którzy nie chcą zakładać konta GitHub. Gospodarz daje Ci klucz (osobiście albo przez Signal), a Ty wchodzisz pod jeden z adresów:

| Adres | Dla kogo | Co się dzieje po zapisie |
|---|---|---|
| https://api.osiedleprzyjazn.waw.pl/edytor | chcesz poprawić tekst albo zdjęcie, klikając na stronie | od razu na stronie (klucz redakcji) |
| https://api.osiedleprzyjazn.waw.pl/pisarz | umiesz HTML/CSS/JS i chcesz pisać kod, z podglądem i diffem obok | z kluczem pisarza: propozycja (pull request), którą gospodarz scala; z kluczem redakcji: od razu na stronie |

W Pisarzu wpisujesz raz klucz i swoje imię albo nick. Imię zostaje w historii zmian, żeby było wiadomo, kto co zmienił. Na dole jest bot: opisz zmianę po polsku, bot wstawi ją do kodu, a Ty poprawisz i wyślesz. Zakładka „Zmiany” pokazuje dokładnie, co się różni od opublikowanej strony. Obejrzyj ją przed wysłaniem.

Klucz traktuj jak hasło. Jeśli wycieknie, napisz do gospodarza, wymiana trwa minutę.

## Droga 3: pełna (dla osób znających git)

```bash
git clone https://github.com/gicaking/osiedle-przyjazn.git   # albo swój fork
cd osiedle-przyjazn
git checkout -b moja-zmiana
# edytuj index.html, sprawdź w przeglądarce (python3 -m http.server 8000)
git commit -am "Krótko co i po co"
git push -u origin moja-zmiana
```

Potem pull request na GitHubie. Jedna zmiana = jeden PR, wtedy łatwo o szybką zgodę.

Skrót bez instalowania czegokolwiek: na stronie repozytorium wciśnij klawisz `.` (kropka). Otworzy się VS Code w przeglądarce (github.dev) z całym repo. Zmiany zapisujesz jako commit do swojego forka i robisz pull request.

Jeśli chcesz zostać stałym współgospodarzem strony (prawo scalania bez czekania), napisz do gospodarza. Dostaniesz dostęp „collaborator” do repozytorium.

## O czym i jak piszemy

- **Jak sąsiad do sąsiada.** Ciepło, konkretnie, bez urzędowego tonu i bez marketingu. Zdania krótkie.
- **Bez sekcji prawnych, roszczeń i sporów.** Strona świadomie nie jest miejscem na to (poprzednia wersja to miała i zrezygnowaliśmy). Od tego są Inicjatywa i formalne kanały.
- **Fakty historyczne z podaniem źródła** w opisie zmiany (Wikipedia, książka, wspomnienie konkretnej osoby za jej zgodą).
- **Ludzie tylko za zgodą.** Nie dopisujemy nazwisk, adresów, numerów domków ani zdjęć sąsiadów bez ich wyraźnej zgody. Dzieci: nigdy.
- **Linki zewnętrzne** tylko do miejsc związanych z osiedlem (Inicjatywa, BCK, źródła historyczne). Bez reklam.
- **Po polsku, z polskimi znakami.** Emoji oszczędnie, tak jak jest teraz.

## Co się dzieje po wysłaniu

1. Gospodarz dostaje powiadomienie.
2. Czyta, sprawdza na kopii, czasem dopyta w wątku.
3. Scala do `master`. GitHub Pages publikuje w ciągu minuty. Twoje imię lub nick zostaje w historii zmian na zawsze.

Dziękujemy. Ta strona jest tym lepsza, im więcej sąsiadów ją współpisze.
