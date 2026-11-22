---
title: Dinamik dasturlaş
description: "Baʼzi masalalarni yeçayotganda bir xil kiçik masala qayta-qayta uçraydi. Dinamik dasturlaş uning javobini bir marta hisoblab, keyin qayta işlatadi."
---

# Dinamik dasturlaş

Baʼzi masalalarni yeçayotganda bir xil kiçik masala qayta-qayta uçraydi. Dinamik dasturlaş uning javobini bir marta hisoblab, keyin qayta işlatadi.

Avval [Rekursiya](/uz/recursion/recursion) va [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) darslarini öqing.

## Takroriy masalalar {#the-idea}

Oddiy `fib(5)` daraxtida 15 ta çaqiruv bor. Masalan, `fib(2)` uç marta hisoblanadi. `fib(5)` ni hisoblaşda 0 dan 5 gaça atigi oltita turli argument uçraydi. Har bir natijani keşda saqlasak, shu argument qayta berilganda qiymatni yana hisoblamaymiz.

<Diagram label="How often each subproblem is solved for fib(5)" :width="640" :height="140" alt="A table with one column for each subproblem, fib(0) to fib(5). The naive recursion solves fib(0) 3 times, fib(1) 5 times, fib(2) 3 times, fib(3) twice, and fib(4) and fib(5) once each: 15 in all. With a cache each one is solved once: 6 in all.">
<DpTable :x="130" :y="50" :w="64" :h="36" :rows="[[3, 5, 3, 2, 1, 1], [1, 1, 1, 1, 1, 1]]" :col-heads="['fib(0)', 'fib(1)', 'fib(2)', 'fib(3)', 'fib(4)', 'fib(5)']" :row-heads="['naive', 'cached']" :states="{ '0,0': 'done', '0,1': 'done', '0,2': 'done', '0,3': 'done' }" />
<text class="dg-note start" x="526" y="72">15 in all</text>
<text class="dg-note start" x="526" y="108">6 in all</text>
</Diagram>

## Fibonaççi sonlarini tört usulda hisoblaş {#fibonacci-in-four-versions}

`fib(0) = 0`, `fib(1) = 1`. Har keyingi qiymat `fib(i - 1) + fib(i - 2)`. Bir xil boğlanişni turli tartibda hisoblaymiz.

### Oddiy rekursiya {#naive-recursion}

Har kerakli son uçun ikkita oldingi son qaytadan hisoblanadi. `fib_naive(30)` da javob 832 040, çaqiruvlar soni 2 692 537.

```py
def fib_naive(n):
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)
```

### Yuqoridan pastga hisoblaş {#top-down-memoization}

`memo` luğati keş vazifasini bajaradi. Qiymat oldin hisoblangan bölsa, luğatdan olinadi. Aks holda funksiya uni rekursiv hisoblab, luğatga yozadi. Natijani shu tarzda saqlaş memoizatsiya deyiladi.

```py
def fib_memo(n):
    memo = {0: 0, 1: 1}
    def solve(i):
        if i not in memo:
            memo[i] = solve(i - 1) + solve(i - 2)
        return memo[i]
    return solve(n)
```

### Pastdan yuqoriga jadval töldiriş {#bottom-up-tabulation}

Avval 0 va 1 ni yozing. Keyingi katakni undan oldingi ikki katakdan hisoblang. Jadval çapdan öngga töldiriladi va rekursiya kerak bölmaydi.

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

### Ikkita özgaruvçi {#two-variables}

Har qadamga faqat oldingi ikki qiymat kerak. `a` va `b` ni birga siljiting. `n` ta qöşiş va doimiy sondagi sonli özgaruvçi yetarli. Bu tahlilda qöşişlar va özgaruvçilar sanaladi. Katta Python butun sonlari köp bit talab qiladi.

```py
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## Yangi masalani tuziş {#a-recipe-for-new-problems}

Har katakning maʼnosini bir gap bilan yozing. U qaysi kiçikroq holatlardan olinişini, qanday boşlanişini va qaysi tartibda hisoblanişini belgilang. Javob olinadigan katakni körsating.

## Zinadan çiqiş {#climbing-stairs}

Har qadamda bitta yoki ikkita zina kötariliş mumkin. `i`-zinaga `i - 1` yoki `i - 2` dan kelinadi. Ikki holatdagi yöllar sonini qöşing. 0 zinaga bitta, yaʼni yurilmaydigan yöl bor.

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

## Eng kam tanga {#coin-change-fewest-coins}

Har musbat qiymatdagi tangadan istalgança işlatiş mumkin. `best[a]` — `a` miqdoriga kerakli eng kam tanga. Har mos tanga uçun `1 + best[a - coin]` ni soliştiring. `best[0] = 0`, yasab bölmaydigan qiymat çeksizlik bilan belgilanadi.

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

## Tanga birikmalari soni {#coin-change-number-of-ways}

Tangalar tartibi hisobga olinmaydi. Avval bitta tanga turini tanlab, miqdorlarni ösiş tartibida yangilang. `ways[a] += ways[a - coin]` şu tangani yana işlatadigan birikmalarni qöşadi. `ways[0] = 1`.

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

## Töliq dastur {#full-implementation}

Misol zinadan çiqişni va ikki xil tanga masalasini işlatadi. Tangani eng kam sonda beriş va turli yeçimlar sonini sanaş bir xil savol emas, şuning uçun jadvalning maʼnosi ham farqli.

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

## Tahlil {#analysis}

Fibonaççi jadvalida `n + 1` katak, har katakda bitta qöşiş bor. Ikki özgaruvçi kataklar sonini doimiy qiladi. Miqdor `n` va `c` xil tanga bölsa, vaqt `O(n · c)`, jadval joyi `O(n)`. Bu miqdorning son qiymatiga boğliq.

## Python tilida {#in-python}

`functools.cache` funksiya natijalarini argumentlar böyiça saqlaydi. Argumentlar xeşlanadigan bölsin. Çuqur rekursiyada pastdan jadval töldiriş qulayroq.

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

## Qayerda işlatiladi {#when-to-use}

Bir xil kiçik masalalar takrorlansa va javob ularning natijalaridan tuzilsa, DP qöllanadi. Eng kam xarajat, eng katta qiymat yoki yöllar sonini hisoblaş bunga misol.

## Xulosa {#key-points}

Holat maʼnosi, boşlanğiş qiymat va ötiş qoidasini belgilang. Har qiymatni bir marta hisoblang. Keyingi qadamlarda kerak bölmaydigan kataklarni saqlaş şart emas.

## Maşq {#exercise}

`best_sum` röyxatdan yonma-yon bölmagan qiymatlarni tanlab, eng katta yiğindini qaytarsin. Sonlar manfiy emas. Heç narsa tanlanmasa, javob 0.

```python
def best_sum(values):
    pass

print(best_sum([2, 7, 9, 3, 1]))
print(best_sum([5, 1, 1, 5]))
print(best_sum([4]))
print(best_sum([]))
```

::: details Yeçim
Oxirgi qiymatni qoldirsak `best[i - 1]`, olsak `best[i - 2] + values[i - 1]`. Kattasini oling. Ikki oldingi javob yetadi. Vaqt `O(n)`, qöşimça özgaruvçilar soni doimiy.

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

:::
