---
title: Havolalar va xotira
description: "Bitta röyxatga ikki xil nom beriş mumkin. Bir nom orqali elementni özgartirsak, ikkinçi nom orqali ham özgarişni köramiz. Havolalar shu holatni ham, röyxat yoki daraxt tugunlari qanday ulanişini ham tuşuntiradi."
---

# Havolalar va xotira

Bitta röyxatga ikki xil nom beriş mumkin. Bir nom orqali elementni özgartirsak, ikkinçi nom orqali ham özgarişni köramiz. Havolalar shu holatni ham, röyxat yoki daraxt tugunlari qanday ulanişini ham tuşuntiradi.

## Nom va obyekt {#a-name-refers-to-an-object}

`a` nomi röyxatga havola qilsin. `b = a` dan keyin ikkala nom ham şu röyxatga boğlanadi. `b` orqali röyxatdagi qiymatni özgartirib, natijani `a` orqali tekşirib köring.

<Diagram label="Ikki nom bitta obyektga boğlangan" :width="560" :height="130" alt="a va b nomlari 1, 2 va 3 qiymatlari saqlangan bitta röyxatga havola qiladi.">
 <text class="dg-label" x="105" y="16">Nomlar</text>
 <DBox :x="80" :y="26" :w="50" :h="30" text="a" small />
 <DBox :x="80" :y="84" :w="50" :h="30" text="b" small />
 <DArrow :from="[132, 41]" :via="[[220, 41], [220, 62]]" :to="[296, 62]" kind="accent" />
 <DArrow :from="[132, 99]" :via="[[220, 99], [220, 78]]" :to="[296, 78]" kind="accent" />
 <text class="dg-label" x="372" y="40">One list object</text>
 <DCells :x="300" :y="50" :values="[1, 2, 3]" />
</Diagram>

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(a is b)
```

## Aynan bir obyekt va teng qiymat {#same-object-or-equal-value}

`a == b` qiymatlarni soliştiradi. `a is b` ikkala nom aynan bitta obyektga boğlanganini tekşiradi. `None` bilan soliştirişda `is` yoki `is not` işlatiladi.

```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]

print(a == c, a is c)
print(a == b, a is b)
print(a is None)
```

## Obyekt va nomning özgarişi {#changing-an-object-or-moving-a-name}

`prev.next = node` tugunning `next` maydonini özgartiradi. Tugunga havolasi bor hamma kod bu özgarişni köradi. `cur = cur.next` esa faqat `cur` nomini keyingi tugunga boğlaydi.

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

## Funksiya argumentlari {#function-arguments-are-references}

Funksiya parametrining nomi çaqiruvçi bergan obyektga boğlanadi. `add_item` röyxatning özini özgartiradi. `replace` mahalliy nomni yangi röyxatga boğlaydi, çaqiruvçining nomi avvalgi röyxatda qoladi.

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

## Röyxat havolalarni saqlaydi {#a-list-holds-references}

Python röyxatining kataklarida obyektlarga havolalar turadi. Şuning uçun bitta röyxatda son, satr va boşqa röyxat saqlanişi mumkin. Kataklar teng hajmli bölgani uçun indeks böyiça öqiş doimiy vaqt oladi.

<Diagram label="Inside a list" :width="560" :height="160" alt="A list with three cells. Each cell holds a reference to a separate object: the number 12, the string hi and the number 7.5.">
 <text class="dg-note end" x="186" y="54">the list</text>
 <DCells :x="200" :y="30" :w="64" :values="['•', '•', '•']" />
 <DArrow v-for="i in [0, 1, 2]" :key="i" :from="[232 + 64 * i, 58]" :to="[232 + 64 * i, 108]" />
 <text class="dg-note end" x="186" y="130">the objects</text>
 <DBox :x="204" :y="110" :w="56" :h="32" text="12" />
 <DBox :x="268" :y="110" :w="56" :h="32" text="'hi'" small />
 <DBox :x="332" :y="110" :w="56" :h="32" text="7.5" />
</Diagram>

## Qatorlar bir obyektga boğlansa {#the-shared-row-trap}

`[[0] * 3] * 2` içki röyxatni bir marta yaratadi va unga ikkita havola saqlaydi. Bir qatorga yoziş ikkinçisida ham körinadi. `[[0] * 3 for _ in range(2)]` har qator uçun alohida röyxat yaratadi.

<Diagram label="[[0] * 3] * 2" :width="560" :height="126" alt="An outer list with two cells. Both cells point to the same inner list holding three zeros.">
 <text class="dg-note end" x="108" y="74">grid</text>
 <DCells :x="120" :y="50" :w="56" :values="['•', '•']" />
 <DArrow :from="[148, 62]" :via="[[148, 24], [432, 24]]" :to="[432, 46]" kind="accent" />
 <DArrow :from="[212, 70]" :to="[356, 70]" kind="accent" />
 <DCells :x="360" :y="50" :values="[0, 0, 0]" />
 <text class="dg-note" x="432" y="110">one row, used twice</text>
</Diagram>

```python
grid = [[0] * 3] * 2
grid[0][0] = 7
print(grid)

grid = [[0] * 3 for _ in range(2)]
grid[0][0] = 7
print(grid)
```

## Nusxalar {#copies}

`list.copy()`, `items[:]` va `list(items)` yuza nusxa oladi. Yangi taşqi röyxat yaratiladi, içki obyektlarga havolalar esa köçiriladi. `copy.deepcopy` odatdagi içma-iç röyxatlarda içki röyxatlarni ham nusxalaydi.

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

## Havolasiz qolgan obyektlar {#objects-nobody-refers-to}

Dasturdan endi erişib bölmaydigan obyektlar xotirasi qayta işlatilişi mumkin. CPython köpinça oxirgi havola yoqolganida obyektni boşatadi. Bir-biriga havola qilgan obyektlar halqasini xotira yiğuvçisi keyinroq topişi mumkin.

## Xulosa {#key-points}

Nomni qayta boğlaş va obyektni özgartiriş alohida amallar. Röyxat nusxasini olayotganda, içki obyektlar ham alohida bölişi kerakmi, şuni aniqlang.

## Maşq {#exercise}

`make_grid(rows, cols)` nollardan iborat jadval qaytarsin. Jadvalda `rows` qator va `cols` ustun bölsin. Har qator mustaqil röyxat bölişi uçun berilgan kodni tuzating.

```python
def make_grid(rows, cols):
    return [[0] * cols] * rows

grid = make_grid(2, 3)
grid[0][1] = 5
print(grid)
print(grid[0] is grid[1])
```

::: details Yeçim
`[0] * cols` ni har qator uçun alohida bajaring. Nollar özgarmas butun sonlar, şuning uçun bitta qator içida ularni takrorlaş xavfsiz.

```python
def make_grid(rows, cols):
    return [[0] * cols for _ in range(rows)]

grid = make_grid(2, 3)
grid[0][1] = 5
print(grid)
print(grid[0] is grid[1])
```

:::
