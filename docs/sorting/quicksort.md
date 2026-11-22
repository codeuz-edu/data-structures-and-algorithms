---
title: Quicksort
description: "Quicksort in Python: partitioning around a pivot, the O(n²) worst case on sorted input, random pivots, recursion depth, quickselect, and a comparison of the common sorting algorithms."
---

# Quicksort

Quicksort picks a pivot and partitions the list around it. It then sorts each side in place. With random pivots and distinct values, the expected time is `O(n log n)`. Repeatedly splitting off just one value takes `O(n²)` time.

**You need:** [Recursion](/recursion/recursion), [Merge Sort](/sorting/merge-sort).

## The problem

Input: a list of `n` items that can be compared with `<`. Output: the same list, rearranged into ascending order in place.

The input is the one the other sorting pages trace, `[35, 80, 15, 67, 80, 89, 29, 24]`, with its two 80s drawn as 80a and 80b.

## The idea

<Diagram label="One level of quicksort" :width="640" :height="192" alt="The list 35, 80a, 15, 67, 80b, 89, 29, 24 with 35 as the pivot. After the partition, the items smaller than 35, which are 24, 15 and 29, are on its left, and 80b, 89, 80a and 67 are on its right. 35 is already in its final place. Recursive calls sort the two sides, giving 15, 24, 29, then 35, then 67, 80b, 80a, 89.">
 <text class="dg-note end" x="120" y="36">start</text>
 <DCells :x="148" :y="16" :w="44" :h="32" :values="[35, '80a', 15, 67, '80b', 89, 29, 24]" :states="{ 0: 'hit' }" />
 <text class="dg-note end" x="120" y="92">partition</text>
 <DCells :x="132" :y="72" :w="44" :h="32" :values="[24, 15, 29]" :states="['done', 'done', 'done']" />
 <DCells :x="280" :y="72" :w="44" :h="32" :values="[35]" :states="['hit']" />
 <DCells :x="340" :y="72" :w="44" :h="32" :values="['80b', 89, '80a', 67]" />
 <text class="dg-note" x="198" y="124">smaller than 35</text>
 <text class="dg-note" x="428" y="124">35 or larger</text>
 <text class="dg-note end" x="120" y="164">sort sides</text>
 <DCells :x="132" :y="144" :w="44" :h="32" :values="[15, 24, 29]" />
 <DCells :x="280" :y="144" :w="44" :h="32" :values="[35]" :states="['hit']" />
 <DCells :x="340" :y="144" :w="44" :h="32" :values="[67, '80b', '80a', 89]" />
 <text class="dg-note start" x="532" y="164">recursive calls</text>
</Diagram>

1. Pick one item as the pivot. Here it is the first item, 35.
2. Partition: rearrange the list so that the items smaller than the pivot come first, then the pivot, then the items that are larger or equal. The pivot is now in its final place. Three items are smaller than 35, so it belongs at index 3, and that is where it lands.
3. Sort the two sides with recursive calls. A side with zero or one items is the base case.

Merge sort splits without looking at the items and does its work when it merges. Quicksort does its work when it splits and has nothing to do afterwards.

## Partition

<SortTrace mode="partition" />

The partition scans the list once, from left to right. Two indexes do the work. `i` marks the end of the smaller part, the items known to be smaller than the pivot; it starts at the pivot, with the smaller part empty. `j` is the item being looked at.

1. If `items[j]` is smaller than the pivot, grow the smaller part by one place, `i += 1`, and swap `items[j]` into that place.
2. Otherwise leave it. It belongs to the larger part, which is everything after `i` up to `j`.
3. When the scan ends, swap the pivot with the last item of the smaller part. That puts the pivot between the two parts. Return its index.

```py
def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i
```

`lo` and `hi` are the first and last index of the piece being partitioned, so the same function works on any piece of the list. The scan makes one comparison for each item besides the pivot, so a partition costs `O(n)`.

Follow 80a and 80b in the trace. At `j = 6` the swap carries 80a from index 2 to index 6, past 80b. These long swaps take no notice of equal items, so quicksort is not stable. With the first item as the pivot, our input ends up with 80b before 80a.

The sort itself is three lines after the base case: partition, then sort each side.

```py
def quicksort(items, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo >= hi:
        return
    p = partition(items, lo, hi)
    quicksort(items, lo, p - 1)
    quicksort(items, p + 1, hi)
```

## The worst case: sorted input

A pivot helps only if it lands near the middle. On our input 35 split the other 7 items into 3 and 4. On a list that is already sorted, the first item is the smallest. Nothing is smaller than it, so the partition sets aside the pivot alone and hands everything else to one recursive call.

<SortTrace mode="sorted" />

Each call settles one item and passes the other `n - 1` to the next call. The comparisons add up to `(n - 1) + (n - 2) + ... + 1 = n(n - 1) / 2`, which is `O(n²)`, as slow as selection sort. A list in reverse order is just as bad.

A list with many equal items is another bad case for this partition. Items equal to the pivot always go to the right side, so a list of identical items behaves like a sorted one.

The best case is the opposite: every pivot lands in the middle. Then the pieces halve at each level, there are `log n` levels, and each level partitions `n` items in total, so the cost is `O(n log n)`, the same count as merge sort.

## Choosing the pivot

Sorted and nearly sorted input is common in real data, so the first item is a poor pivot. Three better rules:

- The middle item, `items[(lo + hi) // 2]`. It is perfect on sorted input, but other orders can still defeat it.
- The median of three: the middle value of the first, middle and last items.
- A random item.

A random pivot is the usual answer. The order of the input no longer matters: a bad split needs bad luck, and many bad splits in a row are very unlikely. The expected cost is `O(n log n)` however the input is ordered. It does not help with many equal items, which this partition still sends to one side. Whatever the rule, swap the chosen item to the front, then partition as before.

```py
pick = random.randint(lo, hi)
items[lo], items[pick] = items[pick], items[lo]
p = partition(items, lo, hi)
```

## Recursion depth

Each call waits on the [call stack](/recursion/recursion) until both of its recursive calls return, so the depth of the recursion is the stack space quicksort uses. This program measures the depth on 500 sorted items, with the first item as the pivot and with a random one.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def depth(items, lo, hi, random_pivot):
    if lo >= hi:
        return 0
    if random_pivot:
        pick = random.randint(lo, hi)
        items[lo], items[pick] = items[pick], items[lo]
    p = partition(items, lo, hi)
    return 1 + max(depth(items, lo, p - 1, random_pivot), depth(items, p + 1, hi, random_pivot))

random.seed(1)
print('first item:', depth(list(range(500)), 0, 499, False))
print('random item:', depth(list(range(500)), 0, 499, True))
```

With the first item as the pivot the calls go 499 deep, one level per item. Python stops at about 1000 nested calls, so the same code on 2,000 sorted items raises `RecursionError`. With random pivots the depth is about 20.

To make the stack small whatever the pivots do, recurse only into the smaller side and handle the larger side with the loop. Each recursive call then gets at most half of the items, so the depth is at most `log n`. This fixes the stack, not the time: bad pivots still cost `O(n²)`.

```py
def quicksort(items, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    while lo < hi:
        p = partition(items, lo, hi)
        if p - lo < hi - p:
            quicksort(items, lo, p - 1)
            lo = p + 1
        else:
            quicksort(items, p + 1, hi)
            hi = p - 1
```

## Full implementation

```python
import random

def partition(items, lo, hi):  # O(n)
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def quicksort(items, lo=0, hi=None):  # O(n log n) expected, O(n²) worst
    if hi is None:
        hi = len(items) - 1
    if lo >= hi:
        return
    pick = random.randint(lo, hi)
    items[lo], items[pick] = items[pick], items[lo]
    p = partition(items, lo, hi)
    quicksort(items, lo, p - 1)
    quicksort(items, p + 1, hi)

random.seed(7)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
quicksort(numbers)
print(numbers)

empty, one = [], [5]
quicksort(empty)
quicksort(one)
print(empty, one)

big = list(range(2000))
quicksort(big)
print(big == sorted(big))
```

The last lines sort 2,000 items that are already in order, the input that breaks the first-item version.

## Analysis

With distinct values, random pivots give `O(n log n)` expected time. Even splits give the best case for this implementation. The worst case is `O(n²)`: bad luck can produce it on any input, and a list of many equal items produces it every time. It is not stable. It counts as in place: it moves items only within the list, and its extra memory is the recursion stack, `O(log n)` on average and `O(n)` in the worst case.

The table compares it with the other sorts on this site. [Heap sort](/trees/heap#heap-sort) builds a heap inside the list and repeatedly moves the largest item to the end.

| Algorithm | Best | Average | Worst | Extra space | Stable | In place |
| --- | --- | --- | --- | --- | --- | --- |
| [Selection sort](/sorting/simple-sorts) | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` | No | Yes |
| [Insertion sort](/sorting/simple-sorts) | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | Yes | Yes |
| [Bubble sort](/sorting/simple-sorts) | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | Yes | Yes |
| [Merge sort](/sorting/merge-sort) | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | Yes | No |
| Quicksort, random pivot | `O(n log n)` | `O(n log n)` | `O(n²)` | `O(log n)` average, `O(n)` worst | No | Yes |
| [Heap sort](/trees/heap#heap-sort) | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(1)` | No | Yes |

No comparison sort can beat `n log n` comparisons in the worst case. `n` items can be in `n!` orders and each comparison has only two outcomes, so telling all the orders apart takes at least `log(n!)` comparisons, which grows like `n log n`.

## Quickselect

Sometimes you need one item from the sorted order, not the whole order: the smallest, the median, the tenth largest. Sorting first costs `O(n log n)`. With distinct values and random pivots, quickselect finds it in expected `O(n)` time.

After a partition, the pivot sits at its final index `p`. If `p` is the index `k` you want, you are done. If `k` is smaller, the answer is on the left side; otherwise it is on the right. Only one side matters, so a loop replaces the two recursive calls.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def quickselect(items, k):
    if not 0 <= k < len(items):
        raise IndexError('index out of range')
    items = list(items)
    lo, hi = 0, len(items) - 1
    while True:
        pick = random.randint(lo, hi)
        items[lo], items[pick] = items[pick], items[lo]
        p = partition(items, lo, hi)
        if p == k:
            return items[p]
        if k < p:
            hi = p - 1
        else:
            lo = p + 1

random.seed(2)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(quickselect(numbers, 0))
print(quickselect(numbers, 3))
print(quickselect(numbers, 7))
print(numbers)
```

`k` counts from 0, like a list index, so `quickselect(numbers, 3)` returns what `sorted(numbers)[3]` would. The function partitions a copy and leaves `numbers` alone.

Each partition throws away the side that cannot hold the answer. If every pivot halved the range, the work would be `n + n/2 + n/4 + ...`, less than `2n`. Random pivots do not halve it exactly, but on average they shrink it by a steady fraction, so quickselect is `O(n)` on average. With bad luck on every pivot it is `O(n²)`, like quicksort.

## In Python

`sorted` and `list.sort` are not quicksort. They are a merge sort, explained on the [Merge Sort page](/sorting/merge-sort#in-python), and they are stable. The standard library has no quickselect, but it covers the common selection jobs.

- `heapq.nsmallest(k, items)` and `heapq.nlargest(k, items)` return the `k` smallest or largest items in order. They keep a [heap](/trees/heap#heap-sort) of `k` items, so they cost `O(n log k)`.
- `statistics.median(items)` returns the middle value. It sorts a copy, `O(n log n)`.
- `sorted(items)[k]` is the plain way to get the item at index `k` of the sorted order, also `O(n log n)`.

```python
import heapq
import statistics

numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(heapq.nsmallest(3, numbers))
print(heapq.nlargest(2, numbers))
print(sorted(numbers)[3])
print(statistics.median(numbers))
```

With an even number of items there is no single middle one, so `statistics.median` returns the average of the two middle values, 35 and 67.

## When to use

In Python, sort with `sorted` or `list.sort`. Write quicksort when you need to sort an array in place in a setting without a good library sort: it needs no second array, and with a random pivot it is `O(n log n)` on average.

Choose [merge sort](/sorting/merge-sort) instead when equal items must keep their order, or when no input may ever take `O(n²)`. Heap sort also guarantees `O(n log n)` and uses `O(1)` extra space, but it is not stable either.

Partition and quickselect are useful on their own: for the `k` smallest items, for a median, or for splitting a list around a threshold in one pass.

## Key points

- Quicksort partitions the list around a pivot in `O(n)`, which puts the pivot in its final place, then sorts the two sides recursively.
- Pivots near the middle give `O(n log n)`. The first item as the pivot on sorted input gives `O(n²)` and recursion `n` levels deep.
- A random pivot makes the expected cost `O(n log n)` however the input is ordered.
- It sorts in place with a stack of `O(log n)` on average, but it is not stable.
- Quickselect partitions but keeps only the side that holds index `k`: `O(n)` on average.

## Exercise

Write `smallest_k`, which returns the `k` smallest items of a list in ascending order. Assume `0 <= k <= len(items)`. Do not sort the whole list. Use partitions, as quickselect does, until the item at index `k - 1` is in its final place: then the first `k` items are the `k` smallest, in some order, and only they need sorting. Leave the input list unchanged.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def smallest_k(items, k):
    pass

random.seed(1)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(smallest_k(numbers, 3))
print(smallest_k(numbers, 6))
print(smallest_k([5, 1, 4], 3))
print(smallest_k([5, 1, 4], 0))
print(numbers)
```

::: details Solution
The loop is quickselect looking for index `k - 1`. Once that item is in its final place, every item before it is smaller or equal, so `items[:k]` holds the `k` smallest items. Sorting only those `k` items costs `O(k log k)`. If `k` is zero, return an empty list before partitioning.

```python
import random

def partition(items, lo, hi):
    pivot = items[lo]
    i = lo
    for j in range(lo + 1, hi + 1):
        if items[j] < pivot:
            i += 1
            items[i], items[j] = items[j], items[i]
    items[lo], items[i] = items[i], items[lo]
    return i

def smallest_k(items, k):
    if k == 0:
        return []
    items = list(items)
    lo, hi = 0, len(items) - 1
    while lo < hi:
        pick = random.randint(lo, hi)
        items[lo], items[pick] = items[pick], items[lo]
        p = partition(items, lo, hi)
        if p == k - 1:
            break
        if k - 1 < p:
            hi = p - 1
        else:
            lo = p + 1
    return sorted(items[:k])

random.seed(1)
numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(smallest_k(numbers, 3))
print(smallest_k(numbers, 6))
print(smallest_k([5, 1, 4], 3))
print(smallest_k([5, 1, 4], 0))
print(numbers)
```

**Time** `O(n + k log k)` on average, `O(n²)` in the worst case. **Space** `O(n)` for the copy.
:::
