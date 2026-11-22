---
title: Greedy Algorithms
description: "Greedy algorithms in Python: the greedy choice, activity selection, making change and where it fails, fractional knapsack, and Huffman coding with a heap."
---

# Greedy Algorithms

A greedy algorithm chooses the best available option by a rule such as earliest finish or lowest cost. It keeps that choice and applies the rule to the remaining problem. The challenge is to show when each of those choices leads to an optimal answer.

**You need:** [Measuring Cost](/foundations/measuring-cost), [Binary Tree](/trees/binary-tree) and [Heap](/trees/heap).

## The idea

<Diagram label="Greedy path through a tree" :width="600" :height="214" alt="A tree with 2 at the top. Its children are 7 and 3. Under 7 are 1 and 4, and under 3 are 12 and 6. The greedy path, filled, steps to the larger child each time: 2, 7, 4, for a total of 13. The best path, outlined, goes 2, 3, 12, for a total of 17.">
 <DTree :x="300" :y="34" :width="360" :gap="60" :values="[2, 7, 3, 1, 4, 12, 6]" :states="{ 0: 'hit', 1: 'hit', 4: 'hit', 2: 'done', 5: 'done' }" :edges="{ 1: 'accent', 4: 'accent' }" />
 <text class="dg-note is-accent" x="210" y="200">greedy: 2 + 7 + 4 = 13</text>
 <text class="dg-note" x="390" y="200">best: 2 + 3 + 12 = 17</text>
</Diagram>

At every step a greedy algorithm does two things.

1. Pick the option that is best by one simple rule: the earliest, the largest, the cheapest.
2. Commit to it. The choice is never undone, and the rest of the problem is solved around it.

The tree shows the risk. The task is to walk from the top to the bottom and collect the largest total. The greedy rule, step to the larger child, takes 7 over 3 and ends with 13. The path through 3 reaches 12 and totals 17, but once greedy has stepped to 7, that side of the tree is gone.

So a greedy rule needs a reason to trust it. Each problem below comes with one, and the section on making change also shows a rule that sounds just as sensible and is wrong.

## Activity selection

You have one room and a list of activities, each with a start and a finish time. Choose as many activities as possible so that no two overlap. An activity may start at the moment the previous one finishes.

The greedy rule: take the activity that finishes first. Then, among the activities that start after it ends, again take the one that finishes first, and so on.

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

1. Sort the activities by finish time. The numbers on the left are this order.
2. Remember the finish time of the last activity taken. Before the first one, it is minus infinity.
3. Take an activity if it starts at or after that time, and skip it otherwise.

The note beside each bar compares its start with the finish of the last activity taken. Four activities fit: A, C, E and H.

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

Why the finish time? The activity that ends first leaves the most room for everything after it. Take any best schedule and look at its first activity. Swapping it for the activity that finishes first cannot cause an overlap, because the new one ends no later. So some best schedule starts with the greedy choice, and the same argument then applies to the activities that are left.

Other rules sound as good and fail. Earliest start takes B first, which runs from 0 to 7, and then fits only G. Shortest first fails on the three activities 0 to 5, 4 to 7 and 6 to 11: it takes the short middle one, which overlaps both others, although those two fit together.

Sorting `n` activities costs [`O(n log n)`](/foundations/measuring-cost) and the pass is `O(n)`, so the whole algorithm is `O(n log n)`.

## Making change

Pay an amount with as few coins as possible. Every coin set here includes 1, so any amount can be paid.

The greedy rule: take the largest coin that still fits, and repeat.

<Diagram label="Change for 63 with 25, 10, 5 and 1" :width="600" :height="96" alt="Paying 63 with the coins 25, 10, 5 and 1. Greedy takes 25, 25, 10, 1, 1 and 1. Under each coin is the amount left to pay after it: 38, 13, 3, 2, 1 and 0. Six coins in all.">
 <text class="dg-note end" x="136" y="48">coins</text>
 <DCells :x="150" :y="24" :values="[25, 25, 10, 1, 1, 1]" :states="{ 0: 'hit', 1: 'hit', 2: 'hit', 3: 'hit', 4: 'hit', 5: 'hit' }" :indices="['38', '13', '3', '2', '1', '0']" />
 <text class="dg-note end" x="136" y="81">left</text>
 <text class="dg-note is-accent start" x="452" y="48">6 coins</text>
</Diagram>

With the coins 25, 10, 5 and 1, paying 63 takes two 25s, a 10 and three 1s. The row under the coins shows what is left to pay after each one.

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

For the coins 25, 10, 5 and 1, and for euro coins, greedy always gives the fewest coins. Change the coin set and the same rule breaks.

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

With the coins 10, 7 and 1, greedy pays 14 as a 10 and four 1s: five coins. Two 7s do it with two. Taking the 10 looked best, and it left 4, which only 1s can pay.

One way to find the fewest coins for arbitrary positive denominations is to try each possible last coin and reuse the best answers for smaller amounts. That is [dynamic programming](/algorithm-design/dynamic-programming), and coin change is one of its first examples.

The greedy version costs `O(n log n + k)` for `n` coin values and `k` coins handed out: the sort, then one step per coin value and one per coin.

## Fractional knapsack

A bag holds 10 kg. Each item has a weight and a value, and you may take any fraction of an item: half of it for half its value. Fill the bag to get the largest total value.

| Item | Weight | Value | Value per kg |
| --- | --- | --- | --- |
| A | 2 kg | 14 | 7 |
| B | 4 kg | 20 | 5 |
| C | 6 kg | 24 | 4 |
| D | 5 kg | 10 | 2 |

The greedy rule: take the items in order of value per kilogram, as much of each as fits.

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

A and B fit whole and fill 6 kg. That leaves 4 kg, and C, the next best, weighs 6 kg, so the bag takes 4 kg of it for two thirds of its value, 16. The bag is now full and D is never touched. The total is 50.

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

Each kilogram of space is worth the most when it holds the best item per kilogram, and items can be split to fill the remaining space when enough material is available. If the bag held a kilogram of a worse item while some of a better one was left out, swapping the two would raise the value.

Sorting `n` items costs `O(n log n)` and the pass is `O(n)`.

## Huffman coding

Text is stored as bits. A fixed-length code gives every character the same number of bits: the five different letters of `beekeeper` need 3 bits each, giving 27 bits for its nine letters, before any codebook is stored. Huffman coding gives common characters short codes and rare characters long ones. No code is the start of another, so the bits can be read back without separators.

The greedy rule: put every character in a [heap](/trees/heap) as a one-node tree, keyed by how often it appears. Then pop the two trees with the smallest counts, join them under a new node whose count is their sum, and push that back. Repeat until one tree is left.

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

Each row lists the trees in the order the heap hands them out, with each tree's count under it. The letters enter the heap in alphabetical order, and when two counts are equal, the tree that entered first comes out first.

1. b and k are the rarest letters. They are joined into a tree with count 2.
2. p and r, also count 1, are joined into a second tree with count 2.
3. The two trees with count 2 are joined into one with count 4.
4. That tree and e, count 5, are joined into the root, count 9.

<Diagram label="The finished tree" :width="600" :height="262" alt="The Huffman tree for beekeeper. The root, 9, has a node with count 4 on its left and the leaf e, count 5, on its right. The 4 splits into two nodes with count 2: one over b and k, the other over p and r, each with count 1. Every left edge is labelled 0 and every right edge 1, so e gets the code 1, and b, k, p and r get 000, 001, 010 and 011.">
 <DGraph :nodes="[{ id: 'root', label: 9, x: 350, y: 30 }, { id: 'n4', label: 4, x: 250, y: 90 }, { id: 'e', x: 450, y: 90, state: 'hit', note: 5, noteBelow: true }, { id: 'bk', label: 2, x: 180, y: 150 }, { id: 'pr', label: 2, x: 320, y: 150 }, { id: 'b', x: 145, y: 210, state: 'hit', note: 1, noteBelow: true }, { id: 'k', x: 215, y: 210, state: 'hit', note: 1, noteBelow: true }, { id: 'p', x: 285, y: 210, state: 'hit', note: 1, noteBelow: true }, { id: 'r', x: 355, y: 210, state: 'hit', note: 1, noteBelow: true }]" :edges="[{ from: 'root', to: 'n4', label: 0 }, { from: 'root', to: 'e', label: 1 }, { from: 'n4', to: 'bk', label: 0 }, { from: 'n4', to: 'pr', label: 1 }, { from: 'bk', to: 'b', label: 0 }, { from: 'bk', to: 'k', label: 1 }, { from: 'pr', to: 'p', label: 0 }, { from: 'pr', to: 'r', label: 1 }]" />
 <text class="dg-code" text-anchor="middle" x="450" y="128">1</text>
 <text class="dg-code" text-anchor="middle" x="145" y="246">000</text>
 <text class="dg-code" text-anchor="middle" x="215" y="246">001</text>
 <text class="dg-code" text-anchor="middle" x="285" y="246">010</text>
 <text class="dg-code" text-anchor="middle" x="355" y="246">011</text>
</Diagram>

To read a code, walk from the root down to the letter: a left edge adds 0 and a right edge adds 1. The small number beside each letter is its count. e, the most common letter, gets a 1-bit code and the others get 3 bits, so `beekeeper` takes 5 × 1 + 4 × 3 = 17 bits instead of 27.

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

A leaf is a one-letter string and a joined tree is a pair `(left, right)`. Each heap entry is `(count, order, tree)`, where `order` is a counter that goes up with every push. When two counts are equal, the lower `order` wins, so ties always go to the older tree and the same text always gets the same codes. The counter also stops `heapq` from comparing two trees, which raises `TypeError` when it meets a string and a tuple. A text with only one distinct character gets the code `0`.

Why is joining the two rarest safe? In some best tree the two rarest characters are siblings at the deepest level, because moving a rarer character down and a more common one up never makes the text longer. Joining them first therefore loses nothing, and what remains is the same problem with one tree fewer.

Counting the characters of a text of length `m` costs `O(m)`. With `n` distinct characters there are `n - 1` joins, each two pops and a push at `O(log n)`, so building the tree costs `O(n log n)`.

## Full implementation

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

## When it works and when it fails

A greedy algorithm gives the best answer when two things are true.

- Some best answer starts with the greedy choice. An exchange argument shows it, as for activity selection: take any best answer, swap its first piece for the greedy one, and show that it gets no worse.
- After the choice, what is left is a smaller problem of the same kind, so the same rule applies again.

| Problem | Greedy rule | Best answer? | Cost |
| --- | --- | --- | --- |
| Activity selection | earliest finish | always | `O(n log n)` |
| Change with 25, 10, 5, 1 | largest coin that fits | always | `O(n log n + k)` |
| Change with 10, 7, 1 | largest coin that fits | no: 5 coins for 14, where 2 will do | `O(n log n + k)` |
| Fractional knapsack | best value per kg | always | `O(n log n)` |
| Knapsack, whole items only | best value per kg | no: 34, where 44 is possible | `O(n log n)` |
| Huffman coding | join the two rarest | always | `O(m + n log n)` |

The fifth row is the same bag as above with items that cannot be split. Greedy takes A and B, 6 kg worth 34, and then neither C nor D fits in the 4 kg left. B and C fill the bag exactly and are worth 44. That version needs [dynamic programming with a table](/algorithm-design/dynamic-programming-2d).

A wrong greedy rule still returns an answer, with no error. Before trusting a new rule, compare it on many small inputs with a search that tries every possibility, such as [backtracking](/algorithm-design/backtracking). One mismatch settles the question.

Three graph algorithms on this site are greedy, each with a proof that its rule is safe.

- Dijkstra's algorithm for [shortest paths](/graphs/shortest-paths) settles the nearest vertex not yet settled and never changes its distance again. The proof needs every edge weight to be zero or more, and a single negative edge can make the answer wrong.
- Prim's and Kruskal's algorithms for the [minimum spanning tree](/graphs/minimum-spanning-tree) both add the cheapest edge they are allowed to. Prim's takes the cheapest edge leaving the tree it is growing. Kruskal's takes the cheapest edge left anywhere that does not close a cycle.

## When to use

Reach for a greedy algorithm when the problem asks for a best answer built from pieces and one simple rule ranks the pieces: earliest, largest, cheapest, best ratio. If you can argue that the rule's first choice belongs to some best answer, you get a fast algorithm, usually `O(n log n)` for the sort.

Do not use it when a choice now changes which choices are good later, as with an arbitrary coin set or a knapsack of whole items. Use [dynamic programming](/algorithm-design/dynamic-programming) when the same smaller problems come up again and again, and [backtracking](/algorithm-design/backtracking) when you have to try the possibilities one by one.

## Key points

- A greedy algorithm takes the best-looking option at each step and never undoes it.
- It is fast: usually a sort or a heap, then one pass.
- It is right only when some best answer starts with the greedy choice. An exchange argument shows that.
- Earliest finish, best value per kilogram and joining the two rarest are safe rules. The largest coin is safe for some coin sets only.
- A wrong greedy rule fails silently, so test it against a full search on small inputs.

## Exercise

People are waiting for boats. A boat carries at most two people, and their total weight must not be more than `limit`. Nobody weighs more than `limit`. Write `fewest_boats`, which returns the smallest number of boats that carries everyone. Start with the heaviest person: who, if anyone, should share their boat?

```python
def fewest_boats(weights, limit):
    pass

print(fewest_boats([70, 50, 80, 50], 100))
print(fewest_boats([30, 60, 40, 70], 100))
print(fewest_boats([60], 100))
print(fewest_boats([], 100))
```

::: details Solution
Sort the weights. The heaviest person needs a boat whatever happens. If anyone can share it, the lightest person can, and pairing those two is never worse: in any plan, swapping the lightest person with whoever shares the heaviest person's boat keeps every boat within the limit. So send the heaviest with the lightest when they fit, and alone otherwise. Two indexes walk in from both ends of the sorted list.

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

**Time** `O(n log n)` for the sort, then one `O(n)` pass. **Space** `O(n)` for the sorted copy.
:::
