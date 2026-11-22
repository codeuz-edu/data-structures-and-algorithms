---
title: Topological Sort
description: "Topological sort in Python: directed acyclic graphs, Kahn's algorithm with in-degrees and a queue, the DFS finish order, finding a cycle, and graphlib."
---

# Topological Sort

Some tasks have prerequisites. Water must boil before the pasta cooks, and the sauce must be ready before dinner is served. A topological order puts each task after all the tasks it depends on.

**You need:** [Graph](/graphs/graph), [Queue](/stacks-queues/queue) and, for the second method, [Recursion](/recursion/recursion).

## Directed graphs

The edges on the [Graph](/graphs/graph) page work both ways. In a directed graph each edge has a direction, drawn as an arrow. Here an edge from `u` to `v` means that `u` must be done before `v`.

<DagTasks />

The graph is stored as before, a dictionary of neighbour lists, but each list now holds only the vertices that the arrows point to:

```python
dinner = {
    'shop': ['chop', 'pasta'],
    'boil': ['pasta'],
    'chop': ['sauce'],
    'pasta': ['serve'],
    'sauce': ['serve'],
    'serve': [],
}

print(dinner['shop'])
print(len(dinner), 'vertices')
print(sum(len(after) for after in dinner.values()), 'edges')
```

Each edge appears once, in the list of the vertex it leaves. Every vertex is a key, even `serve`, which points nowhere.

Two more terms:

- The **in-degree** of a vertex is the number of edges coming into it. `pasta` has in-degree 2, because it waits for `shop` and `boil`.
- A directed cycle is a path that follows the arrows back to where it started. A directed graph with no directed cycle is called a **DAG**, short for directed acyclic graph. The dinner graph is a DAG.

## The problem

Input: a directed graph. Output: a list of all its vertices in which every edge points forward, from an earlier vertex to a later one. Such a list is a topological order.

<DagTasks mode="order" />

Laid out in this order, every arrow points to the right. The order is usually not the only one: `boil` could go first, and `sauce` could come before `pasta`.

A topological order exists exactly when the graph is a DAG. Around a cycle, each vertex would have to come before the next one, and so in the end before itself.

## The idea

A vertex with in-degree 0 waits for nothing, so it can go first. Once it is done, the vertices it points to have one fewer thing to wait for, and some of them may now wait for nothing too. This is Kahn's algorithm.

<DagTasks mode="indegree" />

1. Count the in-degree of every vertex.
2. Put every vertex with in-degree 0 in a [queue](/stacks-queues/queue).
3. Take a vertex from the front of the queue and add it to the order.
4. Lower the in-degree of each vertex it points to by 1. Any vertex that reaches 0 joins the queue.
5. Repeat until the queue is empty.

The edges are never removed. Lowering the counts has the same effect and leaves the graph as it was.

## Step by step

<DagKahnTrace />

At the start `shop` and `boil` wait for nothing, so both are in the queue.

1. Take `shop`. `chop` drops to 0 and joins the queue. `pasta` drops to 1: it still waits for `boil`.
2. Take `boil`. `pasta` drops to 0.
3. Take `chop`, which frees `sauce`.
4. Take `pasta`. `serve` drops to 1, because the sauce is not ready yet.
5. Take `sauce`, which frees `serve`.
6. Take `serve`. The queue is empty and all six vertices are in the order.

The result is `shop, boil, chop, pasta, sauce, serve`, the order drawn under "The problem".

```py
def topological_sort(graph):
    in_degree = {vertex: 0 for vertex in graph}
    for vertex in graph:
        for neighbour in graph[vertex]:
            in_degree[neighbour] += 1
    queue = deque(vertex for vertex in graph if in_degree[vertex] == 0)
    order = []
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbour in graph[vertex]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)
    if len(order) < len(graph):
        return None
    return order
```

Any vertex with in-degree 0 may go next, so a stack would also give a valid order, just a different one. The queue takes vertices in the order they became ready. The `if` at the end is the cycle test, explained next.

## Finding a cycle

<DagTasks mode="cycle" />

Suppose someone adds a wrong rule: the sauce must be made before chopping. Now `chop` waits for `sauce` and `sauce` waits for `chop`, a cycle.

Kahn's algorithm takes `shop`, `boil` and `pasta`, and then the queue is empty. `chop` and `sauce` each wait for the other, so neither can ever reach 0. `serve` waits for `sauce`, so it is stuck as well.

That gives the test. If the order ends up shorter than the number of vertices, the graph has a directed cycle. The vertices left out are the ones on a cycle and the ones that wait for them, directly or not. The function above returns `None` in that case.

## The DFS method

[Depth-first search](/graphs/graph) gives a second method. Write down each vertex at the moment its search finishes, when all of its neighbours have been dealt with. Then reverse the list.

```py
def dfs_finish(graph, vertex, seen, finished):
    seen.add(vertex)
    for neighbour in graph[vertex]:
        if neighbour not in seen:
            dfs_finish(graph, neighbour, seen, finished)
    finished.append(vertex)

def topological_sort_dfs(graph):
    seen = set()
    finished = []
    for vertex in graph:
        if vertex not in seen:
            dfs_finish(graph, vertex, seen, finished)
    return finished[::-1]
```

On the dinner graph the search from `shop` goes to `chop`, then `sauce`, then `serve`. `serve` points nowhere, so it finishes first, followed by `sauce` and `chop`. Back at `shop`, the search tries `pasta`, whose only neighbour is already seen, so `pasta` finishes, and then `shop`. Last comes `boil`.

The finish order is `serve, sauce, chop, pasta, shop, boil`. Reversed, it is `boil, shop, pasta, chop, sauce, serve`, another valid order.

It works because in a DAG a vertex finishes only after every vertex it points to has finished. Every edge therefore runs from a later finisher to an earlier one, and reversing the list turns them all forward.

Three things to watch:

- The visit order is not a topological order. Here it starts `shop, chop, sauce, serve, pasta`, which puts `serve` before `pasta`. Only the reversed finish order works.
- This short version does not notice a cycle. On the graph with the wrong rule it still returns all six vertices, in an order that breaks the rule. Catching a cycle needs a third mark for vertices whose search has started but not finished. Kahn's count is simpler.
- Python stops a recursion that goes about 1000 calls deep. A long chain of tasks needs Kahn's algorithm, which uses no recursion.

## Full implementation

```python
from collections import deque

def topological_sort(graph):
    in_degree = {vertex: 0 for vertex in graph}
    for vertex in graph:
        for neighbour in graph[vertex]:
            in_degree[neighbour] += 1
    queue = deque(vertex for vertex in graph if in_degree[vertex] == 0)
    order = []
    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        for neighbour in graph[vertex]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)
    if len(order) < len(graph):
        return None
    return order

def dfs_finish(graph, vertex, seen, finished):
    seen.add(vertex)
    for neighbour in graph[vertex]:
        if neighbour not in seen:
            dfs_finish(graph, neighbour, seen, finished)
    finished.append(vertex)

def topological_sort_dfs(graph):
    seen = set()
    finished = []
    for vertex in graph:
        if vertex not in seen:
            dfs_finish(graph, vertex, seen, finished)
    return finished[::-1]

dinner = {
    'shop': ['chop', 'pasta'],
    'boil': ['pasta'],
    'chop': ['sauce'],
    'pasta': ['serve'],
    'sauce': ['serve'],
    'serve': [],
}
print(topological_sort(dinner))
print(topological_sort_dfs(dinner))

with_cycle = dict(dinner)
with_cycle['sauce'] = ['serve', 'chop']
print(topological_sort(with_cycle))
print(topological_sort({}))
```

## Analysis

`V` is the number of vertices and `E` the number of edges.

| Step | Cost |
| --- | --- |
| Count the in-degrees: every vertex, then every edge once | `O(V + E)` |
| Every vertex enters and leaves the queue at most once | `O(V)` |
| Every edge lowers one count once | `O(E)` |
| Total | `O(V + E)` |
| Space: the counts, the queue and the order | `O(V)` |

Counting incoming edges reads the whole graph. Processing the queue then visits each vertex and outgoing edge at most once, giving `Θ(V + E)` time overall even if a cycle leaves part of the graph unprocessed. The DFS method also costs `O(V + E)`: each vertex is searched once and each edge looked at once. Its space is `O(V)` for the seen set, the list and the recursion stack.

## In Python

The standard library has `graphlib.TopologicalSorter`. Mind one difference: it wants, for each vertex, the vertices it waits for, its predecessors. That is the reverse of the lists on this page.

```python
from graphlib import TopologicalSorter, CycleError

waits_for = {
    'chop': ['shop'],
    'pasta': ['shop', 'boil'],
    'sauce': ['chop'],
    'serve': ['pasta', 'sauce'],
}

order = list(TopologicalSorter(waits_for).static_order())
position = {task: i for i, task in enumerate(order)}
print(len(order), all(position[before] < position[task] for task in waits_for for before in waits_for[task]))

sorter = TopologicalSorter(waits_for)
sorter.prepare()
while sorter.is_active():
    ready = sorted(sorter.get_ready())
    print(ready)
    sorter.done(*ready)

try:
    TopologicalSorter({'chop': ['sauce'], 'sauce': ['chop']}).prepare()
except CycleError as error:
    print('cycle:', error.args[1])
```

- Vertices that only appear as predecessors, here `shop` and `boil`, are added on their own.
- `static_order()` gives one valid order. When several are valid, the library picks, so the example checks the order rather than print it.
- `get_ready()` returns every vertex whose predecessors are all done, and `done()` marks vertices finished. Each group could run at the same time. This is Kahn's algorithm, one round at a time.
- A cycle raises `CycleError`, a kind of `ValueError`. `error.args[1]` lists the vertices around the cycle, with the first one repeated at the end.

## When to use

Use a topological sort whenever things must happen in an order set by "this before that" rules: compiling modules after the modules they import, installing packages after their dependencies, taking courses after their prerequisites, recomputing spreadsheet cells after the cells they read. The same pass tells you whether the rules contain a cycle, such as two modules that import each other.

In real code, use `graphlib`. Kahn's algorithm is short enough to write by hand when you need a variation that `graphlib` does not offer, such as listing every vertex that is stuck behind a cycle.

It only makes sense for directed graphs. To find a cycle in an undirected graph, use [union-find](/graphs/union-find) or a depth-first search.

## Key points

- A topological order lists the vertices so that every edge points forward. It exists exactly when the directed graph has no cycle.
- Kahn's algorithm keeps taking a vertex with in-degree 0 and lowers the counts of the vertices it points to.
- If Kahn's algorithm ends with vertices left over, the graph has a directed cycle.
- The DFS method reverses the order in which searches finish. The visit order itself is not a topological order.
- Both methods cost `O(V + E)`. In real code, `graphlib.TopologicalSorter` does the job.

## Exercise

You can do any number of tasks in one round, as long as everything they wait for was done in an earlier round. Write `fewest_rounds`, which returns how many rounds it takes to finish every task, or `None` if a cycle makes it impossible. Run Kahn's algorithm one round at a time.

```python
def fewest_rounds(graph):
    pass

dinner = {
    'shop': ['chop', 'pasta'],
    'boil': ['pasta'],
    'chop': ['sauce'],
    'pasta': ['serve'],
    'sauce': ['serve'],
    'serve': [],
}
print(fewest_rounds(dinner))
print(fewest_rounds({'a': ['b'], 'b': ['a']}))
print(fewest_rounds({'x': [], 'y': []}))
```

::: details Solution
The first round holds every task with in-degree 0. While handling one round, collect the tasks whose count drops to 0: they make up the next round. Count the rounds and the tasks done. If some tasks are never done, there is a cycle.

```python
def fewest_rounds(graph):
    in_degree = {vertex: 0 for vertex in graph}
    for vertex in graph:
        for neighbour in graph[vertex]:
            in_degree[neighbour] += 1
    ready = [vertex for vertex in graph if in_degree[vertex] == 0]
    rounds = 0
    finished = 0
    while ready:
        rounds += 1
        finished += len(ready)
        next_ready = []
        for vertex in ready:
            for neighbour in graph[vertex]:
                in_degree[neighbour] -= 1
                if in_degree[neighbour] == 0:
                    next_ready.append(neighbour)
        ready = next_ready
    if finished < len(graph):
        return None
    return rounds

dinner = {
    'shop': ['chop', 'pasta'],
    'boil': ['pasta'],
    'chop': ['sauce'],
    'pasta': ['serve'],
    'sauce': ['serve'],
    'serve': [],
}
print(fewest_rounds(dinner))
print(fewest_rounds({'a': ['b'], 'b': ['a']}))
print(fewest_rounds({'x': [], 'y': []}))
```

The dinner takes 4 rounds: `shop` and `boil`, then `chop` and `pasta`, then `sauce`, then `serve`. That is also the number of tasks on the longest chain of arrows. **Time** `O(V + E)`. **Space** `O(V)`.
:::
