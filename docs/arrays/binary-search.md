---
title: Sorted Array and Binary Search
description: "Binary search in Python: how halving a sorted array finds a value in O(log n), finding the first position of a value, and the bisect module."
---

# Sorted Array and Binary Search

In a sorted array, the middle value tells you which half could still contain the value you want. Repeat the comparison in that half until you find the value or the range is empty. With constant-time indexing, this takes `O(log n)` steps.

## The idea

<Diagram label="Search for 23" cost="O(log n)" :width="700" :height="250" alt="A sorted array of ten numbers. Step 1: the middle item is 16, which is less than 23, so the left half is dropped. Step 2: the middle of what is left is 56, which is greater than 23, so the right part is dropped. Step 3: the middle is 23, found at index 5.">
 <text class="dg-note end" x="98" y="68">step 1</text>
 <DCells :x="110" :y="44" :w="44" :values="[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" :states="{ 4: 'hit' }" :marks="{ 0: 'lo', 4: 'mid', 9: 'hi' }" />
 <text class="dg-note start" x="562" y="68">16 &lt; 23, go right</text>
 <text class="dg-note end" x="98" y="148">step 2</text>
 <DCells :x="110" :y="124" :w="44" :values="[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" :states="{ 0: 'ghost', 1: 'ghost', 2: 'ghost', 3: 'ghost', 4: 'ghost', 7: 'hit' }" :marks="{ 5: 'lo', 7: 'mid', 9: 'hi' }" />
 <text class="dg-note start" x="562" y="148">56 &gt; 23, go left</text>
 <text class="dg-note end" x="98" y="228">step 3</text>
 <DCells :x="110" :y="204" :w="44" :values="[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" :states="{ 0: 'ghost', 1: 'ghost', 2: 'ghost', 3: 'ghost', 4: 'ghost', 5: 'new', 7: 'ghost', 8: 'ghost', 9: 'ghost' }" :marks="{ 5: 'lo · mid', 6: 'hi' }" indices />
 <text class="dg-note is-accent start" x="562" y="228">found at index 5</text>
</Diagram>

Two indexes, `lo` and `hi`, mark the part of the array that could still hold the target.

1. Look at the middle: `mid = (lo + hi) // 2`.
2. If `items[mid]` is the target, return `mid`.
3. If it is smaller than the target, the target can only be to the right: `lo = mid + 1`.
4. If it is larger, the target can only be to the left: `hi = mid - 1`.
5. When `lo` passes `hi`, nothing is left and the target is not there.

```python
def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(numbers, 23))
print(binary_search(numbers, 2))
print(binary_search(numbers, 40))
```

## Why it is O(log n)

Each step drops at least half of what is left. Ten items shrink to five, two, one. The number of halvings needed to get from `n` items down to one is [`log n`](/foundations/measuring-cost#what-log-n-means).

| Items | Linear search, worst case | Binary search, worst case |
| --- | --- | --- |
| 10 | 10 | 4 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

## Getting the details right

Binary search is short and easy to get wrong. Three things to check.

- **The array must be sorted.** On unsorted data the code runs and returns wrong answers without any error.
- **The loop condition is `lo <= hi`.** With `<` the search misses the case where one item is left.
- **Move past `mid`.** Write `mid + 1` and `mid - 1`. Setting `lo = mid` can leave the range unchanged, and the loop never ends.

The logarithmic running time assumes constant-time access by index. In a [linked list](/linked-lists/singly-linked-list), reaching the middle takes a walk through the nodes. An index-based binary search there can spend more time moving between nodes than a single linear scan.

## Finding the first position

<Diagram label="Where 8 starts and ends" :width="640" :height="120" alt="A sorted array 2, 5, 8, 8, 8, 12, 16. The first 8 is at index 2, which is what bisect_left returns. The position after the last 8 is index 5, which is what bisect_right returns.">
 <DCells :x="152" :y="50" :values="[2, 5, 8, 8, 8, 12, 16]" :states="{ 2: 'hit', 3: 'hit', 4: 'hit' }" :marks="{ 2: 'bisect_left', 5: 'bisect_right' }" indices />
</Diagram>

With repeated values, plain binary search returns whichever copy it lands on. A small change finds the first position whose item is not less than the target. That position is also where the target would have to be inserted to keep the array sorted, so the function is useful even when the target is missing.

```python
def lower_bound(items, target):
    lo, hi = 0, len(items)
    while lo < hi:
        mid = (lo + hi) // 2
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

numbers = [2, 5, 8, 8, 8, 12, 16]
print(lower_bound(numbers, 8))
print(lower_bound(numbers, 9))
print(lower_bound(numbers, 99))
```

Here `hi` starts at `len(items)`, one past the last index, and the range `lo` to `hi` leaves `hi` out. A match does not stop the loop. The search keeps narrowing until `lo` and `hi` meet on the answer.

## In Python: the bisect module

The standard library has this built in.

```python
import bisect

numbers = [2, 5, 8, 8, 8, 12, 16]
left = bisect.bisect_left(numbers, 8)
right = bisect.bisect_right(numbers, 8)
print(left, right, right - left)

bisect.insort(numbers, 9)
print(numbers)
```

- `bisect_left` is `lower_bound`: the first position where the value could go.
- `bisect_right` gives the first position whose value is greater than the target, or the length of the list if there is no greater value.
- The difference between them is how many times the value appears.
- `insort` inserts a value in its sorted place. Finding the place is `O(log n)`, but making room for it shifts items, so the whole call is `O(n)`.

## When to use it

Binary search pays off when the data is sorted once and searched many times. It also answers questions a [hash table](/hash-tables/hash-table) cannot: the nearest value, the first item at least `x`, how many items fall in a range.

For membership alone, a `set` gives expected constant-time lookups for hashable values under the usual hashing assumptions. If you need ordered searches and frequent updates, a balanced search tree such as an [AVL tree](/trees/avl-tree) gives logarithmic search, insertion, and deletion.

## Costs at a glance

| Operation on a sorted array | Cost |
| --- | --- |
| Search by value | `O(log n)` |
| First or last position of a value | `O(log n)` |
| Smallest or largest item | `O(1)` |
| Insert or delete, keeping the order | `O(n)` |
| Sort an unsorted array first | `O(n log n)` |

## Key points

- Binary search needs a sorted array and halves the search range at every step.
- It costs `O(log n)`: about 20 steps for a million items.
- Use `lo <= hi` and always move past `mid`.
- `bisect_left` and `bisect_right` find positions even when the value is repeated or missing.
- A sorted array is fast to search and slow to insert into.

## Exercise

Write `count_in_range`, which returns how many items of a sorted list lie between `low` and `high`, both included. Return 0 when `low > high`. Use the `bisect` module so that it does not look at every item.

```python
import bisect

def count_in_range(items, low, high):
    pass

numbers = [2, 5, 8, 8, 8, 12, 16, 23]
print(count_in_range(numbers, 5, 12))
print(count_in_range(numbers, 9, 11))
print(count_in_range(numbers, 0, 100))
print(count_in_range(numbers, 12, 5))
```

::: details Solution
`bisect_left` gives the position of the first item that is at least `low`. `bisect_right` gives the position after the last item that is at most `high`. Everything between those positions is in the range.

```python
import bisect

def count_in_range(items, low, high):
    if low > high:
        return 0
    return bisect.bisect_right(items, high) - bisect.bisect_left(items, low)

numbers = [2, 5, 8, 8, 8, 12, 16, 23]
print(count_in_range(numbers, 5, 12))
print(count_in_range(numbers, 9, 11))
print(count_in_range(numbers, 0, 100))
print(count_in_range(numbers, 12, 5))
```

**Time** `O(log n)` for a nonempty interval, regardless of how many items it contains. A reversed interval returns immediately.
:::
