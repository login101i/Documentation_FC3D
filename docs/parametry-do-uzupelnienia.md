---
sidebar_position: 7
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

## Parametry blatów 38 mm (`MatType` 4 / 4;200)

Poniższe kwerendy ustawiają typowe wartości dla blatów o grubości 38 mm.

### Zaokrąglenia dla blatów

```sql
UPDATE Materials m SET
  m.EdgeRoundTop = CASE WHEN m.Width IN (600, 900, 1200) THEN 1 ELSE 0 END,
  m.EdgeRoundBottom = CASE WHEN m.Width IN (900, 1200) THEN 1 ELSE 0 END
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Optymalizacja wg materiału

```sql
UPDATE Materials m
SET m.OptimizeUseCustomOptions = 1
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Kolor spodu

```sql
UPDATE Materials m
SET Color2 = '#D2B48C'
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Dostępny w FC3D

```sql
UPDATE Materials m
SET FlagShowIn3D = 1
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Brzegowanie wg materiału

```sql
UPDATE Materials m SET m.Trim1 = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.Trim3 = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.Trim2 = 10 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.Trim4 = 10 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Poziom zagnieżdzenia

`0` — 2D, `3` — pasy proste, `5` — 1D.

```sql
UPDATE Materials m
SET m.OptimizeCalcType = 5
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Optymalizacja — pasy po szerokości

```sql
UPDATE Materials m
SET m.StripsPreffered = 200
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Ilość w sztaplu

```sql
UPDATE Materials m
SET m.OptimizeMaxQntInStack = 1
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Optymalizacja połówek

```sql
UPDATE Materials m
SET m.StripsBoardLastHalf = 0
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Pasy pionowe dla połówek

`1` — poziome, `0` — auto (`2` w przykładzie poniżej).

```sql
UPDATE Materials m
SET m.StripsDirection = 2
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Blokowanie pogrubiania

```sql
UPDATE Materials m
SET m.BoldingBlock = 1
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Docięcie zaokrąglonej krawędzi

```sql
UPDATE Materials m
SET m.EdgeRoundTrim = 10
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Tylko powiązane okleiny

```sql
UPDATE Materials m
SET m.EdgeAllowOnlyAssociated = 0
WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Wyłącz / włącz domyślne oklejanie

```sql
UPDATE Materials m SET m.EdgeDefaultLeft = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.EdgeDefaultTop = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.EdgeDefaultRight = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.EdgeDefaultBottom = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```

### Wyłącz / włącz blokowanie oklejania

```sql
UPDATE Materials m SET m.EdgeBlockLeft = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.EdgeBlockTop = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.EdgeBlockRight = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
UPDATE Materials m SET m.EdgeBlockBottom = 0 WHERE m.MatType IN ('4', '4;200') AND m.Thicknes IN (38);
```
