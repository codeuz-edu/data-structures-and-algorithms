---
title: Backtracking
description: "Backtracking in Python: choose, explore and undo, the state-space tree, subsets, permutations, N-queens, pruning, and the itertools shortcuts."
---

# Backtracking

Backtracking builds a candidate answer one choice at a time. When a partial answer cannot satisfy the rules, or when all its continuations have been explored, the search undoes the last choice and tries another.

**You need:** [Measuring Cost](/foundations/measuring-cost), [Stack](/stacks-queues/stack) and [Recursion](/recursion/recursion).

## The idea

Every backtracking algorithm has the same shape: choose, explore, undo.

```py
def explore(chosen):
    if is_complete(chosen):
        answers.append(list(chosen))
        return
    for option in options(chosen):
        chosen.append(option)  # choose
        explore(chosen)        # explore
        chosen.pop()           # undo
```

`chosen` holds the choices made so far, and it works as a [stack](/stacks-queues/stack). A choice is pushed on the way down and popped on the way back, so when a call returns, `chosen` is exactly as it was before the call. That pop is the "back" in backtracking. Leave it out and the choices of one branch leak into the next.

All the possible runs of choices form a tree, called the **state-space tree**. The root is the empty list, each edge is one choice, and each box shows `chosen` at that moment. Here it is for the subsets of `[1, 2, 3]`:

<BacktrackTree mode="subsets" />

The search walks this tree depth first, from left to right, in the same order as a [preorder traversal](/trees/binary-tree#depth-first-traversals). The highlighted path is one moment of the search: 1 taken, 2 skipped, 3 taken, so `chosen` is `[1, 3]`. The tree is never built in memory. At any moment only one path exists, the one in `chosen`, and the [call stack](/recursion/recursion) holds one frame for each level of it.

## Subsets

List every subset of `n` distinct items.

Each item is either in the subset or not. At level `i` the search decides item `i`: first it takes the item and explores, then it undoes that and explores again without it. When every item has been decided, `chosen` is one subset.

```python
def subsets(items):
    result = []
    chosen = []
    def explore(i):
        if i == len(items):
            result.append(list(chosen))
            return
        chosen.append(items[i])
        explore(i + 1)
        chosen.pop()
        explore(i + 1)
    explore(0)
    return result

print(subsets([1, 2, 3]))
print(subsets([]))
```

`list(chosen)` stores a copy. Storing `chosen` itself would store the same list eight times, and that list is empty once the search ends, so the result would be eight empty lists.

To watch the search, print `chosen` at the start of every call, indented by its depth:

```python
def show_search(items):
    chosen = []
    def explore(i):
        print('    ' * i + str(chosen))
        if i == len(items):
            return
        chosen.append(items[i])
        explore(i + 1)
        chosen.pop()
        explore(i + 1)
    explore(0)

show_search([1, 2, 3])
```

The output is the tree above turned on its side: 15 lines, one per box, in the order the search reaches them. The 8 most indented lines are the subsets.

## Permutations

List every ordering of `n` distinct items.

Each level of the tree appends one of the items not used yet: 3 options at the first level, 2 at the second and 1 at the third.

<BacktrackTree mode="permutations" />

To know which items are taken, the search keeps a list of flags, `used`, beside `chosen`. Both change on the way down and both are put back on the way up.

```python
def permutations(items):
    result = []
    chosen = []
    used = [False] * len(items)
    def explore():
        if len(chosen) == len(items):
            result.append(list(chosen))
            return
        for i in range(len(items)):
            if not used[i]:
                used[i] = True
                chosen.append(items[i])
                explore()
                chosen.pop()
                used[i] = False
    explore()
    return result

print(permutations([1, 2, 3]))
print(permutations([]))
```

Three items have `3 × 2 × 1 = 6` orderings, and `n` items have `n!`.

## N-queens

Place `n` queens on an `n × n` chessboard so that no two attack each other: no two may share a row, a column or a diagonal.

Every row must hold exactly one queen, so the search places them row by row, and the choice at each level is the column for the next row. Before it places a queen, it checks the queens already on the board. If the square is attacked, that branch is never explored.

<Diagram label="Four queens" :width="640" :height="236" alt="Two 4 by 4 boards with rows and columns numbered 0 to 3. On the left, queens stand in row 0, column 0 and in row 1, column 2. Every square of row 2 is attacked, so all four are crossed out, the branch is cut, and row 3 is never tried. On the right is a solution, with queens in row 0 column 1, row 1 column 3, row 2 column 0 and row 3 column 2. No two share a row, a column or a diagonal.">
 <text class="dg-label" x="170" y="28">dead end</text>
 <text class="dg-label is-accent" x="490" y="28">a solution</text>
 <text class="dg-index" x="74" y="64">0</text>
 <text class="dg-index" x="74" y="104">1</text>
 <text class="dg-index" x="74" y="144">2</text>
 <text class="dg-index" x="74" y="184">3</text>
 <DCells :x="90" :y="44" :w="40" :h="40" :values="['Q', null, null, null]" :states="{ 0: 'hit' }" />
 <DCells :x="90" :y="84" :w="40" :h="40" :values="[null, null, 'Q', null]" :states="{ 2: 'hit' }" />
 <DCells :x="90" :y="124" :w="40" :h="40" :values="['×', '×', '×', '×']" :states="['ghost', 'ghost', 'ghost', 'ghost']" />
 <DCells :x="90" :y="164" :w="40" :h="40" :values="[null, null, null, null]" :states="['muted', 'muted', 'muted', 'muted']" indices />
 <text class="dg-note is-accent start" x="262" y="148">no safe square: cut</text>
 <text class="dg-index" x="394" y="64">0</text>
 <text class="dg-index" x="394" y="104">1</text>
 <text class="dg-index" x="394" y="144">2</text>
 <text class="dg-index" x="394" y="184">3</text>
 <DCells :x="410" :y="44" :w="40" :h="40" :values="[null, 'Q', null, null]" :states="{ 1: 'hit' }" />
 <DCells :x="410" :y="84" :w="40" :h="40" :values="[null, null, null, 'Q']" :states="{ 3: 'hit' }" />
 <DCells :x="410" :y="124" :w="40" :h="40" :values="['Q', null, null, null]" :states="{ 0: 'hit' }" />
 <DCells :x="410" :y="164" :w="40" :h="40" :values="[null, null, 'Q', null]" :states="{ 2: 'hit' }" indices />
</Diagram>

The left board is where pruning cuts a branch. With queens in row 0, column 0 and row 1, column 2, every square in row 2 is attacked: columns 0 and 2 by a queen above in the same column, columns 1 and 3 along the diagonals of the queen in row 1. The search returns at once, without trying anything in row 3, moves the row 1 queen on to column 3, and continues from there. The right board is the first solution it finds.

```python
def solve_queens(n):
    solutions = []
    cols = []
    def safe(col):
        row = len(cols)
        for r, c in enumerate(cols):
            if c == col or abs(c - col) == row - r:
                return False
        return True
    def place():
        if len(cols) == n:
            solutions.append(list(cols))
            return
        for col in range(n):
            if safe(col):
                cols.append(col)
                place()
                cols.pop()
    place()
    return solutions

solutions = solve_queens(4)
print(solutions)
for col in solutions[0]:
    print(' '.join('Q' if c == col else '.' for c in range(4)))
print(len(solve_queens(8)))
```

`cols[r]` is the column of the queen in row `r`. Two queens are on the same diagonal when the distance between their columns equals the distance between their rows. Four queens have 2 solutions and eight queens have 92.

## Pruning

Cutting off a branch as soon as a partial answer breaks a rule is called **pruning**, and it is what makes backtracking usable. Without it, N-queens would have to build every board with one queen per row and test each one at the end. With it, one bad queen in row 1 removes everything below it at once.

| `n` | Boards with one queen per row, `nⁿ` | Queens placed by the pruned search | Solutions |
| --- | --- | --- | --- |
| 4 | 256 | 16 | 2 |
| 6 | 46,656 | 152 | 4 |
| 8 | 16,777,216 | 2,056 | 92 |
| 10 | 10,000,000,000 | 35,538 | 724 |

The same idea works in any backtracking search.

- Check each partial answer, not only complete ones, and return as soon as it cannot lead to a valid answer.
- Check as early as possible. A cut near the root removes far more of the tree than one near the leaves.
- Typical cuts: a queen under attack, a running total that has passed its target when every number is positive, a Sudoku digit that already appears in its row, a closing bracket with nothing to close.

Pruning changes how much of the tree is visited, never which answers are found. It does not stop the growth either: the pruned N-queens search places 2,056 queens for `n = 8` and 856,188 for `n = 12`.

## Full implementation

```python
def subsets(items):  # O(n · 2ⁿ)
    result = []
    chosen = []
    def explore(i):
        if i == len(items):
            result.append(list(chosen))
            return
        chosen.append(items[i])
        explore(i + 1)
        chosen.pop()
        explore(i + 1)
    explore(0)
    return result

def permutations(items):  # O(n · n!)
    result = []
    chosen = []
    used = [False] * len(items)
    def explore():
        if len(chosen) == len(items):
            result.append(list(chosen))
            return
        for i in range(len(items)):
            if not used[i]:
                used[i] = True
                chosen.append(items[i])
                explore()
                chosen.pop()
                used[i] = False
    explore()
    return result

def solve_queens(n):  # at most O(n² · n!), far less in practice
    solutions = []
    cols = []
    def safe(col):
        row = len(cols)
        for r, c in enumerate(cols):
            if c == col or abs(c - col) == row - r:
                return False
        return True
    def place():
        if len(cols) == n:
            solutions.append(list(cols))
            return
        for col in range(n):
            if safe(col):
                cols.append(col)
                place()
                cols.pop()
    place()
    return solutions

print(subsets([1, 2, 3]))
print(permutations([1, 2, 3]))
print(solve_queens(4))
print(len(solve_queens(8)))
```

## Analysis

The cost of a backtracking search is the size of its tree, and for these problems that size is exponential or worse.

| Problem | Answers | Answers for `n = 10` | Time | Extra space |
| --- | --- | --- | --- | --- |
| Subsets of `n` items | `2ⁿ` | 1,024 | `O(n · 2ⁿ)` | `O(n)` |
| Permutations of `n` items | `n!` | 3,628,800 | `O(n · n!)` | `O(n)` |
| `n` queens | no simple formula | 724 | at most `O(n² · n!)` | `O(n)` |

- Subsets: the tree has `2ⁿ` leaves and `2ⁿ⁺¹ - 1` calls in all, 15 for three items. Copying each answer costs `O(n)`, so the total is `O(n · 2ⁿ)`.
- Permutations: the tree has `n!` leaves and fewer than `3 · n!` calls, 16 for three items. Each call loops over all `n` items, so the total is `O(n · n!)`.
- N-queens: the queens sit in different columns, so the tree is part of the permutation tree, and each candidate square is checked against up to `n` queens. That gives the bound, but pruning keeps the real work far below it: 35,538 queens placed for `n = 10`.
- Extra space: `chosen` and the call stack are each at most `n` deep. The list of answers is extra on top of that, and it can be huge.

Put plainly, these searches only work for small `n`. Twenty items have 1,048,576 subsets, which is fine, but about 2.4 × 10¹⁸ orderings. At a billion orderings a second, listing them would take about 77 years.

## In Python

For the plain enumerations, the `itertools` module does the work without any recursion.

```python
from itertools import combinations, permutations, product

items = [1, 2, 3]
print(list(permutations(items)))
print(list(combinations(items, 2)))
print(list(product('HT', repeat=2)))

for pattern in product([True, False], repeat=len(items)):
    print([item for item, take in zip(items, pattern) if take])

print(list(permutations([1, 1, 2])))
```

- `permutations(items)` gives every ordering, and `permutations(items, r)` every ordering of `r` of the items.
- `combinations(items, r)` gives every subset of size `r`, with its items in the order of the input.
- `product(options, repeat=r)` gives every sequence of `r` choices from the same options. With the options `True` and `False`, each sequence says which items to take, so the loop prints all eight subsets, in the same order as the tree above.

All three return iterators that make one tuple at a time; `list` is only there to show them all at once. They work by position, not by value, so `permutations([1, 1, 2])` gives `(1, 1, 2)` twice. And they cannot prune: they produce every candidate, and a filter can only throw the bad ones away afterwards. When a rule can rule out a branch early, as in N-queens, write the backtracking yourself.

## When to use

Use backtracking when you need every answer, or any one answer, to a problem made of choices with rules between them: puzzles such as Sudoku, placing items under constraints, listing the combinations that meet a condition. It always finds the answers, but it is only fast enough when the input is small or pruning cuts away most of the tree.

When a simple rule is known to pick the right option at every step, a [greedy algorithm](/algorithm-design/greedy) is far faster. When the same smaller problem comes up again and again, for example when you only need to count the answers, [dynamic programming](/algorithm-design/dynamic-programming) solves each one once. For plain subsets, orderings and combinations, use `itertools`.

## Key points

- Backtracking builds an answer one choice at a time: choose, explore, undo.
- The choices form a state-space tree. The search walks it depth first and keeps only the current path in memory.
- Every change made on the way down must be undone on the way back, and answers must be stored as copies.
- The cost is exponential or factorial: `2ⁿ` subsets, `n!` orderings.
- Pruning cuts a branch as soon as it breaks a rule. The answers stay the same; only the work shrinks.

## Exercise

Write `brackets(n)`, which returns every string of `n` pairs of correctly matched round brackets, such as `(())()` for `n = 3`. Build the string one bracket at a time and prune: never open more than `n` brackets, and never close one that has nothing to close.

```python
def brackets(n):
    pass

print(brackets(1))
print(brackets(2))
print(brackets(3))
```

::: details Solution
At each step there are at most two choices, `(` and `)`. An opening bracket is allowed while fewer than `n` have been opened. A closing bracket is allowed while there is an open bracket to match. Any string built under those two rules can still be completed, so no branch is wasted.

```python
def brackets(n):
    result = []
    chosen = []
    def explore(opened, closed):
        if len(chosen) == 2 * n:
            result.append(''.join(chosen))
            return
        if opened < n:
            chosen.append('(')
            explore(opened + 1, closed)
            chosen.pop()
        if closed < opened:
            chosen.append(')')
            explore(opened, closed + 1)
            chosen.pop()
    explore(0, 0)
    return result

print(brackets(1))
print(brackets(2))
print(brackets(3))
```

**Time** `O(n · k)` for `k` answers, because every branch the search keeps leads to at least one answer: `k` is 5 for `n = 3` and 16,796 for `n = 10`. **Space** `O(n)` for `chosen` and the call stack, plus the answers.
:::
