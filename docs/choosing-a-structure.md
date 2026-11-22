---
title: Choosing a Structure
description: "How to choose a data structure in Python: start from the operations you need, compare the costs of every structure in one table, and pick the right built-in."
---

# Choosing a Structure

Start with what the program needs to do. A collection that supports fast lookup by key may have very different costs from one that repeatedly hands out its smallest item. The comparisons below show how to choose for the operations your program uses.

**You need:** [Measuring Cost](/foundations/measuring-cost). Every structure named below links to its own page.

## Start from the operations you need

Every structure is fast at some operations and slow at others, and none is fast at everything. So the choice starts from the program, not from the structures.

1. List what the program does with the collection: add, remove, look up by key, read by position, find the smallest, visit everything in sorted order.
2. Mark the operations that run often, usually the ones inside a loop. Those must be cheap. An operation that runs once can afford to be slow.
3. Decide which order the items need: the order they arrived in, sorted order, or none at all.
4. Look in the table below for the structures whose cheap operations cover everything you marked. If several fit, take the simplest one, which in Python is usually a built-in.

For example, a to-do list that always works on the most urgent task next adds tasks often and removes the most urgent one often. It never searches, and it never needs the whole list in order. A [heap](/trees/heap) does both frequent operations in `O(log n)`. An unsorted list would make every removal `O(n)`, and a sorted list would make every add `O(n)`.

## Costs by structure

| Structure | By position | Search | Insert | Delete | Smallest | Sorted walk |
| --- | --- | --- | --- | --- | --- | --- |
| [Array](/arrays/array), [`list`](/arrays/dynamic-array) | `O(1)` | `O(n)` | `O(1)` [amortized](/arrays/dynamic-array) at the end, `O(n)` elsewhere | `O(1)` amortized at the end, `O(n)` elsewhere | `O(n)` | `O(n log n)` |
| [Sorted array](/arrays/binary-search) | `O(1)` | `O(log n)` | `O(n)` | `O(n)` | `O(1)` | `O(n)` |
| [Linked list](/linked-lists/singly-linked-list) | `O(n)` | `O(n)` | `O(1)` next to a node you hold | `O(1)` at a node you hold | `O(n)` | `O(n log n)` |
| [Stack](/stacks-queues/stack) | top only, `O(1)` | no | `O(1)` amortized, on top | `O(1)` amortized, from the top with a list | no | no |
| [Queue](/stacks-queues/queue), `deque` | `O(1)` at the ends, `O(n)` in the middle | `O(n)` | `O(1)` at either end | `O(1)` at either end | `O(n)` | `O(n log n)` |
| [Hash table](/hash-tables/hash-table), `dict`, `set` | no | `O(1)` average, `O(n)` worst | `O(1)` average, `O(n)` worst | `O(1)` average, `O(n)` worst | `O(n)` | `O(n log n)` |
| [Binary search tree](/trees/binary-search-tree) | no | `O(log n)` average, `O(n)` worst | `O(log n)` average, `O(n)` worst | `O(log n)` average, `O(n)` worst | `O(log n)` average, `O(n)` worst | `O(n)` |
| [AVL tree](/trees/avl-tree), balanced | no | `O(log n)` | `O(log n)` | `O(log n)` | `O(log n)` | `O(n)` |
| [Heap](/trees/heap) | no | `O(n)` | `O(log n)` amortized | `O(log n)` amortized, smallest only | `O(1)` | `O(n log n)` |
| [Trie](/trees/trie) | no | `O(m)` | `O(m)` | `O(m)` | no | `O(n · m)` |

`n` is the number of items and `m` the length of a word. A cost is the worst case unless the cell says otherwise. Sorted walk means visiting every item in sorted order, including any sorting needed first.

- For a hash table, average assumes a good hash function, and the worst case can arise from a long chain or probe sequence. Inserts are also amortized: now and then the table grows and every key moves to a new bucket.
- For a binary search tree, average means values inserted in random order, and worst means sorted input, which builds a chain. A balanced tree such as an AVL tree keeps its height logarithmic even on sorted input.
- A node you hold means the code already has a reference to it, the head for example. A singly linked list can remove the node after it. A doubly linked list can remove the node itself.
- A cell that says no means the structure does not offer the operation. You would have to take the items out first.
- Every structure here takes `O(n)` space, except the trie, which can need one node per letter: `O(n · m)`. The constants differ too. A linked-list or tree node is a separate Python object, many times the size of one `list` cell.

A trie's own speciality is not in the table: it reaches every word that starts with a prefix in `O(m)`, plus the time to list them.

## Counting the difference

A cost table is easy to read and easy to doubt. Counting steps makes it concrete. This program takes the smallest item out of `n` items until none are left, once from a plain `list` with `min` and `remove`, once with `heapq`. Every item is wrapped in a class that counts how many times `<` is called.

```python
import heapq

class Counted:
    comparisons = 0

    def __init__(self, value):
        self.value = value

    def __lt__(self, other):
        Counted.comparisons += 1
        return self.value < other.value

def smallest_first_list(items):
    items = list(items)
    order = []
    while items:
        smallest = min(items)
        items.remove(smallest)
        order.append(smallest.value)
    return order

def smallest_first_heap(items):
    items = list(items)
    heapq.heapify(items)
    order = []
    while items:
        order.append(heapq.heappop(items).value)
    return order

for n in [1000, 2000]:
    values = [Counted(i * 37 % n) for i in range(n)]
    Counted.comparisons = 0
    smallest_first_list(values)
    with_list = Counted.comparisons
    Counted.comparisons = 0
    smallest_first_heap(values)
    with_heap = Counted.comparisons
    print(n, 'items:', with_list, 'with a list,', with_heap, 'with a heap')
```

`i * 37 % n` puts the numbers 0 to `n - 1` in a mixed-up order without `random`, so every run prints the same counts.

`min` looks at every item that is left, so the list makes about `n²/2` comparisons: 499,500 for 1,000 items. The heap needs about 10,000. Doubling `n` multiplies the list's count by four and only a little more than doubles the heap's, as `O(n²)` against `O(n log n)` predicts. The list's real cost is even higher, because `remove` searches the list again using `==`, which this counter does not see.

## Which built-in to use

| Need | Use | Why |
| --- | --- | --- |
| A sequence you index and append to | `list` | A [dynamic array](/arrays/dynamic-array): `O(1)` by index, `O(1)` amortized `append` and `pop()` |
| Add and remove at both ends, as in a queue | `collections.deque` | `O(1)` at either end, where `list.pop(0)` is `O(n)` |
| Look up a value by its key | `dict` | A [hash table](/hash-tables/hash-table): `O(1)` on average |
| Membership tests, removing duplicates | `set` | A hash table of keys only, with union, intersection and difference built in |
| Count how often each item appears | `collections.Counter` | A `dict` of counts; `most_common(k)` returns the top `k` |
| Group items under a key | `collections.defaultdict(list)` | A missing key starts as an empty list, so there is no check before `append` |
| Take out the smallest item again and again | `heapq` | A min-[heap](/trees/heap) kept in a plain list: `O(log n)` push and pop |
| Keep a list sorted, find the nearest value, count a range | `bisect` | [Binary search](/arrays/binary-search) on a sorted list in `O(log n)`; `insort` is `O(n)` because it shifts |
| Store many numbers of one type | `array.array` | Holds the values themselves instead of references to objects, so it uses much less memory |
| Run tasks in dependency order | `graphlib.TopologicalSorter` | A [topological sort](/graphs/topological-sort) that raises `CycleError` when there is a cycle |
| Remember the results of a function | `functools.cache`, `functools.lru_cache` | [Memoization](/algorithm-design/dynamic-programming) in a hash table; `lru_cache(maxsize=k)` keeps only the `k` most recently used |
| Keys in insertion order that you reorder | `collections.OrderedDict` | `move_to_end` and `popitem(last=False)` in `O(1)`, the two moves of a least-recently-used cache |

A plain `dict` also keeps its keys in insertion order. `OrderedDict` adds the cheap reordering.

## I need to...

### Find the smallest item again and again

Use a [heap](/trees/heap) through `heapq`. Reading the smallest item is `O(1)`, and adding or removing one takes amortized `O(log n)` with a list-backed heap. If no new items arrive, sorting once and walking the sorted list does the same job.

### Check whether I have already seen something

Use a `set`: `x in seen` is `O(1)` on average. On a list it is `O(n)`, and a loop that checks a list on every pass becomes `O(n²)`. The [hash table](/hash-tables/hash-table) page shows why the set is fast.

### Keep items sorted while inserting

Start with a sorted list and `bisect.insort`. Finding the place is `O(log n)`, and the shift that makes room is `O(n)`, but the shift is a fast copy done in C. When inserts and deletes on a large collection are the bottleneck, a balanced tree such as an [AVL tree](/trees/avl-tree) gives logarithmic search, insertion, and deletion. Reporting a range also takes time proportional to the number of values reported. See [Sorted Array and Binary Search](/arrays/binary-search).

### Suggest words as the user types

A [trie](/trees/trie) reaches the typed prefix in `O(m)`, and the words below that node are the suggestions. For a word list that does not change, a sorted list also works: `bisect_left(words, prefix)` finds the first word at or after the prefix in `O(log n)`, and all the matches follow it.

### Find the shortest route

When every step costs the same, breadth-first search with a `deque` finds the route in `O(V + E)` for `V` places and `E` connections: see [Graph](/graphs/graph). When steps have different lengths, use Dijkstra's algorithm with `heapq`: see [Shortest Paths](/graphs/shortest-paths).

### Group items that are connected

Use [union-find](/graphs/union-find). It merges two groups and tells whether two items share a group in `O(α(n))` amortized, which is effectively constant, and it works while the connections are still arriving. When the whole graph is known up front, a breadth-first or depth-first search labels every group in `O(V + E)`.

### Undo the last action

Push each action on a [stack](/stacks-queues/stack), and undo pops the newest one. A `list` with `append` and `pop()` is the stack.

### Handle requests in the order they arrived

Use a [queue](/stacks-queues/queue): `collections.deque` with `append` to add and `popleft` to take the oldest.

## A decision chart

Follow the questions from the top. The first yes gives the structure.

<Diagram label="Which structure?" :width="680" :height="360" alt="A chart of four questions in a column, each with a yes arrow to the right and a no arrow down to the next question. Only ever take out the smallest? Yes: a heap, with heapq. No: need sorted order or ranges? Yes: a sorted list with bisect, or an AVL tree. No: look items up by key? Yes: a hash table, dict or set. No: add and remove only at the ends? Yes: a stack or a queue, list or deque. No: an array, list.">
 <DBox :x="20" :y="20" :w="300" :h="40" text="Only ever take out the smallest?" small />
 <DBox :x="20" :y="90" :w="300" :h="40" text="Need sorted order or ranges?" small />
 <DBox :x="20" :y="160" :w="300" :h="40" text="Look items up by key?" small />
 <DBox :x="20" :y="230" :w="300" :h="40" text="Add and remove only at the ends?" small />
 <DBox :x="390" :y="20" :w="270" :h="40" text="Heap: heapq" state="hit" small />
 <DBox :x="390" :y="90" :w="270" :h="40" text="Sorted list with bisect, or AVL tree" state="hit" small />
 <DBox :x="390" :y="160" :w="270" :h="40" text="Hash table: dict or set" state="hit" small />
 <DBox :x="390" :y="230" :w="270" :h="40" text="Stack or queue: list or deque" state="hit" small />
 <DBox :x="390" :y="300" :w="270" :h="40" text="Array: list" state="hit" small />
 <DArrow v-for="y in [20, 90, 160, 230]" :key="y" :from="[320, y + 20]" :to="[390, y + 20]" kind="accent" />
 <text v-for="y in [20, 90, 160, 230]" :key="y" class="dg-note is-accent" x="355" :y="y + 13">yes</text>
 <DArrow v-for="y in [20, 90, 160]" :key="y" :from="[170, y + 40]" :to="[170, y + 70]" />
 <text v-for="y in [20, 90, 160]" :key="y" class="dg-note start" x="178" :y="y + 59">no</text>
 <DArrow :from="[170, 270]" :via="[[170, 320]]" :to="[390, 320]" />
 <text class="dg-note start" x="178" y="291">no</text>
</Diagram>

For the sorted case, start with the list and move to a balanced tree only when inserts on a large collection become the slow part.

Two kinds of data fall outside the chart. Words searched by prefix belong in a [trie](/trees/trie). Things joined by links, such as roads, friendships or tasks that depend on each other, form a [graph](/graphs/graph).

## Key points

- Choose by the operations your program repeats most. No structure is fast at everything.
- Check average against worst: a hash table is `O(1)` on average but `O(n)` at worst, and a plain binary search tree is `O(n)` on sorted input where a balanced one stays `O(log n)`.
- Keeping items sorted costs something on every insert, so pay for it only when you need the order.
- In Python, start with the built-ins: `list`, `deque`, `dict`, `set`, `heapq` and `bisect` cover most programs.
- When unsure, count the steps for `n` and `2n` items and watch how the count grows.
