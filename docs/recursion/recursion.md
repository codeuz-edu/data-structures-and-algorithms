---
title: Recursion
description: "Recursion in Python: base case and recursive case, how the call stack works, recursion trees, why naive Fibonacci is slow, and the recursion limit."
---

# Recursion

A recursive function calls itself to solve smaller instances of the same problem. A tree gives a natural example. Each branch is itself a tree, so the same operation can be applied to it.

## Two parts

Every recursive function needs two parts.

- A **base case**: an input small enough to answer at once, without another call.
- A **recursive case**: reduce the problem, call the function on the smaller problem, and use its answer.

The factorial of `n` is `n × (n - 1) × ... × 1`. Put another way, it is `n` times the factorial of `n - 1`, and that sentence is already the code.

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(4))
print(factorial(1))
```

The trick to writing one is to trust the smaller call. Assume `factorial(n - 1)` returns the right answer, and only decide what to do with it.

## The call stack

<Diagram label="factorial(4)" :width="640" :height="220" alt="Four calls stacked on top of each other: factorial(4) at the bottom, then factorial(3), factorial(2), and factorial(1) on top, which is the base case. The returns then go back down: 1, then 2, then 6, then 24.">
 <text class="dg-label" x="225" y="40">Calls stack up</text>
 <DCells :x="150" :y="170" :w="150" :h="34" vertical small :values="['factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)']" :states="{ 3: 'hit' }" :marks="{ 3: 'base case' }" />
 <text class="dg-label is-accent start" x="470" y="40">Returns unwind</text>
 <DArrow :from="[452, 76]" :to="[452, 196]" kind="accent" />
 <text class="dg-note start" x="470" y="89">returns 1</text>
 <text class="dg-note start" x="470" y="123">returns 2 × 1 = 2</text>
 <text class="dg-note start" x="470" y="157">returns 3 × 2 = 6</text>
 <text class="dg-note start" x="470" y="191">returns 4 × 6 = 24</text>
</Diagram>

Python keeps track of unfinished calls on a [stack](/stacks-queues/stack). Each call gets a frame holding its own `n`. A call that makes another call has to wait, so its frame stays on the stack.

1. `factorial(4)` needs `factorial(3)` and waits. That one needs `factorial(2)`, and so on. The stack grows.
2. `factorial(1)` is the base case. It returns 1 and its frame is removed.
3. Each waiting call now finishes its multiplication and returns, last in, first out.

All the multiplying happens on the way back. This program prints the calls and returns with indentation to show the depth:

```python
def factorial(n, depth=0):
    indent = '    ' * depth
    print(f'{indent}factorial({n})')
    if n <= 1:
        print(f'{indent}returns 1')
        return 1
    result = n * factorial(n - 1, depth + 1)
    print(f'{indent}returns {result}')
    return result

factorial(4)
```

Because every unfinished call holds a frame, a recursion `n` calls deep uses `O(n)` memory.

## When it goes wrong

Two common recursion bugs are a missing base case and a recursive call that fails to make progress toward one. Either bug can leave the function calling itself until Python raises an error.

Python stops that by limiting the depth of the call stack. Use `sys.getrecursionlimit()` to check the current limit. In a standard CPython session it is typically 1,000, and existing calls count toward it.

```python
import sys

def countdown(n):
    return countdown(n - 1)

print(sys.getrecursionlimit())
try:
    countdown(5)
except RecursionError as error:
    print('RecursionError:', error)
```

`countdown` has no base case, so it would run forever. The limit also stops correct code when the input is deep enough: `factorial(5000)` fails in the same way. For inputs like that, use a loop.

## Recursion or a loop

Anything written with recursion can be written with a loop, and the other way around.

```python
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial(4))
print(factorial(5000) > 10 ** 1000)
```

For a simple chain like factorial the loop is the better choice. It uses a single function call frame, so iteration avoids the recursion limit.

Recursion earns its place when the problem branches. A [tree traversal](/trees/binary-tree#depth-first-traversals) has to go left, come back, and then go right. Recursion remembers where to come back to. A loop would need its own stack to do the same.

## A recursion that branches

The Fibonacci numbers start 0, 1, and each later one is the sum of the two before it. Written as code, each call makes two more calls.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(n) for n in range(10)])
```

<Diagram label="Calls made by fib(5)" :width="600" :height="256" alt="The tree of calls for fib(5). fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2), and so on down to fib(1) and fib(0). fib(3) appears twice and fib(2) appears three times.">
 <DTree :x="300" :y="30" :width="560" :gap="46" :r="14" :values="[5, 4, 3, 3, 2, 2, 1, 2, 1, 1, 0, 1, 0, null, null, 1, 0]" :states="{ 2: 'hit', 3: 'hit', 4: 'done', 5: 'done', 7: 'done' }" />
 <text class="dg-note" x="300" y="244">filled: fib(3), worked out twice · outlined: fib(2), worked out three times</text>
</Diagram>

Drawing every call gives a recursion tree. This one shows the problem with the code: the same values are worked out again and again. `fib(5)` makes 15 calls, `fib(30)` makes over a million, and each step up multiplies the count by about 1.6. The cost is exponential.

The fix is to remember each answer the first time it is computed. This is called memoization, and Python has it ready-made.

```python
from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(30))
print(fib(90))
```

With the cache, each value is computed once and the cost drops to `O(n)`. Building solutions from stored answers to smaller problems is the idea behind [dynamic programming](/algorithm-design/dynamic-programming).

## A problem that is recursive by nature

The Tower of Hanoi has three pegs and a stack of disks of different sizes. Move the whole stack to another peg, one disk at a time, never putting a larger disk on a smaller one.

To move `n` disks from A to C:

1. Move the top `n - 1` disks from A to the spare peg B.
2. Move the largest disk from A to C.
3. Move the `n - 1` disks from B to C.

Steps 1 and 3 are the same problem with one disk fewer. The base case is zero disks, where there is nothing to do.

```python
def hanoi(n, source, target, spare):
    if n == 0:
        return
    hanoi(n - 1, source, spare, target)
    print(f'move disk {n} from {source} to {target}')
    hanoi(n - 1, spare, target, source)

hanoi(3, 'A', 'C', 'B')
```

Three disks take 7 moves and `n` disks take `2ⁿ - 1`. A loop version of this is much harder to write.

## Where recursion appears on this site

| Page | What recurses |
| --- | --- |
| [Binary Tree](/trees/binary-tree) | traversals, height, counting nodes |
| [Binary Search Tree](/trees/binary-search-tree) | delete, the sorted walk |
| [Trie](/trees/trie) | collecting the words under a prefix |
| [Graph](/graphs/graph) | depth-first search |
| [Merge Sort](/sorting/merge-sort) and [Quicksort](/sorting/quicksort) | sorting each half |
| [Backtracking](/algorithm-design/backtracking) | trying every choice and undoing it |

## Key points

- A recursive function has a base case and a recursive case that moves toward it.
- Unfinished calls wait on the call stack, so depth costs memory.
- Python stops at about 1000 nested calls with `RecursionError`.
- Use a loop for a simple chain, and recursion when the problem branches.
- A recursion that repeats the same calls can be exponential. Caching the answers fixes it.

## Exercise

Write `total`, which adds up all the numbers in a list that may contain other lists, nested within Python’s recursion limit. Assume the lists contain no cycles. `isinstance(item, list)` tells you whether an item is a list.

```python
def total(items):
    pass

print(total([1, 2, 3]))
print(total([1, [2, 3], [4, [5, 6]]]))
print(total([]))
```

::: details Solution
A number adds itself. A list inside the list is the same problem again, so its sum comes from a recursive call. The empty list is the base case: the loop runs zero times and the function returns 0.

```python
def total(items):
    result = 0
    for item in items:
        if isinstance(item, list):
            result += total(item)
        else:
            result += item
    return result

print(total([1, 2, 3]))
print(total([1, [2, 3], [4, [5, 6]]]))
print(total([]))
```

**Time** `O(n)` for `n` numbers and lists in total. **Space** `O(d)`, where `d` is the deepest nesting.
:::
