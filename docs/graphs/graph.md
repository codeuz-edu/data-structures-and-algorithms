---
title: Graph
description: "Graphs in Python: vertices and edges, adjacency lists and matrices, directed and weighted graphs, a Graph class, breadth-first and depth-first search, grids, and shortest paths, with diagrams."
---

# Graph

A graph consists of vertices and the edges that connect them. Cities and roads form one graph. People and their friendships form another. Representing the connections explicitly lets us ask what can be reached from a given vertex.

A [tree](/trees/binary-tree) is a restricted graph: it is connected and has no cycles. A rooted tree, like the binary trees on this site, also picks one vertex as the root. A general graph has none of these rules.

**You need:** [Queue](/stacks-queues/queue), [Stack](/stacks-queues/stack), [Hash Table](/hash-tables/hash-table) and [Recursion](/recursion/recursion).

## Interface

A `Graph` class builds the graph. The search functions take a dict that maps each vertex to its neighbours: a plain dict as in [Adjacency list](#adjacency-list), or the `adjacency` dict of a `Graph`.

| Operation | What it does | Cost |
| --- | --- | --- |
| `Graph(directed=False)` | Make an empty graph, undirected unless `directed` is true | `O(1)` |
| `add_vertex(vertex)` | Add a vertex with no edges, if it is not there yet | `O(1)` average |
| `add_edge(u, v, weight=1)` | Add an edge from `u` to `v`, and from `v` to `u` when undirected; add missing vertices | `O(1)` average |
| `remove_edge(u, v)` | Remove that edge; raise `KeyError` if it is not there | `O(1)` average |
| `neighbours(vertex)` | Return a list of the vertices that `vertex` has an edge to | `O(degree)` |
| `len(graph)` | Return the number of vertices | `O(1)` |
| `bfs(graph, start)` | Return the vertices reachable from `start`, nearest first | `O(V + E)` |
| `dfs(graph, vertex, seen, order)` | Visit the vertices reachable from `vertex`, going as deep as possible first, and add them to `order` | `O(V + E)` |
| `dfs_iterative(graph, start)` | Depth-first search with an explicit stack in place of recursion; return the visit order | `O(V + E)` |
| `shortest_path(graph, start, goal)` | Return a path from `start` to `goal` with the fewest edges, or `None` if there is none | `O(V + E)` |

`V` is the number of vertices, `E` the number of edges, and the degree of a vertex is its number of edges. The class keeps its edges in dicts, so the costs marked average are the [average](/foundations/measuring-cost#best-worst-and-average-case) costs of dict operations.

## Terms

<GraphDiagram />

- Two vertices joined by an edge are **neighbours**. B has three: A, D and E.
- The **degree** of a vertex is the number of edges that meet at it. B has degree 3 and F has degree 1.
- A **path** is a sequence of vertices, each joined to the next by an edge, such as A, B, E, F.
- A **cycle** is a path that returns to where it started. A, B, D, C, A is one.
- A graph is **connected** when there is a path between every two of its vertices. This one is.
- A **connected component** is a largest group of vertices that can all reach one another. A connected graph has one. Without the edge from E to F this graph would have two: F on its own, and the other five.
- In an **undirected** graph an edge works both ways. In a **directed** graph each edge has a direction, like a one-way street.
- In a **weighted** graph each edge carries a number, such as a distance.

The graph on this page is undirected and has no weights.

## Storing a graph

### Adjacency list

Keep, for each vertex, the list of its neighbours. A [dictionary](/hash-tables/hash-table) does this directly.

```python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'D'],
    'D': ['B', 'C', 'E'],
    'E': ['B', 'D', 'F'],
    'F': ['E'],
}

print(graph['B'])
print('D' in graph['A'])
```

Each undirected edge appears twice, once from each end. The length of a vertex's list is its degree.

### Adjacency matrix

The other option is a table with one row and one column per vertex. A 1 means the two vertices are joined.

| | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- |
| **A** | 0 | 1 | 1 | 0 | 0 | 0 |
| **B** | 1 | 0 | 0 | 1 | 1 | 0 |
| **C** | 1 | 0 | 0 | 1 | 0 | 0 |
| **D** | 0 | 1 | 1 | 0 | 1 | 0 |
| **E** | 0 | 1 | 0 | 1 | 0 | 1 |
| **F** | 0 | 0 | 0 | 0 | 1 | 0 |

| | Adjacency list | Adjacency matrix |
| --- | --- | --- |
| Memory | `O(V + E)` | `O(V²)` |
| Is there an edge between two vertices? | `O(degree)` | `O(1)` |
| List the neighbours of a vertex | `O(degree)` | `O(V)` |
| Add an edge | `O(1)` [amortized](/arrays/dynamic-array) | `O(1)` |

Most real graphs have few edges compared with `V²`, so the adjacency list is the usual choice.

## Directed and weighted graphs

<Diagram label="Directed and weighted" :width="600" :height="206" alt="Two versions of the square A, B, C, D from the graph above. Left, directed: arrows go from A to B, A to C, B to D and D to C, so no edge leaves C. Right, weighted and undirected: A-B has weight 2, A-C 5, B-D 6 and C-D 3.">
 <DGraph directed :nodes="[{ id: 'A', x: 80, y: 50 }, { id: 'B', x: 220, y: 50 }, { id: 'C', x: 80, y: 150 }, { id: 'D', x: 220, y: 150 }]" :edges="[{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'D' }, { from: 'D', to: 'C' }]" />
 <DGraph :nodes="[{ id: 'A', x: 380, y: 50 }, { id: 'B', x: 520, y: 50 }, { id: 'C', x: 380, y: 150 }, { id: 'D', x: 520, y: 150 }]" :edges="[{ from: 'B', to: 'A', label: 2 }, { from: 'A', to: 'C', label: 5 }, { from: 'C', to: 'D', label: 3 }, { from: 'D', to: 'B', label: 6 }]" />
 <text class="dg-label" x="150" y="196">directed</text>
 <text class="dg-label" x="450" y="196">weighted</text>
</Diagram>

Directed and weighted graphs are stored the same way, as a dict keyed by vertex. Only what each entry holds changes.

- In a directed graph each edge is stored once, in the list of the vertex it leaves. Every vertex is still a key, even C, which points nowhere. [Topological Sort](/graphs/topological-sort) works on graphs like this.
- In a weighted graph a dict of dicts stores the weights: `graph[u][v]` is the weight of the edge from `u` to `v`. Iterating over `graph[u]` still gives the neighbours, so BFS and DFS work on it unchanged. [Shortest Paths](/graphs/shortest-paths) uses this form.

```python
directed = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': [],
    'D': ['C'],
}

weighted = {
    'A': {'B': 2, 'C': 5},
    'B': {'A': 2, 'D': 6},
    'C': {'A': 5, 'D': 3},
    'D': {'B': 6, 'C': 3},
}

edges = [('A', 'B', 2), ('A', 'C', 5), ('B', 'D', 6), ('C', 'D', 3)]

print(directed['D'], 'D' in directed['C'])
print(weighted['C']['D'], list(weighted['C']))
print(len(edges), 'edges, total weight', sum(weight for u, v, weight in edges))
```

Two more forms are common. A dict of sets is like a dict of lists, but its edge test is `O(1)` on average; [In Python](#in-python) explains its catch. An edge list, the last one above, keeps one `(u, v, weight)` tuple per edge. It is compact and easy to sort, which is how Kruskal's algorithm on [Minimum Spanning Tree](/graphs/minimum-spanning-tree) takes its edges, but it has to be turned into a dict before a search can find a vertex's neighbours.

## A Graph class

Keeping both ends of every undirected edge in step by hand is easy to get wrong. A small class does the bookkeeping. It stores a dict of dicts, so one class holds weighted and unweighted graphs alike: an edge added without a weight gets weight 1.

```py
class Graph:
    def __init__(self, directed=False):
        self.directed = directed
        self.adjacency = {}

    def __len__(self):
        return len(self.adjacency)

    def add_vertex(self, vertex):
        if vertex not in self.adjacency:
            self.adjacency[vertex] = {}

    def add_edge(self, u, v, weight=1):
        self.add_vertex(u)
        self.add_vertex(v)
        self.adjacency[u][v] = weight
        if not self.directed:
            self.adjacency[v][u] = weight

    def remove_edge(self, u, v):
        del self.adjacency[u][v]
        if not self.directed and u != v:
            del self.adjacency[v][u]

    def neighbours(self, vertex):
        return list(self.adjacency[vertex])
```

- `add_edge` adds both ends as vertices, so every vertex is a key, even one that no edge leaves.
- An undirected edge is written under both ends and removed from both. An edge from a vertex to itself is stored only once, hence the `u != v`.
- `remove_edge` and `neighbours` raise `KeyError` for an edge or a vertex that is not there, as a `dict` does.

Each method except `neighbours` does a fixed number of dict operations, so it costs `O(1)` on average. `neighbours` copies the keys into a list, `O(degree)`. A dict keeps its keys in the order they were added, so the neighbours always come out in the same order.

`graph.adjacency` maps each vertex to its neighbours, so the searches below take it as it is. So do the functions on the Topological Sort, Shortest Paths and Minimum Spanning Tree pages.

## Breadth-first search

<GraphDiagram mode="bfs" />

Breadth-first search, or BFS, visits the start vertex, then all its neighbours, then their neighbours, moving outwards one ring at a time. It uses a [queue](/stacks-queues/queue).

1. Put the start vertex in the queue and mark it as seen.
2. Take a vertex from the front of the queue and visit it.
3. Add each of its neighbours that has not been seen, and mark them.
4. Repeat until the queue is empty.

```py
def bfs(graph, start):
    order = []
    seen = {start}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbour in graph[vertex]:
            if neighbour not in seen:
                seen.add(neighbour)
                queue.append(neighbour)
    return order
```

The `seen` set is what stops the search from going around a cycle forever. A vertex is marked when it enters the queue, so it can never be added twice.

Each vertex enters the queue once, and each edge is looked at once from each end, so BFS costs `O(V + E)`.

BFS reaches each vertex accessible from the start by a path with the fewest possible edges. That makes it the way to find a shortest path in an unweighted graph, as the [Application](#application) below does. On a tree, BFS is the [level order](/trees/binary-tree#level-order) traversal.

## Depth-first search

<GraphDiagram mode="dfs" />

Depth-first search, or DFS, follows one path as far as it can go. When it gets stuck it steps back to the last vertex that still has an unvisited neighbour. [Recursion](/recursion/recursion) does the stepping back for free.

1. Mark the vertex as seen and visit it.
2. For each neighbour that has not been seen, run the same search from that neighbour.
3. When no unseen neighbour is left, return to the vertex the search came from.

```py
def dfs(graph, vertex, seen, order):
    seen.add(vertex)
    order.append(vertex)
    for neighbour in graph[vertex]:
        if neighbour not in seen:
            dfs(graph, neighbour, seen, order)
```

From A the search runs through B and D to C. Both neighbours of C are already seen, so it returns to D and continues with E, then F.

Like BFS, it visits each vertex once and looks at each edge once from each end, so it costs `O(V + E)`. The calls can nest up to `V` deep.

Python [stops a recursion](/recursion/recursion#when-it-goes-wrong) that goes about 1000 calls deep. For a long path or a very large graph, use an explicit stack, as in the next section.

DFS is the base for finding cycles, for [ordering tasks](/graphs/topological-sort) that depend on each other, and for exploring mazes.

## Iterative depth-first search

<GraphDiagram mode="iterative" />

A [stack](/stacks-queues/stack) can remember where to step back to in place of the call stack, and its size is limited by available memory.

1. Push the start vertex.
2. Pop a vertex. If it has been visited already, skip it.
3. Otherwise visit it, and push each of its neighbours that has not been visited.
4. Repeat until the stack is empty.

```py
def dfs_iterative(graph, start):
    order = []
    seen = set()
    stack = [start]
    while stack:
        vertex = stack.pop()
        if vertex in seen:
            continue
        seen.add(vertex)
        order.append(vertex)
        for neighbour in graph[vertex]:
            if neighbour not in seen:
                stack.append(neighbour)
    return order
```

A vertex is marked when it comes off the stack, not when it goes on, so the same vertex can be pushed more than once. Marking on push, as BFS does, is shorter, but then a vertex pushed early is skipped when the search reaches it again from deeper down, and the search is no longer depth-first.

| Pop | What happens | Stack afterwards, top on the right |
| --- | --- | --- |
| A | visit, push B and C | B C |
| C | visit, push D | B D |
| D | visit, push B and E | B B E |
| E | visit, push B and F | B B B F |
| F | visit | B B B |
| B | visit | B B |
| B | skip, already visited | B |
| B | skip, already visited | empty |

The visit order is A, C, D, E, F, B, not the A, B, D, C, E, F of the recursive version. The stack gives back the neighbour pushed last, so C, the last of A's neighbours, is explored before B. Both orders are depth-first. To get the recursive order, push the neighbours in reverse with `for neighbour in reversed(graph[vertex]):`, so that the first one in the list comes off the stack first.

The cost is still `O(V + E)`. Each vertex is visited once, and each edge puts at most one entry on the stack from each of its ends, so the stack never holds more than `O(E + 1)` entries.

## Grids as graphs

Many graphs are never stored at all. In a grid, such as a maze, a game board or the pixels of an image, every cell is a vertex. Its neighbours are the cells directly above, below, left and right of it, worked out from its position `(row, col)` when they are needed.

<Diagram label="Flood fill from row 3, column 0" cost="O(n)" :width="600" :height="196" alt="A grid of 4 rows and 6 columns with walls. Flood fill starts at row 3, column 0, the bottom left cell. Each cell it reaches shows its distance in steps from the start: 0 to 3 along the bottom row, 4 to 6 up column 3, 7 and 8 along the top row, and 9 to 11 down the last column. The four cells at the top left are cut off by walls and are not reached.">
 <DCells :x="150" :y="24" :w="40" :h="36" :values="[null, null, '#', 6, 7, 8]" :states="{ 2: 'muted', 3: 'done', 4: 'done', 5: 'done' }" />
 <DCells :x="150" :y="60" :w="40" :h="36" :values="[null, null, '#', 5, '#', 9]" :states="{ 2: 'muted', 3: 'done', 4: 'muted', 5: 'done' }" />
 <DCells :x="150" :y="96" :w="40" :h="36" :values="['#', '#', '#', 4, '#', 10]" :states="{ 0: 'muted', 1: 'muted', 2: 'muted', 3: 'done', 4: 'muted', 5: 'done' }" />
 <DCells :x="150" :y="132" :w="40" :h="36" :values="[0, 1, 2, 3, '#', 11]" :states="{ 0: 'hit', 1: 'done', 2: 'done', 3: 'done', 4: 'muted', 5: 'done' }" indices />
 <text class="dg-index" x="134" y="42">0</text><text class="dg-index" x="134" y="78">1</text><text class="dg-index" x="134" y="114">2</text><text class="dg-index" x="134" y="150">3</text>
 <text class="dg-note start" x="414" y="62">filled: the start</text>
 <text class="dg-note start" x="414" y="82">number: steps from the start</text>
 <text class="dg-note start" x="414" y="102">#: wall</text>
 <text class="dg-note start" x="414" y="122">empty: not reached</text>
</Diagram>

Flood fill, the paint bucket of a drawing program, gives a region a new colour: the cell you click and every cell of the same colour that can be reached from it, one neighbour at a time. It is a BFS over cells.

1. Note the colour of the start cell, paint the start, and put it in the queue.
2. Take a cell from the queue. Paint each of its four neighbours that lies inside the grid and still has the old colour, and add it to the queue.
3. Repeat until the queue is empty.

```python
from collections import deque

def flood_fill(grid, start, colour):
    row, col = start
    old = grid[row][col]
    if old == colour:
        return
    grid[row][col] = colour
    queue = deque([start])
    while queue:
        row, col = queue.popleft()
        for r, c in [(row - 1, col), (row + 1, col), (row, col - 1), (row, col + 1)]:
            if 0 <= r < len(grid) and 0 <= c < len(grid[0]) and grid[r][c] == old:
                grid[r][c] = colour
                queue.append((r, c))

grid = [list(row) for row in ['..#...', '..#.#.', '###.#.', '....#.']]
flood_fill(grid, (3, 0), 'o')
for row in grid:
    print(''.join(row))
```

A painted cell no longer has the old colour, so the paint itself marks it as seen and no `seen` set is needed. That is also why the function returns at once when the new colour equals the old one: otherwise painted cells would still match, and the search would never end.

A cell has at most four neighbours. For a grid of `n` cells, `V` is `n` and `E` is less than `2n`, so flood fill costs `O(n)`.

## Full implementation

```python
from collections import deque

class Graph:
    def __init__(self, directed=False):  # O(1)
        self.directed = directed
        self.adjacency = {}

    def __len__(self):  # O(1)
        return len(self.adjacency)

    def add_vertex(self, vertex):  # O(1) average
        if vertex not in self.adjacency:
            self.adjacency[vertex] = {}

    def add_edge(self, u, v, weight=1):  # O(1) average
        self.add_vertex(u)
        self.add_vertex(v)
        self.adjacency[u][v] = weight
        if not self.directed:
            self.adjacency[v][u] = weight

    def remove_edge(self, u, v):  # O(1) average
        del self.adjacency[u][v]
        if not self.directed and u != v:
            del self.adjacency[v][u]

    def neighbours(self, vertex):  # O(degree)
        return list(self.adjacency[vertex])

def bfs(graph, start):  # O(V + E)
    order = []
    seen = {start}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbour in graph[vertex]:
            if neighbour not in seen:
                seen.add(neighbour)
                queue.append(neighbour)
    return order

def dfs(graph, vertex, seen, order):  # O(V + E)
    seen.add(vertex)
    order.append(vertex)
    for neighbour in graph[vertex]:
        if neighbour not in seen:
            dfs(graph, neighbour, seen, order)

def dfs_iterative(graph, start):  # O(V + E)
    order = []
    seen = set()
    stack = [start]
    while stack:
        vertex = stack.pop()
        if vertex in seen:
            continue
        seen.add(vertex)
        order.append(vertex)
        for neighbour in graph[vertex]:
            if neighbour not in seen:
                stack.append(neighbour)
    return order

def shortest_path(graph, start, goal):  # O(V + E)
    previous = {start: None}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        if vertex == goal:
            path = []
            while vertex is not None:
                path.append(vertex)
                vertex = previous[vertex]
            return path[::-1]
        for neighbour in graph[vertex]:
            if neighbour not in previous:
                previous[neighbour] = vertex
                queue.append(neighbour)
    return None

graph = Graph()
for u, v in [('A', 'B'), ('A', 'C'), ('B', 'D'), ('C', 'D'), ('B', 'E'), ('D', 'E'), ('E', 'F')]:
    graph.add_edge(u, v)
print(len(graph), 'vertices, B has', graph.neighbours('B'))

print('bfs', bfs(graph.adjacency, 'A'))
order = []
dfs(graph.adjacency, 'A', set(), order)
print('dfs', order)
print('dfs_iterative', dfs_iterative(graph.adjacency, 'A'))
print('path', shortest_path(graph.adjacency, 'C', 'F'))

graph.remove_edge('E', 'F')
print('path', shortest_path(graph.adjacency, 'C', 'F'))

tasks = Graph(directed=True)
tasks.add_edge('boil', 'pasta')
print(tasks.neighbours('boil'), tasks.neighbours('pasta'))

line = Graph()
for i in range(2999):
    line.add_edge(i, i + 1)
print('long path', len(dfs_iterative(line.adjacency, 0)))
```

The edges are added in the same order as the lists in [Adjacency list](#adjacency-list), so the searches give the orders drawn in the diagrams. Once the edge E-F is gone, F cannot be reached and `shortest_path` returns `None`. In the directed graph `pasta` is a vertex with no edges leaving it. The last lines build a path of 3000 vertices: `dfs_iterative` walks all of it, where the recursive `dfs` would stop with `RecursionError`. `shortest_path` is explained in the [Application](#application).

## In Python

Python has no graph type. A dict that maps each vertex to its neighbours is the usual way to hold a graph, and the standard library supplies the rest. Outside it, NetworkX is the package most programs use for graphs.

- `collections.deque` is the queue for BFS: `append` and `popleft` are both `O(1)`. A `list` with `pop(0)` shifts every remaining item on each call, which is `O(V)` per step (see [Queue](/stacks-queues/queue)).
- A dict of sets in place of lists makes "is there an edge?" `O(1)` on average instead of `O(degree)`. The catch is order. A set of strings comes out in a different order from one run of Python to the next, so BFS and DFS visit the vertices in a different order too. Sort the neighbours when you need a fixed order, or use a dict of dicts, as the `Graph` class does: its keys keep the order they were added in.
- `graphlib.TopologicalSorter` puts tasks in an order where each one comes after the tasks it depends on. [Topological Sort](/graphs/topological-sort) shows how it works.

```python
graph = {
    'A': {'B', 'C'},
    'B': {'A', 'D', 'E'},
    'C': {'A', 'D'},
    'D': {'B', 'C', 'E'},
    'E': {'B', 'D', 'F'},
    'F': {'E'},
}

print('E' in graph['B'], 'E' in graph['A'])
print(sorted(graph['B']))
```

## Costs at a glance

| Operation | Cost |
| --- | --- |
| `add_vertex`, `add_edge`, `remove_edge` | `O(1)` average |
| `neighbours` | `O(degree)` |
| `bfs` | `O(V + E)` |
| `dfs` or `dfs_iterative` | `O(V + E)` |
| `shortest_path` | `O(V + E)` |
| Flood fill on a grid of `n` cells | `O(n)` |
| Space | `O(V + E)` |

Each vertex is visited once and each edge is looked at once from each end, which gives `V + E`. This counts each dict and set lookup as `O(1)`, which is its average cost.

The space is the adjacency list, which stores each undirected edge twice. A search needs `O(V)` more for `seen` and for its queue or call stack, and the stack in `dfs_iterative` can grow to `O(E + 1)` entries.

## When to use

Use a graph when the data is a set of things and the connections between them, and the connections do not form a hierarchy: roads, computer networks, links between pages, tasks that depend on other tasks. A rooted [tree](/trees/binary-tree) is simpler when every item is reachable from a single root and every other item has exactly one parent. If all you need to know is whether two items are connected, while connections keep being added, [union-find](/graphs/union-find) does it with less work. [Choosing a Structure](/choosing-a-structure) compares the options side by side.

Pick BFS when you need the fewest edges, and either search when you only need to reach everything. On long paths use BFS or `dfs_iterative`, not the recursive `dfs`.

## Application

Who can introduce Ana to Gus? In a friendship graph each person is a vertex and each friendship is an edge, so the shortest chain of introductions is a shortest path.

<Diagram label="Shortest path from Ana to Gus" cost="O(V + E)" :width="600" :height="200" alt="Seven people joined by friendships. Ana is friends with Ben and Cal. Ben is friends with Dev, Cal with Eva, Dev with Eva and Fay, and Gus with Eva and Fay. The shortest path from Ana to Gus goes Ana, Cal, Eva, Gus and is highlighted. Every route through Ben has at least four edges.">
 <DGraph :r="20" :nodes="[{ id: 'Ana', x: 70, y: 100, state: 'hit' }, { id: 'Ben', x: 200, y: 40 }, { id: 'Cal', x: 200, y: 160, state: 'hit' }, { id: 'Dev', x: 330, y: 40 }, { id: 'Eva', x: 330, y: 160, state: 'hit' }, { id: 'Fay', x: 460, y: 40 }, { id: 'Gus', x: 560, y: 100, state: 'hit' }]" :edges="[{ from: 'Ana', to: 'Ben', state: 'muted' }, { from: 'Ana', to: 'Cal', state: 'accent' }, { from: 'Ben', to: 'Dev', state: 'muted' }, { from: 'Cal', to: 'Eva', state: 'accent' }, { from: 'Dev', to: 'Eva', state: 'muted' }, { from: 'Dev', to: 'Fay', state: 'muted' }, { from: 'Eva', to: 'Gus', state: 'accent' }, { from: 'Fay', to: 'Gus', state: 'muted' }]" />
</Diagram>

`shortest_path` is BFS with one addition: a dict `previous` that records, for each vertex, the vertex it was reached from. It also does the job of the `seen` set.

1. Run BFS from the start.
2. When a neighbour is reached for the first time, store the vertex it was reached from in `previous`.
3. When the goal comes off the queue, follow `previous` back to the start, then reverse the list.
4. If the queue runs empty first, there is no path: return `None`.

```python
from collections import deque

def shortest_path(graph, start, goal):
    previous = {start: None}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        if vertex == goal:
            path = []
            while vertex is not None:
                path.append(vertex)
                vertex = previous[vertex]
            return path[::-1]
        for neighbour in graph[vertex]:
            if neighbour not in previous:
                previous[neighbour] = vertex
                queue.append(neighbour)
    return None

friends = {
    'Ana': ['Ben', 'Cal'],
    'Ben': ['Ana', 'Dev'],
    'Cal': ['Ana', 'Eva'],
    'Dev': ['Ben', 'Eva', 'Fay'],
    'Eva': ['Cal', 'Dev', 'Gus'],
    'Fay': ['Dev', 'Gus'],
    'Gus': ['Eva', 'Fay'],
}

path = shortest_path(friends, 'Ana', 'Gus')
print(' -> '.join(path))
print(len(path) - 1, 'steps')
```

BFS works outwards one ring at a time, so the first route it finds to Gus is a shortest one. The routes through Ben are at least one step longer, and BFS never returns them.

The same searches turn up in many other places:

- Networks: the fewest hops between two computers is a BFS. When links have different delays, the fastest route needs [Shortest Paths](/graphs/shortest-paths).
- Social networks: friends of friends are the people at distance 2 in a BFS.
- Web crawlers: a BFS over pages, with a `seen` set of addresses so no page is fetched twice.
- Build tools and package managers: dependencies form a directed graph, which a [topological sort](/graphs/topological-sort) puts in order.
- Mazes and images: [grids](#grids-as-graphs), searched cell by cell.

## Where next

- [Topological Sort](/graphs/topological-sort): directed graphs without cycles, and putting tasks in an order that respects their dependencies.
- [Shortest Paths](/graphs/shortest-paths): weighted graphs, and Dijkstra's algorithm for the route with the least total weight.
- [Minimum Spanning Tree](/graphs/minimum-spanning-tree): the cheapest set of edges that connects every vertex, with Kruskal's and Prim's algorithms.

## Key points

- A graph is vertices joined by edges. A dict of neighbours stores it in `O(V + E)` space: lists or sets for plain edges, dicts for weights, each undirected edge under both ends.
- BFS uses a queue and moves outwards one ring at a time, so it finds paths with the fewest edges.
- DFS goes as deep as it can before stepping back, with recursion or with an explicit stack. The stack version avoids the Python recursion limit. Push neighbours in reverse to match the order of recursive DFS.
- Both searches cost `O(V + E)`, and a `seen` set keeps them from going around a cycle forever.
- A grid is a graph whose edges are worked out from the cell positions, so it needs no adjacency dict.

## Exercise

Write `count_components`, which returns how many connected components an undirected graph has. The `bfs` function from this page is included for you to use.

```python
from collections import deque

def bfs(graph, start):
    order = []
    seen = {start}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbour in graph[vertex]:
            if neighbour not in seen:
                seen.add(neighbour)
                queue.append(neighbour)
    return order

def count_components(graph):
    pass

graph = {
    'A': ['B'],
    'B': ['A', 'C'],
    'C': ['B'],
    'D': ['E'],
    'E': ['D'],
    'F': [],
}
print(count_components(graph))
print(count_components({'A': ['B'], 'B': ['A']}))
```

::: details Solution
Go through the vertices. Each time you meet one that has not been seen, it starts a new component: count it, then mark everything `bfs` reaches from it.

```python
from collections import deque

def bfs(graph, start):
    order = []
    seen = {start}
    queue = deque([start])
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbour in graph[vertex]:
            if neighbour not in seen:
                seen.add(neighbour)
                queue.append(neighbour)
    return order

def count_components(graph):
    seen = set()
    count = 0
    for vertex in graph:
        if vertex not in seen:
            count += 1
            seen.update(bfs(graph, vertex))
    return count

graph = {
    'A': ['B'],
    'B': ['A', 'C'],
    'C': ['B'],
    'D': ['E'],
    'E': ['D'],
    'F': [],
}
print(count_components(graph))
print(count_components({'A': ['B'], 'B': ['A']}))
```

**Time** `O(V + E)`, because each vertex and each edge belongs to exactly one search. **Space** `O(V)`.

[Union-Find](/graphs/union-find#when-to-use) answers the same question another way: add the edges one at a time and read the number of groups. That page says when each way is the better choice.
:::
