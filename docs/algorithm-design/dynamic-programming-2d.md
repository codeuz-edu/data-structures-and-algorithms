---
title: Dynamic Programming on Grids and Pairs
description: "Two-dimensional dynamic programming in Python: grid paths, longest common subsequence, 0/1 knapsack and edit distance, with the tables drawn and the answer rebuilt from the table."
---

# Dynamic Programming on Grids and Pairs

Some subproblems need two indices. A cell in a grid needs a row and column, and comparing two strings needs a position in each string. A two-dimensional table records these answers so that later cells can reuse them.

**You need:** [Dynamic Programming](/algorithm-design/dynamic-programming) and [References and Memory](/foundations/references).

## The idea

A two-dimensional subproblem is an entry `table[i][j]`. Its recurrence reads a few entries that are smaller in one index or in both, most often the entry above, the entry to the left and the entry diagonally above-left. Fill the grid row by row, left to right, and all of them are ready when they are needed.

<Diagram label="Filling a two-dimensional table" :width="640" :height="184" alt="Left: four cells of a table. The cell table[i][j] is computed from the cell above it, the cell to its left and the cell diagonally above-left, as three arrows show. Right: a small grid filled row by row. The first two rows and the start of the third are filled, the next cell is being computed, and the rest is still empty.">
<text class="dg-note" x="188" y="40">each cell reads cells that are already filled</text>
<DCells :x="64" :y="56" :w="124" :h="52" small :values="['table[i-1][j-1]', 'table[i-1][j]']" :states="['done', 'done']" />
<DCells :x="64" :y="108" :w="124" :h="52" small :values="['table[i][j-1]', 'table[i][j]']" :states="['done', 'new']" />
<DArrow :from="[250, 93]" :to="[250, 124]" kind="accent" />
<DArrow :from="[168, 134]" :to="[215, 134]" kind="accent" />
<DArrow :from="[172, 92]" :to="[208, 120]" kind="accent" />
<text class="dg-note" x="494" y="40">fill order</text>
<DCells v-for="r in [0, 1, 2, 3]" :key="r" :x="416" :y="60 + 22 * r" :w="26" :h="22" :values="Array(6).fill(null)" :states="r < 2 ? Array(6).fill('done') : r === 2 ? ['done', 'done', 'done', 'new', 'ghost', 'ghost'] : Array(6).fill('ghost')" />
<text class="dg-note" x="494" y="168">row by row, left to right</text>
</Diagram>

Build the table with a list comprehension, so that every row is its own list:

```py
table = [[0] * cols for _ in range(rows)]
```

The shortcut `[[0] * cols] * rows` stores a reference to the same row in every position, as [References and Memory](/foundations/references) shows. An assignment to one cell is visible through every row.

The five steps of the recipe stay the same: subproblem, recurrence, order, base cases, answer. The base cases are now usually a whole first row and a whole first column.

## Grid paths

A robot starts in the top-left cell of a grid with `r` rows and `c` columns. It moves only right or down. How many different paths lead it to the bottom-right cell?

- Subproblem: `paths[i][j]` is the number of paths from the start to the cell in row `i`, column `j`.
- Recurrence: the last move into a cell came from above or from the left, so `paths[i][j] = paths[i - 1][j] + paths[i][j - 1]`.
- Order: row by row, left to right.
- Base cases: every cell in the top row or the left column has exactly one path, straight along the edge.
- Answer: `paths[r - 1][c - 1]`.

<Diagram label="Paths in a grid of 4 rows and 5 columns" cost="O(r · c)" :width="600" :height="270" alt="A table with 4 rows and 5 columns. The top row and the left column hold 1. Inside, each cell is the sum of the cell above and the cell to its left. The rows read 1, 1, 1, 1, 1; 1, 2, 3, 4, 5; 1, 3, 6, 10, 15; and 1, 4, 10, 20, 35. The bottom-right cell, 35, adds the 15 above it and the 20 to its left.">
<DpTable :x="185" :y="70" :w="52" :h="40" :rows="[[1, 1, 1, 1, 1], [1, 2, 3, 4, 5], [1, 3, 6, 10, 15], [1, 4, 10, 20, 35]]" :col-heads="[0, 1, 2, 3, 4]" col-title="column" :row-heads="[0, 1, 2, 3]" row-title="row" :states="{ '3,4': 'new', '2,4': 'done', '3,3': 'done' }" />
<text class="dg-note" x="315" y="254">35 = 15 from above + 20 from the left</text>
</Diagram>

```py
def grid_paths(rows, cols):
    if rows == 0 or cols == 0:
        return 0
    paths = [[1] * cols for _ in range(rows)]
    for i in range(1, rows):
        for j in range(1, cols):
            paths[i][j] = paths[i - 1][j] + paths[i][j - 1]
    return paths[rows - 1][cols - 1]
```

Starting every cell at 1 sets the top row and the left column, and the loops overwrite the rest. Each cell costs `O(1)`, so the grid costs `O(r · c)` time and space.

## Longest common subsequence

A subsequence keeps some of the letters of a string in their order, not necessarily side by side: ACE is a subsequence of ABCDE. The longest common subsequence (LCS) of two strings is the longest string that is a subsequence of both. BREAD and BEARD share BEAD. Comparing two versions of a file line by line is the same problem, with lines in place of letters.

- Subproblem: `table[i][j]` is the length of the LCS of the first `i` letters of `a` and the first `j` letters of `b`.
- Recurrence: look at the last letters of those two prefixes, `a[i - 1]` and `b[j - 1]`. If they match, they can end a common subsequence, so `table[i][j] = table[i - 1][j - 1] + 1`. If they differ, at least one of them is not used: drop either one and keep the better result, `max(table[i - 1][j], table[i][j - 1])`.
- Order: row by row, left to right.
- Base cases: row 0 and column 0 stand for an empty prefix and hold 0.
- Answer: `table[len(a)][len(b)]`.

<Diagram label="LCS of BREAD and BEARD" cost="O(n · m)" :width="640" :height="314" alt="A 6 by 6 table. The rows are labelled with an empty prefix and then the letters B, R, E, A, D; the columns with an empty prefix and then B, E, A, R, D. Row 0 and column 0 hold 0. The highlighted cell for A and R holds 3: the letters differ, so it takes the larger of the cell above, 2, and the cell to its left, 3. The bottom-right cell holds 4, the length of BEAD.">
<DpTable :x="220" :y="70" :rows="[[0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 2, 2], [0, 1, 2, 2, 2, 2], [0, 1, 2, 3, 3, 3], [0, 1, 2, 3, 3, 4]]" :col-heads="['', 'B', 'E', 'A', 'R', 'D']" col-title="b = BEARD" :row-heads="['', 'B', 'R', 'E', 'A', 'D']" row-title="a = BREAD" :states="{ '4,4': 'new', '3,4': 'done', '4,3': 'done' }" />
<text class="dg-note" x="352" y="298">A and R differ, so the cell takes the larger of 2 (above) and 3 (left)</text>
</Diagram>

```py
def lcs_table(a, b):
    table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1] + 1
            else:
                table[i][j] = max(table[i - 1][j], table[i][j - 1])
    return table
```

For strings of lengths `n` and `m` the table has `(n + 1) · (m + 1)` cells, each filled in `O(1)`: `O(n · m)` time and space.

### Rebuilding the subsequence

The last cell says the LCS has 4 letters, but not which ones. To find them, walk back from the last cell and ask, at each cell, which case of the recurrence produced it.

1. If the two letters match, the cell came from the diagonal and the letter is part of the answer. Record it and step up-left.
2. If they differ, the cell copied the larger of the cell above and the cell to the left. Step to that one, or up on a tie.
3. Stop on row 0 or column 0. The letters were found from the end, so reverse them.

<Diagram label="Walking back from the last cell" cost="O(n + m)" :width="640" :height="314" alt="The same LCS table with the walk back marked. It starts at the bottom-right cell, D and D, and passes through the cells for A and R, A and A, E and E, R and B, and B and B, ending at the top-left corner. The four filled cells, where the letters match, give D, A, E and B, which reversed spell BEAD.">
<DpTable :x="220" :y="70" :rows="[[0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 2, 2], [0, 1, 2, 2, 2, 2], [0, 1, 2, 3, 3, 3], [0, 1, 2, 3, 3, 4]]" :col-heads="['', 'B', 'E', 'A', 'R', 'D']" col-title="b = BEARD" :row-heads="['', 'B', 'R', 'E', 'A', 'D']" row-title="a = BREAD" :states="{ '5,5': 'new', '4,4': 'done', '4,3': 'new', '3,2': 'new', '2,1': 'done', '1,1': 'new', '0,0': 'done' }" />
<text class="dg-note" x="352" y="298">filled cells are matches: D, A, E, B from the end, so the LCS is BEAD</text>
</Diagram>

On BREAD and BEARD the walk goes like this. D matches D: take D and step up-left. A and R differ, and the left cell (3) beats the one above (2), so step left. A matches A: take it. E matches E: take it. R and B differ, and the cell above (1) beats the left one (0), so step up. B matches B: take it, and the walk reaches the corner. Reversed, D, A, E, B spell BEAD.

```py
def lcs(a, b):
    table = lcs_table(a, b)
    i, j = len(a), len(b)
    letters = []
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            letters.append(a[i - 1])
            i -= 1
            j -= 1
        elif table[i - 1][j] >= table[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(letters))
```

Every step leaves a row or a column behind, so the walk takes at most `n + m` steps. The same walk recovers the answer from the other tables on this page too: the items packed in a knapsack, or the edits that turn one word into another.

## 0/1 knapsack

A bag holds at most `W` kilograms. Each item has a weight and a value, and each is either packed once or left out, never cut (hence 0/1). Which items give the largest total value? Here is a bag for 6 kg and three items:

| Item | Weight | Value |
| --- | --- | --- |
| A | 2 kg | 5 |
| B | 3 kg | 7 |
| C | 4 kg | 9 |

The best is A and C: 6 kg, value 14. Packing the best value per kilogram first takes A, then B, and then C no longer fits: value 12.

- Subproblem: `best[i][w]` is the largest value from the first `i` items in a bag that holds `w` kilograms.
- Recurrence: item `i` is either left out, which gives `best[i - 1][w]`, or packed if it fits, which gives its value plus `best[i - 1][w - weight]`, the best use of the room that is left. Take the larger.
- Order: one row per item, top to bottom.
- Base cases: row 0, with no items, is all 0.
- Answer: `best[n][W]` for `n` items.

<Diagram label="Knapsack with a 6 kg bag" cost="O(n · W)" :width="640" :height="254" alt="A table with one row for each set of items allowed: none, A, A and B, then A, B and C, and one column for each capacity from 0 to 6. The last row reads 0, 0, 5, 7, 9, 12, 14. Its cell for capacity 6, which is 14, compares 12 from the cell above, leaving C out, with 5 plus C's value 9, packing C into the 2 kg that remain.">
<DpTable :x="182" :y="70" :w="48" :h="36" :rows="[[0, 0, 0, 0, 0, 0, 0], [0, 0, 5, 5, 5, 5, 5], [0, 0, 5, 7, 7, 12, 12], [0, 0, 5, 7, 9, 12, 14]]" :col-heads="[0, 1, 2, 3, 4, 5, 6]" col-title="capacity in kg" :row-heads="['none', 'A', 'A, B', 'A, B, C']" row-title="items" :states="{ '3,6': 'new', '2,6': 'done', '2,2': 'done' }" />
<text class="dg-note" x="350" y="238">C weighs 4: max(12 without C, 5 + 9 with C) = 14</text>
</Diagram>

```py
def knapsack(weights, values, capacity):
    n = len(weights)
    best = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        weight, value = weights[i - 1], values[i - 1]
        for w in range(capacity + 1):
            best[i][w] = best[i - 1][w]
            if weight <= w:
                best[i][w] = max(best[i][w], value + best[i - 1][w - weight])
    return best[n][capacity]
```

Each row reads only the row above it, which is what stops an item from being packed twice. The table has `(n + 1) · (W + 1)` cells, so the cost is `O(n · W)` time and space. That looks polynomial, but `W` is a number, not a count of things: each extra digit in the capacity makes the table ten times wider. A cost that grows with the value of a number rather than with the length of the input is called pseudo-polynomial.

## Edit distance

The edit distance between two words is the fewest single-letter edits that turn one into the other. An edit inserts a letter, deletes a letter or replaces one letter with another. RIVER becomes DRIVE in two edits: insert D at the front and delete the last R. The distance measures how close two words are, which is what a spell checker needs to suggest corrections.

- Subproblem: `table[i][j]` is the edit distance from the first `i` letters of `a` to the first `j` letters of `b`.
- Recurrence: if `a[i - 1]` and `b[j - 1]` are the same letter, nothing needs to change at the end, and `table[i][j] = table[i - 1][j - 1]`. Otherwise the last edit is one of three, and what comes before it is a smaller subproblem. Take the smallest of:
  - delete `a[i - 1]`: `table[i - 1][j] + 1`
  - insert `b[j - 1]`: `table[i][j - 1] + 1`
  - replace `a[i - 1]` with `b[j - 1]`: `table[i - 1][j - 1] + 1`
- Order: row by row, left to right.
- Base cases: `table[i][0] = i`, deleting all `i` letters, and `table[0][j] = j`, inserting all `j` letters.
- Answer: `table[len(a)][len(b)]`.

<Diagram label="Edit distance from RIVER to DRIVE" cost="O(n · m)" :width="640" :height="314" alt="A 6 by 6 table. The rows are labelled with an empty prefix and then R, I, V, E, R; the columns with an empty prefix and then D, R, I, V, E. Row 0 counts up 0 to 5 and so does column 0. The bottom-right cell holds 2. Its letters, R and E, differ, so it is 1 plus the smallest of the cell above, 1, the cell to the left, 3, and the cell diagonally above-left, 2.">
<DpTable :x="220" :y="70" :rows="[[0, 1, 2, 3, 4, 5], [1, 1, 1, 2, 3, 4], [2, 2, 2, 1, 2, 3], [3, 3, 3, 2, 1, 2], [4, 4, 4, 3, 2, 1], [5, 5, 4, 4, 3, 2]]" :col-heads="['', 'D', 'R', 'I', 'V', 'E']" col-title="b = DRIVE" :row-heads="['', 'R', 'I', 'V', 'E', 'R']" row-title="a = RIVER" :states="{ '5,5': 'new', '4,4': 'done', '4,5': 'done', '5,4': 'done' }" />
<text class="dg-note" x="352" y="298">R and E differ: 1 + min(1 delete, 3 insert, 2 replace) = 2</text>
</Diagram>

```py
def edit_distance(a, b):
    table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1):
        table[i][0] = i
    for j in range(len(b) + 1):
        table[0][j] = j
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1]
            else:
                delete = table[i - 1][j]
                insert = table[i][j - 1]
                replace = table[i - 1][j - 1]
                table[i][j] = 1 + min(delete, insert, replace)
    return table[len(a)][len(b)]
```

The diagonal of 1s in the table is the run RIVE that both words share. Like LCS, edit distance costs `O(n · m)` time and space.

## Full implementation

```python
def grid_paths(rows, cols):
    if rows == 0 or cols == 0:
        return 0
    paths = [[1] * cols for _ in range(rows)]
    for i in range(1, rows):
        for j in range(1, cols):
            paths[i][j] = paths[i - 1][j] + paths[i][j - 1]
    return paths[rows - 1][cols - 1]

def lcs_table(a, b):
    table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1] + 1
            else:
                table[i][j] = max(table[i - 1][j], table[i][j - 1])
    return table

def lcs(a, b):
    table = lcs_table(a, b)
    i, j = len(a), len(b)
    letters = []
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            letters.append(a[i - 1])
            i -= 1
            j -= 1
        elif table[i - 1][j] >= table[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(letters))

def knapsack(weights, values, capacity):
    n = len(weights)
    best = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        weight, value = weights[i - 1], values[i - 1]
        for w in range(capacity + 1):
            best[i][w] = best[i - 1][w]
            if weight <= w:
                best[i][w] = max(best[i][w], value + best[i - 1][w - weight])
    return best[n][capacity]

def edit_distance(a, b):
    table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1):
        table[i][0] = i
    for j in range(len(b) + 1):
        table[0][j] = j
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1]
            else:
                delete = table[i - 1][j]
                insert = table[i][j - 1]
                replace = table[i - 1][j - 1]
                table[i][j] = 1 + min(delete, insert, replace)
    return table[len(a)][len(b)]

print(grid_paths(4, 5), grid_paths(1, 1), grid_paths(3, 7))
print(lcs_table('BREAD', 'BEARD')[5][5], lcs('BREAD', 'BEARD'), repr(lcs('ABC', 'XYZ')))
print(knapsack([2, 3, 4], [5, 7, 9], 6), knapsack([5], [10], 4), knapsack([], [], 10))
print(edit_distance('RIVER', 'DRIVE'), edit_distance('', 'ABC'), edit_distance('SAME', 'SAME'))
```

## Analysis

| Problem | Time | Space |
| --- | --- | --- |
| Grid paths | `O(r · c)` | `O(r · c)` |
| Longest common subsequence | `O(n · m)` | `O(n · m)` |
| Rebuilding the subsequence | `O(n + m)` after the table | the table |
| 0/1 knapsack | `O(n · W)` | `O(n · W)` |
| Edit distance | `O(n · m)` | `O(n · m)` |

`r` and `c` are the rows and columns of the grid, `n` and `m` the lengths of the two strings, and for the knapsack `n` is the number of items and `W` the capacity.

Every cell does a constant amount of work, so the time is the number of cells. Each row reads only itself and the row above, so when you need just the final number, two rows are enough and the space drops to `O(c)`, `O(m)` or `O(W)`. Rebuilding the answer needs the whole table, so keep it when you want the walk back.

## In Python

The standard library has no LCS or edit distance function, but three tools come close.

Grid paths have a formula. A path in a grid of `r` rows and `c` columns makes `r - 1` moves down and `c - 1` moves right, in some order, so the count is the number of ways to choose which moves go down. The formula stops working once some cells are blocked; the table does not.

```python
import math

print(math.comb(4 + 5 - 2, 4 - 1))
print(math.comb(10 + 10 - 2, 10 - 1))
```

`functools.cache` memoizes a function of two arguments just as well as one of one argument. The cache keys are the pairs `(i, j)`, one per cell of the table.

```python
from functools import cache

def lcs_length(a, b):
    @cache
    def solve(i, j):
        if i == 0 or j == 0:
            return 0
        if a[i - 1] == b[j - 1]:
            return solve(i - 1, j - 1) + 1
        return max(solve(i - 1, j), solve(i, j - 1))
    return solve(len(a), len(b))

print(lcs_length('BREAD', 'BEARD'))
print(lcs_length('LEAPT', 'PLATE'))
```

This version can go `len(a) + len(b)` calls deep, so for long strings the bottom-up table is the safe choice.

`difflib.SequenceMatcher` compares two sequences to produce readable diffs, and its matching blocks often agree with the LCS. It does not promise to.

```python
from difflib import SequenceMatcher

matcher = SequenceMatcher(None, 'LEAPT', 'PLATE')
for block in matcher.get_matching_blocks():
    print(block)
```

It matches L and E, two letters, while the LCS of LEAPT and PLATE, LAT, has three. Use the table when you need the exact LCS or edit distance.

## When to use

Two-dimensional DP fits when two numbers name a subproblem and every cell depends only on cells filled before it.

- Two sequences compared position by position: LCS, edit distance, and the file comparison and spelling tools built on them.
- Grids where every move goes right or down, so a path never returns to a cell it has visited. If moves can go in any direction, it is a [shortest path](/graphs/shortest-paths) problem instead.
- Choosing items under a budget: the 0/1 knapsack, or subset sum (can some of the numbers add up to exactly a target?).

Watch the size of the table. Two strings of 100,000 letters give 10 billion cells. If you need only the final number, keep two rows; if a knapsack capacity runs into the millions, the table may be too large to fill. If items can be cut into pieces, the problem gets easier: packing the best value per kilogram first is optimal, as the fractional knapsack on the [Greedy](/algorithm-design/greedy) page shows.

## Key points

- When two numbers name a subproblem, the table is a grid. Fill it row by row so that every cell's inputs are ready.
- A cell reads a few earlier cells: above, left, diagonal, or further back in the row above. The time is the number of cells.
- To recover the answer itself, walk back from the last cell and repeat each cell's choice.
- The knapsack's `O(n · W)` grows with the value of the capacity, not its length: it is pseudo-polynomial.
- When only the final number matters, two rows of the table are enough.

## Exercise

Each cell of a grid holds a cost. A path starts in the top-left cell, moves only right or down, and ends in the bottom-right cell. Its cost is the sum of the cells it visits, both ends included. Write `min_path_sum`, which returns the smallest cost of any path. The grid has at least one cell.

```python
def min_path_sum(grid):
    pass

print(min_path_sum([[3, 1, 4], [1, 5, 9], [2, 6, 5]]))
print(min_path_sum([[7]]))
print(min_path_sum([[1, 2, 3]]))
```

::: details Solution
Use the same predecessor cells as in grid path counting. Take the cheaper predecessor and add the current cell’s cost. `best[i][j]` is the cheapest cost of reaching the cell in row `i`, column `j`: its own cost plus the cheaper of the cell above and the cell to the left. Cells in the top row or the left column can be reached only one way, along the edge.

```python
def min_path_sum(grid):
    rows, cols = len(grid), len(grid[0])
    best = [[0] * cols for _ in range(rows)]
    for i in range(rows):
        for j in range(cols):
            if i == 0 and j == 0:
                best[i][j] = grid[0][0]
            elif i == 0:
                best[i][j] = best[i][j - 1] + grid[i][j]
            elif j == 0:
                best[i][j] = best[i - 1][j] + grid[i][j]
            else:
                best[i][j] = min(best[i - 1][j], best[i][j - 1]) + grid[i][j]
    return best[rows - 1][cols - 1]

print(min_path_sum([[3, 1, 4], [1, 5, 9], [2, 6, 5]]))
print(min_path_sum([[7]]))
print(min_path_sum([[1, 2, 3]]))
```

**Time** `O(r · c)` for `r` rows and `c` columns. **Space** `O(r · c)`, or `O(c)` if you keep one row.
:::
