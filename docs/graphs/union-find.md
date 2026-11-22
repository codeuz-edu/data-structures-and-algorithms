---
title: Union-Find
description: "Union-find (disjoint set) in Python: the parent array, find, union by size, path compression, why the trees stay shallow, and cycle detection, with diagrams."
---

# Union-Find

Union-find splits items into disjoint groups. It can merge two groups and check whether two items already belong to the same group. This is useful when connections arrive one at a time.

It is used to find the [connected components](/graphs/graph#terms) of a graph, to detect a cycle while adding edges, and to build a [minimum spanning tree](/graphs/minimum-spanning-tree), the cheapest set of edges that connects every vertex of a weighted graph.

**You need:** [Array](/arrays/array), [Binary Tree](/trees/binary-tree) and [Graph](/graphs/graph).

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `UnionFind(count)` | Make `count` groups of one item each; the items are the numbers 0 to `count - 1` | `O(n)` |
| `find(item)` | Return the root, the item that names the group `item` is in | `O(α(n))` amortized |
| `union(a, b)` | Merge the groups of `a` and `b`; return `False` if they were already one group | `O(α(n))` amortized |
| `connected(a, b)` | Return whether `a` and `b` are in the same group | `O(α(n))` amortized |
| `groups` | The number of groups | `O(1)` |

`n` is the number of items and `h` the height of a group's tree. The costs are [amortized](/arrays/dynamic-array), which means averaged over a long run of operations. `α(n)` grows so slowly that they are effectively constant. [Path compression](#path-compression) says more.

## Groups as trees

<Diagram label="Anatomy" :width="600" :height="232" alt="Six items in three groups. Items 1 and 2 point to 0, which is the root of the first group. Item 4 points to 3, the root of the second group. Item 5 is alone. Below, the parent array reads 0, 0, 0, 3, 3, 5.">
 <DGraph directed :nodes="[{ id: 0, x: 150, y: 40 }, { id: 1, x: 110, y: 112 }, { id: 2, x: 190, y: 112 }, { id: 3, x: 320, y: 40 }, { id: 4, x: 320, y: 112 }, { id: 5, x: 450, y: 40 }]" :edges="[{ from: 1, to: 0 }, { from: 2, to: 0 }, { from: 4, to: 3 }]" />
 <text class="dg-note end" x="144" y="194">parent</text>
 <DCells :x="156" :y="170" :values="[0, 0, 0, 3, 3, 5]" indices />
</Diagram>

Each group is a tree in which every item stores its parent. The item at the top is its own parent and is called the root. The root is the name of the group.

All of it fits in one array: `parent[i]` is the parent of item `i`. Here `parent[4]` is 3, and `parent[3]` is 3 because 3 is a root.

## Find

<Diagram label="find(2) and find(4)" cost="O(h)" :width="600" :height="190" alt="The same three groups. find(2) starts at 2 and follows the link to its parent 0. Item 0 is its own parent, so find(2) returns 0. find(4) follows the link from 4 to 3 and returns 3. Items 1 and 5 are not involved.">
 <DGraph directed :nodes="[{ id: 0, x: 150, y: 40, state: 'hit' }, { id: 1, x: 110, y: 112, state: 'muted' }, { id: 2, x: 190, y: 112, state: 'done' }, { id: 3, x: 320, y: 40, state: 'hit' }, { id: 4, x: 320, y: 112, state: 'done' }, { id: 5, x: 450, y: 40, state: 'muted' }]" :edges="[{ from: 1, to: 0, state: 'muted' }, { from: 2, to: 0, state: 'accent' }, { from: 4, to: 3, state: 'accent' }]" />
 <text class="dg-note" x="150" y="164">find(2) returns 0</text>
 <text class="dg-note" x="320" y="164">find(4) returns 3</text>
</Diagram>

`find` returns the root of an item's group.

1. Start at the item.
2. If the item is its own parent, it is the root: return it.
3. Otherwise move to its parent and go back to step 2.

```py
def find(self, item):
    while self.parent[item] != item:
        item = self.parent[item]
    return item
```

The walk takes one step per level, so `find` costs `O(h)` for a tree of height `h`. Union by size and path compression, below, keep `h` small.

## Connected

Two items are in the same group exactly when their roots are the same. In the diagram above the roots are 0 and 3, so 2 and 4 are not connected.

```py
def connected(self, a, b):
    return self.find(a) == self.find(b)
```

It costs two finds and one comparison.

## Union

<Diagram label="Union of 2 and 4" cost="O(h)" :width="600" :height="232" alt="To merge the groups of 2 and 4, find their roots, 0 and 3. The root 3 is attached under the root 0. In the parent array, the entry for 3 changes from 3 to 0.">
 <DGraph directed :nodes="[{ id: 0, x: 150, y: 40, state: 'done' }, { id: 1, x: 110, y: 112 }, { id: 2, x: 190, y: 112, state: 'hit' }, { id: 3, x: 320, y: 40, state: 'done' }, { id: 4, x: 320, y: 112, state: 'hit' }, { id: 5, x: 450, y: 40 }]" :edges="[{ from: 1, to: 0 }, { from: 2, to: 0 }, { from: 4, to: 3 }, { from: 3, to: 0, state: 'accent' }]" />
 <text class="dg-note end" x="144" y="194">parent</text>
 <DCells :x="156" :y="170" :values="[0, 0, 0, 0, 3, 5]" :states="{ 3: 'new' }" indices />
</Diagram>

1. Find the roots of both items.
2. If the roots are equal, the items are already together.
3. Otherwise make one root the parent of the other.

Linking changes only one entry of the array, however large the groups are.

Which root goes under which matters. Attaching the smaller group under the larger one keeps the trees shallow. This is called union by size. The list `group_size` counts the items in each group. Only the entries for roots are kept up to date, and only those are read.

```py
def union(self, a, b):
    root_a, root_b = self.find(a), self.find(b)
    if root_a == root_b:
        return False
    if self.group_size[root_a] < self.group_size[root_b]:
        root_a, root_b = root_b, root_a
    self.parent[root_b] = root_a
    self.group_size[root_a] += self.group_size[root_b]
    return True
```

Union costs two finds plus a fixed amount of work, so it is `O(h)` too.

Link the roots, not the items. A classic bug is to write `self.parent[a] = b`. From the state in the anatomy diagram, `union(2, 4)` written that way makes 4 the parent of 2. Item 2 moves to the other group, while 0 and 1 stay behind: `connected(1, 4)` is still `False`, and now `connected(0, 2)` is `False` as well. Linking one root under the other moves a whole group at once, because every item in it leads up to that root.

## Path compression

<Diagram label="Path compression" cost="O(α(n)) amortized" :width="600" :height="200" alt="Before, item 4 points to 3 and 3 points to 0. After find is called on 4, item 4 points straight to the root 0.">
 <DGraph directed :nodes="[{ id: 'a0', label: 0, x: 170, y: 36 }, { id: 'a3', label: 3, x: 170, y: 100 }, { id: 'a4', label: 4, x: 170, y: 164 }, { id: 'b0', label: 0, x: 430, y: 50 }, { id: 'b3', label: 3, x: 390, y: 130 }, { id: 'b4', label: 4, x: 470, y: 130, state: 'hit' }]" :edges="[{ from: 'a4', to: 'a3' }, { from: 'a3', to: 'a0' }, { from: 'b3', to: 'b0' }, { from: 'b4', to: 'b0', state: 'accent' }]" />
 <text class="dg-note" x="290" y="90">find(4)</text><DArrow :from="[246, 100]" :to="[334, 100]" kind="muted" />
</Diagram>

`find` already walks from an item up to its root. On the way it can re-point each item it passes straight at the root, so the next `find` from there takes one step.

1. Walk up from the item to find the root, as before.
2. Walk the same path a second time. At each item, save its parent, point the item at the root, then move on to the saved parent.
3. Stop at the first item whose parent is already the root.

```py
def find(self, item):
    root = item
    while self.parent[root] != root:
        root = self.parent[root]
    while self.parent[item] != root:
        next_item = self.parent[item]
        self.parent[item] = root
        item = next_item
    return root
```

Save the parent before you overwrite it. The step can be squeezed into one line, `self.parent[item], item = root, self.parent[item]`, but that works only because Python assigns the targets from left to right. Swap the two targets and the line re-points the parent instead of the item.

With union by size and path compression together, the amortized cost per operation is `O(α(n))`. Here `α` is the inverse Ackermann function, which stays below 5 for any input a computer can hold, so the cost is effectively constant. A single `find` can still take `O(log n)`. The bound is an average over a long run of operations.

## Analysis

With union by size alone, no tree is ever taller than `log n`, so `find` and `union` cost `O(log n)` even in the worst case. For a million items that is at most 20 steps.

The reason is short. An item gets one level further from its root only when its root is linked under another root. Union by size does that only when the other group is at least as large, so the item's group at least doubles. A group that starts with one item can double at most `log n` times before it holds all `n` items. So no item ever ends up more than `log n` links below its root.

Path compression then shortens the walks that do happen, and together the two give the `O(α(n))` amortized cost from the previous section.

### From quick-find to path compression

Union-find is usually built up in four steps, each fixing the weak spot of the one before.

| Version | How it works | Find | Union |
| --- | --- | --- | --- |
| Quick-find | `group[i]` holds the name of each item's group | `O(1)` | `O(n)`: every item of one group is renamed |
| Quick-union | parent links; `union` puts one root under the other | `O(n)` | `O(n)` |
| Union by size | the smaller tree goes under the larger | `O(log n)` | `O(log n)` |
| Union by size and path compression | `find` also points every item it passes at the root | `O(α(n))` amortized | `O(α(n))` amortized |

Quick-union stops the renaming, but an unlucky order of unions builds a chain. Without union by size, `union(1, 0)`, `union(2, 0)`, `union(3, 0)` and so on put 0 under 1, then 1 under 2, then 2 under 3, so `find(0)` has to walk past every item. Union by size rules the chain out, and path compression flattens what height is left.

## Full implementation

```python
class UnionFind:
    def __init__(self, count):  # O(n)
        self.parent = list(range(count))
        self.group_size = [1] * count
        self.groups = count

    def find(self, item):  # O(α(n)) amortized
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):  # O(α(n)) amortized
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        self.groups -= 1
        return True

    def connected(self, a, b):  # O(α(n)) amortized
        return self.find(a) == self.find(b)

sets = UnionFind(6)
sets.union(0, 1)
sets.union(0, 2)
sets.union(3, 4)
print(sets.parent, sets.groups)

print(sets.connected(2, 4))
sets.union(2, 4)
print(sets.parent, sets.groups)

print(sets.find(4))
print(sets.parent)
print(sets.connected(2, 4))
```

The two prints around `find(4)` show path compression. Right after the union, `parent[4]` is still 3, as in the diagram. After `find(4)` it is 0.

## Items that are not numbers

The class needs its items to be the numbers 0 to `n - 1`, because they index lists. For names, grid cells or any other hashable items, keep the two tables in dicts instead:

```py
class UnionFind:
    def __init__(self, items):
        self.parent = {item: item for item in items}
        self.group_size = {item: 1 for item in items}
        self.groups = len(self.parent)
```

`find`, `union` and `connected` stay exactly as they are, because they only ever read and write `parent[item]` and `group_size[item]`, which look the same on a dict. The costs become average costs, as for any dict. [Minimum Spanning Tree](/graphs/minimum-spanning-tree) uses this version with letters as vertices.

## In Python

Neither the built-ins nor the standard library includes a union-find, so the class on this page is what you use. If a project already depends on SciPy, `scipy.cluster.hierarchy.DisjointSet` is a ready-made one that accepts any hashable items.

- The items index a list. A number past the end raises `IndexError`, but a negative one quietly wraps around to the end of the list, so `find(-1)` answers for the last item. The dict version in the previous section has no such trap: a missing item raises `KeyError`.
- Union-find tells you whether two items share a group, not who else is in it. To list the groups, collect the items by their root in a `collections.defaultdict(list)`. That costs one `find` per item.

The parent list below is the one from the union diagram.

```python
from collections import defaultdict

parent = [0, 0, 0, 0, 3, 5]

def find(item):
    while parent[item] != item:
        item = parent[item]
    return item

members = defaultdict(list)
for item in range(len(parent)):
    members[find(item)].append(item)
print(dict(members))
print(find(-1))
```

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Create `n` single-item groups | `O(n)` |
| Find | `O(α(n))` amortized, effectively constant |
| Union | `O(α(n))` amortized, effectively constant |
| Connected | `O(α(n))` amortized, effectively constant |
| Number of groups | `O(1)` |
| Space | `O(n)` |

## When to use

Use union-find when items join groups over time and you keep asking whether two of them are together: links in a network that appear one by one, or edges added to a graph while you watch for a cycle. It needs only the pairs as they arrive, not an adjacency list, and each new pair costs `O(α(n))` amortized.

[BFS or DFS](/graphs/graph) answer the same question when the whole graph is known up front: one search per component labels every vertex in `O(V + E)`. They also find the path between two vertices, which union-find cannot. The [`count_components` exercise](/graphs/graph#exercise) on the Graph page counts groups that way. Here the same number is `groups`, once `union` has been called for every edge. A new edge, though, means searching again from scratch, where union-find needs one more `union`.

Union-find can merge groups but never split one. When connections can also be removed, store the graph and search it instead. [Choosing a Structure](/choosing-a-structure) lists the alternatives for other jobs.

## Application

An undirected graph, given as a list of edges, has a cycle exactly when some edge joins two vertices that are already connected. `union` returns `False` in that case, so one pass over the edges finds out.

```python
class UnionFind:
    def __init__(self, count):  # O(n)
        self.parent = list(range(count))
        self.group_size = [1] * count
        self.groups = count

    def find(self, item):  # O(α(n)) amortized
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):  # O(α(n)) amortized
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        self.groups -= 1
        return True

    def connected(self, a, b):  # O(α(n)) amortized
        return self.find(a) == self.find(b)

def has_cycle(count, edges):
    sets = UnionFind(count)
    for a, b in edges:
        if not sets.union(a, b):
            return True
    return False

print(has_cycle(4, [(0, 1), (1, 2), (2, 3)]))
print(has_cycle(4, [(0, 1), (1, 2), (2, 0)]))
```

In the second graph, 0, 1 and 2 are already one group when the edge from 2 to 0 arrives, so that edge closes the cycle 0, 1, 2, 0. Each edge costs one `union`, so for `n` vertices and `E` edges the check is `O(n + E · α(n))`, effectively linear.

Other places union-find does the work:

- [Kruskal's algorithm](/graphs/minimum-spanning-tree) builds a minimum spanning tree by taking edges from the cheapest up and skipping every edge that `union` rejects, the same test as `has_cycle`.
- Network connectivity: as links between computers come up, `connected(a, b)` says whether a message can already get from `a` to `b`.
- Region labelling: in an image, union every pixel with each neighbour of the same colour. Each group is then one region. The pixels are the cells of a [grid](/graphs/graph#grids-as-graphs), and the dict version above takes `(row, col)` pairs as items.

## Key points

- Union-find stores each group as a tree in one parent array, and the root names the group. `find` walks up to the root, and two items are connected when their roots match.
- `union` links one root under the other, the smaller group under the larger. Linking the items instead of the roots is a classic bug.
- Union by size keeps every tree at most `log n` tall, because an item only gets deeper when its group at least doubles.
- Path compression points every item on the walk straight at the root. Together with union by size it makes each operation `O(α(n))` amortized, effectively constant.
- Groups can merge but never split. For paths, or for connections that go away, search the graph with BFS or DFS instead.

## Exercise

There are at least two people, numbered 0 to `n - 1`. They become friends one pair at a time. `friendships` lists `(time, a, b)` in order of time. Write `all_connected_at`, which returns the time of the friendship that first links everyone through some chain of friends, or -1 if that never happens. The `groups` count tells you when it happens.

```python
class UnionFind:
    def __init__(self, count):  # O(n)
        self.parent = list(range(count))
        self.group_size = [1] * count
        self.groups = count

    def find(self, item):  # O(α(n)) amortized
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):  # O(α(n)) amortized
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        self.groups -= 1
        return True

    def connected(self, a, b):  # O(α(n)) amortized
        return self.find(a) == self.find(b)

def all_connected_at(count, friendships):
    pass

friendships = [(1, 0, 1), (3, 3, 4), (4, 1, 2), (6, 2, 3), (9, 0, 4)]
print(all_connected_at(5, friendships))
print(all_connected_at(5, friendships[:3]))
```

::: details Solution
Add the friendships in order of time. Each `union` that merges two groups lowers `groups` by one, so the first time `groups` reaches 1, everyone is linked.

```python
class UnionFind:
    def __init__(self, count):  # O(n)
        self.parent = list(range(count))
        self.group_size = [1] * count
        self.groups = count

    def find(self, item):  # O(α(n)) amortized
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):  # O(α(n)) amortized
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        self.groups -= 1
        return True

    def connected(self, a, b):  # O(α(n)) amortized
        return self.find(a) == self.find(b)

def all_connected_at(count, friendships):
    sets = UnionFind(count)
    for time, a, b in friendships:
        sets.union(a, b)
        if sets.groups == 1:
            return time
    return -1

friendships = [(1, 0, 1), (3, 3, 4), (4, 1, 2), (6, 2, 3), (9, 0, 4)]
print(all_connected_at(5, friendships))
print(all_connected_at(5, friendships[:3]))
```

**Time** `O(n + E · α(n))` for `n` people and `E` friendships, effectively linear. **Space** `O(n)`.

`groups` is the number of connected components of the friendship graph so far. The [Graph exercise](/graphs/graph#exercise) counts the same thing with BFS.
:::
