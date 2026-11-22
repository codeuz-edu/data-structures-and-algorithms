---
title: Queue
description: "A queue in Python: enqueue and dequeue in constant time with a growing circular buffer and with a linked list, plus the deque, collections.deque and a round-robin example."
---

# Queue

A queue handles items in the order they arrive. New items join at the back, and the next item comes from the front. This is first in, first out, or FIFO.

Queues hold print jobs, incoming requests on a server, and the nodes waiting to be visited in a breadth-first search.

**You need:** [Array](/arrays/array), [Singly Linked List](/linked-lists/singly-linked-list) and [Stack](/stacks-queues/stack).

## Interface

Like a [stack](/stacks-queues/stack#interface), a queue is an abstract data type: it is defined by these operations, not by how it stores its items.

| Operation | What it does | Cost |
| --- | --- | --- |
| `enqueue(value)` | Add `value` at the rear | `O(1)` [amortized](/arrays/dynamic-array#why-append-is-still-cheap) |
| `dequeue()` | Remove the front item and return it | `O(1)` |
| `peek()` | Return the front item and leave it in place | `O(1)` |
| `is_empty()` | Tell whether the queue has no items | `O(1)` |
| `len(queue)` | Return the number of items | `O(1)` |

The `enqueue` cost for a growing circular buffer is amortized. A single enqueue that grows the buffer copies all the existing items. `dequeue` and `peek` raise `IndexError` when the queue is empty. Enqueue is amortized in the circular buffer, because a full buffer has to grow. The [linked queue](#linked-queue) never copies anything, so its enqueue is `O(1)` every time.

## Shape

<Diagram label="Anatomy" :width="560" :height="116" alt="A queue holding 12, 7, 3 and 9. Items leave from the front, where 12 is, and join at the rear, after 9.">
 <DCells :x="184" :y="50" :values="[12, 7, 3, 9]" :marks="{ 0: 'front', 3: 'rear' }" />
 <DArrow :from="[178, 70]" :to="[132, 70]" kind="accent" /><text class="dg-label is-accent end" x="124" y="74">Dequeue</text>
 <DArrow :from="[428, 70]" :to="[382, 70]" kind="accent" /><text class="dg-label is-accent start" x="436" y="74">Enqueue</text>
</Diagram>

`enqueue` adds at the rear. `dequeue` removes from the front and returns the item.

## The trap with a list

A Python `list` looks like a ready-made queue: `append` to enqueue and `pop(0)` to dequeue. It gives the right answers, slowly. `append` is `O(1)` amortized, but removing index 0 shifts every other item one cell to the left, as the [array](/arrays/array#delete) page shows, so each dequeue costs `O(n)`.

## Circular buffer

The fix is to stop moving the items and move the front instead.

<Diagram label="Circular buffer" cost="O(1) dequeue · O(1) amortized enqueue" :width="560" :height="170" alt="An array of six cells used as a ring. The front is at index 3. The items 9, 5 and 4 fill indexes 3 to 5, and the newest item, 8, wraps around to index 0.">
 <DCells :x="136" :y="50" :values="[8, null, null, 9, 5, 4]" :states="{ 0: 'new', 1: 'ghost', 2: 'ghost' }" :marks="{ 3: 'front', 0: 'rear' }" indices />
 <DArrow :from="[400, 122]" :via="[[400, 138], [160, 138]]" :to="[160, 122]" kind="accent" />
 <text class="dg-note is-accent" x="280" y="156">after the last cell, the rear wraps to index 0</text>
</Diagram>

Keep an array, the index of the front item, and the number of items. Dequeue moves the front one cell forward. Enqueue writes just past the last item. When either one runs off the end of the array it wraps to index 0, which the `%` operator does in one step.

```py
def __init__(self, capacity=4):
    self.items = [None] * max(1, capacity)
    self.front = 0
    self.size = 0
```

The array always has at least one cell, so that doubling it, as [growing the buffer](#growing-the-buffer) does, always makes room.

## Enqueue

<Diagram label="Enqueue 9" cost="O(1) amortized" :width="640" :height="232" alt="Before: 12, 7 and 3 fill indexes 0 to 2 of a six-cell array, with the front at index 0 and the rear at index 2. After enqueue(9): 9 is written at index (0 + 3) % 6 = 3, which becomes the rear. Nothing else moves.">
 <text class="dg-note end" x="118" y="74">before</text>
 <DCells :x="130" :y="50" :values="[12, 7, 3, null, null, null]" :states="{ 3: 'ghost', 4: 'ghost', 5: 'ghost' }" :marks="{ 0: 'front', 2: 'rear' }" indices />
 <text class="dg-note start" x="434" y="74">front 0 · size 3</text>
 <text class="dg-note end" x="118" y="184">after</text>
 <DCells :x="130" :y="160" :values="[12, 7, 3, 9, null, null]" :states="{ 3: 'new', 4: 'ghost', 5: 'ghost' }" :marks="{ 0: 'front', 3: 'rear' }" indices />
 <text class="dg-note is-accent start" x="434" y="184">index (0 + 3) % 6 = 3</text>
</Diagram>

1. If every cell is in use, grow the array to twice its size (shown [below](#growing-the-buffer)).
2. Find the cell just past the last item: `(front + size) % capacity`.
3. Write the value there and add one to `size`.

```py
def enqueue(self, value):
    if self.size == len(self.items):
        self._resize(2 * len(self.items))
    rear = (self.front + self.size) % len(self.items)
    self.items[rear] = value
    self.size += 1
```

In the circular buffer picture, the front is 3 and the size is 3, so 8 went to `(3 + 3) % 6`, which is index 0. No item moves, so enqueue costs `O(1)`, except when the buffer is full and has to grow. That makes it `O(1)` amortized.

## Dequeue

<Diagram label="Dequeue" cost="O(1)" :width="640" :height="232" alt="Before: 12, 7, 3 and 9 fill indexes 0 to 3, with the front at index 0. After dequeue: index 0 is empty, the front has moved to index 1, and 12 is returned. Nothing else moves.">
 <text class="dg-note end" x="118" y="74">before</text>
 <DCells :x="130" :y="50" :values="[12, 7, 3, 9, null, null]" :states="{ 4: 'ghost', 5: 'ghost' }" :marks="{ 0: 'front', 3: 'rear' }" indices />
 <text class="dg-note start" x="434" y="74">front 0 · size 4</text>
 <text class="dg-note end" x="118" y="184">after</text>
 <DCells :x="130" :y="160" :values="[null, 7, 3, 9, null, null]" :states="{ 0: 'ghost', 4: 'ghost', 5: 'ghost' }" :marks="{ 1: 'front', 3: 'rear' }" indices />
 <text class="dg-note is-accent start" x="434" y="184">returns 12 · front 1 · size 3</text>
</Diagram>

1. If the queue is empty, raise `IndexError`.
2. Take the value at `front` and clear the cell, so the buffer no longer holds a [reference](/foundations/references#objects-nobody-refers-to) to it.
3. Move `front` one cell forward, wrapping with `%`, and subtract one from `size`.
4. Return the value.

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

Only `front` moves, so dequeue costs `O(1)`, where `list.pop(0)` costs `O(n)`.

## Peek

<Diagram label="Peek" cost="O(1)" :width="640" :height="122" alt="The buffer holds 7, 3 and 9 in indexes 1 to 3, with the front at index 1. Peek returns 7, the front item, and changes nothing.">
 <DCells :x="130" :y="50" :values="[null, 7, 3, 9, null, null]" :states="{ 0: 'ghost', 1: 'hit', 4: 'ghost', 5: 'ghost' }" :marks="{ 1: 'front', 3: 'rear' }" indices />
 <text class="dg-note is-accent start" x="434" y="74">peek() returns 7, nothing moves</text>
</Diagram>

1. If the queue is empty, raise `IndexError`.
2. Return the value at `front` and leave it there.

```py
def peek(self):
    if self.size == 0:
        raise IndexError('peek at an empty queue')
    return self.items[self.front]
```

Reading one cell costs `O(1)`.

## Growing the buffer

A full buffer could refuse new items. To grow instead, do what a [dynamic array](/arrays/dynamic-array) does: make an array twice the size and copy the items across. The copy cannot keep the old positions, because the items may wrap around the end of the old array.

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

1. Make an array twice the size.
2. Copy the items in queue order, starting at `front`. Item `i` of the queue sits at `(front + i) % old capacity` and goes to index `i`.
3. Set `front` to 0. `size` stays the same.

```py
def _resize(self, capacity):
    old = self.items
    self.items = [None] * capacity
    for i in range(self.size):
        self.items[i] = old[(self.front + i) % len(old)]
    self.front = 0
```

A plain copy of `old` into the first four cells would put 3 and 9 ahead of 12, and the queue would come out in the wrong order.

The copy costs `O(n)`, but doubling makes it rare. After growing to `2n` cells, the next `n` enqueues fit without another copy, so enqueue costs `O(1)` amortized, just like a dynamic array's append.

## Full implementation

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

The first printed array matches the circular buffer diagram: 8 has wrapped around to index 0. Then 1 and 2 fill the last two free cells, and 6 finds the buffer full. The second array shows the result of growing to 12 cells: the items were copied in queue order, starting from 9 at the front, and 6 went in after them.

## Linked queue

A [singly linked list](/linked-lists/singly-linked-list) that also keeps a reference to its last node, the tail, makes a queue that never has to copy its items. Items join at the tail with [`push_back`](/linked-lists/singly-linked-list#insert-at-the-tail) and leave from the head with [`pop_front`](/linked-lists/singly-linked-list#remove-the-head).

<Diagram label="Linked queue" cost="O(1) enqueue and dequeue" :width="676" :height="150" alt="The queue 12, 7, 3, 9 as a linked list. HEAD refers to 12, the front, where dequeue removes. TAIL refers to 9, the rear, where enqueue adds the next node. 9 links to None.">
 <text class="dg-name" x="50" y="98">HEAD</text>
 <DArrow :from="[76, 98]" :to="[118, 98]" kind="accent" />
 <DChain :x="120" :y="80" :values="[12, 7, 3, 9]" />
 <text class="dg-name" x="534" y="24">TAIL</text>
 <DArrow :from="[534, 34]" :to="[534, 78]" kind="accent" />
 <text class="dg-note" x="162" y="136">front · dequeue here</text>
 <text class="dg-note" x="534" y="136">rear · enqueue after it</text>
</Diagram>

1. Enqueue: make a node, link the tail's `next` to it, and move `tail` to it. If the queue was empty, the new node becomes the head as well.
2. Dequeue: take the head node, move `head` on to its `next`, and return the value it held. If that empties the queue, set `tail` to `None` too.

The direction matters. Removing the last node of a singly linked list needs the node before it, and finding that node is an `O(n)` walk. Removing the first node is `O(1)`, so items leave at the head and join at the tail.

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

The last four lines empty the queue and use it again. That only works because `dequeue` clears `tail` along with `head`. Without that line, `tail` would still refer to the removed node, and the next enqueue would link the new node to it while `head` stayed `None`.

## Deque

A deque, short for double-ended queue, allows adding and removing at both ends. It can serve as a stack or as a queue.

<Diagram label="Deque" cost="O(1) at both ends" :width="560" :height="100" alt="A deque holding 7, 3 and 9. Items can be added or removed on the left with appendleft and popleft, and on the right with append and pop.">
 <DCells :x="208" :y="40" :values="[7, 3, 9]" />
 <DArrow :from="[152, 52]" :to="[204, 52]" kind="accent" /><text class="dg-note is-accent end" x="144" y="56">appendleft</text>
 <DArrow :from="[204, 68]" :to="[152, 68]" kind="accent" /><text class="dg-note is-accent end" x="144" y="72">popleft</text>
 <DArrow :from="[408, 52]" :to="[356, 52]" kind="accent" /><text class="dg-note is-accent start" x="416" y="56">append</text>
 <DArrow :from="[356, 68]" :to="[408, 68]" kind="accent" /><text class="dg-note is-accent start" x="416" y="72">pop</text>
</Diagram>

Python ships one as `collections.deque`. CPython stores it as a [doubly linked list](/linked-lists/doubly-linked-list) of fixed-size blocks. The four operations in the picture only touch an end block, so all of them are `O(1)`, and the deque grows as needed.

The price is the middle. `items[i]` has to step through the blocks from the nearer end, so indexing near the middle costs `O(n)`. If you need fast access by position, use a `list`.

Two more features are worth knowing.

- `deque(maxlen=n)` holds at most `n` items. Once it is full, adding at one end drops an item from the other end, so it always keeps the last `n` items it was given.
- `rotate(k)` moves the last `k` items to the front, and a negative `k` moves the first items to the back. It costs `O(k)`.

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

## In Python

For a queue in real code, use `collections.deque`: `append` to enqueue, `popleft` to dequeue, `items[0]` to peek, and `len` or `if items:` to check the size. All of them are `O(1)`.

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

- `pop()` takes from the right, where the newest item is. A queue needs `popleft()`. Mixing them up turns the queue into a stack without any error.
- `popleft()` on an empty deque raises `IndexError`.
- `list.pop(0)` gives the right order but costs `O(n)`, as [the trap](#the-trap-with-a-list) above shows.
- `queue.Queue` is a queue with a lock, made for handing work between threads: `put` enqueues and `get` dequeues. On an empty queue `get` does not raise. It waits for another thread to put something, so in a program with one thread it waits forever. Use `get_nowait()` to get a `queue.Empty` error instead.

## Costs at a glance

| Operation | Circular buffer | Linked queue |
| --- | --- | --- |
| Enqueue | `O(1)` amortized | `O(1)` |
| Dequeue | `O(1)` | `O(1)` |
| Peek | `O(1)` | `O(1)` |
| Length, is empty | `O(1)` | `O(1)` |
| Space | `O(capacity)` | `O(n)` |

The circular buffer grows but never shrinks. Its capacity ends up at most twice the most items it has held at once, or its starting capacity if that is larger.

Compared with Python's built-ins:

| Operation | `deque` | `list` with `append` and `pop(0)` |
| --- | --- | --- |
| Enqueue | `O(1)` | `O(1)` amortized |
| Dequeue | `O(1)` | `O(n)` |
| Peek | `O(1)` | `O(1)` |
| Space | `O(n)` | `O(n)` |

## When to use

Use a queue when items must be handled in the order they arrived and none may jump the line. The [Application](#application) section lists the usual places.

In Python, that means `collections.deque`. A circular buffer without the resize earns its place when memory must stay fixed, for example a buffer between a producer and a consumer, where the producer has to wait while the buffer is full. `deque(maxlen=n)` is the built-in for the other choice, dropping the oldest item.

Sometimes the oldest item is not the one you want next. Newest first is a [stack](/stacks-queues/stack). Most urgent first is a **priority queue**, which serves the item with the smallest priority number whatever its arrival time. A [heap](/trees/heap) is the usual way to build one, Python's `heapq` module provides it, and [shortest paths](/graphs/shortest-paths) is where you will see it at work. [Choosing a Structure](/choosing-a-structure) compares all of these side by side.

## Application

Queues turn up wherever work has to wait its turn.

- [Breadth-first search](/graphs/graph#breadth-first-search) keeps the vertices it has found but not yet visited in a queue, so it reaches them in order of distance from the start.
- [Level-order traversal](/trees/binary-tree#level-order) does the same on a tree, one level at a time.
- Scheduling: a printer, an operating system or a web server takes jobs and requests in the order they arrive.
- Simulations: customers at a till, cars at a junction, or children passing a hot potato. Each step serves the front of the line, and newcomers join at the back.
- Buffers: keystrokes, network packets or the output of one thread wait in a circular buffer until the reader is ready for them.

Here is scheduling in a few lines. An operating system shares one processor between many programs with round-robin scheduling. Each job runs for a fixed slice of time. If it is not finished, it goes to the back of the queue and waits for its next turn, so every job keeps making progress.

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

C needs a single slice, so it finishes first even though it arrived last. B needs the most time and finishes last.

## Key points

- A queue serves items in arrival order: enqueue at the rear, dequeue at the front.
- `list.pop(0)` shifts every item, so a list makes a slow queue. In Python, use `collections.deque` with `append` and `popleft`.
- A circular buffer moves the front index instead of the items. When it is full it doubles, copying from `front` so the items come out unwrapped, and enqueue stays `O(1)` amortized.
- A linked queue adds at the tail and removes at the head, both in `O(1)`.
- A deque is open at both ends. A priority queue serves the most urgent item first and is built from a heap.

## Exercise

Build a queue out of two [stacks](/stacks-queues/stack). Use two Python lists and only `append`, `pop()` and emptiness checks on them. Enqueue pushes onto the first stack. For dequeue, think about what happens to the order when you pop everything from one stack and push it onto the other. Dequeue on an empty queue should raise `IndexError('dequeue from an empty queue')`.

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

::: details Solution
Moving the items from one stack to the other reverses them, which puts the oldest item on top. Refill `outbox` only when it is empty, or the order breaks. If both stacks are empty after that, the queue is empty.

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

**Time** `O(1)` amortized per operation, because each item is moved between the stacks at most once. **Space** `O(n)`.
:::
