---
title: Singly Linked List
description: "A singly linked list in Python: nodes and references, adding and removing at the head, a tail reference for O(1) push_back, insert, delete with a sentinel head, search, reverse, and slow and fast references."
---

# Singly Linked List

A singly linked list is a chain of nodes. Each node holds a value and a [reference](/foundations/references) to its successor. The list keeps a reference to the first node, called the head, and can also keep a reference to the last node, called the tail. The last node points to `None`.

A Python `list` keeps references to its items side by side in one block of memory, which is why `items[3]` is instant (see [Array](/arrays/array)). Linked list nodes can sit anywhere in memory. Indexing walks from the head. Once the relevant links are known, insertion and removal can update those links directly. Insertion allocates a node and leaves existing node values in place.

**You need:** [Measuring Cost](/foundations/measuring-cost), [References and Memory](/foundations/references)

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `len(numbers)`, `is_empty()` | Count the values, or check that there are none | `O(1)` |
| `push_front(value)` | Add a value at the front | `O(1)` |
| `pop_front()` | Remove the first value and return it | `O(1)` |
| `push_back(value)` | Add a value at the back | `O(1)` |
| `insert_after(node, value)` | Add a value right after a node you hold | `O(1)` |
| `delete(value)` | Remove the first node that holds `value` | `O(n)` |
| `search(value)` | Return the first node that holds `value`, or `None` | `O(n)` |
| `reverse()` | Reverse the order of the nodes in place | `O(n)` |
| `for value in numbers` | Visit the values from front to back | `O(n)` |

`n` is the number of values in the list. `pop_front` raises `IndexError` on an empty list, and `delete` raises `ValueError` when the value is missing, as `list.remove` does.

## The node

<LinkedListAnatomy />

A node needs two fields. `value` holds the item and `next` refers to the following node.

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
```

To see the chain in action, link three nodes by hand and walk through them:

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

That loop is the pattern behind almost every operation below. Start at the head, follow `next`, stop at `None`.

Every method on this page mixes two kinds of line, which [References and Memory](/foundations/references#changing-an-object-or-moving-a-name) explains in full:

- `cur = cur.next` moves the name `cur` one node along. No node changes.
- `prev.next = node` changes a node, so the list itself changes.
- Check for the end with `cur is None`, not `==`.
- A node you hold, such as one returned by `search`, is the same object the list refers to. Changing `node.value` changes the list.
- When nothing refers to a node any more, Python frees it.

The list object keeps three fields. `head` refers to the first node and `tail` to the last; both are `None` while the list is empty. `size` counts the nodes.

```py
class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0
```

## Length

Every method that adds a node raises `size` by one, and every method that removes one lowers it. Reading the counter is `O(1)`. Without it, `len` would have to walk the whole list, which is `O(n)`.

```py
def __len__(self):
    return self.size

def is_empty(self):
    return self.size == 0
```

`len(numbers)` calls `__len__`.

## Insert at the head

<LinkedListInsertHead />

Make the new node, `new = Node(5)`, then change two references:

1. Link it to the current first node: `new.next = head`
2. Move the head to the new node: `head = new`

```py
def push_front(self, value):
    new = Node(value)
    new.next = self.head
    self.head = new
    if self.tail is None:
        self.tail = new
    self.size += 1
```

If the list was empty, the new node is also the last one, so `tail` moves to it too.

The cost is `O(1)`. The list can hold ten nodes or ten million, and the same lines run.

## Remove the head

<LinkedListRemoveHead />

1. If the list is empty, raise `IndexError`.
2. Hold on to the first node: `node = head`
3. Move the head to the next node: `head = node.next`. If that leaves the list empty, clear `tail` as well.
4. Lower `size` and return `node.value`.

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

The cost is `O(1)`. `push_front` and `pop_front` are all a [stack](/stacks-queues/stack) needs: the head is the top.

## Insert at the tail

<LinkedListInsertTail />

With only a head, adding at the back means walking to the last node first, which costs `O(n)`. The `tail` reference removes the walk:

1. Link the last node to the new one: `tail.next = new`. On an empty list there is no last node, so the new node becomes the head instead.
2. Move the tail: `tail = new`

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

The cost is `O(1)`. With `push_back` at one end and `pop_front` at the other, the list works as a [queue](/stacks-queues/queue).

The price is bookkeeping. Every method that can change the last node has to keep `tail` right: `push_front` and `pop_front` when the list fills or empties, `insert_after` when it inserts after the tail, `delete` when it removes the tail, and `reverse`, which swaps the ends.

A tail does not help with removing the last node. That needs the node before the tail, and only a walk from the head finds it, so removing at the back stays `O(n)`. A [doubly linked list](/linked-lists/doubly-linked-list) fixes this by giving every node a reference back.

## Insert after a node

<LinkedListInsertAfter />

1. Link the new node to the node after `node` first: `new.next = node.next`
2. Then redirect `node`: `node.next = new`
3. If `node` was the tail, the new node is the tail now.

```py
def insert_after(self, node, value):
    new = Node(value)
    new.next = node.next
    node.next = new
    if node is self.tail:
        self.tail = new
    self.size += 1
```

The order matters. If you set `node.next = new` first, the only reference to node 3 is overwritten and the rest of the list is lost.

This is `O(1)` when you already hold `node`. Finding it is a separate walk that costs `O(n)`, usually a call to `search`. Check the result first: `search` returns `None` for a missing value, and `insert_after(None, 4)` fails with `AttributeError`.

## Delete a node

<LinkedListDelete />

`delete(value)` removes the first node that holds `value`.

1. Walk from the head until `prev.next` is the node to remove, the target.
2. Bypass the target: `prev.next = target.next`

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

The head is a special case because it has no `prev`, so deleting it is `pop_front`. If the walk reaches the end, the value is not in the list and `delete` raises `ValueError`. When the target was the tail, `prev` becomes the new tail.

The target still refers to 9, but nothing in the list refers to the target. Once nothing at all refers to it, Python frees it.

Finding the node takes `O(n)`. Unlinking it takes `O(1)`.

### A sentinel head

<Diagram label="Sentinel head" :width="620" :height="112" alt="A sentinel node with no value sits in front of the real nodes 12, 7 and 3, so even the first real node has a node before it. The walk in delete starts with prev on the sentinel.">
 <text class="dg-note is-accent" x="102" y="18">prev starts here</text><DArrow :from="[102, 24]" :to="[102, 37]" kind="accent" />
 <DChain :x="60" :y="40" :values="['', 12, 7, 3]" :states="['muted']" />
 <text class="dg-note" x="102" y="100">sentinel</text>
 <text class="dg-note" x="226" y="100">first real node</text>
</Diagram>

The head is a special case only because the first node has no node before it. A sentinel is a dummy node that always sits in front of the first real node and holds no value. Now every real node has a node before it, so `delete` starts its walk at the sentinel and treats the head like any other node.

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

The empty-list check and the head check are gone. The first real node is `self.sentinel.next`, and in an empty list `tail` is the sentinel itself, so `push_back` loses its empty-list branch too: it is always `self.tail.next = new`. The price is one extra node, and every method that reads values has to start after the sentinel.

## Search

<LinkedListSearch />

1. Start at the head: `cur = head`
2. While `cur` is not `None`, return `cur` if `cur.value == value`.
3. Otherwise move on: `cur = cur.next`. Reaching `None` means the value is not in the list, and `search` returns `None`.

```py
def search(self, value):
    cur = self.head
    while cur is not None:
        if cur.value == value:
            return cur
        cur = cur.next
    return None
```

The cost is `O(n)`. There is no shortcut to the middle of a linked list, so [binary search](/arrays/binary-search) does not help even when the values are sorted.

## Reverse in place

<LinkedListReverse />

Reversing flips every `next` reference to face the other way. Three variables do the work: `prev` is the part already reversed, `cur` is the node being flipped, and `nxt` saves the rest of the list before the link to it is cut.

1. The old head will be the new tail: `tail = head`
2. Start with `prev, cur = None, head`
3. On each step: `nxt = cur.next`, `cur.next = prev`, `prev = cur`, `cur = nxt`
4. When `cur` is `None`, set `head = prev`

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

It takes `O(n)` time and `O(1)` extra space, because no new nodes are created.

## Slow and fast references

<LinkedListSlowFast />

Some questions about a list need two references that move at different speeds, or a fixed distance apart. Each answer takes one pass and `O(1)` extra space.

- Middle node: `slow` moves one node per step and `fast` moves two. When `fast` reaches the end, `slow` has gone half as far and sits on the middle. With an even number of nodes it stops on the second of the two middle nodes.
- Cycle detection: a bug or hand-linked nodes can make a node link back to an earlier one, and then a walk never reaches `None`. Inside the cycle `fast` gains one node per step on `slow`, so it lands on `slow` within one lap. This is Floyd's algorithm.
- k-th node from the end: move `lead` `k` nodes ahead, then move `lead` and `trail` together until `lead` falls off the end. `trail` is then `k` nodes from the end, where `k = 1` is the last node.

The functions take the first node, so they work on `numbers.head` or on nodes linked by hand.

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

The last lines link 5 back to 3, which makes a cycle. All three functions cost `O(n)`.

## Full implementation

Here is the whole class. `__iter__` lets `list(numbers)` and `for` loops read the values, which makes the list easy to print.

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

## In Python

The standard library has no general-purpose linked list with public node references. For the work this page does at the ends, use `collections.deque`.

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

- `appendleft`, `popleft` and `append` do the jobs of `push_front`, `pop_front` and `push_back`, each in `O(1)`.
- `remove(value)` is `delete(value)`: `O(n)`, and it raises `ValueError` when the value is missing.
- A deque also removes from the back in `O(1)` with `pop()`, because it is linked in both directions inside. The [doubly linked list](/linked-lists/doubly-linked-list#in-python) page shows how.
- A deque gives you no node to hold. Inserting in the middle takes an index, `insert(i, value)`, and costs `O(n)`, and so does reading `d[i]` away from the ends.
- Do not use a plain `list` for work at the front: `insert(0, value)` and `pop(0)` shift every item, which is `O(n)` (see [Queue](/stacks-queues/queue)).

## Costs at a glance

| Operation | Cost |
| --- | --- |
| `push_front`, `pop_front` | `O(1)` |
| `push_back`, with a tail reference | `O(1)` |
| `insert_after` a node you hold | `O(1)` |
| `delete(value)` | `O(n)` |
| `search(value)` | `O(n)` |
| `reverse` | `O(n)` |
| `len`, `is_empty` | `O(1)` |
| Space | `O(n)` |

Compared with a Python `list`:

| Operation | `SinglyLinkedList` | `list` |
| --- | --- | --- |
| Add or remove at the front | `O(1)` | `O(n)` |
| Add at the back | `O(1)` | `O(1)` [amortized](/arrays/dynamic-array) |
| Insert after a node you hold | `O(1)` | `O(n)` |
| Search by value | `O(n)` | `O(n)` |
| Reach the item at index `i` | `O(n)` | `O(1)` |

## When to use

Reach for a linked list when most of the work happens at the front or right after a node you already hold. Those operations update a fixed number of links. It is also the simplest way to build a [stack](/stacks-queues/stack) or a [queue](/stacks-queues/queue) out of nodes.

In everyday Python a hand-built linked list is rarely the fastest choice.

- Each node is a full Python object. On CPython 3.13 a node holding a number takes about 120 bytes, counting the number, against about 40 bytes for a number in a `list`. Adding `__slots__ = ('value', 'next')` to `Node` brings it down to about 80.
- A `list` keeps its references in one block, which the processor's cache reads quickly. Nodes are scattered, and every step along `next` runs a line of Python, while `list` methods run in C.

Use a `list` to index by position or to add at the back, a `deque` to add and remove at both ends, and a [doubly linked list](/linked-lists/doubly-linked-list) when you need to remove a node you hold or walk backwards. [Choosing a Structure](/choosing-a-structure) sets these costs side by side with every other structure on the site.

## Application

A music player keeps a queue of songs. New songs go to the back, a "play next" request goes to the front, and the player always takes the song at the front. All three are `O(1)` on this list.

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

Linked lists also sit inside other structures:

| Where | What the linked list does |
| --- | --- |
| [Hash table](/hash-tables/hash-table#from-key-to-bucket) chaining | Each bucket holds the pairs that collide. The classic version keeps them in a linked list and adds with `push_front`. |
| [Graph](/graphs/graph#adjacency-list) adjacency lists | Each vertex keeps a chain of its neighbours. Adding an edge is a `push_front` on the chain of each end. |
| Undo history | Each edit is pushed at the front and undo pops it: a [stack](/stacks-queues/stack) made of nodes. |

## Key points

- A singly linked list is a chain of nodes, each holding a value and a reference to the next node.
- Adding or removing at the head is `O(1)`, and so is adding at the tail when the list keeps a `tail` reference.
- Reaching a position or a value, or removing the last node, means walking from the head, which is `O(n)`.
- Two references moving at different speeds find the middle, a cycle or the k-th node from the end in one pass.
- In Python, a `list` or a `deque` is usually faster and smaller. A linked list pays off when you splice nodes you already hold.

## Exercise

Write `pop_back`, which removes the last node and returns its value. Raise `IndexError('pop from an empty list')` when the list is empty, and keep `head`, `tail` and `size` correct, including when the last node is also the first.

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

::: details Solution
Walk from the head to the node whose `next` is the tail. That node becomes the new tail, and its `next` becomes `None`. A list with one node has no such node, so it becomes empty and both `head` and `tail` go back to `None`.

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

**Time** `O(n)`, because of the walk to the node before the tail. **Space** `O(1)`.
:::
