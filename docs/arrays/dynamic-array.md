---
title: Dynamic Array
description: "How a dynamic array grows: size versus capacity, doubling when full, and why append is still O(1) amortized. This is how a Python list works."
---

# Dynamic Array

A [fixed-capacity array](/arrays/array) has a set number of cells. A dynamic array grows by allocating a larger block and copying the occupied cells into it. Python’s `list` uses this layout to support indexed access and efficient appends.

**You need:** [Measuring Cost](/foundations/measuring-cost), [Array](/arrays/array).

## Interface

For a dynamic array `a`:

| Operation | What it does | Cost |
| --- | --- | --- |
| `a[index]` | Return the item at `index` | `O(1)` |
| `a[index] = value` | Replace the item at `index` with `value` | `O(1)` |
| `append(value)` | Add `value` at the end, growing the array if it is full | `O(1)` [amortized](#why-append-is-still-cheap) |
| `insert(index, value)` | Put `value` at `index`, moving the items after it one cell right | `O(n)` |
| `pop()` | Remove and return the last item, shrinking the array if it is a quarter full | `O(1)` amortized |
| `pop(index)` | Remove and return the item at `index`, moving the items after it one cell left | `O(n)` |
| `len(a)` | Return the number of items | `O(1)` |
| `for value in a` | Visit the items from index 0 up | `O(n)` |

`n` is the number of items in the array.

## Size and capacity

<Diagram label="Anatomy" :width="520" :height="146" alt="An array with four cells. Three hold 12, 7 and 3 and the fourth is empty. The size is 3 and the capacity is 4.">
 <DCells :x="164" :y="30" :values="[12, 7, 3, null]" :states="{ 3: 'ghost' }" />
 <line class="dg-link is-accent" x1="164" y1="84" x2="308" y2="84" /><text class="dg-note is-accent" x="236" y="100">size = 3</text>
 <line class="dg-link is-muted" x1="164" y1="114" x2="356" y2="114" /><text class="dg-note" x="260" y="130">capacity = 4</text>
</Diagram>

Two numbers describe a dynamic array. The size is how many items it holds. The capacity is how many cells it has reserved. The spare cells are what make the next append cheap.

## Read and write

Reading and writing work exactly as on the [array](/arrays/array#read-and-write) page: check the index, then go straight to the cell. Here the methods have the names that Python's square brackets call. `a[index]` calls `__getitem__`, and `a[index] = value` calls `__setitem__`.

1. Check that `index` names an item: `0 <= index < size`.
2. Read or write that cell.

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

The spare cells past the size hold no items, so they are out of range too. Both methods cost `O(1)`.

## Append

<Diagram label="Append 9" cost="O(1)" :width="520" :height="100" alt="The value 9 is written into the free fourth cell. Nothing else moves.">
 <DCells :x="164" :y="30" :values="[12, 7, 3, 9]" :states="{ 3: 'new' }" />
</Diagram>

While the size is below the capacity, an append writes into the next free cell and adds one to the size. When the array is full, it has to grow first.

<Diagram label="Append 5 to a full array" cost="O(n)" :width="520" :height="176" alt="The array is full, so a new array with twice the capacity is created. The four items are copied across and 5 goes into the fifth cell.">
 <text class="dg-note end" x="152" y="48">old</text>
 <DCells :x="164" :y="24" :values="[12, 7, 3, 9]" :states="['muted', 'muted', 'muted', 'muted']" />
 <DArrow v-for="i in [0, 1, 2, 3]" :key="i" :from="[188 + 48 * i, 66]" :to="[92 + 48 * i, 113]" kind="accent" />
 <text class="dg-note end" x="56" y="140">new</text>
 <DCells :x="68" :y="116" :values="[12, 7, 3, 9, 5, null, null, null]" :states="{ 4: 'new', 5: 'ghost', 6: 'ghost', 7: 'ghost' }" />
</Diagram>

1. If the array is full, reserve a new block with twice the capacity, copy every item into it, and drop the old block.
2. Write the new value into the first free cell, at index `size`.
3. Add one to the size.

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

An append with room costs `O(1)`. An append that resizes copies all `n` items and costs `O(n)`. The next section shows why the second kind does not spoil the average.

## Why append is still cheap

A resize copies every item, which is `O(n)`. It also doubles the room, so the next resize is twice as far away. Appending `n` items triggers copies of 1, 2, 4, 8 and so on, and those add up to less than `2n`. Spread over all the appends, each one costs a constant amount.

The cost of an operation averaged over a whole run of operations is called its **amortized** cost. Append is `O(1)` amortized: a single append may cost `O(n)`, but `n` appends in a row never cost more than `O(n)` together. This is a promise about every run of appends, not an average over lucky inputs.

Doubling is what makes this work. Growing by a fixed step, say ten cells at a time, would not keep append cheap. Each resize would still copy every item, but a resize would come every ten appends, so `n` appends would copy about `n² / 20` items. That is `O(n²)` in total, or `O(n)` per append on average.

The program below counts the copies both ways, for 1000 and then 2000 appends. The only difference is the function that picks the new capacity.

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

With doubling, a thousand appends cost 1023 copies, about one per append, and twice the appends cost twice the copies. Adding ten cells costs 49,600 copies for a thousand appends, and twice the appends cost four times as many. A count that goes up four times when `n` doubles is the [mark of `O(n²)`](/foundations/measuring-cost#reading-the-cost-from-code).

A [hash table](/hash-tables/hash-table#load-factor-and-resizing) grows in the same way when it gets too full, and its inserts stay `O(1)` amortized for the same reason.

## Insert

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

1. Check the index: `0 <= index <= size`, the same rule as on the [array](/arrays/array#insert) page.
2. If the array is full, grow it with `_resize`, as append does.
3. Starting from the last item, move each item one cell to the right until the target index is free.
4. Write the new value into the gap and add one to the size.

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

Growing and shifting are each `O(n)`, and they happen one after the other, so an insert costs `O(n)` either way. Unlike the fixed array, a dynamic array never refuses an insert for lack of room.

## Pop

<Diagram label="Pop the last item" cost="O(1)" :width="520" :height="100" alt="An array holding 12, 7, 3 and 9. The last cell is cleared and its item, 9, is returned. Nothing else moves.">
 <DCells :x="164" :y="30" :values="[12, 7, 3, 9]" :states="{ 3: 'ghost' }" />
 <text class="dg-note is-accent start" x="372" y="54">returns 9</text>
</Diagram>

`pop` removes an item and returns it. With no index it takes the last item, like `list.pop`.

1. If the array is empty, raise `IndexError`. If no index was given, use the last one, `size - 1`.
2. Check the index and keep the item to return.
3. Move every item after it one cell to the left, as delete does on the [array](/arrays/array#delete) page.
4. Clear the last cell, subtract one from the size and return the item.

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

Popping the last item moves nothing and costs `O(1)`. Popping the first moves every other item and costs `O(n)`.

## Shrinking

As written so far, pop never gives memory back, so an array that once held a million items keeps a million cells. Consider halving the capacity when the array becomes half full. Alternating appends and pops can make this rule resize on every operation.

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

Take an array that has just grown from 4 to 8 cells and holds 5 items. A pop leaves 4 items, half of 8, so the array halves to 4 cells and copies 4 items. The next append finds it full and doubles again, copying 4 more. If appends and pops keep alternating, every one of them copies the whole array and costs `O(n)`.

Waiting until the array is a quarter full avoids this. A shrink then leaves the array half full, just as a grow does, so many cheap appends or pops have to come before the next resize in either direction, enough to pay for its copies. Pop becomes `O(1)` amortized, like append, and the block is never more than four times the number of items unless the array is empty.

```py
def pop(self, index=None):
    ...
    self.size -= 1
    if 0 < self.size <= self.capacity // 4:
        self._resize(self.capacity // 2)
    return value
```

The new check goes at the end of `pop`, before the `return`. `0 < self.size` stops an empty array from shrinking to no cells at all: doubling a capacity of 0 gives 0, and the array could never grow again. Python's `list` also gives memory back when it gets much emptier.

## Full implementation

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

Five appends grow the capacity from 1 to 2, 4 and then 8. Three pops leave three items in eight cells. The fourth leaves two, a quarter of eight, so the block halves to 4 cells.

## In Python

CPython implements `list` as a dynamic array of references. `sys.getsizeof` reports the memory used by the list object and its array of references, not by the items. It stays flat for several appends and then jumps, and each jump is a resize.

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

Python grows its lists by a smaller factor than 2, which wastes less memory. Append keeps the same `O(1)` amortized cost, at the price of more frequent copies.

Two traps follow from how a list works.

- `items = items + [x]` builds a new list and copies every item into it, so doing it in a loop costs `O(n²)`. `items.append(x)` and `items += [x]` add to the same list in `O(1)` amortized.
- `insert(0, x)` and `pop(0)` shift every other item, so each costs `O(n)`. A list makes a good [stack](/stacks-queues/stack), which only uses the end, and a poor queue, as [the trap with a list](/stacks-queues/queue#the-trap-with-a-list) shows.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Read or write at index `i` | `O(1)` |
| Append | `O(1)` amortized, `O(n)` for an append that resizes |
| Pop the last item | `O(1)` amortized, `O(n)` for a pop that shrinks |
| Insert or pop at the front or middle | `O(n)` |
| Space | `O(n)` |

## When to use

A dynamic array is the default way to keep items in order. Use it when you read items by position and add or remove them at the end, especially when you do not know in advance how many there will be. That is why Python's `list` is one, and why a list is the usual base for a [stack](/stacks-queues/stack).

Do not use it when items come and go at the front: each one shifts the whole array. `collections.deque` handles both ends in `O(1)`, as the [queue](/stacks-queues/queue#deque) page shows. The same goes when every single append has to be fast, not just the average, because a resize copies everything at once. A `deque` never copies its items to grow. [Choosing a Structure](/choosing-a-structure) compares every structure on the site.

## Application

A dynamic array is the natural place to collect results when you cannot tell how many there will be. The Collatz sequence is an example. The example starts from 6 and 27 and stops at 1. Whether every positive starting value reaches 1 is the Collatz conjecture. Follow this rule at each step: halve an even number, and replace an odd number `x` with `3x + 1`. The length of the sequence is not known until you run it, so there is no capacity to choose up front.

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

Starting from 27 the sequence has 112 numbers and climbs to 9232 before it falls back. Every `append` is `O(1)` amortized, so collecting `n` numbers costs `O(n)` in total.

## Key points

- A dynamic array has a size and a capacity. The spare cells make the next append cheap.
- When it is full, it copies every item into a block twice as big. When a pop leaves it a quarter full, it halves.
- Doubling makes append `O(1)` amortized. Growing by a fixed step would make it `O(n)` on average.
- Appending and popping at the end take amortized `O(1)` time. Inserting or popping at the front can shift `O(n)` items.
- Python's `list` is a dynamic array. For work at the front, use `deque`.

## Exercise

Write `extend`, which appends every item of the list `values`. Resize at most once: work out how many items there will be, double the capacity until they fit, and call `_resize` once before writing. In the example, appending the five values one by one would resize three times.

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

::: details Solution
The array will hold `size + len(values)` items. Double a copy of the capacity until it is at least that, and resize only if it changed. After that every value has a free cell, so the loop just writes and counts. Python's own `list.extend` also makes room once when it knows how many items are coming.

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

**Time** `O(n + k)` for `n` items already stored and `k` new ones: the old items are copied at most once and each new one is written once. **Space** `O(n + k)` for the bigger block.
:::
