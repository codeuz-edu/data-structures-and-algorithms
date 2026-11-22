<script setup>
// Step-by-step tables for the graph in WeightedGraph.vue. `algorithm` is dijkstra, kruskal or prim.
// Each numbered row is one entry popped from the heap (Dijkstra, Prim) or one edge taken in sorted
// order (Kruskal). Column headings sit on y = 18.
//   dijkstra  the entry popped, the distances after the step as cells (filled = settled in this
//             step, outlined = settled before, grey = not reached), what changed, the heap after.
//             Rows are 38 apart, cells 40 x 30 from x = 104; the stale row has a note instead.
//   kruskal   the edge, its weight, whether it was added, and the groups after the step.
//             A start row comes first; rows are 30 apart.
//   prim      the edge popped as (weight, u, v), what happened, and the heap after the step.
//             A start row comes first; rows are 30 apart.
// Heap contents are listed smallest first, which is not the order heapq keeps them in.
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DCells from './DCells.vue'
import DStep from './DStep.vue'
const props = defineProps({ algorithm: { type: String, required: true } })
const dijkstraRows = [
 { pop: '(0, A)', values: [0, 2, 5, '∞', '∞', '∞'], settled: 0, changed: 'B = 2, C = 5', heap: '(2, B) (5, C)' },
 { pop: '(2, B)', values: [0, 2, 3, 8, '∞', '∞'], settled: 1, changed: 'C = 3, D = 8', heap: '(3, C) (5, C) (8, D)' },
 { pop: '(3, C)', values: [0, 2, 3, 8, 7, '∞'], settled: 2, changed: 'E = 7', heap: '(5, C) (7, E) (8, D)' },
 { pop: '(5, C)', stale: true, heap: '(7, E) (8, D)' },
 { pop: '(7, E)', values: [0, 2, 3, 8, 7, 15], settled: 4, changed: 'F = 15', heap: '(8, D) (15, F)' },
 { pop: '(8, D)', values: [0, 2, 3, 8, 7, 15], settled: 3, changed: 'none', heap: '(15, F)' },
 { pop: '(15, F)', values: [0, 2, 3, 8, 7, 15], settled: 5, changed: 'none', heap: 'empty' }
]
// The cell states of one Dijkstra row: the vertex settled in this row is filled, the ones settled
// in earlier rows are outlined, and the ones still at infinity are grey.
const settledBefore = i => dijkstraRows.slice(0, i).filter(row => !row.stale).map(row => row.settled)
const cellStates = (row, i) => Object.fromEntries(row.values.map((value, j) => [j,
 j === row.settled ? 'hit' : settledBefore(i).includes(j) ? 'done' : value === '∞' ? 'muted' : '']))
const kruskalRows = [
 { edge: 'B-C', weight: 1, added: true, groups: '{A} {B, C} {D} {E} {F}' },
 { edge: 'A-B', weight: 2, added: true, groups: '{A, B, C} {D} {E} {F}' },
 { edge: 'D-E', weight: 3, added: true, groups: '{A, B, C} {D, E} {F}' },
 { edge: 'C-E', weight: 4, added: true, groups: '{A, B, C, D, E} {F}' },
 { edge: 'A-C', weight: 5, added: false, groups: '{A, B, C, D, E} {F}' },
 { edge: 'B-D', weight: 6, added: false, groups: '{A, B, C, D, E} {F}' },
 { edge: 'E-F', weight: 8, added: true, groups: '{A, B, C, D, E, F}' }
]
const primRows = [
 { pop: '(2, A, B)', action: 'add B', heap: '(1, B, C) (5, A, C) (6, B, D)' },
 { pop: '(1, B, C)', action: 'add C', heap: '(4, C, E) (5, A, C) (6, B, D)' },
 { pop: '(4, C, E)', action: 'add E', heap: '(3, E, D) (5, A, C) (6, B, D) (8, E, F)' },
 { pop: '(3, E, D)', action: 'add D', heap: '(5, A, C) (6, B, D) (8, E, F) (9, D, F)' },
 { pop: '(5, A, C)', action: 'skip: C in tree', heap: '(6, B, D) (8, E, F) (9, D, F)' },
 { pop: '(6, B, D)', action: 'skip: D in tree', heap: '(8, E, F) (9, D, F)' },
 { pop: '(8, E, F)', action: 'add F', heap: '(9, D, F)' }
]
const text = {
 dijkstra: {
  label: 'Dijkstra from A, one heap entry per row', cost: 'O(V + E log V)', width: 620, height: 326,
  alt: 'Seven rows, one for each entry popped from the heap. Pop (0, A): settle A; B becomes 2 and C 5. Pop (2, B): settle B; C drops to 3 and D becomes 8. Pop (3, C): settle C; E becomes 7. Pop (5, C): C is settled already, so the entry is skipped. Pop (7, E): settle E; F becomes 15, and D keeps 8 because 10 is worse. Pop (8, D): settle D; nothing changes. Pop (15, F): settle F; the heap is empty. Final distances: A 0, B 2, C 3, D 8, E 7, F 15.'
 },
 kruskal: {
  label: "Kruskal's algorithm, lightest edge first", cost: 'O(E log V)', width: 480, height: 296,
  alt: 'The edges in order of weight. B-C 1, added. A-B 2, added. D-E 3, added. C-E 4, added, joining A, B, C with D, E. A-C 5, skipped because A and C are already in one group. B-D 6, skipped for the same reason. E-F 8, added, and all six vertices are in one group. D-F 9 is never looked at.'
 },
 prim: {
  label: "Prim's algorithm from A, one heap entry per row", cost: 'O(E log V)', width: 540, height: 296,
  alt: 'The tree starts as A with (2, A, B) and (5, A, C) in the heap. Pop (2, A, B): add B. Pop (1, B, C): add C. Pop (4, C, E): add E. Pop (3, E, D): add D. Pop (5, A, C): skipped, C is in the tree. Pop (6, B, D): skipped, D is in the tree. Pop (8, E, F): add F, and the tree is complete with (9, D, F) still in the heap.'
 }
}
const view = computed(() => text[props.algorithm])
</script>

<template>
 <Diagram :label="view.label" :cost="view.cost" :width="view.width" :height="view.height" :alt="view.alt">
  <template v-if="algorithm === 'dijkstra'">
   <text class="dg-label start" x="34" y="18">popped</text>
   <text v-for="(vertex, j) in ['A', 'B', 'C', 'D', 'E', 'F']" :key="vertex" class="dg-label" :x="124 + 40 * j" y="18">{{ vertex }}</text>
   <text class="dg-label start" x="360" y="18">changed</text>
   <text class="dg-label start" x="446" y="18">heap after</text>
   <template v-for="(row, i) in dijkstraRows" :key="i">
    <DStep :x="16" :y="45 + 38 * i" :n="i + 1" />
    <text class="dg-code start" x="34" :y="45 + 38 * i">{{ row.pop }}</text>
    <DCells v-if="!row.stale" :x="104" :y="30 + 38 * i" :w="40" :h="30" :values="row.values" :states="cellStates(row, i)" />
    <text v-else class="dg-note" x="224" :y="49 + 38 * i">C is settled already: skip</text>
    <text v-if="row.changed" class="dg-note start" x="360" :y="49 + 38 * i">{{ row.changed }}</text>
    <text class="dg-code start" x="446" :y="45 + 38 * i">{{ row.heap }}</text>
   </template>
   <text class="dg-note" x="310" y="314">filled: settled in this step · outlined: settled before · grey: not reached yet</text>
  </template>
  <template v-else-if="algorithm === 'kruskal'">
   <text class="dg-label start" x="34" y="18">edge</text>
   <text class="dg-label start" x="84" y="18">weight</text>
   <text class="dg-label start" x="146" y="18">result</text>
   <text class="dg-label start" x="282" y="18">groups after</text>
   <text class="dg-note start" x="34" y="48">start</text>
   <text class="dg-code start" x="282" y="44">{A} {B} {C} {D} {E} {F}</text>
   <template v-for="(row, i) in kruskalRows" :key="i">
    <DStep :x="16" :y="74 + 30 * i" :n="i + 1" />
    <text class="dg-code start" x="34" :y="74 + 30 * i">{{ row.edge }}</text>
    <text class="dg-code start" x="104" :y="74 + 30 * i">{{ row.weight }}</text>
    <text :class="['dg-note start', row.added && 'is-accent']" x="146" :y="78 + 30 * i">{{ row.added ? 'added' : 'skipped: same group' }}</text>
    <text class="dg-code start" x="282" :y="74 + 30 * i">{{ row.groups }}</text>
   </template>
   <text class="dg-note" x="240" y="286">D-F (9) is never looked at: the tree already has 5 edges</text>
  </template>
  <template v-else>
   <text class="dg-label start" x="34" y="18">popped</text>
   <text class="dg-label start" x="116" y="18">action</text>
   <text class="dg-label start" x="222" y="18">heap after</text>
   <text class="dg-note start" x="34" y="48">start</text>
   <text class="dg-note start" x="116" y="48">tree: A</text>
   <text class="dg-code start" x="222" y="44">(2, A, B) (5, A, C)</text>
   <template v-for="(row, i) in primRows" :key="i">
    <DStep :x="16" :y="74 + 30 * i" :n="i + 1" />
    <text class="dg-code start" x="34" :y="74 + 30 * i">{{ row.pop }}</text>
    <text :class="['dg-note start', row.action.startsWith('add') && 'is-accent']" x="116" :y="78 + 30 * i">{{ row.action }}</text>
    <text class="dg-code start" x="222" :y="74 + 30 * i">{{ row.heap }}</text>
   </template>
   <text class="dg-note" x="270" y="286">every vertex is in the tree, so Prim stops with (9, D, F) unused</text>
  </template>
 </Diagram>
</template>
