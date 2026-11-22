---
title: Hash Table
description: "How a hash table works in Python: hash functions, buckets, chaining, linear probing with tombstones, resizing, hashable keys, and dict and set."
---

# Hash Table

A hash table uses a hash of each key to decide where to store or look for it. Different keys can lead to the same place, so the table also compares keys to tell them apart. With a suitable hash function and enough space, lookups take constant time [on average](/foundations/measuring-cost#best-worst-and-average-case), assuming hashing and equality checks take constant time. Python uses hash tables for dictionaries, which associate keys with values, and sets, which store keys alone.

**You need:** [Measuring Cost](/foundations/measuring-cost) and [Dynamic Array](/arrays/dynamic-array).

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `set(key, value)` | Add a pair, or replace the value if the key is already there | `O(1)` average, amortized |
| `get(key)` | Return the value for a key, or raise `KeyError` | `O(1)` average |
| `delete(key)` | Remove the pair for a key, or raise `KeyError` | `O(1)` average |
| `key in table` | Say whether the key is in the table | `O(1)` average |
| `len(table)` | Count the pairs | `O(1)` |

`n` is the number of pairs. The average assumes the hash function spreads the keys evenly over the buckets, as a [good hash function](#good-hash-functions) does. A long chain can make a key operation take `O(n)` in the worst case. For example, all keys could map to the same bucket. `set` is also [amortized](/arrays/dynamic-array), because now and then it resizes the table.

The table counts each hash calculation and equality check as one step. A fresh string hash or a string comparison can take time proportional to the string length. When keys grow with the input, include those costs in the analysis.

## From key to bucket

<Diagram label="Hashing a key" :width="650" :height="100" alt="The key fig goes through a hash function that adds up its character codes and gives 310. The remainder of 310 divided by 8 is 6, so the key belongs in bucket 6.">
 <DBox :x="30" :y="30" :w="70" text="'fig'" small /><text class="dg-note" x="65" y="84">key</text>
 <DArrow :from="[102, 48]" :to="[138, 48]" />
 <DBox :x="140" :y="30" :w="150" text="add up character codes" small /><text class="dg-note" x="215" y="84">hash function</text>
 <DArrow :from="[292, 48]" :to="[328, 48]" />
 <DBox :x="330" :y="30" :w="70" text="310" /><text class="dg-note" x="365" y="84">hash</text>
 <DArrow :from="[402, 48]" :to="[438, 48]" />
 <DBox :x="440" :y="30" :w="90" text="310 % 8" small /><text class="dg-note" x="485" y="84">fit to 8 buckets</text>
 <DArrow :from="[532, 48]" :to="[568, 48]" />
 <DBox :x="570" :y="30" :w="50" text="6" state="hit" /><text class="dg-note" x="595" y="84">bucket</text>
</Diagram>

The table is an array of buckets. A hash function turns a key into a number, and the remainder after dividing by the number of buckets is the index. The same key always gives the same index, which is how the table finds it again.

The toy hash function below adds up character codes. It is easy to follow, and it is used for the diagrams on this page.

```python
def simple_hash(key):
    return sum(ord(char) for char in key)

for key in ['pear', 'apple', 'kiwi', 'plum', 'lime', 'fig']:
    print(key, simple_hash(key), simple_hash(key) % 8)
```

`plum` and `fig` both land in bucket 6. Two keys sharing a bucket is called a collision, and every hash table needs a plan for it. The class on this page uses chaining: each bucket is a list of the pairs that hashed to it. Textbooks often draw a chain as a [linked list](/linked-lists/singly-linked-list). A Python list does the same job here.

```py
class HashTable:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):
        return self.buckets[hash(key) % len(self.buckets)]
```

`size` counts the pairs. `_bucket` uses Python's built-in `hash` in place of `simple_hash`. [Hashable keys](#hashable-keys) explains what `hash` needs from a key.

## Insert

<HashTableBuckets mode="insert" />

1. Hash the key to pick its bucket.
2. Look through the pairs in that bucket. If one has the key, replace its value and stop.
3. Otherwise append the new pair to the bucket and add one to `size`.

```py
def set(self, key, value):
    bucket = self._bucket(key)
    for pair in bucket:
        if pair[0] == key:
            pair[1] = value
            return
    bucket.append([key, value])
    self.size += 1
```

A pair is a two-item list rather than a tuple, so its value can be replaced in place. Only one bucket is examined, so insert costs `O(1)` on average while the chains stay short. [Resizing](#load-factor-and-resizing) is what keeps them short.

## Look up

<HashTableBuckets mode="lookup" />

1. Hash the key to pick its bucket.
2. Compare the key with each pair in that bucket.
3. Return the value on a match. If the bucket runs out, the key is not in the table, and `get` raises `KeyError`, as a `dict` does.

```py
def get(self, key):
    for existing, value in self._bucket(key):
        if existing == key:
            return value
    raise KeyError(key)

def __contains__(self, key):
    for existing, value in self._bucket(key):
        if existing == key:
            return True
    return False
```

`__contains__` is what makes `key in table` work. It answers yes or no instead of raising. Only one bucket is ever examined, so both cost `O(1)` on average.

## Delete

<HashTableBuckets mode="delete" />

1. Hash the key to pick its bucket.
2. Find the pair with that key in the bucket. If there is none, raise `KeyError`.
3. Remove the pair from the bucket and subtract one from `size`.

```py
def delete(self, key):
    bucket = self._bucket(key)
    for i, pair in enumerate(bucket):
        if pair[0] == key:
            del bucket[i]
            self.size -= 1
            return
    raise KeyError(key)
```

The chain is short, so delete costs `O(1)` on average. Nothing outside the bucket moves, and every other key can still be found. That is not true of open addressing, below, where a delete needs more care.

## Load factor and resizing

<Diagram label="Resize to 16 buckets" cost="O(n)" :width="700" :height="112" alt="The six keys after the table grows from 8 to 16 buckets, with each index now the hash modulo 16. pear moves from bucket 0 to bucket 8 and plum moves from bucket 6 to bucket 14. apple, kiwi, fig and lime keep buckets 2, 4, 6 and 7. plum and fig no longer share a bucket.">
 <DCells :x="30" :y="44" :w="40" :h="38" small :values="[null, null, 'apple', null, 'kiwi', null, 'fig', 'lime', 'pear', null, null, null, null, null, 'plum', null]" :states="{ 0: 'ghost', 1: 'ghost', 3: 'ghost', 5: 'ghost', 8: 'new', 9: 'ghost', 10: 'ghost', 11: 'ghost', 12: 'ghost', 13: 'ghost', 14: 'new', 15: 'ghost' }" :marks="{ 8: 'from 0', 14: 'from 6' }" indices />
</Diagram>

The chains stay short only while the table has enough buckets. The load factor is the number of pairs divided by the number of buckets. When it passes a limit, often 0.75, the table doubles its buckets and puts every pair into its new place. Python's `dict` grows when it is two thirds full.

1. Make a new array with twice as many buckets.
2. Put every pair into the bucket its key picks in the new array.
3. Drop the old array.

```py
def _resize(self):
    pairs = [pair for bucket in self.buckets for pair in bucket]
    self.buckets = [[] for _ in range(2 * len(self.buckets))]
    for key, value in pairs:
        self._bucket(key).append([key, value])
```

`set` calls `_resize` when `size` passes 0.75 times the number of buckets. Every key needs a new index, because the index depends on the bucket count. Real tables store each key's hash next to it, so the hash itself is not computed again. With twice the buckets, each key either keeps its index or moves up by 8. In the diagram `pear` and `plum` move, and `plum` no longer collides with `fig`.

A resize is `O(n)`. Like the [dynamic array](/arrays/dynamic-array), the table doubles, so resizes happen rarely enough that inserting stays `O(1)` amortized.

## Open addressing

The other plan for collisions keeps every pair in the array itself, one pair per slot. Python's `dict` uses a form of it.

### Insert with linear probing

<Diagram label="Linear probing: insert fig" cost="O(1) average" :width="640" :height="126" alt="A table with no chains. fig hashes to index 6, which holds plum. The next cells are checked in turn: 7 holds lime, 0 holds pear, and 1 is free, so fig goes there.">
 <DCells :x="64" :y="52" :w="64" :h="38" small :values="['pear', 'fig', 'apple', null, 'kiwi', null, 'plum', 'lime']" :states="{ 6: 'done', 7: 'done', 0: 'done', 1: 'new', 3: 'ghost', 5: 'ghost' }" :marks="{ 6: '1', 7: '2', 0: '3', 1: '4 · free' }" indices />
</Diagram>

1. Hash the key to its home slot.
2. If the slot is empty, put the pair there.
3. If it is taken, try the next slot, wrapping around from the end to the start, until an empty one turns up.

A lookup follows the same trail. It stops when it finds the key, or at an empty slot, which means the key is not there.

### Delete with a tombstone

<Diagram label="Look up fig after deleting lime" cost="O(1) average" :width="640" :height="126" alt="The same table after lime is deleted. Slot 7 now holds a tombstone marked DELETED instead of being empty. The search for fig starts at 6, which holds plum, steps over the tombstone at 7, checks pear at 0 and finds fig at 1.">
 <DCells :x="64" :y="52" :w="64" :h="38" small :values="['pear', 'fig', 'apple', null, 'kiwi', null, 'plum', 'DELETED']" :states="{ 6: 'done', 7: 'ghost', 0: 'done', 1: 'hit', 3: 'ghost', 5: 'ghost' }" :marks="{ 6: '1', 7: '2 · skip', 0: '3', 1: '4 · found' }" indices />
</Diagram>

A delete cannot simply empty the slot. `fig` sits in slot 1 only because slots 6, 7 and 0 were taken when it arrived. If deleting `lime` emptied slot 7, the search for `fig` would stop there and report `fig` missing. So a delete leaves a marker, called a tombstone, in place of the pair.

1. Follow the key's trail to its slot. If the trail reaches an empty slot first, raise `KeyError`.
2. Put the tombstone in the slot and subtract one from `size`.

From then on, a lookup steps over the tombstone and keeps going, and an insert may reuse its slot. The class below uses `simple_hash`, so its slots match the diagrams.

```python
def simple_hash(key):
    return sum(ord(char) for char in key)

DELETED = object()

class LinearProbingTable:
    def __init__(self, capacity=8):  # O(capacity)
        self.slots = [None] * capacity
        self.size = 0

    def _find(self, key):  # O(1) average
        index = simple_hash(key) % len(self.slots)
        for _ in range(len(self.slots)):
            slot = self.slots[index]
            if slot is None:
                return None
            if slot is not DELETED and slot[0] == key:
                return index
            index = (index + 1) % len(self.slots)
        return None

    def set(self, key, value):  # O(1) average
        index = self._find(key)
        if index is None:
            if self.size == len(self.slots):
                raise OverflowError('table is full')
            index = simple_hash(key) % len(self.slots)
            while self.slots[index] not in (None, DELETED):
                index = (index + 1) % len(self.slots)
            self.size += 1
        self.slots[index] = (key, value)

    def get(self, key):  # O(1) average
        index = self._find(key)
        if index is None:
            raise KeyError(key)
        return self.slots[index][1]

    def __contains__(self, key):  # O(1) average
        return self._find(key) is not None

    def delete(self, key):  # O(1) average
        index = self._find(key)
        if index is None:
            raise KeyError(key)
        self.slots[index] = DELETED
        self.size -= 1

    def __len__(self):  # O(1)
        return self.size

table = LinearProbingTable()
for key, value in [('pear', 3), ('apple', 5), ('kiwi', 2), ('plum', 4), ('lime', 1), ('fig', 6)]:
    table.set(key, value)
print(table.get('fig'), len(table))

table.delete('lime')
print(table.get('fig'), 'lime' in table, len(table))

table.slots[7] = None
print('fig' in table)
```

`DELETED` is a plain object that can never be a real pair, and `is` checks for that exact object. `_find` steps over tombstones. `set` first looks for the key, and only when it is missing does it take the first slot on the trail that is empty or a tombstone.

The last lines empty slot 7 by hand, as a delete without tombstones would, and `fig` can no longer be found. This class never grows, to keep it short. A real table resizes as the chaining one does, and since only live pairs are copied, a resize also clears out the tombstones. While the table stays well short of full, each operation costs `O(1)` on average.

## Analysis

Write `α` (alpha) for the load factor: `n` pairs divided by the number of buckets.

With chaining and keys spread evenly, a bucket holds `α` pairs on average. A lookup hashes the key once and scans one chain, so it costs `O(1 + α)` on average. Resizing keeps `α` under 0.75, which makes that `O(1)`. A table that never resized would keep its 8 buckets, `α` would be `n / 8`, and a key lookup would take `O(n)` on average: a fixed number of buckets only divides the work by a constant.

With open addressing each slot holds one pair, so `α` must stay below 1. At `α = 1` the table is full and an insert has nowhere to go. The trails grow long well before that. With linear probing and keys spread evenly, finding a key checks about 1.5 slots on average at `α = 0.5` and about 5.5 at `α = 0.9`. A search for a missing key checks about 2.5 slots against about 50. That is why open-addressing tables resize early.

Linear probing also builds clusters: runs of taken slots. A key whose home is anywhere in a run ends up at the end of it and makes it longer, so long runs grow faster than short ones. In the probing diagram, slots 6, 7, 0, 1 and 2 form one run. The next key whose home is any of those five slots lands in slot 3, which joins the run to `kiwi` in slot 4: seven of the eight slots in one run. Two other probing orders spread the trails out. Quadratic probing tries the slots 1, 4, 9, 16 and so on past the home slot, instead of 1, 2, 3. Double hashing takes the step from a second hash function, so keys that share a home slot still follow different trails.

## Good hash functions

A good hash function gives the same number for the same key every time, spreads different keys evenly over the buckets, and, for text keys, takes both the characters and their order into account. `simple_hash` fails the last two tests. A sum ignores order, so anagrams always collide. It also crowds keys together: a three-letter lowercase word sums to a number from 291 to 366, so in a table of 1,000 buckets those words could use at most 76.

Polynomial hashing fixes the order problem. It reads the characters as the digits of a number in base 31: multiply the value so far by 31, then add the next character code. Each character is multiplied by a different power of 31, so rearranging characters generally changes the hash. Different strings can still collide.

```python
from itertools import permutations

def simple_hash(key):
    return sum(ord(char) for char in key)

def poly_hash(key):
    value = 0
    for char in key:
        value = value * 31 + ord(char)
    return value

for word in ['listen', 'silent', 'enlist']:
    print(word, simple_hash(word), poly_hash(word))

keys = [''.join(letters) for letters in permutations('stop')]
for function in [simple_hash, poly_hash]:
    chains = [0] * 13
    for key in keys:
        chains[function(key) % 13] += 1
    print(function.__name__, chains)
```

The last loop puts the 24 orderings of the letters of `stop` into 13 buckets. With `simple_hash` all 24 share one bucket. `poly_hash` spreads them out, with at most 3 in any bucket.

The 13 is on purpose: it is a prime. With 16 buckets, `% 16` keeps only the lowest four bits of the hash, the lowest bits of this polynomial follow a short repeating pattern, and these 24 keys would crowd into 4 buckets. Real tables either use a prime number of buckets or scramble the bits of the hash first. Python's built-in `hash` mixes every bit of a string thoroughly, which is why the full class below can use 8 and 16 buckets.

## Hashable keys

The full class below hashes keys with Python's built-in `hash` and compares them with `==`. `hash(key)` calls the key's `__hash__` method, and `==` calls `__eq__`. A hash must stay the same for the object’s lifetime. Objects that compare equal must have the same hash. Otherwise two equal keys could land in different buckets, and the table would store the same key twice.

```python
class Tag:
    def __init__(self, name):
        self.name = name

class TagWithEq:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, TagWithEq) and self.name == other.name

print(Tag('red') == Tag('red'))
print(TagWithEq('red') == TagWithEq('red'))

for key in [42, 'fig', (2, 3), [2, 3], Tag('red'), TagWithEq('red')]:
    try:
        hash(key)
        print(type(key).__name__, 'is hashable')
    except TypeError:
        print(type(key).__name__, 'is not hashable')
```

- Strings, numbers and tuples of hashable items are hashable. A `list` is not. It can change after it is stored, and a changed key would sit in the wrong bucket. Use a tuple such as `(2, 3)` instead.
- A class with neither method is hashable by identity. Every object equals only itself, so two `Tag('red')` objects are two different keys.
- Defining `__eq__` alone makes a class unhashable. Python sets its `__hash__` to `None`, because the identity hash would break the rule above. Define `__hash__` as well, from the same fields that `__eq__` compares, for example `return hash((self.x, self.y))`.
- A string’s hash can differ across Python processes because Python normally randomizes the hash seed at startup. Within one run it never changes. That is why the diagrams use `simple_hash`: `hash('fig') % 8` can be a different bucket each time you run the code.

## Full implementation

This class uses chaining and Python's built-in `hash`. Its pairs land in different buckets from the diagrams, and in different buckets on each run, but nothing it prints depends on where they land.

```python
class HashTable:
    def __init__(self, capacity=8):  # O(capacity)
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):  # O(1)
        return self.buckets[hash(key) % len(self.buckets)]

    def set(self, key, value):  # O(1) average, amortized
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self.size += 1
        if self.size > 0.75 * len(self.buckets):
            self._resize()

    def get(self, key):  # O(1) average
        for existing, value in self._bucket(key):
            if existing == key:
                return value
        raise KeyError(key)

    def __contains__(self, key):  # O(1) average
        for existing, value in self._bucket(key):
            if existing == key:
                return True
        return False

    def delete(self, key):  # O(1) average
        bucket = self._bucket(key)
        for i, pair in enumerate(bucket):
            if pair[0] == key:
                del bucket[i]
                self.size -= 1
                return
        raise KeyError(key)

    def __len__(self):  # O(1)
        return self.size

    def _resize(self):  # O(n)
        pairs = [pair for bucket in self.buckets for pair in bucket]
        self.buckets = [[] for _ in range(2 * len(self.buckets))]
        for key, value in pairs:
            self._bucket(key).append([key, value])

prices = HashTable()
for key, value in [('pear', 3), ('apple', 5), ('kiwi', 2), ('plum', 4), ('lime', 1), ('fig', 6)]:
    prices.set(key, value)
print(prices.get('fig'), 'fig' in prices, 'date' in prices)

prices.set('fig', 7)
prices.delete('plum')
print(prices.get('fig'), len(prices))

prices.set('date', 9)
prices.set('guava', 8)
print(len(prices), len(prices.buckets))

try:
    prices.get('plum')
except KeyError as error:
    print('KeyError:', error)
```

Setting `fig` a second time replaced its value without adding a pair. Adding `guava` brought the table to seven pairs, 7/8 is past 0.75, and the table doubled to 16 buckets.

## In Python

Use `dict` and `set` in real code. They are hash tables written in C, with open addressing, and they follow the hashing rules above.

| Operation | Average | Worst |
| --- | --- | --- |
| `d[key]`, `d[key] = value`, `del d[key]` | `O(1)` | `O(n)` |
| `key in d`, `x in s`, `s.add(x)`, `s.discard(x)` | `O(1)` | `O(n)` |
| `len(d)`, `len(s)` | `O(1)` | `O(1)` |
| Loop over or copy a `dict` or `set` | `O(n)` | `O(n)` |

- Set algebra builds a new set. On average `a | b` (union) costs `O(len(a) + len(b))`, `a & b` (intersection) costs `O(min(len(a), len(b)))`, and `a - b` (difference) costs `O(len(a))`.
- `collections.Counter` counts hashable items, and `most_common(k)` returns the `k` most frequent.
- `collections.defaultdict(list)` creates a missing value the first time a key is used. On a plain `dict`, `d.setdefault(key, [])` does the same for one call.
- `d.get(key, default)` returns `default` instead of raising `KeyError`.

```python
from collections import Counter, defaultdict

stock = {'pear': 3, 'apple': 5}
stock['kiwi'] = 2
del stock['pear']
print(stock, 'kiwi' in stock, stock.get('fig', 0))

a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b, a & b, a - b)

words = 'the cat and the hat and the bat'.split()
print(Counter(words).most_common(2))

by_length = defaultdict(list)
for fruit in ['fig', 'kiwi', 'pear', 'apple', 'plum']:
    by_length[len(fruit)].append(fruit)
print(dict(by_length))

same = {}
for fruit in ['fig', 'kiwi', 'pear', 'apple', 'plum']:
    same.setdefault(len(fruit), []).append(fruit)
print(same == by_length)
```

Three traps:

- A `dict` keeps its keys in the order they were added. That is insertion order, not sorted order. A `set` keeps no order at all, and a set of strings can print in a different order on each run. Use `sorted` when the order matters.
- Adding or removing keys while looping over a `dict` raises `RuntimeError`. Loop over `list(d)` instead.
- `{}` is an empty `dict`. An empty set is written `set()`.

## Costs at a glance

| Operation | Average | Worst |
| --- | --- | --- |
| Insert (`set`) | `O(1)` amortized | `O(n)` |
| Look up (`get`, `in`) | `O(1)` | `O(n)` |
| Delete | `O(1)` | `O(n)` |
| Length | `O(1)` | `O(1)` |
| Space | `O(n)` | `O(n)` |

A long chain or probe sequence can make a lookup linear. A suitable hash function and bounded load keep the expected number of probes or comparisons small. See [Analysis](#analysis). Chaining and open addressing both have these costs, as long as the table is never allowed to get too full.

## When to use

Use a hash table whenever you find things by an exact key: counting, remembering what you have already seen, finding a record by its id, saving answers you have computed. In Python that means a `dict` or a `set`. The [graph](/graphs/graph) page keeps each vertex's neighbours in a `dict` for the same reason.

Use something else when:

- You need the keys in order, the smallest key, or every key in a range. A hash table keeps no order by key, so it has to check every key for those. A [binary search tree](/trees/binary-search-tree), kept balanced as an [AVL tree](/trees/avl-tree), or a sorted list with [binary search](/arrays/binary-search), answers them directly.
- The questions are about prefixes, such as every word that starts with `ca`. Use a [trie](/trees/trie).
- The data is small and only ever scanned. A plain `list` is simpler and uses less memory.

[Choosing a Structure](/choosing-a-structure) puts these options side by side.

## Application

Hash tables do most of the everyday lookup work in Python programs.

- Memoization: `functools.cache` keeps a `dict` from arguments to results, so a [recursion](/recursion/recursion#a-recursion-that-branches) that repeats the same calls works each one out once. [Dynamic programming](/algorithm-design/dynamic-programming#top-down-memoization) is built on it.
- De-duplication: `set(items)` drops repeats, and `list(dict.fromkeys(items))` does too while keeping the order in which items first appeared.
- Counting: a `Counter`, or a `dict` from item to count, as in [In Python](#in-python).
- Indexes: a `dict` from an id, or from a word, to the records that contain it. It is built in one pass, and each question after that costs `O(1)` on average.
- Finding pairs, such as two-sum, worked out below.

Two-sum: given a list of numbers and a target, find the positions of two numbers that add up to the target. Checking every pair is `O(n²)`. One pass is enough with a `dict` that maps each number seen so far to its position. For each number, the partner it needs is `target - value`, and the `dict` says in `O(1)` on average whether that partner has appeared.

```python
def two_sum(numbers, target):
    seen = {}
    for i, value in enumerate(numbers):
        partner = target - value
        if partner in seen:
            return seen[partner], i
        seen[value] = i
    return None

numbers = [8, 3, 11, 5, 7]
print(two_sum(numbers, 12))
print(two_sum(numbers, 19))
print(two_sum(numbers, 100))
```

The partner is checked before the current number is stored, so a number is never paired with itself. The whole search is `O(n)` on average and uses `O(n)` extra space.

## Key points

- A hash function turns a key into a bucket index, so a lookup checks one bucket instead of every key. A good one depends on every character and its position.
- Collisions are handled by chaining, a list per bucket, or by open addressing, where a delete must leave a tombstone and the load factor must stay well below 1.
- A lookup costs `O(1 + α)` on average for load factor `α`. Doubling the buckets when `α` passes a limit keeps lookups `O(1)` on average and inserts `O(1)` amortized.
- Equal keys must have equal hashes. Define `__eq__` and `__hash__` together, and use tuples, not lists, as keys.
- Use `dict` and `set` in real code. When you need order by key, use a tree or a sorted list instead.

## Exercise

`Point` works as a key, but only by identity, so the five visits below make five separate entries. Add `__eq__` and `__hash__` so that points with the same coordinates count as the same key.

```python
class HashTable:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):
        return self.buckets[hash(key) % len(self.buckets)]

    def set(self, key, value):
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self.size += 1

    def get(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return value
        raise KeyError(key)

    def __contains__(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return True
        return False

    def __len__(self):
        return self.size

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

visits = HashTable()
for x, y in [(0, 0), (2, 3), (0, 0), (2, 3), (0, 0)]:
    point = Point(x, y)
    if point in visits:
        visits.set(point, visits.get(point) + 1)
    else:
        visits.set(point, 1)
print(len(visits))
print(Point(0, 0) in visits)
```

::: details Solution
`__eq__` compares the coordinates, and `__hash__` hashes the same two values as a tuple. Equal points now have equal hashes, so they land in the same bucket and `set` finds the pair that is already there.

```python
class HashTable:
    def __init__(self, capacity=8):
        self.buckets = [[] for _ in range(capacity)]
        self.size = 0

    def _bucket(self, key):
        return self.buckets[hash(key) % len(self.buckets)]

    def set(self, key, value):
        bucket = self._bucket(key)
        for pair in bucket:
            if pair[0] == key:
                pair[1] = value
                return
        bucket.append([key, value])
        self.size += 1

    def get(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return value
        raise KeyError(key)

    def __contains__(self, key):
        for existing, value in self._bucket(key):
            if existing == key:
                return True
        return False

    def __len__(self):
        return self.size

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return isinstance(other, Point) and self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

visits = HashTable()
for x, y in [(0, 0), (2, 3), (0, 0), (2, 3), (0, 0)]:
    point = Point(x, y)
    if point in visits:
        visits.set(point, visits.get(point) + 1)
    else:
        visits.set(point, 1)
print(len(visits))
print(Point(0, 0) in visits)
```

**Time** `O(n)` on average for `n` visits, since each `in`, `get` and `set` is `O(1)` on average. **Space** `O(n)` in the worst case, when every point is different.
:::
