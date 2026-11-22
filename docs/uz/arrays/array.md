---
title: Massiv
description: "Massiv teng hajmli kataklarni xotirada yonma-yon saqlaydi. Har bir katakning örni indeks bilan belgilanadi va indekslar noldan boşlanadi."
---

# Massiv

Massiv teng hajmli kataklarni xotirada yonma-yon saqlaydi. Har bir katakning örni indeks bilan belgilanadi va indekslar noldan boşlanadi.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) va [Havolalar va xotira](/uz/foundations/references) darslarini öqing.

## Amallar {#interface}

Bu darsdagi `Array` klassi oldindan belgilangan siğimga ega. `a[i]` ni öqiş va unga yoziş `O(1)`. `insert`, `delete` va `find` eng yomon holatda `O(n)`. Siğimda böş joy bölsa, oxiriga qöşiş `O(1)`.

## Xotiradagi joylaşuv {#layout}

Elementlar nolinçi katakdan boşlab ketma-ket joylaşadi. Ölçam saqlangan elementlar soni, siğim esa ajratilgan kataklar soni. Misoldagi Python röyxati şu kataklar uçun xotira ajratadi.

<Diagram label="Massivning tuzilişi" :width="520" :height="116" alt="Oltita katak 12, 7, 3, 9, 5 va 8 ni saqlaydi. Indekslar 0 dan 5 gaça. Strelka items[3] katagini körsatadi.">
 <DCells :x="116" :y="44" :values="[12, 7, 3, 9, 5, 8]" indices :marks="{ 3: 'items[3]' }" :states="{ 3: 'hit' }" />
</Diagram>

## Öqiş va yoziş {#read-and-write}

Avval `0 <= index < size` şarti tekşiriladi. Manzilni topiş uçun boşlanğiş manzilga indeks bilan katak hajmining köpaytmasi qöşiladi. Har qanday indeksga bir xil sondagi amal bilan boriladi.

<Diagram label="items[3] ni öqiş" cost="O(1)" :width="520" :height="160" alt="Boşlanğiş manzil 1000, har katak 8 bayt. 3-indeks manzili 1000 + 3 × 8 = 1024.">
 <DCells :x="116" :y="44" :values="[12, 7, 3, 9, 5, 8]" indices :marks="{ 3: 'items[3]' }" :states="{ 3: 'hit' }" />
 <text class="dg-note end" x="104" y="101">index</text>
 <text class="dg-note end" x="104" y="119">address</text>
 <text v-for="i in [0, 1, 2, 3, 4, 5]" :key="i" class="dg-index" :x="140 + 48 * i" y="115">{{ 1000 + 8 * i }}</text>
 <text class="dg-note is-accent" x="260" y="148">boş manzil + indeks × katak hajmi = 1000 + 3 × 8 = 1024</text>
</Diagram>

```py
def get(self, index):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    return self.items[index]

def set(self, index, value):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    self.items[index] = value
```

```python
items = [12, 7, 3, 9, 5, 8]
print(items[3])
items[3] = 10
print(items)
print(items[-1])
```

## Joyiga qöşiş {#insert}

`0 <= index <= size` bölişi va kamida bitta böş katak qolişi kerak. Oxirgi elementdan boşlab, oraliqdagi elementlarni bittadan öngga suring. Açilgan katakka yangi qiymatni yozing va ölçamni bittaga oşiring.

<Diagram label="2-indeksga 4 ni qöşiş" cost="O(n)" :width="520" :height="180" alt="3, 9 va 5 bir katakdan öngga siljiydi. Açilgan 2-indeksga 4 yoziladi.">
 <text class="dg-note end" x="104" y="48">oldin</text>
 <DCells :x="116" :y="24" :values="[12, 7, 3, 9, 5, null]" :states="{ 5: 'ghost' }" />
 <DArrow v-for="i in [2, 3, 4]" :key="i" :from="[140 + 48 * i, 66]" :to="[188 + 48 * i, 113]" kind="accent" />
 <text class="dg-note end" x="104" y="140">keyin</text>
 <DCells :x="116" :y="116" :values="[12, 7, 4, 3, 9, 5]" :states="{ 2: 'new' }" indices />
</Diagram>

```py
def insert(self, index, value):
    if not 0 <= index <= self.size:
        raise IndexError('index out of range')
    if self.size == len(self.items):
        raise OverflowError('array is full')
    for i in range(self.size, index, -1):
        self.items[i] = self.items[i - 1]
    self.items[index] = value
    self.size += 1
```

## Öçiriş {#delete}

Indeksni tekşiring. Undan keyingi elementlarni bir katakdan çapga suring. Oxirgi katakni `None` bilan tozalang va ölçamni kamaytiring. Siljişlar soni öçirilgan öringa boğliq.

<Diagram label="1-indeksni öçiriş" cost="O(n)" :width="520" :height="180" alt="3, 9 va 5 bir katakdan çapga siljiydi. Oxirgi katak böş qoladi.">
 <text class="dg-note end" x="104" y="48">oldin</text>
 <DCells :x="116" :y="24" :values="[12, 7, 3, 9, 5, null]" :states="{ 1: 'ghost', 5: 'ghost' }" />
 <DArrow v-for="i in [2, 3, 4]" :key="i" :from="[140 + 48 * i, 66]" :to="[92 + 48 * i, 113]" kind="accent" />
 <text class="dg-note end" x="104" y="140">keyin</text>
 <DCells :x="116" :y="116" :values="[12, 3, 9, 5, null, null]" :states="{ 4: 'ghost', 5: 'ghost' }" indices />
</Diagram>

```py
def delete(self, index):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    for i in range(index, self.size - 1):
        self.items[i] = self.items[i + 1]
    self.items[self.size - 1] = None
    self.size -= 1
```

## Qidiriş {#search}

Tartiblanmagan massivda `find` elementlarni nolinçi indeksdan boşlab ketma-ket tekşiradi. Birinçi mos indeks qaytariladi. Qiymat topilmasa `-1` qaytadi. Bu çiziqli qidiruv.

<Diagram label="9 ni topiş" cost="O(n)" :width="520" :height="140" alt="Qidiruv 12, 7 va 3 ni tekşirib ötadi. 9 3-indeksda topiladi.">
 <DCells :x="116" :y="44" :values="[12, 7, 3, 9, 5, 8]" indices :marks="{ 3: 'found' }" :states="{ 0: 'done', 1: 'done', 2: 'done', 3: 'hit', 4: 'muted', 5: 'muted' }" />
 <text class="dg-note end" x="104" y="124">equal to 9?</text>
 <text v-for="i in [0, 1, 2]" :key="i" class="dg-note" :x="140 + 48 * i" y="124">no</text>
 <text class="dg-note is-accent" x="284" y="124">yes</text>
</Diagram>

```py
def find(self, value):
    for i in range(self.size):
        if self.items[i] == value:
            return i
    return -1
```

## Töliq dastur {#full-implementation}

`__len__` elementlar sonini beradi, `__iter__` ularni tartib bilan çiqaradi. Dastur indeks xatolarini tekşiradi va massiv tölganida yangi elementni qabul qilmaydi.

```python
class Array:
    def __init__(self, capacity):  # O(capacity)
        self.items = [None] * capacity
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def __iter__(self):  # O(n)
        for i in range(self.size):
            yield self.items[i]

    def get(self, index):  # O(1)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        return self.items[index]

    def set(self, index, value):  # O(1)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        self.items[index] = value

    def insert(self, index, value):  # O(n)
        if not 0 <= index <= self.size:
            raise IndexError('index out of range')
        if self.size == len(self.items):
            raise OverflowError('array is full')
        for i in range(self.size, index, -1):
            self.items[i] = self.items[i - 1]
        self.items[index] = value
        self.size += 1

    def delete(self, index):  # O(n)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        for i in range(index, self.size - 1):
            self.items[i] = self.items[i + 1]
        self.items[self.size - 1] = None
        self.size -= 1

    def find(self, value):  # O(n)
        for i in range(self.size):
            if self.items[i] == value:
                return i
        return -1

numbers = Array(6)
for value in [12, 7, 3, 9, 5]:
    numbers.insert(len(numbers), value)
print(list(numbers), len(numbers))

numbers.insert(2, 4)
print(list(numbers))

numbers.delete(1)
print(list(numbers))

numbers.set(0, 10)
print(numbers.get(0), numbers.find(9), numbers.find(8))

try:
    numbers.delete(5)
except IndexError as error:
    print('IndexError:', error)
```

## Python tilida {#in-python}

`list` kengaya oladigan [dinamik massiv](/uz/arrays/dynamic-array). `len(a)` va `a[i]` `O(1)`, `x in a` `O(n)`. `k` ta elementli kesim oliş `O(k)`. Oxiriga `k` ta element qöşişning amortizatsiyalangan xarajati `O(k)`.

```python
from array import array

items = [12, 7, 3, 9, 5, 8]
rest = items[1:]
rest[0] = 99
print(items)
print(rest)

compact = array('i', items)
print(compact[3], compact.itemsize)
```

## Ikki ölçamli massivlar {#two-dimensional-arrays}

Tasvir pikseli yoki öyin doskasidagi katak qator va ustun bilan belgilanadi. `grid[r][c]` qatorlar röyxatidan şu katakni oladi. Agar `cols` ta ustunli jadval yassi massivga qatorlab yozilsa, `(r, c)` uçun indeks `r * cols + c` böladi.

<Diagram label="Qatorma-qator joylaşuv" :width="640" :height="172" alt="Ikki qator 12, 7, 3 va 9, 5, 8 yassi massivda ketma-ket joylaşgan. 1-qator, 2-ustundagi 8 ning indeksi 1 × 3 + 2 = 5.">
 <text class="dg-note end" x="60" y="60">0-qator</text>
 <DCells :x="72" :y="36" :values="[12, 7, 3]" />
 <text class="dg-note end" x="60" y="100">1-qator</text>
 <DCells :x="72" :y="76" :values="[9, 5, 8]" :states="{ 2: 'hit' }" indices />
 <text class="dg-note" x="265" y="68">joylaşuvi</text>
 <DArrow :from="[224, 76]" :to="[311, 76]" />
 <line class="dg-link is-muted" x1="318" y1="44" x2="458" y2="44" /><text class="dg-label" x="388" y="36">0-qator</text>
 <line class="dg-link is-muted" x1="462" y1="44" x2="602" y2="44" /><text class="dg-label" x="532" y="36">1-qator</text>
 <DCells :x="316" :y="56" :values="[12, 7, 3, 9, 5, 8]" :states="{ 5: 'hit' }" indices />
 <text class="dg-note is-accent" x="320" y="156">grid[1][2] is cell 1 × 3 + 2 = 5</text>
</Diagram>

```python
rows, cols = 2, 3
grid = [[0] * cols for _ in range(rows)]
grid[1][2] = 8
print(grid)

flat = [0] * (rows * cols)
flat[1 * cols + 2] = 8
print(flat)
```

## Amallar xarajati {#costs-at-a-glance}

| Amal | Eng yomon holat |
| --- | --- |
| Indeks böyiça öqiş yoki yoziş | `O(1)` |
| Qiymatni qidiriş | `O(n)` |
| Oraga qöşiş yoki öçiriş | `O(n)` |
| Böş siğimda oxiriga qöşiş, oxiridan öçiriş | `O(1)` |

## Qayerda işlatiladi {#when-to-use}

Elementlarga örni böyiça tez murojaat qiliş kerak bölsa, massiv qulay. Boş yoki örta qismda tez-tez özgarişlar bölsa, siljiş xarajatini hisobga oling. Ikki uçdan qöşiş va oliş uçun [navbat](/uz/stacks-queues/queue#deque) darsiga qarang.

## Amaliy misol {#application}

Kalitlar kiçik butun sonlar bölsa, ularni indeks qiliş mumkin. Misolda 26 katak ingliz alifbosining kiçik harflarini sanaydi. `ord(letter) - ord('a')` harfni mos indeksga aylantiradi.

```python
def letter_counts(text):
    counts = [0] * 26
    for letter in text:
        if 'a' <= letter <= 'z':
            counts[ord(letter) - ord('a')] += 1
    return counts

counts = letter_counts('banana bread')
for i in range(26):
    if counts[i] > 0:
        print(chr(ord('a') + i), counts[i])
```

## Xulosa {#key-points}

Massivda qaysi katak kerakligi indeksdan hisoblanadi. Qöşiş va öçirişda undan keyingi elementlar siljiydi. Bu klassda manfiy indekslarga ruxsat berilmagan.

## Maşq {#exercise}

`remove_all` metodini yozing. U `value` ga teng barça elementlarni bir ötişda öçirib, neçta element öçirilganini qaytarsin. Keyingi böş katakni belgilaydigan ikkinçi indeksdan foydalaning.

```python
class Array:
    def __init__(self, values):
        self.items = list(values)
        self.size = len(self.items)

    def __iter__(self):
        for i in range(self.size):
            yield self.items[i]

    def remove_all(self, value):
        pass

numbers = Array([7, 12, 7, 3, 7, 9])
print(numbers.remove_all(7))
print(list(numbers))
print(numbers.items)
```

::: details Yeçim
`read` har bir elementni öqiydi. `write` saqlanadigan keyingi element yoziladigan katakni körsatadi. Oxirida qolgan kataklarni tozalang va ölçamni yangilang. Vaqt `O(n)`, qöşimça xotira `O(1)`.

```python
class Array:
    def __init__(self, values):
        self.items = list(values)
        self.size = len(self.items)

    def __iter__(self):
        for i in range(self.size):
            yield self.items[i]

    def remove_all(self, value):
        write = 0
        for read in range(self.size):
            if self.items[read] != value:
                self.items[write] = self.items[read]
                write += 1
        removed = self.size - write
        for i in range(write, self.size):
            self.items[i] = None
        self.size = write
        return removed

numbers = Array([7, 12, 7, 3, 7, 9])
print(numbers.remove_all(7))
print(list(numbers))
print(numbers.items)
```

:::
