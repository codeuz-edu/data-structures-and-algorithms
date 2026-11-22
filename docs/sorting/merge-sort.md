---
title: Merge Sort
description: "Merge sort in Python: divide and conquer, merging two sorted lists, why it is stable and O(n log n), and how to sort with sorted, list.sort, key and reverse."
---

# Merge Sort

Merge sort splits a list in half, sorts the two halves, then merges them into one sorted list. The version here takes `O(n log n)` time and preserves the order of equal values. The lesson also shows how Python’s built-in sort takes advantage of order already present in the input.

**You need:** [Recursion](/recursion/recursion), [Simple Sorts](/sorting/simple-sorts).

## The problem

Input: a list of `n` items that can be compared, such as numbers or strings. Output: a new list with the same items in ascending order. The version on this page leaves its input unchanged, like `sorted`.

The input is the one the Simple Sorts page traced, `[35, 80, 15, 67, 80, 89, 29, 24]`, with its two 80s drawn as 80a and 80b.

## The idea

Merge sort is a **divide and conquer** algorithm: it splits a problem into smaller problems of the same kind, solves those, and combines their answers.

<Diagram label="One level of merge sort" :width="640" :height="208" alt="The list 35, 80a, 15, 67, 80b, 89, 29, 24 is split into two halves: 35, 80a, 15, 67 and 80b, 89, 29, 24. Recursive calls sort each half, giving 15, 35, 67, 80a and 24, 29, 80b, 89. Merging the two sorted halves gives 15, 24, 29, 35, 67, 80a, 80b, 89.">
 <text class="dg-note end" x="120" y="36">start</text>
 <DCells :x="144" :y="16" :w="44" :h="32" :values="[35, '80a', 15, 67, '80b', 89, 29, 24]" />
 <text class="dg-note end" x="120" y="84">split</text>
 <DCells :x="132" :y="64" :w="44" :h="32" :values="[35, '80a', 15, 67]" />
 <DCells :x="332" :y="64" :w="44" :h="32" :values="['80b', 89, 29, 24]" />
 <text class="dg-note end" x="120" y="132">sort halves</text>
 <DCells :x="132" :y="112" :w="44" :h="32" :values="[15, 35, 67, '80a']" :states="['done', 'done', 'done', 'done']" />
 <DCells :x="332" :y="112" :w="44" :h="32" :values="[24, 29, '80b', 89]" :states="['done', 'done', 'done', 'done']" />
 <text class="dg-note start" x="524" y="132">recursive calls</text>
 <text class="dg-note end" x="120" y="180">merge</text>
 <DCells :x="144" :y="160" :w="44" :h="32" :values="[15, 24, 29, 35, 67, '80a', '80b', 89]" :states="['new', 'new', 'new', 'new', 'new', 'new', 'new', 'new']" />
</Diagram>

1. Divide: split the list into a left half and a right half.
2. Conquer: sort each half with a recursive call. A list of zero or one items is already sorted. That is the base case.
3. Combine: merge the two sorted halves into one sorted list.

As on the [Recursion](/recursion/recursion) page, trust the recursive calls. Assume they hand back both halves sorted, and work out only how to merge them.

## Merging two sorted lists

Merging is where the work happens. Both lists are sorted, so the smallest item that is left is always at the front of one of them. Compare the two front items, move the smaller one to the result, and repeat.

<Diagram label="Merging, halfway through" :width="600" :height="184" alt="Merging 15, 35, 67, 80a with 24, 29, 80b, 89. 15, 35 and 67 have already been taken from the left list, and 24 and 29 from the right list, so the result holds 15, 24, 29, 35, 67. The fronts of the two lists are now 80a and 80b, which are equal. The rule takes the left one, so 80a goes into the result next.">
 <text class="dg-note end" x="88" y="65">left</text>
 <DCells :x="100" :y="44" :w="44" :h="34" :values="[15, 35, 67, '80a']" :states="['ghost', 'ghost', 'ghost', 'hit']" :marks="{ 3: 'left[i]' }" />
 <text class="dg-note end" x="368" y="65">right</text>
 <DCells :x="380" :y="44" :w="44" :h="34" :values="[24, 29, '80b', 89]" :states="['ghost', 'ghost', 'hit', '']" :marks="{ 2: 'right[j]' }" />
 <DArrow :from="[254, 80]" :via="[[254, 104], [342, 104]]" :to="[342, 130]" kind="accent" />
 <text class="dg-note is-accent start" x="354" y="122">80a ≤ 80b: take the left one</text>
 <text class="dg-note end" x="88" y="153">result</text>
 <DCells :x="100" :y="132" :w="44" :h="34" :values="[15, 24, 29, 35, 67, null, null, null]" :states="['', '', '', '', '', 'ghost', 'ghost', 'ghost']" />
</Diagram>

1. Keep one index into each list, `i` for the left and `j` for the right, both starting at 0.
2. While both lists have items left, compare `left[i]` and `right[j]`. Append the smaller one to the result and move its index on.
3. When one list runs out, append everything left in the other. It is already sorted.

```py
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

Every item is moved to the result exactly once, so merging lists with `n` items in total takes `O(n)` time.

### Why `<=` keeps it stable

The diagram stops at the moment 80a and 80b meet. They are equal, so `left[i] <= right[j]` is true and 80a, from the left list, goes first. Everything in the left list came earlier in the original list, so equal items keep their original order: merge sort is stable. With `<` the test would be false, 80b would jump ahead of 80a, and the sort would no longer be stable.

## The whole run

<SortMergeTree />

The top half of the picture splits the list: 8 items, then pieces of 4, 2 and 1. The bottom half merges the pieces back into one sorted list, and 80a still comes before 80b.

The picture shows the work level by level, but the recursion does not run in that order. The first call sorts the whole left half, all the way down and back up, before it starts on the right half. The numbers give the order of the seven merges.

```py
def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)
```

The base case returns `list(items)`, a copy, so the caller always gets a new list.

## Full implementation

```python
def merge(left, right):  # O(n)
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(items):  # O(n log n)
    if len(items) <= 1:
        return list(items)
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    return merge(left, right)

numbers = [35, 80, 15, 67, 80, 89, 29, 24]
print(merge_sort(numbers))
print(numbers)
print(merge_sort([]), merge_sort([7]))
print(merge_sort(['pear', 'fig', 'apple', 'kiwi']))
```

## Analysis

Each split halves the pieces, so after [`log n`](/foundations/measuring-cost) levels every piece holds one item. Our 8 items take 3 levels: 8, then 4, 2 and 1. Merging goes back up through the same number of levels.

On each level of merging, every item is moved into a result list exactly once, however the items are divided between the merges. A level costs `O(n)`, and `log n` levels cost `O(n log n)`.

The splitting copies the same number of references for every input of the same length. The number of comparisons can still vary. On sorted input each merge stops comparing as soon as the left half runs out, but the remaining items still have to be copied. Best, average and worst case are all `O(n log n)`.

The merge needs a new list for its result, `n` items long at the top level, so merge sort uses `O(n)` extra space and is not in place. The slices `items[:mid]` and `items[mid:]` are copies too, but they shrink by half at each level, so the space stays `O(n)`. The [call stack](/recursion/recursion) is only `log n` calls deep.

| Algorithm | Best | Average | Worst | Extra space | Stable | In place |
| --- | --- | --- | --- | --- | --- | --- |
| Merge sort | `O(n log n)` | `O(n log n)` | `O(n log n)` | `O(n)` | Yes | No |

The difference from `O(n²)` is large. For a million items, `n log n` is about 20 million steps, while `n²/2` is 500 billion.

## In Python

Python has two ways to sort.

- `sorted(iterable)` returns a new list. It accepts any iterable: a list, a tuple, a set, the keys of a `dict`.
- `items.sort()` sorts a list in place and returns `None`. Writing `items = items.sort()` loses the list.

Both take two optional arguments. `key` is a function that turns each item into the value to sort by; it is called once per item. `reverse=True` sorts from largest to smallest.

```python
words = ['pear', 'fig', 'apple', 'kiwi', 'banana']
print(sorted(words))
print(sorted(words, key=len))
print(sorted(words, key=len, reverse=True))

words.sort()
print(words)
```

Python's sort is guaranteed to be stable. Sorted by length, `pear` and `kiwi` both have 4 letters, and they keep their original order, `pear` first. `reverse=True` keeps that order too.

To sort by several keys, return a tuple from `key`. Tuples compare item by item, so the second key only decides between items whose first keys are equal. When the directions differ, stability gives a second way: sort by the less important key first, then by the more important one.

```python
people = [('Cleo', 31), ('Ben', 25), ('Ana', 31), ('Eli', 25), ('Dev', 19)]

print(sorted(people, key=lambda person: (person[1], person[0])))

by_name = sorted(people, key=lambda person: person[0])
print(sorted(by_name, key=lambda person: person[1], reverse=True))
```

The first line sorts by age, then by name within each age. The last line sorts oldest first, and the earlier sort by name survives inside each age because the sort is stable.

CPython’s sort is an adaptive, stable merge sort. It uses ordering already present in the data. Instead of splitting blindly, it scans the list for runs, stretches that are already in ascending order (a descending stretch is reversed into one), and merges the runs. Short runs are first extended with insertion sort. A list that is already sorted is a single run and needs only `n - 1` comparisons. The worst case is still `O(n log n)`. It needs extra memory for merging, up to `n / 2` references.

The demo below counts comparisons by sorting objects that count every `<`. Python's sort compares with `<` only.

```python
import random

class Counted:
    comparisons = 0

    def __init__(self, value):
        self.value = value

    def __lt__(self, other):
        Counted.comparisons += 1
        return self.value < other.value

def count_comparisons(values):
    Counted.comparisons = 0
    sorted(Counted(value) for value in values)
    return Counted.comparisons

random.seed(1)
shuffled = random.sample(range(1000), 1000)
print('sorted  ', count_comparisons(range(1000)))
print('reversed', count_comparisons(range(1000, 0, -1)))
print('shuffled', count_comparisons(shuffled))
```

A sorted or reversed list of 1,000 items takes 999 comparisons, a shuffled one more than 8,500. The `merge_sort` above would make about 5,000 comparisons even on the sorted list, because it splits all the way down whatever the input.

## When to use

Use merge sort when you need a guaranteed `O(n log n)` and a stable result, and `O(n)` extra memory is acceptable.

- It suits [linked lists](/linked-lists/singly-linked-list). Merging two linked lists only relinks nodes, so no second array is needed, and every step walks the lists from front to back, which is what linked lists do well.
- It suits data too large for memory: sort chunks that fit, then merge the sorted chunks, reading each one from front to back.
- When memory is tight and stability does not matter, [quicksort](/sorting/quicksort) or heap sort, from the [Heap](/trees/heap) page, sorts in place.

In everyday Python, do not write your own: `sorted` and `list.sort` are stable. In CPython they take advantage of runs already in order.

## Key points

- Merge sort splits the list in half, sorts both halves recursively and merges the results.
- Merging two sorted lists costs `O(n)`: compare the fronts and take the smaller.
- Taking from the left list on ties, with `<=`, makes merge sort stable.
- `log n` levels of `O(n)` merging give `O(n log n)` on every input, with `O(n)` extra space.
- Python's `sorted` and `list.sort` are a stable merge sort that reuses runs already in order. Use `key` and `reverse` rather than writing your own sort.

## Exercise

An inversion is a pair of items in the wrong order: a larger item before a smaller one. The [Simple Sorts](/sorting/simple-sorts) page showed that insertion sort makes one shift per inversion. Counting them by checking every pair takes `O(n²)`. Write `count_inversions` so that it takes `O(n log n)`, by changing merge sort. Equal items do not count as an inversion.

Hint: when the merge takes an item from the right list, that item is smaller than every item still waiting in the left list.

```python
def count_inversions(items):
    pass

print(count_inversions([35, 80, 15, 67, 80, 89, 29, 24]))
print(count_inversions([15, 24, 29, 35]))
print(count_inversions([4, 3, 2, 1]))
print(count_inversions([]))
```

::: details Solution
`sort_and_count` returns the sorted list together with the number of inversions inside it. The inversions of the whole list are those inside the left half, those inside the right half, and those with one item in each half. The merge finds the last kind: taking `right[j]` while `len(left) - i` items are still waiting in the left list means `right[j]` was behind all of them in the original list and is smaller than each. Taking from the left on ties keeps equal items from being counted.

```python
def sort_and_count(items):
    if len(items) <= 1:
        return list(items), 0
    mid = len(items) // 2
    left, left_count = sort_and_count(items[:mid])
    right, right_count = sort_and_count(items[mid:])
    result = []
    count = left_count + right_count
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            count += len(left) - i
    result.extend(left[i:])
    result.extend(right[j:])
    return result, count

def count_inversions(items):
    return sort_and_count(items)[1]

print(count_inversions([35, 80, 15, 67, 80, 89, 29, 24]))
print(count_inversions([15, 24, 29, 35]))
print(count_inversions([4, 3, 2, 1]))
print(count_inversions([]))
```

**Time** `O(n log n)`, the same as merge sort. **Space** `O(n)`.
:::
