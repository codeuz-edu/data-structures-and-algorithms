---
title: Eng qisqa yöllar
description: "Grafdagi yölning xarajati undagi qirralar vaznining yiğindisi. Dijkstra algoritmi manfiy vaznlar yöq bölsa, bitta tugundan yetib boriladigan tugunlargaça eng arzon yöllarni topadi."
---

# Eng qisqa yöllar

Grafdagi yölning xarajati undagi qirralar vaznining yiğindisi. Dijkstra algoritmi manfiy vaznlar yöq bölsa, bitta tugundan yetib boriladigan tugunlargaça eng arzon yöllarni topadi.

Avval [Graf](/uz/graphs/graph), [Uyum](/uz/trees/heap) va [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost) darslarini öqing.

## Vaznli graflar {#weighted-graphs}

`graph[u]` luğati `u` dan çiquvçi qirralarni saqlaydi. `graph[u][v]` qirra vazni. Yöl vazni uning qirralari vaznlarini qöşib topiladi.

<WeightedGraph />

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

## Masala {#the-problem}

Manfiy bölmagan vaznlar va boşlanğiş tugun berilgan. Yetib boriladigan har tugungaça eng arzon masofani va yölni tiklaş uçun kerakli havolalarni toping. Bir xil musbat vaznda eng kam qirrali yöl ham eng arzon yöl.

## Dijkstra algoritmi {#the-idea}

Boşlanğiş masofa 0. Uyumdagi eng yaqin nomzodni oling. Har çiqadigan qirra uçun yangi masofani hisoblang. U avvalgisidan kiçik bölsa, masofa va oldingi tugunni yangilang. Manfiy vazn yöqligida birinçi joriy eng kiçik yozuv yakuniy masofani beradi.

<WeightedGraph mode="dijkstra" />

## Qadamlar böyiça {#step-by-step}

A dan B gaça 2, C gaça 5. B orqali C gaça 3 topiladi va eski 5 yozuvi keyin ötkazib yuboriladi. C dan E gaça jami 7, E dan F gaça jami 15. D orqali F ga 17 ketgani uçun F ning masofasi 15 da qoladi.

<WeightedTrace algorithm="dijkstra" />

## Dastur {#the-code}

`distance` joriy eng yaxşi masofani, `previous` oldingi tugunni saqlaydi. Yangilangan masofani uyumga qöyib, eski yozuvni keyin olinganda taşlaymiz. Bitta manzil kerak bölsa, uning joriy masofasi uyumdan olinganda töxtaş mumkin.

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

## Yölni tiklaş {#rebuilding-the-path}

Maqsaddan `previous` bilan boşlanğiş tugungaça orqaga yuring va röyxatni teskarilang. F uçun yöl A–B–C–E–F, vazni 15. Yetib bölmaydigan tugun masofalar luğatida yöq.

<WeightedGraph mode="paths" />

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

## Töliq dastur {#full-implementation}

Dastur masofa va oldingi tugunlar luğatini qaytaradi. Uzilgan misolda X dan Z ga yöl yöq, şu sabab `path_to` `None` beradi.

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

## Tahlil {#analysis}

Masofani yaxşilagan har qirra uyumga köpi bilan bir yozuv qöşadi. Uyum `O(E + 1)` yozuv saqlaydi. Oddiy grafda `E ≤ V²`. Umumiy yuqori çegara `O(V + E log V)` vaqt va `O(V + E)` xotira.

## Manfiy qirralar {#negative-edges}

Manfiy qirra keyinroq kelgan yölni arzonlaştirişi mumkin. Bu Dijkstra algoritmidagi yakuniy masofa qoidasini buzadi. Yetib boriladigan manfiy vaznli siklda masofani çeksiz kamaytiriş mumkin.

<Diagram label="A negative edge" :width="520" :height="186" alt="Three vertices with directed edges. S has an edge of weight 2 to A and an edge of weight 3 to B. B has an edge of weight -2 to A. Dijkstra settles A at distance 2, but the path S, B, A costs 3 - 2 = 1.">
 <DGraph directed :nodes="[{ id: 'S', x: 90, y: 50, state: 'hit' }, { id: 'A', x: 330, y: 50 }, { id: 'B', x: 210, y: 150 }]" :edges="[{ from: 'S', to: 'A' }, { from: 'S', to: 'B' }, { from: 'B', to: 'A', state: 'accent' }]" />
 <text class="dg-edge-label" x="210" y="39">2</text>
 <text class="dg-edge-label" x="143" y="108">3</text>
 <text class="dg-edge-label" x="277" y="108">-2</text>
 <text class="dg-note start" x="358" y="46">Dijkstra settles A at 2</text>
 <text class="dg-note start" x="358" y="64">S, B, A costs 3 - 2 = 1</text>
</Diagram>

## Bellman–Ford algoritmi {#bellman-ford-optional}

Barça qirralarni `V - 1` marta tekşiring va yaxşiroq masofalarni yangilang. Çekli eng qisqa yöl sodda yöl sifatida olinadi va köpi bilan `V - 1` qirrali. Keyingi yuruv masofani pasaytirsa, boşlanğişdan yetib boriladigan manfiy vaznli sikl bor. Undan yetib boriladigan manzillar uçun eng qisqa çekli yöl yöq.

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

## Python tilida {#in-python}

`heapq` avval masofani, tenglikda esa juftlikning keyingi maydonini soliştiradi. Tugunlar taqqoslanmasa, masofa va tugun orasiga noyob hisoblagiç qöyiladi.

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

## Qayerda işlatiladi {#when-to-use}

Vazn manfiy bölmasa, Dijkstra yöl uzunligi yoki tarmoq keçikişini topadi. Har qirra bir xil musbat vaznli bölsa, BFS yetarli. Manfiy vaznlar uçun Bellman–Ford dan foydalaning.

## Xulosa {#key-points}

BFS qirralarni sanaydi, Dijkstra ularning vaznini qöşadi. Uyumdan olingan eski masofalarni ötkazing. Yölga kerakli ota havolasini masofa yangilanganda saqlang.

## Maşq {#exercise}

`time_to_reach_all` xabar oxirgi serverga qança vaqtda yetişini qaytarsin. Yönalgan `graph[u][v]` manfiy bölmagan uzatiş vaqtini beradi va server xabarni olgan zahoti uzatadi. Biror serverga yetib bölmasa `None` qaytaring.

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

::: details Yeçim
Dijkstra bilan eng erta yetiş vaqtlarini toping. Barça serverlar masofalar luğatida bölsa, eng katta vaqt javob. Aks holda biror server xabarni olmaydi.

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

:::
