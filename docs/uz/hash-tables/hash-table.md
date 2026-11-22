---
title: Xeş jadvali
description: "Mahsulot narxini nomi böyiça topiş uçun Python luğatidan foydalaniş mumkin. Xeş jadvali nomning xeşini hisoblab, uni qayerdan qidirişni aniqlaydi. Bir joyga bir neçta kalit tuşsa, kerakli kalit tenglik orqali tekşiriladi. Python dict kalitga qiymatni boğlaydi, set kalitlarning özini saqlaydi."
---

# Xeş jadvali

Mahsulot narxini nomi böyiça topiş uçun Python luğatidan foydalaniş mumkin. Xeş jadvali nomning xeşini hisoblab, uni qayerdan qidirişni aniqlaydi. Bir joyga bir neçta kalit tuşsa, kerakli kalit tenglik orqali tekşiriladi. Luğat (`dict`) kalit va qiymat juftlarini saqlaydi. Töplam (`set`) esa faqat takrorlanmaydigan elementlarni saqlaydi.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) va [Dinamik massiv](/uz/arrays/dynamic-array) darslarini öqing.

## Amallar {#interface}

`set` yangi juftlik qöşadi yoki bor qiymatni yangilaydi. `get` va `delete` kalit yöq bölsa `KeyError` beradi. Xeş kalitlarni yaxshi taqsimlasa va jadvalda yetarli joy bölsa, kalitni topiş, tekşiriş va öçiriş örtaça `O(1)` vaqt oladi. Xeş hisoblaş yoki tenglik tekşiruvi qimmat bölsa, ularning xarajatini ham hisobga oling.

## Kalitdan guruhga {#from-key-to-bucket}

Kalitning xeşini guruhlar soniga bölib, qoldiqni indeks qiliş mumkin. Bir indeksga tuşgan juftliklar şu guruh röyxatida saqlanadi. Ikki xil kalit bir indeksga tuşsa, töqnaşuv yuz beradi.

<Diagram label="Hashing a key" :width="650" :height="100" alt="The key fig goes through a hash function that adds up its character codes and gives 310. The remainder of 310 divided by 8 is 6, so the key belongs in bucket 6.">
 <DBox :x="30" :y="30" :w="70" text="'fig'" small /><text class="dg-note" x="65" y="84">key</text>
 <DArrow :from="[102, 48]" :to="[138, 48]" />
 <DBox :x="140" :y="30" :w="150" text="add up character codes" small /><text class="dg-note" x="215" y="84">hash function</text>
 <DArrow :from="[292, 48]" :to="[328, 48]" />
 <DBox :x="330" :y="30" :w="70" text="310" /><text class="dg-note" x="365" y="84">hash</text>
 <DArrow :from="[402, 48]" :to="[438, 48]" />
 <DBox :x="440" :y="30" :w="90" text="310 % 8" small /><text class="dg-note" x="485" y="84">fit to 8 buckets</text>
 <DArrow :from="[532, 48]" :to="[568, 48]" />
 <DBox :x="570" :y="30" :w="50" text="6" state="hit" /><text class="dg-note" x="595" y="84">bucket</text>
</Diagram>

```python
def simple_hash(key):
    return sum(ord(char) for char in key)

for key in ['pear', 'apple', 'kiwi', 'plum', 'lime', 'fig']:
    print(key, simple_hash(key), simple_hash(key) % 8)
```

```py
class HashTable:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):
        return self.buckets[hash(key) % len(self.buckets)]
```

## Qöşiş {#insert}

Guruhni toping va undagi kalitlarni soliştiring. Mos kalit bor bölsa, qiymatini yangilang. Aks holda juftlikni guruh oxiriga qöşib, `size` ni oşiring.

<HashTableBuckets mode="insert" />

```py
def set(self, key, value):
    bucket = self._bucket(key)
    for pair in bucket:
        if pair[0] == key:
            pair[1] = value
            return
    bucket.append([key, value])
    self.size += 1
```

## Qidiriş {#look-up}

Xeş orqali guruhni tanlang. Guruhdagi juftliklarni tekşiring va mos kelganining qiymatini qaytaring. `in` uçun faqat kalit borligi kerak.

<HashTableBuckets mode="lookup" />

```py
def get(self, key):
    for existing, value in self._bucket(key):
        if existing == key:
            return value
    raise KeyError(key)

def __contains__(self, key):
    for existing, value in self._bucket(key):
        if existing == key:
            return True
    return False
```

## Öçiriş {#delete}

Tegishli guruhdagi juftlikni topib öçiring, `size` ni kamaytiring. Katta guruhda qidiruv va siljiş vaqti ham ortadi.

<HashTableBuckets mode="delete" />

```py
def delete(self, key):
    bucket = self._bucket(key)
    for i, pair in enumerate(bucket):
        if pair[0] == key:
            del bucket[i]
            self.size -= 1
            return
    raise KeyError(key)
```

## Töliş nisbati va ölçamni özgartiriş {#load-factor-and-resizing}

Töliş nisbati juftliklar sonining guruhlar soniga nisbatidir. U çegaradan, masalan 0,75 dan ötsa, jadvalni kengaytiring. Guruhlar soni özgargani uçun har bir kalitning indeksini yangidan hisoblang.

<Diagram label="Resize to 16 buckets" cost="O(n)" :width="700" :height="112" alt="The six keys after the table grows from 8 to 16 buckets, with each index now the hash modulo 16. pear moves from bucket 0 to bucket 8 and plum moves from bucket 6 to bucket 14. apple, kiwi, fig and lime keep buckets 2, 4, 6 and 7. plum and fig no longer share a bucket.">
 <DCells :x="30" :y="44" :w="40" :h="38" small :values="[null, null, 'apple', null, 'kiwi', null, 'fig', 'lime', 'pear', null, null, null, null, null, 'plum', null]" :states="{ 0: 'ghost', 1: 'ghost', 3: 'ghost', 5: 'ghost', 8: 'new', 9: 'ghost', 10: 'ghost', 11: 'ghost', 12: 'ghost', 13: 'ghost', 14: 'new', 15: 'ghost' }" :marks="{ 8: 'from 0', 14: 'from 6' }" indices />
</Diagram>

```py
def _resize(self):
    pairs = [pair for bucket in self.buckets for pair in bucket]
    self.buckets = [[] for _ in range(2 * len(self.buckets))]
    for key, value in pairs:
        self._bucket(key).append([key, value])
```

## Oçiq manzillaş {#open-addressing}

Bu usulda har katakka bitta juftlik joylanadi. Kalitning dastlabki katagi band bölsa, belgilangan tartibda boşqa kataklar tekşiriladi.

### Çiziqli tekşiruv bilan qöşiş {#insert-with-linear-probing}

Asosiy indeksdan boşlab kataklarni bittadan tekşiring. Jadvalning oxiridan nolinçi indeksga ötiladi. Qidiruv ham şu yöldan yuradi va avval umuman işlatilmagan katakka yetganda tugaydi.

<Diagram label="Linear probing: insert fig" cost="O(1) average" :width="640" :height="126" alt="A table with no chains. fig hashes to index 6, which holds plum. The next cells are checked in turn: 7 holds lime, 0 holds pear, and 1 is free, so fig goes there.">
 <DCells :x="64" :y="52" :w="64" :h="38" small :values="['pear', 'fig', 'apple', null, 'kiwi', null, 'plum', 'lime']" :states="{ 6: 'done', 7: 'done', 0: 'done', 1: 'new', 3: 'ghost', 5: 'ghost' }" :marks="{ 6: '1', 7: '2', 0: '3', 1: '4 · free' }" indices />
</Diagram>

### Öçirilgan katak belgisi {#delete-with-a-tombstone}

Öçirilgan katakni darhol böş qiliş qidiruv yölini uzib qöyişi mumkin. `DELETED` bu katakdan ötib ketiş mumkinligini bildiradi. Qöşişda kalit bor-yöqligi tekşirilgandan söng katak qayta işlatiladi.

<Diagram label="Look up fig after deleting lime" cost="O(1) average" :width="640" :height="126" alt="The same table after lime is deleted. Slot 7 now holds a tombstone marked DELETED instead of being empty. The search for fig starts at 6, which holds plum, steps over the tombstone at 7, checks pear at 0 and finds fig at 1.">
 <DCells :x="64" :y="52" :w="64" :h="38" small :values="['pear', 'fig', 'apple', null, 'kiwi', null, 'plum', 'DELETED']" :states="{ 6: 'done', 7: 'ghost', 0: 'done', 1: 'hit', 3: 'ghost', 5: 'ghost' }" :marks="{ 6: '1', 7: '2 · skip', 0: '3', 1: '4 · found' }" indices />
</Diagram>

```python
def simple_hash(key):
    return sum(ord(char) for char in key)

DELETED = object()

class LinearProbingTable:
    def __init__(self, capacity=8):  # O(capacity)
        self.slots = [None] * capacity
        self.size = 0

    def _find(self, key):  # O(1) average
        index = simple_hash(key) % len(self.slots)
        for _ in range(len(self.slots)):
            slot = self.slots[index]
            if slot is None:
                return None
            if slot is not DELETED and slot[0] == key:
                return index
            index = (index + 1) % len(self.slots)
        return None

    def set(self, key, value):  # O(1) average
        index = self._find(key)
        if index is None:
            if self.size == len(self.slots):
                raise OverflowError('table is full')
            index = simple_hash(key) % len(self.slots)
            while self.slots[index] not in (None, DELETED):
                index = (index + 1) % len(self.slots)
            self.size += 1
        self.slots[index] = (key, value)

    def get(self, key):  # O(1) average
        index = self._find(key)
        if index is None:
            raise KeyError(key)
        return self.slots[index][1]

    def __contains__(self, key):  # O(1) average
        return self._find(key) is not None

    def delete(self, key):  # O(1) average
        index = self._find(key)
        if index is None:
            raise KeyError(key)
        self.slots[index] = DELETED
        self.size -= 1

    def __len__(self):  # O(1)
        return self.size

table = LinearProbingTable()
for key, value in [('pear', 3), ('apple', 5), ('kiwi', 2), ('plum', 4), ('lime', 1), ('fig', 6)]:
    table.set(key, value)
print(table.get('fig'), len(table))

table.delete('lime')
print(table.get('fig'), 'lime' in table, len(table))

table.slots[7] = None
print('fig' in table)
```

## Tahlil {#analysis}

`α` töliş nisbati bölsin. Kalitlar bir tekis taqsimlansa, zanjir böyiça qidiruv örtaça `O(1 + α)`. Oçiq manzillaşda `α` birga yaqinlaşgan sari böş katakni topiş qiyinlaşadi. Çiziqli tekşiruv ketma-ket band kataklar guruhini kattalaştiradi. Kvadratik qadam va ikkinçi xeş yordamida yuruv tartibini özgartiriş mumkin.

## Yaxşi xeş funksiyasi {#good-hash-functions}

Teng kalitlar teng xeş olişi kerak. Satr harflarining kodlarini şunçaki yiğiş ularning tartibini hisobga olmaydi. Polinomli xeş navbatdagi harfni qöşişdan avval eski qiymatni 31 ga köpaytiradi. Farqli satrlar baribir bir xil xeş berişi mumkin.

```python
from itertools import permutations

def simple_hash(key):
    return sum(ord(char) for char in key)

def poly_hash(key):
    value = 0
    for char in key:
        value = value * 31 + ord(char)
    return value

for word in ['listen', 'silent', 'enlist']:
    print(word, simple_hash(word), poly_hash(word))

keys = [''.join(letters) for letters in permutations('stop')]
for function in [simple_hash, poly_hash]:
    chains = [0] * 13
    for key in keys:
        chains[function(key) % 13] += 1
    print(function.__name__, chains)
```

## Xeşlanadigan kalitlar {#hashable-keys}

`__eq__` teng deb topgan obyektlarning `__hash__` natijasi teng bölsin. Kalitning xeşi obyekt mavjud bölgan vaqt davomida özgarmasligi kerak. Sonlar va satrlar xeşlanadi. Kortej (`tuple`) faqat barça elementlari xeşlanadigan bölsa, kalit böla oladi. Röyxat (`list`) xeşlanmaydi.

```python
class Tag:
    def __init__(self, name):
        self.name = name

class TagWithEq:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, TagWithEq) and self.name == other.name

print(Tag('red') == Tag('red'))
print(TagWithEq('red') == TagWithEq('red'))

for key in [42, 'fig', (2, 3), [2, 3], Tag('red'), TagWithEq('red')]:
    try:
        hash(key)
        print(type(key).__name__, 'is hashable')
    except TypeError:
        print(type(key).__name__, 'is not hashable')
```

## Töliq dastur {#full-implementation}

Klass zanjirli guruhlar va Pythonning `hash` funksiyasidan foydalanadi. Misoldagi `fig` ikkinçi marta yozilganda eski qiymati özgaradi va juftliklar soni ortmaydi.

```python
class HashTable:
    def __init__(self, capacity=8):  # O(capacity)
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):  # O(1)
        return self.buckets[hash(key) % len(self.buckets)]

    def set(self, key, value):  # O(1) average, amortized
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self.size += 1
        if self.size > 0.75 * len(self.buckets):
            self._resize()

    def get(self, key):  # O(1) average
        for existing, value in self._bucket(key):
            if existing == key:
                return value
        raise KeyError(key)

    def __contains__(self, key):  # O(1) average
        for existing, value in self._bucket(key):
            if existing == key:
                return True
        return False

    def delete(self, key):  # O(1) average
        bucket = self._bucket(key)
        for i, pair in enumerate(bucket):
            if pair[0] == key:
                del bucket[i]
                self.size -= 1
                return
        raise KeyError(key)

    def __len__(self):  # O(1)
        return self.size

    def _resize(self):  # O(n)
        pairs = [pair for bucket in self.buckets for pair in bucket]
        self.buckets = [[] for _ in range(2 * len(self.buckets))]
        for key, value in pairs:
            self._bucket(key).append([key, value])

prices = HashTable()
for key, value in [('pear', 3), ('apple', 5), ('kiwi', 2), ('plum', 4), ('lime', 1), ('fig', 6)]:
    prices.set(key, value)
print(prices.get('fig'), 'fig' in prices, 'date' in prices)

prices.set('fig', 7)
prices.delete('plum')
print(prices.get('fig'), len(prices))

prices.set('date', 9)
prices.set('guava', 8)
print(len(prices), len(prices.buckets))

try:
    prices.get('plum')
except KeyError as error:
    print('KeyError:', error)
```

## Python tilida {#in-python}

`dict` kalitlarning qöşiliş tartibini saqlaydi. `set` tartibga tayanmaydi. `a | b` birlaşmani, `a & b` kesişmani beradi. `Counter` qiymatlar neça marta uçraganini sanaydi.

```python
from collections import Counter, defaultdict

stock = {'pear': 3, 'apple': 5}
stock['kiwi'] = 2
del stock['pear']
print(stock, 'kiwi' in stock, stock.get('fig', 0))

a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b, a & b, a - b)

words = 'the cat and the hat and the bat'.split()
print(Counter(words).most_common(2))

by_length = defaultdict(list)
for fruit in ['fig', 'kiwi', 'pear', 'apple', 'plum']:
    by_length[len(fruit)].append(fruit)
print(dict(by_length))

same = {}
for fruit in ['fig', 'kiwi', 'pear', 'apple', 'plum']:
    same.setdefault(len(fruit), []).append(fruit)
print(same == by_length)
```

## Amallar xarajati {#costs-at-a-glance}

Xeşlaş va tenglik tekşiruvi doimiy deb olinsa, qidiruv va öçiriş örtaça `O(1)`, qöşiş esa örtaça va amortizatsiya bilan `O(1)`. Uzun zanjir yoki tekşiruv yölida bitta amal `O(n)) vaqt olişi mumkin.

## Qayerda işlatiladi {#when-to-use}

Kalitdan yozuvni topiş, takrorlarni aniqlaş va natijalarni yodda tutişda xeş jadvali qulay. Oraliq yoki eng yaqin qiymatni topiş uçun tartibli tuzilma kerak böladi.

## Amaliy misollar {#application}

`functools.cache` funksiya natijasini argumentlarga boğlab saqlaydi. `Counter` sözlarni sanaydi. `dict` grafda har tugunning qöşnilarini saqlay oladi.

```python
def two_sum(numbers, target):
    seen = {}
    for i, value in enumerate(numbers):
        partner = target - value
        if partner in seen:
            return seen[partner], i
        seen[value] = i
    return None

numbers = [8, 3, 11, 5, 7]
print(two_sum(numbers, 12))
print(two_sum(numbers, 19))
print(two_sum(numbers, 100))
```

## Xulosa {#key-points}

Xeş qayerdan qidirişni körsatadi. Töqnaşuvni zanjir yoki boş katak izlaş bilan yeçamiz. Kam miqdorda band qilingan jadvalda qidiruv qisqa böladi.

## Maşq {#exercise}

`Point` obyektlari hozir aynan qaysi obyekt ekaniga qarab farqlanadi. `__eq__` va `__hash__` ni yozing. Koordinatalari bir xil nuqtalar bitta kalit bölsin.

```python
class HashTable:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):
        return self.buckets[hash(key) % len(self.buckets)]

    def set(self, key, value):
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self.size += 1

    def get(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return value
        raise KeyError(key)

    def __contains__(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return True
        return False

    def __len__(self):
        return self.size

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

visits = HashTable()
for x, y in [(0, 0), (2, 3), (0, 0), (2, 3), (0, 0)]:
    point = Point(x, y)
    if point in visits:
        visits.set(point, visits.get(point) + 1)
    else:
        visits.set(point, 1)
print(len(visits))
print(Point(0, 0) in visits)
```

::: details Yeçim
Tenglikni `x` va `y` bilan tekşiring. Ikki koordinatadan tuzilgan `tuple` xeşini qaytaring. `n` ta taşrif uçun örtaça vaqt `O(n)`, eng köp qöşimça xotira `O(n)`.

```python
class HashTable:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):
        return self.buckets[hash(key) % len(self.buckets)]

    def set(self, key, value):
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self.size += 1

    def get(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return value
        raise KeyError(key)

    def __contains__(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return True
        return False

    def __len__(self):
        return self.size

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return isinstance(other, Point) and self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

visits = HashTable()
for x, y in [(0, 0), (2, 3), (0, 0), (2, 3), (0, 0)]:
    point = Point(x, y)
    if point in visits:
        visits.set(point, visits.get(point) + 1)
    else:
        visits.set(point, 1)
print(len(visits))
print(Point(0, 0) in visits)
```

:::
