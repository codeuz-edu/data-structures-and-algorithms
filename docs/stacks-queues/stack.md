---
title: Stack
description: "A stack in Python: push, pop and peek in constant time, built on a list and on a linked list, with diagrams, the call stack, bracket matching and undo and redo."
---

# Stack

Think of a pile of plates. A plate goes on top, and the plate on top comes off first. A stack follows the same rule, called last in, first out or LIFO.

Stacks are behind the undo button, the browser's back button, and the way a program remembers which function to return to.

**You need:** [Measuring Cost](/foundations/measuring-cost), [Dynamic Array](/arrays/dynamic-array) and [Singly Linked List](/linked-lists/singly-linked-list).

## Interface

A stack is an **abstract data type**, or ADT. It is defined by the operations it offers and what they do, not by how it stores its items. Any class that offers these five operations is a stack, whatever it keeps inside.

| Operation | What it does | Cost |
| --- | --- | --- |
| `push(value)` | Put `value` on top | `O(1)` [amortized](/arrays/dynamic-array#why-append-is-still-cheap) |
| `pop()` | Remove the top item and return it | `O(1)` amortized |
| `peek()` | Return the top item and leave it in place | `O(1)` |
| `is_empty()` | Tell whether the stack has no items | `O(1)` |
| `len(stack)` | Return the number of items | `O(1)` |

`pop` and `peek` raise `IndexError` when the stack is empty. List-backed push and pop are amortized because they can resize the list. The [linked version](#linked-stack) changes a fixed number of links for each push or pop.

## Shape

<Diagram label="Anatomy" :width="420" :height="200" alt="A stack of three items. 12 is at the bottom and 3 is at the top. Push adds at the top and pop removes from the top.">
 <text class="dg-label is-accent" x="166" y="22">Push</text><DArrow :from="[166, 30]" :to="[166, 74]" kind="accent" />
 <text class="dg-label is-accent" x="198" y="22">Pop</text><DArrow :from="[198, 74]" :to="[198, 30]" kind="accent" />
 <DCells :x="150" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3]" :marks="{ 2: 'top' }" />
 <text class="dg-note end" x="136" y="172">bottom</text>
</Diagram>

Only the top item is reachable. To get at 12, the two items above it have to come off first.

The first version on this page keeps the items in a Python `list`, with the end of the list as the top. `append` and `pop` work at that end without shifting anything.

## Push

<Diagram label="Push 9" cost="O(1) amortized" :width="520" :height="200" alt="Pushing 9 puts it on top of 12, 7 and 3. The top now points to 9.">
 <DCells :x="110" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3]" />
 <text class="dg-note" x="248" y="120">push(9)</text><DArrow :from="[204, 130]" :to="[292, 130]" kind="muted" />
 <DCells :x="320" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" :states="{ 3: 'new' }" :marks="{ 3: 'top' }" />
</Diagram>

1. Append `value` to the end of the list. If the list has no spare room, it first moves into a bigger block.
2. The new item is now the top.

```py
def push(self, value):
    self.items.append(value)
```

Push costs `O(1)` amortized. The rare append that has to grow the list costs `O(n)`, but it is paid for by the many cheap appends around it.

## Pop

<Diagram label="Pop" cost="O(1)" :width="520" :height="200" alt="Popping removes 9 from the top and returns it. The top moves down to 3.">
 <DCells :x="110" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" />
 <text class="dg-note" x="248" y="120">pop() returns 9</text><DArrow :from="[204, 130]" :to="[292, 130]" kind="muted" />
 <DCells :x="320" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" :states="{ 3: 'ghost' }" :marks="{ 2: 'top' }" />
</Diagram>

1. If the stack is empty, raise `IndexError`.
2. Remove the last item of the list and return it. The item below it becomes the top.

```py
def pop(self):
    if self.is_empty():
        raise IndexError('pop from an empty stack')
    return self.items.pop()
```

`pop()` with no index takes the last item, so no elements shift. The list can sometimes shrink, making the cost amortized `O(1)`.

## Peek

<Diagram label="Peek" cost="O(1)" :width="520" :height="200" alt="Peeking at a stack of 12, 7, 3 and 9 returns 9, the top item. The stack is the same afterwards, with 9 still on top.">
 <DCells :x="110" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" />
 <text class="dg-note" x="248" y="120">peek() returns 9</text><DArrow :from="[204, 130]" :to="[292, 130]" kind="muted" />
 <text class="dg-note" x="248" y="152">nothing is removed</text>
 <DCells :x="320" :y="150" :w="64" :h="36" vertical :values="[12, 7, 3, 9]" :states="{ 3: 'hit' }" :marks="{ 3: 'top' }" />
</Diagram>

1. If the stack is empty, raise `IndexError`.
2. Return the last item of the list, `items[-1]`, and leave it there.

```py
def peek(self):
    if self.is_empty():
        raise IndexError('peek at an empty stack')
    return self.items[-1]
```

Reading one index costs `O(1)`.

## Full implementation

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

Using the front of the list as the top would also give a stack, but a slow one. `insert(0, value)` and `pop(0)` shift every other item, so each push and pop would cost `O(n)`.

## Linked stack

The interface says nothing about storage, so a [singly linked list](/linked-lists/singly-linked-list) works just as well. Make its head the top: push is [`push_front`](/linked-lists/singly-linked-list#insert-at-the-head) and pop is [`pop_front`](/linked-lists/singly-linked-list#remove-the-head), and both are `O(1)`.

<Diagram label="Linked stack" cost="O(1) push and pop" :width="676" :height="130" alt="The stack 12, 7, 3, 9 stored as a linked list. HEAD refers to the node holding 9, the top of the stack. 9 links to 3, 3 to 7, 7 to 12, and 12, the bottom, links to None.">
 <text class="dg-name" x="50" y="78">HEAD</text>
 <DArrow :from="[76, 78]" :to="[118, 78]" kind="accent" />
 <DChain :x="120" :y="60" :values="[9, 3, 7, 12]" />
 <text class="dg-note" x="162" y="116">top · push and pop here</text>
 <text class="dg-note" x="534" y="116">bottom</text>
</Diagram>

1. Push: make a node, point its `next` at the current head, and make it the new head.
2. Pop: take the head node, move `head` on to its `next`, and return the value the old head held.

The head is the right end to use. Removing the last node of a singly linked list needs the node before it, and finding that node is an `O(n)` walk.

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

The demo is the one from the list-backed `Stack`, and it prints the same lines. Code that only calls the five operations cannot tell the two classes apart. That is what it means for a stack to be an abstract data type.

## The call stack

When one function calls another, the caller has to wait. Python keeps a record of each waiting call, called a frame, with its local variables and the line to come back to. The frames live on a stack: a call pushes a frame and a return pops it, so the function called last is the first to finish.

The [Recursion](/recursion/recursion#the-call-stack) page draws the frames of `factorial(4)` piling up and coming off again. That page also shows the stack's limit: Python stops at about 1000 nested calls with `RecursionError`. When a problem needs more depth than that, a loop with a stack of your own can do the same work, as in a [tree traversal with a stack](/trees/binary-tree#depth-first-traversal-with-a-stack) or an [iterative depth-first search](/graphs/graph#iterative-depth-first-search).

## In Python

Python has no class called `Stack`. A plain `list` is the usual choice: `append` to push, `pop()` to pop, `items[-1]` to peek, and `if items:` to check that something is there.

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

- `list`: push is `O(1)` amortized, pop is `O(1)` amortized, and peek is `O(1)`. Always use the end. `pop()` on an empty list raises `IndexError: pop from empty list`.
- `collections.deque` works too, with the same `append`, `pop` and `[-1]`. It never copies its items to grow, and it is the right choice when you also need the other end.
- `queue.LifoQueue` is a stack with a lock, made for handing items between threads: `put` pushes and `get` pops. On an empty stack `get` does not raise. It waits for another thread to put something, so in a program with one thread it waits forever. The locking also makes it slower, so use it only with threads.

## Costs at a glance

| Operation | List-backed | Linked |
| --- | --- | --- |
| Push | `O(1)` amortized | `O(1)` |
| Pop | `O(1)` amortized | `O(1)` |
| Peek | `O(1)` | `O(1)` |
| Length, is empty | `O(1)` | `O(1)` |
| Space | `O(n)` | `O(n)` |

Both use `O(n)` space, but not the same amount. A list keeps one [reference](/foundations/references#a-list-holds-references) per item, while the linked stack makes a whole node object for each one.

## When to use

Use a stack when the most recent item is the one to deal with next: undoing the last change, going back one page, closing the latest open bracket, or backing up from a dead end in a maze. In Python, use a `list`.

A stack is the wrong tool when you need the oldest item first: that is a [queue](/stacks-queues/queue). For the smallest or most urgent item, use a [heap](/trees/heap). To find a value or reach an item in the middle, use a `list`, a `set` or a `dict`. [Choosing a Structure](/choosing-a-structure) puts these side by side.

The linked stack is rarely the better choice in Python. It uses more memory and runs slower than the list. Its one advantage is that no push ever has to copy the whole stack. It is also the usual way to build a stack in a language without a growable array.

## Application

A stack is the natural tool whenever the most recent unfinished thing has to be handled first.

| Use | What the stack holds |
| --- | --- |
| Matching brackets | The brackets still open. Each closing bracket must match the top one. Worked below. |
| Matching HTML tags | The open tags, such as `<div>`, checked against closing tags in the same way. |
| Undo and redo | Earlier versions of the document, plus a second stack for what was undone. Worked below. |
| Infix to postfix | Operators waiting for their right-hand operand, so `3 + 4 * 2` becomes `3 4 2 * +`, ready for the exercise's `evaluate`. |
| Depth-first search | The vertices still to explore, in place of the [call stack](/recursion/recursion#the-call-stack) of the recursive version. See [iterative depth-first search](/graphs/graph#iterative-depth-first-search). |
| Backtracking | The choices made so far. Stepping back pops the last one. See [Backtracking](/algorithm-design/backtracking). |

### Matching brackets

In `([]{})` each closing bracket must match the latest bracket still open.

| Read | Action | Stack after |
| --- | --- | --- |
| `(` | push | `(` |
| `[` | push | `( [` |
| `]` | matches `[`, pop | `(` |
| `{` | push | `( {` |
| `}` | matches `{`, pop | `(` |
| `)` | matches `(`, pop | empty |

The text is balanced when every closing bracket finds its partner and the stack ends empty.

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

### Undo and redo

An editor keeps two stacks. Before each change it pushes the current text onto the undo stack. Undo pops the newest saved text and pushes the current text onto the redo stack, and redo does the reverse. A new change clears the redo stack, because the undone changes no longer follow from what is on the screen.

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

The last `redo` does nothing: writing `!` cleared the redo stack, so `, world` cannot come back. Real editors save each change rather than a copy of the whole text, but the two stacks work the same way.

## Key points

- A stack is defined by its operations. Push, pop and peek all work at the top: last in, first out.
- The end of a Python `list` makes a good top. Push is `O(1)` amortized, pop is `O(1)` amortized, and peek is `O(1)`.
- The head of a linked list makes a good top too, with every push `O(1)`, at the cost of one node per item.
- Python runs function calls on a stack, which is why recursion has a depth limit. Undo, bracket matching, depth-first search and backtracking use a stack too.
- In Python, use a `list`. Use `queue.LifoQueue` only to share a stack between threads.

## Exercise

In postfix notation the operator comes after its two numbers, so `3 4 +` means `3 + 4`. Write `evaluate`, which works out a postfix expression made of whole numbers and the operators `+`, `-` and `*`, separated by spaces. Read the tokens left to right: push numbers, and on an operator pop two numbers, apply it and push the result.

```python
def evaluate(expression):
    pass

print(evaluate('3 4 +'))
print(evaluate('3 4 + 2 *'))
print(evaluate('10 2 8 * + 3 -'))
```

::: details Solution
The second number popped is the left operand. That order matters for subtraction.

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

**Time** `O(n)` for `n` tokens. **Space** `O(n)` for the stack.
:::
