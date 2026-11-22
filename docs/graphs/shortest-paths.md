---
title: Shortest Paths
description: "Dijkstra's algorithm in Python: weighted graphs, a heap with lazy deletion, a step-by-step trace, rebuilding the path, and why negative edges break it."
---

# Shortest Paths

A path through a weighted graph costs the sum of its edge weights. Dijkstra’s algorithm finds the minimum cost from one starting vertex to each reachable vertex, provided all edge weights are nonnegative.

**You need:** [Graph](/graphs/graph), [Heap](/trees/heap) and [Measuring Cost](/foundations/measuring-cost).

## Weighted graphs

In a weighted graph every edge carries a number, its weight. Here the weight is a distance, and the length of a path is the sum of the weights along it.

<WeightedGraph />

A dictionary of dictionaries stores it. `graph[u]` maps each neighbour of `u` to the weight of the edge between them.

```python
graph = {
    'A': {'B': 2, 'C': 5},
    'B': {'A': 2, 'C': 1, 'D': 6},
    'C': {'A': 5, 'B': 1, 'E': 4},
    'D': {'B': 6, 'E': 3, 'F': 9},
    'E': {'C': 4, 'D': 3, 'F': 8},
    'F': {'D': 9, 'E': 8},
}

print(graph['B'])
print(graph['B']['D'])
print('F' in graph['A'])
```

This graph is undirected, so each edge is stored twice, once under each end. In a directed graph each edge is stored once, under the vertex it leaves. The code on this page works for both.

## The problem

Input: a weighted graph whose weights are all zero or more, and a start vertex. Output: the length of the shortest path from the start to every vertex it can reach, and a way to get the paths themselves.

When every edge counts the same, [breadth-first search](/graphs/graph) already solves this, because it reaches each vertex by a path with the fewest edges. With weights, fewest edges is no longer cheapest: from A, the single edge to C costs 5, while the two edges A, B, C cost 2 + 1 = 3.

## The idea

Dijkstra's algorithm settles vertices one at a time. A settled vertex has its final distance. For every other vertex it has reached, it keeps the shortest distance found so far.

<WeightedGraph mode="dijkstra" />

1. The start gets distance 0. Every other vertex is unknown, written ∞.
2. Among the vertices that are not settled, pick the one with the smallest distance so far, and settle it.
3. For each of its edges, check whether going through it gives the neighbour a shorter distance. If so, lower the neighbour's distance. This is called relaxing the edge.
4. Repeat until no reached vertex is left to pick.

The diagram shows the moment after A and B are settled. A gave C the distance 5. Then B found a shorter way, 2 + 1 = 3. C now has the smallest distance of the vertices not settled, so C is next.

Why is the picked vertex safe to settle? Any other route to it has to leave the settled vertices at some point, and the first vertex it reaches outside them already has a distance at least as large. The rest of that route can only add more, because no weight is negative.

A [heap](/trees/heap) finds the smallest distance fast. Each entry is a pair `(distance, vertex)`. Tuples compare item by item, so the entry with the smallest distance comes out first. When a distance drops, the code pushes a new entry and leaves the old one in the heap. The old entry is skipped when it comes out.

## Step by step

<WeightedTrace algorithm="dijkstra" />

Each row is one entry popped from the heap. The cells show every distance after that entry is handled.

1. Pop `(0, A)`. Settle A. Its edges give B the distance 2 and C the distance 5.
2. Pop `(2, B)`. Settle B. Through B, C costs 2 + 1 = 3, better than 5, so C drops to 3. D gets 2 + 6 = 8.
3. Pop `(3, C)`. Settle C. E gets 3 + 4 = 7.
4. Pop `(5, C)`. This is the old entry for C. C is settled at 3 already, so the entry is skipped.
5. Pop `(7, E)`. Settle E. Through E, D would cost 7 + 3 = 10, worse than 8, so D keeps 8. F gets 7 + 8 = 15.
6. Pop `(8, D)`. Settle D. Through D, F would cost 8 + 9 = 17, worse than 15.
7. Pop `(15, F)`. Settle F. The heap is empty.

The vertices are settled in order of distance: A 0, B 2, C 3, E 7, D 8, F 15.

## The code

```py
def dijkstra(graph, start):
    distance = {start: 0}
    previous = {start: None}
    heap = [(0, start)]
    while heap:
        dist, vertex = heapq.heappop(heap)
        if dist > distance[vertex]:
            continue
        for neighbour, weight in graph[vertex].items():
            candidate = dist + weight
            if candidate < distance.get(neighbour, math.inf):
                distance[neighbour] = candidate
                previous[neighbour] = vertex
                heapq.heappush(heap, (candidate, neighbour))
    return distance, previous
```

- `distance` holds the best distance found so far. A vertex that is missing has not been reached, and `math.inf` stands in for its distance.
- `previous` records the vertex each one was reached from. The next section uses it.
- The line `if dist > distance[vertex]` skips old entries.

Python's `heapq` has no way to find an entry in the heap and lower it. So when C drops from 5 to 3, the code pushes `(3, C)` and leaves `(5, C)` where it is. When `(5, C)` comes out later, `distance['C']` is already 3, so the entry is stale and is thrown away. This is called lazy deletion: an out-of-date entry is not removed when its distance changes, only later, when it is popped.

When you need the distance to one goal only, you can stop the first time the goal comes off the heap. Its distance is final at that point.

## Rebuilding the path

<WeightedGraph mode="paths" />

`distance` gives the length of each shortest path. `previous` gives the path itself: walk the links back from the goal to the start, then reverse the list.

```py
def path_to(previous, goal):
    if goal not in previous:
        return None
    path = []
    while goal is not None:
        path.append(goal)
        goal = previous[goal]
    return path[::-1]
```

From F the links go F, E, C, B, A, so the path is A, B, C, E, F, of length 2 + 1 + 4 + 8 = 15. Together the links form a tree rooted at A, the shortest-path tree, which holds one shortest path to every reachable vertex.

`previous` has to change whenever `distance` does. C was first reached from A. When B lowered C's distance, `previous['C']` became B.

## Full implementation

```python
import heapq
import math

def dijkstra(graph, start):
    distance = {start: 0}
    previous = {start: None}
    heap = [(0, start)]
    while heap:
        dist, vertex = heapq.heappop(heap)
        if dist > distance[vertex]:
            continue
        for neighbour, weight in graph[vertex].items():
            candidate = dist + weight
            if candidate < distance.get(neighbour, math.inf):
                distance[neighbour] = candidate
                previous[neighbour] = vertex
                heapq.heappush(heap, (candidate, neighbour))
    return distance, previous

def path_to(previous, goal):
    if goal not in previous:
        return None
    path = []
    while goal is not None:
        path.append(goal)
        goal = previous[goal]
    return path[::-1]

graph = {
    'A': {'B': 2, 'C': 5},
    'B': {'A': 2, 'C': 1, 'D': 6},
    'C': {'A': 5, 'B': 1, 'E': 4},
    'D': {'B': 6, 'E': 3, 'F': 9},
    'E': {'C': 4, 'D': 3, 'F': 8},
    'F': {'D': 9, 'E': 8},
}
distance, previous = dijkstra(graph, 'A')
print(distance)
print(path_to(previous, 'F'))
print(path_to(previous, 'D'))

islands = {'X': {'Y': 1}, 'Y': {'X': 1}, 'Z': {}}
distance, previous = dijkstra(islands, 'X')
print(distance, path_to(previous, 'Z'))
```

Z cannot be reached from X, so it never appears in `distance`, and `path_to` returns `None`.

## Analysis

`V` is the number of vertices and `E` the number of edges.

| Step | Cost |
| --- | --- |
| Push: at most once per edge, plus the start, `O(log V)` each | `O(E log V)` |
| Pop: once per push, `O(log V)` each | `O(E log V)` |
| Settle each vertex once and look at each of its edges | `O(V + E)` |
| Total | `O(V + E log V)` |
| Space: `distance`, `previous` and the heap | `O(V + E)` |

Every push comes from an edge that lowered a distance. An edge is looked at only when one of its ends is settled, and it can lower a distance at most once, so there are at most `E + 1` pushes and the heap never holds more. A heap operation on `E` entries costs `O(log E)`, and since `E` is less than `V²`, `log E` is less than `2 log V`. That is why the table says `O(log V)`. On a connected graph `E` is at least `V - 1`, and the total is usually written `O(E log V)`. The bound holds for every input.

## Negative edges

<Diagram label="A negative edge" :width="520" :height="186" alt="Three vertices with directed edges. S has an edge of weight 2 to A and an edge of weight 3 to B. B has an edge of weight -2 to A. Dijkstra settles A at distance 2, but the path S, B, A costs 3 - 2 = 1.">
 <DGraph directed :nodes="[{ id: 'S', x: 90, y: 50, state: 'hit' }, { id: 'A', x: 330, y: 50 }, { id: 'B', x: 210, y: 150 }]" :edges="[{ from: 'S', to: 'A' }, { from: 'S', to: 'B' }, { from: 'B', to: 'A', state: 'accent' }]" />
 <text class="dg-edge-label" x="210" y="39">2</text>
 <text class="dg-edge-label" x="143" y="108">3</text>
 <text class="dg-edge-label" x="277" y="108">-2</text>
 <text class="dg-note start" x="358" y="46">Dijkstra settles A at 2</text>
 <text class="dg-note start" x="358" y="64">S, B, A costs 3 - 2 = 1</text>
</Diagram>

The reason a settled vertex is safe was that a route can only get longer as it goes on. A negative weight breaks that. In this small directed graph, Dijkstra's algorithm pops A at distance 2 and settles it. Only then does it pop B, at 3, and find the route S, B, A, which costs 3 + (-2) = 1. A was not final after all.

The code on this page does notice. It lowers A to 1, pushes A again and handles it a second time, so here the answer comes out right. But the reasoning behind the cost bound is gone: a vertex can now be handled many times, and every vertex reached through it has to be redone too. If a cycle has a negative total weight, the distances keep falling and the code never stops.

So Dijkstra's algorithm is only for graphs with no negative weights.

## Bellman-Ford (optional)

When some weights are negative, the usual tool is the Bellman-Ford algorithm. It relaxes every edge, and repeats that `V - 1` times. A shortest path with no cycle has at most `V - 1` edges, and after round `k` every vertex whose shortest path uses at most `k` edges has its final distance. A relaxation on one more round reveals a negative-weight cycle reachable from the start. There is no finite shortest path to a vertex reachable from that cycle. A cycle in an unreachable component does not affect distances from the start.

```python
import math

def bellman_ford(graph, start):
    distance = {vertex: math.inf for vertex in graph}
    distance[start] = 0
    for _ in range(len(graph) - 1):
        for vertex in graph:
            for neighbour, weight in graph[vertex].items():
                if distance[vertex] + weight < distance[neighbour]:
                    distance[neighbour] = distance[vertex] + weight
    for vertex in graph:
        for neighbour, weight in graph[vertex].items():
            if distance[vertex] + weight < distance[neighbour]:
                raise ValueError('negative cycle')
    return distance

tricky = {'S': {'A': 2, 'B': 3}, 'A': {}, 'B': {'A': -2}}
print(bellman_ford(tricky, 'S'))

try:
    bellman_ford({'P': {'Q': 1}, 'Q': {'P': -3}}, 'P')
except ValueError as error:
    print(error)
```

Its rounds cost `O(V · (V + E))`, which is `O(V · E)` on a connected graph. That is far more than Dijkstra's algorithm, so use it only when negative weights are really there.

## In Python

The standard library has no shortest-path function. `heapq` is the building block, and two of its habits matter here.

- There is no decrease-key, no way to find an entry and lower its priority. Lazy deletion is the usual way around it.
- Entries are compared as tuples, item by item. Two entries with the same distance are ordered by their vertex, so vertices must be comparable with each other. Strings and numbers are. For anything else, put a counter between the distance and the vertex, so that ties never reach the vertex.

```python
import heapq
import itertools

heap = []
heapq.heappush(heap, (5, 'C'))
heapq.heappush(heap, (2, 'B'))
heapq.heappush(heap, (3, 'C'))
print(heapq.heappop(heap), heapq.heappop(heap), heapq.heappop(heap))

class Stop:
    def __init__(self, name):
        self.name = name

heap = []
try:
    heapq.heappush(heap, (4, Stop('north')))
    heapq.heappush(heap, (4, Stop('south')))
except TypeError as error:
    print('TypeError:', error)

counter = itertools.count()
heap = []
heapq.heappush(heap, (4, next(counter), Stop('north')))
heapq.heappush(heap, (4, next(counter), Stop('south')))
dist, _, stop = heapq.heappop(heap)
print(dist, stop.name)
```

`math.inf` is a float that is larger than any finite number, which makes it a handy distance for "not reached yet".

## When to use

- Use Dijkstra's algorithm when the weights are zero or more: road maps, network delays, the cheapest way through a game level.
- If every edge has the same weight, [breadth-first search](/graphs/graph) gives the same answer, more simply, in `O(V + E)`.
- If some weights are negative, use Bellman-Ford. It also reports a negative cycle.
- With one goal in mind, stop as soon as the goal is popped.
- To connect every vertex as cheaply as possible, rather than reach each one by a short route, build a [minimum spanning tree](/graphs/minimum-spanning-tree).

## Key points

- In a weighted graph `graph[u][v]` is the weight of the edge, and a path costs the sum of its weights.
- BFS finds the fewest edges. Dijkstra's algorithm finds the least total weight, as long as no weight is negative.
- It settles vertices closest first, using a heap of `(distance, vertex)` entries.
- `heapq` cannot lower an entry, so the code pushes a new one and skips stale entries when they are popped.
- `previous` records where each vertex was reached from. Walking it back from the goal gives the path.

## Exercise

A message starts at one server and travels along directed links. `graph[u][v]` is the nonnegative time it takes from `u` to `v`, and every server passes the message on as soon as it arrives. Write `time_to_reach_all`, which returns the time when the last server gets the message, or `None` if some server never gets it.

```python
import heapq
import math

def time_to_reach_all(graph, start):
    pass

network = {
    'hub': {'a': 4, 'b': 1},
    'a': {'c': 1},
    'b': {'a': 2, 'c': 5},
    'c': {},
}
print(time_to_reach_all(network, 'hub'))
print(time_to_reach_all(network, 'a'))
print(time_to_reach_all({'solo': {}}, 'solo'))
```

::: details Solution
Each server gets the message along the fastest route, so its arrival time is its shortest distance from the start. Run Dijkstra's algorithm. If some server is missing from the distances, it is never reached. Otherwise the answer is the largest distance.

```python
import heapq
import math

def time_to_reach_all(graph, start):
    distance = {start: 0}
    heap = [(0, start)]
    while heap:
        dist, vertex = heapq.heappop(heap)
        if dist > distance[vertex]:
            continue
        for neighbour, weight in graph[vertex].items():
            candidate = dist + weight
            if candidate < distance.get(neighbour, math.inf):
                distance[neighbour] = candidate
                heapq.heappush(heap, (candidate, neighbour))
    if len(distance) < len(graph):
        return None
    return max(distance.values())

network = {
    'hub': {'a': 4, 'b': 1},
    'a': {'c': 1},
    'b': {'a': 2, 'c': 5},
    'c': {},
}
print(time_to_reach_all(network, 'hub'))
print(time_to_reach_all(network, 'a'))
print(time_to_reach_all({'solo': {}}, 'solo'))
```

From `hub`, `a` is reached faster through `b` (1 + 2 = 3) than directly (4), and `c` at 3 + 1 = 4. From `a`, neither `hub` nor `b` can be reached. **Time** `O(V + E log V)`. **Space** `O(V + E)`.
:::
