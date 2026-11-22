---
title: Töplamlarni birlaştiriş va topiş
description: "Union-find elementlarni ajralgan guruhlarga böladi. U ikki element bitta guruhdaligini tekşiradi va ikkita guruhni birlaştira oladi."
---

# Töplamlarni birlaştiriş va topiş

Union-find elementlarni ajralgan guruhlarga böladi. U ikki element bitta guruhdaligini tekşiradi va ikkita guruhni birlaştira oladi.

Avval [Massiv](/uz/arrays/array), [Ikkilik daraxt](/uz/trees/binary-tree) va [Graf](/uz/graphs/graph) darslarini öqing.

## Amallar {#interface}

`find` guruh ildizini, `connected` ikki ildizning tengligini qaytaradi. `union` turli guruhlarni birlaştirib `True` beradi. `groups` joriy guruhlar soni.

## Guruhlarni daraxtda saqlaş {#groups-as-trees}

Har elementning `parent[i]` qiymati ota elementga olib boradi. Ildizning otasi özi. Guruh ildizi uni boşqa guruhlardan ajratadi.

<Diagram label="Anatomy" :width="600" :height="232" alt="Six items in three groups. Items 1 and 2 point to 0, which is the root of the first group. Item 4 points to 3, the root of the second group. Item 5 is alone. Below, the parent array reads 0, 0, 0, 3, 3, 5.">
 <DGraph directed :nodes="[{ id: 0, x: 150, y: 40 }, { id: 1, x: 110, y: 112 }, { id: 2, x: 190, y: 112 }, { id: 3, x: 320, y: 40 }, { id: 4, x: 320, y: 112 }, { id: 5, x: 450, y: 40 }]" :edges="[{ from: 1, to: 0 }, { from: 2, to: 0 }, { from: 4, to: 3 }]" />
 <text class="dg-note end" x="144" y="194">parent</text>
 <DCells :x="156" :y="170" :values="[0, 0, 0, 3, 3, 5]" indices />
</Diagram>

## Ildizni topiş {#find}

`parent[item] == item` bölgungaça ota havolasi böylab yuring. Sarflanadigan vaqt daraxt balandligiga boğliq.

<Diagram label="find(2) and find(4)" cost="O(h)" :width="600" :height="190" alt="The same three groups. find(2) starts at 2 and follows the link to its parent 0. Item 0 is its own parent, so find(2) returns 0. find(4) follows the link from 4 to 3 and returns 3. Items 1 and 5 are not involved.">
 <DGraph directed :nodes="[{ id: 0, x: 150, y: 40, state: 'hit' }, { id: 1, x: 110, y: 112, state: 'muted' }, { id: 2, x: 190, y: 112, state: 'done' }, { id: 3, x: 320, y: 40, state: 'hit' }, { id: 4, x: 320, y: 112, state: 'done' }, { id: 5, x: 450, y: 40, state: 'muted' }]" :edges="[{ from: 1, to: 0, state: 'muted' }, { from: 2, to: 0, state: 'accent' }, { from: 4, to: 3, state: 'accent' }]" />
 <text class="dg-note" x="150" y="164">find(2) returns 0</text>
 <text class="dg-note" x="320" y="164">find(4) returns 3</text>
</Diagram>

```py
def find(self, item):
    while self.parent[item] != item:
        item = self.parent[item]
    return item
```

## Boğliqlikni tekşiriş {#connected}

Ikki elementning ildizini toping. Ular teng bölsa, ikkala element bitta guruhda.

```py
def connected(self, a, b):
    return self.find(a) == self.find(b)
```

## Birlaştiriş {#union}

Avval ikki ildizni toping. Farqli bölsa, kiçik guruh ildizini katta guruh ildiziga ulang. Katta ildizdagi ölçamni oşiring va guruhlar sonini bittaga kamaytiring.

<Diagram label="Union of 2 and 4" cost="O(h)" :width="600" :height="232" alt="To merge the groups of 2 and 4, find their roots, 0 and 3. The root 3 is attached under the root 0. In the parent array, the entry for 3 changes from 3 to 0.">
 <DGraph directed :nodes="[{ id: 0, x: 150, y: 40, state: 'done' }, { id: 1, x: 110, y: 112 }, { id: 2, x: 190, y: 112, state: 'hit' }, { id: 3, x: 320, y: 40, state: 'done' }, { id: 4, x: 320, y: 112, state: 'hit' }, { id: 5, x: 450, y: 40 }]" :edges="[{ from: 1, to: 0 }, { from: 2, to: 0 }, { from: 4, to: 3 }, { from: 3, to: 0, state: 'accent' }]" />
 <text class="dg-note end" x="144" y="194">parent</text>
 <DCells :x="156" :y="170" :values="[0, 0, 0, 0, 3, 5]" :states="{ 3: 'new' }" indices />
</Diagram>

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

## Yölni qisqartiriş {#path-compression}

Avval ildizni toping. Keyin bosib ötilgan yölga qaytib, har tugunni bevosita ildizga ulang. Keyingi qidiruv şu tugunlarda qisqaroq böladi.

<Diagram label="Path compression" cost="O(α(n)) amortized" :width="600" :height="200" alt="Before, item 4 points to 3 and 3 points to 0. After find is called on 4, item 4 points straight to the root 0.">
 <DGraph directed :nodes="[{ id: 'a0', label: 0, x: 170, y: 36 }, { id: 'a3', label: 3, x: 170, y: 100 }, { id: 'a4', label: 4, x: 170, y: 164 }, { id: 'b0', label: 0, x: 430, y: 50 }, { id: 'b3', label: 3, x: 390, y: 130 }, { id: 'b4', label: 4, x: 470, y: 130, state: 'hit' }]" :edges="[{ from: 'a4', to: 'a3' }, { from: 'a3', to: 'a0' }, { from: 'b3', to: 'b0' }, { from: 'b4', to: 'b0', state: 'accent' }]" />
 <text class="dg-note" x="290" y="90">find(4)</text><DArrow :from="[246, 100]" :to="[334, 100]" kind="muted" />
</Diagram>

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

## Tahlil {#analysis}

Tugun bir poğonaga pastlasa, u tegişli guruh kamida ikki baravar kattalaşgan. Şu sabab ölçam böyiça birlaştirişda balandlik `O(log n)`. Yölni qisqartiriş ham işlatilsa, amal amortizatsiya bilan `O(α(n))`, bunda `α` juda sekin ösadi.

### Tez qidiruvdan yölni qisqartirişgaça {#from-quick-find-to-path-compression}

Oddiy tez qidiruv har elementga guruh nomini yozadi, birlaştirişda esa nomlarni qayta yozadi. Tez birlaştiriş bitta ildizni ulaydi. Ölçam böyiça ulaş zanjirni oldini oladi, yölni qisqartiriş keyingi qidiruvlarni yengillaştiradi.

## Töliq dastur {#full-implementation}

Misolda `find(4)` dan oldin 4 ning otasi 3. Qidiruvdan keyin ota bevosita 0 ildiziga boğlanadi.

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

## Son bölmagan elementlar {#items-that-are-not-numbers}

Ketma-ket sonlar massivni indekslaydi. Ism yoki koordinata kabi xeşlanadigan kalitlar uçun `parent` va `group_size` ni luğatda saqlang.

```py
class UnionFind:
    def __init__(self, items):
        self.parent = {item: item for item in items}
        self.group_size = {item: 1 for item in items}
        self.groups = len(self.parent)
```

## Python tilida {#in-python}

Standart kutubxonada tayyor union-find yöq. Quyidagi amallarni massiv yoki luğat bilan yozsa böladi. SciPy da `DisjointSet` turi bor.

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

## Amallar xarajati {#costs-at-a-glance}

`find`, `union` va `connected` amortizatsiya bilan `O(α(n))`. Guruhlar sonini öqiş `O(1)). `n` element uçun xotira `O(n)`.

## Qayerda işlatiladi {#when-to-use}

Yangi aloqalar birin-ketin kelganda va guruhlar borasida tez-tez savol berilganda qulay. Qirrani olib taşlash uçun ushbu tuzilma guruhni bevosita ikkiga bölmaydi.

## Amaliy misol {#application}

Yönalişsiz grafda yangi qirraning ikki uçi allaqaçon boğlangan bölsa, qirra sikl yasaydi. Buni `union` ning `False` javobidan bilamiz.

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

## Xulosa {#key-points}

Ildiz guruhni bildiradi. Kiçik daraxtni kattasiga ulang. Qidiruvdan keyin yöldagi tugunlarni ildizga yaqinlaştiring.

## Maşq {#exercise}

`all_connected_at` vaqt böyiça tartiblangan `(time, a, b)` döstliklardan qaysi vaqtida barça odam bitta guruhga kirganini qaytarsin. Heç qaçon bitta guruh bölmasa `-1` qaytaring. Kamida ikki odam bor deb oling.

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

::: details Yeçim
Döstliklarni ketma-ket `union` qiling. `groups == 1` birinçi marta bajarilgandagi vaqt javob. `E` ta döstlik uçun vaqt `O(n + E · α(n))`, joy `O(n)`.

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

:::
