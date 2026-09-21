---
sidebar_position: 2
title: "Oklejanie niestandardowe"
description: "Zaokrąglenie krawędzi, docięcie i kontrola wymiarów."
---
| Nazwa pola | Opis | Zalecenia |
| --- | --- | --- |
| Oznacz zaokrąglenie krawędzi blatu<br/>EdgeRoundLeft<br/>EdgeRoundTop<br/>EdgeRoundRight<br/>EdgeRoundBottom | Dla blatów, które mają mieć fabrycznie wykończoną krawędź należy zaznaczyć odpowiedni bok wg poniższego schematu.<br/>![Oznacz zaokrąglenie krawędzi blatu](/img/oklejanie-oznacz-zaokraglenie.png)<br/>Reprezentacja obiektu w przestrzeni 3D.<br/>![Reprezentacja obiektu w przestrzeni 3D](/img/oklejanie-reprezentacja-3d.png) | ![Krawędź fabrycznie wykończona](/img/oklejanie-krawedz-fabryczna.png) |
| Docięcie zaokrąglonej krawędzi<br/>EdgeRoundTrim | W przypadku gdy krawędź zaokrąglona/fabryczna musi być docięta i oklejona należy podać wymiar docięcia, czyli zmniejszenia wymiaru o wartość niwelującą to zaokrąglenie. | ![Docięcie zaokrąglonej krawędzi](/img/oklejanie-dociecie-krawedzi.png) |
| Oklejanie krawędzi<br/>EdgesType | DEFAULT - domyślnie<br/>BLOCK EDGING - blokowanie wyboru oklejania |   |
| Kontrola wymiarów<br/>SizeControlType | NONE - brak kontroli<br/>CONTROL_SIZE - kontrola wymiarów maksymalnych z poziomu konfiguratora |   |
