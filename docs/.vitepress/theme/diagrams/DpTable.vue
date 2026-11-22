<script setup>
// A dynamic programming table: a grid of cells with a heading above each column and beside each row.
//   rows:     the table, one list of values per row; null draws an empty cell
//   colHeads: a heading above each column; rowHeads: a heading left of each row
//   colTitle: what the columns stand for, centred above the column headings
//   rowTitle: what the rows stand for, in the corner above the row headings
//   states:   per cell, keyed 'row,col', for example { '3,6': 'new', '2,6': 'done' }
//   small:    smaller text in the cells, for words
// Cell (r, c) covers x + c * w to x + (c + 1) * w across and y + r * h to y + (r + 1) * h down.
// Column headings are centred 14 above the grid and the column title has its baseline 30 above it.
// Row headings and the row title end 10 left of the grid; the row title sits level with the
// column headings. Blue cells (new, hit, done) are drawn last, so no neighbour covers their border.
import { computed } from 'vue'
import DCells from './DCells.vue'
const props = defineProps({
 x: Number, y: Number, w: { type: Number, default: 44 }, h: { type: Number, default: 34 },
 rows: { type: Array, required: true },
 colHeads: { type: Array, default: () => [] }, rowHeads: { type: Array, default: () => [] },
 colTitle: { type: String, default: '' }, rowTitle: { type: String, default: '' },
 states: { type: Object, default: () => ({}) }, small: Boolean
})
const blue = ['new', 'hit', 'done']
const marked = computed(() => Object.entries(props.states).map(([key, state]) => {
 const [r, c] = key.split(',').map(Number)
 return { key, r, c, state }
}))
const stateAt = (r, c) => marked.value.find(cell => cell.r === r && cell.c === c)?.state
const plainValues = r => props.rows[r].map((value, c) => blue.includes(stateAt(r, c)) ? null : value)
const plainStates = r => props.rows[r].map((value, c) => blue.includes(stateAt(r, c)) ? undefined : stateAt(r, c))
const blueCells = computed(() => marked.value.filter(cell => blue.includes(cell.state)).sort((a, b) => (a.state !== 'done') - (b.state !== 'done')))
</script>

<template>
 <g>
  <DCells v-for="(row, r) in rows" :key="`r${r}`" :x="x" :y="y + r * h" :w="w" :h="h" :values="plainValues(r)" :states="plainStates(r)" :small="small" />
  <DCells v-for="cell in blueCells" :key="cell.key" :x="x + cell.c * w" :y="y + cell.r * h" :w="w" :h="h" :values="[rows[cell.r][cell.c]]" :states="[cell.state]" :small="small" />
  <text v-for="(head, c) in colHeads" :key="`ch${c}`" class="dg-code" text-anchor="middle" :x="x + (c + 0.5) * w" :y="y - 14">{{ head }}</text>
  <text v-for="(head, r) in rowHeads" :key="`rh${r}`" class="dg-code end" :x="x - 10" :y="y + (r + 0.5) * h">{{ head }}</text>
  <text v-if="colTitle" class="dg-note" :x="x + rows[0].length * w / 2" :y="y - 30">{{ colTitle }}</text>
  <text v-if="rowTitle" class="dg-note end" :x="x - 10" :y="y - 10">{{ rowTitle }}</text>
 </g>
</template>
