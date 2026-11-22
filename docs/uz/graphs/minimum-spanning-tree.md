---
title: Minimal qamrovçi daraxt
description: "Şaharlarni kabel bilan boğlaş kerak. Barça şaharlar bir-biriga ulangan holda jami xarajat eng kam bölişi uçun qaysi kabellarni tanlaş kerak?"
---

# Minimal qamrovçi daraxt

Şaharlarni kabel bilan boğlaş kerak. Barça şaharlar bir-biriga ulangan holda jami xarajat eng kam bölişi uçun qaysi kabellarni tanlaş kerak?

Avval [Eng qisqa yöllar](/uz/graphs/shortest-paths), [Töplamlarni birlaştiriş va topiş](/uz/graphs/union-find) va [Uyum](/uz/trees/heap) darslarini öqing.

## Qamrovçi daraxt {#spanning-trees}

Yönalişsiz boğlangan grafning qamrovçi daraxti barça tugunlarni `V - 1` qirra bilan boğlaydi va sikl hosil qilmaydi. Graf boğlanmagan bölsa, har qism uçun alohida daraxt tuziş mumkin.

<WeightedGraph mode="spanning" />

## Masala {#the-problem}

Boğlangan, yönalişsiz va vaznli grafdan jami vazni eng kam qamrovçi daraxtni toping. Vaznlar farqli bölsa, javob yagona. Teng vaznlarda bir neça javob bölişi mumkin.

## Kruskal algoritmi {#kruskal-s-algorithm}

Qirralarni vazn tartibida körib çiqamiz va daraxtning alohida qismlarini birlaştiramiz.

### Kruskal tanlovi {#the-idea}

Eng yengil qirradan boşlang. Ikki uçi alohida guruhda bölsa, qirrani oling va guruhlarni birlaştiring. Uçlar bir guruhda bölsa, qirra sikl yasaydi.

<WeightedGraph mode="kruskal" />

### Kruskal qadamlari {#step-by-step}

B–C, A–B va D–E qirralari olinadi. C–E ikki guruhni boğlaydi. A–C esa allaqaçon boğlangan tugunlar orasida, şu sabab olinmaydi. Tanlangan vaznlar yiğindisi 10.

<WeightedTrace algorithm="kruskal" />

### Kruskal dasturi {#the-code}

`UnionFind` har guruhni kuzatadi. Yönalişsiz grafda bir qirrani ikki marta sanamaslik uçun qirralarni bir martadan röyxatga yozing. Misolda tugunlar taqqoslanadi.

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

## Prim algoritmi {#prim-s-algorithm}

Bitta tugundan boşlab, bitta daraxtni kengaytiramiz.

### Prim tanlovi {#the-idea-1}

Daraxtdan taşqaridagi tugunga olib boradigan eng yengil qirrani oling. Yangi tugundan çiquvçi qirralarni uyumga qöying. Uyumdan olingan qirraning uçi allaqaçon daraxtda bölsa, undan öting.

<WeightedGraph mode="prim" />

### Prim qadamlari {#step-by-step-1}

A dan avval A–B, keyin B–C tanlanadi. C–E yangi tugunni olib kiradi, E–D qolgan tugunni ulaydi. Tanlangan qirralar jami 10.

<WeightedTrace algorithm="prim" />

### Prim dasturi {#the-code-1}

Uyum `(weight, u, v)` yozuvlarini saqlaydi. `v` daraxtga kirganda faqat hali daraxtga kirmagan qöşnilariga qirralar qöşiladi. Bir qirra uyumga köpi bilan bir marta kiradi.

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

## Eng qisqa yöl daraxti bilan farqi {#not-a-shortest-path-tree}

Prim har qadamda bitta qirraning vaznini soliştiradi. Dijkstra esa boşlanğişdan jami masofani soliştiradi. Minimal qamrovçi daraxt eng arzon tarmoqni topadi, eng qisqa alohida marşrutlarni esa Dijkstra topadi.

<WeightedGraph mode="compare" />

## Töliq dastur {#full-implementation}

Boğlanmagan grafda Kruskal har qismning daraxtlarini qaytaradi. Prim faqat boşlanğiş tugun tegişli qismni körib çiqadi.

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

## Tahlil {#analysis}

Kruskal `E` qirrani saralaydi. Prim uyumda köpi bilan `E` ta qirrani yuritadi. Oddiy boğlangan grafda ikkala vaqtni ham `O(E log V)` deb yozamiz. Qöşimça joy `O(V + E)`.

## Python tilida {#in-python}

Kruskalga `sorted`, Primga `heapq` kerak. Qirra `(u, v, weight)` şaklida bölsa, vazn kalitini `itemgetter(2)` bilan tanlang.

```python
from operator import itemgetter

cables = [('A', 'C', 5), ('B', 'C', 1), ('A', 'B', 2), ('D', 'E', 3), ('C', 'E', 4)]
print(sorted(cables, key=itemgetter(2)))
print(min(cables, key=itemgetter(2)))

graph = {'A': {'B': 2}, 'B': {'A': 2, 'C': 1}, 'C': {'B': 1}}
print([(u, v, weight) for u in graph for v, weight in graph[u].items()])
print([(u, v, weight) for u in graph for v, weight in graph[u].items() if u < v])
```

## Qayerda işlatiladi {#when-to-use}

Kabel, quvur yoki yöl tarmoğining umumiy quriliş xarajatini kamaytirişda işlatiladi. Qirralarni vazni böyiça kesib, yaqin tugunlarni guruhlaş ham mumkin.

## Xulosa {#key-points}

Qamrovçi daraxt barça tugunlarni siklsiz boğlaydi. Kruskal yengil qirralar bilan guruhlarni birlaştiradi. Prim bitta daraxtga eng arzon yangi tugunni ulaydi.

## Maşq {#exercise}

Kamida bitta uy bor. Uylar `0` dan `count - 1` gaça raqamlangan. `(cost, a, b)` kabellaridan foydalanib, `connect_cost` barça uyni boğlaşning eng kam xarajatini qaytarsin. Boğlab bölmasa `None` qaytaring. `UnionFind` dan foydalaning.

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

::: details Yeçim
Kabellarni narx böyiça saralang. Faqat `union` birlaştira olgan kabellarning narxini qöşing. Barça uyni boğlaş uçun `count - 1` ta kabel kerak. Bitta uy uçun javob 0.

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

:::
