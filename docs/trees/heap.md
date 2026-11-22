---
title: Heap
description: "A binary heap in Python: the heap rule, a complete binary tree stored in a list, push with sift up, pop with sift down, bottom-up heapify in O(n), in-place heap sort, the heapq module with its pitfalls, and where heaps are used."
---

# Heap

A min-heap keeps the smallest value at its root. It takes one step to read that value and at most a logarithmic number of comparisons to move a value up or down the tree. This makes a heap a natural way to implement a priority queue.

This page describes a min-heap, where the smallest value is on top. A max-heap is the same with every comparison reversed.

**You need:** [Dynamic Array](/arrays/dynamic-array) and [Binary Tree](/trees/binary-tree).

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `push(value)` | Add `value` | `O(log n)` [amortized](/arrays/dynamic-array#why-append-is-still-cheap) |
| `pop()` | Remove the smallest value and return it | `O(log n)` amortized |
| `peek()` | Return the smallest value and leave it in place | `O(1)` |
| `heapify(values)` | Replace the contents with `values`, rearranged into a heap | `O(n)` |
| `is_empty()` | Tell whether the heap has no values | `O(1)` |
| `len(heap)` | Return the number of values | `O(1)` |

`n` is the number of values. `pop` and `peek` raise `IndexError` when the heap is empty. Push is amortized because the list underneath now and then has to grow.

## The heap rule

<Diagram label="Anatomy" :width="600" :height="270" alt="A heap drawn as a tree with 2 at the root, then 4 and 3, then 9, 7, 8 and 5. Below it the same values in an array: 2, 4, 3, 9, 7, 8, 5. The small number next to each tree node is its index in the array.">
 <DTree :x="300" :y="36" :width="320" :gap="56" :values="[2, 4, 3, 9, 7, 8, 5]" :notes="{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }" />
 <DCells :x="132" :y="206" :values="[2, 4, 3, 9, 7, 8, 5]" indices />
</Diagram>

A heap is a [binary tree](/trees/binary-tree) with two properties.

- Order: every node is smaller than or equal to its children. The smallest value is therefore always the root.
- Shape: the tree is a [complete binary tree](/trees/binary-tree#tree-shapes). Every level is full except possibly the last, which fills from the left.

The shape fixes the height. A complete binary tree with `n` nodes has height `⌊log n⌋`: the seven values above fit in three levels, height 2, and a million values need only 20 levels.

Unlike a [search tree](/trees/binary-search-tree), a heap does not order left against right. 4 and 3 could swap places and it would still be a heap.

## A tree stored in an array

Because the shape has no gaps, the tree can be written level by level into an array, as on the [Binary Tree](/trees/binary-tree#storing-a-tree-in-an-array) page, with no slot wasted. The nodes need no links to their children. Index arithmetic finds the relatives of the node at index `i`:

| Relative | Index |
| --- | --- |
| Parent | `(i - 1) // 2` |
| Left child | `2 * i + 1` |
| Right child | `2 * i + 2` |

The class on this page keeps the array in a Python list, a [dynamic array](/arrays/dynamic-array) that grows at the end.

## Push

<Diagram label="Push 1" cost="O(log n) amortized" :width="600" :height="240" alt="The new value 1 is added at the end, as a child of 9. It is smaller than 9, so they swap. It is smaller than 4, so they swap. It is smaller than 2, so they swap, and 1 becomes the root.">
 <DTree :x="300" :y="36" :width="400" :gap="56" :values="[2, 4, 3, 9, 7, 8, 5, 1]" :states="{ 7: 'new', 3: 'done', 1: 'done', 0: 'done' }" :edges="{ 7: 'accent', 3: 'accent', 1: 'accent' }" />
 <DStep :x="120" :y="172" :n="1" /><DStep :x="158" :y="114" :n="2" /><DStep :x="234" :y="56" :n="3" />
</Diagram>

1. Put the new value in the next free spot, the end of the array. The shape is right and the order may be wrong.
2. Compare it with its parent. If it is smaller, swap them.
3. Repeat until the parent is smaller than or equal to it, or it reaches the root.

This is called sifting up. Here 1 swaps with 9, then 4, then 2, and the array becomes `[1, 2, 3, 4, 7, 8, 5, 9]`.

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

The value climbs at most one level per swap, and the tree has height `⌊log n⌋`, so the sifting costs `O(log n)`. The `append` underneath is `O(1)` amortized, which makes push `O(log n)` amortized.

## Pop

<Diagram label="Pop the smallest" cost="O(log n)" :width="680" :height="214" alt="The root 2 is removed and returned. On the left, the last item, 5, has moved into the root. Its smaller child is 3, so they swap. On the right, the heap after the swap: 3 at the root and 5 below it on the right. The only child of 5 is 8, which is larger, so the sift stops.">
 <DBox :x="20" :y="34" :w="40" text="2" state="ghost" /><text class="dg-note" x="40" y="90">returned</text>
 <DTree :x="210" :y="40" :width="240" :gap="56" :r="16" :values="[5, 4, 3, 9, 7, 8]" :states="{ 0: 'new', 2: 'hit' }" :edges="{ 2: 'accent' }" />
 <DStep :x="256" :y="58" :n="1" />
 <DArrow :from="[306, 96]" :to="[409, 96]" kind="muted" />
 <DTree :x="505" :y="40" :width="240" :gap="56" :r="16" :values="[3, 4, 5, 9, 7, 8]" :states="{ 2: 'new' }" :edges="{ 2: 'accent' }" :notes="{ 2: '8 > 5, stop' }" />
 <text class="dg-note" x="210" y="200">5 moves to the root</text>
 <text class="dg-note" x="505" y="200">5 swaps with 3, its smaller child</text>
</Diagram>

1. Save the root, which is the answer.
2. Move the last item into the root. The shape is right and the order may be wrong.
3. Compare it with its smaller child. If the child is smaller, swap them.
4. Repeat until both children are at least as large, or it becomes a leaf.

This is called sifting down. The swap has to be with the smaller child. Swapping with the larger one would put it above its smaller sibling and break the order.

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

Sifting takes `O(log n)` time because each swap moves the value down one level. The list can also shrink, so the total is `O(log n)` amortized.

## Peek

The smallest value is always the root, at index 0, so `peek` reads it without changing anything. Like `pop`, it first checks for an empty heap and raises an `IndexError` that says so.

```py
def peek(self):
    if self.is_empty():
        raise IndexError('peek at an empty heap')
    return self.items[0]
```

`peek` costs `O(1)`.

## Heapify

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

Pushing `n` values one at a time costs `O(n log n)`. When all the values are there from the start, a heap can be built faster, from the bottom up.

1. Copy the values into the list as they are. The shape is already right, and only the order is wrong.
2. Every node in the second half of the list is a leaf, and a leaf on its own is already a heap. The last node with a child is at index `n // 2 - 1`.
3. Sift down each index from `n // 2 - 1` back to 0.

When index `i` is reached, both of its subtrees are already heaps, so one sift down makes the subtree at `i` a heap as well. After index 0 the whole list is one. Here the result is the heap from the top of the page.

```py
def heapify(self, values):
    self.items = list(values)
    for i in range(len(self.items) // 2 - 1, -1, -1):
        self._sift_down(i)
```

Why is this `O(n)` when pushing is `O(n log n)`? In the worst case a pushed value climbs from the bottom to the root, and half of the values are added on the bottom level, where that climb is longest. Heapify sifts down instead, and a value can only sink as far as the levels below it. Half of the nodes are leaves and do not move at all. A quarter sit one level above the leaves and move at most one level, an eighth move at most two, and so on. The long moves belong to the few nodes near the top. Added up, the moves come to fewer than `n`, so heapify costs `O(n)`.

## Heap sort

A heap can also sort a list in place, without a second list. It uses a max-heap, the mirror image with the largest value on top, kept inside the list itself. The sorted part grows from the right end while the heap part shrinks.

1. Heapify the list as a max-heap. The largest value is now at index 0.
2. Swap it with the last item of the heap part. It is now in its final place, and the heap part is one item shorter.
3. Sift the new first item down, within the heap part only.
4. Repeat until the heap part holds one item.

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

`sift_down` is `_sift_down` from above with the comparisons reversed and a `size` argument, so that it never reaches into the sorted part.

Heapify costs `O(n)`, and each of the `n - 1` swaps is followed by a sift down of at most `⌊log n⌋` levels, so heap sort costs `O(n log n)` in every case, sorted input included. Everything happens by swapping inside the list, so the extra space is `O(1)`. It is not stable: the long swaps to the end can carry an item past an equal one. Sorting `2a, 2b, 1`, where the letters only tell the two 2s apart, gives `1, 2b, 2a`. The [Quicksort](/sorting/quicksort#analysis) page compares heap sort with the other sorts. In Python, `sorted` is faster in practice, so heap sort is for when `O(n log n)` must be guaranteed with no extra memory.

## Full implementation

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

## In Python

Python has a heap built in. The `heapq` module works on a plain list and keeps it in heap order, with the smallest item at index 0. `heappush` and `heappop` cost the same as `push` and `pop` above, and `heapq.heapify(items)` is the bottom-up build, `O(n)`.

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

Three traps, one per part of the example.

- Ties compare the next item. Tuples compare item by item, so `(priority, task)` works until two tasks share a priority. Then Python compares the tasks themselves, and for dictionaries, or objects with no order, that raises `TypeError`. A counter in the middle, `(priority, count, task)`, settles every tie before the task is reached, and tasks with equal priority come out in the order they went in. `itertools.count()` hands out the numbers.
- Only `items[0]` is guaranteed. The rest of the list is in heap order, not sorted: `numbers[-1]` is 8, not the largest number. To read the items in order, pop them, or use `heapq.nsmallest` or `sorted`.
- `heapq` is a min-heap. For largest first, push negated numbers and negate them again when they come out. Python 3.14 added `heappush_max`, `heappop_max` and `heapify_max` for max-heaps.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Peek at the smallest | `O(1)` |
| Push | `O(log n)` amortized |
| Pop the smallest | `O(log n)` amortized |
| Heapify `n` values | `O(n)` |
| Build by pushing `n` values one at a time | `O(n log n)` |
| `len`, `is_empty` | `O(1)` |
| Heap sort `n` values in place | `O(n log n)`, with `O(1)` extra space |
| Space | `O(n)` |

Compared with a list. A priority queue can also be built on a plain list, but each choice makes one operation cheap and the other slow. The heap keeps both at `O(log n)`.

| Built on | Push | Pop the smallest | Peek |
| --- | --- | --- | --- |
| Unsorted list | `O(1)` amortized | `O(n)` | `O(n)` |
| Sorted list, smallest at the end | `O(n)` | `O(1)` | `O(1)` |
| Heap | `O(log n)` amortized | `O(log n)` | `O(1)` |

An unsorted list adds at the end but has to search for the smallest. A list kept sorted from largest to smallest has the smallest at the end, ready for `pop()`, but every push has to shift items to keep the order.

## When to use

Use a heap when you repeatedly need the smallest (or largest) item while new items keep arriving. The [Application](#application) section lists where that happens.

- To find an arbitrary value, or to go through the items in order, use a [binary search tree](/trees/binary-search-tree) or a sorted list. A heap has no search, and only the top is in a known place.
- When all the items arrive first and are then taken out in order, sorting the list once is simpler.
- For first come, first served, use a [queue](/stacks-queues/queue).

In Python code, use `heapq`. The class on this page shows how it works inside.

## Application

A heap is at work wherever the next item to handle is the smallest or the largest so far.

- Scheduling: run the most urgent task next, as in the task list under [In Python](#in-python).
- Top `k`: keep the `k` largest or smallest items of a long stream, worked out below. `heapq.nlargest` and `heapq.nsmallest` do it in one call.
- Merging sorted streams: `heapq.merge` keeps the front item of each stream in a heap and always hands out the smallest.
- Running median: a max-heap holds the smaller half of the numbers seen so far and a min-heap the larger half, so the median sits at their tops.
- Shortest paths: [Dijkstra's algorithm](/graphs/shortest-paths) takes the closest unsettled vertex from a heap.
- Minimum spanning trees: [Prim's algorithm](/graphs/minimum-spanning-tree) takes the cheapest edge leaving the tree from a heap.
- Compression: [Huffman coding](/algorithm-design/greedy#huffman-coding) joins the two rarest symbols, taken from a heap, again and again.

To keep the `k` largest values from a long stream, keep a min-heap of at most `k` values. Push each new value, and when the heap grows past `k`, pop its smallest. The root is always the smallest of the values kept, the one a newcomer has to beat.

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

Each value costs one push and at most one pop on a heap of at most `k + 1` values. The whole stream of `n` values costs `O(n log k)` time and `O(k)` space, however long it is. `heapq.nlargest` gives the same answer in one call.

## Key points

- A heap is a complete binary tree in which every node is at most as large as its children, so the smallest value is at the root.
- It lives in a list: the children of index `i` are at `2 * i + 1` and `2 * i + 2`, and the height is `⌊log n⌋`.
- Push sifts up and pop sifts down, `O(log n)` each. Peek is `O(1)`.
- Heapify builds a heap in `O(n)` by sifting down from the last parent back to the root. Heap sort then swaps the top to the end `n - 1` times: `O(n log n)`, `O(1)` extra space, not stable.
- `heapq` is a min-heap on a plain list. Use `(priority, count, item)` to break ties, and trust only `items[0]`.

## Exercise

Add `replace(value)` to `MinHeap`. It removes and returns the smallest value and adds `value` in the same call, like a `pop` followed by a `push` but with a single sift. Raise `IndexError` when the heap is empty.

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

::: details Solution
A `pop` followed by a `push` moves the last item to the root and sifts it down, then appends `value` and sifts it up. `replace` does less: `value` goes straight into the root, and one sift down puts it in place. The value returned is the old smallest even when `value` is smaller, as the second line shows. `heapq.heapreplace` works the same way.

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

**Time** `O(log n)`. **Space** `O(1)`.
:::
