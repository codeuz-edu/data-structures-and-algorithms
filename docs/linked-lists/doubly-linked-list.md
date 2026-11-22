---
title: Doubly Linked List
description: "A doubly linked list in Python: prev and next references, constant-time insert and remove at both ends and next to a node you hold, header and trailer sentinels, and an LRU cache."
---

# Doubly Linked List

Each node of a doubly linked list holds [references](/foundations/references) to both its neighbours. This allows traversal in both directions. It also lets a program that already holds a node unlink it directly.

**You need:** [Singly Linked List](/linked-lists/singly-linked-list), [References and Memory](/foundations/references)

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `len(numbers)` | Count the values | `O(1)` |
| `push_front(value)`, `push_back(value)` | Add a value at the front or at the back | `O(1)` |
| `pop_front()`, `pop_back()` | Remove the first or the last value and return it | `O(1)` |
| `insert_after(node, value)` | Add a value right after a node you hold | `O(1)` |
| `insert_before(node, value)` | Add a value right before a node you hold | `O(1)` |
| `delete(node)` | Remove a node you hold | `O(1)` |
| `search(value)` | Return the first node that holds `value`, or `None` | `O(n)` |
| `for value in numbers`, `backwards()` | Visit the values front to back, or back to front | `O(n)` |

`n` is the number of values in the list. Both pops raise `IndexError` on an empty list. `search` is the same walk as on the [singly linked list](/linked-lists/singly-linked-list#search) page, so it has no section here.

## The node

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

The list keeps two references of its own, `head` and `tail`, and a count of its nodes, `size`. With a tail, adding at the back is as cheap as adding at the front.

```py
class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0
```

Because every node knows both neighbours, the list can be walked from either end. `__iter__` starts at the head and follows `next`; `backwards` starts at the tail and follows `prev`.

```py
def backwards(self):
    cur = self.tail
    while cur is not None:
        yield cur.value
        cur = cur.prev
```

## Length

Every method that adds a node raises `size` by one. Every removal goes through `delete`, which lowers it. `len` reads the counter in `O(1)` instead of walking the list.

```py
def __len__(self):
    return self.size
```

## Insert at either end

<Diagram label="Insert 5 at the back" cost="O(1)" :width="690" :height="120" alt="Three nodes holding 12, 7 and 3, with HEAD on 12 and TAIL on 3. A new node 5 is added after 3: the next of 3 and the prev of 5 now refer to each other, and TAIL moves from 3 to 5.">
 <text class="dg-name" x="120" y="22">HEAD</text><DArrow :from="[120, 32]" :to="[120, 66]" />
 <text class="dg-name" x="420" y="22">TAIL</text><DArrow :from="[420, 32]" :to="[420, 66]" kind="removed" />
 <DArrow :from="[442, 22]" :via="[[570, 22]]" :to="[570, 66]" kind="accent" />
 <DDChain :x="70" :y="70" :values="[12, 7, 3, 5]" :states="['', '', '', 'new']" :links="['solid', 'solid', 'accent']" />
</Diagram>

`push_back` touches only the tail.

1. Link the new node back to the old tail: `new.prev = tail`
2. Link the old tail forward to the new node: `tail.next = new`. On an empty list there is no old tail, and the new node becomes the head as well.
3. Move the tail: `tail = new`

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

`push_front` is the mirror image: swap `head` with `tail` and `prev` with `next`.

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

Both cost `O(1)`, however long the list is.

## Insert after a node

<Diagram label="Insert 4 after 7" cost="O(1)" :width="610" :height="104" alt="A new node 4 is placed after node 7, between 7 and 3. Four references change: the next of 7, both references of 4, and the prev of 3.">
 <DDChain :x="30" :y="34" :values="[12, 7, 4, 3]" :states="['', '', 'new']" :links="['solid', 'accent', 'accent']" :ends="false" />
 <text class="dg-label is-accent" x="230" y="92">node</text>
</Diagram>

Four references change, two on the new node and one on each neighbour. Set up the new node first, while the old links are still there to read from.

1. `new.prev = node`
2. `new.next = node.next`
3. Link the old next node back to `new`. When there is none, `new` is the new tail.
4. `node.next = new`

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

The cost is `O(1)` when you hold `node`.

## Insert before a node

<Diagram label="Insert 4 before 7" cost="O(1)" :width="610" :height="104" alt="A new node 4 is placed before node 7, between 12 and 7. The same four references change as when inserting after 12.">
 <DDChain :x="30" :y="34" :values="[12, 4, 7, 3]" :states="['', 'new']" :links="['accent', 'accent', 'solid']" :ends="false" />
 <text class="dg-label is-accent" x="380" y="92">node</text>
</Diagram>

This is the operation `prev` exists for. The node before `node` is one step away, so inserting before `node` is the same as inserting after `node.prev`.

1. Step back: `node.prev`
2. If there is nothing there, `node` is the head, and the new value goes in with `push_front`.
3. Otherwise insert after it: `insert_after(node.prev, value)`

```py
def insert_before(self, node, value):
    if node.prev is None:
        self.push_front(value)
    else:
        self.insert_after(node.prev, value)
```

The cost is `O(1)`. A singly linked list has no `prev`, so it needs an `O(n)` walk from the head to find the node before.

## Delete a node

<Diagram label="Delete 7" cost="O(1)" :width="580" :height="146" alt="Node 7 is removed. The next of 12 now goes straight to 3, and the prev of 3 goes straight back to 12.">
 <DDChain :x="80" :y="60" :values="[12, 7, 3]" :states="['', 'ghost']" :links="['removed', 'removed']" />
 <DArrow :from="[169, 72]" :via="[[169, 36], [430, 36]]" :to="[430, 58]" kind="accent" /><DStep :x="300" :y="36" :n="1" />
 <DArrow :from="[391, 84]" :via="[[391, 122], [130, 122]]" :to="[130, 98]" kind="accent" /><DStep :x="300" :y="122" :n="2" />
</Diagram>

The node carries its own `prev`, so there is nothing to search for.

1. Make the node before skip forward over it: `node.prev.next = node.next`
2. Make the node after skip back over it: `node.next.prev = node.prev`

When the node is the head or the tail, one of its neighbours is missing. The `head` or `tail` reference moves instead.

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

In a singly linked list this needs an `O(n)` walk to find the node before. Here it is `O(1)`.

Setting `node.prev` and `node.next` to `None` clears the removed node's own links. Without that, a node you still hold would look as if it were in the list: `node.next` would lead back into a list it has left.

`delete` trusts its argument, and two mistakes go unnoticed:

- A node from another list. Checking which list a node belongs to would need an `O(n)` walk, so `delete` does not check. It unlinks the node from its own list but changes this list's `size`, and sometimes its `head` or `tail`, so both lists end up wrong.
- A node that was already deleted. Its links are cleared, so `delete` takes it for the only node in the list and sets both `head` and `tail` to `None`.

Only pass a node that is in this list right now.

## Remove at either end

<Diagram label="Remove at the back" cost="O(1)" :width="600" :height="124" alt="Three nodes holding 12, 7 and 3, with HEAD on 12 and TAIL on 3. Node 3 is removed: the next of 7 now refers to None, TAIL moves back from 3 to 7, and the links between 7 and 3 go away.">
 <text class="dg-name" x="130" y="24">HEAD</text><DArrow :from="[130, 34]" :to="[130, 66]" />
 <text class="dg-name" x="430" y="24">TAIL</text><DArrow :from="[430, 34]" :to="[430, 66]" kind="removed" />
 <DArrow :from="[408, 24]" :via="[[280, 24]]" :to="[280, 66]" kind="accent" />
 <DDChain :x="80" :y="70" :values="[12, 7, 3]" :states="['', '', 'ghost']" :links="['solid', 'removed']" :ends="false" />
 <text class="dg-none end" x="46" y="94">None</text><DArrow :from="[91, 94]" :to="[52, 94]" />
 <DArrow :from="[319, 82]" :via="[[319, 46]]" :to="[350, 46]" kind="accent" /><text class="dg-none" x="356" y="46">None</text>
</Diagram>

The first and last nodes are nodes you already hold, through `head` and `tail`, so `delete` does the work.

1. If the list is empty, raise `IndexError`.
2. Hold the last node: `node = tail`
3. `delete(node)`: the node before it gets `next = None` and becomes the tail.
4. Return `node.value`.

```py
def pop_back(self):
    if self.tail is None:
        raise IndexError('pop from an empty list')
    node = self.tail
    self.delete(node)
    return node.value
```

`pop_front` is the same with `head` in place of `tail`.

```py
def pop_front(self):
    if self.head is None:
        raise IndexError('pop from an empty list')
    node = self.head
    self.delete(node)
    return node.value
```

Both cost `O(1)`. On a singly linked list, removing at the back costs `O(n)`, because it has to walk to the node before the tail.

## Header and trailer sentinels

<Diagram label="Header and trailer" :width="700" :height="112" alt="Two real nodes, 12 and 7, sit between two sentinel nodes that hold no value: the header in front and the trailer behind. Only the header's prev and the trailer's next are None. The first real node is header.next and the last is trailer.prev, so every real node has a node on both sides.">
 <DDChain :x="80" :y="34" :values="['', 12, 7, '']" :states="['muted', '', '', 'muted']" />
 <text class="dg-note" x="130" y="94">header</text>
 <text class="dg-note is-accent" x="280" y="94">head = header.next</text>
 <text class="dg-note is-accent" x="430" y="94">tail = trailer.prev</text>
 <text class="dg-note" x="580" y="94">trailer</text>
</Diagram>

Five of the `is None` checks above, in the two pushes, `insert_after` and `delete`, exist only because the first node has no `prev` and the last has no `next`. Sentinels remove them. The header and the trailer are two dummy nodes that hold no value and never leave the list, and the real nodes sit between them, so every real node has a neighbour on both sides.

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

The ends become ordinary positions. `push_front(value)` is `insert_after(self.header, value)`, `push_back(value)` is `insert_after(self.trailer.prev, value)`, and the pops delete `header.next` or `trailer.prev` after checking that the list is not empty, which is when `header.next is trailer`. A second `delete` of the same node now fails loudly with `AttributeError`, because its cleared `prev` is `None`, instead of emptying the list. The price is two extra nodes. The pure-Python `OrderedDict` and `functools.lru_cache` in CPython's standard library use the same trick, with one sentinel that serves as both ends of a circular list.

## Full implementation

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

## In Python

The standard library has two tools built on doubly linked lists.

- CPython implements `collections.deque` as a doubly linked list of fixed-size blocks. Adding and removing at either end is `O(1)`. It gives you no node to hold, so reading `d[i]` in the middle, `insert(i, value)` and `del d[i]` all cost `O(n)`. The [Queue](/stacks-queues/queue) page uses it as a queue.
- `collections.OrderedDict` is a dictionary that also keeps its keys in a doubly linked list. Since the dictionary finds a key's node in `O(1)` on average, it can also delete a key or move it to either end in `O(1)` on average, with `move_to_end` and `popitem`.

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

The trap with `deque` is indexing. `d[0]` and `d[-1]` are instant, but a loop that reads `d[i]` for every `i` walks toward the middle again and again, which adds up to `O(n²)`. Loop over the deque itself instead. A plain `dict` also remembers insertion order, but it has no cheap way to move a key to the front; that is what `OrderedDict` is for.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| `push_front`, `push_back` | `O(1)` |
| `pop_front`, `pop_back` | `O(1)` |
| `insert_after`, `insert_before` a node you hold | `O(1)` |
| `delete` a node you hold | `O(1)` |
| `search(value)` | `O(n)` |
| `len` | `O(1)` |
| Space | `O(n)` |

Compared with a singly linked list and a `deque`:

| Operation | Doubly linked | Singly linked | `deque` |
| --- | --- | --- | --- |
| Add or remove at the front | `O(1)` | `O(1)` | `O(1)` |
| Add at the back | `O(1)` | `O(1)` with a tail | `O(1)` |
| Remove at the back | `O(1)` | `O(n)` | `O(1)` |
| Remove from the middle | `O(1)` given the node | `O(n)` | `O(n)` by index |
| Walk backwards | yes | no | yes |

Each node carries two references instead of one, so a doubly linked list uses more memory than a singly linked one with the same values.

## When to use

Pick a doubly linked list when you hold nodes and need to remove them, or insert next to them, in `O(1)`, as the LRU cache below does, or when you step both forwards and backwards from a position. It is the linked list that can remove at both ends in `O(1)`.

Do not use it to reach items by position: that is an `O(n)` walk, and a `list` does it in `O(1)`. If all the work is at the two ends, a `deque` does the same job in C with less memory per item. If all the work is at the front, a [singly linked list](/linked-lists/singly-linked-list) stores one reference less per node. [Choosing a Structure](/choosing-a-structure) sets these costs side by side with every other structure on the site.

## Application

An LRU cache, short for least recently used, holds at most `capacity` entries. When it is full and a new entry arrives, it throws out the entry that was used longest ago. Both `get` and `put` have to be fast, so two structures share the work:

- A dict from each key to its node finds an entry in `O(1)` on average.
- A doubly linked list keeps the nodes in order of use, the oldest right after the header and the newest right before the trailer. Moving a node you hold to the back and removing the oldest node are both `O(1)`.

Each node also stores its key, so the cache can remove the dict entry when it throws the node out. A missing key raises `KeyError`, as it does in a `dict`.

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

`get` and `put` cost `O(1)` on average. Reading `a` made `b` the oldest entry, so adding `c` threw out `b`. With the header and trailer in place, unlinking a node and linking one at the back need no `is None` checks.

Python has both halves put together already. An `OrderedDict` makes the same cache in a few lines: `move_to_end(key)` on every use and `popitem(last=False)` to throw out the oldest. To cache the results of a function, decorate it with `functools.lru_cache(maxsize=...)`; [Dynamic Programming](/algorithm-design/dynamic-programming) shows when remembering results pays off.

## Key points

- Each node refers to both neighbours, so the list can be walked in both directions.
- Adding and removing at either end is `O(1)`, and so is inserting next to or deleting a node you hold.
- `delete` trusts that the node is in this list, and it clears the removed node's links.
- Header and trailer sentinels give every real node two neighbours, which removes the `is None` branches.
- A dict of key to node plus a doubly linked list makes an LRU cache with `O(1)` average `get` and `put`. `OrderedDict` and `functools.lru_cache` are Python's ready-made versions.

## Exercise

Write `reverse`, which reverses the list in place without creating nodes. Swap `prev` and `next` on every node, then swap `head` and `tail`. Afterwards the forward and the backward walk must still agree.

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

::: details Solution
After the swap, the node that used to come next sits in `cur.prev`, so that is where the loop moves on. Once every node is flipped, the old tail is the first node and the old head is the last.

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

**Time** `O(n)`, one pass over the nodes. **Space** `O(1)`, because no nodes are created.
:::
