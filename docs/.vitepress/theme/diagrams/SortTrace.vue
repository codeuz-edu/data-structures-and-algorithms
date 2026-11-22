<script setup>
// Row-by-row sort traces on the input shared by the sorting pages: 35, 80, 15, 67, 80, 89, 29, 24.
// The two 80s are drawn 80a and 80b so their order can be followed. One row of cells per step,
// with a label on the left and a note on the right. `mode` is selection or insertion (Simple
// Sorts page), or partition or sorted (Quicksort page).
// Geometry: row k has its top edge at 14 + 40 * k. Cells are 44 wide and 30 high and run from
// x = 96 to x = 448. Labels end at x = 84, notes start at x = 464, and the legend sits 26 below
// the last row.
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DCells from './DCells.vue'
const props = defineProps({ mode: { type: String, required: true } })
const top = 14, step = 40, w = 44, h = 30, left = 96
const traces = {
 selection: {
  label: 'Selection sort', cost: 'O(n²)',
  alt: 'Selection sort on 35, 80a, 15, 67, 80b, 89, 29, 24, one row per pass. Each pass finds the smallest item that is left and swaps it into the next place: 15, then 24, 29, 35, 67, 80b and 80a. The sorted part at the front grows by one cell per pass. In pass 2 the swap sends 80a to the end, behind 80b, so the two 80s finish in the opposite order: 80b before 80a.',
  legend: 'outlined: sorted part · filled: placed by this pass',
  rows: [
   { label: 'start', values: [35, '80a', 15, 67, '80b', 89, 29, 24], states: ['', '', '', '', '', '', '', ''], note: '' },
   { label: 'pass 1', values: [15, '80a', 35, 67, '80b', 89, 29, 24], states: ['new', '', '', '', '', '', '', ''], note: 'swap 15 and 35' },
   { label: 'pass 2', values: [15, 24, 35, 67, '80b', 89, 29, '80a'], states: ['done', 'new', '', '', '', '', '', ''], note: 'swap 24 and 80a, now behind 80b' },
   { label: 'pass 3', values: [15, 24, 29, 67, '80b', 89, 35, '80a'], states: ['done', 'done', 'new', '', '', '', '', ''], note: 'swap 29 and 35' },
   { label: 'pass 4', values: [15, 24, 29, 35, '80b', 89, 67, '80a'], states: ['done', 'done', 'done', 'new', '', '', '', ''], note: 'swap 35 and 67' },
   { label: 'pass 5', values: [15, 24, 29, 35, 67, 89, '80b', '80a'], states: ['done', 'done', 'done', 'done', 'new', '', '', ''], note: 'swap 67 and 80b' },
   { label: 'pass 6', values: [15, 24, 29, 35, 67, '80b', 89, '80a'], states: ['done', 'done', 'done', 'done', 'done', 'new', '', ''], note: 'swap 80b and 89' },
   { label: 'pass 7', values: [15, 24, 29, 35, 67, '80b', '80a', 89], states: ['done', 'done', 'done', 'done', 'done', 'done', 'new', 'done'], note: 'swap 80a and 89' }
  ]
 },
 insertion: {
  label: 'Insertion sort', cost: 'O(n²)',
  alt: 'Insertion sort on 35, 80a, 15, 67, 80b, 89, 29, 24, one row per pass. Each pass takes the next item and shifts the larger items of the sorted part one place right to make room for it. 80a, 80b and 89 do not move. 15 moves past 2 items, 67 past 1, 29 past 5 and 24 past 6, which is 14 shifts in all. 80b stops behind 80a, so the two 80s keep their order.',
  legend: 'outlined: sorted part · filled: the item just inserted',
  rows: [
   { label: 'start', values: [35, '80a', 15, 67, '80b', 89, 29, 24], states: ['done', '', '', '', '', '', '', ''], note: '' },
   { label: 'pass 1', values: [35, '80a', 15, 67, '80b', 89, 29, 24], states: ['done', 'new', '', '', '', '', '', ''], note: '80a: 0 shifts' },
   { label: 'pass 2', values: [15, 35, '80a', 67, '80b', 89, 29, 24], states: ['new', 'done', 'done', '', '', '', '', ''], note: '15: 2 shifts' },
   { label: 'pass 3', values: [15, 35, 67, '80a', '80b', 89, 29, 24], states: ['done', 'done', 'new', 'done', '', '', '', ''], note: '67: 1 shift' },
   { label: 'pass 4', values: [15, 35, 67, '80a', '80b', 89, 29, 24], states: ['done', 'done', 'done', 'done', 'new', '', '', ''], note: '80b stops behind 80a: 0 shifts' },
   { label: 'pass 5', values: [15, 35, 67, '80a', '80b', 89, 29, 24], states: ['done', 'done', 'done', 'done', 'done', 'new', '', ''], note: '89: 0 shifts' },
   { label: 'pass 6', values: [15, 29, 35, 67, '80a', '80b', 89, 24], states: ['done', 'new', 'done', 'done', 'done', 'done', 'done', ''], note: '29: 5 shifts' },
   { label: 'pass 7', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['done', 'new', 'done', 'done', 'done', 'done', 'done', 'done'], note: '24: 6 shifts' }
  ]
 },
 partition: {
  label: 'Partition around 35', cost: 'O(n)',
  alt: 'Partitioning 35, 80a, 15, 67, 80b, 89, 29, 24 around the pivot 35. A scan from left to right finds 15, 29 and 24, the items smaller than 35, and swaps each one into the smaller part that grows right after the pivot. The larger items are moved only when they are in the way. Last, the pivot swaps with 24, giving 24, 15, 29, 35, 80b, 89, 80a, 67: the smaller items are left of 35 and the rest are right of it.',
  legend: 'filled: pivot · outlined: smaller than the pivot · grey: not looked at yet',
  rows: [
   { label: 'start', values: [35, '80a', 15, 67, '80b', 89, 29, 24], states: ['hit', 'muted', 'muted', 'muted', 'muted', 'muted', 'muted', 'muted'], note: 'pivot 35' },
   { label: 'j = 1', values: [35, '80a', 15, 67, '80b', 89, 29, 24], states: ['hit', '', 'muted', 'muted', 'muted', 'muted', 'muted', 'muted'], note: '80a ≥ 35: leave it' },
   { label: 'j = 2', values: [35, 15, '80a', 67, '80b', 89, 29, 24], states: ['hit', 'done', '', 'muted', 'muted', 'muted', 'muted', 'muted'], note: '15 < 35: swap it with 80a' },
   { label: 'j = 3 to 5', values: [35, 15, '80a', 67, '80b', 89, 29, 24], states: ['hit', 'done', '', '', '', '', 'muted', 'muted'], note: '67, 80b, 89 ≥ 35: leave them' },
   { label: 'j = 6', values: [35, 15, 29, 67, '80b', 89, '80a', 24], states: ['hit', 'done', 'done', '', '', '', '', 'muted'], note: '29 < 35: swap it with 80a' },
   { label: 'j = 7', values: [35, 15, 29, 24, '80b', 89, '80a', 67], states: ['hit', 'done', 'done', 'done', '', '', '', ''], note: '24 < 35: swap it with 67' },
   { label: 'last', values: [24, 15, 29, 35, '80b', 89, '80a', 67], states: ['done', 'done', 'done', 'hit', '', '', '', ''], note: 'swap the pivot with 24' }
  ]
 },
 sorted: {
  label: 'Sorted input, first item as pivot', cost: 'O(n²)',
  alt: 'Quicksort with the first item as the pivot, run on the sorted list 15, 24, 29, 35, 67, 80a, 80b, 89. Every pivot is the smallest item that is left, so nothing goes to its left and each call settles only one item. The calls go 7 levels deep and make 7, 6, 5, 4, 3, 2 and 1 comparisons.',
  legend: 'filled: pivot · grey: already in its final place',
  rows: [
   { label: 'depth 1', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['hit', '', '', '', '', '', '', ''], note: '7 comparisons, left side empty' },
   { label: 'depth 2', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['muted', 'hit', '', '', '', '', '', ''], note: '6 comparisons, left side empty' },
   { label: 'depth 3', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['muted', 'muted', 'hit', '', '', '', '', ''], note: '5 comparisons, left side empty' },
   { label: 'depth 4', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['muted', 'muted', 'muted', 'hit', '', '', '', ''], note: '4 comparisons, left side empty' },
   { label: 'depth 5', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['muted', 'muted', 'muted', 'muted', 'hit', '', '', ''], note: '3 comparisons, left side empty' },
   { label: 'depth 6', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['muted', 'muted', 'muted', 'muted', 'muted', 'hit', '', ''], note: '2 comparisons, left side empty' },
   { label: 'depth 7', values: [15, 24, 29, 35, 67, '80a', '80b', 89], states: ['muted', 'muted', 'muted', 'muted', 'muted', 'muted', 'hit', ''], note: '1 comparison, left side empty' }
  ]
 }
}
const trace = computed(() => traces[props.mode])
const bottom = computed(() => top + trace.value.rows.length * step - (step - h))
</script>

<template>
 <Diagram :label="trace.label" :cost="trace.cost" :width="680" :height="bottom + 40" :alt="trace.alt">
  <template v-for="(row, k) in trace.rows" :key="k">
   <text class="dg-note end" :x="left - 12" :y="top + k * step + h / 2 + 4">{{ row.label }}</text>
   <DCells :x="left" :y="top + k * step" :w="w" :h="h" :values="row.values" :states="row.states" />
   <text v-if="row.note" class="dg-note start" :x="left + 8 * w + 16" :y="top + k * step + h / 2 + 4">{{ row.note }}</text>
  </template>
  <text class="dg-note start" :x="left" :y="bottom + 26">{{ trace.legend }}</text>
 </Diagram>
</template>
