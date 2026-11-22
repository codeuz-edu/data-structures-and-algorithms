<script setup>
// The weighted graph shared by the Shortest Paths and Minimum Spanning Tree pages: six vertices
// and eight undirected edges, every weight different. `mode` picks what is highlighted:
//   ''        the plain graph
//   dijkstra  Dijkstra from A once A and B are settled, with the distance found so far for each vertex
//   paths     the finished run from A: an arrow from each vertex to its previous vertex, and its distance
//   spanning  one spanning tree that is not the cheapest (weight 26)
//   kruskal   Kruskal after three edges; the next edge it takes is drawn in ink
//   prim      Prim with A, B and C in the tree; the edges that leave the tree are drawn in ink
//   compare   two smaller copies side by side: the minimum spanning tree and the shortest paths from A
// Accent edges are the ones the mode is about, ink edges are in play, the rest are muted.
// Weights are drawn here rather than by DGraph, so a weight sits on the same side of its edge in
// every mode: 11 units from the middle of the edge, to the right when walking from the first
// vertex of the pair below to the second, which is the outside of the shape. Distances sit 6 units
// outside each circle: left of A, above B and D, below C and E, right of F.
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DGraph from './DGraph.vue'
const props = defineProps({ mode: { type: String, default: '' } })
const full = { A: [70, 120], B: [210, 50], C: [210, 190], D: [370, 50], E: [370, 190], F: [510, 120] }
const small = { A: [0, 44], B: [88, 0], C: [88, 88], D: [188, 0], E: [188, 88], F: [276, 44] }
const weights = [['B', 'A', 2], ['A', 'C', 5], ['B', 'C', 1], ['D', 'B', 6], ['C', 'E', 4], ['E', 'D', 3], ['F', 'D', 9], ['E', 'F', 8]]
const tags = { A: [47, 120, 'end'], B: [210, 20, 'middle'], C: [210, 220, 'middle'], D: [370, 20, 'middle'], E: [370, 220, 'middle'], F: [533, 120, 'start'] }
const name = (a, b) => [a, b].sort().join('')
const modes = {
 '': {
  label: 'Weighted graph', note: 'the number on each edge is its weight',
  alt: 'A weighted graph with six vertices, A to F. The edges and their weights are A-B 2, A-C 5, B-C 1, B-D 6, C-E 4, D-E 3, D-F 9 and E-F 8.'
 },
 dijkstra: {
  label: 'Dijkstra from A, after settling A and B', cost: 'O(V + E log V)',
  note: 'outlined: settled · number by a vertex: distance found so far',
  states: { A: 'done', B: 'done', E: 'muted', F: 'muted' },
  tags: { A: '0', B: '2', C: '5 → 3', D: '8', E: '∞', F: '∞' },
  accent: ['AB', 'BC', 'BD'], ink: ['AC'],
  alt: 'Dijkstra from A after A and B are settled. A has distance 0 and B has 2. C first got 5 from the edge A-C, then 3 through B. D has 8 through B. E and F are not reached yet. The edges A-B, B-C and B-D are highlighted as the best way found so far to B, C and D.'
 },
 paths: {
  label: 'Shortest paths from A',
  note: 'each arrow points to the previous vertex · number by a vertex: distance from A',
  states: { A: 'hit', B: 'done', C: 'done', D: 'done', E: 'done', F: 'done' },
  tags: { A: '0', B: '2', C: '3', D: '8', E: '7', F: '15' },
  accent: ['AB', 'BC', 'BD', 'CE', 'EF'], arrows: { AB: 'B', BC: 'C', BD: 'D', CE: 'E', EF: 'F' },
  alt: 'The finished shortest paths from A. Each vertex has an arrow to the vertex it was reached from: B to A, C to B, D to B, E to C and F to E. The distances are A 0, B 2, C 3, D 8, E 7 and F 15. The edges A-C, D-E and D-F are not used.'
 },
 spanning: {
  label: 'A spanning tree',
  note: '5 edges reach all 6 vertices with no cycle · weight 2 + 5 + 6 + 4 + 9 = 26',
  accent: ['AB', 'AC', 'BD', 'CE', 'DF'],
  alt: 'One spanning tree of the graph: the edges A-B, A-C, B-D, C-E and D-F. They reach all six vertices without a cycle, and their weights add up to 26.'
 },
 kruskal: {
  label: 'Kruskal after three edges', cost: 'O(E log V)',
  note: 'taken: B-C, A-B, D-E · next: C-E, which joins the two pieces',
  accent: ['BC', 'AB', 'DE'], ink: ['CE'],
  alt: 'Kruskal has taken the three lightest edges, B-C 1, A-B 2 and D-E 3. They form two pieces, A, B, C and D, E, while F is still alone. The next edge, C-E with weight 4, joins the two pieces.'
 },
 prim: {
  label: 'Prim with A, B and C in the tree', cost: 'O(E log V)',
  note: 'outlined: in the tree · dark edges leave the tree, and C-E (4) is the cheapest',
  states: { A: 'done', B: 'done', C: 'done' },
  accent: ['AB', 'BC'], ink: ['BD', 'CE'],
  alt: 'Prim has grown a tree from A that holds A, B and C, using the edges A-B and B-C. Two edges leave the tree: B-D with weight 6 and C-E with weight 4. C-E is cheaper, so E joins next. The edge A-C has both ends in the tree and is not used.'
 },
 compare: {
  label: 'Spanning tree and shortest paths',
  panels: [
   { x: 40, title: 'minimum spanning tree', note: 'weight 18 · A to D costs 10', accent: ['AB', 'BC', 'CE', 'DE', 'EF'] },
   { x: 384, title: 'shortest paths from A', note: 'weight 21 · A to D costs 8', accent: ['AB', 'BC', 'BD', 'CE', 'EF'] }
  ],
  alt: 'Two copies of the graph side by side. Left, the minimum spanning tree: A-B, B-C, C-E, D-E and E-F, weight 18, where the route from A to D is A, B, C, E, D and costs 10. Right, the shortest paths from A: A-B, B-C, B-D, C-E and E-F, weight 21, where the route from A to D is A, B, D and costs 8.'
 }
}
const view = computed(() => modes[props.mode])
const draw = (places, dx, dy, spec) => {
 const at = id => [places[id][0] + dx, places[id][1] + dy]
 const nodes = Object.keys(places).map(id => ({ id, x: at(id)[0], y: at(id)[1], state: spec.states?.[id] }))
 const edges = weights.map(([a, b]) => {
  const key = name(a, b), tail = spec.arrows?.[key]
  const state = !spec.accent ? '' : spec.accent.includes(key) ? 'accent' : spec.ink?.includes(key) ? '' : 'muted'
  return tail ? { from: tail, to: key.replace(tail, ''), state, directed: true } : { from: a, to: b, state }
 })
 const labels = weights.map(([a, b, weight]) => {
  const [x1, y1] = at(a), [x2, y2] = at(b), length = Math.hypot(x2 - x1, y2 - y1)
  return { text: weight, x: (x1 + x2) / 2 - (y2 - y1) / length * 11, y: (y1 + y2) / 2 + (x2 - x1) / length * 11 }
 })
 return { nodes, edges, labels }
}
const panels = computed(() => view.value.panels
 ? view.value.panels.map(panel => ({ ...panel, ...draw(small, panel.x, 70, panel) }))
 : [{ ...draw(full, 0, 0, view.value) }])
const size = computed(() => view.value.panels ? [700, 220] : [580, 256])
</script>

<template>
 <Diagram :label="view.label" :cost="view.cost || ''" :width="size[0]" :height="size[1]" :alt="view.alt">
  <template v-for="(panel, i) in panels" :key="i">
   <DGraph :nodes="panel.nodes" :edges="panel.edges" />
   <text v-for="(weight, j) in panel.labels" :key="j" class="dg-edge-label" :x="weight.x" :y="weight.y">{{ weight.text }}</text>
   <text v-if="panel.title" class="dg-label" :x="panel.x + 138" y="30">{{ panel.title }}</text>
   <text v-if="panel.note" class="dg-note" :x="panel.x + 138" y="206">{{ panel.note }}</text>
  </template>
  <text v-for="(text, id) in view.tags" :key="id" class="dg-tag" :x="tags[id][0]" :y="tags[id][1]" :text-anchor="tags[id][2]">{{ text }}</text>
  <text v-if="view.note" class="dg-note" x="290" y="246">{{ view.note }}</text>
 </Diagram>
</template>
