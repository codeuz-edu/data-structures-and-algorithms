---
title: Ikkilik daraxt
description: "Daraxtning bitta ildizi bor. Ildizdan boşqa har bir tugunga yagona yöl olib boradi. Ikkilik daraxtda har tugun köpi bilan ikkita bolaga ega. Ular çap va öng bola deb ataladi."
---

# Ikkilik daraxt

Daraxtning bitta ildizi bor. Ildizdan boşqa har bir tugunga yagona yöl olib boradi. Ikkilik daraxtda har tugun köpi bilan ikkita bolaga ega. Ular çap va öng bola deb ataladi.

Avval [Havolalar va xotira](/uz/foundations/references), [Rekursiya](/uz/recursion/recursion), [Stek](/uz/stacks-queues/stack) va [Navbat](/uz/stacks-queues/queue) darslarini öqing.

## Amallar {#interface}

Böş daraxt `None` bilan belgilanadi. `preorder`, `inorder`, `postorder` va `level_order` tugunlarni turli tartibda körib çiqadi. `height` va `size` butun daraxtni tekşiradi. Bu amallar `n` ta tugunda `O(n)` vaqt oladi.

## Atamalar {#terms}

Qirra ota tugunni bola tugun bilan boğlaydi. Bolasi yöq tugun bargdir. Tugun çuqurligi ildizdan ungaça bölgan qirralar soni. Balandlik esa tugundan eng uzoq barggaça bölgan qirralar soni. Barg balandligi 0, böş daraxtniki −1.

<Diagram label="Anatomy" :width="560" :height="200" alt="A binary tree with 8 at the root. Its children are 3 and 10. 3 has the children 1 and 6, and 10 has the right child 14. 8, 3 and 10 are internal nodes, and 1, 6 and 14 are leaves. The rows are levels 0, 1 and 2, and the tree has height 2.">
 <DTree :x="270" :y="40" :width="360" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 'root', 1: 'internal', 3: 'leaf' }" />
 <text class="dg-note end" x="540" y="44">level 0</text><text class="dg-note end" x="540" y="104">level 1</text><text class="dg-note end" x="540" y="164">level 2</text>
</Diagram>

```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

## Daraxt şakllari {#tree-shapes}

Har tugun 0 yoki 2 bolali bölsa, daraxt töla. Oxirgi sathdan boşqa sathlar tölib, oxirgi sath çapdan tölsa, yaxlit. Har sathi töla bölsa, mukammal. Har tugundagi ikki şox balandligi köpi bilan bittaga farq qilsa, balandlik böyiça muvozanatlangan. Zanjir şaklida har içki tugunning bitta bolasi bor.

<Diagram label="Tree shapes" :width="700" :height="216" alt="Five small trees. Full: every node has zero or two children. Complete: every level is full except the last, which fills from the left. Perfect: every level is full. Balanced: at every node the two subtrees differ in height by at most one. Degenerate: every internal node has one child, so the tree is a chain.">
 <DTree :x="70" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', null, null, '', '']" />
 <DTree :x="210" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', '', '', '']" />
 <DTree :x="350" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', '', '', '', '']" />
 <DTree :x="490" :y="40" :width="128" :gap="44" :r="12" :values="['', '', '', null, '', '', null]" />
 <DGraph :r="12" :nodes="[{ id: 1, label: '', x: 594, y: 40 }, { id: 2, label: '', x: 618, y: 69 }, { id: 3, label: '', x: 642, y: 99 }, { id: 4, label: '', x: 666, y: 128 }]" :edges="[{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }]" />
 <text class="dg-label is-ink" x="70" y="172">Full</text><text class="dg-note" x="70" y="190">0 or 2 children</text><text class="dg-note" x="70" y="205">at every node</text>
 <text class="dg-label is-ink" x="210" y="172">Complete</text><text class="dg-note" x="210" y="190">full levels, the last</text><text class="dg-note" x="210" y="205">filled from the left</text>
 <text class="dg-label is-ink" x="350" y="172">Perfect</text><text class="dg-note" x="350" y="190">every level</text><text class="dg-note" x="350" y="205">is full</text>
 <text class="dg-label is-ink" x="490" y="172">Balanced</text><text class="dg-note" x="490" y="190">subtree heights</text><text class="dg-note" x="490" y="205">differ by at most 1</text>
 <text class="dg-label is-ink" x="630" y="172">Degenerate</text><text class="dg-note" x="630" y="190">one child</text><text class="dg-note" x="630" y="205">per node</text>
</Diagram>

## Çuqurlik böyiça öqiş {#depth-first-traversals}

`preorder` avval tugunni, söng çap va öng şoxlarni öqiydi. `inorder` tugunni ikki şox orasida öqiydi. `postorder` tugunni ikkala şoxdan keyin öqiydi. Har biri butun daraxtni bir marta körib çiqadi.

<Diagram label="Three depth-first orders" cost="O(n)" :width="660" :height="220" alt="The same tree three times, with the visit order written next to each node. Preorder visits 8, 3, 1, 6, 10, 14. Inorder visits 1, 3, 6, 8, 10, 14. Postorder visits 1, 6, 3, 14, 10, 8.">
 <text class="dg-label is-ink" x="120" y="18">Preorder</text>
 <DTree :x="112" :y="50" :width="184" :gap="54" :r="15" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 1, 1: 2, 3: 3, 4: 4, 2: 5, 6: 6 }" />
 <text class="dg-note" x="120" y="204">8  3  1  6  10  14</text>
 <text class="dg-label is-ink" x="330" y="18">Inorder</text>
 <DTree :x="322" :y="50" :width="184" :gap="54" :r="15" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 3: 1, 1: 2, 4: 3, 0: 4, 2: 5, 6: 6 }" />
 <text class="dg-note" x="330" y="204">1  3  6  8  10  14</text>
 <text class="dg-label is-ink" x="540" y="18">Postorder</text>
 <DTree :x="532" :y="50" :width="184" :gap="54" :r="15" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 3: 1, 4: 2, 1: 3, 6: 4, 2: 5, 0: 6 }" />
 <text class="dg-note" x="540" y="204">1  6  3  14  10  8</text>
</Diagram>

```py
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value)
    inorder(node.right)
```

## Stek bilan çuqurlik böyiça öqiş {#depth-first-traversal-with-a-stack}

Ildizni stekka qöying. Tepadagi tugunni olganda, avval öng bolasini, keyin çap bolasini qöying. Şunda çap bola birinçi öqiladi. Stek hajmi daraxt balandligiga boğliq va Python rekursiya çegarasidan foydalanilmaydi.

<Diagram label="Preorder with a stack" cost="O(n)" :width="680" :height="250" alt="Seven snapshots of the stack, each drawn with its top highest. At the start it holds 8. Popping 8 pushes 10 and then 3. Popping 3 pushes 6 and then 1. Popping 1 and then 6 pushes nothing. Popping 10 pushes 14. Popping 14 leaves the stack empty. The nodes come off in the order 8, 3, 1, 6, 10, 14, which is preorder.">
 <text class="dg-label" x="340" y="40">The top of each stack is drawn highest</text>
 <DCells :x="28" :y="150" :h="34" vertical :values="[8]" :states="{ 0: 'new' }" /><text class="dg-note" x="52" y="208">start</text>
 <DCells :x="124" :y="150" :h="34" vertical :values="[10, 3]" :states="{ 0: 'new', 1: 'new' }" /><text class="dg-note" x="148" y="208">pop 8</text>
 <DCells :x="220" :y="150" :h="34" vertical :values="[10, 6, 1]" :states="{ 1: 'new', 2: 'new' }" /><text class="dg-note" x="244" y="208">pop 3</text>
 <DCells :x="316" :y="150" :h="34" vertical :values="[10, 6]" /><text class="dg-note" x="340" y="208">pop 1</text>
 <DCells :x="412" :y="150" :h="34" vertical :values="[10]" /><text class="dg-note" x="436" y="208">pop 6</text>
 <DCells :x="508" :y="150" :h="34" vertical :values="[14]" :states="{ 0: 'new' }" /><text class="dg-note" x="532" y="208">pop 10</text>
 <DCells :x="604" :y="150" :h="34" vertical :values="[null]" :states="{ 0: 'ghost' }" /><text class="dg-note" x="628" y="208">pop 14</text>
 <text class="dg-note is-accent" x="340" y="238">popped in the order 8, 3, 1, 6, 10, 14: preorder</text>
</Diagram>

```py
def preorder_iterative(root):
    out = []
    if root is None:
        return out
    stack = [root]
    while stack:
        node = stack.pop()
        out.append(node.value)
        if node.right is not None:
            stack.append(node.right)
        if node.left is not None:
            stack.append(node.left)
    return out
```

## Sath böyiça öqiş {#level-order}

Ildizni navbatga qöying. Har safar boşidagi tugunni olib, uning bolalarini oxiriga qöying. Tugunlar yuqori sathdan pastga qarab öqiladi. Eng keng sathda `w` ta tugun bölsa, navbat `O(w)` joy oladi.

<Diagram label="Level order" cost="O(n)" :width="560" :height="200" alt="The tree with the visit order next to each node: 8 first, then 3 and 10, then 1, 6 and 14. Each level is finished before the next one starts.">
 <DTree :x="280" :y="40" :width="360" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 6: 6 }" />
</Diagram>

```py
def level_order(root):
    if root is None:
        return
    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.value)
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
```

## Balandlik va ölçam {#height-and-size}

Böş daraxt balandligi −1 va ölçami 0. Boşqa tugunning balandligi `1 + max(left_height, right_height)`. Ölçami birga ikki şoxning ölçamini qöşib topiladi.

<Diagram label="Height of each subtree" cost="O(n)" :width="560" :height="220" alt="The example tree with the height of the subtree under each node written next to it. The leaves 1, 6 and 14 have height 0. 3 and 10 have height 1. The root 8 has height 2. The size of the tree is 6: 1 for the root, 3 nodes on the left and 2 on the right.">
 <DTree :x="280" :y="40" :width="360" :values="[8, 3, 10, 1, 6, null, 14]" :notes="{ 0: 'height 2', 1: 'height 1', 2: 'height 1', 3: 'height 0', 4: 'height 0', 6: 'height 0' }" />
 <text class="dg-note" x="280" y="210">size 6 = 1 for the root + 3 on the left + 2 on the right</text>
</Diagram>

```py
def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

def size(node):
    if node is None:
        return 0
    return 1 + size(node.left) + size(node.right)
```

## Ifoda daraxti {#expression-trees}

Barglar sonlarni, içki tugunlar arifmetik amallarni saqlaydi. Amalni bajarişdan oldin ikki bola qiymatini hisoblang. Bu `postorder` tartibiga mos.

<Diagram label="(10 + 2 * 8) - 3" cost="O(n)" :width="600" :height="262" alt="The expression (10 + 2 * 8) - 3 as a tree. The root is the minus sign. Its left subtree is 10 plus the subtree 2 times 8, and its right child is 3. Each operator is marked with its value: the times node is 16, the plus node 26 and the root 23. Read in postorder, the tree gives 10 2 8 * + 3 -.">
 <DTree :x="325" :y="36" :width="400" :gap="56" :values="['-', '+', 3, 10, '*', null, null, null, null, 2, 8]" :notes="{ 0: '= 23', 1: '= 26', 4: '= 16' }" />
 <text class="dg-note" x="300" y="250">read in postorder: 10 2 8 * + 3 -</text>
</Diagram>

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def evaluate(node):
    if node.left is None:
        return node.value
    left = evaluate(node.left)
    right = evaluate(node.right)
    if node.value == '+':
        return left + right
    if node.value == '-':
        return left - right
    return left * right

def postfix(node):
    if node.left is None:
        return str(node.value)
    return f'{postfix(node.left)} {postfix(node.right)} {node.value}'

expression = Node('-', Node('+', Node(10), Node('*', Node(2), Node(8))), Node(3))
print(evaluate(expression))
print(postfix(expression))
```

## Daraxtni massivga joylaş {#storing-a-tree-in-an-array}

Tugunlarni sath böyiça massivga yozsak, `i` indeksining bolalari `2 * i + 1` va `2 * i + 2` da turadi. Ota indeksi `(i - 1) // 2`, agar `i > 0` bölsa. Töliq daraxtda kataklar orasida böş joy qolmaydi. Siyrak daraxtda bu usul köp joy olişi mumkin.

<Diagram label="The example tree in a list" :width="640" :height="312" alt="The example tree stored in a list. Each node's index is written beside it: 8 at 0, 3 at 1, 10 at 2, 1 at 3, 6 at 4 and 14 at 6. Index 5 would hold the left child of 10, which does not exist, so that slot is empty in the tree and in the list. Arrows from index 1 to indexes 3 and 4 show that the children of index i are at 2i + 1 and 2i + 2.">
 <DTree :x="320" :y="36" :width="360" :gap="56" :values="[8, 3, 10, 1, 6, '', 14]" :states="{ 1: 'hit', 3: 'done', 4: 'done', 5: 'ghost' }" :edges="{ 5: 'removed' }" :notes="{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }" />
 <DCells :x="152" :y="196" :values="[8, 3, 10, 1, 6, null, 14]" :states="{ 1: 'hit', 3: 'done', 4: 'done', 5: 'ghost' }" indices />
 <DArrow :from="[224, 262]" :via="[[224, 276], [320, 276]]" :to="[320, 262]" kind="accent" />
 <DArrow :from="[224, 262]" :via="[[224, 276], [368, 276]]" :to="[368, 262]" kind="accent" />
 <text class="dg-note" x="296" y="300">children of index 1: 2 × 1 + 1 = 3 and 2 × 1 + 2 = 4</text>
 <text class="dg-note start" x="500" y="212">index 5 is a gap:</text>
 <text class="dg-note start" x="500" y="228">10 has no left child</text>
</Diagram>

```python
tree = [8, 3, 10, 1, 6, None, 14]

def inorder(tree, i, out):
    if i >= len(tree) or tree[i] is None:
        return
    inorder(tree, 2 * i + 1, out)
    out.append(tree[i])
    inorder(tree, 2 * i + 2, out)

values = []
inorder(tree, 0, values)
print(values)
```

## Umumiy daraxt {#general-trees}

Papka istalgan miqdorda fayl va papka saqlay oladi. Umumiy daraxtda tugun ikkita maydon örniga bolalar röyxatini saqlaydi. `show` avval papkani, keyin uning içidagilarni öqiydi.

<Diagram label="A general tree" :width="620" :height="208" alt="A general tree of folders. home has three children: music, photos and notes.txt. photos has two children, 2024 and 2025. music and notes.txt have an empty list of children. Each node keeps its children in a list, as many as it needs.">
 <DArrow :from="[300, 48]" :via="[[300, 68], [150, 68]]" :to="[150, 88]" :head="false" />
 <DArrow :from="[300, 48]" :to="[300, 88]" :head="false" />
 <DArrow :from="[300, 48]" :via="[[300, 68], [450, 68]]" :to="[450, 88]" :head="false" />
 <DArrow :from="[300, 120]" :via="[[300, 140], [240, 140]]" :to="[240, 160]" :head="false" />
 <DArrow :from="[300, 120]" :via="[[300, 140], [360, 140]]" :to="[360, 160]" :head="false" />
 <DBox :x="258" :y="16" :w="84" :h="32" text="home" small />
 <DBox :x="108" :y="88" :w="84" :h="32" text="music" small />
 <DBox :x="258" :y="88" :w="84" :h="32" text="photos" small />
 <DBox :x="408" :y="88" :w="84" :h="32" text="notes.txt" small />
 <DBox :x="198" :y="160" :w="84" :h="32" text="2024" small />
 <DBox :x="318" :y="160" :w="84" :h="32" text="2025" small />
 <text class="dg-note start" x="354" y="36">children = [music, photos, notes.txt]</text>
 <text class="dg-note" x="150" y="140">children = []</text>
 <text class="dg-note" x="450" y="140">children = []</text>
</Diagram>

```python
class TreeNode:
    def __init__(self, value, children=()):
        self.value = value
        self.children = list(children)

def show(node, depth=0):
    print('    ' * depth + node.value)
    for child in node.children:
        show(child, depth + 1)

def size(node):
    return 1 + sum(size(child) for child in node.children)

home = TreeNode('home', [
    TreeNode('music'),
    TreeNode('photos', [TreeNode('2024'), TreeNode('2025')]),
    TreeNode('notes.txt'),
])
show(home)
print(size(home))
```

## Töliq dastur {#full-implementation}

Quyidagi misol bir daraxtni bir neça tartibda öqiydi. Oxirida 2 000 tugunli zanjir tuzilib, stek bilan aylanib çiqiladi.

```python
from collections import deque

class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def preorder(node, out):  # O(n)
    if node is None:
        return
    out.append(node.value)
    preorder(node.left, out)
    preorder(node.right, out)

def inorder(node, out):  # O(n)
    if node is None:
        return
    inorder(node.left, out)
    out.append(node.value)
    inorder(node.right, out)

def postorder(node, out):  # O(n)
    if node is None:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.value)

def preorder_iterative(root):  # O(n)
    out = []
    if root is None:
        return out
    stack = [root]
    while stack:
        node = stack.pop()
        out.append(node.value)
        if node.right is not None:
            stack.append(node.right)
        if node.left is not None:
            stack.append(node.left)
    return out

def level_order(root):  # O(n)
    out = []
    if root is None:
        return out
    queue = deque([root])
    while queue:
        node = queue.popleft()
        out.append(node.value)
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
    return out

def height(node):  # O(n)
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

def size(node):  # O(n)
    if node is None:
        return 0
    return 1 + size(node.left) + size(node.right)

root = Node(8, Node(3, Node(1), Node(6)), Node(10, None, Node(14)))

for traverse in [preorder, inorder, postorder]:
    values = []
    traverse(root, values)
    print(traverse.__name__, values)
print('preorder_iterative', preorder_iterative(root))
print('level_order', level_order(root))
print('height', height(root), 'size', size(root))
print(level_order(None), height(None), size(None))

chain = None
for value in range(2000):
    chain = Node(value, None, chain)
print(len(preorder_iterative(chain)))
```

## Python tilida {#in-python}

Ikki bolali tugun uçun kiçik klass va böş şox uçun `None` yetarli. `xml.etree.ElementTree` esa XML hujjatidan ixtiyoriy sondagi bolalari bor elementlar daraxtini yasaydi.

```python
import xml.etree.ElementTree as ET

page = ET.fromstring('<html><head><title/></head><body><h1/><p/><p/></body></html>')
print([element.tag for element in page.iter()])
print(len(page), [child.tag for child in page])
print(len(page.find('body')))
```

## Amallar xarajati {#costs-at-a-glance}

Daraxtni aylanib çiqiş, balandlik va ölçamni aniqlaş `O(n)`. Çuqurlik böyiça öqiş balandlikka yaraşa joy, sath böyiça öqiş esa kenglikka yaraşa joy oladi.

## Qayerda işlatiladi {#when-to-use}

Har narsa tabiiy ravişda ikki qismga bölinadigan masalada ikkilik daraxt mos. Tartibli qidiruv uçun qoida qöşilsa [ikkilik qidiruv daraxti](/uz/trees/binary-search-tree), eng ustuvor element tez kerak bölsa [uyum](/uz/trees/heap) hosil böladi.

## Amaliy misol {#application}

Qaror daraxti har içki tugunda savol beradi. Javobga qarab çap yoki öng bolaga ötiladi. Barg yakuniy javobni saqlaydi. Faqat bitta yöl öqiladi.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def classify(node, facts):
    while node.left is not None:
        node = node.right if node.value in facts else node.left
    return node.value

animals = Node('flies',
               Node('swims', Node('dog'), Node('fish')),
               Node('has feathers', Node('bat'), Node('eagle')))
print(classify(animals, {'swims'}))
print(classify(animals, {'flies', 'has feathers'}))
print(classify(animals, {'flies'}))
```

## Xulosa {#key-points}

Tugunlar qanday tartibda öqilişi masalaga boğliq. Balandlik içma-iç çaqiruvlar soniga, kenglik navbatdagi tugunlar soniga taʼsir qiladi.

## Maşq {#exercise}

`count_leaves` daraxtdagi barglar sonini qaytarsin.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def count_leaves(node):
    pass

root = Node(8, Node(3, Node(1), Node(6)), Node(10, None, Node(14)))
print(count_leaves(root))
print(count_leaves(Node(5)))
print(count_leaves(None))
```

::: details Yeçim
Böş daraxtda 0 barg bor. Bolasiz tugun bitta barg. Boşqa tugunda ikki şoxning javoblarini qöşing. Vaqt `O(n)`, rekursiya xotirasi balandlikka mutanosib.

```python
class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def count_leaves(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    return count_leaves(node.left) + count_leaves(node.right)

root = Node(8, Node(3, Node(1), Node(6)), Node(10, None, Node(14)))
print(count_leaves(root))
print(count_leaves(Node(5)))
print(count_leaves(None))
```

:::
