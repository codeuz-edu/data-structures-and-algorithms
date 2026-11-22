---
title: Tuzilmani tanlaş
description: "Tuzilmani tanlaşdan oldin dastur maʼlumot bilan nima qilişini yozib oling. Qidiruv, qöşiş va öçiriş tezligi turli tuzilmalarda turliça."
---

# Tuzilmani tanlaş

Tuzilmani tanlaşdan oldin dastur maʼlumot bilan nima qilişini yozib oling. Qidiruv, qöşiş va öçiriş tezligi turli tuzilmalarda turliça.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) darsini öqing.

## Kerakli amallardan boşlang {#start-from-the-operations-you-need}

Eng köp takrorlanadigan amallarni belgilang. Keyin maʼlumot hajmi, vaqt va xotira çegaralarini hisobga oling. Kam bajariladigan qimmat amal baʼzan umumiy işlaşga oz taʼsir qiladi.

## Tuzilmalar xarajati {#costs-by-structure}

`n` elementlar soni, `m` söz uzunligi. Xeş jadvali uçun örtaça vaqt, dinamik massivning oxiriga qöşiş uçun amortizatsiyalangan vaqt berilgan.

| Kerakli amal | Tuzilma | Vaqt |
| --- | --- | --- |
| Indeks böyiça öqiş | `list` | `O(1)` |
| Kalitni tekşiriş | `dict` yoki `set` | Örtaça `O(1)` |
| Ikkala uçdan qöşiş yoki oliş | `deque` | `O(1)` |
| Eng kiçik qiymatni oliş | Uyum | Amortizatsiya bilan `O(log n)` |
| Tartibli qidiruv va yangilaş | AVL daraxti | `O(log n)` |
| Prefiksni topiş | Prefiks daraxti | Örtaça `O(m)` |

## Qadamlarni soliştiriş {#counting-the-difference}

Dastur avval oddiy röyxatdan, keyin uyumdan eng kiçik elementni takroran oladi. Röyxatda `min` va `remove` qolgan elementlarni qayta tekşiradi. Uyum ildizdan boşlab, faqat bir yölni tuzatadi.

```python
import heapq

class Counted:
    comparisons = 0

    def __init__(self, value):
        self.value = value

    def __lt__(self, other):
        Counted.comparisons += 1
        return self.value < other.value

def smallest_first_list(items):
    items = list(items)
    order = []
    while items:
        smallest = min(items)
        items.remove(smallest)
        order.append(smallest.value)
    return order

def smallest_first_heap(items):
    items = list(items)
    heapq.heapify(items)
    order = []
    while items:
        order.append(heapq.heappop(items).value)
    return order

for n in [1000, 2000]:
    values = [Counted(i * 37 % n) for i in range(n)]
    Counted.comparisons = 0
    smallest_first_list(values)
    with_list = Counted.comparisons
    Counted.comparisons = 0
    smallest_first_heap(values)
    with_heap = Counted.comparisons
    print(n, 'items:', with_list, 'with a list,', with_heap, 'with a heap')
```

## Pythonning tayyor tuzilmalari {#which-built-in-to-use}

Pozitsiya uçun `list`, kalit uçun `dict`, tegişlilik uçun `set`, navbat uçun `deque`, ustuvor navbat uçun `heapq`. `dict` qöşiliş tartibini saqlaydi. `OrderedDict` kalitni bir uçdan ikkinçisiga köçira oladi.

## Vazifa böyiça tanlaş {#i-need-to}

Har bir vazifada qaysi sörov takrorlanişini aniqlang.

### Eng kiçik qiymatni takroran oliş {#find-the-smallest-item-again-and-again}

Qiymatlar kelib tursa, [uyum](/uz/trees/heap) eng kiçigini ildizda saqlaydi. Barça qiymatlar oldindan tayyor bölsa, bir marta saralab, natijani ketma-ket öqiş mumkin.

### Takroriy qiymatni aniqlaş {#check-whether-i-have-already-seen-something}

`set` ilgari körilgan qiymatlarni saqlaydi. Xeşlaş va tenglik tekşiruvi doimiy bölsa, `x in seen` örtaça `O(1)`. Röyxatda şu tekşiruv har safar `O(n)) ga yetişi mumkin.

### Qöşiş paytida tartibni saqlaş {#keep-items-sorted-while-inserting}

`bisect.insort` örinni logarifmik vaqtda topadi. Röyxatda unga joy oçiş qiymatlarni siljitadi. Yirik töplam tez-tez özgarib tursa, [AVL daraxtini](/uz/trees/avl-tree) körib çiqing.

### Yozilgan harflarga qarab söz taklif qiliş {#suggest-words-as-the-user-types}

[Prefiks daraxti](/uz/trees/trie) yozilgan harfga qarab bitta qadam yuradi. Sözlar röyxati kam özgarsa, saralab, prefiksga mos oraliqni `bisect_left` bilan qidiring.

### Eng qisqa yölni topiş {#find-the-shortest-route}

Vaznsiz grafda [BFS](/uz/graphs/graph#breadth-first-search), manfiy bölmagan turli vaznlarda [Dijkstra algoritmi](/uz/graphs/shortest-paths) kerak. Vazn manfiy bölsa, Bellman–Ford ni körib çiqing.

### Boğlangan elementlarni guruhlaş {#group-items-that-are-connected}

Qirralar birin-ketin kelganda [union-find](/uz/graphs/union-find) guruhlarni birlaştiradi. Tayyor yönalişsiz grafdagi barça qismlarni BFS yoki DFS bilan ham topiş mumkin.

### Oxirgi amalni bekor qiliş {#undo-the-last-action}

Har yangi amalni [stekka](/uz/stacks-queues/stack) qöying. Bekor qilişda eng oxirgisi olinadi. Python röyxatidagi `append` va `pop()` yetarli.

### Sörovlarni kelgan tartibida bajariş {#handle-requests-in-the-order-they-arrived}

`collections.deque` oxiriga `append` bilan qöşib, boşidan `popleft` bilan oling. Bu [navbat](/uz/stacks-queues/queue) tartibini beradi.

## Tanlov jadvali {#a-decision-chart}

Avval tez-tez işlatiladigan amalni toping. Qiymat böyiça aniqlik kerak bölsa xeş jadvalini, tartiblangan qidiruv kerak bölsa saralangan röyxat yoki daraxtni, eng kiçik qiymat takroran olinsa uyumni köring. Aloqalar ustida işlasangiz, graf amallarini tanlang.

<Diagram label="Qaysi tuzilmani tanlaymiz?" :width="680" :height="360" alt="Eng kiçik qiymat takroran olinsa, uyumni tanlang. Tartib yoki oraliq kerak bölsa, tartiblangan röyxat yoki AVL daraxtini tanlang. Kalit böyiça qidirişga xeş jadvali mos. Faqat uçlardagi amallarga stek yoki navbat, indeks böyiça işlaşga massiv mos.">
 <DBox :x="20" :y="20" :w="300" :h="40" text="Eng kiçik qiymat tez-tez olinadimi?" small />
 <DBox :x="20" :y="90" :w="300" :h="40" text="Tartib yoki oraliq kerakmi?" small />
 <DBox :x="20" :y="160" :w="300" :h="40" text="Kalit böyiça qidiriladimi?" small />
 <DBox :x="20" :y="230" :w="300" :h="40" text="Amallar faqat uçlardami?" small />
 <DBox :x="390" :y="20" :w="270" :h="40" text="Uyum · heapq" state="hit" small />
 <DBox :x="390" :y="90" :w="270" :h="40" text="Saralangan röyxat yoki AVL daraxti" state="hit" small />
 <DBox :x="390" :y="160" :w="270" :h="40" text="Xeş jadvali · dict yoki set" state="hit" small />
 <DBox :x="390" :y="230" :w="270" :h="40" text="Stek yoki navbat · list yoki deque" state="hit" small />
 <DBox :x="390" :y="300" :w="270" :h="40" text="Massiv · list" state="hit" small />
 <DArrow v-for="y in [20, 90, 160, 230]" :key="y" :from="[320, y + 20]" :to="[390, y + 20]" kind="accent" />
 <text v-for="y in [20, 90, 160, 230]" :key="y" class="dg-note is-accent" x="355" :y="y + 13">ha</text>
 <DArrow v-for="y in [20, 90, 160]" :key="y" :from="[170, y + 40]" :to="[170, y + 70]" />
 <text v-for="y in [20, 90, 160]" :key="y" class="dg-note start" x="178" :y="y + 59">yöq</text>
 <DArrow :from="[170, 270]" :via="[[170, 320]]" :to="[390, 320]" />
 <text class="dg-note start" x="178" y="291">yöq</text>
</Diagram>

## Xulosa {#key-points}

Tanlov amallarning qaysi biri tez-tez bajarilişiga boğliq. Jadvaldagi örtaça, amortizatsiyalangan va eng yomon vaqtni farqlang. Tayyor Python tuzilmasi yetarli bölsa, undan foydalaning.
