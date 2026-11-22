---
title: Tartiblangan massiv va ikkilik qidiruv
description: "Tartiblangan massivdan qiymat qidirayotganda örta elementga qarab qaysi yarimni tekşiriş kerakligini bilamiz. Ikkilik qidiruv şu fikrga asoslanadi."
---

# Tartiblangan massiv va ikkilik qidiruv

Tartiblangan massivdan qiymat qidirayotganda örta elementga qarab qaysi yarimni tekşiriş kerakligini bilamiz. Ikkilik qidiruv şu fikrga asoslanadi.

## Qidiruv oraliği {#the-idea}

`lo` va `hi` tekşirilmagan oraliqning ikki uçidir. `mid = (lo + hi) // 2` bilan örta indeksni topamiz. Qiymat teng bölsa, indeksni qaytaramiz. Örta element izlanayotgan qiymatdan kiçik bölsa `lo = mid + 1`, katta bölsa `hi = mid - 1`. `lo > hi` bölganida oraliq böş.

<Diagram label="23 ni qidiriş" cost="O(log n)" :width="700" :height="250" alt="Önta son tartiblangan. Birinçi qadamda örta qiymat 16. U 23 dan kiçik, şuning uçun çap qismni chiqaramiz. Ikkinçi qadamda örta qiymat 56. U 23 dan katta, şuning uçun öng qismni chiqaramiz. Uçinçi qadamda 23 ni 5-indeksda topamiz.">
 <text class="dg-note end" x="98" y="68">1-qadam</text>
 <DCells :x="110" :y="44" :w="44" :values="[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" :states="{ 4: 'hit' }" :marks="{ 0: 'lo', 4: 'mid', 9: 'hi' }" />
 <text class="dg-note start" x="562" y="68">16 &lt; 23, öngga öting</text>
 <text class="dg-note end" x="98" y="148">2-qadam</text>
 <DCells :x="110" :y="124" :w="44" :values="[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" :states="{ 0: 'ghost', 1: 'ghost', 2: 'ghost', 3: 'ghost', 4: 'ghost', 7: 'hit' }" :marks="{ 5: 'lo', 7: 'mid', 9: 'hi' }" />
 <text class="dg-note start" x="562" y="148">56 &gt; 23, çapga öting</text>
 <text class="dg-note end" x="98" y="228">3-qadam</text>
 <DCells :x="110" :y="204" :w="44" :values="[2, 5, 8, 12, 16, 23, 38, 56, 72, 91]" :states="{ 0: 'ghost', 1: 'ghost', 2: 'ghost', 3: 'ghost', 4: 'ghost', 5: 'new', 7: 'ghost', 8: 'ghost', 9: 'ghost' }" :marks="{ 5: 'lo · mid', 6: 'hi' }" indices />
 <text class="dg-note is-accent start" x="562" y="228">5-indeksda topildi</text>
</Diagram>

```python
def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(numbers, 23))
print(binary_search(numbers, 2))
print(binary_search(numbers, 40))
```

## Nega `O(log n)` {#why-it-is-o-log-n}

Har tekşiruvdan keyin qidiruv oraliğida avvalgi elementlarning köpi bilan yarmi qoladi. Bir millionta element uçun eng köp 20 qadam kerak. Bunda elementni indeks bilan öqiş `O(1)` deb olinadi.

## Şartlar va çegaralar {#getting-the-details-right}

Massiv saralangan bölişi şart. `lo <= hi` oxirgi bitta elementni ham tekşiradi. Qidiruv davom etganda `mid` dan ötib ketiş oraliqning kiçrayişini kafolatlaydi. [Boğlangan röyxatda](/uz/linked-lists/singly-linked-list) örta tugungaça yurib boriş kerak, şuning uçun indeksli qidiruvning logarifmik vaqti saqlanmaydi.

## Birinçi örinni topiş {#finding-the-first-position}

Qiymat takrorlansa, oddiy qidiruv duç kelgan nusxasini qaytaradi. `lower_bound` izlangan qiymatdan kiçik bölmagan birinçi elementni izlaydi. U yarim oçiq `[lo, hi)` oraliğida işlaydi. Javob oxirgi elementdan keyin ham bölişi mumkin.

<Diagram label="8 ning birinçi va oxirgi örni" :width="640" :height="120" alt="Massivda 2, 5, 8, 8, 8, 12 va 16 bor. bisect_left birinçi 8 ning 2-indeksini, bisect_right oxirgi 8 dan keyingi 5-indeksni qaytaradi.">
 <DCells :x="152" :y="50" :values="[2, 5, 8, 8, 8, 12, 16]" :states="{ 2: 'hit', 3: 'hit', 4: 'hit' }" :marks="{ 2: 'bisect_left', 5: 'bisect_right' }" indices />
</Diagram>

```python
def lower_bound(items, target):
    lo, hi = 0, len(items)
    while lo < hi:
        mid = (lo + hi) // 2
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

numbers = [2, 5, 8, 8, 8, 12, 16]
print(lower_bound(numbers, 8))
print(lower_bound(numbers, 9))
print(lower_bound(numbers, 99))
```

## Python tilida `bisect` moduli {#in-python-the-bisect-module}

`bisect_left` izlangan qiymatga teng yoki undan katta birinçi element örnini beradi. `bisect_right` undan katta birinçi element örnini beradi. Mos örin yöq bölsa, röyxat uzunligi qaytadi. Ayirmasi takrorlar sonidir. `insort` örinni `O(log n)` vaqtda topadi, lekin elementlarni surişga `O(n)` vaqt ketadi.

```python
import bisect

numbers = [2, 5, 8, 8, 8, 12, 16]
left = bisect.bisect_left(numbers, 8)
right = bisect.bisect_right(numbers, 8)
print(left, right, right - left)

bisect.insort(numbers, 9)
print(numbers)
```

## Qayerda işlatiladi {#when-to-use-it}

Maʼlumot kam özgarib, köp qidirilsa, tartiblangan massiv qulay. Undan eng yaqin qiymatni yoki oraliqdagi elementlar sonini ham topiş mumkin. Tez-tez özgaradigan tartibli maʼlumotlar uçun [AVL daraxti](/uz/trees/avl-tree) qidiruv va yangilaşni logarifmik vaqtda bajaradi. Faqat tegişlilik tekşirilsa, xeşlanadigan qiymatlar uçun `set` qulay.

## Amallar xarajati {#costs-at-a-glance}

| Amal | Vaqt |
| --- | --- |
| Qiymatni yoki çegarani topiş | `O(log n)` |
| Eng kiçik yoki eng katta elementni öqiş | `O(1)` |
| Tartibni saqlab qöşiş yoki öçiriş | `O(n)` |
| Taqqoslaş bilan dastlabki saralaş | `O(n log n)` |

## Xulosa {#key-points}

Ikkilik qidiruvga saralangan ketma-ketlik va indeks böyiça tez murojaat kerak. `bisect` moduli qiymat yöq bölganida ham qöşiş örnini topadi.

## Maşq {#exercise}

`count_in_range` tartiblangan röyxatdagi `low` bilan `high` orasida joylaşgan elementlarni sanasin. Çegaralarning özini ham hisoblang. `low > high` bölsa, 0 qaytaring. `bisect` modulidan foydalaning.

```python
import bisect

def count_in_range(items, low, high):
    pass

numbers = [2, 5, 8, 8, 8, 12, 16, 23]
print(count_in_range(numbers, 5, 12))
print(count_in_range(numbers, 9, 11))
print(count_in_range(numbers, 0, 100))
print(count_in_range(numbers, 12, 5))
```

::: details Yeçim
`bisect_left(items, low)` quyi çegarani, `bisect_right(items, high)` yuqori çegaradan keyingi örinni topadi. Ayirma javobni beradi. Töğri tartibdagi çegaralar bilan qidiruv `O(log n)` vaqt oladi.

```python
import bisect

def count_in_range(items, low, high):
    if low > high:
        return 0
    return bisect.bisect_right(items, high) - bisect.bisect_left(items, low)

numbers = [2, 5, 8, 8, 8, 12, 16, 23]
print(count_in_range(numbers, 5, 12))
print(count_in_range(numbers, 9, 11))
print(count_in_range(numbers, 0, 100))
print(count_in_range(numbers, 12, 5))
```

:::
