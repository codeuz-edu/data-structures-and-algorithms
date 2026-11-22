---
title: Birlaştirib saralaş
description: "Birlaştirib saralaş röyxatni ikki qismga böladi. Har qism alohida saralanadi, söng ikkita tartiblangan qismdan bitta röyxat tuziladi."
---

# Birlaştirib saralaş

Birlaştirib saralaş röyxatni ikki qismga böladi. Har qism alohida saralanadi, söng ikkita tartiblangan qismdan bitta röyxat tuziladi.

Avval [Rekursiya](/uz/recursion/recursion) va [Oddiy saralaş algoritmlari](/uz/sorting/simple-sorts) darslarini öqing.

## Masala {#the-problem}

Taqqoslanadigan elementlar röyxatidan ösiş tartibida yangi röyxat yasang. Asl röyxat saqlanadi.

## Böliş va birlaştiriş {#the-idea}

Röyxatda nol yoki bitta element bölsa, u allaqaçon saralangan. Aks holda uni ikkiga böling. Har bir qismini rekursiv saralang va ikki javobni birlaştiring.

<Diagram label="One level of merge sort" :width="640" :height="208" alt="The list 35, 80a, 15, 67, 80b, 89, 29, 24 is split into two halves: 35, 80a, 15, 67 and 80b, 89, 29, 24. Recursive calls sort each half, giving 15, 35, 67, 80a and 24, 29, 80b, 89. Merging the two sorted halves gives 15, 24, 29, 35, 67, 80a, 80b, 89.">
 <text class="dg-note end" x="120" y="36">start</text>
 <DCells :x="144" :y="16" :w="44" :h="32" :values="[35, '80a', 15, 67, '80b', 89, 29, 24]" />
 <text class="dg-note end" x="120" y="84">split</text>
 <DCells :x="132" :y="64" :w="44" :h="32" :values="[35, '80a', 15, 67]" />
 <DCells :x="332" :y="64" :w="44" :h="32" :values="['80b', 89, 29, 24]" />
 <text class="dg-note end" x="120" y="132">sort halves</text>
 <DCells :x="132" :y="112" :w="44" :h="32" :values="[15, 35, 67, '80a']" :states="['done', 'done', 'done', 'done']" />
 <DCells :x="332" :y="112" :w="44" :h="32" :values="[24, 29, '80b', 89]" :states="['done', 'done', 'done', 'done']" />
 <text class="dg-note start" x="524" y="132">recursive calls</text>
 <text class="dg-note end" x="120" y="180">merge</text>
 <DCells :x="144" :y="160" :w="44" :h="32" :values="[15, 24, 29, 35, 67, '80a', '80b', 89]" :states="['new', 'new', 'new', 'new', 'new', 'new', 'new', 'new']" />
</Diagram>

## Tartiblangan ikki röyxatni birlaştiriş {#merging-two-sorted-lists}

Ikkala röyxatning öqilmagan birinçi qiymatlarini taqqoslang. Kiçigini natijaga yozing va şu tomondagi indeksni siljiting. Bir röyxat tugasa, ikkinçisining qolgan qismini natijaga qöşing.

<Diagram label="Merging, halfway through" :width="600" :height="184" alt="Merging 15, 35, 67, 80a with 24, 29, 80b, 89. 15, 35 and 67 have already been taken from the left list, and 24 and 29 from the right list, so the result holds 15, 24, 29, 35, 67. The fronts of the two lists are now 80a and 80b, which are equal. The rule takes the left one, so 80a goes into the result next.">
 <text class="dg-note end" x="88" y="65">left</text>
 <DCells :x="100" :y="44" :w="44" :h="34" :values="[15, 35, 67, '80a']" :states="['ghost', 'ghost', 'ghost', 'hit']" :marks="{ 3: 'left[i]' }" />
 <text class="dg-note end" x="368" y="65">right</text>
 <DCells :x="380" :y="44" :w="44" :h="34" :values="[24, 29, '80b', 89]" :states="['ghost', 'ghost', 'hit', '']" :marks="{ 2: 'right[j]' }" />
 <DArrow :from="[254, 80]" :via="[[254, 104], [342, 104]]" :to="[342, 130]" kind="accent" />
 <text class="dg-note is-accent start" x="354" y="122">80a ≤ 80b: take the left one</text>
 <text class="dg-note end" x="88" y="153">result</text>
 <DCells :x="100" :y="132" :w="44" :h="34" :values="[15, 24, 29, 35, 67, null, null, null]" :states="['', '', '', '', '', 'ghost', 'ghost', 'ghost']" />
</Diagram>

```py
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### Tenglikda çapdan oliş {#why-keeps-it-stable}

Çap röyxatdagi 80a dastlab öngdagi 80b dan oldin kelgan. `<=` tufayli tenglikda 80a olinadi. Şu tanlov har bir birlaştirişda teng qiymatlar tartibini saqlaydi.

## Butun jarayon {#the-whole-run}

Sakkizta element avval 4, 2 va 1 tadan bölakka ajraladi. Birlaştiriş teskari yönalişda yuradi va oxirida bitta saralangan röyxat hosil böladi.

<SortMergeTree />

```py
def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)
```

## Töliq dastur {#full-implementation}

`merge_sort` ikkita saralangan yarimni `merge` ga beradi. Kiçik misolda ikki 80 dastlabki tartibida qoladi.

```python
def merge(left, right):  # O(n)
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(items):  # O(n log n)
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)

numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(merge_sort(numbers))
print(numbers)
print(merge_sort([]), merge_sort([7]))
print(merge_sort(['pear', 'fig', 'apple', 'kiwi']))
```

## Tahlil {#analysis}

Böliş `O(log n)` sath hosil qiladi. Har sathda jami `n` ta element birlaştiriladi. Bu dastur `Θ(n log n)` vaqt, `O(n)` qöşimça xotira va `O(log n)` rekursiv çuqurlik işlatadi.

## Python tilida {#in-python}

`sorted` ixtiyoriy iteratsiyalanadigan obyektni öqib, yangi röyxat yasaydi. `list.sort()` röyxatni joyida saralaydi. `key=` saralaş kalitini belgilaydi, `reverse=True` tartibni teskarilaydi. Pythonning barqaror saralaşi ketma-ket tartiblangan qismlardan ham foydalanadi.

```python
words = ['pear', 'fig', 'apple', 'kiwi', 'banana']
print(sorted(words))
print(sorted(words, key=len))
print(sorted(words, key=len, reverse=True))

words.sort()
print(words)
```

```python
people = [('Cleo', 31), ('Ben', 25), ('Ana', 31), ('Eli', 25), ('Dev', 19)]

print(sorted(people, key=lambda person: (person[1], person[0])))

by_name = sorted(people, key=lambda person: person[0])
print(sorted(by_name, key=lambda person: person[1], reverse=True))
```

```python
import random

class Counted:
    comparisons = 0

    def __init__(self, value):
        self.value = value

    def __lt__(self, other):
        Counted.comparisons += 1
        return self.value < other.value

def count_comparisons(values):
    Counted.comparisons = 0
    sorted(Counted(value) for value in values)
    return Counted.comparisons

random.seed(1)
shuffled = random.sample(range(1000), 1000)
print('sorted  ', count_comparisons(range(1000)))
print('reversed', count_comparisons(range(1000, 0, -1)))
print('shuffled', count_comparisons(shuffled))
```

## Qayerda işlatiladi {#when-to-use}

Barqarorlik va eng yomon holatda `O(n log n)` vaqt kerak bölsa, bu usul mos. Boğlangan röyxatlarda tugunlarni qayta boğlaş kifoya. Xotiraga siğmaydigan fayllarni ham saralangan qismlarga ajratib birlaştiriş mumkin.

## Xulosa {#key-points}

Saralangan ikki röyxatning faqat boşlarini soliştirib boramiz. Sathlar logarifmik, har sathdagi iş çiziqli. Teng qiymatda çapdan oliş barqarorlikni saqlaydi.

## Maşq {#exercise}

`count_inversions` kattasi oldin joylaşgan qiymatlar juftligini sanasin. Teng elementlarni sanamang. Birlaştirib saralaşni özgartirib, vaqtni `O(n log n)` qiling.

```python
def count_inversions(items):
    pass

print(count_inversions([35, 80, 15, 67, 80, 89, 29, 24]))
print(count_inversions([15, 24, 29, 35]))
print(count_inversions([4, 3, 2, 1]))
print(count_inversions([]))
```

::: details Yeçim
`sort_and_count` saralangan qismni va uning inversiyalarini qaytaradi. Öngdagi qiymat çapdagidan oldin olinsa, çapda qolgan `len(left) - i` ta qiymatning har biri inversiya hosil qiladi. Ikki yarimning hisobiga şu juftlarni qöşing.

```python
def sort_and_count(items):
    if len(items) <= 1:
        return list(items), 0
    mid = len(items) // 2
    left, left_count = sort_and_count(items[:mid])
    right, right_count = sort_and_count(items[mid:])
    result = []
    count = left_count + right_count
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            count += len(left) - i
    result.extend(left[i:])
    result.extend(right[j:])
    return result, count

def count_inversions(items):
    return sort_and_count(items)[1]

print(count_inversions([35, 80, 15, 67, 80, 89, 29, 24]))
print(count_inversions([15, 24, 29, 35]))
print(count_inversions([4, 3, 2, 1]))
print(count_inversions([]))
```

:::
