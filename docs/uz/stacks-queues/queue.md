---
title: Navbat
description: "Printerga bir neçta hujjat yuborilsa, ular navbatga qöyiladi. Yangi hujjat navbat oxiriga qöşiladi, printer esa navbat boşidagi hujjatni oladi. Bu tartib FIFO deb ataladi. Birinçi kirgan element birinçi çiqadi."
---

# Navbat

Printerga bir neçta hujjat yuborilsa, ular navbatga qöyiladi. Yangi hujjat navbat oxiriga qöşiladi, printer esa navbat boşidagi hujjatni oladi. Bu tartib FIFO deb ataladi. Birinçi kirgan element birinçi çiqadi.

Avval [Massiv](/uz/arrays/array), [Bir tomonlama boğlangan röyxat](/uz/linked-lists/singly-linked-list) va [Stek](/uz/stacks-queues/stack) darslarini öqing.

## Amallar {#interface}

`enqueue` oxiriga qöşadi, `dequeue` boşidan olib qaytaradi, `peek` boşidagi qiymatni öqiydi. Oxirgi ikki amal böş navbatda `IndexError` beradi.

## Körinişi {#shape}

Rasmda navbatning boşi va oxiri körsatildi. Qöşiş va oliş turli uçlarda bajariladi.

<Diagram label="Anatomy" :width="560" :height="116" alt="A queue holding 12, 7, 3 and 9. Items leave from the front, where 12 is, and join at the rear, after 9.">
 <DCells :x="184" :y="50" :values="[12, 7, 3, 9]" :marks="{ 0: 'front', 3: 'rear' }" />
 <DArrow :from="[178, 70]" :to="[132, 70]" kind="accent" /><text class="dg-label is-accent end" x="124" y="74">Dequeue</text>
 <DArrow :from="[428, 70]" :to="[382, 70]" kind="accent" /><text class="dg-label is-accent start" x="436" y="74">Enqueue</text>
</Diagram>

## Röyxatning boşidan oliş {#the-trap-with-a-list}

`list.append` tez bajariladi. `pop(0)` qolgan barça elementni bir katak çapga suradi. Navbat uzun bölsa, har bir oliş `O(n)` vaqt oladi.

## Aylana bufer {#circular-buffer}

Elementlar joyida qoladi, `front` indeksi esa yuradi. Kataklar tugaganda indeks noldan davom etadi. `size` qaysi kataklar bandligini aniqlaydi.

<Diagram label="Circular buffer" cost="O(1) dequeue · O(1) amortized enqueue" :width="560" :height="170" alt="An array of six cells used as a ring. The front is at index 3. The items 9, 5 and 4 fill indexes 3 to 5, and the newest item, 8, wraps around to index 0.">
 <DCells :x="136" :y="50" :values="[8, null, null, 9, 5, 4]" :states="{ 0: 'new', 1: 'ghost', 2: 'ghost' }" :marks="{ 3: 'front', 0: 'rear' }" indices />
 <DArrow :from="[400, 122]" :via="[[400, 138], [160, 138]]" :to="[160, 122]" kind="accent" />
 <text class="dg-note is-accent" x="280" y="156">after the last cell, the rear wraps to index 0</text>
</Diagram>

```py
def __init__(self, capacity=4):
    self.items = [None] * max(1, capacity)
    self.front = 0
    self.size = 0
```

## Oxiriga qöşiş {#enqueue}

Bufer tölganida avval uni kengaytiring. Yangi elementni `(front + size) % capacity` indeksiga yozing. `size` ni bittaga oşiring.

<Diagram label="Enqueue 9" cost="O(1) amortized" :width="640" :height="232" alt="Before: 12, 7 and 3 fill indexes 0 to 2 of a six-cell array, with the front at index 0 and the rear at index 2. After enqueue(9): 9 is written at index (0 + 3) % 6 = 3, which becomes the rear. Nothing else moves.">
 <text class="dg-note end" x="118" y="74">before</text>
 <DCells :x="130" :y="50" :values="[12, 7, 3, null, null, null]" :states="{ 3: 'ghost', 4: 'ghost', 5: 'ghost' }" :marks="{ 0: 'front', 2: 'rear' }" indices />
 <text class="dg-note start" x="434" y="74">front 0 · size 3</text>
 <text class="dg-note end" x="118" y="184">after</text>
 <DCells :x="130" :y="160" :values="[12, 7, 3, 9, null, null]" :states="{ 3: 'new', 4: 'ghost', 5: 'ghost' }" :marks="{ 0: 'front', 3: 'rear' }" indices />
 <text class="dg-note is-accent start" x="434" y="184">index (0 + 3) % 6 = 3</text>
</Diagram>

```py
def enqueue(self, value):
    if self.size == len(self.items):
        self._resize(2 * len(self.items))
    rear = (self.front + self.size) % len(self.items)
    self.items[rear] = value
    self.size += 1
```

## Boşidan oliş {#dequeue}

`front` dagi qiymatni saqlang va katakni `None` bilan tozalang. `front = (front + 1) % capacity` qilib, `size` ni kamaytiring. Navbat böş bölsa `IndexError` keltiring.

<Diagram label="Dequeue" cost="O(1)" :width="640" :height="232" alt="Before: 12, 7, 3 and 9 fill indexes 0 to 3, with the front at index 0. After dequeue: index 0 is empty, the front has moved to index 1, and 12 is returned. Nothing else moves.">
 <text class="dg-note end" x="118" y="74">before</text>
 <DCells :x="130" :y="50" :values="[12, 7, 3, 9, null, null]" :states="{ 4: 'ghost', 5: 'ghost' }" :marks="{ 0: 'front', 3: 'rear' }" indices />
 <text class="dg-note start" x="434" y="74">front 0 · size 4</text>
 <text class="dg-note end" x="118" y="184">after</text>
 <DCells :x="130" :y="160" :values="[null, 7, 3, 9, null, null]" :states="{ 0: 'ghost', 4: 'ghost', 5: 'ghost' }" :marks="{ 1: 'front', 3: 'rear' }" indices />
 <text class="dg-note is-accent start" x="434" y="184">returns 12 · front 1 · size 3</text>
</Diagram>

```py
def dequeue(self):
    if self.size == 0:
        raise IndexError('dequeue from an empty queue')
    value = self.items[self.front]
    self.items[self.front] = None
    self.front = (self.front + 1) % len(self.items)
    self.size -= 1
    return value
```

## Boşini öqiş {#peek}

Navbat böşligini tekşirib, `front` dagi qiymatni qaytaring. Indeks va ölçam özgarmaydi.

<Diagram label="Peek" cost="O(1)" :width="640" :height="122" alt="The buffer holds 7, 3 and 9 in indexes 1 to 3, with the front at index 1. Peek returns 7, the front item, and changes nothing.">
 <DCells :x="130" :y="50" :values="[null, 7, 3, 9, null, null]" :states="{ 0: 'ghost', 1: 'hit', 4: 'ghost', 5: 'ghost' }" :marks="{ 1: 'front', 3: 'rear' }" indices />
 <text class="dg-note is-accent start" x="434" y="74">peek() returns 7, nothing moves</text>
</Diagram>

```py
def peek(self):
    if self.size == 0:
        raise IndexError('peek at an empty queue')
    return self.items[self.front]
```

## Buferni kengaytiriş {#growing-the-buffer}

Ikki baravar katta bufer ajrating. Eski buferdagi elementlarni `front` dan aylana tartibida öqib, yangi buferga noldan boşlab yozing. Yangi `front` nol böladi.

<Diagram label="Grow from 4 to 8 cells" cost="O(n)" :width="640" :height="285" alt="A full array of four cells holds 3, 9, 12 and 7 in indexes 0 to 3. The front is index 2, so the queue order is 12, 7, 3, 9, wrapping from index 3 back to index 0. Enqueueing 5 needs room, so the items are copied into a new array of eight cells in queue order, numbered 1 to 4: 12 from index 2 first, then 7, then 3, then 9. They land in indexes 0 to 3, the front becomes index 0, and 5 goes to index 4.">
 <text class="dg-note end" x="118" y="74">old</text>
 <DCells :x="130" :y="50" :values="[3, 9, 12, 7]" :marks="{ 1: 'rear', 2: 'front' }" indices />
 <text class="dg-note start" x="338" y="74">full, so enqueue(5) must grow</text>
 <DStep :x="250" :y="126" :n="1" /><DStep :x="298" :y="126" :n="2" /><DStep :x="154" :y="126" :n="3" /><DStep :x="202" :y="126" :n="4" />
 <text class="dg-note end" x="118" y="214">new</text>
 <DCells :x="130" :y="190" :values="[12, 7, 3, 9, 5, null, null, null]" :states="{ 4: 'new', 5: 'ghost', 6: 'ghost', 7: 'ghost' }" :marks="{ 0: 'front', 4: 'rear' }" indices />
 <text class="dg-note start" x="530" y="214">front 0 · size 5</text>
 <DStep :x="154" :y="266" :n="1" /><DStep :x="202" :y="266" :n="2" /><DStep :x="250" :y="266" :n="3" /><DStep :x="298" :y="266" :n="4" />
</Diagram>

```py
def _resize(self, capacity):
    old = self.items
    self.items = [None] * capacity
    for i in range(self.size):
        self.items[i] = old[(self.front + i) % len(old)]
    self.front = 0
```

## Töliq dastur {#full-implementation}

Misolda 8 nolinçi katakka aylanib ötadi. 1 va 2 böş kataklarni töldiradi. 6 qöşilganda bufer kengayadi va navbat tartibida qayta joylanadi.

```python
class Queue:
    def __init__(self, capacity=4):  # O(capacity)
        self.items = [None] * max(1, capacity)
        self.front = 0
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def is_empty(self):  # O(1)
        return self.size == 0

    def enqueue(self, value):  # O(1) amortized
        if self.size == len(self.items):
            self._resize(2 * len(self.items))
        rear = (self.front + self.size) % len(self.items)
        self.items[rear] = value
        self.size += 1

    def _resize(self, capacity):  # O(n)
        old = self.items
        self.items = [None] * capacity
        for i in range(self.size):
            self.items[i] = old[(self.front + i) % len(old)]
        self.front = 0

    def dequeue(self):  # O(1)
        if self.size == 0:
            raise IndexError('dequeue from an empty queue')
        value = self.items[self.front]
        self.items[self.front] = None
        self.front = (self.front + 1) % len(self.items)
        self.size -= 1
        return value

    def peek(self):  # O(1)
        if self.size == 0:
            raise IndexError('peek at an empty queue')
        return self.items[self.front]

queue = Queue(6)
for value in [12, 7, 3, 9, 5, 4]:
    queue.enqueue(value)
print(queue.dequeue(), queue.dequeue(), queue.dequeue())

queue.enqueue(8)
print(queue.items)

for value in [1, 2, 6]:
    queue.enqueue(value)
print(queue.items)
print(queue.peek(), len(queue))
```

## Boğlangan navbat {#linked-queue}

Bir tomonlama röyxatda oxirgi tugun ham saqlansa, oxiriga qöşiş va boşidan oliş `O(1)`. Har element uçun alohida tugun yaratiladi.

<Diagram label="Linked queue" cost="O(1) enqueue and dequeue" :width="676" :height="150" alt="The queue 12, 7, 3, 9 as a linked list. HEAD refers to 12, the front, where dequeue removes. TAIL refers to 9, the rear, where enqueue adds the next node. 9 links to None.">
 <text class="dg-name" x="50" y="98">HEAD</text>
 <DArrow :from="[76, 98]" :to="[118, 98]" kind="accent" />
 <DChain :x="120" :y="80" :values="[12, 7, 3, 9]" />
 <text class="dg-name" x="534" y="24">TAIL</text>
 <DArrow :from="[534, 34]" :to="[534, 78]" kind="accent" />
 <text class="dg-note" x="162" y="136">front · dequeue here</text>
 <text class="dg-note" x="534" y="136">rear · enqueue after it</text>
</Diagram>

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedQueue:
    def __init__(self):  # O(1)
        self.head = None
        self.tail = None
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def is_empty(self):  # O(1)
        return self.size == 0

    def enqueue(self, value):  # O(1)
        node = Node(value)
        if self.tail is None:
            self.head = node
        else:
            self.tail.next = node
        self.tail = node
        self.size += 1

    def dequeue(self):  # O(1)
        if self.is_empty():
            raise IndexError('dequeue from an empty queue')
        node = self.head
        self.head = node.next
        if self.head is None:
            self.tail = None
        self.size -= 1
        return node.value

    def peek(self):  # O(1)
        if self.is_empty():
            raise IndexError('peek at an empty queue')
        return self.head.value

queue = LinkedQueue()
for value in [12, 7, 3, 9]:
    queue.enqueue(value)
print(queue.dequeue(), queue.dequeue())
queue.enqueue(5)
print(queue.peek(), len(queue))

while not queue.is_empty():
    queue.dequeue()
queue.enqueue(8)
print(queue.peek(), len(queue))
```

## Ikki uçli navbat {#deque}

`deque` ning har bir uçiga qöşiş va har bir uçidan oliş mumkin. CPython uni ikki tomonlama boğlangan bloklardan tuzadi. Örtadagi indeksga yetiş uçun bloklar böylab yuradi.

<Diagram label="Deque" cost="O(1) at both ends" :width="560" :height="100" alt="A deque holding 7, 3 and 9. Items can be added or removed on the left with appendleft and popleft, and on the right with append and pop.">
 <DCells :x="208" :y="40" :values="[7, 3, 9]" />
 <DArrow :from="[152, 52]" :to="[204, 52]" kind="accent" /><text class="dg-note is-accent end" x="144" y="56">appendleft</text>
 <DArrow :from="[204, 68]" :to="[152, 68]" kind="accent" /><text class="dg-note is-accent end" x="144" y="72">popleft</text>
 <DArrow :from="[408, 52]" :to="[356, 52]" kind="accent" /><text class="dg-note is-accent start" x="416" y="56">append</text>
 <DArrow :from="[356, 68]" :to="[408, 68]" kind="accent" /><text class="dg-note is-accent start" x="416" y="72">pop</text>
</Diagram>

```python
from collections import deque

items = deque([7, 3, 9])
items.appendleft(1)
items.append(4)
print(items)
print(items.popleft(), items.pop())
print(items[1])

recent = deque(maxlen=3)
for value in [12, 7, 3, 9, 5]:
    recent.append(value)
print(recent)

ring = deque([1, 2, 3, 4, 5])
ring.rotate(2)
print(ring)
ring.rotate(-1)
print(ring)
```

## Python tilida {#in-python}

`collections.deque` da `append` oxiriga qöşadi, `popleft` boşidan oladi. `items[0]` birinçi qiymatni öqiydi. `pop()` esa oxiridan oladi. Oqimlar orasida işlaydigan navbat uçun `queue.Queue` ham bor.

```python
import queue
from collections import deque

line = deque()
for name in ['Ana', 'Ben', 'Cho']:
    line.append(name)
print(line[0])
print(line.popleft())
print(len(line), list(line))

jobs = queue.Queue()
jobs.put('print report')
jobs.put('send email')
print(jobs.get())
print(jobs.qsize())
```

## Amallar xarajati {#costs-at-a-glance}

Aylana buferda oxiriga qöşiş amortizatsiya bilan `O(1)`, boşidan oliş `O(1)`. Bufer qisqarmaydi, şuning uçun xotira ilgari saqlangan eng köp elementlar soniga ham boğliq.

## Qayerda işlatiladi {#when-to-use}

Vazifalar kelgan tartibida bajariladigan joylarda navbat kerak. Siğimi oldindan maʼlum buferda tölib qoliş holati alohida boşqariladi.

## Amaliy misollar {#application}

[Kenglik böyiça qidiruv](/uz/graphs/graph#breadth-first-search) topilgan tugunlarni navbatga qöyadi. Printer, server va kelgan xabarlarni qayta işlovçi dasturlarda ham keluv tartibi saqlanişi mumkin.

```python
from collections import deque

def round_robin(jobs, time_slice):
    waiting = deque(jobs)
    clock = 0
    while waiting:
        name, left = waiting.popleft()
        run = min(time_slice, left)
        clock += run
        if left > run:
            waiting.append((name, left - run))
        else:
            print(f'{name} finishes at time {clock}')

round_robin([('A', 3), ('B', 5), ('C', 2)], 2)
```

## Xulosa {#key-points}

Navbatga oxiridan qöşiladi va boşidan olinadi. Aylana bufer kataklarni siljitmaydi. Python dasturida bu iş uçun `deque` odatda yetarli.

## Maşq {#exercise}

Ikki stekdan navbat yasang. Ikki Python röyxatida faqat `append`, `pop()` va böşlik tekşiruvidan foydalaning. `enqueue` birinçi stekka qöşsin. Böş navbatda `IndexError('dequeue from an empty queue')` keltiring.

```python
class Queue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def enqueue(self, value):
        pass

    def dequeue(self):
        pass

queue = Queue()
queue.enqueue(12)
queue.enqueue(7)
print(queue.dequeue())
queue.enqueue(3)
print(queue.dequeue())
print(queue.dequeue())
try:
    queue.dequeue()
except IndexError as error:
    print(error)
```

::: details Yeçim
`outbox` böşagandagina `inbox` dagi barça elementni unga ötkazing. Şu köçiriş ularning tartibini teskarilaydi. Har element köpi bilan bir marta köçadi, şu sabab har amal amortizatsiya bilan `O(1)`. Xotira `O(n)`.

```python
class Queue:
    def __init__(self):
        self.inbox = []
        self.outbox = []

    def enqueue(self, value):
        self.inbox.append(value)

    def dequeue(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
        if not self.outbox:
            raise IndexError('dequeue from an empty queue')
        return self.outbox.pop()

queue = Queue()
queue.enqueue(12)
queue.enqueue(7)
print(queue.dequeue())
queue.enqueue(3)
print(queue.dequeue())
print(queue.dequeue())
try:
    queue.dequeue()
except IndexError as error:
    print(error)
```

:::
