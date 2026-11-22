---
title: Trie
description: "A trie (prefix tree) in Python: insert, search, autocomplete and delete with pruning, with diagrams, costs, and when a set or bisect is the better tool."
---

# Trie

A trie, or prefix tree, stores strings by sharing the parts at their beginnings. Each edge represents a character. Words that start with the same characters follow the same path from the root until their spellings differ.

**You need:** [Binary Tree](/trees/binary-tree), [Recursion](/recursion/recursion) and [Hash Table](/hash-tables/hash-table).

## Interface

| Operation | What it does | Cost |
| --- | --- | --- |
| `insert(word)` | Add a word; adding it a second time changes nothing | `O(m)` |
| `word in trie` | Say whether the word is stored | `O(m)` |
| `starts_with(prefix)` | Say whether any stored word starts with the prefix | `O(m)` |
| `complete(prefix)` | List the stored words that start with the prefix, in sorted order | `O(m + k)` |
| `delete(word)` | Remove a word, or raise `KeyError` | `O(m)` |
| `len(trie)` | Count the words | `O(1)` |

`m` is the length of the word or prefix, and `k` is the total number of letters in the words that `complete` returns. These bounds assume a fixed alphabet and expected constant-time dictionary operations. Completion also depends on the size of the answer.

## Shape

<TrieDiagram />

This trie holds `car`, `cat`, `do` and `dog`. The diagrams write each letter inside the node that its edge leads to. Two things are worth noticing.

- `car` and `cat` share the nodes for `c` and `a`. The prefix is stored once.
- `do` ends at a node in the middle of the path to `dog`. A flag on each node records whether a word ends there. Without the flag, the trie could not tell `do` from a prefix of `dog`.

A node is a dictionary from letters to child nodes, plus that flag. Unlike a [binary tree](/trees/binary-tree), a node can have any number of children, one for each letter that can come next.

```py
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.size = 0
```

The root stands for the empty prefix and holds no letter. `size` counts the words.

## Insert

<TrieDiagram mode="insert" />

1. Start at the root.
2. For each letter, follow the child for that letter. Create it when it is missing.
3. Mark the node where the word finishes. If it was not marked already, add one to `size`.

```py
def insert(self, word):
    node = self.root
    for letter in word:
        if letter not in node.children:
            node.children[letter] = TrieNode()
        node = node.children[letter]
    if not node.is_end:
        node.is_end = True
        self.size += 1
```

There is one step per letter, so insert costs `O(m)` however many words the trie already holds.

## Search

<TrieDiagram mode="search" />

1. Start at the root.
2. For each letter, move to the child for that letter. If there is none, stop: nothing stored starts that way.
3. For a prefix, reaching the last letter is enough. For a whole word, the last node must also have the end flag.

In the diagram the walk for `ca` reaches the node for `a`, so `starts_with('ca')` is true. That node has no end flag, so `'ca' in trie` is false.

```py
def _find(self, text):
    node = self.root
    for letter in text:
        if letter not in node.children:
            return None
        node = node.children[letter]
    return node

def __contains__(self, word):
    node = self._find(word)
    return node is not None and node.is_end

def starts_with(self, prefix):
    return self.size > 0 and self._find(prefix) is not None
```

Naming the method `__contains__` is what makes `'cat' in trie` work. Both checks walk at most `m` nodes, so both cost `O(m)`.

## Autocomplete

<TrieDiagram mode="complete" />

1. Walk to the node for the prefix, as in a search. If it is missing, return an empty list.
2. Visit every node below it, taking the children in letter order and keeping the letters of the path so far.
3. At each node with an end flag, join the path into a word and add it to the answer.

```py
def complete(self, prefix):
    words = []
    start = self._find(prefix)
    if start is not None:
        self._collect(start, list(prefix), words)
    return words

def _collect(self, node, path, words):
    if node.is_end:
        words.append(''.join(path))
    for letter in sorted(node.children):
        path.append(letter)
        self._collect(node.children[letter], path, words)
        path.pop()
```

`_collect` is [recursive](/recursion/recursion): it handles one node, then calls itself for each child, like a [preorder walk](/trees/binary-tree#depth-first-traversals) of a binary tree. Because the children are visited in letter order, the words come out sorted, as they do from the inorder walk of a [binary search tree](/trees/binary-search-tree). The recursive walk is limited by Python’s recursion depth. Use an explicit stack when inputs can contain very long strings.

`path` is one list of letters that grows on the way down and shrinks on the way back, and it is joined into a string only where a word ends. Walking to the prefix costs `O(m)`, and the rest costs `O(k)`, the length of the answer. Every remaining node below the prefix leads to a word in the answer. For a fixed alphabet, sorting the children of a node takes bounded time. With an alphabet that grows with the input, also count the sorting at each node.

A real search box also ranks the suggestions and shows only the best few. [Counts at nodes](#counts-at-nodes) shows how.

## Delete

<TrieDiagram mode="delete" />

Deleting a word has two parts: clear its end flag, then remove the nodes that no longer lead to any word.

1. Walk down the letters, remembering each node and the letter taken from it. If a letter is missing, or the last node has no end flag, the word is not stored: raise `KeyError`.
2. Clear the end flag on the last node and subtract one from `size`.
3. Walk back up the remembered path. While the child just below has no end flag and no children, remove it from its parent. Stop at the first node that still leads to a word.

```py
def delete(self, word):
    path = []
    node = self.root
    for letter in word:
        if letter not in node.children:
            raise KeyError(word)
        path.append((node, letter))
        node = node.children[letter]
    if not node.is_end:
        raise KeyError(word)
    node.is_end = False
    self.size -= 1
    for parent, letter in reversed(path):
        child = parent.children[letter]
        if child.is_end or child.children:
            break
        del parent.children[letter]
```

In the diagram, deleting `cat` clears the flag on `t`. `t` has no children, so it is removed, and the walk stops at `a`, which still leads to `car`. Deleting `do` instead would only clear the flag on `o`, because `o` still leads to `dog`.

The pruning matters for correct answers, not only for memory. Without it, the node for `t` would stay behind and `starts_with('cat')` would still say yes. The walk down and the walk back are at most `m` steps each, so delete costs `O(m)`.

## Counts at nodes

A number kept on each node answers counting questions without visiting a whole subtree.

Give every node a `count` of the stored words that pass through it or end at it. `insert` adds one to each count on its path, but only for a word that is not stored yet, or inserting a word twice would count it twice. `delete` subtracts one along the path. The number of words that start with a prefix is then the count on the prefix's node: one walk, `O(m)`.

```py
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.count = 0

def insert(self, word):
    if word in self:
        return
    node = self.root
    node.count += 1
    for letter in word:
        node = node.children.setdefault(letter, TrieNode())
        node.count += 1
    node.is_end = True
    self.size += 1

def count_prefix(self, prefix):
    node = self._find(prefix)
    return 0 if node is None else node.count
```

The counts also simplify pruning: a node whose count drops to 0 leads to no word, so delete can cut it off with everything below it.

A count stored only at a word's end node, of how often that word has been picked, ranks suggestions. Autocomplete gathers `(count, word)` pairs under the prefix and keeps the best few with `heapq.nlargest`, as the [heap](/trees/heap#application) page does. The [Application](#application) below works this out. Either count costs one more number per node and leaves every walk at `O(m)`.

## Storing the children

The nodes on this page keep their children in a `dict`. The classic alternative, when words use only the 26 lowercase letters, is a list of 26 slots per node. The child for `letter` sits at index `ord(letter) - ord('a')`, and an empty slot holds `None`.

```py
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

child = node.children[ord(letter) - ord('a')]
```

- Speed: a slot is found by its position, with no hashing, and slots 0 to 25 give the children in letter order without sorting. In C or Java this makes it the fastest choice.
- Memory: every node pays for 26 slots, even a node with one child or none. The four words in the Shape diagram make 8 nodes joined by 7 links, and lists would reserve 208 slots to hold those 7 links. A `dict` stores only the children that exist.
- Alphabet: the list fits only the letters it was sized for. A `dict` takes any character, including capitals, digits and accented letters.

In Python the `dict` is the better default. In a quick test on CPython with 50,000 random words, both searched equally fast, and the lists took more memory.

## Compressed tries

<TrieDiagram mode="compressed" />

Many trie nodes have one child and end no word. Here `c` leads only to `a`, and `d` leads only to `o`. A compressed trie, also called a radix tree, merges each such chain into one node that holds the whole string. The same four words need 8 nodes in the trie and 6 in the compressed trie.

After the merge, every node except the root ends a word or has at least two children, so `n` words need at most `2n` nodes however long they are. The letters are all still stored, but in far fewer node objects. The price is more work per node. A search compares a whole string at each node instead of one letter, and an insert sometimes splits a node: adding `cub` would split `ca` into `c`, with the two children `a` and `ub`. Compressed tries suit keys that share long stretches, such as file paths or network addresses.

## Full implementation

```python
class TrieNode:
    def __init__(self):  # O(1)
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):  # O(1)
        self.root = TrieNode()
        self.size = 0

    def insert(self, word):  # O(m)
        node = self.root
        for letter in word:
            if letter not in node.children:
                node.children[letter] = TrieNode()
            node = node.children[letter]
        if not node.is_end:
            node.is_end = True
            self.size += 1

    def _find(self, text):  # O(m)
        node = self.root
        for letter in text:
            if letter not in node.children:
                return None
            node = node.children[letter]
        return node

    def __contains__(self, word):  # O(m)
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):  # O(m)
        return self.size > 0 and self._find(prefix) is not None

    def complete(self, prefix):  # O(m + k)
        words = []
        start = self._find(prefix)
        if start is not None:
            self._collect(start, list(prefix), words)
        return words

    def _collect(self, node, path, words):  # O(k)
        if node.is_end:
            words.append(''.join(path))
        for letter in sorted(node.children):
            path.append(letter)
            self._collect(node.children[letter], path, words)
            path.pop()

    def delete(self, word):  # O(m)
        path = []
        node = self.root
        for letter in word:
            if letter not in node.children:
                raise KeyError(word)
            path.append((node, letter))
            node = node.children[letter]
        if not node.is_end:
            raise KeyError(word)
        node.is_end = False
        self.size -= 1
        for parent, letter in reversed(path):
            child = parent.children[letter]
            if child.is_end or child.children:
                break
            del parent.children[letter]

    def __len__(self):  # O(1)
        return self.size

trie = Trie()
print(trie.starts_with(''))  # False: no words are stored
for word in ['car', 'cat', 'do', 'dog']:
    trie.insert(word)
print('do' in trie, 'ca' in trie, trie.starts_with('ca'), len(trie))

trie.insert('cab')
trie.insert('cab')
print(trie.complete('ca'), len(trie))
print(trie.complete('d'), trie.complete('x'))

trie.delete('cat')
trie.delete('do')
print(trie.complete(''), len(trie))
print(trie.starts_with('cat'), trie.starts_with('do'))

try:
    trie.delete('ca')
except KeyError as error:
    print('KeyError:', error)
```

The empty prefix matches every stored word. The empty trie has no matching word. Inserting `cab` twice stores it once. After the deletes, `starts_with('cat')` is false because `t` was pruned, while `starts_with('do')` is still true because `dog` is stored.

## In Python

Python has no trie in its standard library. Two built-in tools cover most of the same jobs.

- A `set` answers "is this word stored?" in `O(m)` on average, since hashing the word reads every letter.
- A sorted list answers prefix questions with [binary search](/arrays/binary-search). The words that start with a prefix sit next to each other in sorted order, and `bisect_left(words, prefix)` finds where they begin.

```python
import bisect

words = sorted(['dog', 'cat', 'car', 'do', 'cab', 'cart'])
print(words)

def complete(words, prefix):
    i = bisect.bisect_left(words, prefix)
    found = []
    while i < len(words) and words[i].startswith(prefix):
        found.append(words[i])
        i += 1
    return found

print(complete(words, 'ca'))
print(complete(words, 'do'))
print(complete(words, 'x'))

vocabulary = set(words)
print('cat' in vocabulary, 'ca' in vocabulary)
```

`bisect_left` takes [`log n`](/foundations/measuring-cost#what-log-n-means) steps, and each step compares two strings, so it costs `O(m log n)`. The scan checks each match and stops at the first nonmatching word. Prefix testing can read up to `m` characters per word. The catch is change: keeping the list sorted makes each new word cost `O(n)`, because `bisect.insort` has to shift every word after it.

## Costs at a glance

| Operation | Cost |
| --- | --- |
| Insert a word | `O(m)` |
| Search for a word or a prefix | `O(m)` |
| Complete a prefix | `O(m + k)` |
| Delete a word | `O(m)` |
| Count the words with a prefix, with [counts at nodes](#counts-at-nodes) | `O(m)` |
| Length | `O(1)` |
| Space | `O(n · m)` |

The trie has one node per distinct prefix, each with its own dictionary. For `n` words of length at most `m`, there are at most `1 + n · m` nodes including the root. Shared prefixes reduce the count. A [compressed trie](#compressed-tries) needs at most `2n` nodes.

Compared with a `set` and a sorted list holding the same `n` words:

| Operation | Trie | `set` | Sorted list with `bisect` |
| --- | --- | --- | --- |
| Is the word stored? | `O(m)` | `O(m)` average | `O(m log n)` |
| Does a word start with the prefix? | `O(m)` | `O(n · m)` | `O(m log n)` |
| List the words with the prefix | `O(m + k)` | `O(n · m)` | `O(m log n + k)` |
| Add a word | `O(m)` | `O(m)` average | `O(n + m log n)` |

## When to use

Use a trie when most questions are about prefixes and the words keep changing: autocomplete, suggestions as someone types, word games, spell checkers that suggest corrections. Each step down is one letter, so a search box can keep the node for what has been typed and move down one level per key press.

Use something else when:

- You only ask whether a whole word is stored. A `set` does that at the same `O(m)` cost, is built in, and takes far less memory.
- The words rarely change. A sorted list with `bisect` answers prefix questions nearly as fast, takes far less memory, and costs one sort to build.
- Memory is tight. Every node is a Python object with its own dictionary, so a trie can take many times the memory of the words it stores. A [compressed trie](#compressed-tries) needs far fewer nodes.

[Choosing a Structure](/choosing-a-structure) compares the trie with the other structures.

## Application

A search box shows the two most picked words after every key press. Starting again from the root each time would repeat the whole walk. Instead, keep the node for what has been typed so far and move down one child per key press, which is a single dictionary lookup. Each word's end node holds how often the word has been picked, as in [Counts at nodes](#counts-at-nodes).

```python
import heapq

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.picks = 0

def build(picks):
    root = TrieNode()
    for word, count in picks.items():
        node = root
        for letter in word:
            node = node.children.setdefault(letter, TrieNode())
        node.is_end = True
        node.picks = count
    return root

def collect(node, path, found):
    if node.is_end:
        found.append((node.picks, ''.join(path)))
    for letter, child in node.children.items():
        path.append(letter)
        collect(child, path, found)
        path.pop()

root = build({'car': 40, 'card': 25, 'care': 60, 'cat': 90, 'cow': 80, 'dog': 70})
node = root
typed = ''
for letter in 'cart':
    typed += letter
    if node is not None:
        node = node.children.get(letter)
    found = []
    if node is not None:
        collect(node, list(typed), found)
    print(typed, [word for picks, word in heapq.nlargest(2, found)])
```

`setdefault` returns the child for a letter, creating it first if it is missing. Typing `ca` drops `cow`, typing `car` drops `cat`, and once a letter has no child, as `t` after `car` here, `node` stays `None` and every later key press gets no suggestions. `nlargest` returns the pairs with the highest `picks` first, so the order the words are collected in does not matter.

## Key points

- A trie stores words letter by letter, so words with a common prefix share nodes.
- An end flag marks where a word finishes. Without it, `do` could not be told apart from a prefix of `dog`.
- Insert, search and delete cost `O(m)` for a word of length `m`, however many words are stored. A count on each node makes counting the words under a prefix `O(m)` too.
- Delete clears the flag, then prunes back up to the first node that still leads to a word.
- For exact lookups a `set` is simpler. For prefix queries on words that rarely change, a sorted list with `bisect` uses far less memory.

## Exercise

Write `longest_common_prefix`, which returns the longest prefix that every stored word starts with. It is `''` when the words share nothing or the trie is empty.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.size = 0

    def insert(self, word):
        node = self.root
        for letter in word:
            if letter not in node.children:
                node.children[letter] = TrieNode()
            node = node.children[letter]
        if not node.is_end:
            node.is_end = True
            self.size += 1

    def longest_common_prefix(self):
        pass

for words in [['car', 'cat', 'cab'], ['do', 'dog'], ['car', 'dog'], ['tree'], []]:
    trie = Trie()
    for word in words:
        trie.insert(word)
    print(words, repr(trie.longest_common_prefix()))
```

::: details Solution
Walk down from the root while the path is the only way on. Stop at a node with more than one child, where the words part ways, and at a node with the end flag, where one word stops. The letters walked so far are the answer.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        self.size = 0

    def insert(self, word):
        node = self.root
        for letter in word:
            if letter not in node.children:
                node.children[letter] = TrieNode()
            node = node.children[letter]
        if not node.is_end:
            node.is_end = True
            self.size += 1

    def longest_common_prefix(self):
        letters = []
        node = self.root
        while len(node.children) == 1 and not node.is_end:
            letter = list(node.children)[0]
            letters.append(letter)
            node = node.children[letter]
        return ''.join(letters)

for words in [['car', 'cat', 'cab'], ['do', 'dog'], ['car', 'dog'], ['tree'], []]:
    trie = Trie()
    for word in words:
        trie.insert(word)
    print(words, repr(trie.longest_common_prefix()))
```

**Time** `O(m + 1)`, where `m` is the length of the answer. **Space** `O(m + 1)` for its letters and the fixed bookkeeping. The walk is the chain of single children that a [compressed trie](#compressed-tries) would merge into the first node below the root.
:::
