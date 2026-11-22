---
title: Oddiy saralaş algoritmlari
description: "Mahsulotlar röyxatini narx böyiça, öquvçilar röyxatini esa natija böyiça saralaş mumkin. Bu darsda bitta röyxatni uç usulda saralaymiz va har usul qancha taqqoslaş hamda siljiş bajarişini soliştiramiz."
---

# Oddiy saralaş algoritmlari

Mahsulotlar röyxatini narx böyiça, öquvçilar röyxatini esa natija böyiça saralaş mumkin. Bu darsda bitta röyxatni uç usulda saralaymiz va har usul qancha taqqoslaş hamda siljiş bajarişini soliştiramiz.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) va [Massiv](/uz/arrays/array) darslarini öqing.

## Masala {#the-problem}

Taqqoslaş mumkin bölgan `n` ta element oling. Funksiya şu röyxatni ösiş tartibida qayta joylasin va `None` qaytarsin. Misolda ikki 80 ga dastlabki örnini kuzatiş uçun `80a` va `80b` deb belgi qöyilgan.

```py
[35, 80, 15, 67, 80, 89, 29, 24]
```

## Saralaş xususiyatlari {#words-for-describing-a-sort}

Barqaror saralaşda kaliti teng elementlar özaro tartibini saqlaydi. Masalan, 80a avval kelgan bölsa, natijada ham 80b dan oldinda turadi. Öz joyida saralaş berilgan röyxatning özini özgartiradi.

## Tanlab saralaş {#selection-sort}

Saralanmagan qismning eng kiçik elementini topib, uni şu qismning birinçi elementi bilan almaştiring. Çegarani bir örin ötkazib, takrorlang. Har yuruv keyingi eng kiçik elementni joyiga qöyadi.

<SortTrace mode="selection" />

```py
def selection_sort(items):
    n = len(items)
    for i in range(n - 1):
        smallest = i
        for j in range(i + 1, n):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
```

## Joyiga qöşib saralaş {#insertion-sort}

Çapdagi qism har doim saralangan. Navbatdagi qiymatni eslab qoling. Undan katta elementlarni öngga siljitib, qiymatni açilgan katakka yozing. Teng elementdan ötmasak, tartib barqaror qoladi.

<SortTrace mode="insertion" />

```py
def insertion_sort(items):
    for i in range(1, len(items)):
        value = items[i]
        j = i
        while j > 0 and items[j - 1] > value:
            items[j] = items[j - 1]
            j -= 1
        items[j] = value
```

### Deyarli saralangan röyxat {#fast-on-nearly-sorted-input}

Katta element kiçik elementdan oldinda turgan har bir juftlik inversiya deyiladi. Joyiga qöşib saralaş har inversiya uçun bitta siljiş bajaradi. Inversiyalar soni `k` bölsa, vaqt `O(n + k)`.

## Pufakçali saralaş {#bubble-sort-for-contrast}

Yonma-yon elementlar teskari tartibda bölsa, örnini almaştiring. Bir yuruv eng katta elementni oxiriga olib boradi. Almaşuv bölmagan yuruvda saralaş tugaydi.

```py
def bubble_sort(items):
    n = len(items)
    for end in range(n - 1, 0, -1):
        swapped = False
        for j in range(end):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            return
```

## Töliq dastur {#full-implementation}

Dastur bir xil röyxatda uç usulni sinaydi. Söng taqqoslaşlarni sanaydigan obyektlar yordamida saralangan, deyarli saralangan, aralaş va teskari röyxatlarni soliştiradi.

```python
import random

def selection_sort(items):  # O(n²) on every input
    n = len(items)
    for i in range(n - 1):
        smallest = i
        for j in range(i + 1, n):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]

def insertion_sort(items):  # O(n²), O(n) on sorted input
    for i in range(1, len(items)):
        value = items[i]
        j = i
        while j > 0 and items[j - 1] > value:
            items[j] = items[j - 1]
            j -= 1
        items[j] = value

def bubble_sort(items):  # O(n²), O(n) on sorted input
    n = len(items)
    for end in range(n - 1, 0, -1):
        swapped = False
        for j in range(end):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            return

class Counted:
    comparisons = 0

    def __init__(self, value):
        self.value = value

    def __lt__(self, other):
        Counted.comparisons += 1
        return self.value < other.value

    def __gt__(self, other):
        Counted.comparisons += 1
        return self.value > other.value

def count_comparisons(sort, values):
    items = [Counted(value) for value in values]
    Counted.comparisons = 0
    sort(items)
    return Counted.comparisons

sorts = [selection_sort, insertion_sort, bubble_sort]
for sort in sorts:
    items = [35, 80, 15, 67, 80, 89, 29, 24]
    sort(items)
    print(f'{sort.__name__:15} {items}')

n = 100
nearly = list(range(n))
for i in range(0, n, 10):
    nearly[i], nearly[i + 1] = nearly[i + 1], nearly[i]
random.seed(1)
shuffled = random.sample(range(n), n)
inputs = [list(range(n)), nearly, shuffled, list(range(n, 0, -1))]
print('\ncomparisons: sorted, nearly sorted, shuffled, reversed')
for sort in sorts:
    print(f'{sort.__name__:15}', [count_comparisons(sort, values) for values in inputs])
```

## Tahlil {#analysis}

Tanlab saralaş har kiruvda `n(n - 1) / 2` ta taqqoslaş bajaradi, lekin köpi bilan `n - 1` marta almaştiradi. Joyiga qöşib va pufakçali saralaş eng yaxşi holatda `O(n)`, eng yomon holatda `O(n²)`. Bu dasturlarning qöşimça xotirasi `O(1)`.

## Python tilida {#in-python}

`sorted(items)` yangi röyxat qaytaradi, `items.sort()` mavjud röyxatni özgartiradi. Ikkalasi barqaror. [Birlaştirib saralaş](/uz/sorting/merge-sort#in-python) darsida `key=` va `reverse=` misollari bor.

```python
import bisect

scores = []
for score in [35, 80, 15, 67, 80, 89, 29, 24]:
    bisect.insort(scores, score)
    print(scores)
```

## Qayerda işlatiladi {#when-to-use}

Joyiga qöşib saralaş qisqa yoki deyarli saralangan röyxatlarga mos. Tanlab saralaşda yozişlar kam. Odatdagi Python dasturida tayyor saralaş funksiyalari qöl keladi.

## Xulosa {#key-points}

Saralaşni taqqoslaş, siljiş va qöşimça xotira böyiça baholang. Barqarorlik bir xil kalitli turli yozuvlarning tartibini saqlaydi.

## Maşq {#exercise}

`sort_by_age` `(name, age)` juftlarini yoş böyiça ösiş tartibida joyida saralasin. Joyiga qöşib saralaşdan foydalaning. Bir xil yoşdagilar dastlabki tartibida qolsin.

```python
def sort_by_age(people):
    pass

people = [('Ana', 31), ('Ben', 25), ('Cleo', 31), ('Dev', 19), ('Eli', 25)]
sort_by_age(people)
print(people)

nobody = []
sort_by_age(nobody)
print(nobody)
```

::: details Yeçim
Çap tomondagi odamning yoşi kattaroq bölganida uni suring. Yoşlar teng bölsa, yuruvni töxtating. Eng yomon vaqt `O(n²)`, saralangan kiruvda `O(n)`, qöşimça xotira `O(1)`.

```python
def sort_by_age(people):
    for i in range(1, len(people)):
        person = people[i]
        j = i
        while j > 0 and people[j - 1][1] > person[1]:
            people[j] = people[j - 1]
            j -= 1
        people[j] = person

people = [('Ana', 31), ('Ben', 25), ('Cleo', 31), ('Dev', 19), ('Eli', 25)]
sort_by_age(people)
print(people)

nobody = []
sort_by_age(nobody)
print(nobody)
```

:::
