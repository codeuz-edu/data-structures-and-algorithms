---
title: Tez saralaş
description: "Tez saralaş tayanç qiymat tanlaydi va elementlarni unga qarab ikki tomonga ajratadi. Har ikki qism alohida saralanadi. Yaxşi bölinişda jami vaqt O(n log n)."
---

# Tez saralaş

Tez saralaş tayanç qiymat tanlaydi va elementlarni unga qarab ikki tomonga ajratadi. Har ikki qism alohida saralanadi. Yaxşi bölinişda jami vaqt `O(n log n)`.

Avval [Rekursiya](/uz/recursion/recursion) va [Birlaştirib saralaş](/uz/sorting/merge-sort) darslarini öqing.

## Masala {#the-problem}

`<` bilan taqqoslanadigan elementlar röyxatini öz joyida ösiş tartibida saralang. Misol oldingi saralaş darslaridagi sakkizta elementdan foydalanadi.

## Tayanç qiymat {#the-idea}

Misolda tayanç qiymat 35. Undan kiçik qiymatlar çapga, kattaroq yoki teng qiymatlar öngga ötadi. Tayanç öz yakuniy örniga kelgaç, ikki tomonni şu qadam bilan saralaymiz.

<Diagram label="One level of quicksort" :width="640" :height="192" alt="The list 35, 80a, 15, 67, 80b, 89, 29, 24 with 35 as the pivot. After the partition, the items smaller than 35, which are 24, 15 and 29, are on its left, and 80b, 89, 80a and 67 are on its right. 35 is already in its final place. Recursive calls sort the two sides, giving 15, 24, 29, then 35, then 67, 80b, 80a, 89.">
 <text class="dg-note end" x="120" y="36">start</text>
 <DCells :x="148" :y="16" :w="44" :h="32" :values="[35, '80a', 15, 67, '80b', 89, 29, 24]" :states="{ 0: 'hit' }" />
 <text class="dg-note end" x="120" y="92">partition</text>
 <DCells :x="132" :y="72" :w="44" :h="32" :values="[24, 15, 29]" :states="['done', 'done', 'done']" />
 <DCells :x="280" :y="72" :w="44" :h="32" :values="[35]" :states="['hit']" />
 <DCells :x="340" :y="72" :w="44" :h="32" :values="['80b', 89, '80a', 67]" />
 <text class="dg-note" x="198" y="124">smaller than 35</text>
 <text class="dg-note" x="428" y="124">35 or larger</text>
 <text class="dg-note end" x="120" y="164">sort sides</text>
 <DCells :x="132" :y="144" :w="44" :h="32" :values="[15, 24, 29]" />
 <DCells :x="280" :y="144" :w="44" :h="32" :values="[35]" :states="['hit']" />
 <DCells :x="340" :y="144" :w="44" :h="32" :values="[67, '80b', '80a', 89]" />
 <text class="dg-note start" x="532" y="164">recursive calls</text>
</Diagram>

## Qismlarga ajratiş {#partition}

`i` tayançdan kiçik qismning oxiri. `j` tekşirilayotgan element. `items[j] < pivot` bölsa, `i` ni siljitib, ikki elementni almaştiring. Yuruv tugagaç, tayançni `i` dagi element bilan almaştiring.

<SortTrace mode="partition" />

```py
def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i
```

```py
def quicksort(items, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo >= hi:
        return
    p = partition(items, lo, hi)
    quicksort(items, lo, p - 1)
    quicksort(items, p + 1, hi)
```

## Eng yomon holat {#the-worst-case-sorted-input}

Saralangan röyxatda birinçi element tayanç bölsa, bir tomonga heç narsa tuşmaydi. Masala har safar bittaga kiçrayadi va iş `n + (n - 1) + …` ga yaqin, yaʼni `O(n²)`.

<SortTrace mode="sorted" />

## Tayançni tanlaş {#choosing-the-pivot}

Örta element saralangan kiruvda yaxşi tayanç. Birinçi, örta va oxirgi elementning medianasini yoki tasodifiy elementni ham tanlaş mumkin. Tasodifiy tayanç odatda tengroq bölinadi. Köp teng qiymat uçun uç qismli ajratiş foydali.

```py
pick = random.randint(lo, hi)
items[lo], items[pick] = items[pick], items[lo]
p = partition(items, lo, hi)
```

## Rekursiya çuqurligi {#recursion-depth}

Har ikkala yarimni rekursiv çaqiriş eng yomon holda `O(n)` stek xotirasi oladi. Faqat kiçikroq qismga rekursiv kirib, kattasini siklda davom ettirsak, çaqiruvlar steki `O(log n)` dan oşmaydi.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def depth(items, lo, hi, random_pivot):
    if lo >= hi:
        return 0
    if random_pivot:
        pick = random.randint(lo, hi)
        items[lo], items[pick] = items[pick], items[lo]
    p = partition(items, lo, hi)
    return 1 + max(depth(items, lo, p - 1, random_pivot), depth(items, p + 1, hi, random_pivot))

random.seed(1)
print('first item:', depth(list(range(500)), 0, 499, False))
print('random item:', depth(list(range(500)), 0, 499, True))
```

```py
def quicksort(items, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    while lo < hi:
        p = partition(items, lo, hi)
        if p - lo < hi - p:
            quicksort(items, lo, p - 1)
            lo = p + 1
        else:
            quicksort(items, p + 1, hi)
            hi = p - 1
```

## Töliq dastur {#full-implementation}

Dastur tasodifiy tayançni tanlaydi va kiçik qismga rekursiv kiradi. Misol allaqaçon tartiblangan 2 000 ta qiymatni ham saralaydi.

```python
import random

def partition(items, lo, hi):  # O(n)
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def quicksort(items, lo=0, hi=None):  # O(n log n) expected, O(n²) worst
    if hi is None:
        hi = len(items) - 1
    if lo >= hi:
        return
    pick = random.randint(lo, hi)
    items[lo], items[pick] = items[pick], items[lo]
    p = partition(items, lo, hi)
    quicksort(items, lo, p - 1)
    quicksort(items, p + 1, hi)

random.seed(7)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
quicksort(numbers)
print(numbers)

empty, one = [], [5]
quicksort(empty)
quicksort(one)
print(empty, one)

big = list(range(2000))
quicksort(big)
print(big == sorted(big))
```

## Tahlil {#analysis}

Tasodifiy tayançli ikki qismli tez saralaş farqli elementlarda kutilgan `O(n log n)` vaqt oladi. Barça element teng bölsa, bu böliş usuli `O(n²)` vaqt oladi. Almaştirişlar tufayli usul barqaror emas.

## Kerakli örindagi element {#quickselect}

Quickselect butun röyxatni saralamasdan, saralangan holatda `k` indeksida turadigan qiymatni topadi. Ajratişdan keyin faqat `k` joylaşgan tomonni qayta tekşiradi. Farqli qiymatlar va tasodifiy tayanç bilan kutilgan vaqt `O(n)`, eng yomon vaqt `O(n²)`.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def quickselect(items, k):
    if not 0 <= k < len(items):
        raise IndexError('index out of range')
    items = list(items)
    lo, hi = 0, len(items) - 1
    while True:
        pick = random.randint(lo, hi)
        items[lo], items[pick] = items[pick], items[lo]
        p = partition(items, lo, hi)
        if p == k:
            return items[p]
        if k < p:
            hi = p - 1
        else:
            lo = p + 1

random.seed(2)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(quickselect(numbers, 0))
print(quickselect(numbers, 3))
print(quickselect(numbers, 7))
print(numbers)
```

## Python tilida {#in-python}

`sorted` va `list.sort()` barqaror saralaydi. `min` va `max` eng kiçik yoki katta qiymatni bir yuruvda topadi. Kiçik `k` uçun `heapq.nsmallest` va `heapq.nlargest` dan foydalanamiz.

```python
import heapq
import statistics

numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(heapq.nsmallest(3, numbers))
print(heapq.nlargest(2, numbers))
print(sorted(numbers)[3])
print(statistics.median(numbers))
```

## Qayerda işlatiladi {#when-to-use}

Tayyor kutubxona yöq va massivni joyida saralaş kerak bölsa, tez saralaş mos kelişi mumkin. Barqarorlik yoki qatʼiy eng yomon vaqt kerak bölsa, birlaştirib saralaşni körib çiqing.

## Xulosa {#key-points}

Ajratiş tayançni bir yuruvda joyiga qöyadi. Qismlarning tengligi vaqtga, rekursiyani qaysi tomonda işlatiş esa stek xotirasiga taʼsir qiladi.

## Maşq {#exercise}

`smallest_k` eng kiçik `k` ta qiymatni ösiş tartibida qaytarsin. `0 <= k <= len(items)` deb oling. Asl röyxatni saqlang. Nusxada `k - 1` indeksini ajratiş bilan topib, faqat dastlabki `k` tasini saralang.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def smallest_k(items, k):
    pass

random.seed(1)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(smallest_k(numbers, 3))
print(smallest_k(numbers, 6))
print(smallest_k([5, 1, 4], 3))
print(smallest_k([5, 1, 4], 0))
print(numbers)
```

::: details Yeçim
`k = 0` bölsa, böş röyxat qaytaring. Aks holda quickselect bilan çegarani toping. Farqli qiymatlarda kutilgan vaqt `O(n + k log k)`. Nusxa `O(n)` joy oladi.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def smallest_k(items, k):
    if k == 0:
        return []
    items = list(items)
    lo, hi = 0, len(items) - 1
    while lo < hi:
        pick = random.randint(lo, hi)
        items[lo], items[pick] = items[pick], items[lo]
        p = partition(items, lo, hi)
        if p == k - 1:
            break
        if k - 1 < p:
            hi = p - 1
        else:
            lo = p + 1
    return sorted(items[:k])

random.seed(1)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(smallest_k(numbers, 3))
print(smallest_k(numbers, 6))
print(smallest_k([5, 1, 4], 3))
print(smallest_k([5, 1, 4], 0))
print(numbers)
```

:::
