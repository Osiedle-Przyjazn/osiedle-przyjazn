// Pisarz: edytor kodu strony w przeglądarce (CodeMirror), z podglądem, diffem i botem pod ręką.
// Zapis zależy od klucza:
//   PISARZ_KEY               -> nowa gałąź pisarz/... + pull request, scala gospodarz
//   REDAKCJA_KEY / ADMIN_KEY -> jak w edytorze: commit prosto na master (POST /redakcja/publikuj-html)
// Panel: GET /pisarz. API pod /redakcja/pisarz/* (klucz sprawdza router redakcji).

import PISARZ_HTML from './pisarz.html';
import { ghPobierz, ghHeaders, textToB64, sprawdzBezpieczenstwo, GH } from './redakcja.js';

// ścieżki, do których wpuszcza sam klucz pisarza (reszta /redakcja/* wymaga klucza redakcji albo admina)
export const PISARZ_DOZWOLONE = new Set(['/redakcja/zrodlo', '/redakcja/bot-html', '/redakcja/pisarz/wyslij']);

export function pisarzStrony(req, path) {
  if (req.method === 'GET' && path === '/pisarz') {
    return new Response(PISARZ_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  return null;
}

function slug(s, max = 40) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, max) || 'zmiana';
}
function znacznikCzasu() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/T(\d{4}).*/, '-$1');
}
function czystyAutor(a) {
  return String(a || '').replace(/[<>&"'\\\n\r]/g, '').trim().slice(0, 40) || 'sąsiad';
}

async function ghShaGalezi(env, galaz) {
  const r = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/git/ref/heads/${encodeURIComponent(galaz)}`, { headers: ghHeaders(env) });
  if (!r.ok) throw new Error(`GitHub nie oddał gałęzi ${galaz} (${r.status}).`);
  return (await r.json()).object.sha;
}
async function ghNowaGalaz(env, nazwa, sha) {
  const r = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/git/refs`, {
    method: 'POST', headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: `refs/heads/${nazwa}`, sha }),
  });
  if (!r.ok) throw new Error(`GitHub nie założył gałęzi (${r.status}): ${(await r.text()).slice(0, 200)}`);
}
async function ghZapiszNaGalezi(env, galaz, tresc, sha, wiadomosc, autor) {
  const r = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.plik}`, {
    method: 'PUT', headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: wiadomosc, content: textToB64(tresc), sha, branch: galaz,
      author: { name: autor, email: 'pisarz@osiedleprzyjazn.waw.pl' },
      committer: { name: 'Pisarz Osiedla Przyjaźń', email: 'inicjatywa.op@gmail.com' },
    }),
  });
  if (!r.ok) throw new Error(`GitHub nie przyjął zmiany (${r.status}): ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return { sha: d.commit.sha, url: d.commit.html_url };
}
// Pull request wymaga w tokenie uprawnienia "Pull requests: write". Bez niego zwracamy link do ręcznego otwarcia PR.
async function ghPullRequest(env, galaz, tytul, tresc) {
  const r = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/pulls`, {
    method: 'POST', headers: { ...ghHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: tytul, head: galaz, base: GH.branch, body: tresc, maintainer_can_modify: true }),
  });
  if (!r.ok) return { ok: false, status: r.status, info: (await r.text()).slice(0, 200) };
  const d = await r.json();
  return { ok: true, url: d.html_url, numer: d.number };
}

export async function pisarzApi(req, env, path, json, rola) {
  if (req.method === 'POST' && path === '/redakcja/pisarz/wyslij') {
    const cialo = await req.json().catch(() => ({}));
    const html = String(cialo.html || '');
    if (html.length < 5000 || !/^<!DOCTYPE html>/i.test(html.trim())) return json(req, { blad: 'To nie wygląda na całą stronę. Plik musi zaczynać się od <!DOCTYPE html>.' }, 400);
    if (/data-edytor|contenteditable=/.test(html)) return json(req, { blad: 'W kodzie zostały ślady edytora klikalnego. Usuń je przed wysłaniem.' }, 400);
    const aktualny = await ghPobierz(env);
    if (html === aktualny.tresc) return json(req, { blad: 'Kod jest identyczny z opublikowaną stroną, nie ma czego wysyłać.' }, 409);

    const opis = String(cialo.opis || '').trim().replace(/\s+/g, ' ').slice(0, 120) || 'zmiany w kodzie strony';
    const autor = czystyAutor(cialo.autor);
    const uwagi = sprawdzBezpieczenstwo(aktualny.tresc, html);
    const galaz = `pisarz/${znacznikCzasu()}-${slug(opis)}`;

    const baza = await ghShaGalezi(env, GH.branch);
    await ghNowaGalaz(env, galaz, baza);
    const c = await ghZapiszNaGalezi(env, galaz, html, aktualny.sha, `Pisarz: ${opis}\n\nAutor: ${autor}\nWysłane z /pisarz (klucz: ${rola})`, autor);

    const trescPR = [
      `Propozycja z panelu Pisarz. Autor: **${autor}**.`,
      '',
      `Opis: ${opis}`,
      '',
      uwagi.length ? '⚠️ Automatyczna kontrola zgłasza:\n' + uwagi.map(u => `* ${u}`).join('\n') : '✅ Automatyczna kontrola (id tablicy, długość, liczba skryptów) bez uwag.',
      '',
      'Podgląd: po scaleniu strona odświeża się w ciągu minuty. Przed scaleniem obejrzyj zakładkę „Files changed”.',
    ].join('\n');
    const pr = await ghPullRequest(env, galaz, `Pisarz: ${opis}`, trescPR);
    const porownaj = `https://github.com/${GH.owner}/${GH.repo}/compare/${GH.branch}...${encodeURIComponent(galaz)}?expand=1`;
    return json(req, {
      ok: true, galaz, commit: c.url, krotki: c.sha.slice(0, 7), uwagi,
      pr: pr.ok ? pr.url : null,
      porownaj,
      info: pr.ok ? null : `Zmiana jest na GitHubie (gałąź ${galaz}), ale pull request nie otworzył się automatycznie (${pr.status}). Gospodarz otworzy go z linku „porównaj”.`,
    });
  }
  return null;
}
