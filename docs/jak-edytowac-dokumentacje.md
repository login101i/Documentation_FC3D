---
sidebar_position: 8
title: "Jak edytować dokumentację"
description: "Jak współtworzyć dokumentację FC3D: lokalna edycja, GitHub i publikacja."
sidebar_custom_props:
  added: "2026-09-21"
  isNew: true
---

# Jak współtworzyć dokumentację FC3D

Dokumentacja jest przechowywana na GitHubie i generowana za pomocą Docusaurusa.

Nie musisz znać Gita ani programowania, żeby poprawiać dokumentację. W większości przypadków wystarczy kilka prostych kroków.

## Roadmapa

![Roadmapa edycji dokumentacji](/img/roadmap-edycja-dokumentacji.png)

## 1. Pobierz projekt

Po otrzymaniu dostępu do repozytorium pobierz projekt na swój komputer.

```bash
git clone https://github.com/login101i/Documentation_FC3D.git
```

Następnie przejdź do folderu projektu:

```bash
cd Documentation_FC3D
```

Zainstaluj potrzebne komponenty:

```bash
npm install
```

## 2. Uruchom dokumentację lokalnie

Uruchom:

```bash
npm start
```

Otwórz w przeglądarce:

```text
http://localhost:3000/Documentation_FC3D/
```

Możesz teraz sprawdzać dokumentację przed wysłaniem zmian.

## 3. Wprowadź zmiany

Dokumentacja znajduje się przede wszystkim w folderze:

```text
docs/
```

Pliki dokumentacji mają rozszerzenie:

```text
.md
```

Przykład struktury:

```text
docs/
├── intro.md
├── konfiguracja-bazy-zasobow.md
├── parametry-zasobu/
│   ├── parametry-podstawowe.md
│   ├── oklejanie-niestandardowe.md
│   └── kolory-plaszczyzn.md
├── sety/
├── migracja/
└── jak-edytowac-dokumentacje.md
```

Otwórz odpowiedni plik i wprowadź zmianę.

**Nie usuwaj ani nie zmieniaj przypadkowo plików konfiguracyjnych Docusaurusa** (np. `docusaurus.config.js`, `package.json`, `.github/`).

## 4. Sprawdź swoją zmianę

Po zapisaniu pliku odśwież:

```text
http://localhost:3000/Documentation_FC3D/
```

Sprawdź:

* czy tekst wygląda poprawnie,
* czy obrazki się wyświetlają,
* czy nagłówki i kolejność stron są czytelne,
* czy wyszukiwarka nadal znajduje zmienioną treść.

## 5. Zapisz zmiany w Gicie

Najpierw pobierz najnowsze zmiany z `main`:

```bash
git pull origin main
```

Utwórz własną gałąź (zamiast `opis-zmiany` wpisz krótki opis, np. `poprawka-tekstur`):

```bash
git checkout -b opis-zmiany
```

Dodaj i zapisz zmiany:

```bash
git add .
git commit -m "Opisz krótko, co zostało zmienione."
```

## 6. Wyślij zmiany na GitHub

```bash
git push -u origin opis-zmiany
```

## Jak opublikować zmiany na stronie

Samo wysłanie gałęzi na GitHub **nie aktualizuje** publicznej dokumentacji.

Aby zmiany pojawiły się na stronie:

1. Wyślij swoją gałąź:

```bash
git push -u origin opis-zmiany
```

2. Otwórz repozytorium na GitHubie: [login101i/Documentation_FC3D](https://github.com/login101i/Documentation_FC3D).
3. Kliknij **Compare & pull request**.
4. Opisz krótko wprowadzone zmiany i utwórz **Pull Request**.
5. Druga osoba sprawdza zmiany i łączy Pull Request z gałęzią `main`.
6. Po połączeniu z `main` GitHub Actions automatycznie:
   * zbuduje dokumentację Docusaurusa,
   * opublikuje jej nową wersję,
   * zaktualizuje stronę.

Postęp publikacji można sprawdzić w zakładce:

```text
GitHub → Actions
```

Zielony znacznik oznacza, że publikacja zakończyła się poprawnie. Czerwony oznacza błąd — w takim przypadku nie trzeba ponownie wykonywać wszystkich zmian; należy najpierw sprawdzić komunikat w zakładce **Actions**.

Aktualizacja strony może potrwać kilka minut od momentu połączenia Pull Requesta z `main`.

Publiczna dokumentacja:

```text
https://login101i.github.io/Documentation_FC3D/
```

## Najważniejsze komendy

```bash
git pull origin main
git checkout -b opis-zmiany
npm start
git add .
git commit -m "Opis zmiany"
git push -u origin opis-zmiany
```
