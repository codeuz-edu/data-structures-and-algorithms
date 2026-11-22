---
title: Ikki tomonlama boğlangan röyxat
description: "Ikki tomonlama boğlangan röyxatning har tuguni oldingi va keyingi qöşnisini biladi. Şu tariqa zanjirni ikki yönalişda öqiş, maʼlum tugunni esa qidiruvsiz ajratiş mumkin."
---

# Ikki tomonlama boğlangan röyxat

Ikki tomonlama boğlangan röyxatning har tuguni oldingi va keyingi qöşnisini biladi. Şu tariqa zanjirni ikki yönalişda öqiş, maʼlum tugunni esa qidiruvsiz ajratiş mumkin.

Avval [Bir tomonlama boğlangan röyxat](/uz/linked-lists/singly-linked-list) va [Havolalar va xotira](/uz/foundations/references) darslarini öqing.

## Amallar {#interface}

`push_front`, `push_back`, `pop_front` va `pop_back` `O(1)`. Tugun berilsa, yoniga qöşiş yoki uni öçiriş ham `O(1)`. Qiymat böyiça qidiriş `O(n)`. Böş röyxatdan oliş `IndexError` beradi.

## Tugun {#the-node}

Birinçi tugunning `prev` maydoni, oxirgisining `next` maydoni `None`. Röyxat `head`, `tail` va `size` ni saqlaydi. Tugunda qiymat, `prev` va `next` maydonlari bor.

<Diagram label="Anatomy" :width="580" :height="132" alt="Three nodes holding 12, 7 and 3. Each node has a prev reference, a value and a next reference. HEAD refers to the first node and TAIL to the last. The first node's prev and the last node's next are None.">
 <text class="dg-name" x="130" y="22">HEAD</text><DArrow :from="[130, 32]" :to="[130, 60]" kind="accent" />
 <text class="dg-name" x="430" y="22">TAIL</text><DArrow :from="[430, 32]" :to="[430, 60]" kind="accent" />
 <DDChain :x="80" :y="64" :values="[12, 7, 3]" />
 <text class="dg-note" x="91" y="116">prev</text><text class="dg-note" x="130" y="116">value</text><text class="dg-note" x="169" y="116">next</text>
</Diagram>

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None
```

```py
class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0
```

```py
def backwards(self):
    cur = self.tail
    while cur is not None:
        yield cur.value
        cur = cur.prev
```

## Uzunlik {#length}

`size` har bir qöşişda ortadi va `delete` da kamayadi. `len` hisoblagiçni bir amalda öqiydi.

```py
def __len__(self):
    return self.size
```

## Ikki uçdan qöşiş {#insert-at-either-end}

Oxiriga qöşişda `new.prev = tail`, keyin `tail.next = new` qiling va `tail` ni siljiting. Boşiga qöşişda `head` va teskari yönalişdagi havolalar yangilanadi. Böş röyxatdagi birinçi tugun ikkala uç hamdir.

<Diagram label="Insert 5 at the back" cost="O(1)" :width="690" :height="120" alt="Three nodes holding 12, 7 and 3, with HEAD on 12 and TAIL on 3. A new node 5 is added after 3: the next of 3 and the prev of 5 now refer to each other, and TAIL moves from 3 to 5.">
 <text class="dg-name" x="120" y="22">HEAD</text><DArrow :from="[120, 32]" :to="[120, 66]" />
 <text class="dg-name" x="420" y="22">TAIL</text><DArrow :from="[420, 32]" :to="[420, 66]" kind="removed" />
 <DArrow :from="[442, 22]" :via="[[570, 22]]" :to="[570, 66]" kind="accent" />
 <DDChain :x="70" :y="70" :values="[12, 7, 3, 5]" :states="['', '', '', 'new']" :links="['solid', 'solid', 'accent']" />
</Diagram>

```py
def push_back(self, value):
    new = Node(value)
    new.prev = self.tail
    if self.tail is not None:
        self.tail.next = new
    else:
        self.head = new
    self.tail = new
    self.size += 1
```

```py
def push_front(self, value):
    new = Node(value)
    new.next = self.head
    if self.head is not None:
        self.head.prev = new
    else:
        self.tail = new
    self.head = new
    self.size += 1
```

## Tugundan keyin qöşiş {#insert-after-a-node}

`new.prev = node` va `new.next = node.next` bilan yangi tugunni tayyorlang. Eski keyingi tugun bölsa, uning `prev` maydonini yangilang. Oxirida `node.next` yangi tugunga qaraydi va kerak bölsa `tail` yangilanadi.

<Diagram label="Insert 4 after 7" cost="O(1)" :width="610" :height="104" alt="A new node 4 is placed after node 7, between 7 and 3. Four references change: the next of 7, both references of 4, and the prev of 3.">
 <DDChain :x="30" :y="34" :values="[12, 7, 4, 3]" :states="['', '', 'new']" :links="['solid', 'accent', 'accent']" :ends="false" />
 <text class="dg-label is-accent" x="230" y="92">node</text>
</Diagram>

```py
def insert_after(self, node, value):
    new = Node(value)
    new.prev = node
    new.next = node.next
    if node.next is not None:
        node.next.prev = new
    else:
        self.tail = new
    node.next = new
    self.size += 1
```

## Tugundan oldin qöşiş {#insert-before-a-node}

`node.prev` oldingi tugunga olib boradi. U mavjud bölsa, uning ketidan qöşing. `prev` yöq bölsa, yangi tugun röyxat boşiga qöyiladi.

<Diagram label="Insert 4 before 7" cost="O(1)" :width="610" :height="104" alt="A new node 4 is placed before node 7, between 12 and 7. The same four references change as when inserting after 12.">
 <DDChain :x="30" :y="34" :values="[12, 4, 7, 3]" :states="['', 'new']" :links="['accent', 'accent', 'solid']" :ends="false" />
 <text class="dg-label is-accent" x="380" y="92">node</text>
</Diagram>

```py
def insert_before(self, node, value):
    if node.prev is None:
        self.push_front(value)
    else:
        self.insert_after(node.prev, value)
```

## Tugunni öçiriş {#delete-a-node}

`prev` va `next` maydonlari qöşnilarni töğridan-töğri topadi. Ikki qöşnini bir-biriga ulang. Bir tomonda tugun yöq bölsa, mos ravişda `head` yoki `tail` ni yangilang. Bu metodga şu röyxatga tegişli tugun berilişi kerak.

<Diagram label="Delete 7" cost="O(1)" :width="580" :height="146" alt="Node 7 is removed. The next of 12 now goes straight to 3, and the prev of 3 goes straight back to 12.">
 <DDChain :x="80" :y="60" :values="[12, 7, 3]" :states="['', 'ghost']" :links="['removed', 'removed']" />
 <DArrow :from="[169, 72]" :via="[[169, 36], [430, 36]]" :to="[430, 58]" kind="accent" /><DStep :x="300" :y="36" :n="1" />
 <DArrow :from="[391, 84]" :via="[[391, 122], [130, 122]]" :to="[130, 98]" kind="accent" /><DStep :x="300" :y="122" :n="2" />
</Diagram>

```py
def delete(self, node):
    if node.prev is not None:
        node.prev.next = node.next
    else:
        self.head = node.next
    if node.next is not None:
        node.next.prev = node.prev
    else:
        self.tail = node.prev
    node.prev = None
    node.next = None
    self.size -= 1
```

## Ikki uçdan oliş {#remove-at-either-end}

Böş röyxatni tekşiring. `head` yoki `tail` dagi tugunni saqlab, uni `delete` bilan ajrating va qiymatini qaytaring.

<Diagram label="Remove at the back" cost="O(1)" :width="600" :height="124" alt="Three nodes holding 12, 7 and 3, with HEAD on 12 and TAIL on 3. Node 3 is removed: the next of 7 now refers to None, TAIL moves back from 3 to 7, and the links between 7 and 3 go away.">
 <text class="dg-name" x="130" y="24">HEAD</text><DArrow :from="[130, 34]" :to="[130, 66]" />
 <text class="dg-name" x="430" y="24">TAIL</text><DArrow :from="[430, 34]" :to="[430, 66]" kind="removed" />
 <DArrow :from="[408, 24]" :via="[[280, 24]]" :to="[280, 66]" kind="accent" />
 <DDChain :x="80" :y="70" :values="[12, 7, 3]" :states="['', '', 'ghost']" :links="['solid', 'removed']" :ends="false" />
 <text class="dg-none end" x="46" y="94">None</text><DArrow :from="[91, 94]" :to="[52, 94]" />
 <DArrow :from="[319, 82]" :via="[[319, 46]]" :to="[350, 46]" kind="accent" /><text class="dg-none" x="356" y="46">None</text>
</Diagram>

```py
def pop_back(self):
    if self.tail is None:
        raise IndexError('pop from an empty list')
    node = self.tail
    self.delete(node)
    return node.value
```

```py
def pop_front(self):
    if self.head is None:
        raise IndexError('pop from an empty list')
    node = self.head
    self.delete(node)
    return node.value
```

## Soxta uç tugunlar {#header-and-trailer-sentinels}

Doimiy soxta birinçi va oxirgi tugunlar yordamida har haqiqiy tugunning ikkita qöşnisi böladi. Örtaga qöşiş yoki öçirişda `None` uçun alohida tekşiruvlar kamayadi.

<Diagram label="Header and trailer" :width="700" :height="112" alt="Two real nodes, 12 and 7, sit between two sentinel nodes that hold no value: the header in front and the trailer behind. Only the header's prev and the trailer's next are None. The first real node is header.next and the last is trailer.prev, so every real node has a node on both sides.">
 <DDChain :x="80" :y="34" :values="['', 12, 7, '']" :states="['muted', '', '', 'muted']" />
 <text class="dg-note" x="130" y="94">header</text>
 <text class="dg-note is-accent" x="280" y="94">head = header.next</text>
 <text class="dg-note is-accent" x="430" y="94">tail = trailer.prev</text>
 <text class="dg-note" x="580" y="94">trailer</text>
</Diagram>

```py
def __init__(self):
    self.header = Node(None)
    self.trailer = Node(None)
    self.header.next = self.trailer
    self.trailer.prev = self.header
    self.size = 0

def insert_after(self, node, value):
    new = Node(value)
    new.prev = node
    new.next = node.next
    node.next.prev = new
    node.next = new
    self.size += 1

def delete(self, node):
    node.prev.next = node.next
    node.next.prev = node.prev
    node.prev = None
    node.next = None
    self.size -= 1
```

## Töliq dastur {#full-implementation}

Quyidagi klass oldinga va orqaga yuruvni körsatadi. Har bir amaldan keyin qöşni tugunlarning `prev` va `next` havolalari bir-biriga mos qolişi kerak.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):  # O(1)
        self.head = None
        self.tail = None
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def __iter__(self):  # O(n)
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def backwards(self):  # O(n)
        cur = self.tail
        while cur is not None:
            yield cur.value
            cur = cur.prev

    def push_front(self, value):  # O(1)
        new = Node(value)
        new.next = self.head
        if self.head is not None:
            self.head.prev = new
        else:
            self.tail = new
        self.head = new
        self.size += 1

    def push_back(self, value):  # O(1)
        new = Node(value)
        new.prev = self.tail
        if self.tail is not None:
            self.tail.next = new
        else:
            self.head = new
        self.tail = new
        self.size += 1

    def insert_after(self, node, value):  # O(1)
        new = Node(value)
        new.prev = node
        new.next = node.next
        if node.next is not None:
            node.next.prev = new
        else:
            self.tail = new
        node.next = new
        self.size += 1

    def insert_before(self, node, value):  # O(1)
        if node.prev is None:
            self.push_front(value)
        else:
            self.insert_after(node.prev, value)

    def delete(self, node):  # O(1)
        if node.prev is not None:
            node.prev.next = node.next
        else:
            self.head = node.next
        if node.next is not None:
            node.next.prev = node.prev
        else:
            self.tail = node.prev
        node.prev = None
        node.next = None
        self.size -= 1

    def pop_front(self):  # O(1)
        if self.head is None:
            raise IndexError('pop from an empty list')
        node = self.head
        self.delete(node)
        return node.value

    def pop_back(self):  # O(1)
        if self.tail is None:
            raise IndexError('pop from an empty list')
        node = self.tail
        self.delete(node)
        return node.value

    def search(self, value):  # O(n)
        cur = self.head
        while cur is not None:
            if cur.value == value:
                return cur
            cur = cur.next
        return None

numbers = DoublyLinkedList()
for value in [12, 7, 3]:
    numbers.push_back(value)
numbers.push_front(1)
print(list(numbers), len(numbers))

seven = numbers.search(7)
numbers.insert_after(seven, 4)
numbers.insert_before(seven, 9)
print(list(numbers))

numbers.delete(seven)
print(list(numbers))
print(numbers.pop_front(), numbers.pop_back())
print(list(numbers), list(numbers.backwards()), len(numbers))
```

## Python tilida {#in-python}

CPython `collections.deque` elementlarni ikki tomonlama boğlangan bloklarda saqlaydi. Ikki uçdagi amallar `O(1)`. `OrderedDict.move_to_end` kalitni tartibning bir uçiga köçira oladi.

```python
from collections import deque, OrderedDict

numbers = deque([12, 7, 3])
numbers.appendleft(1)
numbers.append(9)
print(numbers.popleft(), numbers.pop(), list(numbers))

ages = OrderedDict([('ann', 31), ('bob', 25), ('cy', 40)])
ages.move_to_end('ann')
print(list(ages))
ages.move_to_end('cy', last=False)
print(list(ages))
print(ages.popitem(last=False))
```

## Amallar xarajati {#costs-at-a-glance}

Ikki uçdan qöşiş va oliş, maʼlum tugunni öçiriş va yoniga qöşiş `O(1)`. Qiymat qidirişi `O(n)). Har tugun ikki havolani saqlaydi.

## Qayerda işlatiladi {#when-to-use}

Tugunga havola saqlanadigan va uni tez-tez köçiriş zarur bölgan dasturlarda ikki tomonlama röyxat qulay. Ikkala yönalişda yuruv ham bir xil darajada oson.

## Amaliy misol {#application}

LRU keşning joyi tölsa, eng uzoq vaqt işlatilmagan yozuv öçiriladi. Luğat kalitdan tugunni topadi. Ikki tomonlama röyxat tugunni ajratib, yaqinda işlatilganlar uçiga köçiradi. Şu tariqa `get` va `put` odatdagi farazlar ostida örtaça `O(1)`.

```python
class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.nodes = {}
        self.header = Node(None, None)
        self.trailer = Node(None, None)
        self.header.next = self.trailer
        self.trailer.prev = self.header

    def _unlink(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _push_back(self, node):
        node.prev = self.trailer.prev
        node.next = self.trailer
        self.trailer.prev.next = node
        self.trailer.prev = node

    def get(self, key):
        node = self.nodes[key]
        self._unlink(node)
        self._push_back(node)
        return node.value

    def put(self, key, value):
        if key in self.nodes:
            self._unlink(self.nodes[key])
        node = Node(key, value)
        self.nodes[key] = node
        self._push_back(node)
        if len(self.nodes) > self.capacity:
            oldest = self.header.next
            self._unlink(oldest)
            del self.nodes[oldest.key]

    def keys(self):
        node = self.header.next
        while node is not self.trailer:
            yield node.key
            node = node.next

cache = LRUCache(2)
cache.put('a', 1)
cache.put('b', 2)
print(cache.get('a'), list(cache.keys()))

cache.put('c', 3)
print(list(cache.keys()))

try:
    cache.get('b')
except KeyError as error:
    print('KeyError:', error)
```

## Xulosa {#key-points}

Qöşiş va öçirişda boğlamni ikki yönalişda yangilang. Amaldan keyin har bir `node.next.prev` mavjud bölsa yana `node` ga qaytişi kerak.

## Maşq {#exercise}

`reverse` röyxatni joyida teskarilasin. Yangi tugun yaratmang. Har tugundagi `prev` va `next` ni, söng `head` va `tail` ni almaştiring.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def backwards(self):
        cur = self.tail
        while cur is not None:
            yield cur.value
            cur = cur.prev

    def push_back(self, value):
        new = Node(value)
        new.prev = self.tail
        if self.tail is not None:
            self.tail.next = new
        else:
            self.head = new
        self.tail = new
        self.size += 1

    def reverse(self):
        pass

numbers = DoublyLinkedList()
for value in [12, 7, 3, 5]:
    numbers.push_back(value)
numbers.reverse()
print(list(numbers), list(numbers.backwards()))

numbers.push_back(1)
print(list(numbers), list(numbers.backwards()))

empty = DoublyLinkedList()
empty.reverse()
print(list(empty))
```

::: details Yeçim
Boğlamlar almaşgandan keyin eski keyingi tugun `cur.prev` orqali topiladi. U orqali yuruvni davom ettiring. Vaqt `O(n)`, qöşimça xotira `O(1)`.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def __iter__(self):
        cur = self.head
        while cur is not None:
            yield cur.value
            cur = cur.next

    def backwards(self):
        cur = self.tail
        while cur is not None:
            yield cur.value
            cur = cur.prev

    def push_back(self, value):
        new = Node(value)
        new.prev = self.tail
        if self.tail is not None:
            self.tail.next = new
        else:
            self.head = new
        self.tail = new
        self.size += 1

    def reverse(self):
        cur = self.head
        while cur is not None:
            cur.prev, cur.next = cur.next, cur.prev
            cur = cur.prev
        self.head, self.tail = self.tail, self.head

numbers = DoublyLinkedList()
for value in [12, 7, 3, 5]:
    numbers.push_back(value)
numbers.reverse()
print(list(numbers), list(numbers.backwards()))

numbers.push_back(1)
print(list(numbers), list(numbers.backwards()))

empty = DoublyLinkedList()
empty.reverse()
print(list(empty))
```

:::
