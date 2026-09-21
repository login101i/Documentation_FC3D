---
sidebar_position: 1
title: "Parametry podstawowe"
description: "Pola kartoteki zasobu wymagane w konfiguratorze blatów."
---
## Konfiguracja bazy zasobów na potrzeby konfiguratora

## Opis zasobu oraz podstawowe parametry

W kartotekach zasobów, które mają być pobierane do list wyboru w konfiguratorze jak blaty należy ustawić/wybrać następujące pola:

| Nazwa pola | Opis | Ilość znaków | Zalecenia |
| --- | --- | --- | --- |
| Symbol<br/>Symbol | Unikalny symbol zasobu. | 50 | duże litery, cyfry, znaki specjalne “_-.,” |
| Symbol producenta<br/>SymbolProducer | Ciąg znaków zgodnych z symboliką stosowaną przez producenta.<br/>Na podstawie tego pola, w przypadku gdy pole “symbol” nie jest zgodne z nazewnictwem producenta możliwe jest automatyczne łączenie tekstur oraz widoków dla zasobu. | 80 | duże litery, cyfry, znaki specjalne “_-.,” |
| Opis<br/>Description | Opis zasobu. | 80 | To pole stosowane jest to wyswietlenia krótkiego i zwięzłego opisu dla klienta. |
| Opis alias<br/>DescriptionAlias | Opis zastępczy dla systemów online (zamiast pola “opis”). | 80 | To pole może być stosowane jako zastępczy opis dla klienta (bardziej zrozumiały, zwięzły, np. opis producenta). W przypadku gdy jest wypełnione, używany jest zamiast pola “opis”. |
| Grupa<br/>Podgrupa 1<br/>Podgrupa 2<br/>Groups<br/>SubGropus<br/>SubSubGroups | Podstawowe pola grupowania zasobów używane do tworzenia filtrów, drzewek wyboru itd. | 60 | Prawidłowo wypełnione pola grupowania ułatwiają wyszukiwanie, filtrowanie oraz segregowanie zasobów na listach wyborów. Sugerujemy, aby pole “grupa” było podstawowym polem dla podziału zasobów, np. wg nazw producentów. Kolejne pola “podgrupa 1” oraz “podgrupa 2” mogą służyć do filtrowania list niższego poziomu. |
| Typy zasobów<br/>MatType | Selektor zasobów | C30 | Wybrać 4 (ewentualnie dodatkowo 200) |
| Jednostka miary<br/>Unit | Podstawowa jednostka miary (szt.) | 5 |   |
| Długość<br/>Length | Długość blatu | N | Domyślne wartości dla blatu wg. producenta. |
| Szerokość<br/>Width | Szerokość blatu | N | Domyślne wartości dla blatu wg. producenta. |
| Grubość<br/>Thicknes | Grubość blatu | N | Domyślne wartości dla blatu wg. producenta. |
