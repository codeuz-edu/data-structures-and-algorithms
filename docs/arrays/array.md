---
title: Array
description: "Arrays in Python: how indexing works in constant time, why inserting or deleting in the middle has to shift the other items, and how linear search finds a value."
---

# Array

An array has equal-sized cells stored side by side. Each cell has an index. In Python the first index is 0, and an index gives enough information to calculate the location of a cell directly.

**You need:** [Measuring Cost](/foundations/measuring-cost), [References and Memory](/foundations/references).

## Interface

The `Array` class on this page has a fixed capacity, chosen when it is created. For an array `a`:

| Operation | What it does | Cost |
| --- | --- | --- |
| `get(index)` | Return the item at `index` | `O(1)` |
| `set(index, value)` | Replace the item at `index` with `value` | `O(1)` |
| `insert(index, value)` | Put `value` at `index`, moving the items after it one cell right | `O(n)` |
| `delete(index)` | Remove the item at `index`, moving the items after it one cell left | `O(n)` |
| `find(value)` | Return the index of the first item equal to `value`, or -1 | `O(n)` |
| `len(a)` | Return the number of items | `O(1)` |
| `for value in a` | Visit the items from index 0 up | `O(n)` |

`n` is the number of items in the array. Each cost is the worst case. Inserting or deleting at the end is `O(1)`, as the sections below show.

## Layout

<Diagram label="Anatomy" :width="520" :height="116" alt="An array of six cells holding 12, 7, 3, 9, 5 and 8, numbered 0 to 5. An arrow labelled items[3] marks the cell at index 3.">
 <DCells :x="116" :y="44" :values="[12, 7, 3, 9, 5, 8]" indices :marks="{ 3: 'items[3]' }" :states="{ 3: 'hit' }" />
</Diagram>

The items fill the cells from index 0 with no gaps, and every cell is the same size. Two numbers describe it: its size, the number of items it holds, and its capacity, the number of cells it has.

A Python `list` is an array underneath, with one difference from the drawing. Each cell holds a [reference](/foundations/references#a-list-holds-references) to an object stored elsewhere, not the object itself. References all have the same size, so the cells do too, whatever the items are. That is how one list can hold a number, a string and another list. The diagrams on this site draw the values inside the cells because that is easier to read.

To show how an array works, the `Array` class on this page uses a list of fixed length as its block of memory. It never calls `insert`, `append` or `del` on that list. It only reads and writes cells by index.

## Read and write

<Diagram label="Read items[3]" cost="O(1)" :width="520" :height="160" alt="Six cells holding 12, 7, 3, 9, 5 and 8. The array starts at address 1000 and each cell takes 8 bytes, so the cells start at 1000, 1008, 1016, 1024, 1032 and 1040. The address of items[3] is 1000 + 3 × 8 = 1024, found with one calculation.">
 <DCells :x="116" :y="44" :values="[12, 7, 3, 9, 5, 8]" indices :marks="{ 3: 'items[3]' }" :states="{ 3: 'hit' }" />
 <text class="dg-note end" x="104" y="101">index</text>
 <text class="dg-note end" x="104" y="119">address</text>
 <text v-for="i in [0, 1, 2, 3, 4, 5]" :key="i" class="dg-index" :x="140 + 48 * i" y="115">{{ 1000 + 8 * i }}</text>
 <text class="dg-note is-accent" x="260" y="148">start + index × cell size = 1000 + 3 × 8 = 1024</text>
</Diagram>

1. Check that `index` names an item: `0 <= index < size`.
2. Work out the address: the start of the array plus `index` times the cell size.
3. Read or write that one cell.

```py
def get(self, index):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    return self.items[index]

def set(self, index, value):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    self.items[index] = value
```

Because the cells are the same size and sit next to each other, finding a cell takes one multiplication and one addition. No walking is needed. Reading or writing by index costs `O(1)` whether the array holds ten items or ten million.

Only the cells from 0 to `size - 1` hold items, so that is the valid range for reading and writing. A Python list also accepts a negative index and counts it from the end: it adds the length, so `items[-1]` means `items[len(items) - 1]`, the last item. The `Array` class keeps the rule simple and rejects negative indexes.

```python
items = [12, 7, 3, 9, 5, 8]
print(items[3])
items[3] = 10
print(items)
print(items[-1])
```

## Insert

<Diagram label="Insert 4 at index 2" cost="O(n)" :width="520" :height="180" alt="To insert 4 at index 2, the items 3, 9 and 5 each move one cell to the right, then 4 is written into the gap.">
 <text class="dg-note end" x="104" y="48">before</text>
 <DCells :x="116" :y="24" :values="[12, 7, 3, 9, 5, null]" :states="{ 5: 'ghost' }" />
 <DArrow v-for="i in [2, 3, 4]" :key="i" :from="[140 + 48 * i, 66]" :to="[188 + 48 * i, 113]" kind="accent" />
 <text class="dg-note end" x="104" y="140">after</text>
 <DCells :x="116" :y="116" :values="[12, 7, 4, 3, 9, 5]" :states="{ 2: 'new' }" indices />
</Diagram>

1. Check the index, and check that a free cell is left.
2. Starting from the last item, move each item one cell to the right until the target index is free.
3. Write the new value into the gap.
4. Add one to the size.

```py
def insert(self, index, value):
    if not 0 <= index <= self.size:
        raise IndexError('index out of range')
    if self.size == len(self.items):
        raise OverflowError('array is full')
    for i in range(self.size, index, -1):
        self.items[i] = self.items[i - 1]
    self.items[index] = value
    self.size += 1
```

The loop runs from the back. Going from the front would overwrite each item before it had been copied. [Insertion sort](/sorting/simple-sorts#insertion-sort) uses the same shift-right loop to make room for each item.

The first check is the bounds rule for insert: `0 <= index <= size`. It allows one more position than reading does. `index == size` is the cell right after the last item, so inserting there adds to the end. Any index past that would leave a hole.

Inserting at the front moves every item, so the worst case is `O(n)`. Inserting at the end moves nothing and costs `O(1)`.

## Delete

<Diagram label="Delete index 1" cost="O(n)" :width="520" :height="180" alt="To delete the item at index 1, the items 3, 9 and 5 each move one cell to the left and the last cell becomes empty.">
 <text class="dg-note end" x="104" y="48">before</text>
 <DCells :x="116" :y="24" :values="[12, 7, 3, 9, 5, null]" :states="{ 1: 'ghost', 5: 'ghost' }" />
 <DArrow v-for="i in [2, 3, 4]" :key="i" :from="[140 + 48 * i, 66]" :to="[92 + 48 * i, 113]" kind="accent" />
 <text class="dg-note end" x="104" y="140">after</text>
 <DCells :x="116" :y="116" :values="[12, 3, 9, 5, null, null]" :states="{ 4: 'ghost', 5: 'ghost' }" indices />
</Diagram>

1. Check that there is an item at the index.
2. Move every item after the target one cell to the left. The first move overwrites the target.
3. Clear the last cell, which now holds a duplicate.
4. Subtract one from the size.

```py
def delete(self, index):
    if not 0 <= index < self.size:
        raise IndexError('index out of range')
    for i in range(index, self.size - 1):
        self.items[i] = self.items[i + 1]
    self.items[self.size - 1] = None
    self.size -= 1
```

Delete uses the same rule as reading, `0 <= index < size`, because there has to be an item to remove. On an empty array no index passes, so `delete(0)` raises `IndexError` instead of making the size negative.

An array may not have holes, which is why the gap has to be closed. Deleting the first item is the slowest case, `O(n)`. Deleting the last is `O(1)`.

## Search

<Diagram label="Find 9" cost="O(n)" :width="520" :height="140" alt="An array holding 12, 7, 3, 9, 5 and 8. The search compares each item with 9, starting at index 0. 12, 7 and 3 do not match. 9 at index 3 does, so find returns 3. The items 5 and 8 are never looked at.">
 <DCells :x="116" :y="44" :values="[12, 7, 3, 9, 5, 8]" indices :marks="{ 3: 'found' }" :states="{ 0: 'done', 1: 'done', 2: 'done', 3: 'hit', 4: 'muted', 5: 'muted' }" />
 <text class="dg-note end" x="104" y="124">equal to 9?</text>
 <text v-for="i in [0, 1, 2]" :key="i" class="dg-note" :x="140 + 48 * i" y="124">no</text>
 <text class="dg-note is-accent" x="284" y="124">yes</text>
</Diagram>

To find a value, the array has nothing to go on but the items themselves, so it checks them one by one. This is called a **linear search**.

1. Start at index 0.
2. Compare the item with the value. If they are equal, return the index.
3. Otherwise move to the next index. If the items run out without a match, return -1.

```py
def find(self, value):
    for i in range(self.size):
        if self.items[i] == value:
            return i
    return -1
```

Returning -1 for a missing value follows Python's `str.find`. In the worst case the value is last or missing, and all `n` items are compared, so a search costs `O(n)`. If the array is kept in sorted order, [binary search](/arrays/binary-search) finds a value in `O(log n)` instead. Sorting it first costs `O(n log n)`, as [merge sort](/sorting/merge-sort) shows.

## Full implementation

`__len__` and `__iter__` are Python extras. The first lets `len(numbers)` work. The second lets `list(numbers)` and `for` loops read the items in order, which makes the array easy to print.

```python
class Array:
    def __init__(self, capacity):  # O(capacity)
        self.items = [None] * capacity
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def __iter__(self):  # O(n)
        for i in range(self.size):
            yield self.items[i]

    def get(self, index):  # O(1)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        return self.items[index]

    def set(self, index, value):  # O(1)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        self.items[index] = value

    def insert(self, index, value):  # O(n)
        if not 0 <= index <= self.size:
            raise IndexError('index out of range')
        if self.size == len(self.items):
            raise OverflowError('array is full')
        for i in range(self.size, index, -1):
            self.items[i] = self.items[i - 1]
        self.items[index] = value
        self.size += 1

    def delete(self, index):  # O(n)
        if not 0 <= index < self.size:
            raise IndexError('index out of range')
        for i in range(index, self.size - 1):
            self.items[i] = self.items[i + 1]
        self.items[self.size - 1] = None
        self.size -= 1

    def find(self, value):  # O(n)
        for i in range(self.size):
            if self.items[i] == value:
                return i
        return -1

numbers = Array(6)
for value in [12, 7, 3, 9, 5]:
    numbers.insert(len(numbers), value)
print(list(numbers), len(numbers))

numbers.insert(2, 4)
print(list(numbers))

numbers.delete(1)
print(list(numbers))

numbers.set(0, 10)
print(numbers.get(0), numbers.find(9), numbers.find(8))

try:
    numbers.delete(5)
except IndexError as error:
    print('IndexError:', error)
```

This array has a fixed capacity and refuses a seventh item. The [dynamic array](/arrays/dynamic-array) removes that limit.

## In Python

Python's `list` is this array with room to grow, as the [dynamic array](/arrays/dynamic-array) page shows. These are the costs of its common operations. `n` is the length of the list, and `k` is the number of items a slice copies or `extend` adds.

| Operation | Cost |
| --- | --- |
| `len(items)` | `O(1)` |
| `items[i]`, `items[i] = x` | `O(1)` |
| `items.append(x)` | `O(1)` [amortized](/arrays/dynamic-array#why-append-is-still-cheap) |
| `items.pop()` | `O(1)` |
| `items.insert(0, x)`, `items.pop(0)` | `O(n)` |
| `x in items`, `items.index(x)`, `items.remove(x)` | `O(n)` |
| `items[a:b]` | `O(k)` |
| `items.extend(other)` | `O(k)` amortized |
| `items.sort()` | `O(n log n)` |

Three traps follow from the table.

- `insert(i, x)` and `pop(i)` shift every item after position `i`, so they are slow near the front. For a queue use `collections.deque`, as the [queue](/stacks-queues/queue#deque) page explains.
- `in`, `index` and `remove` are linear searches. Inside a loop they make the loop `O(n²)`. A Python `set` answers `in` in `O(1)` on average.
- A slice is a copy. `items[1:]` builds a new list of `n - 1` references, so cutting off the first item in a loop copies the rest every time, `O(n²)` in total. Walk an index instead.

A list cell holds a reference, and each number it refers to is a full Python object. For many numbers of one type, the `array` module stores the values themselves in the cells, the way the diagrams on this page draw them. `bytes` and `bytearray` do the same with one byte per cell. They use much less memory than a list, and each accepts only its one type.

```python
from array import array

items = [12, 7, 3, 9, 5, 8]
rest = items[1:]
rest[0] = 99
print(items)
print(rest)

compact = array('i', items)
print(compact[3], compact.itemsize)
```

The slice changed and the list did not, because the slice is a separate copy. `itemsize` is the number of bytes each value takes in the compact array.

## Two-dimensional arrays

A table with rows and columns, such as a game board or an image, is a 2D array. In Python the usual form is a list of lists: `grid[r]` is row `r`, and `grid[r][c]` is the item in row `r`, column `c`.

<Diagram label="Row-major layout" :width="640" :height="172" alt="A grid with two rows and three columns holds 12, 7 and 3 in row 0 and 9, 5 and 8 in row 1. Stored row by row, it becomes one block of six cells: 12, 7, 3, 9, 5, 8. The item at row 1, column 2 is 8, and in the block it is at index 1 × 3 + 2 = 5.">
 <text class="dg-note end" x="60" y="60">row 0</text>
 <DCells :x="72" :y="36" :values="[12, 7, 3]" />
 <text class="dg-note end" x="60" y="100">row 1</text>
 <DCells :x="72" :y="76" :values="[9, 5, 8]" :states="{ 2: 'hit' }" indices />
 <text class="dg-note" x="265" y="68">stored as</text>
 <DArrow :from="[224, 76]" :to="[311, 76]" />
 <line class="dg-link is-muted" x1="318" y1="44" x2="458" y2="44" /><text class="dg-label" x="388" y="36">row 0</text>
 <line class="dg-link is-muted" x1="462" y1="44" x2="602" y2="44" /><text class="dg-label" x="532" y="36">row 1</text>
 <DCells :x="316" :y="56" :values="[12, 7, 3, 9, 5, 8]" :states="{ 5: 'hit' }" indices />
 <text class="dg-note is-accent" x="320" y="156">grid[1][2] is cell 1 × 3 + 2 = 5</text>
</Diagram>

Memory is one long line of cells, so a language with true 2D arrays, or a library such as NumPy, stores the rows one after another. This is called **row-major** order. With `cols` columns, row `r` starts at index `r × cols`, so `grid[r][c]` is cell `r × cols + c`. Finding it is still one calculation, `O(1)`.

A Python list of lists is not one block. The outer list holds a reference to each row, and each row is a list of its own. Reading `grid[r][c]` takes two steps instead of one, which is still `O(1)`.

```python
rows, cols = 2, 3
grid = [[0] * cols for _ in range(rows)]
grid[1][2] = 8
print(grid)

flat = [0] * (rows * cols)
flat[1 * cols + 2] = 8
print(flat)
```

Build the rows with a comprehension, as above. `[[0] * cols] * rows` repeats one reference, so every row is the same list and a write to one row shows up in all of them. The [References and Memory](/foundations/references#the-shared-row-trap) page shows this trap.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Read or write at index `i` | `O(1)` |
| Read or write `grid[r][c]` in a 2D array | `O(1)` |
| Insert or delete at the end | `O(1)` |
| Insert or delete at the front or middle | `O(n)` |
| Search by value | `O(n)` |
| Space | `O(capacity)`, reserved up front |

## When to use

Use an array when you read and write items by position, or add and remove them only at the end. Those are all `O(1)`. In Python code that means a `list`.

Avoid it when items are often added or removed at the front or in the middle, since every change shifts the items after it. A `deque` handles both ends in `O(1)`, and a [linked list](/linked-lists/singly-linked-list) inserts next to a node it already holds in `O(1)`. If you mostly ask whether a value is present, a Python `set`, which is a [hash table](/hash-tables/hash-table), answers in `O(1)` on average instead of `O(n)`. [Choosing a Structure](/choosing-a-structure) compares every structure on the site.

## Application

When the keys are small whole numbers, an array works as a lookup table: the key is the index. Counting lowercase English letters is one case. There are 26 letters in this alphabet, so 26 counters cover them, and `ord(letter) - ord('a')` turns a letter into its index.

```python
def letter_counts(text):
    counts = [0] * 26
    for letter in text:
        if 'a' <= letter <= 'z':
            counts[ord(letter) - ord('a')] += 1
    return counts

counts = letter_counts('banana bread')
for i in range(26):
    if counts[i] > 0:
        print(chr(ord('a') + i), counts[i])
```

Each letter goes straight to its counter in `O(1)`, so counting a text of `n` letters costs `O(n)`, and the counts come out in alphabetical order without sorting. A [hash table](/hash-tables/hash-table) extends the same idea to keys that are not small numbers.

## Key points

- An array keeps its items in one block, so `items[i]` is found by arithmetic in `O(1)`.
- Inserting or deleting anywhere but the end shifts the items after it, which is `O(n)`.
- Insert accepts `0 <= index <= size`. Read, write and delete need `0 <= index < size`.
- Finding a value takes a linear search, `O(n)`, unless the array is sorted.
- A Python list cell holds a reference, so a 2D list is a list of references to rows. Build each row separately.

## Exercise

Write `remove_all`, which removes every item equal to `value` and returns how many it removed. Do it in one pass. Calling `delete` once for each match would shift the array again every time. Hint: keep a second index for the next cell to fill.

```python
class Array:
    def __init__(self, values):
        self.items = list(values)
        self.size = len(self.items)

    def __iter__(self):
        for i in range(self.size):
            yield self.items[i]

    def remove_all(self, value):
        pass

numbers = Array([7, 12, 7, 3, 7, 9])
print(numbers.remove_all(7))
print(list(numbers))
print(numbers.items)
```

::: details Solution
Use two indexes. `read` visits every item, and `write` is the next cell to fill. Each item that does not match is copied down to `write`, and `write` moves on. At the end the items to keep sit in cells 0 to `write - 1`, so clear the cells after them and set the size to `write`.

```python
class Array:
    def __init__(self, values):
        self.items = list(values)
        self.size = len(self.items)

    def __iter__(self):
        for i in range(self.size):
            yield self.items[i]

    def remove_all(self, value):
        write = 0
        for read in range(self.size):
            if self.items[read] != value:
                self.items[write] = self.items[read]
                write += 1
        removed = self.size - write
        for i in range(write, self.size):
            self.items[i] = None
        self.size = write
        return removed

numbers = Array([7, 12, 7, 3, 7, 9])
print(numbers.remove_all(7))
print(list(numbers))
print(numbers.items)
```

**Time** `O(n)`: each item is read once and moved at most once. Calling `delete` for each match would cost `O(n²)` when most items match. **Space** `O(1)`.
:::
