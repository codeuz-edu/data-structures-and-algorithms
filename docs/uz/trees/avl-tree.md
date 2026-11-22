---
title: AVL daraxti
description: "AVL daraxti qidiruv tartibini va balandlik muvozanatini saqlaydi. Qiymatlar ketma-ket tartibda kelganida ham daraxt zanjirga aylanmaydi."
---

# AVL daraxti

AVL daraxti qidiruv tartibini va balandlik muvozanatini saqlaydi. Qiymatlar ketma-ket tartibda kelganida ham daraxt zanjirga aylanmaydi.

Avval [Ikkilik qidiruv daraxti](/uz/trees/binary-search-tree) va [Rekursiya](/uz/recursion/recursion) darslarini öqing.

## Amallar {#interface}

Takroriy qiymat qöşilmaydi. `insert`, `delete` va tegişlilikni tekşiriş eng yomon holatda `O(log n)`. Tugunlar sonini hisoblagiçdan öqiş `O(1)`.

## Balandlik va muvozanat {#height-and-balance}

Har tugun öz balandligini saqlaydi. Böş şox balandligi −1, bargniki 0. Muvozanat koeffitsiyenti çap balandlikdan öng balandlikni ayiradi. U har tugunda −1, 0 yoki 1 bölişi kerak.

<Diagram label="Balance factor beside each node" :width="700" :height="268" alt="Two binary search trees with the balance factor written beside each node. The left tree has 5 at the root, 3 and 8 below it, 2 and 4 under 3, 9 under 8, and 1 under 2. Every balance factor is -1, 0 or +1, so it is an AVL tree. The right tree has 5 at the root, a chain 3, 2, 1 going left and a chain 7, 8, 9 going right. The root is at 0, but 3 is at +2 and 7 is at -2, so it is not an AVL tree.">
 <DTree :x="175" :y="40" :width="280" :gap="52" :values="[5, 3, 8, 2, 4, null, 9, 1]" :notes="{ 0: '+1', 1: '+1', 2: '-1', 3: '+1', 4: '0', 6: '0', 7: '0' }" />
 <DTree :x="525" :y="40" :width="280" :gap="52" :values="[5, 3, 7, 2, null, null, 8, 1, null, null, null, null, null, null, 9]" :states="{ 1: 'hit', 2: 'hit' }" :notes="{ 0: '0', 1: '+2', 2: '-2', 3: '+1', 6: '-1', 7: '0', 14: '0' }" />
 <text class="dg-label" x="175" y="240">AVL tree</text>
 <text class="dg-note" x="175" y="258">every node is at -1, 0 or +1</text>
 <text class="dg-label" x="525" y="240">not an AVL tree</text>
 <text class="dg-note" x="525" y="258">filled: 3 is at +2 and 7 is at -2</text>
</Diagram>

## Aylantiriş {#rotations}

Aylantiriş bolani otasidan yuqoriga kötaradi va qiymatlarning öqiliş tartibini saqlaydi. 5 ni öngga aylantirsak, 3 yuqoriga çiqadi. 3 ning avvalgi öng şoxi 5 ning çap şoxiga ötadi. Avval pastdagi, keyin yuqoridagi tugun balandligini yangilang.

<Diagram label="Two rotations" cost="O(1)" :width="640" :height="212" alt="Two trees that turn into each other. On the left, 5 is at the top. Its left child is 3, with children 2 and 4, and its right child is 6. Rotating right at 5 lifts 3 to the top: 3 has left child 2 and right child 5, and 5 has children 4 and 6. Rotating left at 3 turns the right tree back into the left one. 4 is the only node that changes parent. Read in order, both trees give 2, 3, 4, 5, 6.">
 <DTree :x="150" :y="40" :width="220" :gap="56" :values="[5, 3, 6, 2, 4]" :states="{ 0: 'done', 1: 'done' }" :edges="{ 1: 'accent', 4: 'accent' }" />
 <DArrow :from="[270, 80]" :to="[370, 80]" kind="accent" />
 <text class="dg-note is-accent" x="320" y="70">rotate right at 5</text>
 <DArrow :from="[370, 116]" :to="[270, 116]" kind="accent" />
 <text class="dg-note is-accent" x="320" y="136">rotate left at 3</text>
 <DTree :x="490" :y="40" :width="220" :gap="56" :values="[3, 2, 5, null, null, 4, 6]" :states="{ 0: 'done', 2: 'done' }" :edges="{ 2: 'accent', 5: 'accent' }" />
 <text class="dg-note" x="320" y="198">in order, both trees read 2, 3, 4, 5, 6</text>
</Diagram>

```py
def _rotate_right(self, node):
    child = node.left
    node.left = child.right
    child.right = node
    self._update(node)
    self._update(child)
    return child

def _rotate_left(self, node):
    child = node.right
    node.right = child.left
    child.left = node
    self._update(node)
    self._update(child)
    return child
```

```py
def _height(self, node):
    return -1 if node is None else node.height

def _balance(self, node):
    return self._height(node.left) - self._height(node.right)

def _update(self, node):
    node.height = 1 + max(self._height(node.left), self._height(node.right))
```

## Tört holat {#the-four-cases}

Çap-çap holatda tugunni öngga, öng-öng holatda çapga aylantiring. Çap-öng holatda avval çap bolani çapga, keyin otani öngga aylantiring. Öng-çap holatida ikki amal teskarisiga bajariladi.

<Diagram label="Left-left: insert 3, 2, 1" cost="O(1)" :width="560" :height="168" alt="Inserting 3, 2 and 1 makes a chain going left. 3 is at +2 and its left child 2 is at +1, both leaning left. One rotation right at 3 lifts 2 to the top, with 1 on its left and 3 on its right.">
 <DTree :x="150" :y="36" :width="160" :gap="50" :values="[3, 2, null, 1]" :states="{ 3: 'new' }" :notes="{ 0: '+2', 1: '+1' }" />
 <DArrow :from="[230, 70]" :to="[330, 70]" kind="accent" />
 <text class="dg-note is-accent" x="280" y="60">rotate right at 3</text>
 <DTree :x="410" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 1: 'new' }" :edges="{ 2: 'accent' }" />
</Diagram>

<Diagram label="Right-right: insert 1, 2, 3" cost="O(1)" :width="560" :height="168" alt="Inserting 1, 2 and 3 makes a chain going right. 1 is at -2 and its right child 2 is at -1, both leaning right. One rotation left at 1 lifts 2 to the top, with 1 on its left and 3 on its right.">
 <DTree :x="150" :y="36" :width="160" :gap="50" :values="[1, null, 2, null, null, null, 3]" :states="{ 6: 'new' }" :notes="{ 0: '-2', 2: '-1' }" />
 <DArrow :from="[250, 70]" :to="[350, 70]" kind="accent" />
 <text class="dg-note is-accent" x="300" y="60">rotate left at 1</text>
 <DTree :x="430" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 2: 'new' }" :edges="{ 1: 'accent' }" />
</Diagram>

<Diagram label="Left-right: insert 3, 1, 2" cost="O(1)" :width="700" :height="168" alt="Inserting 3, 1 and 2 makes a zig-zag: 3 is at +2, but its left child 1 is at -1, because 2 went to the right of 1. A rotation left at 1 straightens it into a chain 3, 2, 1 going left, which is the left-left case. A rotation right at 3 then puts 2 on top, with 1 and 3 below it.">
 <DTree :x="110" :y="36" :width="160" :gap="50" :values="[3, 1, null, null, 2]" :states="{ 4: 'new' }" :notes="{ 0: '+2', 1: '-1' }" />
 <DArrow :from="[160, 70]" :to="[260, 70]" kind="accent" />
 <text class="dg-note is-accent" x="210" y="60">rotate left at 1</text>
 <DTree :x="350" :y="36" :width="160" :gap="50" :values="[3, 2, null, 1]" :states="{ 1: 'new' }" :edges="{ 1: 'accent', 3: 'accent' }" :notes="{ 0: '+2', 1: '+1' }" />
 <DArrow :from="[405, 70]" :to="[505, 70]" kind="accent" />
 <text class="dg-note is-accent" x="455" y="60">rotate right at 3</text>
 <DTree :x="600" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 0: 'new' }" :edges="{ 2: 'accent' }" />
</Diagram>

<Diagram label="Right-left: insert 1, 3, 2" cost="O(1)" :width="700" :height="168" alt="Inserting 1, 3 and 2 makes a zig-zag: 1 is at -2, but its right child 3 is at +1, because 2 went to the left of 3. A rotation right at 3 straightens it into a chain 1, 2, 3 going right, which is the right-right case. A rotation left at 1 then puts 2 on top, with 1 and 3 below it.">
 <DTree :x="110" :y="36" :width="160" :gap="50" :values="[1, null, 3, null, null, 2]" :states="{ 5: 'new' }" :notes="{ 0: '-2', 2: '+1' }" />
 <DArrow :from="[200, 70]" :to="[290, 70]" kind="accent" />
 <text class="dg-note is-accent" x="245" y="60">rotate right at 3</text>
 <DTree :x="350" :y="36" :width="160" :gap="50" :values="[1, null, 2, null, null, null, 3]" :states="{ 2: 'new' }" :edges="{ 2: 'accent', 6: 'accent' }" :notes="{ 0: '-2', 2: '-1' }" />
 <DArrow :from="[440, 70]" :to="[530, 70]" kind="accent" />
 <text class="dg-note is-accent" x="485" y="60">rotate left at 1</text>
 <DTree :x="600" :y="36" :width="160" :gap="50" :values="[2, 1, 3]" :states="{ 0: 'new' }" :edges="{ 1: 'accent' }" />
</Diagram>

```py
def _rebalance(self, node):
    self._update(node)
    balance = self._balance(node)
    if balance > 1:
        if self._balance(node.left) < 0:
            node.left = self._rotate_left(node.left)
        return self._rotate_right(node)
    if balance < -1:
        if self._balance(node.right) > 0:
            node.right = self._rotate_right(node.right)
        return self._rotate_left(node)
    return node
```

## Qöşiş {#insert}

Qiymatni oddiy qidiruv daraxtidagidek barg qilib qöying. Qaytişda har tugun balandligini yangilang va muvozanatdan çiqqan şoxni aylantiring. Yangi ildiz havolasini yuqoridagi çaqiruvga qaytaring.

<Diagram label="Insert 6" cost="O(log n)" :width="700" :height="250" alt="On the left, 6 has just been added as the right child of 5, below 4, below the root 2. The path 2, 4, 5, 6 is highlighted. On the way back up, 5 is at -1 and 4 is at -1, which are allowed, and the root 2 is at -2. On the right, after a rotation left at 2: 4 is the root, 2 is its left child with children 1 and 3, and 5 is its right child with right child 6. The tree has height 2, as it had before the insert.">
 <DTree :x="160" :y="40" :width="280" :gap="52" :values="[2, 1, 4, null, null, 3, 5, null, null, null, null, null, null, null, 6]" :states="{ 14: 'new' }" :edges="{ 2: 'accent', 6: 'accent', 14: 'accent' }" :notes="{ 0: '-2', 2: '-1', 6: '-1' }" />
 <DArrow :from="[325, 100]" :to="[410, 100]" kind="accent" />
 <text class="dg-note is-accent" x="367" y="90">rotate left at 2</text>
 <DTree :x="540" :y="40" :width="280" :gap="52" :values="[4, 2, 5, 1, 3, null, 6]" :states="{ 6: 'new' }" :edges="{ 1: 'accent', 4: 'accent' }" />
 <text class="dg-note" x="160" y="238">6 added, the root 2 is out of balance</text>
 <text class="dg-note" x="540" y="238">repaired, height 2 as before</text>
</Diagram>

```py
def insert(self, value):
    if value in self:
        return
    self.root = self._insert(self.root, value)
    self.size += 1

def _insert(self, node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = self._insert(node.left, value)
    else:
        node.right = self._insert(node.right, value)
    return self._rebalance(node)
```

## Saralangan qiymatlarni qöşiş {#sorted-input-step-by-step}

1 dan 7 gaça qiymatlar öng tomondan qöşiladi. Törtta çap aylantirişdan söng 4 ildizda, 1 va 7 esa eng çet barglarda turadi.

<Diagram label="Inserting 1 to 7 in order" :width="700" :height="214" alt="The tree at three moments. After 1, 2 and 3: 2 at the root with children 1 and 3, height 1. After 4 and 5: 2 at the root, 1 on its left, 4 on its right with children 3 and 5, height 2. After 6 and 7: 4 at the root, 2 with children 1 and 3 on the left, 6 with children 5 and 7 on the right, height 2. The value inserted last is highlighted each time.">
 <DTree :x="120" :y="36" :width="200" :gap="50" :values="[2, 1, 3]" :states="{ 2: 'new' }" />
 <DTree :x="350" :y="36" :width="200" :gap="50" :values="[2, 1, 4, null, null, 3, 5]" :states="{ 6: 'new' }" />
 <DTree :x="580" :y="36" :width="200" :gap="50" :values="[4, 2, 6, 1, 3, 5, 7]" :states="{ 6: 'new' }" />
 <text class="dg-label" x="120" y="184">after 3</text><text class="dg-note" x="120" y="202">height 1</text>
 <text class="dg-label" x="350" y="184">after 5</text><text class="dg-note" x="350" y="202">height 2</text>
 <text class="dg-label" x="580" y="184">after 7</text><text class="dg-note" x="580" y="202">height 2</text>
</Diagram>

## Qidiriş {#search}

Aylantirişlar qidiruv tartibini saqlaydi. Ildizdan yurib, har sathda bitta tugunni tekşiramiz. Balandlik logarifmik bölgani uçun qidiriş ham şunça qadam oladi.

```py
def __contains__(self, key):
    node = self.root
    while node is not None and node.value != key:
        node = node.left if key < node.value else node.right
    return node is not None
```

## Öçiriş {#delete}

Avval oddiy qidiruv daraxti qoidasidan foydalaning. Tugunni öçirgandan keyin ildizga qaytgunça balandliklarni yangilang va zarur joylarda aylantiring. Öçirişdan söng bir neça sathda muvozanat buzilişi mumkin.

## Töliq dastur {#full-implementation}

Dastur 1 200 ta saralangan qiymatni AVL daraxtiga yozadi. Natijadagi balandlik 10.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 0

class AVLTree:
    def __init__(self):  # O(1)
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

    def __contains__(self, key):  # O(log n)
        node = self.root
        while node is not None and node.value != key:
            node = node.left if key < node.value else node.right
        return node is not None

    def insert(self, value):  # O(log n)
        if value in self:
            return
        self.root = self._insert(self.root, value)
        self.size += 1

    def _insert(self, node, value):  # O(log n)
        if node is None:
            return Node(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        else:
            node.right = self._insert(node.right, value)
        return self._rebalance(node)

    def _height(self, node):  # O(1)
        return -1 if node is None else node.height

    def _balance(self, node):  # O(1)
        return self._height(node.left) - self._height(node.right)

    def _update(self, node):  # O(1)
        node.height = 1 + max(self._height(node.left), self._height(node.right))

    def _rotate_right(self, node):  # O(1)
        child = node.left
        node.left = child.right
        child.right = node
        self._update(node)
        self._update(child)
        return child

    def _rotate_left(self, node):  # O(1)
        child = node.right
        node.right = child.left
        child.left = node
        self._update(node)
        self._update(child)
        return child

    def _rebalance(self, node):  # O(1)
        self._update(node)
        balance = self._balance(node)
        if balance > 1:
            if self._balance(node.left) < 0:
                node.left = self._rotate_left(node.left)
            return self._rotate_right(node)
        if balance < -1:
            if self._balance(node.right) > 0:
                node.right = self._rotate_right(node.right)
            return self._rotate_left(node)
        return node

tree = AVLTree()
for value in range(1, 8):
    tree.insert(value)
print(list(tree), len(tree))
print(tree.root.value, tree.root.height)
print(4 in tree, 8 in tree)
tree.insert(4)
print(len(tree))

big = AVLTree()
for value in range(1200):
    big.insert(value)
print(len(big), big.root.height)
```

## Python tilida {#in-python}

Standart kutubxonada AVL turi yöq. Tartiblangan röyxatda `bisect` qidirişni `O(log n)` da, qöşişni eng yomon holatda `O(n)` da bajaradi.

```python
import bisect

values = []
for value in [5, 1, 4, 2, 3, 7, 6]:
    bisect.insort(values, value)
print(values)

def contains(items, value):
    i = bisect.bisect_left(items, value)
    return i < len(items) and items[i] == value

print(contains(values, 4), contains(values, 8))
print(values[0], values[-1])
```

## Amallar xarajati {#costs-at-a-glance}

Qidiriş, qöşiş va öçiriş `O(log n)`, barça elementlarni tartib bilan öqiş `O(n)`. Har tugunda bitta qöşimça balandlik soni bor, jami joy `O(n)`.

## Qayerda işlatiladi {#when-to-use}

Tartib saqlanişi va tez-tez yangilanadigan qiymatlarni izlaş kerak bölsa, AVL yordam beradi. Oraliqni sanab çiqişda qaytariladigan qiymatlar soni ham vaqtga qöşiladi.

## Amaliy misol {#application}

Bandlovlar taqvimida maʼlum vaqtdan keyingi birinçi bandlovni topiş kerak. Tugun vaqti yetarli katta bölsa, uni nomzod qilib saqlab çapga ötamiz. U erta bölsa, öngga ötamiz.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 0

class AVLTree:
    def __init__(self):
        self.root = None
        self.size = 0

    def __len__(self):
        return self.size

    def __iter__(self):
        values = []
        self._inorder(self.root, values)
        return iter(values)

    def _inorder(self, node, values):
        if node is not None:
            self._inorder(node.left, values)
            values.append(node.value)
            self._inorder(node.right, values)

    def __contains__(self, key):
        node = self.root
        while node is not None and node.value != key:
            node = node.left if key < node.value else node.right
        return node is not None

    def insert(self, value):
        if value in self:
            return
        self.root = self._insert(self.root, value)
        self.size += 1

    def _insert(self, node, value):
        if node is None:
            return Node(value)
        if value < node.value:
            node.left = self._insert(node.left, value)
        else:
            node.right = self._insert(node.right, value)
        return self._rebalance(node)

    def _height(self, node):
        return -1 if node is None else node.height

    def _balance(self, node):
        return self._height(node.left) - self._height(node.right)

    def _update(self, node):
        node.height = 1 + max(self._height(node.left), self._height(node.right))

    def _rotate_right(self, node):
        child = node.left
        node.left = child.right
        child.right = node
        self._update(node)
        self._update(child)
        return child

    def _rotate_left(self, node):
        child = node.right
        node.right = child.left
        child.left = node
        self._update(node)
        self._update(child)
        return child

    def _rebalance(self, node):
        self._update(node)
        balance = self._balance(node)
        if balance > 1:
            if self._balance(node.left) < 0:
                node.left = self._rotate_left(node.left)
            return self._rotate_right(node)
        if balance < -1:
            if self._balance(node.right) > 0:
                node.right = self._rotate_right(node.right)
            return self._rotate_left(node)
        return node

def next_at_or_after(tree, time):
    node = tree.root
    best = None
    while node is not None:
        if node.value >= time:
            best = node.value
            node = node.left
        else:
            node = node.right
    return best

bookings = AVLTree()
for time in ['13:30', '09:00', '17:00', '10:15', '12:00', '15:45', '11:30']:
    bookings.insert(time)
print(list(bookings))

for asked in ['08:00', '12:00', '12:05', '18:00']:
    print(asked, next_at_or_after(bookings, asked))
```

## Xulosa {#key-points}

Muvozanat har tugunda amal qiladi. Aylantiriş qidiruv tartibini buzmasdan balandlikni tuzatadi. Şu tufayli asosiy amallar logarifmik vaqt oladi.

## Maşq {#exercise}

`is_avl` ikkilik daraxtning har tugunida şoxlar balandligi köpi bilan bittaga farq qilişini tekşirsin. Tugunlarda `height` saqlanmagan. Bu maşqda qiymatlarning qidiruv tartibi tekşirilmaydi.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def is_avl(node):
    pass

balanced = Node(5, Node(3, Node(2, Node(1)), Node(4)), Node(8, None, Node(9)))
lopsided = Node(5, Node(3, Node(2, Node(1))), Node(7, None, Node(8, None, Node(9))))
print(is_avl(balanced))
print(is_avl(lopsided))
print(is_avl(None))
```

::: details Yeçim
Har şoxdan balandlikni qaytaring. Muvozanat buzilsa `None` qaytaring. Ikkala javob son va ayirma köpi bilan 1 bölsa, joriy balandlikni hisoblang. Har tugun bir marta öqiladi.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def checked_height(node):
    if node is None:
        return -1
    left = checked_height(node.left)
    right = checked_height(node.right)
    if left is None or right is None or abs(left - right) > 1:
        return None
    return 1 + max(left, right)

def is_avl(node):
    return checked_height(node) is not None

balanced = Node(5, Node(3, Node(2, Node(1)), Node(4)), Node(8, None, Node(9)))
lopsided = Node(5, Node(3, Node(2, Node(1))), Node(7, None, Node(8, None, Node(9))))
print(is_avl(balanced))
print(is_avl(lopsided))
print(is_avl(None))
```

:::
