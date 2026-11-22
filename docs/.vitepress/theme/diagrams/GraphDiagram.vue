<script setup>
// The six-vertex graph used on the Graph page. `mode` is empty for the plain picture, or bfs, dfs
// or iterative to show the visit order from A and the edges each search follows. iterative is the
// depth-first search with an explicit stack that pushes neighbours in list order.
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DGraph from './DGraph.vue'
const props = defineProps({ mode: { type: String, default: '' } })
const places = { A: [90, 50], B: [230, 50], C: [90, 160], D: [230, 160], E: [370, 105], F: [510, 105] }
const links = ['AB', 'AC', 'BD', 'CD', 'BE', 'DE', 'EF']
const runs = {
 bfs: { order: 'ABCDEF', tree: ['AB', 'AC', 'BD', 'BE', 'EF'] },
 dfs: { order: 'ABDCEF', tree: ['AB', 'BD', 'CD', 'DE', 'EF'] },
 iterative: { order: 'ACDEFB', tree: ['AC', 'CD', 'DE', 'EF', 'BE'] }
}
const nodes = computed(() => Object.entries(places).map(([id, [x, y]]) => {
 const run = runs[props.mode]
 if (!run) return { id, x, y, note: id === 'A' ? 'vertex' : undefined }
 return { id, x, y, state: id === 'A' ? 'hit' : 'done', note: run.order.indexOf(id) + 1, noteBelow: id === 'D' }
}))
const edges = computed(() => links.map(link => ({
 from: link[0], to: link[1],
 state: runs[props.mode] ? (runs[props.mode].tree.includes(link) ? 'accent' : 'muted') : ''
})))
const text = {
 '': { label: 'Anatomy', alt: 'A graph with six vertices, A to F. The edges are A to B, A to C, B to D, C to D, B to E, D to E and E to F.' },
 bfs: { label: 'Breadth-first search from A', alt: 'Breadth-first search from A visits A, then its neighbours B and C, then D and E, and F last. Vertices closer to A are always visited first.' },
 dfs: { label: 'Depth-first search from A', alt: 'Depth-first search from A goes A, B, D, C, runs out of new vertices at C, goes back to D, then visits E and F.' },
 iterative: { label: 'Depth-first search with a stack, from A', alt: 'Depth-first search with an explicit stack, starting at A. A pushes B and then C, so C comes off the stack first. The search visits A, C, D, E and F, and reaches B last, from E. The edges it follows are A to C, C to D, D to E, E to F and E to B.' }
}
</script>

<template>
 <Diagram :label="text[mode].label" :cost="mode ? 'O(V + E)' : ''" :width="600" :height="210" :alt="text[mode].alt">
  <DGraph :nodes="nodes" :edges="edges" />
  <text v-if="!mode" class="dg-note" x="440" y="92">edge</text>
 </Diagram>
</template>
