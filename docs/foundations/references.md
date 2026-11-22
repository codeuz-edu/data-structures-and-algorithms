---
title: References and Memory
description: "How Python names refer to objects: aliasing, is versus ==, mutating versus rebinding, lists of references, copies, and why this matters for linked structures."
---

# References and Memory

A linked list or a tree connects one object to another through references. To understand what changes when you add or remove a node, follow the references. The same rules explain why two Python names can see changes to the same list.

## A name refers to an object

<Diagram label="Two names, one object" :width="560" :height="130" alt="The names a and b both point to the same list object holding 1, 2 and 3.">
 <text class="dg-label" x="105" y="16">Names</text>
 <DBox :x="80" :y="26" :w="50" :h="30" text="a" small />
 <DBox :x="80" :y="84" :w="50" :h="30" text="b" small />
 <DArrow :from="[132, 41]" :via="[[220, 41], [220, 62]]" :to="[296, 62]" kind="accent" />
 <DArrow :from="[132, 99]" :via="[[220, 99], [220, 78]]" :to="[296, 78]" kind="accent" />
 <text class="dg-label" x="372" y="40">One list object</text>
 <DCells :x="300" :y="50" :values="[1, 2, 3]" />
</Diagram>

A variable is a name attached to an object. Assignment attaches a name. It never copies the object.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(a is b)
```

`b = a` gave the list a second name. Changing the list through `b` changes what `a` sees, because there is only one list. Two names for one object are called aliases.

## Same object or equal value

`==` asks whether two objects hold equal values. `is` asks whether they are the very same object.

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]

print(a == c, a is c)
print(a == b, a is b)
print(a is None)
```

Use `is` for `None`, as in `while cur is not None`. Use `==` for values.

## Changing an object, or moving a name

These two lines look alike and do different things.

- `prev.next = node` changes an object. The node that `prev` refers to now links somewhere else, and everyone holding that node sees it.
- `cur = cur.next` moves a name. `cur` now refers to the following node. No node was changed.

<Diagram label="cur = cur.next" :width="600" :height="134" alt="Three linked nodes holding 12, 7 and 3. The name cur moves from the first node to the second. The nodes themselves do not change.">
 <text class="dg-note" x="182" y="24">cur before</text><DArrow :from="[182, 32]" :to="[182, 66]" kind="muted" />
 <text class="dg-note is-accent" x="306" y="24">cur after</text><DArrow :from="[306, 32]" :to="[306, 66]" kind="accent" />
 <DChain :x="140" :y="70" :values="[12, 7, 3]" />
</Diagram>

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

head = Node(12)
head.next = Node(7)

cur = head
cur = cur.next
print(head.value, cur.value)

cur.value = 99
print(head.next.value)
```

Moving `cur` left `head` alone. Writing `cur.value` changed the second node, which `head.next` also refers to.

Every operation on the [linked list](/linked-lists/singly-linked-list) page is a mix of these two kinds of lines. Walking uses the second kind and re-linking uses the first.

## Function arguments are references

Passing an object to a function gives the function another name for it. Nothing is copied.

```python
def add_item(items):
    items.append(99)

def replace(items):
    items = [0]

numbers = [1, 2, 3]
add_item(numbers)
print(numbers)

replace(numbers)
print(numbers)
```

`add_item` changed the caller's list. `replace` only moved its own local name to a new list, so the caller saw nothing.

## A list holds references

<Diagram label="Inside a list" :width="560" :height="160" alt="A list with three cells. Each cell holds a reference to a separate object: the number 12, the string hi and the number 7.5.">
 <text class="dg-note end" x="186" y="54">the list</text>
 <DCells :x="200" :y="30" :w="64" :values="['•', '•', '•']" />
 <DArrow v-for="i in [0, 1, 2]" :key="i" :from="[232 + 64 * i, 58]" :to="[232 + 64 * i, 108]" />
 <text class="dg-note end" x="186" y="130">the objects</text>
 <DBox :x="204" :y="110" :w="56" :h="32" text="12" />
 <DBox :x="268" :y="110" :w="56" :h="32" text="'hi'" small />
 <DBox :x="332" :y="110" :w="56" :h="32" text="7.5" />
</Diagram>

The cells of a Python list do not contain the items. Each cell holds a reference, and all references are the same size. That is why one list can mix numbers, strings and other lists, and why finding `items[i]` is still [one step](/arrays/array).

The diagrams on this site draw values inside the cells because it is easier to read. For numbers and strings the difference never shows, since they cannot be changed in place.

## The shared-row trap

<Diagram label="[[0] * 3] * 2" :width="560" :height="126" alt="An outer list with two cells. Both cells point to the same inner list holding three zeros.">
 <text class="dg-note end" x="108" y="74">grid</text>
 <DCells :x="120" :y="50" :w="56" :values="['•', '•']" />
 <DArrow :from="[148, 62]" :via="[[148, 24], [432, 24]]" :to="[432, 46]" kind="accent" />
 <DArrow :from="[212, 70]" :to="[356, 70]" kind="accent" />
 <DCells :x="360" :y="50" :values="[0, 0, 0]" />
 <text class="dg-note" x="432" y="110">one row, used twice</text>
</Diagram>

Multiplying a list repeats its references. With an inner list, every row is the same object.

```python
grid = [[0] * 3] * 2
grid[0][0] = 7
print(grid)

grid = [[0] * 3 for _ in range(2)]
grid[0][0] = 7
print(grid)
```

The comprehension runs `[0] * 3` once per row and so builds separate rows. Use it whenever you build a 2D list.

## Copies

To get an independent object, copy it explicitly.

```python
import copy

rows = [[1, 2], [3, 4]]
shallow = rows.copy()
deep = copy.deepcopy(rows)

rows[0][0] = 99
rows.append([5, 6])
print(shallow)
print(deep)
```

A shallow copy (`list.copy()`, `items[:]`, `list(items)`) makes a new outer list holding the same inner objects. A deep copy recursively copies contained objects where the type supports it. Some objects, such as functions, are shared. Repeated references in the original can still share one copied object.

## Objects nobody refers to

An unreachable object can be reclaimed. CPython usually reclaims it when its last reference disappears. A cyclic garbage collector can reclaim unreachable objects that still refer to each other. That is how [deleting a node](/linked-lists/singly-linked-list#delete-a-node) works: the list stops pointing at the node, and the node goes away by itself. There is no `free` or `delete` to call.

## Key points

- Assignment attaches a name to an object. It does not copy.
- Two names for one object are aliases. A change through one shows through the other.
- `obj.field = x` changes an object. `name = x` only moves a name.
- A list stores references to its items.
- Build 2D lists with a comprehension, and copy with `copy()` or `deepcopy` when you need an independent object.

## Exercise

`make_grid` should return a grid of zeros with `rows` rows and `cols` columns, where every row is its own list. The version below has the shared-row bug. Fix it.

```python
def make_grid(rows, cols):
    return [[0] * cols] * rows

grid = make_grid(2, 3)
grid[0][1] = 5
print(grid)
print(grid[0] is grid[1])
```

::: details Solution
Build each row inside a comprehension so that `[0] * cols` runs once per row.

```python
def make_grid(rows, cols):
    return [[0] * cols for _ in range(rows)]

grid = make_grid(2, 3)
grid[0][1] = 5
print(grid)
print(grid[0] is grid[1])
```

`[0] * cols` is safe on its own, because the items are numbers and numbers cannot be changed in place.
:::
