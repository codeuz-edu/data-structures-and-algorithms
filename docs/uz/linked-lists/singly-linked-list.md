---
title: Bir tomonlama boğlangan röyxat
description: "Boğlangan röyxat tugunlar zanjiridir. Har tugun bitta qiymatni va özidan keyingi tugunga havolani saqlaydi. Birinçi tugun head, oxirgisi tail bilan belgilanadi. Oxirgi tugunning next maydoni None."
---

# Bir tomonlama boğlangan röyxat

Boğlangan röyxat tugunlar zanjiridir. Har tugun bitta qiymatni va özidan keyingi tugunga havolani saqlaydi. Birinçi tugun `head`, oxirgisi `tail` bilan belgilanadi. Oxirgi tugunning `next` maydoni `None`.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) va [Havolalar va xotira](/uz/foundations/references) darslarini öqing.

## Amallar {#interface}

`push_front`, `pop_front` va `push_back` doimiy vaqt oladi. `insert_after` ham, agar şu röyxatdagi kerakli tugun qölimizda bölsa, `O(1)`. Qiymat böyiça `search` va `delete` eng yomon holatda `O(n)`. Böş röyxatning boşidan oliş `IndexError`, yöq qiymatni öçiriş `ValueError` beradi.

## Tugun {#the-node}

`value` qiymatni saqlaydi, `next` keyingi tugunga boğlaydi. Röyxatni birinçi tugundan boşlab, har safar `cur = cur.next` bilan keyingisiga ötib öqiymiz. `None` ga yetganimizda yuruv tugaydi.

<LinkedListAnatomy />

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
```

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

head = Node(12)
head.next = Node(7)
head.next.next = Node(3)

cur = head
while cur is not None:
    print(cur.value)
    cur = cur.next
```

```py
class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0
```

## Uzunlik {#length}

Har qöşiş `size` ni bittaga oşiradi, har öçiriş bittaga kamaytiradi. Şu hisoblagiç borligi uçun `len` butun zanjirni aylanmasdan `O(1)` da javob beradi.

```py
def __len__(self):
    return self.size

def is_empty(self):
    return self.size == 0
```

## Boşiga qöşiş {#insert-at-the-head}

Yangi tugunning `next` maydoniga eski `head` ni yozing. Keyin `head` ni yangi tugunga boğlang. Röyxat oldin böş bölsa, `tail` ham şu tugunga boğlanadi.

<LinkedListInsertHead />

```py
def push_front(self, value):
    new = Node(value)
    new.next = self.head
    self.head = new
    if self.tail is None:
        self.tail = new
    self.size += 1
```

## Boşidan oliş {#remove-the-head}

Birinçi tugunni vaqtinçalik saqlang. `head` ni uning `next` maydoniga tenglang. Röyxat böşab qolsa, `tail = None` qiling. `size` ni kamaytiring va eski tugun qiymatini qaytaring.

<LinkedListRemoveHead />

```py
def pop_front(self):
    if self.head is None:
        raise IndexError('pop from an empty list')
    node = self.head
    self.head = node.next
    if self.head is None:
        self.tail = None
    self.size -= 1
    return node.value
```

## Oxiriga qöşiş {#insert-at-the-tail}

`tail` oxirgi tugunga bevosita olib boradi. Undagi `next` ni yangi tugunga boğlang va `tail` ni yangilang. Röyxat böş bölsa, `head` ni ham yangilang.

<LinkedListInsertTail />

```py
def push_back(self, value):
    new = Node(value)
    if self.tail is None:
        self.head = new
    else:
        self.tail.next = new
    self.tail = new
    self.size += 1
```

## Tugundan keyin qöşiş {#insert-after-a-node}

Avval `new.next = node.next` bilan zanjirning qolgan qismini saqlang. Keyin `node.next = new` qiling. `node` eski `tail` bölsa, `tail` ni yangi tugunga köçiring.

<LinkedListInsertAfter />

```py
def insert_after(self, node, value):
    new = Node(value)
    new.next = node.next
    node.next = new
    if node is self.tail:
        self.tail = new
    self.size += 1
```

## Tugunni öçiriş {#delete-a-node}

`delete(value)` birinçi mos qiymatni topadi. Oldingi tugunning `next` maydonini öçiriladigan tugundan keyingisiga boğlang. Boş tugun öçirilsa `head` ni, oxirgisi öçirilsa `tail` ni yangilang.

<LinkedListDelete />

```py
def delete(self, value):
    if self.head is None:
        raise ValueError(f'{value} is not in the list')
    if self.head.value == value:
        self.pop_front()
        return
    prev = self.head
    while prev.next is not None and prev.next.value != value:
        prev = prev.next
    target = prev.next
    if target is None:
        raise ValueError(f'{value} is not in the list')
    prev.next = target.next
    if target is self.tail:
        self.tail = prev
    self.size -= 1
```

### Soxta boş tugun {#a-sentinel-head}

Soxta tugun har doim birinçi haqiqiy tugunning oldida turadi. Bunda har haqiqiy tugunning oldingi tuguni bor. Qidiruvni soxta tugundan boşlasak, birinçi qiymatni öçiriş uçun alohida holat kerak bölmaydi.

<Diagram label="Sentinel head" :width="620" :height="112" alt="A sentinel node with no value sits in front of the real nodes 12, 7 and 3, so even the first real node has a node before it. The walk in delete starts with prev on the sentinel.">
 <text class="dg-note is-accent" x="102" y="18">prev starts here</text><DArrow :from="[102, 24]" :to="[102, 37]" kind="accent" />
 <DChain :x="60" :y="40" :values="['', 12, 7, 3]" :states="['muted']" />
 <text class="dg-note" x="102" y="100">sentinel</text>
 <text class="dg-note" x="226" y="100">first real node</text>
</Diagram>

```py
def __init__(self):
    self.sentinel = Node(None)
    self.tail = self.sentinel
    self.size = 0

def delete(self, value):
    prev = self.sentinel
    while prev.next is not None and prev.next.value != value:
        prev = prev.next
    target = prev.next
    if target is None:
        raise ValueError(f'{value} is not in the list')
    prev.next = target.next
    if target is self.tail:
        self.tail = prev
    self.size -= 1
```

## Qidiriş {#search}

`head` dan yuring. `cur.value == value` bajarilsa, şu tugunni qaytaring. `None` ga yetganda qiymat topilmagan böladi.

<LinkedListSearch />

```py
def search(self, value):
    cur = self.head
    while cur is not None:
        if cur.value == value:
            return cur
        cur = cur.next
    return None
```

## Öz joyida teskarilaş {#reverse-in-place}

`prev` teskari qilingan qismning boşi. `cur.next` ni özgartirişdan avval `nxt` da eski keyingi tugunni saqlang. Keyin `cur.next = prev` qiling va ikkala havolani siljiting. Eski `head` yangi `tail` böladi.

<LinkedListReverse />

```py
def reverse(self):
    self.tail = self.head
    prev, cur = None, self.head
    while cur is not None:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    self.head = prev
```

## Sekin va tez havolalar {#slow-and-fast-references}

`slow` bittadan, `fast` ikkitadan tugun ötsa, tez havola oxiriga yetganida sekini örtaga keladi. Halqa bölsa, tez havola sekiniga yetib oladi. Ikki havolani oldindan `k` qadam oraliqda qöyib, oxiridan `k`-tugunni ham topiş mumkin.

<LinkedListSlowFast />

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

def build(values):
    head = None
    for value in reversed(values):
        node = Node(value)
        node.next = head
        head = node
    return head

def middle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
    return slow

def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def kth_from_end(head, k):
    if k < 1:
        raise IndexError('index out of range')
    lead = head
    for _ in range(k):
        if lead is None:
            raise IndexError('index out of range')
        lead = lead.next
    trail = head
    while lead is not None:
        lead = lead.next
        trail = trail.next
    return trail

head = build([12, 7, 3, 9, 5])
print(middle(head).value, kth_from_end(head, 2).value, has_cycle(head))

last = kth_from_end(head, 1)
last.next = head.next.next
print(has_cycle(head))
```

## Töliq dastur {#full-implementation}

`SinglyLinkedList` bosh va oxirgi tugunni hamda uzunlikni saqlaydi. `__iter__` tugunlardagi qiymatlarni boşidan oxirigaça beradi.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class SinglyLinkedList:
    def __init__(self):  # O(1)
        self.head = None
        self.tail = None
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def is_empty(self):  # O(1)
        return self.size == 0

    def __iter__(self):  # O(n)
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def push_front(self, value):  # O(1)
        new = Node(value)
        new.next = self.head
        self.head = new
        if self.tail is None:
            self.tail = new
        self.size += 1

    def pop_front(self):  # O(1)
        if self.head is None:
            raise IndexError('pop from an empty list')
        node = self.head
        self.head = node.next
        if self.head is None:
            self.tail = None
        self.size -= 1
        return node.value

    def push_back(self, value):  # O(1)
        new = Node(value)
        if self.tail is None:
            self.head = new
        else:
            self.tail.next = new
        self.tail = new
        self.size += 1

    def insert_after(self, node, value):  # O(1)
        new = Node(value)
        new.next = node.next
        node.next = new
        if node is self.tail:
            self.tail = new
        self.size += 1

    def delete(self, value):  # O(n)
        if self.head is None:
            raise ValueError(f'{value} is not in the list')
        if self.head.value == value:
            self.pop_front()
            return
        prev = self.head
        while prev.next is not None and prev.next.value != value:
            prev = prev.next
        target = prev.next
        if target is None:
            raise ValueError(f'{value} is not in the list')
        prev.next = target.next
        if target is self.tail:
            self.tail = prev
        self.size -= 1

    def search(self, value):  # O(n)
        cur = self.head
        while cur is not None:
            if cur.value == value:
                return cur
            cur = cur.next
        return None

    def reverse(self):  # O(n)
        self.tail = self.head
        prev, cur = None, self.head
        while cur is not None:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt
        self.head = prev

numbers = SinglyLinkedList()
for value in [9, 3, 7, 12]:
    numbers.push_front(value)
numbers.push_back(5)
print(list(numbers), len(numbers))

numbers.insert_after(numbers.search(7), 4)
numbers.delete(3)
print(list(numbers))

print(numbers.pop_front())
numbers.reverse()
print(list(numbers), numbers.head.value, numbers.tail.value)

try:
    numbers.delete(42)
except ValueError as error:
    print('ValueError:', error)
```

## Python tilida {#in-python}

Ikkala uçda tez işlaş uçun `collections.deque` mavjud. `appendleft`, `popleft` va `append` `O(1)`, qiymatni topib öçiriş esa `O(n)`.

```python
from collections import deque

numbers = deque([7, 3])
numbers.appendleft(12)
numbers.append(9)
print(numbers.popleft(), list(numbers), len(numbers))

numbers.remove(3)
print(list(numbers))
print(numbers.pop(), list(numbers))
```

## Amallar xarajati {#costs-at-a-glance}

Boşiga qöşiş, boşidan oliş va `tail` bilan oxiriga qöşiş `O(1)`. Indeks yoki qiymat böyiça yuruv `O(n)`. Har tugun bitta qöşimça boğlamni saqlaydi.

## Qayerda işlatiladi {#when-to-use}

Iş asosan röyxat boşida yoki oldindan maʼlum tugundan keyin bajarilsa, bir tomonlama boğlam qulay. Qöşişda yangi tugun yaratiladi va bir neçta havola yangilanadi.

## Amaliy misol {#application}

Musiqa navbatida odatiy qöşiq oxiriga qöşiladi, navbatdagi qöşiq birinçi öringa qöyiladi. Ijroçi qöşiqni har doim boşdan oladi. Şu uç amal `O(1)`.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def __len__(self):
        return self.size

    def is_empty(self):
        return self.size == 0

    def push_front(self, value):
        new = Node(value)
        new.next = self.head
        self.head = new
        if self.tail is None:
            self.tail = new
        self.size += 1

    def pop_front(self):
        if self.head is None:
            raise IndexError('pop from an empty list')
        node = self.head
        self.head = node.next
        if self.head is None:
            self.tail = None
        self.size -= 1
        return node.value

    def push_back(self, value):
        new = Node(value)
        if self.tail is None:
            self.head = new
        else:
            self.tail.next = new
        self.tail = new
        self.size += 1

playlist = SinglyLinkedList()
for title in ['Intro', 'Blue', 'Rain']:
    playlist.push_back(title)

print('playing', playlist.pop_front())
playlist.push_front('Request')
playlist.push_back('Outro')

while not playlist.is_empty():
    title = playlist.pop_front()
    print('playing', title, '|', len(playlist), 'left')
```

## Xulosa {#key-points}

Bu röyxat oldinga qarab öqiladi. Oxiridan oldingi tugunga qaytiş kerak bölsa, boşidan qidirişga töğri keladi. Havolani özgartirişdan oldin kerakli eski havolani saqlang.

## Maşq {#exercise}

`pop_back` oxirgi tugunni olib, qiymatini qaytarsin. Böş röyxat uçun `IndexError('pop from an empty list')` keltiring. Bitta tugun qolgan holatda ham `head`, `tail` va `size` ni töğri yangilang.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def __len__(self):
        return self.size

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def push_back(self, value):
        new = Node(value)
        if self.tail is None:
            self.head = new
        else:
            self.tail.next = new
        self.tail = new
        self.size += 1

    def pop_back(self):
        pass

numbers = SinglyLinkedList()
for value in [12, 7, 3]:
    numbers.push_back(value)
for _ in range(3):
    value = numbers.pop_back()
    print(value, list(numbers), len(numbers))

numbers.push_back(5)
print(list(numbers))

try:
    SinglyLinkedList().pop_back()
except IndexError as error:
    print('IndexError:', error)
```

::: details Yeçim
`next` maydoni `tail` ga teng tugungaça yuring. U yangi `tail`, `tail.next` esa `None` böladi. Bitta tugunli röyxat böşaydi. Vaqt `O(n)`, qöşimça xotira `O(1)`.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def __len__(self):
        return self.size

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def push_back(self, value):
        new = Node(value)
        if self.tail is None:
            self.head = new
        else:
            self.tail.next = new
        self.tail = new
        self.size += 1

    def pop_back(self):
        if self.head is None:
            raise IndexError('pop from an empty list')
        node = self.tail
        if self.head is self.tail:
            self.head = None
            self.tail = None
        else:
            prev = self.head
            while prev.next is not self.tail:
                prev = prev.next
            prev.next = None
            self.tail = prev
        self.size -= 1
        return node.value

numbers = SinglyLinkedList()
for value in [12, 7, 3]:
    numbers.push_back(value)
for _ in range(3):
    value = numbers.pop_back()
    print(value, list(numbers), len(numbers))

numbers.push_back(5)
print(list(numbers))

try:
    SinglyLinkedList().pop_back()
except IndexError as error:
    print('IndexError:', error)
```

:::
