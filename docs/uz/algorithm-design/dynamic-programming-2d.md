---
title: Jadval va juftliklarda dinamik dasturlaş
description: "Baʼzi kiçik masalani bitta indeks bilan belgilab bölmaydi. Jadvalda qator va ustun, ikkita satrda esa har satrning öz indeksi kerak."
---

# Jadval va juftliklarda dinamik dasturlaş

Baʼzi kiçik masalani bitta indeks bilan belgilab bölmaydi. Jadvalda qator va ustun, ikkita satrda esa har satrning öz indeksi kerak.

Avval [Dinamik dasturlaş](/uz/algorithm-design/dynamic-programming) va [Havolalar va xotira](/uz/foundations/references) darslarini öqing.

## Ikki indeksli holat {#the-idea}

Har `table[i][j]` ikki indeks bilan aniqlanadi. Kerakli kataklar oldin töldirilgan bölsin. Qatorma-qator yurişda yuqoridagi, çapdagi va diagonal kataklar tayyor böladi.

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

```py
table = [[0] * cols for _ in range(rows)]
```

## Jadvaldagi yöllar {#grid-paths}

Robot yuqori çap katakdan faqat öngga yoki pastga yuradi. Birinçi qator va ustundagi katakka bitta yöl bor. İçki katakka keladigan yöllar soni yuqoridagi va çapdagi yöllar sonining yiğindisidir.

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

## Eng uzun umumiy qism ketma-ketligi {#longest-common-subsequence}

Qism ketma-ketligida harflar tartibini saqlab qolamiz, ayrimlarini taşlab ketiş mumkin. Ikki satr prefiksining oxirgi harfi teng bölsa, diagonal javobga bitta qöşing. Aks holda yuqoridagi va çapdagi javobdan kattasini oling.

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

### Ketma-ketlikni tiklaş {#rebuilding-the-subsequence}

Oxirgi katakdan orqaga yuring. Harflar teng bölsa, harfni yozing va diagonalga öting. Aks holda uzunligi kattaroq tomonga öting. Topilgan harflarni teskarilang.

<Diagram label="Walking back from the last cell" cost="O(n + m)" :width="640" :height="314" alt="The same LCS table with the walk back marked. It starts at the bottom-right cell, D and D, and passes through the cells for A and R, A and A, E and E, R and B, and B and B, ending at the top-left corner. The four filled cells, where the letters match, give D, A, E and B, which reversed spell BEAD.">
<DpTable :x="220" :y="70" :rows="[[0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 2, 2], [0, 1, 2, 2, 2, 2], [0, 1, 2, 3, 3, 3], [0, 1, 2, 3, 3, 4]]" :col-heads="['', 'B', 'E', 'A', 'R', 'D']" col-title="b = BEARD" :row-heads="['', 'B', 'R', 'E', 'A', 'D']" row-title="a = BREAD" :states="{ '5,5': 'new', '4,4': 'done', '4,3': 'new', '3,2': 'new', '2,1': 'done', '1,1': 'new', '0,0': 'done' }" />
<text class="dg-note" x="352" y="298">filled cells are matches: D, A, E, B from the end, so the LCS is BEAD</text>
</Diagram>

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

## 0/1 yukxalta masalasi {#_0-1-knapsack}

Har buyumni bir marta oliş yoki qoldiriş mumkin. `table[i][w]` birinçi `i` buyumdan `w` siğimda olinadigan eng katta qiymat. Buyum siğsa, oldingi qatordagi ikki holatni soliştiring. Biri buyumsiz, ikkinçisi uning vazni ayrilib, qiymati qöşilgan holat.

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

## Tahrir masofasi {#edit-distance}

Bitta harfni qöşiş, öçiriş yoki almaştiriş bitta qadam. Boş satrga aylantiriş uçun qolgan harflar soniça qadam kerak. Harflar teng bölsa, diagonal xarajat olinadi. Aks holda uç oldingi holatning eng arzoniga 1 qöşiladi.

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

## Töliq dastur {#full-implementation}

Misollar jadvalda yöllarni sanaydi, ikki satrning umumiy ketma-ketligini tiklaydi, yukxalta qiymatini va tahrir masofasini hisoblaydi.

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

## Tahlil {#analysis}

Bitta katak doimiy sondagi qöşni holatni öqisa, iş kataklar soniga mutanosib. Jadvalda `O(r · c)`, ikki satrda `O(n · m)`, yukxaltada `O(n · W)`. Faqat yakuniy qiymat kerak bölsa, bir yoki ikki qator yetişi mumkin.

## Python tilida {#in-python}

Tösiqsiz jadvalda öng va past qadamlarning joyini tanlaş kifoya. Javobni `math.comb(r + c - 2, r - 1)` bilan hisoblaş mumkin. `difflib` matnlarni soliştiradi, uning natijasi aynan tahrir masofasi emas.

```python
import math

print(math.comb(4 + 5 - 2, 4 - 1))
print(math.comb(10 + 10 - 2, 10 - 1))
```

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

```python
from difflib import SequenceMatcher

matcher = SequenceMatcher(None, 'LEAPT', 'PLATE')
for block in matcher.get_matching_blocks():
    print(block)
```

## Qayerda işlatiladi {#when-to-use}

Ikki satrni, jadvaldagi yöllarni yoki siğim va buyumlar sonini birga hisobga oladigan masalada ikki indeksli jadval qulay.

## Xulosa {#key-points}

Joriy katak oldin tayyor bölgan kataklardan foydalanadi. Xotirani qisqartirişdan oldin javobning özini tiklaş kerakmi, tekşiring.

## Maşq {#exercise}

`min_path_sum` yuqori çapdan pastki öng katakka eng arzon yöl vaznini qaytarsin. Faqat öng va pastga yuriladi. Yöldagi har bir katakni, şu jumladan ikkala uçni ham sanang. Jadvalda kamida bitta katak bor.

```python
def min_path_sum(grid):
    pass

print(min_path_sum([[3, 1, 4], [1, 5, 9], [2, 6, 5]]))
print(min_path_sum([[7]]))
print(min_path_sum([[1, 2, 3]]))
```

::: details Yeçim
Joriy katak xarajatiga yuqoridagi va çapdagi xarajatlarning kiçigini qöşing. Birinçi qatorga faqat çapdan, birinçi ustunga faqat yuqoridan kelinadi. Vaqt `O(r · c)`.

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

:::
