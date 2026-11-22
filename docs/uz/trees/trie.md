---
title: Prefiks daraxti
description: "Prefiks daraxtida har qirra bitta belgiga mos keladi. Bir xil harflar bilan boşlanadigan sözlar ildizdan bir xil yölda yuradi."
---

# Prefiks daraxti

Prefiks daraxtida har qirra bitta belgiga mos keladi. Bir xil harflar bilan boşlanadigan sözlar ildizdan bir xil yölda yuradi.

Avval [Ikkilik daraxt](/uz/trees/binary-tree), [Rekursiya](/uz/recursion/recursion) va [Xeş jadvali](/uz/hash-tables/hash-table) darslarini öqing.

## Amallar {#interface}

`insert` söz qöşadi, `in` töliq sözni tekşiradi, `starts_with` prefiksni tekşiradi. `complete` mos sözlarni tartib bilan qaytaradi. `delete` mavjud sözni olib taşlaydi, yöq söz uçun `KeyError` beradi.

## Körinişi {#shape}

`car` va `cat` ning `ca` prefiksi bitta yölda saqlanadi. `do` özi ham söz, `dog` ning prefiksi ham. `is_end` söz aynan şu tugunda tugaşini bildiradi.

<TrieDiagram />

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

## Qöşiş {#insert}

Ildizdan har bir harfga mos bolani tanlang. Yetişmagan bola yaratiladi. Oxirgi tugunga söz tugadi belgisini qöying. Belgi bor bölsa, sözlar soni ortmaydi.

<TrieDiagram mode="insert" />

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

## Qidiriş {#search}

Har bir belgida mos bolaga öting. Bola yöq bölsa, qidiriş tugaydi. Töliq söz uçun oxirgi tugunda `is_end` ham tekşiriladi. Prefiks uçun şu tugunga yetiş kifoya, agar daraxtda kamida bitta söz bölsa. Böş prefiks ham istalgan saqlangan sözga mos.

<TrieDiagram mode="search" />

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

## Sözni töldiriş {#autocomplete}

Prefiks tugunini toping. Undan pastdagi bolalarni harf tartibida öqing. Har `is_end` tugunida yöldagi harflarni satrga birlaştiring. Bolalarni tartiblaş xarajati alifbo hajmiga boğliq.

<TrieDiagram mode="complete" />

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

## Öçiriş {#delete}

Sözning oxirgi tugunida `is_end` ni olib taşlang. Orqaga qaytib, boşqa sözga olib bormaydigan va özi sözni tugatmaydigan tugunlarni kesing.

<TrieDiagram mode="delete" />

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

## Tugunlardagi hisoblagiç {#counts-at-nodes}

`count` tugundan ötadigan yoki unda tugaydigan sözlarni sanaydi. Yangi söz qöşilsa yoki öçirilsa, yöldagi hisoblagiçlarni yangilang. Bu prefiksga mos sözlar sonini tarmoqni aylanmasdan qaytaradi.

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

## Bolalarni saqlaş {#storing-the-children}

`dict` faqat bor bolalarni saqlaydi. Alifbo kiçik va maʼlum bölsa, har belgiga bitta katak ajratilgan massiv ham işlaydi. Bu holda böş kataklar ham joy oladi.

```py
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

child = node.children[ord(letter) - ord('a')]
```

## Siqilgan prefiks daraxti {#compressed-tries}

Bitta bolali va söz tugamaydigan tugunlardan tuzilgan zanjir bitta satrli qirraga birlaştiriladi. Masalan, `c` va `a` ketma-ketligi `ca` bölib saqlanadi.

<TrieDiagram mode="compressed" />

## Töliq dastur {#full-implementation}

Daraxt böş bölganida hatto böş prefiksga mos söz yöq. `cab` ikki marta yozilsa ham bitta söz hisoblanadi. `cat` öçirilgaç uning oxirgi qirrasi uziladi. `do` öçirilganda `dog` borligi uçun `do` prefiksi saqlanadi.

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

## Python tilida {#in-python}

Standart kutubxonada tayyor prefiks daraxti yöq. Töliq sözga tegişlilik uçun `set` qulay. Tartiblangan röyxatda `bisect_left` prefiksdan boşlanişi mumkin bölgan birinçi örinni topadi.

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

## Amallar xarajati {#costs-at-a-glance}

`m` belgili sözni qöşiş, qidiriş va öçiriş odatdagi luğat farazlari bilan `O(m)`. Prefiksni töldirişda yöl, mos sözlarning uzunligi va bolalarni saralaş hisobga olinadi. `n` ta `m` belgili söz köpi bilan `O(nm + 1)` tugun oladi.

## Qayerda işlatiladi {#when-to-use}

Yozilayotgan harflarga qarab taklif beriş, prefiksdagi sözlarni sanaş va söz öyinlarida bu tuzilma qulay. Faqat töliq söz qidirilsa, `set` yetarli.

## Amaliy misol {#application}

Qidiruv maydonida joriy prefiks tugunini eslab qoling. Har yangi harfda bitta qadam pastga öting. Takliflar orasidan eng köp tanlangan ikkitasini uyum yordamida ajrating.

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

## Xulosa {#key-points}

Umumiy prefiks tugunlari bir marta saqlanadi. `is_end` töliq sözni oddiy yöldan ajratadi. Öçirişda boşqa sözga kerak bölgan tugunlarga tegilmaydi.

## Maşq {#exercise}

`longest_common_prefix` barça saqlangan sözlarning eng uzun umumiy prefiksini qaytarsin. Böş daraxtda yoki umumiy harf yöq bölsa, `''` qaytaring.

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

::: details Yeçim
Ildizdan tugunning faqat bitta bolasi bor va tugunda söz tugamagan paytda yuring. Ikki şox yoki söz oxiri uçrasa, şu yerda töxtang. Javob uzunligi `m` bölsa, vaqt va natija xotirasi `O(m + 1)`.

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

:::
