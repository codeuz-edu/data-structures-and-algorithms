---
title: Uyum
description: "Minimum uyum eng kiçik qiymatni ildizda saqlaydi. Ustuvor navbat navbatdagi elementni kelgan vaqti böyiça emas, ustuvorligi böyiça tanlaydi."
---

# Uyum

Minimum uyum eng kiçik qiymatni ildizda saqlaydi. Ustuvor navbat navbatdagi elementni kelgan vaqti böyiça emas, ustuvorligi böyiça tanlaydi.

Avval [Dinamik massiv](/uz/arrays/dynamic-array) va [Ikkilik daraxt](/uz/trees/binary-tree) darslarini öqing.

## Amallar {#interface}

`peek` eng kiçik qiymatni öqiydi, `pop` uni oladi, `push` yangi qiymat qöşadi. Böş uyumda `peek` va `pop` `IndexError` beradi. `heapify` qiymatlardan uyum yasaydi.

## Uyum qoidasi {#the-heap-rule}

Minimum uyumda ota qiymati har ikki bolasidan katta bölmaydi va daraxt sathlari çapdan töldiriladi. Barça qiymatlar saralangan bölişi şart emas.

<Diagram label="Anatomy" :width="600" :height="270" alt="A heap drawn as a tree with 2 at the root, then 4 and 3, then 9, 7, 8 and 5. Below it the same values in an array: 2, 4, 3, 9, 7, 8, 5. The small number next to each tree node is its index in the array.">
 <DTree :x="300" :y="36" :width="320" :gap="56" :values="[2, 4, 3, 9, 7, 8, 5]" :notes="{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }" />
 <DCells :x="132" :y="206" :values="[2, 4, 3, 9, 7, 8, 5]" indices />
</Diagram>

## Massivdagi daraxt {#a-tree-stored-in-an-array}

Ildiz nolinçi katakda. `i` ning bolalari `2 * i + 1` va `2 * i + 2` da, otasi `(i - 1) // 2` da. Yaxlit daraxt massivda böş katak qoldirmaydi.

## Qöşiş {#push}

Qiymatni massiv oxiriga yozing. Ota qiymatidan kiçik bölsa, ikkalasini almaştiring. Kerak bölsa ildizgaça kötariladi. Siljişlar soni daraxt balandligidan oşmaydi.

<Diagram label="Push 1" cost="O(log n) amortized" :width="600" :height="240" alt="The new value 1 is added at the end, as a child of 9. It is smaller than 9, so they swap. It is smaller than 4, so they swap. It is smaller than 2, so they swap, and 1 becomes the root.">
 <DTree :x="300" :y="36" :width="400" :gap="56" :values="[2, 4, 3, 9, 7, 8, 5, 1]" :states="{ 7: 'new', 3: 'done', 1: 'done', 0: 'done' }" :edges="{ 7: 'accent', 3: 'accent', 1: 'accent' }" />
 <DStep :x="120" :y="172" :n="1" /><DStep :x="158" :y="114" :n="2" /><DStep :x="234" :y="56" :n="3" />
</Diagram>

```py
def push(self, value):
    self.items.append(value)
    i = len(self.items) - 1
    while i > 0:
        parent = (i - 1) // 2
        if self.items[parent] <= self.items[i]:
            break
        self.items[i], self.items[parent] = self.items[parent], self.items[i]
        i = parent
```

## Eng kiçik qiymatni oliş {#pop}

Ildiz qiymatini saqlang. Oxirgi elementni ildizga qöying. Ikkala boladan kiçigi yangi qiymatdan ham kiçik bölsa, örnini almaştiring. Tartib tiklangunça pastga tuşing.

<Diagram label="Pop the smallest" cost="O(log n)" :width="680" :height="214" alt="The root 2 is removed and returned. On the left, the last item, 5, has moved into the root. Its smaller child is 3, so they swap. On the right, the heap after the swap: 3 at the root and 5 below it on the right. The only child of 5 is 8, which is larger, so the sift stops.">
 <DBox :x="20" :y="34" :w="40" text="2" state="ghost" /><text class="dg-note" x="40" y="90">returned</text>
 <DTree :x="210" :y="40" :width="240" :gap="56" :r="16" :values="[5, 4, 3, 9, 7, 8]" :states="{ 0: 'new', 2: 'hit' }" :edges="{ 2: 'accent' }" />
 <DStep :x="256" :y="58" :n="1" />
 <DArrow :from="[306, 96]" :to="[409, 96]" kind="muted" />
 <DTree :x="505" :y="40" :width="240" :gap="56" :r="16" :values="[3, 4, 5, 9, 7, 8]" :states="{ 2: 'new' }" :edges="{ 2: 'accent' }" :notes="{ 2: '8 > 5, stop' }" />
 <text class="dg-note" x="210" y="200">5 moves to the root</text>
 <text class="dg-note" x="505" y="200">5 swaps with 3, its smaller child</text>
</Diagram>

```py
def pop(self):
    if self.is_empty():
        raise IndexError('pop from an empty heap')
    smallest = self.items[0]
    last = self.items.pop()
    if self.items:
        self.items[0] = last
        self._sift_down(0)
    return smallest

def _sift_down(self, i):
    size = len(self.items)
    while True:
        child = 2 * i + 1
        if child >= size:
            break
        if child + 1 < size and self.items[child + 1] < self.items[child]:
            child += 1
        if self.items[i] <= self.items[child]:
            break
        self.items[i], self.items[child] = self.items[child], self.items[i]
        i = child
```

## Ildizni öqiş {#peek}

Minimum uyum böş bölmasa, eng kiçik qiymat har doim `items[0]` da. Uni öqiş `O(1)`.

```py
def peek(self):
    if self.is_empty():
        raise IndexError('peek at an empty heap')
    return self.items[0]
```

## Uyum yasaymiz {#heapify}

Barglar allaqaçon uyum qoidasiga mos. Oxirgi ota tugundan boşlab nolgaça har qiymatni pastga siljiting. Köp tugun bargga yaqin, şuning uçun siljişlar jami `O(n)`.

<Diagram label="Heapify [9, 7, 5, 4, 2, 8, 3]" cost="O(n)" :width="700" :height="204" alt="Heapify on 9, 7, 5, 4, 2, 8, 3, in four snapshots. At the start the four leaves 4, 2, 8 and 3 need no work. Sifting down index 2 swaps 5 with its smaller child 3. Sifting down index 1 swaps 7 with its smaller child 2. Sifting down index 0 moves 9 down two levels, below 2 and then below 4. The result is the heap 2, 4, 3, 9, 7, 8, 5.">
 <DTree :x="88" :y="30" :width="150" :gap="50" :r="14" :values="[9, 7, 5, 4, 2, 8, 3]" :states="{ 3: 'muted', 4: 'muted', 5: 'muted', 6: 'muted' }" />
 <DTree :x="263" :y="30" :width="150" :gap="50" :r="14" :values="[9, 7, 3, 4, 2, 8, 5]" :states="{ 6: 'new' }" :edges="{ 6: 'accent' }" />
 <DTree :x="438" :y="30" :width="150" :gap="50" :r="14" :values="[9, 2, 3, 4, 7, 8, 5]" :states="{ 4: 'new' }" :edges="{ 4: 'accent' }" />
 <DTree :x="613" :y="30" :width="150" :gap="50" :r="14" :values="[2, 4, 3, 9, 7, 8, 5]" :states="{ 3: 'new' }" :edges="{ 1: 'accent', 3: 'accent' }" />
 <text class="dg-label is-ink" x="88" y="172">Start</text><text class="dg-note" x="88" y="190">leaves need no work</text>
 <text class="dg-label is-ink" x="263" y="172">After index 2</text><text class="dg-note" x="263" y="190">5 swaps with 3</text>
 <text class="dg-label is-ink" x="438" y="172">After index 1</text><text class="dg-note" x="438" y="190">7 swaps with 2</text>
 <text class="dg-label is-ink" x="613" y="172">After index 0</text><text class="dg-note" x="613" y="190">9 sinks two levels</text>
</Diagram>

```py
def heapify(self, values):
    self.items = list(values)
    for i in range(len(self.items) // 2 - 1, -1, -1):
        self._sift_down(i)
```

## Uyum bilan saralaş {#heap-sort}

Avval maksimum uyum yasang. Ildizni uyumning oxirgi katagiga köçiring va uyumni bir katakka qisqartiring. Yangi ildizni pastga siljiting. Saralangan qism öngdan çapga qarab ösadi. Eng yomon vaqt `O(n log n)`, qöşimça joy `O(1)`.

<Diagram label="Heap sort [5, 2, 9, 1, 7]" cost="O(n log n)" :width="600" :height="240" alt="Heap sort on 5, 2, 9, 1, 7, one row per step. Heapify as a max-heap gives 9, 7, 5, 1, 2, with the largest first. Then the first item is swapped with the last item of the heap part, and the new first item sinks: 9 goes to the end, then 7, then 5, then 2. The sorted part, filled, grows from the right until the list reads 1, 2, 5, 7, 9.">
 <text class="dg-note end" x="156" y="38">start</text><DCells :x="170" :y="20" :w="40" :h="28" :values="[5, 2, 9, 1, 7]" />
 <text class="dg-note end" x="156" y="74">max-heap</text><DCells :x="170" :y="56" :w="40" :h="28" :values="[9, 7, 5, 1, 2]" /><text class="dg-note start" x="386" y="74">largest at the front</text>
 <text class="dg-note end" x="156" y="110">swap 1</text><DCells :x="170" :y="92" :w="40" :h="28" :values="[7, 2, 5, 1, 9]" :states="{ 4: 'hit' }" /><text class="dg-note start" x="386" y="110">9 to the end, 2 sinks</text>
 <text class="dg-note end" x="156" y="146">swap 2</text><DCells :x="170" :y="128" :w="40" :h="28" :values="[5, 2, 1, 7, 9]" :states="{ 3: 'hit', 4: 'hit' }" /><text class="dg-note start" x="386" y="146">7 to the end, 1 sinks</text>
 <text class="dg-note end" x="156" y="182">swap 3</text><DCells :x="170" :y="164" :w="40" :h="28" :values="[2, 1, 5, 7, 9]" :states="{ 2: 'hit', 3: 'hit', 4: 'hit' }" /><text class="dg-note start" x="386" y="182">5 to the end, 1 sinks</text>
 <text class="dg-note end" x="156" y="218">swap 4</text><DCells :x="170" :y="200" :w="40" :h="28" :values="[1, 2, 5, 7, 9]" :states="{ 0: 'hit', 1: 'hit', 2: 'hit', 3: 'hit', 4: 'hit' }" /><text class="dg-note start" x="386" y="218">2 to the end: sorted</text>
</Diagram>

```python
def sift_down(items, i, size):
    while True:
        child = 2 * i + 1
        if child >= size:
            return
        if child + 1 < size and items[child + 1] > items[child]:
            child += 1
        if items[i] >= items[child]:
            return
        items[i], items[child] = items[child], items[i]
        i = child

def heap_sort(items):
    n = len(items)
    for i in range(n // 2 - 1, -1, -1):
        sift_down(items, i, n)
    for end in range(n - 1, 0, -1):
        items[0], items[end] = items[end], items[0]
        sift_down(items, 0, end)

numbers = [5, 2, 9, 1, 7]
heap_sort(numbers)
print(numbers)
```

## Töliq dastur {#full-implementation}

`MinHeap` qiymatlarni massivda saqlaydi. `push` yuqoriga, `pop` va `heapify` pastga siljitadi.

```python
class MinHeap:
    def __init__(self):
        self.items = []

    def __len__(self):  # O(1)
        return len(self.items)

    def is_empty(self):  # O(1)
        return len(self.items) == 0

    def peek(self):  # O(1)
        if self.is_empty():
            raise IndexError('peek at an empty heap')
        return self.items[0]

    def push(self, value):  # O(log n) amortized
        self.items.append(value)
        i = len(self.items) - 1
        while i > 0:
            parent = (i - 1) // 2
            if self.items[parent] <= self.items[i]:
                break
            self.items[i], self.items[parent] = self.items[parent], self.items[i]
            i = parent

    def pop(self):  # O(log n) amortized
        if self.is_empty():
            raise IndexError('pop from an empty heap')
        smallest = self.items[0]
        last = self.items.pop()
        if self.items:
            self.items[0] = last
            self._sift_down(0)
        return smallest

    def heapify(self, values):  # O(n)
        self.items = list(values)
        for i in range(len(self.items) // 2 - 1, -1, -1):
            self._sift_down(i)

    def _sift_down(self, i):  # O(log n)
        size = len(self.items)
        while True:
            child = 2 * i + 1
            if child >= size:
                break
            if child + 1 < size and self.items[child + 1] < self.items[child]:
                child += 1
            if self.items[i] <= self.items[child]:
                break
            self.items[i], self.items[child] = self.items[child], self.items[i]
            i = child

heap = MinHeap()
for value in [2, 4, 3, 9, 7, 8, 5]:
    heap.push(value)
print(heap.items)

heap.push(1)
print(heap.items)
print(heap.pop(), heap.pop())
print(heap.items, len(heap))

built = MinHeap()
built.heapify([9, 7, 5, 4, 2, 8, 3])
print(built.items, built.peek())

empty = MinHeap()
print(empty.is_empty())
try:
    empty.pop()
except IndexError as error:
    print('IndexError:', error)
```

## Python tilida {#in-python}

`heapq` oddiy röyxatni minimum uyum sifatida yuritadi. `heappush`, `heappop` va `heapify` asosiy amallar. Maxsus navbatda `(priority, order, task)` juft ustuvorliklarda vazifalarni taqqoslaşning oldini oladi. Python 3.14 dan `*_max` amallari ham bor.

```python
import heapq
from itertools import count

tasks = []
try:
    heapq.heappush(tasks, (2, {'name': 'write tests'}))
    heapq.heappush(tasks, (2, {'name': 'update the docs'}))
except TypeError as error:
    print('TypeError:', error)

tasks = []
order = count()
heapq.heappush(tasks, (2, next(order), {'name': 'write tests'}))
heapq.heappush(tasks, (1, next(order), {'name': 'fix the login bug'}))
heapq.heappush(tasks, (2, next(order), {'name': 'update the docs'}))
while tasks:
    priority, _, task = heapq.heappop(tasks)
    print(priority, task['name'])

numbers = [5, 1, 8, 3, 9, 2]
heapq.heapify(numbers)
print(numbers, numbers[0], numbers[-1])

negated = [-value for value in [5, 1, 8, 3]]
heapq.heapify(negated)
print(-heapq.heappop(negated))
```

## Amallar xarajati {#costs-at-a-glance}

Ildizni öqiş `O(1)`, `n` qiymatdan uyum yasaş `O(n)`. Qöşiş va olişda siljitiş `O(log n)). Python röyxati ayrim amallarda siğimini özgartirgani uçun umumiy xarajat amortizatsiya bilan olinadi.

## Qayerda işlatiladi {#when-to-use}

Yangi qiymatlar kelib, eng kiçik yoki eng kattasini takroran oliş kerak bölsa, uyumdan foydalaning. Har qanday qiymatni qidiriş yoki barça qiymatlarni tartibda öqiş uçun qidiruv daraxti mosroq.

## Amaliy misollar {#application}

Vazifalarni ustuvorlik böyiça bajariş, eng yaxşi `k` ta natijani saqlaş va [Dijkstra algoritmida](/uz/graphs/shortest-paths) eng yaqin nomzodni tanlaş uyumga mos.

```python
import heapq

def top_k(values, k):
    heap = []
    for value in values:
        heapq.heappush(heap, value)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(heap, reverse=True)

scores = [42, 17, 93, 8, 77, 64, 51, 99, 23]
print(top_k(scores, 3))
print(heapq.nlargest(3, scores))
```

## Xulosa {#key-points}

Uyum faqat ota va bola orasidagi tartibni kafolatlaydi. Daraxt yaxlit bölgani uçun qatlamlar soni logarifmik. Birdaniga uyum yasaş har qiymatni alohida qöşişdan tezroq.

## Maşq {#exercise}

`MinHeap` ga `replace(value)` qöşing. Eski eng kiçik qiymatni olib qaytarsin, yangi qiymatni bitta pastga siljitiş bilan joylasin. Böş uyumda `IndexError` keltiring.

```python
class MinHeap:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def heapify(self, values):
        self.items = list(values)
        for i in range(len(self.items) // 2 - 1, -1, -1):
            self._sift_down(i)

    def _sift_down(self, i):
        size = len(self.items)
        while True:
            child = 2 * i + 1
            if child >= size:
                break
            if child + 1 < size and self.items[child + 1] < self.items[child]:
                child += 1
            if self.items[i] <= self.items[child]:
                break
            self.items[i], self.items[child] = self.items[child], self.items[i]
            i = child

    def replace(self, value):
        pass

heap = MinHeap()
heap.heapify([2, 4, 3, 9, 7, 8, 5])
print(heap.replace(6), heap.items)
print(heap.replace(1), heap.items)
try:
    MinHeap().replace(1)
except IndexError as error:
    print('IndexError:', error)
```

::: details Yeçim
Ildizni saqlang, örniga yangi qiymatni yozing va `_sift_down(0)` ni çaqiring. Yangi qiymat undan ham kiçik bölsa ham eski ildiz qaytadi. Vaqt `O(log n)`, qöşimça joy `O(1)`.

```python
class MinHeap:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def heapify(self, values):
        self.items = list(values)
        for i in range(len(self.items) // 2 - 1, -1, -1):
            self._sift_down(i)

    def _sift_down(self, i):
        size = len(self.items)
        while True:
            child = 2 * i + 1
            if child >= size:
                break
            if child + 1 < size and self.items[child + 1] < self.items[child]:
                child += 1
            if self.items[i] <= self.items[child]:
                break
            self.items[i], self.items[child] = self.items[child], self.items[i]
            i = child

    def replace(self, value):
        if self.is_empty():
            raise IndexError('replace on an empty heap')
        smallest = self.items[0]
        self.items[0] = value
        self._sift_down(0)
        return smallest

heap = MinHeap()
heap.heapify([2, 4, 3, 9, 7, 8, 5])
print(heap.replace(6), heap.items)
print(heap.replace(1), heap.items)
try:
    MinHeap().replace(1)
except IndexError as error:
    print('IndexError:', error)
```

:::
