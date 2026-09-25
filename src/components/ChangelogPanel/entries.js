/**
 * Ręczny dziennik zmian dokumentacji (po polsku).
 *
 * Tylko zmiany TREŚCI dokumentacji (nowe/edytowane strony).
 * Nie wpisuj tu zmian UI / layoutu / wyszukiwarki.
 *
 * Dodawaj wpisy NA GÓRZE. Podbij też APP_VERSION (np. 1.05).
 *
 * Pola:
 * - id, version, date, author, title, summary, pages
 * - href           — ścieżka strony, np. '/jak-edytowac-dokumentacje'
 * - markSidebarNew — true = żółta ★ w lewym spisie przez 3 tygodnie
 */
export const CHANGELOG_ENTRIES = [
  {
    id: '1.14-sql-blaty-38',
    version: '1.14',
    date: '2026-09-25',
    author: 'Maciej Kruszyniak',
    title: 'Kwerendy SQL dla blatów 38 mm',
    summary:
      'W „Parametry do uzupełnienia” dodano kwerendy UPDATE: zaokrąglenia, poziom zagnieżdzenia, brzegowanie, optymalizacja, oklejanie i FlagShowIn3D.',
    pages: ['Parametry do uzupełnienia'],
    href: '/parametry-do-uzupelnienia',
    markSidebarNew: true,
  },
  {
    id: '1.09-obrazy-tabele',
    version: '1.09',
    date: '2026-09-21',
    author: 'Maciej Kruszyniak',
    title: 'Obrazy z tabelek Worda',
    summary:
      'Uzupełniono 9 schematów z dokumentu Word, które siedziały w komórkach tabel (oklejanie krawędzi, tekstura wnętrza, łączenie blatów, promienie i odcięcie).',
    pages: [
      'Oklejanie niestandardowe',
      'Kolory płaszczyzn',
      'Zmienne standardowe oraz indywidualne',
    ],
    href: '/parametry-zasobu/oklejanie-niestandardowe',
    markSidebarNew: false,
  },
  {
    id: '1.06-procedura-pdf',
    version: '1.06',
    date: '2026-09-21',
    author: 'Maciej Kruszyniak',
    title: 'Procedura konfiguracji FC3D (PDF)',
    summary:
      'Dodano stronę „Procedura konfiguracji FC3D” (tekst + screenshoty z PDF) jako drugi punkt w spisie — po wprowadzeniu, przed konfiguracją bazy zasobów.',
    pages: ['Procedura konfiguracji FC3D'],
    href: '/procedura-konfiguracji-fc3d',
    markSidebarNew: true,
  },
  {
    id: '1.02-migracja-edycja',
    version: '1.02',
    date: '2026-09-21',
    author: 'Maciej Kruszyniak',
    title: 'Sekcja Migracja i poradnik edycji dokumentacji',
    summary:
      'Zmieniono nazwę Holztusche na Migracja. Dodano stronę „Jak edytować dokumentację” z mapą drogową oraz linkiem z wprowadzenia.',
    pages: ['Migracja', 'Jak edytować dokumentację', 'Wprowadzenie'],
    href: '/jak-edytowac-dokumentacje',
    markSidebarNew: true,
  },
  {
    id: '1.00-publikacja',
    version: '1.00',
    date: '2026-09-19',
    author: 'Maciej Kruszyniak',
    title: 'Pierwsza publikacja dokumentacji FastCube3D',
    summary:
      'Opublikowano dokumentację konfiguratora blatów (migracja z Word) na stronie dokumentacji.',
    pages: ['Cała dokumentacja'],
    href: '/',
  },
];
