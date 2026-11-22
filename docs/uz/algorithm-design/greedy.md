---
title: Oçköz algoritmlar
description: "Oçköz algoritm har qadamda bitta mezon böyiça eng qulay tanlovni oladi. Tanlovlar qayta körib çiqilmaydi. Masalaning qoidalari bu tanlov eng yaxşi javobga olib borişini asoslaşi kerak."
---

# Oçköz algoritmlar

Oçköz algoritm har qadamda bitta mezon böyiça eng qulay tanlovni oladi. Tanlovlar qayta körib çiqilmaydi. Masalaning qoidalari bu tanlov eng yaxşi javobga olib borişini asoslaşi kerak.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost), [Ikkilik daraxt](/uz/trees/binary-tree) va [Uyum](/uz/trees/heap) darslarini öqing.

## Mahalliy tanlov {#the-idea}

Eng erta, eng arzon yoki eng katta qiymat kabi qoida tanlanadi. Şu tanlovni javobga qöşib, qolgan masala yeçiladi. Tanlovni almaştirib ham biror eng yaxşi javobni saqlaş mumkinligini tekşiring.

<Diagram label="Greedy path through a tree" :width="600" :height="214" alt="A tree with 2 at the top. Its children are 7 and 3. Under 7 are 1 and 4, and under 3 are 12 and 6. The greedy path, filled, steps to the larger child each time: 2, 7, 4, for a total of 13. The best path, outlined, goes 2, 3, 12, for a total of 17.">
 <DTree :x="300" :y="34" :width="360" :gap="60" :values="[2, 7, 3, 1, 4, 12, 6]" :states="{ 0: 'hit', 1: 'hit', 4: 'hit', 2: 'done', 5: 'done' }" :edges="{ 1: 'accent', 4: 'accent' }" />
 <text class="dg-note is-accent" x="210" y="200">greedy: 2 + 7 + 4 = 13</text>
 <text class="dg-note" x="390" y="200">best: 2 + 3 + 12 = 17</text>
</Diagram>

## Vaqtga mos tadbirlar {#activity-selection}

Bir xonaga bir vaqtda ikkita tadbir siğmaydi. Eng erta tugaydigan tadbirni oling, keyin u bilan kesişmaydiganlardan yana eng erta tugaydiganini tanlang. Erta tugaş keyingi tadbirlarga köproq vaqt qoldiradi.

<Diagram label="Activity selection" cost="O(n log n)" :width="700" :height="318" alt="Eight activities drawn as bars on a timeline from 0 to 12, listed in order of finish time and numbered in that order. A, from 1 to 3, is taken first. C, from 4 to 6, starts after A ends and is taken. B and D start before 6 and are skipped. E, from 6 to 9, starts as C ends and is taken. F and G start before 9 and are skipped. H, from 10 to 12, is taken. The bottom row shows the four chosen activities, A, C, E and H, side by side without overlap.">
 <template v-for="(bar, i) in [['A', 1, 3], ['C', 4, 6], ['B', 0, 7], ['D', 3, 8], ['E', 6, 9], ['F', 5, 10], ['G', 8, 11], ['H', 10, 12]]" :key="i">
  <DStep :x="92" :y="31 + 28 * i" :n="i + 1" />
  <DBox :x="110 + 36 * bar[1]" :y="20 + 28 * i" :w="36 * (bar[2] - bar[1])" :h="22" :text="bar[0]" :state="'ACEH'.includes(bar[0]) ? 'hit' : 'ghost'" small />
 </template>
 <text class="dg-note is-accent start" x="556" y="35">take</text>
 <text class="dg-note is-accent start" x="556" y="63">take, 4 ≥ 3</text>
 <text class="dg-note start" x="556" y="91">skip, 0 &lt; 6</text>
 <text class="dg-note start" x="556" y="119">skip, 3 &lt; 6</text>
 <text class="dg-note is-accent start" x="556" y="147">take, 6 ≥ 6</text>
 <text class="dg-note start" x="556" y="175">skip, 5 &lt; 9</text>
 <text class="dg-note start" x="556" y="203">skip, 8 &lt; 9</text>
 <text class="dg-note is-accent start" x="556" y="231">take, 10 ≥ 9</text>
 <text class="dg-label end" x="100" y="271">chosen</text>
 <DBox :x="146" :y="256" :w="72" :h="22" text="A" state="hit" small />
 <DBox :x="254" :y="256" :w="72" :h="22" text="C" state="hit" small />
 <DBox :x="326" :y="256" :w="108" :h="22" text="E" state="hit" small />
 <DBox :x="470" :y="256" :w="72" :h="22" text="H" state="hit" small />
 <line class="dg-link is-muted" x1="110" y1="292" x2="542" y2="292" />
 <template v-for="t in 13" :key="'t' + t">
  <line class="dg-link is-muted" :x1="74 + 36 * t" y1="288" :x2="74 + 36 * t" y2="296" />
  <text class="dg-index" :x="74 + 36 * t" y="306">{{ t - 1 }}</text>
 </template>
</Diagram>

```python
def select_activities(activities):
    chosen = []
    last_finish = float('-inf')
    for name, start, finish in sorted(activities, key=lambda activity: activity[2]):
        if start >= last_finish:
            chosen.append(name)
            last_finish = finish
    return chosen

activities = [('A', 1, 3), ('B', 0, 7), ('C', 4, 6), ('D', 3, 8),
              ('E', 6, 9), ('F', 5, 10), ('G', 8, 11), ('H', 10, 12)]
print(select_activities(activities))
print(select_activities([]))
```

## Qaytim beriş {#making-change}

Qolgan miqdorga siğadigan eng katta tangani ola boring. 25, 10, 5 va 1 qiymatlari bilan 63 uçun şu usul töğri javob beradi. 1, 3 va 4 bilan 6 uçun oçköz javob `4 + 1 + 1`. Eng yaxşi javob `3 + 3`.

<Diagram label="Change for 63 with 25, 10, 5 and 1" :width="600" :height="96" alt="Paying 63 with the coins 25, 10, 5 and 1. Greedy takes 25, 25, 10, 1, 1 and 1. Under each coin is the amount left to pay after it: 38, 13, 3, 2, 1 and 0. Six coins in all.">
 <text class="dg-note end" x="136" y="48">coins</text>
 <DCells :x="150" :y="24" :values="[25, 25, 10, 1, 1, 1]" :states="{ 0: 'hit', 1: 'hit', 2: 'hit', 3: 'hit', 4: 'hit', 5: 'hit' }" :indices="['38', '13', '3', '2', '1', '0']" />
 <text class="dg-note end" x="136" y="81">left</text>
 <text class="dg-note is-accent start" x="452" y="48">6 coins</text>
</Diagram>

```python
def greedy_change(amount, coins):
    result = []
    for coin in sorted(coins, reverse=True):
        while amount >= coin:
            amount -= coin
            result.append(coin)
    return result

print(greedy_change(63, [25, 10, 5, 1]))
print(greedy_change(14, [10, 7, 1]))
```

<Diagram label="Change for 14 with 10, 7 and 1" :width="600" :height="184" alt="Paying 14 with the coins 10, 7 and 1. Greedy takes 10, then 1, 1, 1 and 1, leaving 4, 3, 2, 1 and 0 to pay: five coins. The best answer is two 7s, leaving 7 and then 0: two coins.">
 <text class="dg-note end" x="136" y="48">greedy</text>
 <DCells :x="150" :y="24" :values="[10, 1, 1, 1, 1]" :indices="['4', '3', '2', '1', '0']" />
 <text class="dg-note end" x="136" y="81">left</text>
 <text class="dg-note start" x="404" y="48">5 coins</text>
 <text class="dg-note end" x="136" y="136">best</text>
 <DCells :x="150" :y="112" :values="[7, 7]" :states="{ 0: 'hit', 1: 'hit' }" :indices="['7', '0']" />
 <text class="dg-note end" x="136" y="169">left</text>
 <text class="dg-note is-accent start" x="260" y="136">2 coins</text>
</Diagram>

## Bölinadigan buyumlar {#fractional-knapsack}

Har buyumning bir qismini olsa böladi. Bir kilogrammga töğri keladigan qiymatni hisoblang. Nisbat katta bölganidan boşlab joylang va kerak bölsa oxirgi buyumning bir qismini oling. Butun buyum şartida bu qoida har doim işlamaydi.

<Diagram label="Fill a 10 kg bag" cost="O(n log n)" :width="700" :height="160" alt="The four items laid end to end in order of value per kilogram, one unit of width per kilogram: A, 2 kg at 7 per kg; B, 4 kg at 5 per kg; C, 6 kg at 4 per kg; D, 5 kg at 2 per kg. A line at 10 kg marks where the bag is full. A and B fit whole, the line cuts C after 4 of its 6 kg, and D is left out. The value taken is 14 + 20 + 16 = 50.">
 <text class="dg-note" x="430" y="22">bag full at 10 kg</text>
 <text class="dg-note" x="142" y="48">7 per kg</text>
 <text class="dg-note" x="238" y="48">5 per kg</text>
 <text class="dg-note" x="366" y="48">4 per kg</text>
 <text class="dg-note" x="574" y="48">2 per kg</text>
 <DBox :x="110" :y="60" :w="64" :h="40" text="A" state="hit" small />
 <DBox :x="174" :y="60" :w="128" :h="40" text="B" state="hit" small />
 <DBox :x="302" :y="60" :w="128" :h="40" text="C" state="hit" small />
 <DBox :x="430" :y="60" :w="64" :h="40" text="" state="ghost" small />
 <DBox :x="494" :y="60" :w="160" :h="40" text="D" state="ghost" small />
 <line class="dg-link is-accent" x1="430" y1="30" x2="430" y2="106" />
 <text class="dg-note end" x="96" y="122">taken</text>
 <text class="dg-note" x="142" y="122">2 kg</text>
 <text class="dg-note" x="238" y="122">4 kg</text>
 <text class="dg-note" x="366" y="122">4 of 6 kg</text>
 <text class="dg-note" x="574" y="122">none</text>
 <text class="dg-note is-accent" x="270" y="148">value 14 + 20 + 16 = 50</text>
</Diagram>

```python
def fractional_knapsack(capacity, items):
    total = 0
    taken = []
    for name, weight, value in sorted(items, key=lambda item: item[2] / item[1], reverse=True):
        if capacity == 0:
            break
        amount = min(weight, capacity)
        taken.append((name, amount))
        total += value * amount / weight
        capacity -= amount
    return total, taken

items = [('A', 2, 14), ('B', 4, 20), ('C', 6, 24), ('D', 5, 10)]
print(fractional_knapsack(10, items))
```

## Huffman kodlaşi {#huffman-coding}

Köp uçraydigan belgilarga qisqa bit kodlari beriladi. Uyumdan eng kam takrorlangan ikkita tugunni oling va ularning vaznini qöşib yangi ota yarating. Daraxtdagi çap va öng qirralar 0 va 1 ni belgilaydi. Bir belgining kodi boşqasining boş qismi bölmaydi.

<Diagram label="Build the tree for beekeeper" cost="O(m + n log n)" :width="640" :height="310" alt="Five rows show the heap before each step, in the order it hands out its trees, with each tree's count underneath. Step 1: b, k, p, r with count 1 and e with count 5; b and k are joined into bk with count 2. Step 2: p, r, bk, e; p and r are joined into pr with count 2. Step 3: bk, pr, e; bk and pr are joined into bkpr with count 4. Step 4: bkpr and e are joined into one tree with count 9. The last row holds only that tree.">
 <text class="dg-note end" x="96" y="39">step 1</text>
 <DCells :x="110" :y="20" :w="60" :h="30" small :values="['b', 'k', 'p', 'r', 'e']" :states="{ 0: 'hit', 1: 'hit' }" :indices="['1', '1', '1', '1', '5']" />
 <text class="dg-note end" x="96" y="67">count</text>
 <text class="dg-note start" x="430" y="39">join b and k: 1 + 1 = 2</text>
 <text class="dg-note end" x="96" y="97">step 2</text>
 <DCells :x="110" :y="78" :w="60" :h="30" small :values="['p', 'r', 'bk', 'e']" :states="{ 0: 'hit', 1: 'hit' }" :indices="['1', '1', '2', '5']" />
 <text class="dg-note start" x="430" y="97">join p and r: 1 + 1 = 2</text>
 <text class="dg-note end" x="96" y="155">step 3</text>
 <DCells :x="110" :y="136" :w="60" :h="30" small :values="['bk', 'pr', 'e']" :states="{ 0: 'hit', 1: 'hit' }" :indices="['2', '2', '5']" />
 <text class="dg-note start" x="430" y="155">join bk and pr: 2 + 2 = 4</text>
 <text class="dg-note end" x="96" y="213">step 4</text>
 <DCells :x="110" :y="194" :w="60" :h="30" small :values="['bkpr', 'e']" :states="{ 0: 'hit', 1: 'hit' }" :indices="['4', '5']" />
 <text class="dg-note start" x="430" y="213">join bkpr and e: 4 + 5 = 9</text>
 <text class="dg-note end" x="96" y="271">done</text>
 <DCells :x="110" :y="252" :w="60" :h="30" small :values="['bkpre']" :indices="['9']" />
 <text class="dg-note start" x="430" y="271">one tree left</text>
</Diagram>

<Diagram label="The finished tree" :width="600" :height="262" alt="The Huffman tree for beekeeper. The root, 9, has a node with count 4 on its left and the leaf e, count 5, on its right. The 4 splits into two nodes with count 2: one over b and k, the other over p and r, each with count 1. Every left edge is labelled 0 and every right edge 1, so e gets the code 1, and b, k, p and r get 000, 001, 010 and 011.">
 <DGraph :nodes="[{ id: 'root', label: 9, x: 350, y: 30 }, { id: 'n4', label: 4, x: 250, y: 90 }, { id: 'e', x: 450, y: 90, state: 'hit', note: 5, noteBelow: true }, { id: 'bk', label: 2, x: 180, y: 150 }, { id: 'pr', label: 2, x: 320, y: 150 }, { id: 'b', x: 145, y: 210, state: 'hit', note: 1, noteBelow: true }, { id: 'k', x: 215, y: 210, state: 'hit', note: 1, noteBelow: true }, { id: 'p', x: 285, y: 210, state: 'hit', note: 1, noteBelow: true }, { id: 'r', x: 355, y: 210, state: 'hit', note: 1, noteBelow: true }]" :edges="[{ from: 'root', to: 'n4', label: 0 }, { from: 'root', to: 'e', label: 1 }, { from: 'n4', to: 'bk', label: 0 }, { from: 'n4', to: 'pr', label: 1 }, { from: 'bk', to: 'b', label: 0 }, { from: 'bk', to: 'k', label: 1 }, { from: 'pr', to: 'p', label: 0 }, { from: 'pr', to: 'r', label: 1 }]" />
 <text class="dg-code" text-anchor="middle" x="450" y="128">1</text>
 <text class="dg-code" text-anchor="middle" x="145" y="246">000</text>
 <text class="dg-code" text-anchor="middle" x="215" y="246">001</text>
 <text class="dg-code" text-anchor="middle" x="285" y="246">010</text>
 <text class="dg-code" text-anchor="middle" x="355" y="246">011</text>
</Diagram>

```python
import heapq
from collections import Counter

def huffman_codes(text):
    heap = [(count, order, char) for order, (char, count) in enumerate(sorted(Counter(text).items()))]
    heapq.heapify(heap)
    order = len(heap)
    while len(heap) > 1:
        count1, _, left = heapq.heappop(heap)
        count2, _, right = heapq.heappop(heap)
        heapq.heappush(heap, (count1 + count2, order, (left, right)))
        order += 1
    codes = {}
    def walk(tree, code):
        if isinstance(tree, str):
            codes[tree] = code or '0'
            return
        walk(tree[0], code + '0')
        walk(tree[1], code + '1')
    if heap:
        walk(heap[0][2], '')
    return codes

codes = huffman_codes('beekeeper')
print(codes)
bits = ''.join(codes[char] for char in 'beekeeper')
print(bits, len(bits))
print(huffman_codes('aaa'), huffman_codes(''))
```

## Töliq dastur {#full-implementation}

Dastur tadbirlarni tanlaydi, qaytim yasaydi, bölinadigan yukxaltani töldiradi va matnga Huffman kodi tuzadi. Tangalardagi misol oçköz tanlov xato javob bergan holatni ham körsatadi.

```python
import heapq
from collections import Counter

def select_activities(activities):  # O(n log n)
    chosen = []
    last_finish = float('-inf')
    for name, start, finish in sorted(activities, key=lambda activity: activity[2]):
        if start >= last_finish:
            chosen.append(name)
            last_finish = finish
    return chosen

def greedy_change(amount, coins):  # O(n log n + k); not always the fewest coins
    result = []
    for coin in sorted(coins, reverse=True):
        while amount >= coin:
            amount -= coin
            result.append(coin)
    return result

def fractional_knapsack(capacity, items):  # O(n log n)
    total = 0
    taken = []
    for name, weight, value in sorted(items, key=lambda item: item[2] / item[1], reverse=True):
        if capacity == 0:
            break
        amount = min(weight, capacity)
        taken.append((name, amount))
        total += value * amount / weight
        capacity -= amount
    return total, taken

def huffman_codes(text):  # O(m + n log n)
    heap = [(count, order, char) for order, (char, count) in enumerate(sorted(Counter(text).items()))]
    heapq.heapify(heap)
    order = len(heap)
    while len(heap) > 1:
        count1, _, left = heapq.heappop(heap)
        count2, _, right = heapq.heappop(heap)
        heapq.heappush(heap, (count1 + count2, order, (left, right)))
        order += 1
    codes = {}
    def walk(tree, code):
        if isinstance(tree, str):
            codes[tree] = code or '0'
            return
        walk(tree[0], code + '0')
        walk(tree[1], code + '1')
    if heap:
        walk(heap[0][2], '')
    return codes

activities = [('A', 1, 3), ('B', 0, 7), ('C', 4, 6), ('D', 3, 8),
              ('E', 6, 9), ('F', 5, 10), ('G', 8, 11), ('H', 10, 12)]
print(select_activities(activities))

print(greedy_change(63, [25, 10, 5, 1]))
print(greedy_change(14, [10, 7, 1]))

items = [('A', 2, 14), ('B', 4, 20), ('C', 6, 24), ('D', 5, 10)]
print(fractional_knapsack(10, items))

print(huffman_codes('beekeeper'))
```

## Qaçon yeçim eng yaxşi böladi {#when-it-works-and-when-it-fails}

Avvalgi eng yaxşi javobning bir qadamini oçköz tanlovga almaştirib, natijani yomonlaştirmaslikni körsating. Keyin ayni fikr qolgan masalaga ham tegişli ekanini tekşiring. Masalan, eng erta tugagan tadbir keyingi tadbirlarni siğdiradi.

## Qayerda işlatiladi {#when-to-use}

Mahalliy mezon isbot bilan asoslangan bölsa, tadbirlar, bölinadigan yukxalta yoki qamrovçi daraxt kabi masalalarda oçköz usul mos. Tangalarning istalgan qiymatida eng kam son uçun dinamik dasturlaşdan foydalaniş mumkin.

## Xulosa {#key-points}

Mahalliy tanlovni umumiy javob bilan boğlaydigan dalil kerak. Qoidaning qaysi şartlarga tayanişini yozing va bu şart buzilgan misolni tekşiring.

## Maşq {#exercise}

`fewest_boats` hammani taşiş uçun eng kam qayiq sonini qaytarsin. Qayiqqa köpi bilan ikki odam siğadi. Ularning jami vazni `limit` dan oşmasin. Heç kim yolğiz holda limitdan oşmaydi.

```python
def fewest_boats(weights, limit):
    pass

print(fewest_boats([70, 50, 80, 50], 100))
print(fewest_boats([30, 60, 40, 70], 100))
print(fewest_boats([60], 100))
print(fewest_boats([], 100))
```

::: details Yeçim
Vaznlarni saralang. Eng oğir odamga baribir qayiq kerak. Eng yengili u bilan siğsa, ikkisini birga yuboring. Siğmasa, oğiri yolğiz ketadi. Ikki indeksni uçlardan siljiting. Saralaş `O(n log n)`, yuruv `O(n)`.

```python
def fewest_boats(weights, limit):
    people = sorted(weights)
    lightest, heaviest = 0, len(people) - 1
    boats = 0
    while lightest <= heaviest:
        if people[lightest] + people[heaviest] <= limit:
            lightest += 1
        heaviest -= 1
        boats += 1
    return boats

print(fewest_boats([70, 50, 80, 50], 100))
print(fewest_boats([30, 60, 40, 70], 100))
print(fewest_boats([60], 100))
print(fewest_boats([], 100))
```

:::
