---
title: AVL Tree
description: "An AVL tree in Python: the height-balance rule, balance factors, the four rotation cases, insert with rebalancing, and why the height stays close to log n."
---

# AVL Tree

Inserting values in sorted order can turn a plain [binary search tree](/trees/binary-search-tree) into a chain. An AVL tree prevents this by keeping the heights of the two subtrees at each node within one level of each other. Rotations restore that rule after insertion or deletion, which keeps the height logarithmic.

**You need:** [Binary Search Tree](/trees/binary-search-tree) and [Recursion](/recursion/recursion).

## Interface

The `AVLTree` class on this page keeps a set of values in a balanced binary search tree. Inserting a value that is already there does nothing. For a tree `tree`:

| Operation | What it does | Cost |
| --- | --- | --- |
| `tree.insert(value)` | Add `value`, then rebalance | `O(log n)` |
| `value in tree` | Tell whether `value` is in the tree | `O(log n)` |
| `len(tree)` | Return the number of values | `O(1)` |
| `for value in tree` | Visit the values in sorted order | `O(n)` |

`n` is the number of values. Each cost is the worst case. On a plain binary search tree the first two are `O(n)` in the worst case, and fixing that is the whole point of this page. Delete is described below but not implemented.

## Height and balance

Every node stores one extra number, its height: the number of edges on the longest path from the node down to a leaf. A leaf has height 0. An empty subtree counts as -1, as on the [binary tree](/trees/binary-tree) page, so a leaf comes out as `1 + max(-1, -1) = 0`.

The **balance factor** of a node is the height of its left subtree minus the height of its right subtree. A positive balance factor means the left side is taller.

The AVL rule: at every node, the balance factor is -1, 0 or +1. In words, the two subtrees of any node differ in height by at most one.

<Diagram label="Balance factor beside each node" :width="700" :height="268" alt="Two binary search trees with the balance factor written beside each node. The left tree has 5 at the root, 3 and 8 below it, 2 and 4 under 3, 9 under 8, and 1 under 2. Every balance factor is -1, 0 or +1, so it is an AVL tree. The right tree has 5 at the root, a chain 3, 2, 1 going left and a chain 7, 8, 9 going right. The root is at 0, but 3 is at +2 and 7 is at -2, so it is not an AVL tree.">
 <DTree :x="175" :y="40" :width="280" :gap="52" :values="[5, 3, 8, 2, 4, null, 9, 1]" :notes="{ 0: '+1', 1: '+1', 2: '-1', 3: '+1', 4: '0', 6: '0', 7: '0' }" />
 <DTree :x="525" :y="40" :width="280" :gap="52" :values="[5, 3, 7, 2, null, null, 8, 1, null, null, null, null, null, null, 9]" :states="{ 1: 'hit', 2: 'hit' }" :notes="{ 0: '0', 1: '+2', 2: '-2', 3: '+1', 6: '-1', 7: '0', 14: '0' }" />
 <text class="dg-label" x="175" y="240">AVL tree</text>
 <text class="dg-note" x="175" y="258">every node is at -1, 0 or +1</text>
 <text class="dg-label" x="525" y="240">not an AVL tree</text>
 <text class="dg-note" x="525" y="258">filled: 3 is at +2 and 7 is at -2</text>
</Diagram>

The left tree is not perfectly balanced: 2 has a child on the left and none on the right. The rule allows that. The right tree shows why the rule has to hold at every node and not only at the root. Its root is at 0, with subtrees of height 2 on both sides, and yet each side is a chain.

Allowing a difference of one keeps the rule cheap to maintain, and it is still enough. An AVL tree with `n` values is never taller than about `1.44 log n`. The proof counts the fewest nodes an AVL tree of each height can have, and it is left out here. In numbers:

| Values | Plain BST, worst height | AVL tree, worst height | Lowest possible height |
| --- | --- | --- | --- |
| 1,000 | 999 | 13 | 9 |
| 1,000,000 | 999,999 | 27 | 19 |

A search visits at most one node per level, so these heights are also the step counts, give or take one.

## Rotations

When a node breaks the rule, a **rotation** repairs it. A rotation lifts a child above its parent and keeps the values in binary search tree order.

<Diagram label="Two rotations" cost="O(1)" :width="640" :height="212" alt="Two trees that turn into each other. On the left, 5 is at the top. Its left child is 3, with children 2 and 4, and its right child is 6. Rotating right at 5 lifts 3 to the top: 3 has left child 2 and right child 5, and 5 has children 4 and 6. Rotating left at 3 turns the right tree back into the left one. 4 is the only node that changes parent. Read in order, both trees give 2, 3, 4, 5, 6.">
 <DTree :x="150" :y="40" :width="220" :gap="56" :values="[5, 3, 6, 2, 4]" :states="{ 0: 'done', 1: 'done' }" :edges="{ 1: 'accent', 4: 'accent' }" />
 <DArrow :from="[270, 80]" :to="[370, 80]" kind="accent" />
 <text class="dg-note is-accent" x="320" y="70">rotate right at 5</text>
 <DArrow :from="[370, 116]" :to="[270, 116]" kind="accent" />
 <text class="dg-note is-accent" x="320" y="136">rotate left at 3</text>
 <DTree :x="490" :y="40" :width="220" :gap="56" :values="[3, 2, 5, null, null, 4, 6]" :states="{ 0: 'done', 2: 'done' }" :edges="{ 2: 'accent', 5: 'accent' }" />
 <text class="dg-note" x="320" y="198">in order, both trees read 2, 3, 4, 5, 6</text>
</Diagram>

Rotating right at 5:

1. Its left child, 3, will be the new top of this subtree.
2. 3's right subtree, here just 4, moves across to become 5's left subtree. Everything in it is larger than 3 and smaller than 5, so the order still holds there.
3. 5 becomes the right child of 3.
4. Recompute the heights: first 5, which is now lower, then 3.

Rotating left is the mirror image, and it turns the right tree back into the left one. In the drawing 2, 4 and 6 are single nodes, but each could be a whole subtree. Subtrees move as units.

```py
def _rotate_right(self, node):
    child = node.left
    node.left = child.right
    child.right = node
    self._update(node)
    self._update(child)
    return child

def _rotate_left(self, node):
    child = node.right
    node.right = child.left
    child.left = node
    self._update(node)
    self._update(child)
    return child
```

Each method returns the new top of the subtree, and the caller stores it in place of the old top, the same trick the binary search tree uses for delete. Three [references](/foundations/references) change: the two in the method and the one from the parent. So a rotation costs `O(1)`, however large the subtrees are.

These helpers read and update the heights:

```py
def _height(self, node):
    return -1 if node is None else node.height

def _balance(self, node):
    return self._height(node.left) - self._height(node.right)

def _update(self, node):
    node.height = 1 + max(self._height(node.left), self._height(node.right))
```

## The four cases

After an insert, one node can end up at +2 or -2. The repair depends on which way the new value went at that node, and then which way at its child. The child's balance factor tells you the second direction.

| Case | Node | Its taller child | Repair |
| --- | --- | --- | --- |
| Left-left | +2 | +1 | Rotate right at the node |
| Right-right | -2 | -1 | Rotate left at the node |
| Left-right | +2 | -1 | Rotate left at the child, then right at the node |
| Right-left | -2 | +1 | Rotate right at the child, then left at the node |

The smallest example of each case is three values inserted in a bad order. 1, 2 and 3 always end up as the same tree, with 2 on top. When the two signs match, the three values form a straight line and one rotation fixes it.

<Diagram label="Left-left: insert 3, 2, 1" cost="O(1)" :width="560" :height="168" alt="Inserting 3, 2 and 1 makes a chain going left. 3 is at +2 and its left child 2 is at +1, both leaning left. One rotation right at 3 lifts 2 to the top, with 1 on its left and 3 on its right.">
 <DTree :x="150" :y="36" :width="160" :gap="50" :values="[3, 2, null, 1]" :states="{ 3: 'new' }" :notes="{ 0: '+2', 1: '+1' }" />
 <DArrow :from="[230, 70]" :to="[330, 70]" kind="accent" />
 <text class="dg-note is-accent" x="280" y="60">rotate right at 3</text>
 <DTree :x="410" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 1: 'new' }" :edges="{ 2: 'accent' }" />
</Diagram>

<Diagram label="Right-right: insert 1, 2, 3" cost="O(1)" :width="560" :height="168" alt="Inserting 1, 2 and 3 makes a chain going right. 1 is at -2 and its right child 2 is at -1, both leaning right. One rotation left at 1 lifts 2 to the top, with 1 on its left and 3 on its right.">
 <DTree :x="150" :y="36" :width="160" :gap="50" :values="[1, null, 2, null, null, null, 3]" :states="{ 6: 'new' }" :notes="{ 0: '-2', 2: '-1' }" />
 <DArrow :from="[250, 70]" :to="[350, 70]" kind="accent" />
 <text class="dg-note is-accent" x="300" y="60">rotate left at 1</text>
 <DTree :x="430" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 2: 'new' }" :edges="{ 1: 'accent' }" />
</Diagram>

When the signs differ, the values zig-zag. A single rotation at the top would only flip the zig-zag to the other side. The first rotation, at the child, straightens it into a line, and the second rotation fixes the line.

<Diagram label="Left-right: insert 3, 1, 2" cost="O(1)" :width="700" :height="168" alt="Inserting 3, 1 and 2 makes a zig-zag: 3 is at +2, but its left child 1 is at -1, because 2 went to the right of 1. A rotation left at 1 straightens it into a chain 3, 2, 1 going left, which is the left-left case. A rotation right at 3 then puts 2 on top, with 1 and 3 below it.">
 <DTree :x="110" :y="36" :width="160" :gap="50" :values="[3, 1, null, null, 2]" :states="{ 4: 'new' }" :notes="{ 0: '+2', 1: '-1' }" />
 <DArrow :from="[160, 70]" :to="[260, 70]" kind="accent" />
 <text class="dg-note is-accent" x="210" y="60">rotate left at 1</text>
 <DTree :x="350" :y="36" :width="160" :gap="50" :values="[3, 2, null, 1]" :states="{ 1: 'new' }" :edges="{ 1: 'accent', 3: 'accent' }" :notes="{ 0: '+2', 1: '+1' }" />
 <DArrow :from="[405, 70]" :to="[505, 70]" kind="accent" />
 <text class="dg-note is-accent" x="455" y="60">rotate right at 3</text>
 <DTree :x="600" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 0: 'new' }" :edges="{ 2: 'accent' }" />
</Diagram>

<Diagram label="Right-left: insert 1, 3, 2" cost="O(1)" :width="700" :height="168" alt="Inserting 1, 3 and 2 makes a zig-zag: 1 is at -2, but its right child 3 is at +1, because 2 went to the left of 3. A rotation right at 3 straightens it into a chain 1, 2, 3 going right, which is the right-right case. A rotation left at 1 then puts 2 on top, with 1 and 3 below it.">
 <DTree :x="110" :y="36" :width="160" :gap="50" :values="[1, null, 3, null, null, 2]" :states="{ 5: 'new' }" :notes="{ 0: '-2', 2: '+1' }" />
 <DArrow :from="[200, 70]" :to="[290, 70]" kind="accent" />
 <text class="dg-note is-accent" x="245" y="60">rotate right at 3</text>
 <DTree :x="350" :y="36" :width="160" :gap="50" :values="[1, null, 2, null, null, null, 3]" :states="{ 2: 'new' }" :edges="{ 2: 'accent', 6: 'accent' }" :notes="{ 0: '-2', 2: '-1' }" />
 <DArrow :from="[440, 70]" :to="[530, 70]" kind="accent" />
 <text class="dg-note is-accent" x="485" y="60">rotate left at 1</text>
 <DTree :x="600" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 0: 'new' }" :edges="{ 1: 'accent' }" />
</Diagram>

`_rebalance` updates a node's height, checks its balance factor and applies the repair for its case:

```py
def _rebalance(self, node):
    self._update(node)
    balance = self._balance(node)
    if balance > 1:
        if self._balance(node.left) < 0:
            node.left = self._rotate_left(node.left)
        return self._rotate_right(node)
    if balance < -1:
        if self._balance(node.right) > 0:
            node.right = self._rotate_right(node.right)
        return self._rotate_left(node)
    return node
```

`balance > 1` covers left-left and left-right. The inner test spots left-right by the child's negative balance factor and straightens it first. The second half is the mirror image. A node that obeys the rule is returned unchanged.

## Insert

<Diagram label="Insert 6" cost="O(log n)" :width="700" :height="250" alt="On the left, 6 has just been added as the right child of 5, below 4, below the root 2. The path 2, 4, 5, 6 is highlighted. On the way back up, 5 is at -1 and 4 is at -1, which are allowed, and the root 2 is at -2. On the right, after a rotation left at 2: 4 is the root, 2 is its left child with children 1 and 3, and 5 is its right child with right child 6. The tree has height 2, as it had before the insert.">
 <DTree :x="160" :y="40" :width="280" :gap="52" :values="[2, 1, 4, null, null, 3, 5, null, null, null, null, null, null, null, 6]" :states="{ 14: 'new' }" :edges="{ 2: 'accent', 6: 'accent', 14: 'accent' }" :notes="{ 0: '-2', 2: '-1', 6: '-1' }" />
 <DArrow :from="[325, 100]" :to="[410, 100]" kind="accent" />
 <text class="dg-note is-accent" x="367" y="90">rotate left at 2</text>
 <DTree :x="540" :y="40" :width="280" :gap="52" :values="[4, 2, 5, 1, 3, null, 6]" :states="{ 6: 'new' }" :edges="{ 1: 'accent', 4: 'accent' }" />
 <text class="dg-note" x="160" y="238">6 added, the root 2 is out of balance</text>
 <text class="dg-note" x="540" y="238">repaired, height 2 as before</text>
</Diagram>

Insert has two halves. Going down is a binary search tree insert. Coming back up does the balancing.

1. Compare and go left or right until there is no child, then attach the value there as a new leaf.
2. Return up the path. At each node, recompute its height from its children.
3. If the node's balance factor is now +2 or -2, repair it with the rotation for its case. The parent stores whatever node comes back as the new top of that subtree.

In the drawing, 6 goes down past 2, 4 and 5 and becomes the right child of 5. On the way back, 5 is at -1 and 4 is at -1, both allowed. The root 2 is at -2 and its right child 4 is at -1, the right-right case. Rotating left at 2 lifts 4 to the root, and 3 moves across to become the right child of 2.

```py
def insert(self, value):
    if value in self:
        return
    self.root = self._insert(self.root, value)
    self.size += 1

def _insert(self, node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = self._insert(node.left, value)
    else:
        node.right = self._insert(node.right, value)
    return self._rebalance(node)
```

[Recursion](/recursion/recursion) does the walking back. The `return self._rebalance(node)` line runs as each call finishes, from the new leaf up to the root, which is exactly the order the heights have to be updated in. `insert` checks for the value first, so a value that is already there changes neither the tree nor the count.

A repaired subtree is as tall as it was before the insert, so no node above it goes out of balance. An insert therefore needs at most one repair, of one or two rotations. Going down and coming back up each take `O(h)` steps, where `h` is the height, and `h` stays under about `1.44 log n`. Insert costs `O(log n)`.

## Sorted input, step by step

Here is the input that ruins a plain binary search tree: 1 to 7, in order.

| Insert | Node at -2 | Repair | Root after |
| --- | --- | --- | --- |
| 1 | none | none | 1 |
| 2 | none | none | 1 |
| 3 | 1 | rotate left at 1 | 2 |
| 4 | none | none | 2 |
| 5 | 3 | rotate left at 3 | 2 |
| 6 | 2 | rotate left at 2 | 4 |
| 7 | 5 | rotate left at 5 | 4 |

<Diagram label="Inserting 1 to 7 in order" :width="700" :height="214" alt="The tree at three moments. After 1, 2 and 3: 2 at the root with children 1 and 3, height 1. After 4 and 5: 2 at the root, 1 on its left, 4 on its right with children 3 and 5, height 2. After 6 and 7: 4 at the root, 2 with children 1 and 3 on the left, 6 with children 5 and 7 on the right, height 2. The value inserted last is highlighted each time.">
 <DTree :x="120" :y="36" :width="200" :gap="50" :values="[2, 1, 3]" :states="{ 2: 'new' }" />
 <DTree :x="350" :y="36" :width="200" :gap="50" :values="[2, 1, 4, null, null, 3, 5]" :states="{ 6: 'new' }" />
 <DTree :x="580" :y="36" :width="200" :gap="50" :values="[4, 2, 6, 1, 3, 5, 7]" :states="{ 6: 'new' }" />
 <text class="dg-label" x="120" y="184">after 3</text><text class="dg-note" x="120" y="202">height 1</text>
 <text class="dg-label" x="350" y="184">after 5</text><text class="dg-note" x="350" y="202">height 2</text>
 <text class="dg-label" x="580" y="184">after 7</text><text class="dg-note" x="580" y="202">height 2</text>
</Diagram>

Sorted values always land at the far right, so every repair is the right-right case: four left rotations in all. The move at 6 is the one from the Insert drawing above. A plain binary search tree given the same input would be a chain of height 6. The AVL tree ends perfectly balanced, with height 2.

## Search

Rotations move nodes around but keep them in order, so search is the binary search tree's search, unchanged:

```py
def __contains__(self, key):
    node = self.root
    while node is not None and node.value != key:
        node = node.left if key < node.value else node.right
    return node is not None
```

Defining `__contains__` is what makes `value in tree` work. The loop visits at most one node per level. Because the height stays under about `1.44 log n`, search costs `O(log n)` in the worst case, not just on lucky input.

## Delete

Delete starts as in a [binary search tree](/trees/binary-search-tree): remove a leaf, replace a node that has one child by that child, or copy the in-order successor into a node that has two children and delete the successor instead. Then, as with insert, every node on the path back up gets its height updated and goes through the same `_rebalance`. Two things differ from insert. A child's balance factor can now be 0, and the tests in `_rebalance` treat that as a straight line, which a single rotation fixes. And a repair can leave its subtree one level lower than before, which can unbalance a node further up, so one delete may need repairs at several levels. That is still at most one `O(1)` repair per level, so delete costs `O(log n)` too. This page does not implement it.

## Full implementation

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 0

class AVLTree:
    def __init__(self):  # O(1)
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

    def __contains__(self, key):  # O(log n)
        node = self.root
        while node is not None and node.value != key:
            node = node.left if key < node.value else node.right
        return node is not None

    def insert(self, value):  # O(log n)
        if value in self:
            return
        self.root = self._insert(self.root, value)
        self.size += 1

    def _insert(self, node, value):  # O(log n)
        if node is None:
            return Node(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        else:
            node.right = self._insert(node.right, value)
        return self._rebalance(node)

    def _height(self, node):  # O(1)
        return -1 if node is None else node.height

    def _balance(self, node):  # O(1)
        return self._height(node.left) - self._height(node.right)

    def _update(self, node):  # O(1)
        node.height = 1 + max(self._height(node.left), self._height(node.right))

    def _rotate_right(self, node):  # O(1)
        child = node.left
        node.left = child.right
        child.right = node
        self._update(node)
        self._update(child)
        return child

    def _rotate_left(self, node):  # O(1)
        child = node.right
        node.right = child.left
        child.left = node
        self._update(node)
        self._update(child)
        return child

    def _rebalance(self, node):  # O(1)
        self._update(node)
        balance = self._balance(node)
        if balance > 1:
            if self._balance(node.left) < 0:
                node.left = self._rotate_left(node.left)
            return self._rotate_right(node)
        if balance < -1:
            if self._balance(node.right) > 0:
                node.right = self._rotate_right(node.right)
            return self._rotate_left(node)
        return node

tree = AVLTree()
for value in range(1, 8):
    tree.insert(value)
print(list(tree), len(tree))
print(tree.root.value, tree.root.height)
print(4 in tree, 8 in tree)
tree.insert(4)
print(len(tree))

big = AVLTree()
for value in range(1200):
    big.insert(value)
print(len(big), big.root.height)
```

The last line inserts 1,200 values in sorted order. A plain binary search tree would become a chain 1,199 levels deep, too deep for its recursive methods under Python's recursion limit. The AVL tree holds them with height 10, the lowest height possible for 1,200 values.

## In Python

Python's standard library has no balanced search tree. The usual stand-in is a sorted `list` kept in order with the `bisect` module, as on the [Sorted Array and Binary Search](/arrays/binary-search) page.

```python
import bisect

values = []
for value in [5, 1, 4, 2, 3, 7, 6]:
    bisect.insort(values, value)
print(values)

def contains(items, value):
    i = bisect.bisect_left(items, value)
    return i < len(items) and items[i] == value

print(contains(values, 4), contains(values, 8))
print(values[0], values[-1])
```

Both find a value in `O(log n)`. They differ on insert and delete: the list has to shift every item after the position, which is `O(n)`, while the tree changes a few references. The shift is a fast copy done in C, so for most programs the sorted list is the simpler choice and fast enough. Unlike the tree on this page, `insort` keeps duplicates.

Other languages ship a balanced tree in their standard libraries, and most of them use a red-black tree, Java's `TreeMap` for example. A red-black tree follows a looser rule than an AVL tree, so it can be somewhat taller, but a delete never needs more than three rotations.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Search (`in`) | `O(log n)` |
| Insert | `O(log n)` |
| Delete (described, not implemented here) | `O(log n)` |
| Length | `O(1)` |
| Visit all values in sorted order | `O(n)` |
| Space | `O(n)` |

Every cost is the worst case. Each node holds one number more than a binary search tree node, its height, so the space is still `O(n)`.

Compared with a sorted list:

| Operation | AVL tree | Sorted list with `bisect` |
| --- | --- | --- |
| Search | `O(log n)` | `O(log n)` |
| Insert | `O(log n)` | `O(n)` |
| Delete | `O(log n)` | `O(n)` |
| Smallest or largest | `O(log n)` | `O(1)` |
| Space | `O(n)` | `O(n)` |

## When to use

Use a balanced tree when a collection changes all the time and you also need it in order: the smallest value, the next value after `x`, everything between two values. Searching for a value or a boundary takes `O(log n)`. Listing all `k` values in a range takes `O(log n + k)` when the traversal skips subtrees outside the range.

In Python, try the simpler tools first.

- If you only ask whether a value is present, a `set` is faster: `O(1)` on average.
- If you only ever need the smallest item, use a [heap](/trees/heap).
- If the data changes rarely, or the collection is small, use a sorted list with `bisect`.
- If the values arrive in random order, a plain [binary search tree](/trees/binary-search-tree) stays close to balanced on average, and its code is shorter.

## Application

A booking calendar has to answer one question quickly: what is the next booking at or after a given time? A `dict` cannot answer that without checking every key. A balanced tree can, in `O(log n)`, by using the ordering rule.

Walk down from the root. A node at or after the asked time is a candidate, and any better answer is smaller, so go left. A node before the asked time is too early, and so is everything on its left, so go right. The last candidate seen is the answer.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 0

class AVLTree:
    def __init__(self):
        self.root = None
        self.size = 0

    def __len__(self):
        return self.size

    def __iter__(self):
        values = []
        self._inorder(self.root, values)
        return iter(values)

    def _inorder(self, node, values):
        if node is not None:
            self._inorder(node.left, values)
            values.append(node.value)
            self._inorder(node.right, values)

    def __contains__(self, key):
        node = self.root
        while node is not None and node.value != key:
            node = node.left if key < node.value else node.right
        return node is not None

    def insert(self, value):
        if value in self:
            return
        self.root = self._insert(self.root, value)
        self.size += 1

    def _insert(self, node, value):
        if node is None:
            return Node(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        else:
            node.right = self._insert(node.right, value)
        return self._rebalance(node)

    def _height(self, node):
        return -1 if node is None else node.height

    def _balance(self, node):
        return self._height(node.left) - self._height(node.right)

    def _update(self, node):
        node.height = 1 + max(self._height(node.left), self._height(node.right))

    def _rotate_right(self, node):
        child = node.left
        node.left = child.right
        child.right = node
        self._update(node)
        self._update(child)
        return child

    def _rotate_left(self, node):
        child = node.right
        node.right = child.left
        child.left = node
        self._update(node)
        self._update(child)
        return child

    def _rebalance(self, node):
        self._update(node)
        balance = self._balance(node)
        if balance > 1:
            if self._balance(node.left) < 0:
                node.left = self._rotate_left(node.left)
            return self._rotate_right(node)
        if balance < -1:
            if self._balance(node.right) > 0:
                node.right = self._rotate_right(node.right)
            return self._rotate_left(node)
        return node

def next_at_or_after(tree, time):
    node = tree.root
    best = None
    while node is not None:
        if node.value >= time:
            best = node.value
            node = node.left
        else:
            node = node.right
    return best

bookings = AVLTree()
for time in ['13:30', '09:00', '17:00', '10:15', '12:00', '15:45', '11:30']:
    bookings.insert(time)
print(list(bookings))

for asked in ['08:00', '12:00', '12:05', '18:00']:
    print(asked, next_at_or_after(bookings, asked))
```

The times are strings like `'09:00'`. Written with two digits for the hour, they sort in the same order as the times they stand for, so the tree holds them without any change. Nothing is booked at or after `'18:00'`, so that answer is `None`. A sorted list with `bisect_left` answers the same question just as fast. The tree pulls ahead when bookings are added and cancelled all day long.

## Key points

- A binary search tree is `O(log n)` only while it stays balanced. Sorted input turns it into an `O(n)` chain.
- An AVL tree keeps the two subtrees of every node within one level of each other in height, which keeps the whole tree under about `1.44 log n` levels.
- A rotation lifts a child above its parent in `O(1)` and keeps the values in order.
- Insert as in a binary search tree, then on the way back up repair the node at +2 or -2: one rotation for a straight line, two for a zig-zag.
- Python has no built-in balanced tree. A sorted list with `bisect` is the usual stand-in.

## Exercise

Write `is_avl`, which returns `True` when the two subtree heights at every node differ by at most one. This exercise checks the balance rule. The ordering rule is checked in the [binary search tree exercise](/trees/binary-search-tree#exercise). The nodes have no `height` field, so the function has to work out the heights itself. The two trees in the starter are the two from [Height and balance](#height-and-balance).

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def is_avl(node):
    pass

balanced = Node(5, Node(3, Node(2, Node(1)), Node(4)), Node(8, None, Node(9)))
lopsided = Node(5, Node(3, Node(2, Node(1))), Node(7, None, Node(8, None, Node(9))))
print(is_avl(balanced))
print(is_avl(lopsided))
print(is_avl(None))
```

::: details Solution
Ask each subtree for its height, and let a subtree that breaks the rule answer `None` instead. A node passes when both answers are heights that differ by at most one. Each node is visited once, because one call returns the height and the verdict together. Checking only the root would accept the second tree, since both of its root's subtrees have height 2.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def checked_height(node):
    if node is None:
        return -1
    left = checked_height(node.left)
    right = checked_height(node.right)
    if left is None or right is None or abs(left - right) > 1:
        return None
    return 1 + max(left, right)

def is_avl(node):
    return checked_height(node) is not None

balanced = Node(5, Node(3, Node(2, Node(1)), Node(4)), Node(8, None, Node(9)))
lopsided = Node(5, Node(3, Node(2, Node(1))), Node(7, None, Node(8, None, Node(9))))
print(is_avl(balanced))
print(is_avl(lopsided))
print(is_avl(None))
```

**Time** `O(n)`, one visit per node. **Space** `O(h)` for the recursion, where `h` is the height of the tree.
:::
