---
title: Topologik tartiblaş
description: "Baʼzi vazifalarni boşlaşdan oldin boşqalari tugagan bölişi kerak. Topologik tartib har vazifani uning barça şartlaridan keyin joylaydi."
---

# Topologik tartiblaş

Baʼzi vazifalarni boşlaşdan oldin boşqalari tugagan bölişi kerak. Topologik tartib har vazifani uning barça şartlaridan keyin joylaydi.

Avval [Graf](/uz/graphs/graph), [Navbat](/uz/stacks-queues/queue) va [Rekursiya](/uz/recursion/recursion) darslarini öqing.

## Yönalgan graflar {#directed-graphs}

`u → v` qirrasi `u` vazifasi `v` dan oldin bajarilişini bildiradi. Har tugun kalit, qiymat esa undan çiqadigan qirralar röyxati. Kiriş darajasi unga keladigan qirralar soni.

<DagTasks />

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

## Masala {#the-problem}

Yönalgan graf tugunlarini şunday joylangki, har bir qirra oldingi tugundan keyingisiga qarasin. Bir neça töğri tartib bölişi mumkin. Grafda sikl bölsa, bunday tartib yöq.

<DagTasks mode="order" />

## Kahn algoritmi {#the-idea}

Kiriş darajalarini sanang. Darajasi 0 bölganlarini navbatga qöying. Navbatdan tugun oling va qöşnilarining kiriş darajasini bittaga kamaytiring. Nolga tuşgan har tugunni navbatga qöying.

<DagTasks mode="indegree" />

## Qadamlar böyiça {#step-by-step}

`shop` va `boil` birinçi bölib navbatga kiradi. `shop` tugasa, `chop` tayyor. `boil` tugagaç, `pasta` tayyor. `chop` dan söng `sauce`, ikkalasi tayyor bölgaç `serve` bajariladi.

<DagKahnTrace />

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

## Siklni aniqlaş {#finding-a-cycle}

`chop` va `sauce` bir-birini kutsa, ikkalasi ham navbatga kirmaydi. Navbat böşab, natijada hali tugun yetişmasa, grafda sikl bor.

<DagTasks mode="cycle" />

## DFS usuli {#the-dfs-method}

Har bir tugunni qöşnilari tugagandan keyin yozing. Oxirida röyxatni teskarilang. Joriy qidiruv yölidagi tugunga yana duç keliş siklni bildiradi.

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

## Töliq dastur {#full-implementation}

Kahn va DFS usullari bir xil boğliqliklardan ikki xil yaroqli tartib topişi mumkin. Ikkalasi ham sikl holatini aniqlaydi.

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

## Tahlil {#analysis}

Kiriş darajalarini sanaş va ularni kamaytirişda har qirra bir martadan köriladi. DFS ham har tugun va qirrani bir martadan tekşiradi. Vaqt `O(V + E)`, grafdan taşqari joy `O(V)`.

## Python tilida {#in-python}

`graphlib.TopologicalSorter` har tugun uçun undan oldin bajariladigan vazifalarni kutadi. Bizning graf esa undan keyin bajariladigan vazifalarni beradi. `static_order()` tayyor tartib beradi. Sikl bölsa `CycleError` keltiriladi.

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

## Qayerda işlatiladi {#when-to-use}

Modullar, paketlar, kurslar va işlar orasida qaysi biri oldin kelişi kerakligi maʼlum bölsa, topologik tartib qulay.

## Xulosa {#key-points}

Har qirra oldinga qaraşi kerak. Nol kiriş darajasi vazifa tayyorligini bildiradi. Tayyor vazifa qolmay, tugunlar tugamasa, sikl bor.

## Maşq {#exercise}

`fewest_rounds` barça vazifalarni tugatiş uçun eng kam bosqiç sonini qaytarsin. Bir bosqiçda istalgan miqdorda tayyor vazifa bajariladi, lekin uning şartlari oldingi bosqiçlarda tugagan bölişi kerak. Siklda `None` qaytaring.

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

::: details Yeçim
Har bosqiçni nol kiriş darajali tugunlar bilan boşlang. Bosqiç davomida tayyor bölganlarni keyingisiga qoldiring. Hisoblangan tugunlar soni yetmasa sikl bor. Vaqt `O(V + E)`, joy `O(V)`.

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

:::
