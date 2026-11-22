---
title: Binary Search Tree
description: "A binary search tree in Python: the ordering rule, search, insert and delete, minimum and maximum, floor and ceiling, range queries, keys with values, why random input stays shallow, a first look at rotations, and bisect as the built-in alternative."
---

# Binary Search Tree

A binary search tree, or BST, gives its values an order. At each node, the left subtree holds smaller values and the right subtree holds larger values. A search follows one branch at a time, so its cost depends on the height of the tree.

**You need:** [Binary Tree](/trees/binary-tree), [Sorted Array and Binary Search](/arrays/binary-search) and [Recursion](/recursion/recursion).

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `search(key)` | Return the node holding `key`, or `None` | `O(h)` |
| `key in tree` | Tell whether `key` is in the tree | `O(h)` |
| `insert(value)` | Add `value`, or do nothing if it is already there | `O(h)` |
| `delete(key)` | Remove `key`, or raise `KeyError` if it is missing | `O(h)` |
| `minimum()`, `maximum()` | Return the smallest or largest value, or raise `IndexError` on an empty tree | `O(h)` |
| `floor(key)`, `ceiling(key)` | Return the largest value `<= key` or the smallest value `>= key`, or `None` if there is none | `O(h)` |
| `between(low, high)` | Return the values from `low` to `high`, both included, in sorted order | `O(h + k)` |
| `len(tree)` | Return the number of values | `O(1)` |
| `iter(tree)` | Go through the values in sorted order | `O(n)` |

`n` is the number of values, `h` is the height of the tree, and `k` is the number of values `between` returns. `h` is about [`log n`](/foundations/measuring-cost#what-log-n-means) when the tree is balanced and `n - 1` when it is a chain, so every `O(h)` above is `O(log n)` at best and `O(n)` at worst.

## The ordering rule

<Diagram label="Anatomy" :width="600" :height="236" alt="A binary search tree with 8 at the root. The left subtree holds 3, 1, 6, 4 and 7, all smaller than 8. The right subtree holds 10, 14 and 13, all larger than 8.">
 <text class="dg-note" x="150" y="36">everything here is smaller than 8</text>
 <text class="dg-note" x="462" y="36">everything here is larger than 8</text>
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" />
</Diagram>

The rule holds at every node, not only at the root. Under 3, the value 1 is on the left and 6, 4 and 7 are on the right.

An [inorder traversal](/trees/binary-tree#depth-first-traversals) of a BST visits the values in sorted order.

## Search

<Diagram label="Search for 7" cost="O(h)" :width="600" :height="236" alt="The search for 7 starts at 8 and goes left, reaches 3 and goes right, reaches 6 and goes right, and finds 7. Four nodes are visited out of nine.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 1: 'done', 4: 'done', 10: 'hit' }" :edges="{ 1: 'accent', 4: 'accent', 10: 'accent' }" :notes="{ 0: '7 < 8', 1: '7 > 3', 4: '7 > 6' }" />
</Diagram>

1. Start at the root.
2. If the key is smaller than the node, go left. If it is larger, go right.
3. Stop when the values match, or when there is nowhere left to go.

```py
def search(self, key):
    node = self.root
    while node is not None and node.value != key:
        node = node.left if key < node.value else node.right
    return node

def __contains__(self, key):
    return self.search(key) is not None
```

`__contains__` is what makes `7 in tree` work.

The cost is `O(h)`, where `h` is the height of the tree. How large `h` gets depends on the order of the inserts, as [shown below](#when-the-tree-goes-out-of-balance).

## Insert

<Diagram label="Insert 9" cost="O(h)" :width="600" :height="236" alt="Inserting 9: it is larger than 8, so go right to 10. It is smaller than 10 and 10 has no left child, so 9 becomes the left child of 10.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, 9, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 2: 'done', 5: 'new' }" :edges="{ 2: 'accent', 5: 'accent' }" :notes="{ 0: '9 > 8', 2: '9 < 10' }" />
</Diagram>

An insert is a search that keeps going until it falls off the tree. The empty spot it reaches is where the new node belongs, so a new value always becomes a leaf.

1. Walk down from the root as in search, remembering the last node passed, the parent.
2. If the value is already in the tree, stop.
3. When the walk falls off the tree, attach a new node to the parent: on the left if the value is smaller, on the right if it is larger.
4. Add one to the count of values.

```py
def insert(self, value):
    parent = None
    node = self.root
    while node is not None:
        if value == node.value:
            return
        parent = node
        node = node.left if value < node.value else node.right
    if parent is None:
        self.root = Node(value)
    elif value < parent.value:
        parent.left = Node(value)
    else:
        parent.right = Node(value)
    self.size += 1
```

The walk is one path down, so insert costs `O(h)`.

This tree keeps one copy of each value: the `return` inside the loop ignores a value that is already there. That is a choice, not a rule. A tree can instead keep a count in each node, or always send equal values to the same side. Whichever it is, search and delete have to follow the same choice.

## Minimum and maximum

<Diagram label="Minimum and maximum" cost="O(h)" :width="600" :height="236" alt="The minimum is found by going left from 8 to 3 to 1, which has no left child. The maximum is found by going right from 8 to 10 to 14, which has no right child. 14 has a left child, 13, but it is smaller and does not matter.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 1: 'done', 3: 'hit', 2: 'done', 6: 'hit' }" :edges="{ 1: 'accent', 3: 'accent', 2: 'accent', 6: 'accent' }" :notes="{ 3: 'minimum', 6: 'maximum' }" />
</Diagram>

Smaller values are always to the left, so the smallest value is where the left links run out.

1. If the tree is empty, there is no minimum: raise `IndexError`.
2. Start at the root and go left while there is a left child.
3. The node where the walk stops holds the smallest value.

```py
def minimum(self):
    if self.root is None:
        raise IndexError('minimum of an empty tree')
    node = self.root
    while node.left is not None:
        node = node.left
    return node.value
```

`maximum` is the mirror image: go right instead. Each follows one path, so both cost `O(h)`.

## Delete

Removing a node depends on how many children it has.

- A leaf is simply removed.
- A node with one child is replaced by that child.
- A node with two children is the hard case, shown below.

<Diagram label="Delete 3, a node with two children" cost="O(h)" :width="600" :height="250" alt="To delete 3, find its in-order successor, the smallest value in its right subtree, which is 4. Copy 4 into the node that held 3, then remove the old 4, which is a leaf.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 1: 'ghost', 9: 'hit' }" :notes="{ 1: 'delete' }" />
 <DArrow :from="[205, 191]" :to="[185, 114]" kind="accent" />
 <text class="dg-note is-accent" x="210" y="240">in-order successor</text>
</Diagram>

A node with two children cannot simply be cut out, because two subtrees would be left hanging. Replace its value instead.

1. Find its in-order successor, the next larger value in the tree. The node has a right subtree, so that is the minimum of the right subtree: go right once, then left as far as possible.
2. Copy the in-order successor's value into the node.
3. Delete the in-order successor from the right subtree. It has no left child, so that is one of the easy cases.

The in-order successor is larger than everything on the left and smaller than everything else on the right, so the ordering rule still holds.

```py
def delete(self, key):
    self.root = self._delete(self.root, key)
    self.size -= 1

def _delete(self, node, key):
    if node is None:
        raise KeyError(key)
    if key < node.value:
        node.left = self._delete(node.left, key)
    elif key > node.value:
        node.right = self._delete(node.right, key)
    elif node.left is None:
        return node.right
    elif node.right is None:
        return node.left
    else:
        successor = node.right
        while successor.left is not None:
            successor = successor.left
        node.value = successor.value
        node.right = self._delete(node.right, successor.value)
    return node
```

`_delete` returns the root of the subtree after the deletion, and the parent stores it. That one trick handles all the re-linking, and it is why delete uses [recursion](/recursion/recursion) where search and insert use a loop.

If the walk falls off the tree, the key is not there and `_delete` raises `KeyError`, like `del` on a missing dictionary key. The exception passes up through every waiting call before any of them stores a result, so the tree and its count stay as they were.

Delete walks one path down to the node and on down to its in-order successor, so it costs `O(h)`.

## Floor and ceiling

<Diagram label="Floor and ceiling of 5" cost="O(h)" :width="600" :height="282" alt="The walk for 5 starts at 8 and goes left, reaches 3 and goes right, reaches 6 and goes left, reaches 4 and goes right, where there is no child, so 5 is not in the tree. The last node where the walk went right is 4, the floor of 5. The last node where it went left is 6, the ceiling of 5.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 1: 'done', 4: 'hit', 9: 'hit' }" :edges="{ 1: 'accent', 4: 'accent', 9: 'accent' }" :notes="{ 0: '5 < 8', 1: '5 > 3', 4: '5 < 6', 9: '5 > 4' }" />
 <text class="dg-note" x="300" y="252">floor(5) is 4, the last node where the walk turned right</text>
 <text class="dg-note" x="300" y="270">ceiling(5) is 6, the last node where it turned left</text>
</Diagram>

A search can remember candidates for the closest value on each side of a key. The **floor** of a key is the largest value less than or equal to it. The **ceiling** is the smallest value greater than or equal to it.

1. Start at the root with no answer yet.
2. If the node equals the key, that is the answer.
3. If the node is smaller than the key, it could be the floor. Remember it, then go right to look for a larger value that still fits.
4. If the node is larger than the key, go left.
5. When the walk falls off the tree, the last value remembered is the floor, or `None` if there is none.

```py
def floor(self, key):
    best = None
    node = self.root
    while node is not None:
        if node.value == key:
            return node.value
        if node.value < key:
            best = node.value
            node = node.right
        else:
            node = node.left
    return best
```

`ceiling` is the mirror image: remember the nodes that are larger than the key, and go left from them. Leave out the equal case and the same walk finds the in-order successor of a key, the next larger value. Both follow one path, so they cost `O(h)`.

## Range query

<Diagram label="Range query from 4 to 10" cost="O(h + k)" :width="600" :height="282" alt="between(4, 10) on the example tree. The walk visits 8, 3, 6, 4, 7 and 10. 3 is visited but lies outside the range. The subtree to the left of 3, holding 1, and the subtree to the right of 10, holding 14 and 13, are skipped because they cannot hold a value from 4 to 10. The result is 4, 6, 7, 8, 10.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'hit', 1: 'done', 2: 'hit', 3: 'muted', 4: 'hit', 6: 'muted', 9: 'hit', 10: 'hit', 13: 'muted' }" :edges="{ 1: 'accent', 2: 'accent', 4: 'accent', 9: 'accent', 10: 'accent', 3: 'muted', 6: 'muted', 13: 'muted' }" :notes="{ 3: 'skipped', 6: 'skipped' }" />
 <text class="dg-note is-accent" x="300" y="252">between(4, 10) returns [4, 6, 7, 8, 10]</text>
 <text class="dg-note" x="300" y="270">filled: in the range · outlined: visited, outside it · grey: skipped</text>
</Diagram>

`between(low, high)` is an inorder walk that skips every subtree that cannot hold a value in the range.

1. If the node is `None`, return.
2. If `low` is smaller than the node, values in the range can be on the left: walk the left subtree.
3. If the node is in the range, add it.
4. If the node is smaller than `high`, values in the range can be on the right: walk the right subtree.

```py
def between(self, low, high):
    values = []
    self._between(self.root, low, high, values)
    return values

def _between(self, node, low, high, values):
    if node is None:
        return
    if low < node.value:
        self._between(node.left, low, high, values)
    if low <= node.value <= high:
        values.append(node.value)
    if node.value < high:
        self._between(node.right, low, high, values)
```

Left, node, right is inorder, so the values come out sorted. Besides the `k` values it returns, the walk only visits nodes on two paths from the root, the one toward `low` and the one toward `high`. It costs `O(h + k)`, where reading the whole tree and filtering would cost `O(n)`.

## Keys and values

The tree so far stores bare values. To use it as a map, like a `dict` that keeps its keys in order, give each node a key and a value. The walks compare keys, and the value rides along.

```py
class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.left = None
        self.right = None

def get(self, key):
    node = self.root
    while node is not None and node.key != key:
        node = node.left if key < node.key else node.right
    if node is None:
        raise KeyError(key)
    return node.value
```

`insert` becomes `set(key, value)`: it walks by key as before, and when the key is already there it replaces the value instead of doing nothing. `delete`, `floor`, `ceiling` and `between` compare `node.key` and can return the value with the key. Lookups cost `O(h)` against a `dict`'s `O(1)` on average, but the map can also say which key comes next, or which keys fall in a range.

## When the tree goes out of balance

<Diagram label="Same values, different shapes" :width="620" :height="236" alt="On the left, the values 1 to 5 inserted in sorted order form a single chain of height 4. On the right, the same values in a balanced tree of height 2.">
 <DGraph :nodes="[{ id: 1, x: 70, y: 30 }, { id: 2, x: 115, y: 72 }, { id: 3, x: 160, y: 114 }, { id: 4, x: 205, y: 156 }, { id: 5, x: 250, y: 198 }]" :edges="[{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }]" />
 <text class="dg-note" x="100" y="204">inserted 1, 2, 3, 4, 5</text><text class="dg-note" x="100" y="220">height 4</text>
 <DTree :x="460" :y="40" :width="200" :values="[3, 2, 5, 1, null, 4]" />
 <text class="dg-note" x="460" y="204">inserted 3, 2, 5, 1, 4</text><text class="dg-note" x="460" y="220">height 2</text>
</Diagram>

The shape of a BST depends on the order of the inserts. Sorted input, in either direction, is the worst case: every value goes to the same side of the last one, and the tree turns into a [degenerate](/trees/binary-tree#tree-shapes) chain, a [linked list](/linked-lists/singly-linked-list) in all but name. Search then costs `O(n)`. A chain causes a second problem in Python: `delete` and the inorder walk on this page are recursive, and Python stops a recursion that goes about 1000 calls deep, so after 1200 sorted inserts they raise `RecursionError`.

Random order is much kinder. The first value inserted becomes the root and stays there. In a random order it is equally likely to be any of the values, so on average it lands near the middle and splits the rest into two parts of reasonable size. The same happens again inside each subtree. It is the reason [quicksort](/sorting/quicksort) with a random pivot is fast on average, with the root playing the pivot. This experiment builds trees from shuffled values, with a fixed seed, and measures them:

```python
import math
import random

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    depth = 1
    node = root
    while True:
        if value < node.value:
            if node.left is None:
                node.left = Node(value)
                return depth
            node = node.left
        else:
            if node.right is None:
                node.right = Node(value)
                return depth
            node = node.right
        depth += 1

random.seed(1)
for n in [100, 1000, 10000]:
    values = list(range(n))
    random.shuffle(values)
    root = Node(values[0])
    depths = [0] + [insert(root, value) for value in values[1:]]
    print(f'n={n}  log n={math.log2(n):.1f}  average depth={sum(depths) / n:.1f}  height={max(depths)}')
```

Each tenfold increase in `n` adds only a few levels. The average depth stays close to `log n`, and the height stays near twice `log n`. So a search in a tree built from random input costs `O(log n)` on [average](/foundations/measuring-cost#best-worst-and-average-case). The same 10,000 values inserted in sorted order would give a height of 9,999.

<Diagram label="A rotation" cost="O(1)" :width="560" :height="214" alt="On the left, 1, 2 and 3 inserted in sorted order form a chain of height 2. Rotating left at 1 lifts its right child, 2, to the top, with 1 as its left child and 3 as its right child. The result has height 1, and read in order it still gives 1, 2, 3.">
 <DGraph :nodes="[{ id: 1, x: 110, y: 40, state: 'done' }, { id: 2, x: 160, y: 96, state: 'done' }, { id: 3, x: 210, y: 152 }]" :edges="[{ from: 1, to: 2 }, { from: 2, to: 3 }]" />
 <text class="dg-note" x="160" y="200">chain: height 2</text>
 <DArrow :from="[260, 96]" :to="[370, 96]" kind="accent" />
 <text class="dg-note is-accent" x="315" y="84">rotate left at 1</text>
 <DTree :x="450" :y="40" :width="160" :gap="56" :values="[2, 1, 3]" :states="{ 0: 'done', 1: 'done' }" :edges="{ 1: 'accent' }" />
 <text class="dg-note" x="450" y="200">after: height 1</text>
</Diagram>

A chain does not have to stay a chain. A **rotation** lifts a child above its parent and moves one subtree across without breaking the ordering rule, and it changes only a few references. Self-balancing trees such as the [AVL tree](/trees/avl-tree) and the red-black tree rotate after inserts and deletes to keep the height `O(log n)` whatever the input order. They are searched exactly like the tree on this page.

## Full implementation

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def __iter__(self):  # O(n)
        values = []
        self._inorder(self.root, values)
        return iter(values)

    def _inorder(self, node, values):  # O(n)
        if node is not None:
            self._inorder(node.left, values)
            values.append(node.value)
            self._inorder(node.right, values)

    def search(self, key):  # O(h)
        node = self.root
        while node is not None and node.value != key:
            node = node.left if key < node.value else node.right
        return node

    def __contains__(self, key):  # O(h)
        return self.search(key) is not None

    def insert(self, value):  # O(h)
        parent = None
        node = self.root
        while node is not None:
            if value == node.value:
                return
            parent = node
            node = node.left if value < node.value else node.right
        if parent is None:
            self.root = Node(value)
        elif value < parent.value:
            parent.left = Node(value)
        else:
            parent.right = Node(value)
        self.size += 1

    def minimum(self):  # O(h)
        if self.root is None:
            raise IndexError('minimum of an empty tree')
        node = self.root
        while node.left is not None:
            node = node.left
        return node.value

    def maximum(self):  # O(h)
        if self.root is None:
            raise IndexError('maximum of an empty tree')
        node = self.root
        while node.right is not None:
            node = node.right
        return node.value

    def delete(self, key):  # O(h)
        self.root = self._delete(self.root, key)
        self.size -= 1

    def _delete(self, node, key):  # O(h)
        if node is None:
            raise KeyError(key)
        if key < node.value:
            node.left = self._delete(node.left, key)
        elif key > node.value:
            node.right = self._delete(node.right, key)
        elif node.left is None:
            return node.right
        elif node.right is None:
            return node.left
        else:
            successor = node.right
            while successor.left is not None:
                successor = successor.left
            node.value = successor.value
            node.right = self._delete(node.right, successor.value)
        return node

    def floor(self, key):  # O(h)
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value < key:
                best = node.value
                node = node.right
            else:
                node = node.left
        return best

    def ceiling(self, key):  # O(h)
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value > key:
                best = node.value
                node = node.left
            else:
                node = node.right
        return best

    def between(self, low, high):  # O(h + k)
        values = []
        self._between(self.root, low, high, values)
        return values

    def _between(self, node, low, high, values):  # O(h + k)
        if node is None:
            return
        if low < node.value:
            self._between(node.left, low, high, values)
        if low <= node.value <= high:
            values.append(node.value)
        if node.value < high:
            self._between(node.right, low, high, values)

tree = BinarySearchTree()
for value in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
    tree.insert(value)
print(list(tree), len(tree))
print(7 in tree, 5 in tree)
print(tree.minimum(), tree.maximum())
print(tree.floor(5), tree.ceiling(5), tree.floor(0))
print(tree.between(4, 10))

tree.insert(9)
tree.delete(3)
print(list(tree), len(tree))
print(tree.root.left.value)
try:
    tree.delete(5)
except KeyError as error:
    print('KeyError:', error)
```

After the delete, `tree.root.left.value` is 4, the in-order successor that took the place of 3.

## In Python

Python's standard library has no search tree. The usual stand-in is a sorted list searched with the [`bisect`](/arrays/binary-search) module. Binary search answers the same questions as the tree's walks: whether a value is there, its floor and ceiling, and where a range of values starts and ends, each in `O(log n)`.

```python
import bisect

values = [1, 3, 4, 6, 7, 8, 10, 13, 14]
bisect.insort(values, 9)
print(values)

key = 5
print('floor', values[bisect.bisect_right(values, key) - 1])
print('ceiling', values[bisect.bisect_left(values, key)])

low = bisect.bisect_left(values, 4)
high = bisect.bisect_right(values, 10)
print(values[low:high])
```

The difference is in changing the data. `insort` finds the place in `O(log n)`, but then shifts every later item one cell to make room, so it costs `O(n)`. Deleting from the middle of a list shifts items the same way. A balanced tree does both in `O(log n)`. Fast inserts and deletes that keep the values in order are what the tree buys.

Two traps with the list version.

- Check the position before you read it. `bisect_right` returns 0 when every item is larger than the key, and reading one place before it, `values[-1]`, gives the last item instead of an error. `bisect_left` returns `len(values)` when every item is smaller, and reading there raises `IndexError`.
- `key in values` does not use binary search. It checks the items one by one, in `O(n)`. Use `bisect_left` and compare the item it points to.

For real code that needs many inserts and ordered queries together, the third-party `sortedcontainers` package provides a `SortedList` built for the job.

## Costs at a glance

Average means a tree built by inserting values in random order. Worst means sorted input, which builds a chain.

| Operation | Average | Worst |
| --- | --- | --- |
| Search, `in` | `O(log n)` | `O(n)` |
| Insert | `O(log n)` | `O(n)` |
| Delete | `O(log n)` | `O(n)` |
| Minimum, maximum | `O(log n)` | `O(n)` |
| Floor, ceiling | `O(log n)` | `O(n)` |
| Range query returning `k` values | `O(log n + k)` | `O(n)` |
| Go through all values in order | `O(n)` | `O(n)` |
| `len` | `O(1)` | `O(1)` |
| Space | `O(n)` | `O(n)` |

Compared with a sorted list:

| Operation | Sorted list with `bisect` | BST, average | BST, worst |
| --- | --- | --- | --- |
| Search, floor, ceiling | `O(log n)` | `O(log n)` | `O(n)` |
| Insert, delete | `O(n)` | `O(log n)` | `O(n)` |
| Minimum, maximum | `O(1)` | `O(log n)` | `O(n)` |
| Range query returning `k` values | `O(log n + k)` | `O(log n + k)` | `O(n)` |
| Space | `O(n)` | `O(n)` | `O(n)` |

A self-balancing tree makes the average column its worst case.

## When to use

Choose a BST when values keep being added and removed and you also need ordered questions answered: the smallest value, the nearest value above or below a key, or all values in a range. A [hash table](/hash-tables/hash-table) finds a key faster, in `O(1)` on average, but it keeps no order and can answer none of those.

- When the data changes rarely, a sorted list with `bisect` is simpler and uses less memory.
- When you only ask whether a key is there, use a `set` or a `dict`.
- When you only ever need the smallest item, use a [heap](/trees/heap).
- When the input may arrive sorted, use a self-balancing tree such as the [AVL tree](/trees/avl-tree), or `sortedcontainers` in Python.

## Application

A meeting room takes one-hour bookings, and a new booking is accepted only if it overlaps none of the bookings already made. When the existing bookings are nonoverlapping, it is enough to check two neighbours: the nearest one that starts at or before it, its floor, and the nearest one that starts at or after it, its ceiling. Two `O(h)` lookups settle the question, however many bookings there are.

The block repeats the parts of the class it needs, so that it runs on its own. Times are minutes after midnight, so 540 is 9:00.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        parent = None
        node = self.root
        while node is not None:
            if value == node.value:
                return
            parent = node
            node = node.left if value < node.value else node.right
        if parent is None:
            self.root = Node(value)
        elif value < parent.value:
            parent.left = Node(value)
        else:
            parent.right = Node(value)

    def floor(self, key):
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value < key:
                best = node.value
                node = node.right
            else:
                node = node.left
        return best

    def ceiling(self, key):
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value > key:
                best = node.value
                node = node.left
            else:
                node = node.right
        return best

def book(calendar, start, length=60):
    before = calendar.floor(start)
    after = calendar.ceiling(start)
    if before is not None and start < before + length:
        return False
    if after is not None and after < start + length:
        return False
    calendar.insert(start)
    return True

calendar = BinarySearchTree()
for start in [540, 660, 600, 570, 720, 690]:
    print(f'{start // 60}:{start % 60:02}', book(calendar, start))
```

9:30 is refused because the 9:00 meeting is still running, and 11:30 because of the one at 11:00.

## Key points

- Every node has smaller values on its left and larger values on its right, so an inorder walk gives them in sorted order.
- Search, insert, delete, minimum, maximum, floor and ceiling each follow one path down, so they cost `O(h)`.
- `h` is `O(log n)` on average for random input but `n - 1` for sorted input. Self-balancing trees prevent the chain with rotations.
- With a value stored next to each key, a BST is an ordered map. It answers questions a hash table cannot, such as the nearest key or all keys in a range.
- In Python, a sorted list with `bisect` searches just as fast, but each insert or delete costs `O(n)`.

## Exercise

Write `is_valid`, which tells whether a tree follows the ordering rule at every node, with no value stored twice. Comparing each node only with its two children is not enough: the second tree passes that check.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def is_valid(node):
    pass

good = Node(8, Node(3, Node(1), Node(6, Node(4), Node(7))), Node(10, None, Node(14, Node(13))))
bad = Node(8, Node(3, Node(1), Node(9)), Node(10))
print(is_valid(good), is_valid(bad))
print(is_valid(Node(5, Node(5))), is_valid(None))
```

::: details Solution
In the second tree, 9 is larger than its parent 3, but it sits in the left subtree of 8, so it must also be smaller than 8. A node has to fall between bounds set by all of its ancestors, not only its parent. Pass the bounds down: going left, the node's value becomes the upper bound, and going right, it becomes the lower bound. The root has no bounds, and an empty tree is valid.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def is_valid(node, low=None, high=None):
    if node is None:
        return True
    if low is not None and node.value <= low:
        return False
    if high is not None and node.value >= high:
        return False
    return is_valid(node.left, low, node.value) and is_valid(node.right, node.value, high)

good = Node(8, Node(3, Node(1), Node(6, Node(4), Node(7))), Node(10, None, Node(14, Node(13))))
bad = Node(8, Node(3, Node(1), Node(9)), Node(10))
print(is_valid(good), is_valid(bad))
print(is_valid(Node(5, Node(5))), is_valid(None))
```

**Time** `O(n)`. **Space** `O(h)` for the recursion.
:::
