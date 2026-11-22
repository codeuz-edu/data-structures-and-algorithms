---
title: Graf
description: "Graf tugunlar va ularni boğlaydigan qirralardan iborat. Şaharlar va yöllar, odamlar va döstliklar, veb-sahifalar va havolalar graf bilan ifodalanadi."
---

# Graf

Graf tugunlar va ularni boğlaydigan qirralardan iborat. Şaharlar va yöllar, odamlar va döstliklar, veb-sahifalar va havolalar graf bilan ifodalanadi.

Avval [Navbat](/uz/stacks-queues/queue), [Stek](/uz/stacks-queues/stack), [Xeş jadvali](/uz/hash-tables/hash-table) va [Rekursiya](/uz/recursion/recursion) darslarini öqing.

## Amallar {#interface}

`Graph` tugun va qirralarni qöşadi yoki öçiradi. Qidiruv funksiyalari har tugundan qöşnilariga öta oladigan luğatni oladi. `V` tugunlar, `E` qirralar soni. `shortest_path` qirralar soni eng kam yölni yoki `None` ni qaytaradi.

## Atamalar {#terms}

Bitta qirra bilan boğlangan tugunlar qöşni. Yönalişsiz grafdagi tugun darajasi unga ulangan qirralar sonidir. Yöl bir-biriga qirra bilan ulangan tugunlar ketma-ketligi. Boşlangan tugunga qaytadigan yopiq yölning oddiy turi sikl deyiladi.

<GraphDiagram />

## Grafni saqlaş {#storing-a-graph}

Grafni qöşnilar röyxati yoki matritsa bilan yozamiz. Qaysi biri qulayligi qirralar soniga va qanday sörovlar kerakligiga boğliq.

### Qöşnilar röyxati {#adjacency-list}

Har tugun uçun qöşnilari saqlanadi. Yönalişsiz qirra ikkala tugun röyxatida ham bor. Bu yozuv `O(V + E)` joy oladi.

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

### Qöşnilik matritsasi {#adjacency-matrix}

Har tugunga bitta qator va bitta ustun ajratiladi. Ikki tugun ulangan katakka 1 yoziladi. Qirra borligini indeks bilan tekşiriş mumkin, biroq xotira `O(V²)`.

## Yönalgan va vaznli graflar {#directed-and-weighted-graphs}

Yönalgan qirrani faqat u çiqqan tugun tagida saqlaymiz. Vaznli grafda `graph[u][v]` qirra vaznidir. Çiquvçi qirrasi yöq tugun ham taşqi luğatda saqlanadi.

<Diagram label="Directed and weighted" :width="600" :height="206" alt="Two versions of the square A, B, C, D from the graph above. Left, directed: arrows go from A to B, A to C, B to D and D to C, so no edge leaves C. Right, weighted and undirected: A-B has weight 2, A-C 5, B-D 6 and C-D 3.">
 <DGraph directed :nodes="[{ id: 'A', x: 80, y: 50 }, { id: 'B', x: 220, y: 50 }, { id: 'C', x: 80, y: 150 }, { id: 'D', x: 220, y: 150 }]" :edges="[{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'B', to: 'D' }, { from: 'D', to: 'C' }]" />
 <DGraph :nodes="[{ id: 'A', x: 380, y: 50 }, { id: 'B', x: 520, y: 50 }, { id: 'C', x: 380, y: 150 }, { id: 'D', x: 520, y: 150 }]" :edges="[{ from: 'B', to: 'A', label: 2 }, { from: 'A', to: 'C', label: 5 }, { from: 'C', to: 'D', label: 3 }, { from: 'D', to: 'B', label: 6 }]" />
 <text class="dg-label" x="150" y="196">directed</text>
 <text class="dg-label" x="450" y="196">weighted</text>
</Diagram>

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

## `Graph` klassi {#a-graph-class}

Klass luğatlar içida luğat saqlaydi. Yönalişsiz qirra qöşilganda ikkala tomon yangilanadi. Vazn berilmasa 1 olinadi.

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

## Kenglik böyiça qidiruv {#breadth-first-search}

Boşlanğiş tugunni navbatga qöyib, körilgan deb belgilang. Har safar navbat boşidagi tugunni oling va hali körilmagan qöşnilarini oxiriga qöying. Belgilaş navbatga qöşiş paytida bajariladi. BFS başlanğişdan yetib boriladigan har bir tugunga eng kam qirrali yöl bilan boradi.

<GraphDiagram mode="bfs" />

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

## Çuqurlik böyiça qidiruv {#depth-first-search}

Tugunni belgilab, hali körilmagan qöşnilaridan biriga öting. Davom etiş iloji qolmasa, oxirgi tanlovga qayting. Rekursiv DFS bu qaytişni çaqiruvlar steki orqali bajaradi.

<GraphDiagram mode="dfs" />

```py
def dfs(graph, vertex, seen, order):
    seen.add(vertex)
    order.append(vertex)
    for neighbour in graph[vertex]:
        if neighbour not in seen:
            dfs(graph, neighbour, seen, order)
```

## Stek bilan çuqurlik böyiça qidiruv {#iterative-depth-first-search}

Boşlanğiş tugunni stekka qöying. Olingan tugun körilgan bölsa, öting. Aks holda uni belgilang va qöşnilarini stekka qöying. Rekursiv tartibni saqlaş uçun qöşnilarni teskari tartibda qöying.

<GraphDiagram mode="iterative" />

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

## Katakli jadval graf sifatida {#grids-as-graphs}

Labirintda har katak tugun. Yuqori, pastki, çap va öng qöşnilar koordinatadan hisoblanadi. Boyaş misolida eski rangdagi qöşnilar yangisiga özgartiriladi. Yangi rang eski rangga teng bölsa, avvaldan qaytiş kerak.

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

## Töliq dastur {#full-implementation}

Misol qirralar va tugunlarni yasab, BFS, DFS hamda yölni tiklaşni işlatadi. E–F qirrasi öçirilgaç, F ga borib bölmaydi. Oxirida stekli DFS 3 000 tugunli zanjirni aylanadi.

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

## Python tilida {#in-python}

Tugunlar va qöşnilarni `dict`, körilganlarni `set`, BFS navbatini `collections.deque`, DFS stekini `list` bilan saqlaymiz. Vaznli qidiruvga `heapq` ham kerak bölişi mumkin.

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

## Amallar xarajati {#costs-at-a-glance}

Qöşnilar röyxatida BFS va DFS barça yetib boriladigan tugun va qirralarni tekşiradi. Butun graf uçun yuqori çegara `O(V + E)`. Bu hisobda `dict` va `set` amallari örtaça doimiy vaqt oladi.

## Qayerda işlatiladi {#when-to-use}

Yöllar, aloqa tarmoqlari va vazifalar boğliqligi graf bilan ifodalanadi. Har tugunga bitta ildizdan borilsa va ildizdan boşqa har tugunda bitta ota bölsa, ildizli daraxt yetarli.

## Amaliy misol {#application}

Ana va Gus orasida eng kam taniştiriş zanjirini izlaymiz. BFS har yangi odam qayerdan topilganini `previous` ga yozadi. Gusdan ana şu havolalar böylab orqaga yurib, Ana–Cal–Eva–Gus yölini tiklaymiz.

<Diagram label="Shortest path from Ana to Gus" cost="O(V + E)" :width="600" :height="200" alt="Seven people joined by friendships. Ana is friends with Ben and Cal. Ben is friends with Dev, Cal with Eva, Dev with Eva and Fay, and Gus with Eva and Fay. The shortest path from Ana to Gus goes Ana, Cal, Eva, Gus and is highlighted. Every route through Ben has at least four edges.">
 <DGraph :r="20" :nodes="[{ id: 'Ana', x: 70, y: 100, state: 'hit' }, { id: 'Ben', x: 200, y: 40 }, { id: 'Cal', x: 200, y: 160, state: 'hit' }, { id: 'Dev', x: 330, y: 40 }, { id: 'Eva', x: 330, y: 160, state: 'hit' }, { id: 'Fay', x: 460, y: 40 }, { id: 'Gus', x: 560, y: 100, state: 'hit' }]" :edges="[{ from: 'Ana', to: 'Ben', state: 'muted' }, { from: 'Ana', to: 'Cal', state: 'accent' }, { from: 'Ben', to: 'Dev', state: 'muted' }, { from: 'Cal', to: 'Eva', state: 'accent' }, { from: 'Dev', to: 'Eva', state: 'muted' }, { from: 'Dev', to: 'Fay', state: 'muted' }, { from: 'Eva', to: 'Gus', state: 'accent' }, { from: 'Fay', to: 'Gus', state: 'muted' }]" />
</Diagram>

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

## Keyingi mavzular {#where-next}

[Topologik tartiblaş](/uz/graphs/topological-sort) boğliq vazifalarni joylaydi. [Eng qisqa yöllar](/uz/graphs/shortest-paths) vaznlarni hisoblaydi. [Minimal qamrovçi daraxt](/uz/graphs/minimum-spanning-tree) barça tugunlarni arzon boğlaydi.

## Xulosa {#key-points}

Grafdagi sikllar sabab körilgan tugunlarni belgilang. BFS navbat, DFS stek işlatadi. Vaznsiz eng qisqa yöl uçun BFS mos.

## Maşq {#exercise}

`count_components` yönalişsiz grafdagi boğlangan qismlar sonini qaytarsin. Berilgan `bfs` funksiyasidan foydalaning.

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

::: details Yeçim
Belgilanmagan tugun yangi qismni bildiradi. Hisobni oşirib, undan BFS bilan yetib borilganlarni belgilang. Har tugun bitta qismga kiradi. Vaqt `O(V + E)`, qöşimça joy `O(V)`.

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

:::
