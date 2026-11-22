---
title: Dynamic Programming
description: "Dynamic programming in Python: overlapping subproblems, memoization and tabulation, Fibonacci four ways, climbing stairs, and coin change with fewest coins and number of ways."
---

# Dynamic Programming

Some recursive solutions keep solving the same smaller problem. Dynamic programming stores each answer so that later steps can reuse it. In this lesson a single index identifies each smaller problem.

**You need:** [Recursion](/recursion/recursion) and [Measuring Cost](/foundations/measuring-cost).

## The idea

The [Recursion](/recursion/recursion) page drew the calls made by the naive `fib(5)`: 15 calls, with `fib(2)` worked out three times and `fib(1)` five times. Each step up in `n` multiplies the number of calls by about 1.6, so the cost is exponential. Yet there are only six different subproblems, `fib(0)` to `fib(5)`.

<Diagram label="How often each subproblem is solved for fib(5)" :width="640" :height="140" alt="A table with one column for each subproblem, fib(0) to fib(5). The naive recursion solves fib(0) 3 times, fib(1) 5 times, fib(2) 3 times, fib(3) twice, and fib(4) and fib(5) once each: 15 in all. With a cache each one is solved once: 6 in all.">
<DpTable :x="130" :y="50" :w="64" :h="36" :rows="[[3, 5, 3, 2, 1, 1], [1, 1, 1, 1, 1, 1]]" :col-heads="['fib(0)', 'fib(1)', 'fib(2)', 'fib(3)', 'fib(4)', 'fib(5)']" :row-heads="['naive', 'cached']" :states="{ '0,0': 'done', '0,1': 'done', '0,2': 'done', '0,3': 'done' }" />
<text class="dg-note start" x="526" y="72">15 in all</text>
<text class="dg-note start" x="526" y="108">6 in all</text>
</Diagram>

A problem suits dynamic programming when it has two features. Its subproblems overlap: the same smaller problem comes up many times. And its answer can be built from the answers to its smaller problems (books call this optimal substructure when the answer is a best value).

Solve each subproblem once, store the answer, and every repeat becomes a lookup. There are two ways to arrange that:

- Keep the recursion and add a cache. Before solving a subproblem, look it up; after solving it, store it. This is **memoization**, or working top-down.
- Drop the recursion and fill a table with a loop, starting from the smallest subproblems, so that every entry is ready before anything reads it. This is **tabulation**, or working bottom-up.

## Fibonacci in four versions

The Fibonacci numbers start with `fib(0) = 0` and `fib(1) = 1`, and each later one is the sum of the two before it. The subproblems are `fib(i)` for every `i` from 0 to `n`, and the recurrence is `fib(i) = fib(i - 1) + fib(i - 2)`.

### Naive recursion

```py
def fib_naive(n):
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)
```

This is the recurrence written straight down. It is correct and exponential: `fib_naive(30)` makes 2,692,537 calls to compute 832,040.

### Top-down: memoization

```py
def fib_memo(n):
    memo = {0: 0, 1: 1}
    def solve(i):
        if i not in memo:
            memo[i] = solve(i - 1) + solve(i - 2)
        return memo[i]
    return solve(n)
```

The recursion is the same, plus a [dictionary](/hash-tables/hash-table) `memo` that starts with the two base cases. A value is stored the first time it is computed, and every later request for it is an `O(1)` lookup. Each of the `n + 1` values is computed once, so the cost is `O(n)` time and `O(n)` space. The first call still goes `n` calls deep before it reaches a base case, which matters for large `n` (see [In Python](#in-python)).

### Bottom-up: tabulation

<Diagram label="Bottom-up table for fib(7)" cost="O(n)" :width="600" :height="190" alt="A table of eight cells for fib(0) to fib(7), holding 0, 1, 1, 2, 3, 5, 8 and 13. The first two cells are the base cases. A loop fills the rest from left to right. Two arrows show that the last cell, 13, is computed from the two cells before it, 8 and 5.">
<text class="dg-note" x="144" y="68">base cases</text>
<DCells :x="92" :y="80" :w="52" :values="[0, 1, 1, 2, 3, 5, 8, 13]" :states="{ 5: 'done', 6: 'done', 7: 'new' }" indices />
<text class="dg-note end" x="80" y="104">fib(i)</text>
<text class="dg-note end" x="80" y="137">i</text>
<DArrow :from="[430, 80]" :via="[[430, 62], [474, 62]]" :to="[474, 77]" kind="accent" />
<DArrow :from="[378, 80]" :via="[[378, 38], [492, 38]]" :to="[492, 77]" kind="accent" />
<text class="dg-note is-accent start" x="520" y="104">8 + 5 = 13</text>
<DArrow :from="[196, 156]" :to="[508, 156]" kind="muted" />
<text class="dg-note" x="352" y="178">filled left to right</text>
</Diagram>

```py
def fib_table(n):
    if n < 2:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]
```

The table holds `fib(i)` at index `i`. The base cases go in first, then a loop fills the rest from left to right, so the two cells each entry reads are always filled already. There is no recursion and no cache lookup: `O(n)` time and `O(n)` space.

### Two variables

Each entry reads only the two entries before it, so the rest of the table is never needed again. Keep two variables and slide them along.

```py
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

After `i` rounds, `a` holds `fib(i)` and `b` holds `fib(i + 1)`. The time is still `O(n)`, and the space drops to `O(1)`. This last step is common in DP: once the table works, check which entries each step reads, and keep only those.

## A recipe for new problems

Fibonacci comes with its recurrence. For a new problem, work through five steps in order.

1. Define the subproblem. Say in one sentence what a single table entry means, for example "`fib(i)` is the `i`th Fibonacci number".
2. Write the recurrence: how an entry follows from smaller entries.
3. Fix the order: compute each entry after every entry it reads.
4. Set the base cases: the entries the recurrence cannot produce, filled in by hand.
5. Read off the answer: say which entry, or which combination of entries, answers the question.

The cost follows from the first two steps: the number of entries times the work to compute one.

## Climbing stairs

A staircase has `n` steps. Each move climbs one step or two. How many different sequences of moves reach the top? Three steps can be climbed in three ways: 1 + 1 + 1, 1 + 2 and 2 + 1.

Look at the last move. To stand on step `i`, you came either from step `i - 1` with a one-step move or from step `i - 2` with a two-step move. No route is in both groups, so their counts add.

- Subproblem: `ways[i]` is the number of ways to reach step `i` from the bottom.
- Recurrence: `ways[i] = ways[i - 1] + ways[i - 2]`.
- Order: `i` from 2 up to `n`.
- Base cases: `ways[0] = 1` (standing at the bottom is one way: make no moves) and `ways[1] = 1`.
- Answer: `ways[n]`.

<Diagram label="Ways to reach each step" cost="O(n)" :width="640" :height="300" alt="Six boxes rise like a staircase, one for each step from 0 to 5. They hold the number of ways to reach that step: 1, 1, 2, 3, 5 and 8. Step 5 is reached with one step from step 4 or with two steps from step 3, so its 8 is 5 plus 3.">
<DBox v-for="(count, i) in [1, 1, 2, 3, 5, 8]" :key="i" :x="102 + 76 * i" :y="236 - 36 * i" :w="56" :text="count" :state="['', '', '', 'done', 'done', 'new'][i]" />
<text v-for="i in [0, 1, 2, 3, 4, 5]" :key="`s${i}`" class="dg-note" :x="130 + 76 * i" :y="287 - 36 * i">step {{ i }}</text>
<DArrow :from="[434, 92]" :via="[[434, 74]]" :to="[479, 74]" kind="accent" />
<text class="dg-note is-accent end" x="428" y="86">1 step</text>
<DArrow :from="[358, 128]" :via="[[358, 38], [510, 38]]" :to="[510, 53]" kind="accent" />
<text class="dg-note is-accent start" x="364" y="32">2 steps</text>
</Diagram>

```py
def climb_stairs(n):
    ways = [1] * (n + 1)
    for i in range(2, n + 1):
        ways[i] = ways[i - 1] + ways[i - 2]
    return ways[n]
```

These are the Fibonacci numbers shifted by one place: `climb_stairs(n)` equals `fib(n + 1)`. The two-variable trick brings the space down to `O(1)` here as well.

## Coin change: fewest coins

Given a list of different coin values and an amount, make the amount exactly with as few coins as possible. Each coin value can be used any number of times. With coins 1, 3 and 4 and the amount 6, the [greedy](/algorithm-design/greedy) rule "take the largest coin that fits" picks 4, 1 and 1: three coins. The best answer is 3 + 3, two coins. Taking the 4 first looks best and rules out the answer. DP does not commit to one coin: it tries each coin as the last one and keeps the best result.

- Subproblem: `fewest[a]` is the fewest coins that make the amount `a`.
- Recurrence: the last coin is some coin `c` no larger than `a`, and before it come the fewest coins that make `a - c`. So `fewest[a]` is 1 plus the smallest `fewest[a - c]` over those coins.
- Order: `a` from 1 up to the amount.
- Base case: `fewest[0] = 0`. Every other entry starts at infinity, and an amount no coins can make stays there.
- Answer: `fewest[amount]`, or -1 if it is still infinity.

<Diagram label="Fewest coins with coins 1, 3 and 4" cost="O(n · c)" :width="640" :height="232" alt="A table of the fewest coins for each amount from 0 to 6: 0, 1, 2, 1, 1, 2, 2. Three arrows lead into amount 6 from amounts 5, 3 and 2, one for each coin that could come last. The arrow from amount 3, for coin 3, gives the smallest count, so 6 needs two coins, 3 and 3. The greedy choice 4, 1, 1 needs three.">
<DCells :x="150" :y="110" :w="56" :values="[0, 1, 2, 1, 1, 2, 2]" :states="{ 2: 'done', 3: 'done', 5: 'done', 6: 'new' }" indices />
<text class="dg-note end" x="138" y="134">fewest</text>
<text class="dg-note end" x="138" y="167">amount</text>
<DArrow :from="[458, 110]" :via="[[458, 90], [500, 90]]" :to="[500, 107]" />
<text class="dg-note start" x="464" y="84">coin 1</text>
<DArrow :from="[346, 110]" :via="[[346, 66], [514, 66]]" :to="[514, 107]" kind="accent" />
<text class="dg-note is-accent start" x="352" y="60">coin 3</text>
<DArrow :from="[290, 110]" :via="[[290, 42], [528, 42]]" :to="[528, 107]" />
<text class="dg-note start" x="296" y="36">coin 4</text>
<text class="dg-note" x="346" y="198">fewest[6] = 1 + min(fewest[5], fewest[3], fewest[2]) = 1 + min(2, 1, 2) = 2</text>
<text class="dg-note" x="346" y="218">greedy picks 4 + 1 + 1, three coins; the table finds 3 + 3, two coins</text>
</Diagram>

```py
import math

def fewest_coins(coins, amount):
    fewest = [0] + [math.inf] * amount
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                fewest[a] = min(fewest[a], fewest[a - coin] + 1)
    return fewest[amount] if fewest[amount] != math.inf else -1
```

Each amount tries every coin, so the cost is `O(n · c)` time for an amount `n` and `c` coin values, and `O(n)` space for the table.

## Coin change: number of ways

Now count the different ways to make the amount, where the order of the coins does not matter: 1 + 3 and 3 + 1 are the same way. With coins 1, 3 and 4 there are four ways to make 6: 1 + 1 + 1 + 1 + 1 + 1, 3 + 1 + 1 + 1, 3 + 3 and 4 + 1 + 1.

Counting each combination exactly once is the hard part. The trick is to bring the coins in one at a time.

- Subproblem: `ways[a]` is the number of ways to make `a` with the coins brought in so far.
- Recurrence: once coin `c` is in, a way to make `a` either uses no `c`, and was already counted, or uses at least one `c`. Take one `c` away from the second kind and what is left is a way to make `a - c`. So `ways[a] += ways[a - c]`.
- Order: coins in the outer loop; for each coin `c`, the amount `a` from `c` up.
- Base case: `ways[0] = 1`, for the way that uses no coins. With no coins in, every other amount has 0 ways.
- Answer: `ways[amount]`.

<Diagram label="Ways to make each amount with coins 1, 3 and 4" cost="O(n · c)" :width="680" :height="254" alt="A table with one row for each set of coins: none, then 1, then 1 and 3, then 1, 3 and 4, and one column for each amount from 0 to 6. The last row reads 1, 1, 1, 2, 3, 3, 4. Its cell for amount 6, which is 4, adds the cell above it, 3 ways that use no 4, to the cell for amount 2 in its own row, 1 way that leaves room for a 4.">
<DpTable :x="120" :y="60" :w="56" :rows="[[1, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 2, 2, 2, 3], [1, 1, 1, 2, 3, 3, 4]]" :col-heads="[0, 1, 2, 3, 4, 5, 6]" col-title="amount" :row-heads="['none', '1', '1, 3', '1, 3, 4']" row-title="coins" :states="{ '3,6': 'new', '2,6': 'done', '3,2': 'done' }" />
<DArrow :from="[512, 145]" :via="[[532, 145], [532, 179]]" :to="[515, 179]" kind="accent" />
<text class="dg-note is-accent start" x="540" y="166">3 ways without a 4</text>
<DArrow :from="[260, 196]" :via="[[260, 220], [484, 220]]" :to="[484, 199]" kind="accent" />
<text class="dg-note is-accent" x="372" y="240">1 way with a 4: a 4 plus a way to make 2</text>
</Diagram>

```py
def count_ways(coins, amount):
    ways = [1] + [0] * amount
    for coin in coins:
        for a in range(coin, amount + 1):
            ways[a] += ways[a - coin]
    return ways[amount]
```

One list is enough. The rows in the picture are that list after each coin. When the inner loop reaches `ways[a]`, it still holds the count from the row above, and `ways[a - coin]` already holds the count for this row.

The loop order matters. Swap the two loops and the code counts orderings instead: 1 + 3 and 3 + 1 become two ways, and the count for 6 rises to 9. That version is climbing stairs with moves of 1, 3 and 4 steps. Either way the cost is `O(n · c)` time and `O(n)` space.

## Full implementation

```python
import math

def fib_naive(n):
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

def fib_memo(n):
    memo = {0: 0, 1: 1}
    def solve(i):
        if i not in memo:
            memo[i] = solve(i - 1) + solve(i - 2)
        return memo[i]
    return solve(n)

def fib_table(n):
    if n < 2:
        return n
    table = [0] * (n + 1)
    table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]

def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def climb_stairs(n):
    ways = [1] * (n + 1)
    for i in range(2, n + 1):
        ways[i] = ways[i - 1] + ways[i - 2]
    return ways[n]

def fewest_coins(coins, amount):
    fewest = [0] + [math.inf] * amount
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                fewest[a] = min(fewest[a], fewest[a - coin] + 1)
    return fewest[amount] if fewest[amount] != math.inf else -1

def count_ways(coins, amount):
    ways = [1] + [0] * amount
    for coin in coins:
        for a in range(coin, amount + 1):
            ways[a] += ways[a - coin]
    return ways[amount]

print([fib_naive(n) for n in range(10)])
print(fib_memo(90), fib_table(90), fib(90))
print([climb_stairs(n) for n in range(8)])
print(fewest_coins([1, 3, 4], 6), fewest_coins([5, 10], 3), fewest_coins([2], 0))
print(count_ways([1, 3, 4], 6), count_ways([2, 5], 3), count_ways([1, 2, 5], 5))
```

## Analysis

| Problem | Time | Space |
| --- | --- | --- |
| Fibonacci, naive recursion | `O(2ⁿ)` | `O(n)` for the call stack |
| Fibonacci, memoized | `O(n)` | `O(n)` |
| Fibonacci, table | `O(n)` | `O(n)` |
| Fibonacci, two variables | `O(n)` | `O(1)` |
| Climbing stairs | `O(n)` | `O(n)`, or `O(1)` with two variables |
| Coin change, fewest coins | `O(n · c)` | `O(n)` |
| Coin change, number of ways | `O(n · c)` | `O(n)` |

`n` is the numeric input (the Fibonacci index, the number of steps, or the amount) and `c` is the number of coin values. The bounds count arithmetic operations and stored numbers. Large Python integers can require multiple machine words. For coin change, the bounds are in the value of the amount, which can be much larger than its bit length. `O(2ⁿ)` is a loose bound for the naive Fibonacci: the number of calls grows by a factor of about 1.6 per step, which is still exponential.

Memoization and tabulation solve the same subproblems, so their costs match. The table is usually faster in practice, because one loop step costs less than a function call plus a cache lookup, and it never goes deep on the call stack.

These costs count each addition as one step. Fibonacci numbers get long quickly (`fib(1000)` has 209 digits), and adding two long numbers takes time in proportion to their length, so for very large `n` the real cost grows faster than `O(n)`.

## In Python

`functools.cache` does the memoization for you. It wraps a function and keeps a dictionary from arguments to results.

```python
from functools import cache

@cache
def climb(n):
    if n <= 1:
        return 1
    return climb(n - 1) + climb(n - 2)

print(climb(40))
print(climb.cache_info())
```

There are 41 misses, one for each of `climb(0)` to `climb(40)`, and 38 hits, the repeats the naive version would have computed again.

- `lru_cache` keeps only the most recently used results: 128 of them by default, or as many as `maxsize` says. `cache` is the same as `lru_cache(maxsize=None)`, which keeps everything. DP needs every result: with `maxsize=2`, `climb(25)` computes 8,310 results instead of 26.
- The arguments become dictionary keys, so they must be hashable. Calling a cached function with a list raises `TypeError: unhashable type: 'list'`. Pass a tuple instead.
- `climb.cache_clear()` empties the cache.

A memoized function still recurses. Its first call goes `n` calls deep before it reaches a base case, and Python stops at about 1000 nested calls.

```python
def fib_memo(n):
    memo = {0: 0, 1: 1}
    def solve(i):
        if i not in memo:
            memo[i] = solve(i - 1) + solve(i - 2)
        return memo[i]
    return solve(n)

def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

try:
    fib_memo(5000)
except RecursionError:
    print('fib_memo(5000) raised RecursionError')
print(len(str(fib(5000))), 'digits')
```

A function decorated with `@cache` hits the same limit. For deep inputs, write the bottom-up loop: it has no call stack to run out of.

## When to use

Reach for dynamic programming when a problem asks for a count, a best value (fewest, largest, cheapest) or a yes or no, and the natural recursive solution solves the same smaller problems over and over.

- If the smaller problems never repeat, a cache saves nothing. [Merge sort](/sorting/merge-sort) splits a list into halves that never overlap; that is divide and conquer, not DP.
- If one local choice is always safe, a [greedy](/algorithm-design/greedy) algorithm is simpler and faster. Test it on a small counterexample first, such as coins 1, 3 and 4 with the amount 6.
- If you need every solution, not how many there are or the best one, use [backtracking](/algorithm-design/backtracking).
- If a subproblem needs two numbers to name it, such as a position in each of two strings, the table becomes a grid. See [Dynamic Programming on Grids and Pairs](/algorithm-design/dynamic-programming-2d).

## Key points

- Dynamic programming fits when subproblems overlap: solve each one once and store its answer.
- Memoization adds a cache to the recursion. Tabulation fills a table with a loop from the base cases up, and avoids the recursion limit.
- Build a solution in five steps: subproblem, recurrence, order, base cases, answer.
- The cost is the number of subproblems times the work for each one.
- When each entry reads only the last few, keep just those: Fibonacci needs two variables, not a table.

## Exercise

You may pick numbers from a list, but never two that sit next to each other. Write `best_sum`, which returns the largest total you can pick. The numbers are not negative, and picking nothing gives 0.

```python
def best_sum(values):
    pass

print(best_sum([2, 7, 9, 3, 1]))
print(best_sum([5, 1, 1, 5]))
print(best_sum([4]))
print(best_sum([]))
```

::: details Solution
Let `best[i]` be the largest total from the first `i` numbers. The last of them, `values[i - 1]`, is either skipped, which leaves `best[i - 1]`, or taken, which rules out its neighbour and gives `best[i - 2] + values[i - 1]`. The base cases are `best[0] = 0` and `best[1] = values[0]`. Each entry reads only the two before it, so two variables do the job, as with Fibonacci: `last` is the best total so far and `before` is the best total one number earlier.

```python
def best_sum(values):
    before, last = 0, 0
    for value in values:
        before, last = last, max(last, before + value)
    return last

print(best_sum([2, 7, 9, 3, 1]))
print(best_sum([5, 1, 1, 5]))
print(best_sum([4]))
print(best_sum([]))
```

**Time** `O(n)`. **Space** `O(1)`.
:::
