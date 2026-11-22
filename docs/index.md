---
title: Data Structures and Algorithms
description: "Data structures and algorithms explained with diagrams and Python code you can run in the browser."
---

# Data Structures and Algorithms

This course shows how data structures store information and how algorithms work on it. Each lesson follows an example through a diagram and a Python implementation. Run the code in the browser to see what changes when you try a different input.

<LinkedListInsertHead />

## How a page is laid out

A page about a data structure has these parts.

- **Interface.** A table of the operations and what each one costs.
- **Anatomy.** A diagram of the structure at rest, with its parts named.
- **One section per operation.** A diagram, numbered steps and the Python code. Changed links are blue, removed links are dashed, and numbered circles give the order of the steps.
- **Full implementation.** The complete class, ready to run.
- **In Python.** What the standard library already offers for the same job.
- **Costs, when to use it, and an application.**
- **Key points and an exercise** with a **Check** button.

A page about an algorithm states the problem, shows the idea, traces it step by step on one small input, and then follows the same closing parts.

## Before you start

You need basic Python: variables, loops, functions, lists and dictionaries, and how to write a small class. Three more ideas are used throughout, and each has its own page.

- [Measuring Cost](/foundations/measuring-cost) explains the `O(1)` and `O(n)` labels that every page puts on its operations.
- [References and Memory](/foundations/references) explains how one object points at another, which is what a link in a linked list or a tree is.
- [Recursion](/recursion/recursion) is needed from the tree pages onward.

Two pieces of Python appear in many of the classes and are worth knowing.

- `__iter__` with `yield` lets a class be used in a `for` loop or passed to `list(...)`. `yield` hands back one value and then carries on from the same line when the next value is asked for.
- `__len__` is what `len(...)` calls.

## Pages

Read them in this order. Later pages lean on earlier ones, and each page links to what it needs.

| Topic | Pages |
| --- | --- |
| Start here | [Measuring Cost](/foundations/measuring-cost), [References and Memory](/foundations/references) |
| Arrays | [Array](/arrays/array), [Dynamic Array](/arrays/dynamic-array), [Sorted Array and Binary Search](/arrays/binary-search) |
| Linked lists | [Singly Linked List](/linked-lists/singly-linked-list), [Doubly Linked List](/linked-lists/doubly-linked-list) |
| Stacks and queues | [Stack](/stacks-queues/stack), [Queue](/stacks-queues/queue) |
| Hash tables | [Hash Table](/hash-tables/hash-table) |
| Recursion and sorting | [Recursion](/recursion/recursion), [Simple Sorts](/sorting/simple-sorts), [Merge Sort](/sorting/merge-sort), [Quicksort](/sorting/quicksort) |
| Trees | [Binary Tree](/trees/binary-tree), [Binary Search Tree](/trees/binary-search-tree), [AVL Tree](/trees/avl-tree), [Heap](/trees/heap), [Trie](/trees/trie) |
| Graphs | [Graph](/graphs/graph), [Topological Sort](/graphs/topological-sort), [Shortest Paths](/graphs/shortest-paths), [Union-Find](/graphs/union-find), [Minimum Spanning Tree](/graphs/minimum-spanning-tree) |
| Algorithm design | [Greedy Algorithms](/algorithm-design/greedy), [Backtracking](/algorithm-design/backtracking), [Dynamic Programming](/algorithm-design/dynamic-programming), [Dynamic Programming on Grids and Pairs](/algorithm-design/dynamic-programming-2d) |
| Wrap-up | [Choosing a Structure](/choosing-a-structure) |

To try something without opening a lesson, use the [playground](/playground).
