---
title: Algoritmning vaqt va xotira sarfi
description: "Mijozlar röyxati ikki baravar uzaysa, undan ism qidirişga qancha vaqt ketadi? Javob qidiruv usuliga boğliq. Bu darsda maʼlumot hajmi ortgan sari amallar soni va qöşimça xotira sarfi qanday özgarişini köramiz."
---

# Algoritmning vaqt va xotira sarfi

Mijozlar röyxati ikki baravar uzaysa, undan ism qidirişga qancha vaqt ketadi? Javob qidiruv usuliga boğliq. Bu darsda maʼlumot hajmi ortgan sari amallar soni va qöşimça xotira sarfi qanday özgarişini köramiz.

## Qadamlar soni {#count-steps-not-seconds}

Bajariliş vaqti kompyuterga va unda yana qanday dasturlar işlayotganiga boğliq. Algoritmlarni soliştiriş uçun taqqoslaş, qöşiş va indeks böyiça öqiş kabi amallarni sanaymiz. `n` röyxat uzunligini bildiradi. `total` har bir elementni yiğindiga qöşadi. `first` böş bölmagan röyxatda faqat birinçi elementni öqiydi. Bu misolda har bir oddiy amal bir qadam deb olinadi. Uzun satrlarni taqqoslaş yoki katta butun sonlarni qöşiş köproq vaqt olişi mumkin.

```python
def total(items):
    result = 0
    for value in items:
        result += value
    return result

def first(items):
    return items[0]

print(total([4, 8, 15, 16, 23, 42]))
print(first([4, 8, 15, 16, 23, 42]))
```

## Katta O belgilanişi {#big-o-notation}

Katta O kiruvçi maʼlumot kattalaşganda qadamlar soni qaysi darajadan tez ösmasligini ifodalaydi. `2n` va `n + 5` ikkalasi ham `O(n)`, `n² + n` esa `O(n²)`. Katta `n` da ösiş tezligini eng katta had belgilaydi. `total` uçun çiziqli, `first` uçun doimiy xarajat olinadi.

## Ösiş turlari {#the-common-growth-rates}

Quyidagi rasmlarda bir xil `n` uçun turli qadamlar sonini soliştiring.

| Belgi | Ösiş turi | Misol |
| --- | --- | --- |
| `O(1)` | Doimiy | Indeks böyiça öqiş |
| `O(log n)` | Logarifmik | Ikkilik qidiruv |
| `O(n)` | Çiziqli | Röyxatni bir marta aylanib çiqiş |
| `O(n log n)` | Çiziqli-logarifmik | Birlaştirib saralaş |
| `O(n²)` | Kvadratik | Har bir juftlikni taqqoslaş |
| `O(2ⁿ)` | Eksponensial | Barça qism töplamlarni tekşiriş |

<GrowthCurves />

<Diagram label="Steps for n = 16" :width="640" :height="176" alt="A bar chart of step counts when n is 16. O(1) takes 1 step, O(log n) takes 4, O(n) takes 16, O(n log n) takes 64 and O(n squared) takes 256.">
 <template v-for="(row, i) in [['O(1)', 1], ['O(log n)', 4], ['O(n)', 16], ['O(n log n)', 64], ['O(n²)', 256]]" :key="i">
  <text class="dg-code end" x="122" :y="33 + 30 * i">{{ row[0] }}</text>
  <rect class="dg-bar" x="134" :y="24 + 30 * i" :width="Math.max(3, row[1] * 1.75)" height="18" />
  <text class="dg-note start" :x="142 + Math.max(3, row[1] * 1.75)" :y="37 + 30 * i">{{ row[1] }}</text>
 </template>
</Diagram>

## `log n` nimani anglatadi {#what-log-n-means}

16 ni tört marta yarmiga bölganimizda 1 qoladi. Bir million uçun qariyb 20 qadam kerak. Bu kursda ikkiga böliş haqida söz borganda `log n` ning asosi 2. [Ikkilik qidiruv](/uz/arrays/binary-search) shu usul bilan qidiruv oraliğini qisqartiradi.

<Diagram label="Halving 16 items" :width="640" :height="190" alt="Sixteen cells. Each step keeps half of what is left: 16, then 8, 4, 2 and 1. It takes four halvings to get from 16 to 1.">
 <template v-for="k in [0, 1, 2, 3, 4]" :key="k">
  <text class="dg-note end" x="108" :y="35 + 32 * k">{{ k === 0 ? 'start' : `step ${k}` }}</text>
  <DCells :x="120" :y="20 + 32 * k" :w="28" :h="22" :values="Array(16).fill(null)" :states="Array.from({ length: 16 }, (_, i) => i < (16 >> k) ? 'hit' : 'ghost')" />
  <text class="dg-note start" x="580" :y="35 + 32 * k">{{ 16 >> k }} left</text>
 </template>
</Diagram>

## Koddan xarajatni aniqlaş {#reading-the-cost-from-code}

Ketma-ket bajarilgan ikki siklning qadamlarini qöşamiz. Har biri `n` marta aylansa, jami `2n` qadam böladi. Biri ikkinçisining içida bölgan va har biri `n` martadan aylangan ikki sikl `n²` qadam bajaradi. Har qadamda masala hajmi yarmiga tuşsa, qadamlar soni `log n` ga mutanosib.

```python
def count_steps(n):
    in_a_row = 0
    for i in range(n):
        in_a_row += 1
    for i in range(n):
        in_a_row += 1

    nested = 0
    for i in range(n):
        for j in range(n):
            nested += 1

    halving = 0
    left = n
    while left > 1:
        left //= 2
        halving += 1
    return in_a_row, nested, halving

for n in [16, 32, 64]:
    print(n, count_steps(n))
```

## Eng yaxşi, eng yomon va örtaça holat {#best-worst-and-average-case}

Qidirilayotgan element birinçi bölganida qidiruv bir qadamda tugaydi. Element oxirida bölsa yoki yöq bölsa, `n` ta tekşiruv kerak. Agar qiymat röyxatda bor va har bir joyda turişi bir xil ehtimolli bölsa, örtaça taxminan `n / 2` qadam kerak.

Amortizatsiyalangan xarajat ketma-ket bajarilgan amallarning jami vaqtini shu amallarga taqsimlab topiladi. Bunda ayrim amallar ança vaqt olişi mumkin. [Dinamik massiv](/uz/arrays/dynamic-array) bunga misol.

```python
def find(items, target):
    steps = 0
    for i, value in enumerate(items):
        steps += 1
        if value == target:
            return i, steps
    return -1, steps

items = [4, 8, 15, 16, 23, 42]
print(find(items, 4))
print(find(items, 42))
print(find(items, 99))
```

## Xotira {#space}

Qöşimça xotira xarajati algoritm kiruvçi maʼlumotdan taşqari qança joy işlatişini bildiradi. Röyxatdagi juft elementlar örnini almaştirib, uni `O(1)` qöşimça xotira bilan teskarilaş mumkin. Nusxa tuzişga `O(n)` joy ketadi. Rekursiyada bir paytda oçiq turgan har bir çaqiruv ham xotira oladi.

## Python tuzilmalarining xarajati {#costs-of-python-s-built-ins}

`list` da indeks böyiça öqiş `O(1)`, qiymat böyiça qidiriş `O(n)`. Röyxat oxiriga qöşiş amortizatsiya bilan `O(1)`, boşiga qöşiş yoki boşidan öçiriş `O(n)`. `dict` va `set` da kalitni tekşiriş odatdagi xeşlaş farazlari ostida örtaça `O(1)`. Sikl içida röyxatga tegişlilikni tekşiriş ikki qavat siklga teng iş bajarişi mumkin.

## Xulosa {#key-points}

Masala hajmini avval belgilang. Söng qadamlar soni va qöşimça xotirani alohida hisoblang. Xarajat eng yomon holat uçunmi, örtaça qiymatmi yoki amallar ketma-ketligiga tegişlimi, şuni ayting.

## Maşq {#exercise}

`has_duplicate` funksiyasi barça juftlarni taqqoslaydi. Uni `set` bilan qayta yozib, kutilgan vaqtni `O(n)` ga tuşiring. Elementlar xeşlanadi, xeş va tenglik tekşiruvi doimiy vaqt oladi deb faraz qiling.

```python
def has_duplicate(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

print(has_duplicate([4, 8, 15, 16, 23, 42]))
print(has_duplicate([4, 8, 15, 8, 23, 42]))
print(has_duplicate([]))
```

::: details Yeçim
Röyxatni bir marta aylanib çiqing. Har bir avval körilgan elementni `seen` töplamiga yozing. Element allaqaçon töplamda bölsa, takror bor. Qöşimça xotira `O(n)`.

```python
def has_duplicate(items):
    seen = set()
    for value in items:
        if value in seen:
            return True
        seen.add(value)
    return False

print(has_duplicate([4, 8, 15, 16, 23, 42]))
print(has_duplicate([4, 8, 15, 8, 23, 42]))
print(has_duplicate([]))
```

:::
