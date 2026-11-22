---
title: Minimum Spanning Tree
description: "Minimum spanning trees in Python: Kruskal's algorithm with union-find, Prim's algorithm with a heap, step-by-step traces, and why an MST is not a shortest-path tree."
---

# Minimum Spanning Tree

Suppose each edge is a cable between two towns and its weight is the installation cost. A minimum spanning tree connects every town with the lowest possible total cost. Kruskal’s and Prim’s algorithms choose the edges in different orders.

**You need:** [Shortest Paths](/graphs/shortest-paths) for weighted graphs, [Union-Find](/graphs/union-find) and [Heap](/trees/heap).

## Spanning trees

This page uses the weighted graph from [Shortest Paths](/graphs/shortest-paths), stored the same way, as `graph[u][v] = weight`. It is undirected: a cable works both ways.

A **spanning tree** of a connected graph is a set of its edges that connects every vertex and contains no cycle. With `V` vertices it always has exactly `V - 1` edges. With fewer, some vertex would be cut off. With more, some edge would close a cycle.

<WeightedGraph mode="spanning" />

The weight of a spanning tree is the sum of its edge weights. The one drawn here weighs 26. A **minimum spanning tree**, or MST, is a spanning tree with the smallest possible weight. For this graph that is 18.

## The problem

Input: a nonempty, connected, undirected, weighted graph. Output: a spanning tree of minimum total weight.

When all the weights are different, as here, there is exactly one minimum spanning tree. With equal weights there may be several, all with the same total.

If the graph is not connected, no spanning tree exists. Kruskal's algorithm then returns a minimum spanning forest, one tree for each connected piece. Prim's algorithm covers only the piece that holds its start vertex.

Both algorithms are greedy. They build the tree one edge at a time and always take the cheapest edge they are allowed to take. They differ in which edges are allowed.

## Kruskal's algorithm

### The idea

Go through all the edges from lightest to heaviest. Add each one to the tree unless it would close a cycle.

<WeightedGraph mode="kruskal" />

Along the way the chosen edges form separate pieces, which merge as edges are added. An edge closes a cycle exactly when its two ends are already in the same piece. [Union-find](/graphs/union-find) answers that question and merges two pieces, both in effectively constant time.

The diagram shows the state after three edges. B-C, A-B and D-E make two pieces. The next edge, C-E with weight 4, joins them.

### Step by step

<WeightedTrace algorithm="kruskal" />

1. B-C (1): B and C are in different groups. Add it.
2. A-B (2): add it. A, B and C are now one group.
3. D-E (3): add it.
4. C-E (4): C and E are in different groups. Add it, and five vertices are now one group.
5. A-C (5): A and C are already in one group, so this edge would close the cycle A, B, C. Skip it.
6. B-D (6): B and D are in one group as well. Skip it.
7. E-F (8): F joins. Five edges now connect all six vertices, so the tree is complete.

The total is 1 + 2 + 3 + 4 + 8 = 18. The last edge, D-F (9), is never looked at.

### The code

The union-find class is the one from the [Union-Find](/graphs/union-find) page, with union by size and path compression. This version keeps its tables in dictionaries keyed by vertex, so it works with letters as well as numbers.

```py
class UnionFind:
    def __init__(self, items):
        self.parent = {item: item for item in items}
        self.group_size = {item: 1 for item in items}

    def find(self, item):
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

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

```py
def kruskal(graph):
    edges = sorted((weight, u, v) for u in graph for v, weight in graph[u].items() if u < v)
    sets = UnionFind(graph)
    tree = []
    for weight, u, v in edges:
        if sets.union(u, v):
            tree.append((u, v, weight))
            if len(tree) == len(graph) - 1:
                break
    return tree
```

- Each undirected edge is stored twice in the graph, once under each end. `if u < v` keeps one copy.
- Tuples sort item by item, so with the weight first, `sorted` puts the edges in order of weight.
- `union` returns `False` when both ends are already in one group. That one call is both the cycle test and the merge.
- Once the tree has `V - 1` edges it is complete, and `break` ends the search early.

## Prim's algorithm

### The idea

Start from one vertex. Again and again, add the cheapest edge that leads from the tree to a vertex not yet in it.

<WeightedGraph mode="prim" />

The tree stays in one piece and grows by one vertex at each step. A [heap](/trees/heap) holds the edges found so far that lead out of the tree, cheapest on top.

In the diagram the tree holds A, B and C. Two edges leave it: B-D (6) and C-E (4). C-E is cheaper, so E joins next. A-C (5) does not count, because both its ends are already in the tree.

### Step by step

<WeightedTrace algorithm="prim" />

Each heap entry is `(weight, u, v)`: an edge from `u`, which was in the tree when the entry was pushed, to `v`. The start is A, with A's two edges in the heap.

1. Pop `(2, A, B)`. Add B, and push its edges to C and D.
2. Pop `(1, B, C)`. Add C, and push C-E.
3. Pop `(4, C, E)`. Add E, and push E-D and E-F.
4. Pop `(3, E, D)`. Add D, and push D-F.
5. Pop `(5, A, C)`. C joined the tree in step 2, so skip it.
6. Pop `(6, B, D)`. D is in the tree too. Skip it.
7. Pop `(8, E, F)`. Add F. All six vertices are in the tree, so the algorithm stops.

The result is the same tree that Kruskal's algorithm found, weight 18, built in a different order. Skipping an entry whose far end is already in the tree is the same lazy deletion as in [Dijkstra's algorithm](/graphs/shortest-paths): the heap cannot remove such an entry early, so it is thrown away when popped.

### The code

```py
def prim(graph, start):
    in_tree = {start}
    tree = []
    heap = [(weight, start, v) for v, weight in graph[start].items()]
    heapq.heapify(heap)
    while heap and len(in_tree) < len(graph):
        weight, u, v = heapq.heappop(heap)
        if v in in_tree:
            continue
        in_tree.add(v)
        tree.append((u, v, weight))
        for neighbour, edge_weight in graph[v].items():
            if neighbour not in in_tree:
                heapq.heappush(heap, (edge_weight, v, neighbour))
    return tree
```

An edge is pushed only when its far end is outside the tree. When that end joins later, the edge is not pushed back the other way, because the near end is in the tree by then. So each edge enters the heap at most once.

## Not a shortest-path tree

<WeightedGraph mode="compare" />

Prim's algorithm looks a lot like Dijkstra's: a heap, a set of vertices that grows, lazy deletion. The difference is what the heap is ordered by. In Prim's algorithm it is the weight of a single edge. In Dijkstra's it is the whole distance from the start. So they build different trees.

On this graph the minimum spanning tree uses D-E (3), while the shortest paths from A use B-D (6). The spanning tree is cheaper in total, 18 against 21. But in the spanning tree the route from A to D is A, B, C, E, D, which costs 10, while the shortest path A, B, D costs 8.

A minimum spanning tree makes the whole network cheap. It does not promise a short route between any two vertices.

## Full implementation

```python
import heapq

class UnionFind:
    def __init__(self, items):
        self.parent = {item: item for item in items}
        self.group_size = {item: 1 for item in items}

    def find(self, item):
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        return True

def kruskal(graph):
    edges = sorted((weight, u, v) for u in graph for v, weight in graph[u].items() if u < v)
    sets = UnionFind(graph)
    tree = []
    for weight, u, v in edges:
        if sets.union(u, v):
            tree.append((u, v, weight))
            if len(tree) == len(graph) - 1:
                break
    return tree

def prim(graph, start):
    in_tree = {start}
    tree = []
    heap = [(weight, start, v) for v, weight in graph[start].items()]
    heapq.heapify(heap)
    while heap and len(in_tree) < len(graph):
        weight, u, v = heapq.heappop(heap)
        if v in in_tree:
            continue
        in_tree.add(v)
        tree.append((u, v, weight))
        for neighbour, edge_weight in graph[v].items():
            if neighbour not in in_tree:
                heapq.heappush(heap, (edge_weight, v, neighbour))
    return tree

graph = {
    'A': {'B': 2, 'C': 5},
    'B': {'A': 2, 'C': 1, 'D': 6},
    'C': {'A': 5, 'B': 1, 'E': 4},
    'D': {'B': 6, 'E': 3, 'F': 9},
    'E': {'C': 4, 'D': 3, 'F': 8},
    'F': {'D': 9, 'E': 8},
}

tree = kruskal(graph)
print(tree)
print(sum(weight for u, v, weight in tree))

tree = prim(graph, 'A')
print(tree)
print(sum(weight for u, v, weight in tree))

two_pieces = {'A': {'B': 1}, 'B': {'A': 1}, 'C': {'D': 2}, 'D': {'C': 2}}
print(kruskal(two_pieces))
print(prim(two_pieces, 'A'))
```

On a graph in two pieces, Kruskal's algorithm returns a forest with one tree per piece, and Prim's algorithm stops at the edge of the piece it started in.

## Analysis

`V` is the number of vertices and `E` the number of edges.

Kruskal's algorithm:

| Step | Cost |
| --- | --- |
| List each edge once | `O(V + E)` |
| Sort the edges by weight | `O(E log V)` |
| Set up union-find | `O(V)` |
| One `union` per edge | `O(E α(V))` [amortized](/arrays/dynamic-array) |
| Total on a connected graph | `O(E log V)` |
| Space: the edge list and union-find | `O(V + E)` |

Prim's algorithm:

| Step | Cost |
| --- | --- |
| Push each edge at most once, `O(log V)` each | `O(E log V)` |
| Pop each pushed edge once, `O(log V)` each | `O(E log V)` |
| Look at the edges of each vertex as it joins | `O(V + E)` |
| Total on a connected graph | `O(E log V)` |
| Space: the heap and the set of tree vertices | `O(V + E)` |

Sorting `E` edges costs `O(E log E)`. Since `E` is less than `V²`, [`log E`](/foundations/measuring-cost) is less than `2 log V`, so that is `O(E log V)`. The same goes for a heap that holds up to `E` edges. The `α(V)` in the union-find row is the inverse Ackermann function from the [Union-Find](/graphs/union-find) page, which is below 5 for any real input, so the sort is what dominates Kruskal's algorithm. Both totals assume a connected graph, where `E` is at least `V - 1`, so the terms in `V` fit inside `O(E log V)`. They are worst-case bounds. Kruskal's algorithm always sorts every edge, so stopping early saves it only some `union` calls.

## In Python

The standard library has no spanning-tree function and no union-find. Two built-ins do the heavy lifting: `sorted` gives Kruskal's algorithm its edge order, and `heapq` gives Prim's algorithm its queue.

Edges often arrive as a list of `(u, v, weight)` tuples, with the weight last. Then sort with a `key` instead of moving the weight to the front:

```python
from operator import itemgetter

cables = [('A', 'C', 5), ('B', 'C', 1), ('A', 'B', 2), ('D', 'E', 3), ('C', 'E', 4)]
print(sorted(cables, key=itemgetter(2)))
print(min(cables, key=itemgetter(2)))

graph = {'A': {'B': 2}, 'B': {'A': 2, 'C': 1}, 'C': {'B': 1}}
print([(u, v, weight) for u in graph for v, weight in graph[u].items()])
print([(u, v, weight) for u in graph for v, weight in graph[u].items() if u < v])
```

`itemgetter(2)` picks the third item of each tuple. The last two lines show why Kruskal's code needs `u < v`: without it, every undirected edge is listed twice.

## When to use

- Connecting everything as cheaply as possible: cables, pipes, roads, circuit wiring.
- Grouping: build the minimum spanning tree and remove its heaviest edges, and the pieces that remain are groups of nearby vertices.
- Kruskal's algorithm suits a graph given as a list of edges. Prim's algorithm suits a graph stored as neighbour dictionaries, like the one on this page.
- For the cheapest route between two vertices, use [Dijkstra's algorithm](/graphs/shortest-paths) instead. A minimum spanning tree does not give shortest routes.

## Key points

- A spanning tree connects all `V` vertices with `V - 1` edges and no cycle. A minimum spanning tree has the smallest total weight.
- Kruskal's algorithm takes edges from lightest to heaviest and skips any edge whose ends union-find already has in one group.
- Prim's algorithm grows one tree from a start vertex, always adding the cheapest edge out of it, using a heap with lazy deletion.
- Both cost `O(E log V)`. When all weights differ, both find the same tree.
- A minimum spanning tree keeps the total small, not the distance from one vertex. It is not a shortest-path tree.

## Exercise

At least one house is present. Houses numbered `0` to `count - 1` can be linked by cables, and each cable is given as `(cost, a, b)`. Write `connect_cost`, which returns the lowest total cost that links every house, or `None` if some house cannot be reached. Use the `UnionFind` class.

```python
class UnionFind:
    def __init__(self, items):
        self.parent = {item: item for item in items}
        self.group_size = {item: 1 for item in items}

    def find(self, item):
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        return True

def connect_cost(count, cables):
    pass

print(connect_cost(4, [(5, 0, 1), (1, 1, 2), (4, 0, 2), (2, 2, 3), (7, 1, 3)]))
print(connect_cost(4, [(1, 0, 1), (2, 1, 2)]))
print(connect_cost(1, []))
```

::: details Solution
This is Kruskal's algorithm on a list of edges. The cost comes first in each tuple, so `sorted(cables)` already puts the cheapest first. Keep every cable that `union` accepts. A connected result needs `count - 1` cables, so fewer means some house was left out.

```python
class UnionFind:
    def __init__(self, items):
        self.parent = {item: item for item in items}
        self.group_size = {item: 1 for item in items}

    def find(self, item):
        root = item
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[item] != root:
            next_item = self.parent[item]
            self.parent[item] = root
            item = next_item
        return root

    def union(self, a, b):
        root_a, root_b = self.find(a), self.find(b)
        if root_a == root_b:
            return False
        if self.group_size[root_a] < self.group_size[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        self.group_size[root_a] += self.group_size[root_b]
        return True

def connect_cost(count, cables):
    sets = UnionFind(range(count))
    total = 0
    used = 0
    for cost, a, b in sorted(cables):
        if sets.union(a, b):
            total += cost
            used += 1
    if used < count - 1:
        return None
    return total

print(connect_cost(4, [(5, 0, 1), (1, 1, 2), (4, 0, 2), (2, 2, 3), (7, 1, 3)]))
print(connect_cost(4, [(1, 0, 1), (2, 1, 2)]))
print(connect_cost(1, []))
```

In the first network the cables 1-2, 2-3 and 0-2 cost 1 + 2 + 4 = 7. In the second, house 3 has no cable at all. A single house needs no cables, so its cost is 0. **Time** `O(E log E)` for `V` houses and `E` cables, because of the sort. **Space** `O(V + E)`.
:::
