---
title: Dinamik massiv
description: "Dinamik massivdagi elementlar yonma-yon turadi. Böş katak qolmaganda kattaroq joy ajratilib, saqlangan elementlar u yerga köçiriladi."
---

# Dinamik massiv

Dinamik massivdagi elementlar yonma-yon turadi. Böş katak qolmaganda kattaroq joy ajratilib, saqlangan elementlar u yerga köçiriladi.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) va [Massiv](/uz/arrays/array) darslarini öqing.

## Amallar {#interface}

Indeks böyiça öqiş va yoziş `O(1)`. Oxiriga `append` va oxiridan `pop` amortizatsiya bilan `O(1)`. Boşida yoki örtasida qöşiş va olişga eng yomon holatda `O(n)` vaqt ketadi.

## Ölçam va siğim {#size-and-capacity}

`size` elementlar soni, `capacity` ajratilgan kataklar soni. `size < capacity` bölganida keyingi element böş katakka yoziladi.

<Diagram label="Anatomy" :width="520" :height="146" alt="An array with four cells. Three hold 12, 7 and 3 and the fourth is empty. The size is 3 and the capacity is 4.">
 <DCells :x="164" :y="30" :values="[12, 7, 3, null]" :states="{ 3: 'ghost' }" />
 <line class="dg-link is-accent" x1="164" y1="84" x2="308" y2="84" /><text class="dg-note is-accent" x="236" y="100">size = 3</text>
 <line class="dg-link is-muted" x1="164" y1="114" x2="356" y2="114" /><text class="dg-note" x="260" y="130">capacity = 4</text>
</Diagram>

## Öqiş va yoziş {#read-and-write}

`a[index]` ifodasi `__getitem__` ni, `a[index] = value` esa `__setitem__` ni çaqiradi. Indeks saqlangan elementlar oraliğida bölişi kerak.

```py
def __getitem__(self, index):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    return self.items[index]

def __setitem__(self, index, value):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    self.items[index] = value
```

## Oxiriga qöşiş {#append}

Massiv tölsa, siğimi ikki baravar katta blok ajrating va eski elementlarni köçiring. Yangi qiymatni `size` indeksiga yozib, `size` ni bittaga oşiring.

<Diagram label="Append 9" cost="O(1)" :width="520" :height="100" alt="The value 9 is written into the free fourth cell. Nothing else moves.">
 <DCells :x="164" :y="30" :values="[12, 7, 3, 9]" :states="{ 3: 'new' }" />
</Diagram>

<Diagram label="Append 5 to a full array" cost="O(n)" :width="520" :height="176" alt="The array is full, so a new array with twice the capacity is created. The four items are copied across and 5 goes into the fifth cell.">
 <text class="dg-note end" x="152" y="48">old</text>
 <DCells :x="164" :y="24" :values="[12, 7, 3, 9]" :states="['muted', 'muted', 'muted', 'muted']" />
 <DArrow v-for="i in [0, 1, 2, 3]" :key="i" :from="[188 + 48 * i, 66]" :to="[92 + 48 * i, 113]" kind="accent" />
 <text class="dg-note end" x="56" y="140">new</text>
 <DCells :x="68" :y="116" :values="[12, 7, 3, 9, 5, null, null, null]" :states="{ 4: 'new', 5: 'ghost', 6: 'ghost', 7: 'ghost' }" />
</Diagram>

```py
def append(self, value):
    if self.size == self.capacity:
        self._resize(2 * self.capacity)
    self.items[self.size] = value
    self.size += 1

def _resize(self, capacity):
    bigger = [None] * capacity
    for i in range(self.size):
        bigger[i] = self.items[i]
    self.items = bigger
    self.capacity = capacity
```

## Qöşişning amortizatsiyalangan xarajati {#why-append-is-still-cheap}

Siğim ikki baravar oşsa, `n` marta qöşişda köçirilgan elementlar soni `1 + 2 + 4 + … < 2n`. Jami iş `O(n)`, har amalga töğri keladigan xarajat `O(1)`. Siğim har safar bir xil miqdorga oşirilsa, köçirişlar jami kvadratik böladi.

```python
def double(capacity):
    return 2 * capacity

def add_ten(capacity):
    return capacity + 10

class DynamicArray:
    def __init__(self, grow):
        self.grow = grow
        self.capacity = 1
        self.size = 0
        self.items = [None]
        self.copies = 0

    def append(self, value):
        if self.size == self.capacity:
            self._resize(self.grow(self.capacity))
        self.items[self.size] = value
        self.size += 1

    def _resize(self, capacity):
        bigger = [None] * capacity
        for i in range(self.size):
            bigger[i] = self.items[i]
            self.copies += 1
        self.items = bigger
        self.capacity = capacity

for name, grow in [('double', double), ('add ten', add_ten)]:
    for n in [1000, 2000]:
        numbers = DynamicArray(grow)
        for value in range(n):
            numbers.append(value)
        print(f'{name}: {n} appends, {numbers.copies} copies')
```

## Joyiga qöşiş {#insert}

Indeks `0 <= index <= size` şartiga mos bölsin. Kerak bölsa avval siğimni oşiring. Elementlarni oxiridan başlayib öngga suring, yangi qiymatni böş katakka yozing.

<Diagram label="Insert 4 at index 1 of a full array" cost="O(n)" :width="560" :height="280" alt="A full array of four cells holds 12, 7, 3 and 9. Step 1: all four items are copied into a new block with eight cells. Step 2: 9, 3 and 7 each move one cell to the right, and 4 is written at index 1. The result is 12, 4, 7, 3 and 9, with three free cells.">
 <text class="dg-note end" x="116" y="48">full</text>
 <DCells :x="128" :y="24" :values="[12, 7, 3, 9]" :states="['muted', 'muted', 'muted', 'muted']" />
 <DArrow v-for="i in [0, 1, 2, 3]" :key="i" :from="[152 + 48 * i, 66]" :to="[152 + 48 * i, 113]" kind="accent" />
 <DStep :x="348" :y="90" n="1" />
 <text class="dg-note start" x="364" y="94">copy to a block twice the size</text>
 <text class="dg-note end" x="116" y="140">grown</text>
 <DCells :x="128" :y="116" :values="[12, 7, 3, 9, null, null, null, null]" :states="{ 4: 'ghost', 5: 'ghost', 6: 'ghost', 7: 'ghost' }" />
 <DArrow v-for="i in [1, 2, 3]" :key="i" :from="[152 + 48 * i, 158]" :to="[200 + 48 * i, 205]" kind="accent" />
 <DStep :x="372" :y="182" n="2" />
 <text class="dg-note start" x="388" y="186">shift right, write 4</text>
 <text class="dg-note end" x="116" y="232">after</text>
 <DCells :x="128" :y="208" :values="[12, 4, 7, 3, 9, null, null, null]" :states="{ 1: 'new', 5: 'ghost', 6: 'ghost', 7: 'ghost' }" indices />
</Diagram>

```py
def insert(self, index, value):
    if not 0 <= index <= self.size:
        raise IndexError('index out of range')
    if self.size == self.capacity:
        self._resize(2 * self.capacity)
    for i in range(self.size, index, -1):
        self.items[i] = self.items[i - 1]
    self.items[index] = value
    self.size += 1
```

## Elementni oliş {#pop}

`pop` elementni olib, qiymatini qaytaradi. Indeks berilmasa, oxirgi element olinadi. Örtadan olinsa, keyingi elementlar çapga suriladi. Böş massivda `IndexError` keltariladi.

<Diagram label="Pop the last item" cost="O(1)" :width="520" :height="100" alt="An array holding 12, 7, 3 and 9. The last cell is cleared and its item, 9, is returned. Nothing else moves.">
 <DCells :x="164" :y="30" :values="[12, 7, 3, 9]" :states="{ 3: 'ghost' }" />
 <text class="dg-note is-accent start" x="372" y="54">returns 9</text>
</Diagram>

```py
def pop(self, index=None):
    if self.size == 0:
        raise IndexError('pop from an empty array')
    if index is None:
        index = self.size - 1
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    value = self.items[index]
    for i in range(index, self.size - 1):
        self.items[i] = self.items[i + 1]
    self.items[self.size - 1] = None
    self.size -= 1
    return value
```

## Siğimni kamaytiriş {#shrinking}

Massiv yarmiga tuşişi bilan siğim ham yarmiga qisqarsa, ketma-ket `pop` va `append` qayta-qayta köçirişga olib keladi. Bu dasturda massiv çorakgaça böşagandan keyingina siğim yarmiga tuşiriladi. Massiv böş bölganda ham kamida bitta katak saqlanadi.

<Diagram label="Append and pop in turn" :width="640" :height="168" alt="Two columns compare two rules while append and pop alternate, starting from an array that has just grown to 8 cells and holds 5 items. Halving at half: the pop leaves 4 items, so the block halves to 4 cells; the append finds it full and doubles to 8; the next pop halves it again. Each of these steps copies 4 items. Halving at a quarter: the block stays at 8 cells and nothing is copied.">
 <text class="dg-label" x="200" y="24">halve at half</text>
 <text class="dg-label" x="470" y="24">halve at a quarter</text>
 <template v-for="(row, k) in [['start', 8, 5], ['pop', 4, 4], ['append', 8, 5], ['pop', 4, 4]]" :key="k">
  <text class="dg-note end" x="108" :y="51 + 32 * k">{{ row[0] }}</text>
  <DCells :x="120" :y="36 + 32 * k" :w="20" :h="22" :values="Array(row[1]).fill(null)" :states="Array.from({ length: row[1] }, (_, i) => i < row[2] ? 'hit' : 'ghost')" />
  <text v-if="k > 0" class="dg-note is-accent start" x="290" :y="51 + 32 * k">copies 4</text>
  <DCells :x="390" :y="36 + 32 * k" :w="20" :h="22" :values="Array(8).fill(null)" :states="Array.from({ length: 8 }, (_, i) => i < row[2] ? 'hit' : 'ghost')" />
  <text v-if="k > 0" class="dg-note start" x="560" :y="51 + 32 * k">no copy</text>
 </template>
</Diagram>

```py
def pop(self, index=None):
    ...
    self.size -= 1
    if 0 < self.size <= self.capacity // 4:
        self._resize(self.capacity // 2)
    return value
```

## Töliq dastur {#full-implementation}

Birinçi beşta `append` siğimni 1 dan 8 gaça oşiradi. Törtinçi `pop` dan keyin ikkita element qoladi va siğim 8 dan 4 ga tuşadi.

```python
class DynamicArray:
    def __init__(self):  # O(1)
        self.capacity = 1
        self.size = 0
        self.items = [None]

    def __len__(self):  # O(1)
        return self.size

    def __iter__(self):  # O(n)
        for i in range(self.size):
            yield self.items[i]

    def __getitem__(self, index):  # O(1)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        return self.items[index]

    def __setitem__(self, index, value):  # O(1)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        self.items[index] = value

    def append(self, value):  # O(1) amortized
        if self.size == self.capacity:
            self._resize(2 * self.capacity)
        self.items[self.size] = value
        self.size += 1

    def insert(self, index, value):  # O(n)
        if not 0 <= index <= self.size:
            raise IndexError('index out of range')
        if self.size == self.capacity:
            self._resize(2 * self.capacity)
        for i in range(self.size, index, -1):
            self.items[i] = self.items[i - 1]
        self.items[index] = value
        self.size += 1

    def pop(self, index=None):  # O(1) amortized for the last item, O(n) otherwise
        if self.size == 0:
            raise IndexError('pop from an empty array')
        if index is None:
            index = self.size - 1
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        value = self.items[index]
        for i in range(index, self.size - 1):
            self.items[i] = self.items[i + 1]
        self.items[self.size - 1] = None
        self.size -= 1
        if 0 < self.size <= self.capacity // 4:
            self._resize(self.capacity // 2)
        return value

    def _resize(self, capacity):  # O(n)
        bigger = [None] * capacity
        for i in range(self.size):
            bigger[i] = self.items[i]
        self.items = bigger
        self.capacity = capacity

numbers = DynamicArray()
for value in [12, 7, 3, 9, 5]:
    numbers.append(value)
print(list(numbers), len(numbers), numbers.capacity)

numbers.insert(1, 4)
numbers[0] = 10
print(list(numbers), numbers[1])

print(numbers.pop(), numbers.pop(0), numbers.pop())
print(list(numbers), len(numbers), numbers.capacity)

print(numbers.pop())
print(list(numbers), len(numbers), numbers.capacity)
```

## Python tilida {#in-python}

CPython `list` tuzilmasi havolalardan tuzilgan dinamik massivdir. `sys.getsizeof` röyxatning öziga ajratilgan xotirani bildiradi. Har qadamda `items = items + [x]` yozilsa, har safar yangi röyxatga köçiriladi. `append(x)` bilan umumiy vaqt çiziqli bölib qoladi.

```python
import sys

numbers = []
last = sys.getsizeof(numbers)
for i in range(20):
    numbers.append(i)
    now = sys.getsizeof(numbers)
    if now != last:
        print(f'resized when the length became {len(numbers)}')
        last = now
```

## Amallar xarajati {#costs-at-a-glance}

| Amal | Vaqt |
| --- | --- |
| Indeks böyiça öqiş yoki yoziş | `O(1)` |
| Oxiriga qöşiş yoki oxiridan oliş | Amortizatsiya bilan `O(1)`, siğim özgarganda `O(n)` |
| Boşida yoki örtasida qöşiş yoki oliş | `O(n)` |

## Qayerda işlatiladi {#when-to-use}

Neçta element bölişi oldindan maʼlum bölmaganda yoki indeks böyiça tez-tez öqilganda Python röyxati qulay. Boşidan tez-tez oliş kerak bölsa, [`deque`](/uz/stacks-queues/queue#deque) ni tanlaş mumkin.

## Amaliy misol {#application}

Kollats ketma-ketligida juft son ikkiga bölinadi, toq `x` esa `3x + 1` bilan almaşadi. Misolda 6 va 27 dan boşlab 1 ga yetgunça qiymatlarni yiğamiz. Umuman ixtiyoriy musbat son uçun 1 ga yetişi hali isbotlanmagan. `n` ta topilgan qiymatni röyxatga joylaş `O(n)` vaqt oladi.

```python
def collatz(value):
    steps = [value]
    while value != 1:
        if value % 2 == 0:
            value = value // 2
        else:
            value = 3 * value + 1
        steps.append(value)
    return steps

print(collatz(6))
print(len(collatz(27)), max(collatz(27)))
```

## Xulosa {#key-points}

Böş kataklar keyingi qöşişlarni tezlaştiradi. Siğimni geometrik oşiriş va siğimni kamaytiriş çegaralarini bir-biridan uzoq tutiş, oxiridagi amallar uçun doimiy amortizatsiyalangan xarajat beradi.

## Maşq {#exercise}

`extend` metodi `values` röyxatidagi barça qiymatni qöşsin. Yakuniy ölçamni hisoblang, yetarli siğimga yetgunça vaqtinçalik qiymatni ikki baravardan oşiring. `_resize` ni köpi bilan bir marta çaqiring.

```python
class DynamicArray:
    def __init__(self):
        self.capacity = 1
        self.size = 0
        self.items = [None]
        self.resizes = 0

    def __iter__(self):
        for i in range(self.size):
            yield self.items[i]

    def append(self, value):
        if self.size == self.capacity:
            self._resize(2 * self.capacity)
        self.items[self.size] = value
        self.size += 1

    def _resize(self, capacity):
        bigger = [None] * capacity
        for i in range(self.size):
            bigger[i] = self.items[i]
        self.items = bigger
        self.capacity = capacity
        self.resizes += 1

    def extend(self, values):
        pass

numbers = DynamicArray()
numbers.append(12)
numbers.extend([7, 3, 9, 5, 8])
print(list(numbers), numbers.capacity, numbers.resizes)
numbers.extend([1, 2])
print(list(numbers), numbers.capacity, numbers.resizes)
```

::: details Yeçim
`size + len(values)` uçun joy yetarli bölsa, xotirani yangidan ajratiş şart emas. Aks holda bir marta köçiring. Söng qiymatlarni ketma-ket böş kataklarga yozing. Eng yomon holatda vaqt `O(n + k)`, bunda `k` yangi qiymatlar soni.

```python
class DynamicArray:
    def __init__(self):
        self.capacity = 1
        self.size = 0
        self.items = [None]
        self.resizes = 0

    def __iter__(self):
        for i in range(self.size):
            yield self.items[i]

    def append(self, value):
        if self.size == self.capacity:
            self._resize(2 * self.capacity)
        self.items[self.size] = value
        self.size += 1

    def _resize(self, capacity):
        bigger = [None] * capacity
        for i in range(self.size):
            bigger[i] = self.items[i]
        self.items = bigger
        self.capacity = capacity
        self.resizes += 1

    def extend(self, values):
        needed = self.size + len(values)
        capacity = self.capacity
        while capacity < needed:
            capacity *= 2
        if capacity != self.capacity:
            self._resize(capacity)
        for value in values:
            self.items[self.size] = value
            self.size += 1

numbers = DynamicArray()
numbers.append(12)
numbers.extend([7, 3, 9, 5, 8])
print(list(numbers), numbers.capacity, numbers.resizes)
numbers.extend([1, 2])
print(list(numbers), numbers.capacity, numbers.resizes)
```

:::
