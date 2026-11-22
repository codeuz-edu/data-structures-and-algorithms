---
title: Simple Sorts
description: "Selection sort, insertion sort and bubble sort in Python, traced pass by pass: what stable, in place and adaptive mean, why all three are O(n²), and why insertion sort is fast on nearly sorted input."
---

# Simple Sorts

Sorting puts values in order. Selection, insertion, and bubble sort all use a small amount of extra space and take quadratic time in the worst case. Insertion sort is especially useful for seeing how the initial order affects the amount of work.

**You need:** [Measuring Cost](/foundations/measuring-cost), [Array](/arrays/array).

## The problem

Input: a list of `n` items that can be compared with `<`, such as numbers or strings. Output: the same items in ascending order. The functions on this page rearrange the list they are given and return nothing, like `list.sort()`.

All three sorting pages trace the same input, so you can compare the algorithms step by step:

```py
[35, 80, 15, 67, 80, 89, 29, 24]
```

The value 80 appears twice. To tell the two copies apart, the diagrams call the first one 80a and the second one 80b.

## Words for describing a sort

| Term | Meaning |
| --- | --- |
| Comparison sort | Learns about the order only by comparing two items at a time. Every sort on these pages is one. |
| In place | Rearranges the items inside the list itself instead of building a new list. The sorts on this page need only a few extra variables: `O(1)` extra space. |
| Stable | Items that compare equal keep the order they had. Sort players by score, and two players with the same score stay in the order they were listed. |
| Adaptive | Does less work when the input is already partly sorted. |

Stability matters when equal items can be told apart, which is the normal case with real data: you sort records by one field, and their other fields differ. On our input it decides whether 80a finishes before 80b.

## Selection sort

Selection sort builds the sorted list from the front. Find the smallest item and swap it into the first place. Then find the smallest of the rest and swap it into the second place, and so on. When one item is left, it is the largest, and it is already in the last place.

<SortTrace mode="selection" />

1. For each position `i` from the first to the second to last:
2. Scan from `i` to the end and remember where the smallest item is.
3. Swap that item into position `i`. Positions 0 to `i` now hold the smallest items, in order.

```py
def selection_sort(items):
    n = len(items)
    for i in range(n - 1):
        smallest = i
        for j in range(i + 1, n):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
```

The scan in pass 1 makes 7 comparisons, pass 2 makes 6, and so on down to 1. For `n` items that is `(n - 1) + (n - 2) + ... + 1 = n(n - 1) / 2` comparisons, which is `O(n²)`. The count is the same for every input: a sorted list costs exactly as much as a shuffled one, so selection sort is not adaptive.

It is not stable either. In pass 2 the swap sends 80a from the second place to the last one, past 80b, and the two finish in the opposite order. Its one strength is that it makes at most `n - 1` swaps.

## Insertion sort

Insertion sort is how most people sort a hand of cards. The front of the list is a sorted part, which at the start is just the first item. Each pass takes the next item and moves it left into its place in the sorted part, shifting the larger items one step right to make room.

<SortTrace mode="insertion" />

1. For each position `i` from the second item to the last, save `items[i]` as `value`.
2. Walk left from `i`. While the item to the left is larger than `value`, shift that item one place right.
3. Write `value` into the gap.

```py
def insertion_sort(items):
    for i in range(1, len(items)):
        value = items[i]
        j = i
        while j > 0 and items[j - 1] > value:
            items[j] = items[j - 1]
            j -= 1
        items[j] = value
```

The walk stops at the first item that is not larger than `value`. In pass 4 that is 80a: 80b is equal to it, not larger, so 80b stays behind it. Equal items never pass each other, so insertion sort is stable. Writing `>=` instead of `>` in the loop would break that.

### Fast on nearly sorted input

A pair of items in the wrong order, a larger one before a smaller one, is called an **inversion**. When `value` moves left past a larger item, that one pair is put right and no other pair changes. So insertion sort makes exactly one shift per inversion. Our input has 14 inversions, and the trace makes 14 shifts.

A sorted list has no inversions. Each pass makes one comparison and stops, `n - 1` comparisons in all, which is `O(n)`. A nearly sorted list has few inversions, so insertion sort finishes in close to linear time: it is adaptive. The worst case is a list in reverse order, where every pair is an inversion: `n(n - 1) / 2` shifts, `O(n²)`. A shuffled list has about half that many, so the average case is `O(n²)` as well.

## Bubble sort, for contrast

Bubble sort compares neighbours and swaps any pair that is in the wrong order. One pass from left to right carries the largest item to the end, and each later pass stops one place earlier. If a pass makes no swap, the list is sorted and it can stop.

```py
def bubble_sort(items):
    n = len(items)
    for end in range(n - 1, 0, -1):
        swapped = False
        for j in range(end):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            return
```

It is stable and in place, and the early stop makes it `O(n)` on sorted input. Each swap of neighbours removes one inversion, so it makes as many swaps as insertion sort makes shifts. But each swap writes two items where a shift writes one, and bubble sort keeps scanning to the end of every pass, so it usually makes more comparisons. It does the same job as insertion sort, usually with more work, and it is mostly met as a teaching example.

## Full implementation

The demo sorts our input with all three functions. Then it wraps each number in a small object that counts how often it is compared, and sorts four lists of 100 numbers: sorted, nearly sorted (every tenth pair swapped), shuffled and reversed.

```python
import random

def selection_sort(items):  # O(n²) on every input
    n = len(items)
    for i in range(n - 1):
        smallest = i
        for j in range(i + 1, n):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]

def insertion_sort(items):  # O(n²), O(n) on sorted input
    for i in range(1, len(items)):
        value = items[i]
        j = i
        while j > 0 and items[j - 1] > value:
            items[j] = items[j - 1]
            j -= 1
        items[j] = value

def bubble_sort(items):  # O(n²), O(n) on sorted input
    n = len(items)
    for end in range(n - 1, 0, -1):
        swapped = False
        for j in range(end):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            return

class Counted:
    comparisons = 0

    def __init__(self, value):
        self.value = value

    def __lt__(self, other):
        Counted.comparisons += 1
        return self.value < other.value

    def __gt__(self, other):
        Counted.comparisons += 1
        return self.value > other.value

def count_comparisons(sort, values):
    items = [Counted(value) for value in values]
    Counted.comparisons = 0
    sort(items)
    return Counted.comparisons

sorts = [selection_sort, insertion_sort, bubble_sort]
for sort in sorts:
    items = [35, 80, 15, 67, 80, 89, 29, 24]
    sort(items)
    print(f'{sort.__name__:15} {items}')

n = 100
nearly = list(range(n))
for i in range(0, n, 10):
    nearly[i], nearly[i + 1] = nearly[i + 1], nearly[i]
random.seed(1)
shuffled = random.sample(range(n), n)
inputs = [list(range(n)), nearly, shuffled, list(range(n, 0, -1))]
print('\ncomparisons: sorted, nearly sorted, shuffled, reversed')
for sort in sorts:
    print(f'{sort.__name__:15}', [count_comparisons(sort, values) for values in inputs])
```

## Analysis

| Algorithm | Best | Average | Worst | Extra space | Stable | In place |
| --- | --- | --- | --- | --- | --- | --- |
| Selection sort | `O(n²)` | `O(n²)` | `O(n²)` | `O(1)` | No | Yes |
| Insertion sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | Yes | Yes |
| Bubble sort | `O(n)` | `O(n²)` | `O(n²)` | `O(1)` | Yes | Yes |

The best case is a list that is already sorted. The counts printed by the demo show each column of the table at work.

- Selection sort makes 4,950 comparisons, which is `100 × 99 / 2`, on all four lists.
- Insertion sort makes 99 on the sorted list and 108 on the nearly sorted one. On the shuffled list it makes about half of the 4,950 it needs for the reversed list.
- Bubble sort matches insertion sort on the sorted list, but on the shuffled list it is close to its worst case.

`O(n²)` means that doubling the list makes the work about four times larger. In the worst case, sorting 1,000 items takes about 500,000 comparisons, and a million items would take 500 billion. [Merge sort](/sorting/merge-sort) and [quicksort](/sorting/quicksort) bring this down to `O(n log n)`, quicksort on average.

## In Python

In real Python code you call `sorted(items)` or `items.sort()`, which are fast and stable. The [Merge Sort page](/sorting/merge-sort#in-python) covers how to use them. Insertion sort still appears in the standard library in two places.

`bisect.insort` inserts one value into a list that is already sorted. It finds the place with [binary search](/arrays/binary-search), then shifts the larger items one place right to make room. Building a list one `insort` at a time is insertion sort: it makes fewer comparisons, but the shifting still costs `O(n)` per item.

```python
import bisect

scores = []
for score in [35, 80, 15, 67, 80, 89, 29, 24]:
    bisect.insort(scores, score)
    print(scores)
```

Python's own sort uses insertion sort for short stretches of the list, a few dozen items at most, finding each place by binary search. On so few items the simple method is quick, and merging then combines the sorted stretches.

## When to use

Use insertion sort for small lists of up to a few dozen items, for lists that are nearly sorted, and for adding a few new items to a list that is already sorted. Faster sorts often switch to it for their small pieces.

Selection sort makes at most `n - 1` swaps, which helps only when moving an item costs far more than comparing two. Bubble sort has no case where it is the best choice.

For anything else, and for everyday Python code, use `sorted` or `list.sort`. They take `O(n log n)`, and they are fast on data that is already partly in order.

## Key points

- A stable sort keeps equal items in their original order. An in-place sort rearranges the list itself instead of building a new one.
- Selection sort makes `n(n - 1) / 2` comparisons on every input and at most `n - 1` swaps. It is not stable.
- Insertion sort makes one shift per inversion: `O(n)` on sorted input, `O(n²)` on shuffled or reversed input. It is stable.
- Bubble sort makes the same number of swaps as insertion sort makes shifts, with more comparisons.
- All three are in place and `O(n²)` in the worst case, so they suit only small or nearly sorted lists.

## Exercise

Write `sort_by_age`, which sorts a list of `(name, age)` pairs by age, youngest first, in place. Use insertion sort, and keep people of the same age in their original order.

```python
def sort_by_age(people):
    pass

people = [('Ana', 31), ('Ben', 25), ('Cleo', 31), ('Dev', 19), ('Eli', 25)]
sort_by_age(people)
print(people)

nobody = []
sort_by_age(nobody)
print(nobody)
```

::: details Solution
This is the insertion sort from the page, comparing ages instead of whole items. The walk left stops at the first person who is not older, so a person never passes someone of the same age, and Ben stays before Eli and Ana before Cleo.

```python
def sort_by_age(people):
    for i in range(1, len(people)):
        person = people[i]
        j = i
        while j > 0 and people[j - 1][1] > person[1]:
            people[j] = people[j - 1]
            j -= 1
        people[j] = person

people = [('Ana', 31), ('Ben', 25), ('Cleo', 31), ('Dev', 19), ('Eli', 25)]
sort_by_age(people)
print(people)

nobody = []
sort_by_age(nobody)
print(nobody)
```

**Time** `O(n²)` in the worst case, `O(n)` if the list is already sorted by age. **Space** `O(1)`.
:::
