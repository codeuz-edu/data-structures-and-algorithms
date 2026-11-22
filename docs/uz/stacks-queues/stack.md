---
title: Stek
description: "Ustma-ust taxlangan likopçalardan oxirgi qöyilganini birinçi olamiz. Stek ham şu tartibga amal qiladi. Buni LIFO, yaʼni oxirgi kirgan birinçi çiqadi, deb ataymiz."
---

# Stek

Ustma-ust taxlangan likopçalardan oxirgi qöyilganini birinçi olamiz. Stek ham şu tartibga amal qiladi. Buni LIFO, yaʼni oxirgi kirgan birinçi çiqadi, deb ataymiz.

Avval [Algoritmning vaqt va xotira sarfi](/uz/foundations/measuring-cost), [Dinamik massiv](/uz/arrays/dynamic-array) va [Bir tomonlama boğlangan röyxat](/uz/linked-lists/singly-linked-list) darslarini öqing.

## Amallar {#interface}

`push` tepaga element qöşadi, `pop` tepadagini olib qaytaradi, `peek` esa uni joyida qoldirib öqiydi. `len` va `is_empty` holatni bildiradi. Böş stekda `pop` va `peek` `IndexError` beradi.

## Körinişi {#shape}

Eng tepadagi elementga bevosita murojaat qilamiz. Misolda stekning tepasi Python röyxatining oxiridir. Boşqa elementga yetiş uçun uning ustidagilarni olib turiş kerak.

<Diagram label="Anatomy" :width="420" :height="200" alt="A stack of three items. 12 is at the bottom and 3 is at the top. Push adds at the top and pop removes from the top.">
 <text class="dg-label is-accent" x="166" y="22">Push</text><DArrow :from="[166, 30]" :to="[166, 74]" kind="accent" />
 <text class="dg-label is-accent" x="198" y="22">Pop</text><DArrow :from="[198, 74]" :to="[198, 30]" kind="accent" />
 <DCells :x="150" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3]" :marks="{ 2: 'top' }" />
 <text class="dg-note end" x="136" y="172">bottom</text>
</Diagram>

## Tepaga qöşiş {#push}

Röyxat oxiriga `append(value)` qiling. Yangi qiymat stekning tepasiga aylanadi. Siğim yetmasa röyxat kattalaşadi, şu sabab `push` amortizatsiya bilan `O(1)`.

<Diagram label="Push 9" cost="O(1) amortized" :width="520" :height="200" alt="Pushing 9 puts it on top of 12, 7 and 3. The top now points to 9.">
 <DCells :x="110" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3]" />
 <text class="dg-note" x="248" y="120">push(9)</text><DArrow :from="[204, 130]" :to="[292, 130]" kind="muted" />
 <DCells :x="320" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" :states="{ 3: 'new' }" :marks="{ 3: 'top' }" />
</Diagram>

```py
def push(self, value):
    self.items.append(value)
```

## Tepadan oliş {#pop}

Stek böş bölsa `IndexError` keltiring. Aks holda `pop()` oxirgi qiymatni oladi. Röyxat oxiridagi amalda elementlar siljimaydi, biroq siğim qisqarişi mumkin.

<Diagram label="Pop" cost="O(1)" :width="520" :height="200" alt="Popping removes 9 from the top and returns it. The top moves down to 3.">
 <DCells :x="110" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" />
 <text class="dg-note" x="248" y="120">pop() returns 9</text><DArrow :from="[204, 130]" :to="[292, 130]" kind="muted" />
 <DCells :x="320" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" :states="{ 3: 'ghost' }" :marks="{ 2: 'top' }" />
</Diagram>

```py
def pop(self):
    if self.is_empty():
        raise IndexError('pop from an empty stack')
    return self.items.pop()
```

## Tepani öqiş {#peek}

Stek böş bölsa `IndexError` keltiring. Aks holda `items[-1]` ni qaytaring. Qiymat stekda qoladi.

<Diagram label="Peek" cost="O(1)" :width="520" :height="200" alt="Peeking at a stack of 12, 7, 3 and 9 returns 9, the top item. The stack is the same afterwards, with 9 still on top.">
 <DCells :x="110" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" />
 <text class="dg-note" x="248" y="120">peek() returns 9</text><DArrow :from="[204, 130]" :to="[292, 130]" kind="muted" />
 <text class="dg-note" x="248" y="152">nothing is removed</text>
 <DCells :x="320" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" :states="{ 3: 'hit' }" :marks="{ 3: 'top' }" />
</Diagram>

```py
def peek(self):
    if self.is_empty():
        raise IndexError('peek at an empty stack')
    return self.items[-1]
```

## Töliq dastur {#full-implementation}

Klass Python röyxatining oxiridan foydalanadi. Röyxatning boşida qöşiş yoki oliş har safar qolgan elementlarni siljitadi.

```python
class Stack:
    def __init__(self):  # O(1)
        self.items = []

    def __len__(self):  # O(1)
        return len(self.items)

    def is_empty(self):  # O(1)
        return len(self.items) == 0

    def push(self, value):  # O(1) amortized
        self.items.append(value)

    def pop(self):  # O(1) amortized
        if self.is_empty():
            raise IndexError('pop from an empty stack')
        return self.items.pop()

    def peek(self):  # O(1)
        if self.is_empty():
            raise IndexError('peek at an empty stack')
        return self.items[-1]

stack = Stack()
for value in [12, 7, 3, 9]:
    stack.push(value)
print(stack.peek())
print(stack.pop())
print(stack.pop())
print(len(stack), stack.is_empty())

stack.pop()
stack.pop()
try:
    stack.pop()
except IndexError as error:
    print(error)
```

## Boğlangan stek {#linked-stack}

Bir tomonlama röyxatning `head` tuguni stekning tepasi böla oladi. `push` yangi tugunni boşiga qöyadi, `pop` `head` ni keyingi tugunga siljitadi. Ikkalasi ham `O(1)`.

<Diagram label="Linked stack" cost="O(1) push and pop" :width="676" :height="130" alt="The stack 12, 7, 3, 9 stored as a linked list. HEAD refers to the node holding 9, the top of the stack. 9 links to 3, 3 to 7, 7 to 12, and 12, the bottom, links to None.">
 <text class="dg-name" x="50" y="78">HEAD</text>
 <DArrow :from="[76, 78]" :to="[118, 78]" kind="accent" />
 <DChain :x="120" :y="60" :values="[9, 3, 7, 12]" />
 <text class="dg-note" x="162" y="116">top · push and pop here</text>
 <text class="dg-note" x="534" y="116">bottom</text>
</Diagram>

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedStack:
    def __init__(self):  # O(1)
        self.head = None
        self.size = 0

    def __len__(self):  # O(1)
        return self.size

    def is_empty(self):  # O(1)
        return self.size == 0

    def push(self, value):  # O(1)
        node = Node(value)
        node.next = self.head
        self.head = node
        self.size += 1

    def pop(self):  # O(1) amortized
        if self.is_empty():
            raise IndexError('pop from an empty stack')
        node = self.head
        self.head = node.next
        self.size -= 1
        return node.value

    def peek(self):  # O(1)
        if self.is_empty():
            raise IndexError('peek at an empty stack')
        return self.head.value

stack = LinkedStack()
for value in [12, 7, 3, 9]:
    stack.push(value)
print(stack.peek())
print(stack.pop())
print(stack.pop())
print(len(stack), stack.is_empty())

stack.pop()
stack.pop()
try:
    stack.pop()
except IndexError as error:
    print(error)
```

## Çaqiruvlar steki {#the-call-stack}

Funksiya çaqirilganda Python uning mahalliy nomlari va qaytiş örnini saqlaydi. Çaqiruv tugagaç, uning yozuvi stekdan olinadi. [Rekursiya](/uz/recursion/recursion) bir funksiya uçun bir paytda bir neçta yozuv yaratişi mumkin.

## Python tilida {#in-python}

`list.append`, `list.pop()` va `items[-1]` odatdagi stek amallarini beradi. `collections.deque` ham röyxatning ikkala uçida tez işlaydi.

```python
from collections import deque
from queue import LifoQueue

items = []
items.append(12)
items.append(7)
print(items[-1])
print(items.pop())
print(items)

items = deque()
items.append(12)
items.append(7)
print(items.pop())

shared = LifoQueue()
shared.put(12)
shared.put(7)
print(shared.get())
print(shared.qsize())
```

## Amallar xarajati {#costs-at-a-glance}

Röyxatli stekda qöşiş va oliş amortizatsiya bilan `O(1)`. Boğlangan stekda ikkala amal `O(1)`. Ikkalasiga ham `n` ta qiymat uçun `O(n)` joy kerak.

## Qayerda işlatiladi {#when-to-use}

Oxirgi bajarilgan amalni bekor qiliş, oxirgi açilgan qavsni yopiş yoki qidiruvda oldingi qadamga qaytiş kerak bölsa, stekdan foydalanamiz.

## Amaliy misollar {#application}

Qavslarni tekşiriş va matn tahririni bekor qilişda oxirgi hodisa birinçi bölib körib çiqiladi.

### Qavslarni juftlaş {#matching-brackets}

Açiluvçi qavsni stekka qöying. Yopiluvçi qavs kelganda tepadagini olib, uning turi mosligini tekşiring. Satrdan söng stek böş bölişi kerak.

```python
def is_balanced(text):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for char in text:
        if char in '([{':
            stack.append(char)
        elif char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
    return not stack

print(is_balanced('([]{})'))
print(is_balanced('([)]'))
print(is_balanced('(('))
```

### Bekor qiliş va tiklaş {#undo-and-redo}

Özgarişdan oldin joriy matn bekor qiliş stekiga yoziladi. Bekor qiliş eski matnni tiklaydi va joriy matnni ikkinçi stekka saqlaydi. Yangi tahrir tiklaş stekini tozalaydi.

```python
class Editor:
    def __init__(self):
        self.text = ''
        self.undo_stack = []
        self.redo_stack = []

    def write(self, words):
        self.undo_stack.append(self.text)
        self.redo_stack.clear()
        self.text += words

    def undo(self):
        if self.undo_stack:
            self.redo_stack.append(self.text)
            self.text = self.undo_stack.pop()

    def redo(self):
        if self.redo_stack:
            self.undo_stack.append(self.text)
            self.text = self.redo_stack.pop()

editor = Editor()
editor.write('Hello')
editor.write(', world')
editor.undo()
print(editor.text)
editor.redo()
print(editor.text)
editor.undo()
editor.write('!')
editor.redo()
print(editor.text)
```

## Xulosa {#key-points}

Stekka qöşiş, undan oliş va ustidagi qiymatni öqiş bitta uçda bajariladi. Python röyxatining oxiri bilan işlanganda elementlar siljimaydi.

## Maşq {#exercise}

`evaluate` funksiyasi postfix ifodani hisoblasin. Son va `+`, `-`, `*` belgilari böşliq bilan ajratilgan. `3 4 +` yozuvi `3 + 4` ni bildiradi. Sonlarni stekka qöying, amal kelganda ikkita son olib natijani qayta qöying.

```python
def evaluate(expression):
    pass

print(evaluate('3 4 +'))
print(evaluate('3 4 + 2 *'))
print(evaluate('10 2 8 * + 3 -'))
```

::: details Yeçim
Birinçi olingan son öng operand, ikkinçisi çap operand. Ayirişda ularning tartibi muhim. `n` ta belgi uçun vaqt va qöşimça xotira `O(n)`.

```python
def evaluate(expression):
    stack = []
    for token in expression.split():
        if token in ('+', '-', '*'):
            right = stack.pop()
            left = stack.pop()
            if token == '+':
                stack.append(left + right)
            elif token == '-':
                stack.append(left - right)
            else:
                stack.append(left * right)
        else:
            stack.append(int(token))
    return stack.pop()

print(evaluate('3 4 +'))
print(evaluate('3 4 + 2 *'))
print(evaluate('10 2 8 * + 3 -'))
```

:::
