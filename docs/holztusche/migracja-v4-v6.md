---
sidebar_position: 1
title: "Konfiguracja w HOLZTUSCHE (migracja V4 → V6)"
description: "Kroki konfiguracji Holztusche po migracji z V4 do V6."
---
Konfiguracja w HOLZTUSCHE (mogracja zV4 do V6)

## 1. Ustawić

```text
Part.ShowOperation61=1
Part.ShowOperation71=1
```

![Zmienne Part.ShowOperation61 i Part.ShowOperation71](/img/zmienne-part-showoperation-61-71.png)

## 2. Zmodyfikować ścieżkę

![Ścieżka Custom20.FastCube3DUrl / FastCube3DConfiguratorUrl](/img/sciezka-fastcube3d-url.png)

## 3. Zdefiniować usługi

OPER_PCS_61 i OPER_PCS_71

Lub

OPER_CIRC_61 i OPER_CIRC_71

## 4. Powiązać z usługami OPER_PCS_61 i OPER_PCS_71kartoteki rozliczeniowe

![Powiązanie OPER_PCS_61 z kartotekami rozliczeniowymi](/img/uslugi-oper-pcs-61-powiazania.png)

![Kartoteki rozliczeniowe usług OPER_PCS](/img/uslugi-oper-pcs-kartoteki.png)

## 5. Przypisać zakres obwodu dla otworów prostokątnych

![Zakres obwodu dla otworów prostokątnych](/img/zakres-obwod-otwor-prostokatny.png)

![Zakres obwodu dla otworów prostokątnych (kontynuacja)](/img/zakres-obwod-otwor-prostokatny-2.png)

## 6. Przypisać zakres średnic dla otworów okrągłych

![Zakres średnic dla otworów okrągłych](/img/zakres-srednic-otwor-okragly.png)

![Zakres średnic dla otworów okrągłych (kontynuacja)](/img/zakres-srednic-otwor-okragly-2.png)

## 7. Konfiguracja złączy dla blatów standardowych

![Konfiguracja złącza MAT_SUB_TYPE index 1](/img/zlacz-mat-sub-type-index-1.png)

```text
MAT_SUB_TYPE=WORKTOP_JOIN
MAT_SUB_TYPE_INDEX=1
MAT_SUB_TYPE_DEFAULT=1
```

![Konfiguracja złącza MAT_SUB_TYPE index 2](/img/zlacz-mat-sub-type-index-2.png)

```text
MAT_SUB_TYPE=WORKTOP_JOIN
MAT_SUB_TYPE_INDEX=2
```

![Konfiguracja złącza MAT_SUB_TYPE index 3](/img/zlacz-mat-sub-type-index-3.png)

```text
MAT_SUB_TYPE=WORKTOP_JOIN
MAT_SUB_TYPE_INDEX=3
```

## 8. Wgrać tekstury do plugins

```text
/public_html/XXX_web_2/plugins/fc3d/assets/data/upload/textures/
```

![Tekstura, skalowanie i symbol producenta](/img/kartoteka-tekstura-symbol-producenta.png)

Obrazki dla tekstur muszą być w katalogu

```text
/plugins/fc3d/assets/data/upload/textures/
```

**W przypadku nieokreślonych symbolów powinien być uzupełniony symbol producenta.**

## 9. Powiązanie usług i złączy dla blatów

```sql
SELECT
RTRIM(LTRIM(Upper(a.tw_Symbol))) MatId,
/*symbol uslugi lączenia blatów standardowych*/
'110 11000000104' MatIdSet,
'0' DefaultJoin
FROM tw__Towar a
WHERE SUBSTRING(a.tw_Pole3, 1, 2) = '#B' AND a.tw_Pole3 NOT LIKE '%HPL%'
UNION ALL
SELECT
RTRIM(LTRIM(Upper(b.tw_Symbol))) MatId,
/*symbol uslugi lączenia blatów hpl*/
'084 00000000051' MatIdSet,
'0' DefaultJoin
FROM tw__Towar b
WHERE b.tw_Pole3 LIKE '%HPL%'
UNION ALL
SELECT
RTRIM(LTRIM(Upper(c.tw_Symbol))) MatId,
/*symbol złącza dla blatów hpl*/
'262.96.835(1)' MatIdSet,
'0' DefaultJoin
FROM tw__Towar c
WHERE c.tw_Pole3 LIKE '%HPL%'
UNION ALL
SELECT
RTRIM(LTRIM(Upper(d.tw_Symbol))) MatId,
/*ssymbol złącza dla blatów standardowych*/
'262.96.841(1)' MatIdSet,
'0' DefaultJoin
FROM tw__Towar d
WHERE SUBSTRING(d.tw_Pole3, 1, 2) = '#B' AND d.tw_Pole3 NOT LIKE '%HPL%'
UNION ALL
SELECT
RTRIM(LTRIM(Upper(e.tw_Symbol))) MatId,
/*symbol złącza dla blatów standardowych*/
'262.96.844(1)' MatIdSet,or
'0' DefaultJoin
FROM tw__Towar e
WHERE SUBSTRING(e.tw_Pole3, 1, 2) = '#B' AND e.tw_Pole3 NOT LIKE '%HPL%'
```

## 10. Ukrycie wymiarów na podglądzie blatów

```text
_SysHideDimensionsJoinLine=1
```

Dodać do ObjectsVariables

Można ją dodać do bazy wtedy globalnie lub do każdej płyty – wtedy na podstawie konkretnych płyt.

![Ukrycie wymiarów i zmienne obiektu](/img/objects-variables-hide-dimensions.png)
