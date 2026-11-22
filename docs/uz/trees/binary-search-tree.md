---
title: Ikkilik qidiruv daraxti
description: "Har tugunning çap şoxidagi barça qiymatlar undan kiçik, öng şoxidagilari undan katta. Şu qoida qiymatni qidirayotganda bitta şoxni butunlay çetlab ötişga yordam beradi."
---

# Ikkilik qidiruv daraxti

Har tugunning çap şoxidagi barça qiymatlar undan kiçik, öng şoxidagilari undan katta. Şu qoida qiymatni qidirayotganda bitta şoxni butunlay çetlab ötişga yordam beradi.

Avval [Ikkilik daraxt](/uz/trees/binary-tree), [Tartiblangan massiv va ikkilik qidiruv](/uz/arrays/binary-search) va [Rekursiya](/uz/recursion/recursion) darslarini öqing.

## Amallar {#interface}

Qidiriş, qöşiş, öçiriş va eng çet qiymatni topiş balandlikka boğliq. `between` qaytarilgan `k` ta qiymat uçun yana `O(k)` vaqt oladi. Muvozanatlangan daraxt balandligi logarifmik, zanjirniki çiziqli.

## Tartib qoidasi {#the-ordering-rule}

Qoida faqat ildizning bolalariga emas, har tugunning butun şoxiga tegişli. `inorder` bilan çap şox, tugun va öng şoxni oxirigaça öqisak, qiymatlar saralangan holda çiqadi.

<Diagram label="Anatomy" :width="600" :height="236" alt="A binary search tree with 8 at the root. The left subtree holds 3, 1, 6, 4 and 7, all smaller than 8. The right subtree holds 10, 14 and 13, all larger than 8.">
 <text class="dg-note" x="150" y="36">everything here is smaller than 8</text>
 <text class="dg-note" x="462" y="36">everything here is larger than 8</text>
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" />
</Diagram>

## Qidiriş {#search}

Ildizdan boşlang. Izlangan qiymat kiçik bölsa çapga, katta bölsa öngga öting. Tenglikda topildi. `None` ga yetilsa qiymat yöq. `in` şu yölni `__contains__` orqali bosadi.

<Diagram label="Search for 7" cost="O(h)" :width="600" :height="236" alt="The search for 7 starts at 8 and goes left, reaches 3 and goes right, reaches 6 and goes right, and finds 7. Four nodes are visited out of nine.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 1: 'done', 4: 'done', 10: 'hit' }" :edges="{ 1: 'accent', 4: 'accent', 10: 'accent' }" :notes="{ 0: '7 < 8', 1: '7 > 3', 4: '7 > 6' }" />
</Diagram>

```py
def search(self, key):
    node = self.root
    while node is not None and node.value != key:
        node = node.left if key < node.value else node.right
    return node

def __contains__(self, key):
    return self.search(key) is not None
```

## Qöşiş {#insert}

Qiymatni qidirayotgandek tuşa boring. Böş bola örniga yangi barg qöying. Teng qiymat topilsa, daraxt özgarmaydi.

<Diagram label="Insert 9" cost="O(h)" :width="600" :height="236" alt="Inserting 9: it is larger than 8, so go right to 10. It is smaller than 10 and 10 has no left child, so 9 becomes the left child of 10.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, 9, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 2: 'done', 5: 'new' }" :edges="{ 2: 'accent', 5: 'accent' }" :notes="{ 0: '9 > 8', 2: '9 < 10' }" />
</Diagram>

```py
def insert(self, value):
    parent = None
    node = self.root
    while node is not None:
        if value == node.value:
            return
        parent = node
        node = node.left if value < node.value else node.right
    if parent is None:
        self.root = Node(value)
    elif value < parent.value:
        parent.left = Node(value)
    else:
        parent.right = Node(value)
    self.size += 1
```

## Eng kiçik va eng katta qiymat {#minimum-and-maximum}

Eng kiçik qiymat çap boğlam tugagan joyda, eng kattasi öng boğlam tugagan joyda. Böş daraxtga bu sörov berilsa `IndexError` keltiriladi.

<Diagram label="Minimum and maximum" cost="O(h)" :width="600" :height="236" alt="The minimum is found by going left from 8 to 3 to 1, which has no left child. The maximum is found by going right from 8 to 10 to 14, which has no right child. 14 has a left child, 13, but it is smaller and does not matter.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 1: 'done', 3: 'hit', 2: 'done', 6: 'hit' }" :edges="{ 1: 'accent', 3: 'accent', 2: 'accent', 6: 'accent' }" :notes="{ 3: 'minimum', 6: 'maximum' }" />
</Diagram>

```py
def minimum(self):
    if self.root is None:
        raise IndexError('minimum of an empty tree')
    node = self.root
    while node.left is not None:
        node = node.left
    return node.value
```

## Öçiriş {#delete}

Bargni uzib taşlaş mumkin. Bitta bolali tugunni şu bola bilan almaştiramiz. Ikki bola bölsa, öng şoxning eng kiçik qiymatini tugunga köçiramiz va eski örnidan öçiramiz. Yangi qiymat ikki tomondagi tartibni saqlaydi.

<Diagram label="Delete 3, a node with two children" cost="O(h)" :width="600" :height="250" alt="To delete 3, find its in-order successor, the smallest value in its right subtree, which is 4. Copy 4 into the node that held 3, then remove the old 4, which is a leaf.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 1: 'ghost', 9: 'hit' }" :notes="{ 1: 'delete' }" />
 <DArrow :from="[205, 191]" :to="[185, 114]" kind="accent" />
 <text class="dg-note is-accent" x="210" y="240">in-order successor</text>
</Diagram>

```py
def delete(self, key):
    self.root = self._delete(self.root, key)
    self.size -= 1

def _delete(self, node, key):
    if node is None:
        raise KeyError(key)
    if key < node.value:
        node.left = self._delete(node.left, key)
    elif key > node.value:
        node.right = self._delete(node.right, key)
    elif node.left is None:
        return node.right
    elif node.right is None:
        return node.left
    else:
        successor = node.right
        while successor.left is not None:
            successor = successor.left
        node.value = successor.value
        node.right = self._delete(node.right, successor.value)
    return node
```

## Quyi va yuqori yaqin qiymat {#floor-and-ceiling}

`floor(x)` — `x` dan katta bölmagan eng katta qiymat. `ceiling(x)` — `x` dan kiçik bölmagan eng kiçik qiymat. Qidiruv paytida mos nomzodni eslab, kerakli şoxga öting.

<Diagram label="Floor and ceiling of 5" cost="O(h)" :width="600" :height="282" alt="The walk for 5 starts at 8 and goes left, reaches 3 and goes right, reaches 6 and goes left, reaches 4 and goes right, where there is no child, so 5 is not in the tree. The last node where the walk went right is 4, the floor of 5. The last node where it went left is 6, the ceiling of 5.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'done', 1: 'done', 4: 'hit', 9: 'hit' }" :edges="{ 1: 'accent', 4: 'accent', 9: 'accent' }" :notes="{ 0: '5 < 8', 1: '5 > 3', 4: '5 < 6', 9: '5 > 4' }" />
 <text class="dg-note" x="300" y="252">floor(5) is 4, the last node where the walk turned right</text>
 <text class="dg-note" x="300" y="270">ceiling(5) is 6, the last node where it turned left</text>
</Diagram>

```py
def floor(self, key):
    best = None
    node = self.root
    while node is not None:
        if node.value == key:
            return node.value
        if node.value < key:
            best = node.value
            node = node.right
        else:
            node = node.left
    return best
```

## Oraliqdagi qiymatlar {#range-query}

`between(low, high)` tartibli öqişni faqat oraliq bilan kesişadigan şoxlarda bajaradi. Tugun `low` bilan `high` orasida bölsa, uni natijaga yozing. Qaytarilgan qiymatlar saralangan böladi.

<Diagram label="Range query from 4 to 10" cost="O(h + k)" :width="600" :height="282" alt="between(4, 10) on the example tree. The walk visits 8, 3, 6, 4, 7 and 10. 3 is visited but lies outside the range. The subtree to the left of 3, holding 1, and the subtree to the right of 10, holding 14 and 13, are skipped because they cannot hold a value from 4 to 10. The result is 4, 6, 7, 8, 10.">
 <DTree :x="300" :y="40" :width="480" :gap="56" :values="[8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]" :states="{ 0: 'hit', 1: 'done', 2: 'hit', 3: 'muted', 4: 'hit', 6: 'muted', 9: 'hit', 10: 'hit', 13: 'muted' }" :edges="{ 1: 'accent', 2: 'accent', 4: 'accent', 9: 'accent', 10: 'accent', 3: 'muted', 6: 'muted', 13: 'muted' }" :notes="{ 3: 'skipped', 6: 'skipped' }" />
 <text class="dg-note is-accent" x="300" y="252">between(4, 10) returns [4, 6, 7, 8, 10]</text>
 <text class="dg-note" x="300" y="270">filled: in the range · outlined: visited, outside it · grey: skipped</text>
</Diagram>

```py
def between(self, low, high):
    values = []
    self._between(self.root, low, high, values)
    return values

def _between(self, node, low, high, values):
    if node is None:
        return
    if low < node.value:
        self._between(node.left, low, high, values)
    if low <= node.value <= high:
        values.append(node.value)
    if node.value < high:
        self._between(node.right, low, high, values)
```

## Kalit va qiymat {#keys-and-values}

Har tugun alohida kalit va qiymat saqlay oladi. Tartib kalitga qarab belgilanadi. Mavjud kalitga yoziş qiymatni yangilaydi, daraxt şakli saqlanadi.

```py
class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.left = None
        self.right = None

def get(self, key):
    node = self.root
    while node is not None and node.key != key:
        node = node.left if key < node.key else node.right
    if node is None:
        raise KeyError(key)
    return node.value
```

## Daraxt muvozanatdan çiqsa {#when-the-tree-goes-out-of-balance}

Qiymatlar ösiş yoki kamayiş tartibida qöşilsa, oddiy daraxt zanjirga aylanadi. Qidiriş `O(n)` gaça çöziladi. [AVL daraxti](/uz/trees/avl-tree) qöşiş va öçirişdan keyin muvozanatni tiklaydi.

<Diagram label="Same values, different shapes" :width="620" :height="236" alt="On the left, the values 1 to 5 inserted in sorted order form a single chain of height 4. On the right, the same values in a balanced tree of height 2.">
 <DGraph :nodes="[{ id: 1, x: 70, y: 30 }, { id: 2, x: 115, y: 72 }, { id: 3, x: 160, y: 114 }, { id: 4, x: 205, y: 156 }, { id: 5, x: 250, y: 198 }]" :edges="[{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }]" />
 <text class="dg-note" x="100" y="204">inserted 1, 2, 3, 4, 5</text><text class="dg-note" x="100" y="220">height 4</text>
 <DTree :x="460" :y="40" :width="200" :values="[3, 2, 5, 1, null, 4]" />
 <text class="dg-note" x="460" y="204">inserted 3, 2, 5, 1, 4</text><text class="dg-note" x="460" y="220">height 2</text>
</Diagram>

```python
import math
import random

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    depth = 1
    node = root
    while True:
        if value < node.value:
            if node.left is None:
                node.left = Node(value)
                return depth
            node = node.left
        else:
            if node.right is None:
                node.right = Node(value)
                return depth
            node = node.right
        depth += 1

random.seed(1)
for n in [100, 1000, 10000]:
    values = list(range(n))
    random.shuffle(values)
    root = Node(values[0])
    depths = [0] + [insert(root, value) for value in values[1:]]
    print(f'n={n}  log n={math.log2(n):.1f}  average depth={sum(depths) / n:.1f}  height={max(depths)}')
```

<Diagram label="A rotation" cost="O(1)" :width="560" :height="214" alt="On the left, 1, 2 and 3 inserted in sorted order form a chain of height 2. Rotating left at 1 lifts its right child, 2, to the top, with 1 as its left child and 3 as its right child. The result has height 1, and read in order it still gives 1, 2, 3.">
 <DGraph :nodes="[{ id: 1, x: 110, y: 40, state: 'done' }, { id: 2, x: 160, y: 96, state: 'done' }, { id: 3, x: 210, y: 152 }]" :edges="[{ from: 1, to: 2 }, { from: 2, to: 3 }]" />
 <text class="dg-note" x="160" y="200">chain: height 2</text>
 <DArrow :from="[260, 96]" :to="[370, 96]" kind="accent" />
 <text class="dg-note is-accent" x="315" y="84">rotate left at 1</text>
 <DTree :x="450" :y="40" :width="160" :gap="56" :values="[2, 1, 3]" :states="{ 0: 'done', 1: 'done' }" :edges="{ 1: 'accent' }" />
 <text class="dg-note" x="450" y="200">after: height 1</text>
</Diagram>

## Töliq dastur {#full-implementation}

Misolda 3 ning ikkita bolasi bor. U öçirilganda öng şoxdagi eng kiçik qiymat 4 uning örnini egallaydi.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def __iter__(self):  # O(n)
        values = []
        self._inorder(self.root, values)
        return iter(values)

    def _inorder(self, node, values):  # O(n)
        if node is not None:
            self._inorder(node.left, values)
            values.append(node.value)
            self._inorder(node.right, values)

    def search(self, key):  # O(h)
        node = self.root
        while node is not None and node.value != key:
            node = node.left if key < node.value else node.right
        return node

    def __contains__(self, key):  # O(h)
        return self.search(key) is not None

    def insert(self, value):  # O(h)
        parent = None
        node = self.root
        while node is not None:
            if value == node.value:
                return
            parent = node
            node = node.left if value < node.value else node.right
        if parent is None:
            self.root = Node(value)
        elif value < parent.value:
            parent.left = Node(value)
        else:
            parent.right = Node(value)
        self.size += 1

    def minimum(self):  # O(h)
        if self.root is None:
            raise IndexError('minimum of an empty tree')
        node = self.root
        while node.left is not None:
            node = node.left
        return node.value

    def maximum(self):  # O(h)
        if self.root is None:
            raise IndexError('maximum of an empty tree')
        node = self.root
        while node.right is not None:
            node = node.right
        return node.value

    def delete(self, key):  # O(h)
        self.root = self._delete(self.root, key)
        self.size -= 1

    def _delete(self, node, key):  # O(h)
        if node is None:
            raise KeyError(key)
        if key < node.value:
            node.left = self._delete(node.left, key)
        elif key > node.value:
            node.right = self._delete(node.right, key)
        elif node.left is None:
            return node.right
        elif node.right is None:
            return node.left
        else:
            successor = node.right
            while successor.left is not None:
                successor = successor.left
            node.value = successor.value
            node.right = self._delete(node.right, successor.value)
        return node

    def floor(self, key):  # O(h)
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value < key:
                best = node.value
                node = node.right
            else:
                node = node.left
        return best

    def ceiling(self, key):  # O(h)
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value > key:
                best = node.value
                node = node.left
            else:
                node = node.right
        return best

    def between(self, low, high):  # O(h + k)
        values = []
        self._between(self.root, low, high, values)
        return values

    def _between(self, node, low, high, values):  # O(h + k)
        if node is None:
            return
        if low < node.value:
            self._between(node.left, low, high, values)
        if low <= node.value <= high:
            values.append(node.value)
        if node.value < high:
            self._between(node.right, low, high, values)

tree = BinarySearchTree()
for value in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
    tree.insert(value)
print(list(tree), len(tree))
print(7 in tree, 5 in tree)
print(tree.minimum(), tree.maximum())
print(tree.floor(5), tree.ceiling(5), tree.floor(0))
print(tree.between(4, 10))

tree.insert(9)
tree.delete(3)
print(list(tree), len(tree))
print(tree.root.left.value)
try:
    tree.delete(5)
except KeyError as error:
    print('KeyError:', error)
```

## Python tilida {#in-python}

Standart kutubxonada tartibli qidiruv daraxti yöq. Saralangan röyxat va `bisect` çegara sörovlarini tez bajaradi. Örtaga qöşişda elementlar siljiydi.

```python
import bisect

values = [1, 3, 4, 6, 7, 8, 10, 13, 14]
bisect.insort(values, 9)
print(values)

key = 5
print('floor', values[bisect.bisect_right(values, key) - 1])
print('ceiling', values[bisect.bisect_left(values, key)])

low = bisect.bisect_left(values, 4)
high = bisect.bisect_right(values, 10)
print(values[low:high])
```

## Amallar xarajati {#costs-at-a-glance}

Oddiy daraxtda tasodifiy tartibda qöşilgan farqli qiymatlar uçun qidiriş kutilgan `O(log n)). Eng yomon holatda `O(n)`. Muvozanatni saqlaydigan daraxt ikkala holatda logarifmik balandlikni saqlaydi.

## Qayerda işlatiladi {#when-to-use}

Qiymatlar yangilanib turib, eng kiçik qiymat, undan keyingi qiymat yoki oraliq tez-tez söralsa, tartibli daraxt qulay. Özgarişlar kam bölsa, saralangan röyxat ham yetarli.

## Amaliy misol {#application}

Bir soatlik bandlovlar çapdan öngga vaqt böyiça saqlanadi. Yangi bandlov kesişishini biliş uçun undan oldingi va keyingi boşlaniş vaqtlarini tekşiramiz. Avvalgi bandlovlar kesişmasligi bu tekşiruv uçun muhim.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        parent = None
        node = self.root
        while node is not None:
            if value == node.value:
                return
            parent = node
            node = node.left if value < node.value else node.right
        if parent is None:
            self.root = Node(value)
        elif value < parent.value:
            parent.left = Node(value)
        else:
            parent.right = Node(value)

    def floor(self, key):
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value < key:
                best = node.value
                node = node.right
            else:
                node = node.left
        return best

    def ceiling(self, key):
        best = None
        node = self.root
        while node is not None:
            if node.value == key:
                return node.value
            if node.value > key:
                best = node.value
                node = node.left
            else:
                node = node.right
        return best

def book(calendar, start, length=60):
    before = calendar.floor(start)
    after = calendar.ceiling(start)
    if before is not None and start < before + length:
        return False
    if after is not None and after < start + length:
        return False
    calendar.insert(start)
    return True

calendar = BinarySearchTree()
for start in [540, 660, 600, 570, 720, 690]:
    print(f'{start // 60}:{start % 60:02}', book(calendar, start))
```

## Xulosa {#key-points}

Barça çap qiymatlar kiçik, barça öng qiymatlar katta. Şu qoida bir yöl böylab qidirişga imkon beradi. Sifatli muvozanat yölni qisqa saqlaydi.

## Maşq {#exercise}

`is_valid` daraxt qidiruv qoidasiga mos va qiymatlari takrorsiz ekanini tekşirsin. Har tugunni faqat uning bolalari bilan soliştiriş yetmaydi.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def is_valid(node):
    pass

good = Node(8, Node(3, Node(1), Node(6, Node(4), Node(7))), Node(10, None, Node(14, Node(13))))
bad = Node(8, Node(3, Node(1), Node(9)), Node(10))
print(is_valid(good), is_valid(bad))
print(is_valid(Node(5, Node(5))), is_valid(None))
```

::: details Yeçim
Ajdodlarning qiymatlari quyi va yuqori çegaralarni belgilaydi. Çapga ötganda joriy qiymat yuqori çegara, öngga ötganda quyi çegara. Ildiz çegarasiz, böş daraxt yaroqli. Vaqt `O(n)`, stek balandlikka mutanosib.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def is_valid(node, low=None, high=None):
    if node is None:
        return True
    if low is not None and node.value <= low:
        return False
    if high is not None and node.value >= high:
        return False
    return is_valid(node.left, low, node.value) and is_valid(node.right, node.value, high)

good = Node(8, Node(3, Node(1), Node(6, Node(4), Node(7))), Node(10, None, Node(14, Node(13))))
bad = Node(8, Node(3, Node(1), Node(9)), Node(10))
print(is_valid(good), is_valid(bad))
print(is_valid(Node(5, Node(5))), is_valid(None))
```

:::
