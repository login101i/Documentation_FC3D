---
sidebar_position: 6
title: "Parametry do uzupełnienia"
description: "Placeholdery SQL i ustawienia koloru, tekstury oraz krawędzi."
---
**Ustawienie kolor, textura, zmienna, blokowanie krawędzi dla blaty**

### HPL

```sql
UPDATE Materials
SET
Color3 = '#000000',
Color4 = '#000000',
Color5 = '#000000',
Color6 = '#000000',
ColorInSide = '#000000',
StandardVariables = '_wt_SysDefOptInc={wartość wcięcia} 
_sys_mat_join_type=0
EdgeBlockLeft=1
EdgeBlockTop=1
EdgeBlockRight=1
EdgeBlockBottom=1'
WHERE mattype IN (4) AND thicknes< 17
```

### BLATY 38 MM

Ustawienie tekstury, wartości wcięcia oraz parametrów łączenia.

```sql
UPDATE Materials
SET
TextureFileNameInSide = 'nazwaObrazka',
StandardVariables = '_wt_SysDefOptInc={wartość wcięcia}
_sys_mat_join_type=1,_wt_SysMatEdgeOrgR1=8
_wt_SysMatEdgeOrgR2=6
EdgeBlockLeft=0
EdgeBlockTop=0
EdgeBlockRight=0
EdgeBlockBottom=0'
WHERE mattype IN (4) AND thicknes>28
```

- nazwaObrazka – nazwa pliku tekstury.
- `{wartość wcięcia}` – wartość wcięcia.
- wpisz grupę blatów w where lub polegaj na grubości... – właściwa grupa materiałów.

**Zalecenie:** przed wykonaniem UPDATE sprawdzić materiały za pomocą SELECT.
