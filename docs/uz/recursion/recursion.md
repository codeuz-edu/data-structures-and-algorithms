---
title: Rekursiya
description: "Papka içida yana papkalar bölişi mumkin. Bitta papkadagi fayllarni sanaydigan funksiya har içki papka uçun özini çaqiradi. Shu usul rekursiya deyiladi. Daraxtda ham har bir şoxga bir xil amalni qöllaş mumkin."
---

# Rekursiya

Papka içida yana papkalar bölişi mumkin. Bitta papkadagi fayllarni sanaydigan funksiya har içki papka uçun özini çaqiradi. Shu usul rekursiya deyiladi. Daraxtda ham har bir şoxga bir xil amalni qöllaş mumkin.

## Ikki qism {#two-parts}

Manfiy bölmagan butun sonning faktorialini topamiz. **Bazaviy holatda** javob tayyor. `0!` va `1!` ikkisi ham 1 ga teng. **Rekursiv holatda** funksiya `factorial(n - 1)` ni çaqiradi va natijani `n` ga köpaytiradi. Har bir çaqiruv bazaviy holatga bir qadam yaqinlaşadi.

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(4))
print(factorial(1))
```

## Çaqiruvlar steki {#the-call-stack}

Har tugamagan çaqiruvning argumentlari va mahalliy özgaruvçilari çaqiruvlar stekida saqlanadi. `factorial(4)` 3 ning, u esa 2 ning faktorialini kutadi. Eng içki çaqiruv qaytgaç, kutayotgan amallar teskari tartibda tugaydi.

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

## Xato qayerdan keladi {#when-it-goes-wrong}

Bazaviy holat yöq bölsa yoki masala har safar kiçraymasa, çaqiruvlar töplanadi. Python çegaraga yetganda `RecursionError` keltiradi. `sys.getrecursionlimit()` joriy çegarani körsatadi. Odatdagi CPython seansida u 1 000 atrofida.

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

## Rekursiya yoki sikl {#recursion-or-a-loop}

Faktorial kabi bitta zanjirga ajraladigan masalani sikl bilan yozsak, kutayotgan çaqiruvlar töplanmaydi. Şoxlanadigan masalalarda rekursiya qulayroq öqilişi mumkin. Çuqurlik katta bölsa, zarur holatni alohida stekka yozamiz.

```python
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial(4))
print(factorial(5000) > 10 ** 1000)
```

## Şoxlanadigan rekursiya {#a-recursion-that-branches}

Fibonaççi sonlari 0 va 1 dan boşlanadi. Har keyingi son oldingi ikkitasining yiğindisi. Oddiy rekursiyada `fib(3)` kabi qiymat bir neça marta hisoblanadi. Natijani keşda saqlaş yoki tartib bilan hisoblab boriş ortiqça işni kamaytiradi.

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

## Xanoy minorasi {#a-problem-that-is-recursive-by-nature}

Uçta qoziq bor. Disklar bittadan köçiriladi, katta diskni kiçik disk ustiga qöyiş mumkin emas. `n` ta diskni A dan C ga köçiriş uçun avval yuqoridagi `n - 1` tasini B ga ötkazing. Katta diskni A dan C ga qöying. Söng qolgan disklarni B dan C ga ötkazing.

```python
def hanoi(n, source, target, spare):
    if n == 0:
        return
    hanoi(n - 1, source, spare, target)
    print(f'move disk {n} from {source} to {target}')
    hanoi(n - 1, spare, target, source)

hanoi(3, 'A', 'C', 'B')
```

## Keyingi darslarda {#where-recursion-appears-on-this-site}

[Ikkilik daraxt](/uz/trees/binary-tree) har bir şoxni rekursiv körib çiqadi. [Birlaştirib saralaş](/uz/sorting/merge-sort) masalani ikkiga ajratadi. [Ortga qaytib qidiriş](/uz/algorithm-design/backtracking) har bir tanlovni alohida sinaydi.

## Xulosa {#key-points}

Bazaviy holatni va unga olib boradigan qadamni belgilang. Bir paytda neçta çaqiruv oçiq turişini va ayni masala qayta-qayta hisoblanayotganini tekşiring.

## Maşq {#exercise}

`total` röyxat içidagi barça sonlar yiğindisini topsin. İçma-iç röyxatlar Pythonning rekursiya çegarasidan ötmasin va halqa hosil qilmasin. `isinstance(item, list)` bilan röyxatni ajrating.

```python
def total(items):
    pass

print(total([1, 2, 3]))
print(total([1, [2, 3], [4, [5, 6]]]))
print(total([]))
```

::: details Yeçim
Sonni yiğindiga qöşing, röyxat uçrasa uning yiğindisini rekursiv toping. Böş röyxat 0 qaytaradi. Jami `n` ta elementda vaqt `O(n)`, eng katta çuqurlik `d` bölsa, xotira `O(d)`.

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

:::
