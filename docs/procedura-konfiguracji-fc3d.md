---
sidebar_position: 2
title: "Procedura konfiguracji FC3D"
description: "Procedura konfiguracji FastCube3D oraz API dla FastCut."
sidebar_custom_props:
  added: "2026-09-21"
  isNew: true
---

# Procedura konfiguracji FC3D

## 1. Skopiuj katalog fc3d

Na użytkowniku **fastcut** skopiuj katalog `fc3d` do:

```text
0:/public_html/xxxyyyzzz_web_2/fc3d/
```

## 2. Skopiuj dane dostępowe do bazy

Na użytkowniku **fastcut** skopiuj dane dostępowe do bazy z pliku:

```text
0:/public_html/xxxyyyzzz_web_2/server/init.php
```

do:

```text
0:/public_html/xxxyyyzzz_web_2/plugins/fc3d/server/init.php
```

## 3. Zaimportuj tabele z bazy wzorcowej

Zaimportuj następujące tabele z bazy wzorcowej:

- `Objects`
- `ObjectsCatalogs`
- `ObjectsGroups`
- `ObjectsLangs`
- `ObjectsTpls`
- `ObjectsVariables`

Jeśli tabele są już w bazie docelowej — zweryfikuj je lub usuń przed importem.

![Tabele Objects do importu](/img/procedura-konfiguracji/procedura-01.png)

## 4. Skonfiguruj bazę w Params

Ustaw w **Params**:

- `Custom20.OnlineWorktopCreator=1`
- `Custom20.FastCube3DUrl=https://xxxyyyzzz.erozkroje.pl/plugins/fc3d/view3d.html?lang={{lang}}&hash={{hash}}&symbol={{symbol}}&set={{set}}&tpl={{tpl}}&id={{ID}}&bid={{BID}}&gid={{GID}}&mode={{mode}}`
- `Custom20.FastCube3DInitSet=set_1`
- `Custom20.FastCube3DInitTpl=worktop_fastcube3d`
- `Custom20.FastCube3DInitSymbol=WORKTOP_V6`

## 5. Załóż użytkowników API FC3D

Załóż użytkowników **FC3D_API** i **FC3D_API_KLIENT** z uprawnieniami `API_OAUTH`.

![Użytkownicy FC3D_API i FC3D_API_KLIENT](/img/procedura-konfiguracji/procedura-02.png)

## 6. Skopiuj API key (ext)

API key (ext) użytkownika **FC3D_API** skopiuj do zmiennej:

```text
Params.Online.FastCube3DAPIKey
```

## 7. Skopiuj API sign

API sign użytkownika **FC3D_API_KLIENT** skopiuj do zmiennej:

```text
Params.Online.FastCube3DAuthSign
```

## 8. Uprawnienia użytkownika FC/OM

Użytkownik FC/OM, który ma korzystać z FC3D, musi mieć:

- wypełniony **nieunikalny** `Id1`
- dostęp do **Custom20** (domyślny dla FC3D)

## 9. Skonfiguruj bryłę i wycenę

Zaloguj się do:

```text
https://xxxyyyzz.erozkroje.pl/plugins/fc3d/creator3d.html
```

i skonfiguruj bryłę oraz sposób wyceny w **Custom20**.

---

# Procedura konfiguracji API dla FC

## 1. Załóż użytkowników API FC

Załóż użytkowników **FC_API** i **FC_API_KLIENT** z uprawnieniami `API_OAUTH`.

## 2. Ustaw Params OAuth2

W **Params** ustaw:

- `FC_oAuth2ClientId=FC_API`
- `FC_oAuth2ClientSecret=hasłoużytkownikaFC_API`
- `FC_oAuth2ServerUrl=https://xxxyyyzzz.erozkroje.pl`
- `FC_oAuth2APIKey=API key (ext) użytkownika FC_API_KLIENT`

:::note
`FC_oAuth2APIKey` ulega zmianie po zmianie hasła lub nazwy użytkownika.
:::

## 3. Uruchomienie FC w oknie OM

Po poprawnej konfiguracji można uruchomić FC w oknie OM z automatycznym logowaniem użytkownika zalogowanego w OM (użytkownik musi mieć możliwość logowania w FC).

## 4. Uruchomienie FC3D w oknie OM

Można uruchomić FC3D w okienku OM.

![Uruchomienie FC3D z paska OM](/img/procedura-konfiguracji/procedura-03.png)

---

Oryginalny plik PDF: [Procedura konfiguracji FC3D.pdf](/files/procedura-konfiguracji-fc3d.pdf)
