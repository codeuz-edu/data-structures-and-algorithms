---
title: Ortga qaytib qidiriş
description: "Javob bir neçta tanlovdan iborat bölsa, ularni ketma-ket sinab köriş mumkin. Joriy tanlov bilan davom etib bölmasa yoki uning imkoniyatlari tugasa, oldingi qadamga qaytamiz va boşqa tanlovni sinaymiz."
---

# Ortga qaytib qidiriş

Javob bir neçta tanlovdan iborat bölsa, ularni ketma-ket sinab köriş mumkin. Joriy tanlov bilan davom etib bölmasa yoki uning imkoniyatlari tugasa, oldingi qadamga qaytamiz va boşqa tanlovni sinaymiz.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost), [Stek](/uz/stacks-queues/stack) va [Rekursiya](/uz/recursion/recursion) darslarini öqing.

## Tanlaş, tekşiriş va qaytiş {#the-idea}

`chosen` joriy tanlovlarni saqlaydi. Yangi tanlovni oxiriga qöşing, undan keladigan masalani yeçing va qaytişda tanlovni olib taşlang. Javobni saqlaş kerak bölsa, `chosen` ning nusxasini oling.

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

<BacktrackTree mode="subsets" />

## Qism töplamlar {#subsets}

Farqli `n` ta elementdan barça qism töplamlarni yasang. Har sathda bitta elementni oliş yoki qoldirişni tanlang. Hamma element haqida qaror qilingaç, bitta qism töplam hosil böladi.

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

## Örin almaştirişlar {#permutations}

Har sathda hali işlatilmagan bitta elementni tanlang. `used` bayroqlari qaysi indekslar bandligini bildiradi. Qaytişda qiymatni `chosen` dan oling va bayroğini tozalang.

<BacktrackTree mode="permutations" />

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

## Şaxmat doskasidagi farzinlar {#n-queens}

`n × n` doskaga `n` ta farzin bir-biriga hujum qilmaydigan qilib joylanadi. Bir qatorda bitta farzin bölsin. Yangi ustun va `row - col`, `row + col` bilan belgilangan ikki diagonal band bölmasligi kerak.

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

## Masala şoxini kesiş {#pruning}

Qisman tuzilgan javob qoida buzsa, undan keladigan tanlovlarni tekşirmang. Masalan farzin band diagonalga tuşsa, qolgan qatorlarni töldirişning hojati yöq.

## Töliq dastur {#full-implementation}

Qism töplamlar, örin almaştirişlar va farzinlar bir xil tanla, tekşir, qaytar tartibini işlatadi. Ularning farqi qanday tanlovlar borligi va qayerda töxtaşida.

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

## Tahlil {#analysis}

Qism töplamlar soni `2ⁿ`. Har birini röyxatga yozganda jami `O(n · 2ⁿ)` vaqt ketadi. Örin almaştirişlar soni `n!`, har javobda `n` element bor. Farzinlarda kesiş ayrim şoxlarni barvaqt töxtatadi. Javoblardan taşqari xotira asosan joriy yölga ketadi.

## Python tilida {#in-python}

`itertools.permutations` tartibli variantlarni, `itertools.combinations` esa belgilangan uzunlikdagi tanlovlarni beradi. Qisman javobni tekşirib şoxni kesiş zarur bölsa, qidiruvni alohida yozamiz.

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

## Qayerda işlatiladi {#when-to-use}

Sudoku, farzinlarni joylaş va çeklovga mos javoblarni röyxatlaşda ortga qaytib qidiriladi. Natijalar soni katta bölsa, ularning özini yoziş ham ança vaqt oladi.

## Xulosa {#key-points}

Qaytişda joriy qadam özgartirgan holatni tiklang. Masalaning şartiga mos kelmaydigan şoxni erta kesing. Bitta javob yetarli bölsa, uni topganda töxtang.

## Maşq {#exercise}

`brackets(n)` `n` juft töğri joylaşgan yumaloq qavslarning hammasini qaytarsin. Masalan `n = 3` uçun `(())()` bitta javob. Bir martada bitta qavs yozing.

```python
def brackets(n):
    pass

print(brackets(1))
print(brackets(2))
print(brackets(3))
```

::: details Yeçim
Açiluvçi qavsni jami `n` tadan oşirmang. Yopiluvçi qavsdan oldin hali yopilmagan qavs bölsin. `k` ta javobda vaqt `O(n · k)`, javoblardan taşqari joy `O(n)`.

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

:::
