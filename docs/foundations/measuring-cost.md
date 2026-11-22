---
title: Measuring Cost
description: "Big-O notation for beginners: counting steps, growth rates from O(1) to O(n²), best and worst case, space, and how to read the cost of Python code."
---

# Measuring Cost

Two programs can solve the same problem and take very different amounts of work as the input grows. This lesson shows how to express that growth with bounds such as `O(1)` and `O(n)`. It also shows how to count the extra memory a program uses.

## Count steps, not seconds

Elapsed time depends on the machine and workload. To study how the work grows, count basic operations such as comparison, addition, and indexed access. The examples treat each as constant-time. Operations on large integers or long strings may take longer.

The count depends on the size of the input, which is called `n`. For a list, `n` is its length.

```python
def total(items):
    result = 0
    for value in items:
        result += value
    return result

def first(items):
    return items[0]

print(total([4, 8, 15, 16, 23, 42]))
print(first([4, 8, 15, 16, 23, 42]))
```

`total` does one addition per item, so its step count grows with `n`. `first` reads one element for any nonempty list. That difference in growth is what the notation records.

## Big-O notation

Big-O gives an upper bound on growth as `n` becomes large. For example, `O(n)` means the work is bounded by a constant times `n` for all sufficiently large inputs. To find a tight bound for a sum like `n² + n`, keep its fastest-growing term.

- Constants are dropped. `2n` steps and `n + 5` steps are both `O(n)`. Doubling the input doubles the work either way.
- Smaller terms are dropped. `n² + n` is `O(n²)`, because for large `n` the `n` hardly matters next to `n²`.

`total` is `O(n)`, read "order n" or "linear". `first` is `O(1)`, "constant".

Big-O is an upper bound on growth. It does not tell you the running time, and it says little about small inputs. It tells you what happens when the input gets ten or a thousand times larger.

## The common growth rates

<GrowthCurves />

This chart is the picture to remember. Every line starts close to the others, and they pull apart as `n` grows. `O(1)` stays flat. `O(log n)` hardly rises. `O(n)` is a straight line. `O(n²)` and `O(2ⁿ)` leave the top of the chart almost at once. Move over the chart to read the exact step counts for any `n`.

The bars below give the exact step counts for one input size.

<Diagram label="Steps for n = 16" :width="640" :height="176" alt="A bar chart of step counts when n is 16. O(1) takes 1 step, O(log n) takes 4, O(n) takes 16, O(n log n) takes 64 and O(n squared) takes 256.">
 <template v-for="(row, i) in [['O(1)', 1], ['O(log n)', 4], ['O(n)', 16], ['O(n log n)', 64], ['O(n²)', 256]]" :key="i">
  <text class="dg-code end" x="122" :y="33 + 30 * i">{{ row[0] }}</text>
  <rect class="dg-bar" x="134" :y="24 + 30 * i" :width="Math.max(3, row[1] * 1.75)" height="18" />
  <text class="dg-note start" :x="142 + Math.max(3, row[1] * 1.75)" :y="37 + 30 * i">{{ row[1] }}</text>
 </template>
</Diagram>

| Notation | Name | Example on this site | Steps for n = 1,000,000 |
| --- | --- | --- | --- |
| `O(1)` | constant | read `items[i]`, push on a stack | 1 |
| `O(log n)` | logarithmic | binary search, heap push | about 20 |
| `O(n)` | linear | search a linked list, traverse a tree | 1,000,000 |
| `O(n log n)` | linearithmic | merge sort, Python's `sorted` | about 20,000,000 |
| `O(n²)` | quadratic | compare every pair of items | 1,000,000,000,000 |
| `O(2ⁿ)` | exponential | try every subset | more than the atoms in the universe |

The gap between rows grows with `n`. At a million items, `n²` is a trillion, while `n` is a million. The actual time per step depends on the program.

## What log n means

<Diagram label="Halving 16 items" :width="640" :height="190" alt="Sixteen cells. Each step keeps half of what is left: 16, then 8, 4, 2 and 1. It takes four halvings to get from 16 to 1.">
 <template v-for="k in [0, 1, 2, 3, 4]" :key="k">
  <text class="dg-note end" x="108" :y="35 + 32 * k">{{ k === 0 ? 'start' : `step ${k}` }}</text>
  <DCells :x="120" :y="20 + 32 * k" :w="28" :h="22" :values="Array(16).fill(null)" :states="Array.from({ length: 16 }, (_, i) => i < (16 >> k) ? 'hit' : 'ghost')" />
  <text class="dg-note start" x="580" :y="35 + 32 * k">{{ 16 >> k }} left</text>
 </template>
</Diagram>

`log n` is the number of times `n` can be cut in half before one item is left. 16 takes 4 halvings. A million takes about 20, and a billion about 30.

An algorithm that throws away half of the remaining work at every step is `O(log n)`. [Binary search](/arrays/binary-search) is the standard example. Because the count grows so slowly, `O(log n)` is nearly as good as constant.

## Reading the cost from code

Three patterns cover most code.

**One after another: add.** Two loops in a row over the same list do `n + n` steps, which is `O(n)`.

**One inside another: multiply.** A loop inside a loop does `n × n` steps, which is `O(n²)`.

**Halving: log.** A loop that halves what is left does `log n` steps.

```python
def count_steps(n):
    in_a_row = 0
    for i in range(n):
        in_a_row += 1
    for i in range(n):
        in_a_row += 1

    nested = 0
    for i in range(n):
        for j in range(n):
            nested += 1

    halving = 0
    left = n
    while left > 1:
        left //= 2
        halving += 1
    return in_a_row, nested, halving

for n in [16, 32, 64]:
    print(n, count_steps(n))
```

Each time `n` doubles, the first count doubles, the second is multiplied by four, and the third goes up by one. Doubling the input and watching the count is a quick way to check a cost you are unsure about.

## Best, worst and average case

The same code can take a different number of steps on different inputs of the same size. Searching a list for a value is the usual example.

```python
def find(items, target):
    steps = 0
    for i, value in enumerate(items):
        steps += 1
        if value == target:
            return i, steps
    return -1, steps

items = [4, 8, 15, 16, 23, 42]
print(find(items, 4))
print(find(items, 42))
print(find(items, 99))
```

- **Best case.** The target is first: 1 step, `O(1)`.
- **Worst case.** The target is last or missing: `n` steps, `O(n)`.
- **Average case.** If the target is present and its first occurrence is equally likely at any position, `(n + 1) / 2` steps on average, which is still `O(n)`.

Unless a page says otherwise, the cost it gives is the worst case. That is the one you can rely on.

An amortized bound spreads the total cost of a sequence across its operations. It can hold even for the most expensive sequence of that length. The [dynamic array](/arrays/dynamic-array) page explains it.

## Space

Memory is measured the same way. Space cost counts the extra memory an algorithm needs beyond its input.

- Reversing a list in place by swapping uses a couple of variables: `O(1)` space.
- Building a reversed copy uses a second list: `O(n)` space.
- A [recursive](/recursion/recursion) function uses memory for every call that has not finished yet. A recursion `n` calls deep costs `O(n)` space even if it creates no lists.

Time and space often trade against each other. A [hash table](/hash-tables/hash-table) spends extra memory to make lookups fast.

## Costs of Python's built-ins

A single line of Python can hide a loop. These are the costs worth knowing by heart.

| Operation | `list` | `dict` and `set` |
| --- | --- | --- |
| Read or write by index or key | `O(1)` | `O(1)` average |
| `x in ...` | `O(n)` | `O(1)` average |
| Add at the end, or add a key | `O(1)` amortized | `O(1)` average, amortized |
| `insert(0, x)`, `pop(0)` | `O(n)` | |
| `pop()` from the end | `O(1)` amortized | |
| `sorted(...)`, `.sort()` | `O(n log n)` | |
| Copy, `len` | `O(n)`, `O(1)` | `O(n)`, `O(1)` |

The line `if x in items` is a full search when `items` is a list. Put it inside a loop and the code is quadratic without a nested loop in sight.

## Key points

- Cost is counted in steps as a function of the input size `n`.
- Big-O keeps the fastest-growing term and drops constants.
- From best to worst: `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`, `O(2ⁿ)`.
- Loops in a row add, nested loops multiply, halving gives `log n`.
- The stated cost is the worst case unless a page says otherwise.

## Exercise

`has_duplicate` below compares every pair of items, which is `O(n²)`. Assume the items are hashable and their hash and equality checks take constant time. Rewrite it to run in expected `O(n)` time using a `set` to record the values already seen.

```python
def has_duplicate(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

print(has_duplicate([4, 8, 15, 16, 23, 42]))
print(has_duplicate([4, 8, 15, 8, 23, 42]))
print(has_duplicate([]))
```

::: details Solution
Walk the list once and remember every value seen so far. Meeting a value that is already in the set means a duplicate.

```python
def has_duplicate(items):
    seen = set()
    for value in items:
        if value in seen:
            return True
        seen.add(value)
    return False

print(has_duplicate([4, 8, 15, 16, 23, 42]))
print(has_duplicate([4, 8, 15, 8, 23, 42]))
print(has_duplicate([]))
```

**Time** `O(n)` on average, **space** `O(n)` for the set. The faster version pays with memory.
:::
