---
sidebar_position: 4
title: "Powiązania usług z otworami"
description: "Zmienne OPER_* i powiązanie usług otworów z blatem."
---
Obecnie w systemie zostały predefiniowane cztery zmienne, które służą do powiązania wyceny usług związanych z otworami.

| Nazwa zmiennej | Otwór |
| --- | --- |
| OPER_CIRC_PCS_61 | otwór (koło/nawiert) liczony jako długość obwodu w metrach wg kryterium długości obwodu |
| OPER_CIRC_M_61 | otwór (koło/nawiert) liczony jako długość obwodu w metrach wg kryterium długości obwodu |
| OPER_DIA_PCS_61 | otwór (koło/nawiert) liczony jako szt. wg kryterium długości średnicy |
| OPER_CIRC_PCS_71 | otwór (prostokąt) liczony w sztukach wg kryterium długości obwodu |
| OPER_CIRC_M_71 | otwór (prostokąt) liczony w metrach wg kryterium długości obwodu |
| OPER_DIA_PCS_10 | otwór (nawiert) liczony w sztukach wg kryterium średnicy otworu |
| OPER_WIDTH_PCS_20 | nut liczony w szt wg kryterium szerokości |
| OPER_LENGTH_M_20 | nut liczony w metrach wg kryterium szerokości |

W systemie OM należy zdefiniować odpowiednie usługi, które można połączyć ze zmiennymi poprzez wpisanie symbolu lub zmiennej.

Połączenie usług z bazy zasobów z poszczególnymi otworami koło/prostokąt polega na powiązaniu tych usług z poszczególnymi blatami oraz poprawną definicję zakresów dla średnic (koło) lub obwodów (koło i prostokąt).

W kartotece blatu należy odpowiednio zdefiniować “Id operacji” oraz zakres w polu “Opcje 2”.

![Powiązane usługi otworów z blatem](/img/powiazane-uslugi-otworow.png)

![Id operacji OPER_PCS_71 i zakres w Opcje 2](/img/kartoteka-oper-pcs-71-opcje-2.png)
