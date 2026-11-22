---
title: Binary Tree
description: "Binary trees in Python: the vocabulary, the named shapes and how tall a tree can be, preorder, inorder, postorder and level order with recursion, a stack and a queue, expression trees, storing a tree in an array, and general trees."
---

# Binary Tree

A rooted tree has one path from the root to each node. A binary tree gives each node at most two children, called the left and right children.

Trees describe anything nested: folders inside folders, the tags of a web page, the parts of an arithmetic expression.

**You need:** [References and Memory](/foundations/references), [Recursion](/recursion/recursion), [Stack](/stacks-queues/stack) and [Queue](/stacks-queues/queue).

## Interface

This page builds a `Node` class and a few functions that take the root of a tree. An empty tree is `None`.

| Operation | What it does | Cost |
| --- | --- | --- |
| `preorder(node, out)` | Append the values to `out`: the node, then its left subtree, then its right subtree | `O(n)` |
| `inorder(node, out)` | The same in the order left subtree, node, right subtree | `O(n)` |
| `postorder(node, out)` | The same in the order left subtree, right subtree, node | `O(n)` |
| `preorder_iterative(root)` | Return the preorder values, using a stack in place of recursion | `O(n)` |
| `level_order(root)` | Return the values level by level, top to bottom and left to right | `O(n)` |
| `height(node)` | Return the number of edges on the longest path down to a leaf, -1 for an empty tree | `O(n)` |
| `size(node)` | Return the number of nodes | `O(n)` |

`n` is the number of nodes. The traversals also need extra memory while they run: `O(h)` for the depth-first ones, where `h` is the height of the tree, and `O(w)` for level order, where `w` is the number of nodes on the widest level.

## Terms

<Diagram label="Anatomy" :width="560" :height="200" alt="A binary tree with 8 at the root. Its children are 3 and 10. 3 has the children 1 and 6, and 10 has the right child 14. 8, 3 and 10 are internal nodes, and 1, 6 and 14 are leaves. The rows are levels 0, 1 and 2, and the tree has height 2.">
 <DTree :x="270" :y="40" :width="360" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 'root', 1: 'internal', 3: 'leaf' }" />
 <text class="dg-note end" x="540" y="44">level 0</text><text class="dg-note end" x="540" y="104">level 1</text><text class="dg-note end" x="540" y="164">level 2</text>
</Diagram>

- An **edge** joins a node to a node directly below it. The upper one is the **parent** and the lower one is its **child**. Children of the same parent are **siblings**: 1 and 6 are siblings, and 3 is their parent.
- The **root** is the top node, the only one without a parent. A **leaf** is a node with no children. A node with at least one child, like 8, 3 or 10, is an **internal node**.
- The nodes on the way up from a node to the root are its **ancestors**. The nodes below it are its **descendants**. The ancestors of 6 are 3 and 8.
- A node together with all its descendants is a **subtree**. Every subtree is itself a tree, which is why tree code is usually recursive.
- The **depth** of a node is the number of edges between it and the root. The nodes at depth `d` form **level** `d`.
- The **height** of the tree is the depth of its deepest leaf. This one has height 2.
- The **size** of a tree is its number of nodes. This one has size 6.

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

`left` and `right` are [references](/foundations/references) to the child nodes, or `None` when a child is missing.

## Tree shapes

<Diagram label="Tree shapes" :width="700" :height="216" alt="Five small trees. Full: every node has zero or two children. Complete: every level is full except the last, which fills from the left. Perfect: every level is full. Balanced: at every node the two subtrees differ in height by at most one. Degenerate: every internal node has one child, so the tree is a chain.">
 <DTree :x="70" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', null, null, '', '']" />
 <DTree :x="210" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', '', '', '']" />
 <DTree :x="350" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', '', '', '', '']" />
 <DTree :x="490" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', null, '', '', null]" />
 <DGraph :r="12" :nodes="[{ id: 1, label: '', x: 594, y: 40 }, { id: 2, label: '', x: 618, y: 69 }, { id: 3, label: '', x: 642, y: 99 }, { id: 4, label: '', x: 666, y: 128 }]" :edges="[{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }]" />
 <text class="dg-label is-ink" x="70" y="172">Full</text><text class="dg-note" x="70" y="190">0 or 2 children</text><text class="dg-note" x="70" y="205">at every node</text>
 <text class="dg-label is-ink" x="210" y="172">Complete</text><text class="dg-note" x="210" y="190">full levels, the last</text><text class="dg-note" x="210" y="205">filled from the left</text>
 <text class="dg-label is-ink" x="350" y="172">Perfect</text><text class="dg-note" x="350" y="190">every level</text><text class="dg-note" x="350" y="205">is full</text>
 <text class="dg-label is-ink" x="490" y="172">Balanced</text><text class="dg-note" x="490" y="190">subtree heights</text><text class="dg-note" x="490" y="205">differ by at most 1</text>
 <text class="dg-label is-ink" x="630" y="172">Degenerate</text><text class="dg-note" x="630" y="190">one child</text><text class="dg-note" x="630" y="205">per node</text>
</Diagram>

A few shapes have names, and later pages rely on them.

| Shape | Rule | Where it matters |
| --- | --- | --- |
| Full | every node has zero or two children, never one | [expression trees](#expression-trees), and the decision trees in the [Application](#application) |
| Complete | every level is full except possibly the last, which fills from the left with no gaps | every [heap](/trees/heap) has this shape |
| Perfect | every level is full | the most nodes a height can hold |
| Balanced | at every node, the heights of the two subtrees differ by at most 1 | keeps the height close to `log n` |
| Degenerate | every internal node has one child, so the tree is a chain | a [binary search tree](/trees/binary-search-tree) built from sorted input |

The shapes overlap. The perfect tree in the picture is also full, complete and balanced.

The shape decides the height, and the height decides the cost. Each node has at most two children, so each level holds at most twice as many nodes as the one above it: level `d` holds at most `2 ** d` nodes. A perfect tree of height `h` therefore has `2 ** (h + 1) - 1` nodes, which is 1 + 2 + 4 = 7 for height 2. Turned around, this bounds the height of any binary tree with `n` nodes:

- at least `⌊log n⌋`, when the nodes are packed as tightly as possible, as in a complete tree ([what `log n` means](/foundations/measuring-cost#what-log-n-means));
- at most `n - 1`, when the tree is a chain.

Any operation that walks from the root down to one leaf costs `O(h)`. On a complete or balanced tree that is `O(log n)`. On a chain it is `O(n)`.

## Depth-first traversals

Visiting every node once is called a traversal. A list has one obvious order. A tree has several, and they differ in when a node is handled compared with its children.

<Diagram label="Three depth-first orders" cost="O(n)" :width="660" :height="220" alt="The same tree three times, with the visit order written next to each node. Preorder visits 8, 3, 1, 6, 10, 14. Inorder visits 1, 3, 6, 8, 10, 14. Postorder visits 1, 6, 3, 14, 10, 8.">
 <text class="dg-label is-ink" x="120" y="18">Preorder</text>
 <DTree :x="112" :y="50" :width="184" :gap="54" :r="15" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 1, 1: 2, 3: 3, 4: 4, 2: 5, 6: 6 }" />
 <text class="dg-note" x="120" y="204">8  3  1  6  10  14</text>
 <text class="dg-label is-ink" x="330" y="18">Inorder</text>
 <DTree :x="322" :y="50" :width="184" :gap="54" :r="15" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 3: 1, 1: 2, 4: 3, 0: 4, 2: 5, 6: 6 }" />
 <text class="dg-note" x="330" y="204">1  3  6  8  10  14</text>
 <text class="dg-label is-ink" x="540" y="18">Postorder</text>
 <DTree :x="532" :y="50" :width="184" :gap="54" :r="15" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 3: 1, 4: 2, 1: 3, 6: 4, 2: 5, 0: 6 }" />
 <text class="dg-note" x="540" y="204">1  6  3  14  10  8</text>
</Diagram>

| Order | Rule | Typical use |
| --- | --- | --- |
| Preorder | node, left subtree, right subtree | copying a tree |
| Inorder | left subtree, node, right subtree | reading a search tree in sorted order |
| Postorder | left subtree, right subtree, node | deleting a tree, adding up folder sizes |

Each one is a short [recursive](/recursion/recursion) function. The base case is the empty tree, `None`, where there is nothing to do. The recursive case handles the node and calls the same function on the two subtrees, which are smaller trees, and the [call stack](/recursion/recursion#the-call-stack) remembers where to come back to. For inorder:

1. If the node is `None`, return.
2. Traverse the left subtree.
3. Handle the node.
4. Traverse the right subtree.

```py
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value)
    inorder(node.right)
```

Preorder and postorder are the same function. Only the position of the line that handles the node changes.

Each node is handled once, so a traversal costs `O(n)`. The call stack holds one frame for each node on the path from the root down to the current node, so the extra space is `O(h)`.

Python stops a recursion that goes about 1000 calls deep. A tree that tall is rare, but a badly unbalanced one can get there, and then the traversal has to use its own stack in place of recursion, as in the next section.

## Depth-first traversal with a stack

A loop can do the same walk if it keeps its own [stack](/stacks-queues/stack) of nodes that are still waiting. This is what the call stack does for the recursive version, made explicit.

<Diagram label="Preorder with a stack" cost="O(n)" :width="680" :height="250" alt="Seven snapshots of the stack, each drawn with its top highest. At the start it holds 8. Popping 8 pushes 10 and then 3. Popping 3 pushes 6 and then 1. Popping 1 and then 6 pushes nothing. Popping 10 pushes 14. Popping 14 leaves the stack empty. The nodes come off in the order 8, 3, 1, 6, 10, 14, which is preorder.">
 <text class="dg-label" x="340" y="40">The top of each stack is drawn highest</text>
 <DCells :x="28" :y="150" :h="34" vertical :values="[8]" :states="{ 0: 'new' }" /><text class="dg-note" x="52" y="208">start</text>
 <DCells :x="124" :y="150" :h="34" vertical :values="[10, 3]" :states="{ 0: 'new', 1: 'new' }" /><text class="dg-note" x="148" y="208">pop 8</text>
 <DCells :x="220" :y="150" :h="34" vertical :values="[10, 6, 1]" :states="{ 1: 'new', 2: 'new' }" /><text class="dg-note" x="244" y="208">pop 3</text>
 <DCells :x="316" :y="150" :h="34" vertical :values="[10, 6]" /><text class="dg-note" x="340" y="208">pop 1</text>
 <DCells :x="412" :y="150" :h="34" vertical :values="[10]" /><text class="dg-note" x="436" y="208">pop 6</text>
 <DCells :x="508" :y="150" :h="34" vertical :values="[14]" :states="{ 0: 'new' }" /><text class="dg-note" x="532" y="208">pop 10</text>
 <DCells :x="604" :y="150" :h="34" vertical :values="[null]" :states="{ 0: 'ghost' }" /><text class="dg-note" x="628" y="208">pop 14</text>
 <text class="dg-note is-accent" x="340" y="238">popped in the order 8, 3, 1, 6, 10, 14: preorder</text>
</Diagram>

1. Push the root.
2. Pop a node and handle it.
3. Push its right child, then its left child, skipping any that are `None`. The left child is now on top, so it is handled next.
4. Repeat until the stack is empty.

```py
def preorder_iterative(root):
    out = []
    if root is None:
        return out
    stack = [root]
    while stack:
        node = stack.pop()
        out.append(node.value)
        if node.right is not None:
            stack.append(node.right)
        if node.left is not None:
            stack.append(node.left)
    return out
```

Every node is pushed and popped once, so the cost is `O(n)`. The stack never holds more than `h + 1` nodes, so the extra space is `O(h)` as before, but now no recursion limit applies. Inorder and postorder can be written with a stack too. They need more bookkeeping, because a node is handled after its left subtree instead of before it.

## Level order

<Diagram label="Level order" cost="O(n)" :width="560" :height="200" alt="The tree with the visit order next to each node: 8 first, then 3 and 10, then 1, 6 and 14. Each level is finished before the next one starts.">
 <DTree :x="280" :y="40" :width="360" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 6: 6 }" />
</Diagram>

Level order goes across the tree, one level at a time. Recursion follows one branch at a time, so it does not fit naturally. A [queue](/stacks-queues/queue) does.

1. Put the root in a queue.
2. Take the node at the front and handle it.
3. Add its left child and then its right child at the back, skipping any that are `None`.
4. Repeat until the queue is empty.

```py
def level_order(root):
    if root is None:
        return
    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.value)
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
```

This is the loop from the previous section with a queue in place of the stack. Each node passes through the queue once, so the cost is `O(n)`. The queue holds at most parts of two neighbouring levels, so its size is `O(w)`. Level order is [breadth-first search](/graphs/graph#breadth-first-search) on a tree.

## Height and size

<Diagram label="Height of each subtree" cost="O(n)" :width="560" :height="220" alt="The example tree with the height of the subtree under each node written next to it. The leaves 1, 6 and 14 have height 0. 3 and 10 have height 1. The root 8 has height 2. The size of the tree is 6: 1 for the root, 3 nodes on the left and 2 on the right.">
 <DTree :x="280" :y="40" :width="360" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 'height 2', 1: 'height 1', 2: 'height 1', 3: 'height 0', 4: 'height 0', 6: 'height 0' }" />
 <text class="dg-note" x="280" y="210">size 6 = 1 for the root + 3 on the left + 2 on the right</text>
</Diagram>

A node needs the answers for both of its subtrees before it can give its own, so both functions work from the bottom up, in postorder.

1. An empty tree has height -1 and size 0.
2. Otherwise, get the height and size of both subtrees.
3. The height is 1 more than the larger of the two heights. The size is 1 plus the two sizes.

```py
def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

def size(node):
    if node is None:
        return 0
    return 1 + size(node.left) + size(node.right)
```

Both visit every node once, so each costs `O(n)`. An empty tree has height -1 here, which makes a single node come out as height 0. Some books count nodes instead of edges, and their heights are one larger.

## Expression trees

An arithmetic expression is a binary tree. Each leaf holds a number, and each internal node holds an operator that applies to its two subtrees. Every operator has two operands, so the tree is full.

<Diagram label="(10 + 2 * 8) - 3" cost="O(n)" :width="600" :height="262" alt="The expression (10 + 2 * 8) - 3 as a tree. The root is the minus sign. Its left subtree is 10 plus the subtree 2 times 8, and its right child is 3. Each operator is marked with its value: the times node is 16, the plus node 26 and the root 23. Read in postorder, the tree gives 10 2 8 * + 3 -.">
 <DTree :x="325" :y="36" :width="400" :gap="56" :values="['-', '+', 3, 10, '*', null, null, null, null, 2, 8]" :notes="{ 0: '= 23', 1: '= 26', 4: '= 16' }" />
 <text class="dg-note" x="300" y="250">read in postorder: 10 2 8 * + 3 -</text>
</Diagram>

An operator can only be applied once both of its subtrees have a value, so evaluation is a postorder traversal.

1. A leaf is a number: return it.
2. Otherwise, evaluate the left subtree, then the right subtree.
3. Apply the node's operator to the two results.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def evaluate(node):
    if node.left is None:
        return node.value
    left = evaluate(node.left)
    right = evaluate(node.right)
    if node.value == '+':
        return left + right
    if node.value == '-':
        return left - right
    return left * right

def postfix(node):
    if node.left is None:
        return str(node.value)
    return f'{postfix(node.left)} {postfix(node.right)} {node.value}'

expression = Node('-', Node('+', Node(10), Node('*', Node(2), Node(8))), Node(3))
print(evaluate(expression))
print(postfix(expression))
```

Written out in postorder, the tree is `10 2 8 * + 3 -`, the postfix form from the [Stack](/stacks-queues/stack#exercise) exercise. The stack in that exercise does the work that the recursion does here. Each node is visited once, so evaluation costs `O(n)`.

## Storing a tree in an array

A tree does not need node objects. Write the nodes into a list level by level, left to right, and the position of a node tells you where its relatives are: the children of index `i` are at `2 * i + 1` and `2 * i + 2`, and its parent is at `(i - 1) // 2`.

<Diagram label="The example tree in a list" :width="640" :height="312" alt="The example tree stored in a list. Each node's index is written beside it: 8 at 0, 3 at 1, 10 at 2, 1 at 3, 6 at 4 and 14 at 6. Index 5 would hold the left child of 10, which does not exist, so that slot is empty in the tree and in the list. Arrows from index 1 to indexes 3 and 4 show that the children of index i are at 2i + 1 and 2i + 2.">
 <DTree :x="320" :y="36" :width="360" :gap="56" :values="[8, 3, 10, 1, 6, '', 14]" :states="{ 1: 'hit', 3: 'done', 4: 'done', 5: 'ghost' }" :edges="{ 5: 'removed' }" :notes="{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }" />
 <DCells :x="152" :y="196" :values="[8, 3, 10, 1, 6, null, 14]" :states="{ 1: 'hit', 3: 'done', 4: 'done', 5: 'ghost' }" indices />
 <DArrow :from="[224, 262]" :via="[[224, 276], [320, 276]]" :to="[320, 262]" kind="accent" />
 <DArrow :from="[224, 262]" :via="[[224, 276], [368, 276]]" :to="[368, 262]" kind="accent" />
 <text class="dg-note" x="296" y="300">children of index 1: 2 × 1 + 1 = 3 and 2 × 1 + 2 = 4</text>
 <text class="dg-note start" x="500" y="212">index 5 is a gap:</text>
 <text class="dg-note start" x="500" y="228">10 has no left child</text>
</Diagram>

A missing node still needs its slot, filled with `None`, or every node after it would shift. Gaps waste space: a chain of `n` nodes would need about `2 ** n` slots. A complete tree has no gaps at all, which is why the [heap](/trees/heap) keeps its tree this way, in a plain list with no references and no node objects.

The traversals work the same with index arithmetic in place of `left` and `right`:

```python
tree = [8, 3, 10, 1, 6, None, 14]

def inorder(tree, i, out):
    if i >= len(tree) or tree[i] is None:
        return
    inorder(tree, 2 * i + 1, out)
    out.append(tree[i])
    inorder(tree, 2 * i + 2, out)

values = []
inorder(tree, 0, values)
print(values)
```

Level order needs no code at all: it is the list read from left to right, skipping the gaps.

## General trees

A folder can hold any number of files and folders, so a file system is a tree but not a binary one. A general tree drops the limit of two: each node keeps a list of its children.

<Diagram label="A general tree" :width="620" :height="208" alt="A general tree of folders. home has three children: music, photos and notes.txt. photos has two children, 2024 and 2025. music and notes.txt have an empty list of children. Each node keeps its children in a list, as many as it needs.">
 <DArrow :from="[300, 48]" :via="[[300, 68], [150, 68]]" :to="[150, 88]" :head="false" />
 <DArrow :from="[300, 48]" :to="[300, 88]" :head="false" />
 <DArrow :from="[300, 48]" :via="[[300, 68], [450, 68]]" :to="[450, 88]" :head="false" />
 <DArrow :from="[300, 120]" :via="[[300, 140], [240, 140]]" :to="[240, 160]" :head="false" />
 <DArrow :from="[300, 120]" :via="[[300, 140], [360, 140]]" :to="[360, 160]" :head="false" />
 <DBox :x="258" :y="16" :w="84" :h="32" text="home" small />
 <DBox :x="108" :y="88" :w="84" :h="32" text="music" small />
 <DBox :x="258" :y="88" :w="84" :h="32" text="photos" small />
 <DBox :x="408" :y="88" :w="84" :h="32" text="notes.txt" small />
 <DBox :x="198" :y="160" :w="84" :h="32" text="2024" small />
 <DBox :x="318" :y="160" :w="84" :h="32" text="2025" small />
 <text class="dg-note start" x="354" y="36">children = [music, photos, notes.txt]</text>
 <text class="dg-note" x="150" y="140">children = []</text>
 <text class="dg-note" x="450" y="140">children = []</text>
</Diagram>

```python
class TreeNode:
    def __init__(self, value, children=()):
        self.value = value
        self.children = list(children)

def show(node, depth=0):
    print('    ' * depth + node.value)
    for child in node.children:
        show(child, depth + 1)

def size(node):
    return 1 + sum(size(child) for child in node.children)

home = TreeNode('home', [
    TreeNode('music'),
    TreeNode('photos', [TreeNode('2024'), TreeNode('2025')]),
    TreeNode('notes.txt'),
])
show(home)
print(size(home))
```

`show` is a preorder: it prints a node before its children. `size` is a postorder: it adds up the answers of the children before it can give its own. A leaf has an empty list, so the loop runs zero times and no `None` check is needed. There is no inorder, because a node with three children has no single place in the middle.

The [trie](/trees/trie) is a general tree too. It keeps its children in a dictionary keyed by letter instead of a list.

## Full implementation

```python
from collections import deque

class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def preorder(node, out):  # O(n)
    if node is None:
        return
    out.append(node.value)
    preorder(node.left, out)
    preorder(node.right, out)

def inorder(node, out):  # O(n)
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.value)
    inorder(node.right, out)

def postorder(node, out):  # O(n)
    if node is None:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.value)

def preorder_iterative(root):  # O(n)
    out = []
    if root is None:
        return out
    stack = [root]
    while stack:
        node = stack.pop()
        out.append(node.value)
        if node.right is not None:
            stack.append(node.right)
        if node.left is not None:
            stack.append(node.left)
    return out

def level_order(root):  # O(n)
    out = []
    if root is None:
        return out
    queue = deque([root])
    while queue:
        node = queue.popleft()
        out.append(node.value)
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
    return out

def height(node):  # O(n)
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

def size(node):  # O(n)
    if node is None:
        return 0
    return 1 + size(node.left) + size(node.right)

root = Node(8, Node(3, Node(1), Node(6)), Node(10, None, Node(14)))

for traverse in [preorder, inorder, postorder]:
    values = []
    traverse(root, values)
    print(traverse.__name__, values)
print('preorder_iterative', preorder_iterative(root))
print('level_order', level_order(root))
print('height', height(root), 'size', size(root))
print(level_order(None), height(None), size(None))

chain = None
for value in range(2000):
    chain = Node(value, None, chain)
print(len(preorder_iterative(chain)))
```

The last lines build a chain 2000 nodes deep. The recursive functions would raise `RecursionError` on it. `preorder_iterative` does not.

## In Python

Python has no binary tree type. A small class like `Node` is the usual answer, with `None` for an empty subtree.

General trees do appear in the standard library. `xml.etree.ElementTree` reads markup into a tree of elements. An element works like the list of its children: `len(element)` counts them, `for child in element` loops over them, and `element.iter()` walks the whole tree in preorder.

```python
import xml.etree.ElementTree as ET

page = ET.fromstring('<html><head><title/></head><body><h1/><p/><p/></body></html>')
print([element.tag for element in page.iter()])
print(len(page), [child.tag for child in page])
print(len(page.find('body')))
```

Two traps.

- Recursion stops at about 1000 levels, the number `sys.getrecursionlimit()` returns. `sys.setrecursionlimit` raises the limit, but a loop with an explicit stack removes it.
- For level order, use `collections.deque`. `list.pop(0)` shifts every item that is left, so a traversal built on it can cost `O(n²)`.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Preorder, inorder, postorder, with recursion or a stack | `O(n)` |
| Level order | `O(n)` |
| Height, size | `O(n)` |
| Extra space, depth-first | `O(h)` |
| Extra space, level order | `O(w)` |
| Space | `O(n)` |

`h` is between `⌊log n⌋` and `n - 1`, so the depth-first traversals need anything from `O(log n)` to `O(n)` extra space, depending on the shape.

A plain binary tree puts no rule on where values go, so finding one means a full traversal, `O(n)`. The [binary search tree](/trees/binary-search-tree) adds a rule that fixes this.

## When to use

Use a binary tree when each item naturally splits into at most two parts: a yes-or-no question, the two halves of a range, or the two operands of an operator. More often it is the frame that another structure is built on.

- To find values by key or keep them in order, use a [binary search tree](/trees/binary-search-tree), or a `dict` when order does not matter.
- To take out the smallest item again and again, use a [heap](/trees/heap).
- When a node can have more than two children, use a general tree with a list of children.

## Application

A decision tree answers a question by walking from the root to a leaf. Each internal node asks a yes-or-no question, here whether a fact holds. The left child is the branch for no and the right child the branch for yes. The leaves hold the answers.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def classify(node, facts):
    while node.left is not None:
        node = node.right if node.value in facts else node.left
    return node.value

animals = Node('flies',
               Node('swims', Node('dog'), Node('fish')),
               Node('has feathers', Node('bat'), Node('eagle')))
print(classify(animals, {'swims'}))
print(classify(animals, {'flies', 'has feathers'}))
print(classify(animals, {'flies'}))
```

Every question has both branches, so the tree is full, and `classify` only has to check `node.left` to tell a question from an answer. Each call follows one path, so it costs `O(h)`. Decision trees learned from data work the same way, with a test such as `weight > 2.5` at each node.

## Key points

- A binary tree is made of nodes with at most two children. Root, leaf, depth, height and size describe its parts.
- For a nonempty tree with `n` nodes, the height is between `⌊log n⌋` and `n - 1`, and walking from the root to a leaf costs `O(h)`.
- Preorder, inorder and postorder are short recursive functions that differ only in when the node is handled. Evaluating an expression tree is a postorder.
- An explicit stack does the same walk without Python's recursion limit. A queue gives level order.
- A complete tree fits in a plain list, with the children of index `i` at `2 * i + 1` and `2 * i + 2`. A general tree keeps a list of children instead.

## Exercise

Write `count_leaves`, which returns the number of leaves in a tree.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def count_leaves(node):
    pass

root = Node(8, Node(3, Node(1), Node(6)), Node(10, None, Node(14)))
print(count_leaves(root))
print(count_leaves(Node(5)))
print(count_leaves(None))
```

::: details Solution
An empty tree has no leaves. A node without children is one leaf. Any other node has as many leaves as its two subtrees together.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def count_leaves(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    return count_leaves(node.left) + count_leaves(node.right)

root = Node(8, Node(3, Node(1), Node(6)), Node(10, None, Node(14)))
print(count_leaves(root))
print(count_leaves(Node(5)))
print(count_leaves(None))
```

**Time** `O(n)`. **Space** `O(h)` for the recursion.
:::
