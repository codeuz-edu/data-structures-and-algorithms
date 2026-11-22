<script setup>
// The dinner tasks used on the Topological Sort page. An arrow goes from a task to a task that
// has to wait for it. `mode`:
//   ''        the plain graph
//   indegree  the number of arrows coming into each task, at its top right; tasks with none are filled
//   order     the tasks in one row, in the order Kahn's algorithm gives; every arrow points right.
//             Arrows between tasks that are not next to each other run above or below the row at
//             right angles, each on its own level, so none of them cross.
//   cycle     an extra arrow from sauce back to chop closes a cycle. The tasks Kahn's algorithm
//             takes are outlined; the others show the arrows still coming in.
// Boxes are 72 x 32, placed by their centres. A straight arrow runs between the two centres and
// is cut off at the edges of the boxes. A number sits 4 units right of a box and 6 above it.
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DBox from './DBox.vue'
import DArrow from './DArrow.vue'
const props = defineProps({ mode: { type: String, default: '' } })
const places = { shop: [70, 60], boil: [70, 160], chop: [230, 60], pasta: [230, 160], sauce: [390, 60], serve: [550, 110] }
const row = { shop: [60, 100], boil: [170, 100], chop: [280, 100], pasta: [390, 100], sauce: [500, 100], serve: [610, 100] }
const links = [['shop', 'chop'], ['shop', 'pasta'], ['boil', 'pasta'], ['chop', 'sauce'], ['pasta', 'serve'], ['sauce', 'serve']]
const straight = (a, b) => {
 const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy)
 const t = Math.min(36 / Math.abs(dx), 16 / Math.abs(dy))
 return { from: [a[0] + dx * t, a[1] + dy * t], to: [b[0] - dx * t - dx / length * 1.5, b[1] - dy * t - dy / length * 1.5] }
}
// In the row, in the order of `links`.
const routes = [
 { from: [60, 84], via: [[60, 62], [268, 62]], to: [268, 82.5] },
 { from: [60, 116], via: [[60, 164], [390, 164]], to: [390, 117.5] },
 { from: [170, 116], via: [[170, 136], [378, 136]], to: [378, 117.5] },
 { from: [292, 84], via: [[292, 46], [500, 46]], to: [500, 82.5] },
 { from: [402, 116], via: [[402, 148], [610, 148]], to: [610, 117.5] },
 { from: [536, 100], to: [572.5, 100] }
]
const modes = {
 '': {
  label: 'Tasks for dinner', note: 'an arrow points from a task to a task that waits for it',
  alt: 'Six tasks with arrows. shop points to chop and pasta. boil points to pasta. chop points to sauce. pasta and sauce both point to serve.'
 },
 indegree: {
  label: 'Arrows coming in', note: 'number: arrows coming in · filled: waits for nothing',
  numbers: { shop: 0, boil: 0, chop: 1, pasta: 2, sauce: 1, serve: 2 }, states: { shop: 'hit', boil: 'hit' },
  alt: 'The same six tasks, each with the number of arrows coming into it: shop 0, boil 0, chop 1, pasta 2, sauce 1, serve 2. shop and boil wait for nothing, so they can start.'
 },
 order: {
  label: 'A topological order', note: 'every arrow points to the right',
  alt: 'The six tasks in one row: shop, boil, chop, pasta, sauce, serve. Every arrow goes from a task to one further right: shop to chop and pasta, boil to pasta, chop to sauce, pasta to serve and sauce to serve.'
 },
 cycle: {
  label: 'A cycle', note: 'outlined: taken by Kahn\'s algorithm · number: arrows still coming in',
  numbers: { chop: 1, sauce: 1, serve: 1 }, states: { shop: 'done', boil: 'done', pasta: 'done' },
  accent: [['chop', 'sauce']],
  alt: 'The dinner tasks with one extra arrow, from sauce back to chop, so chop and sauce wait for each other. Kahn\'s algorithm takes shop, boil and pasta and then stops. chop, sauce and serve each still have one arrow coming in.'
 }
}
const view = computed(() => modes[props.mode])
const at = computed(() => props.mode === 'order' ? row : places)
const arrows = computed(() => links.map(([a, b], i) => ({
 ...(props.mode === 'order' ? routes[i] : straight(places[a], places[b])),
 kind: view.value.accent?.some(([x, y]) => x === a && y === b) ? 'accent' : ''
})))
</script>

<template>
 <Diagram :label="view.label" :width="mode === 'order' ? 680 : 620" :height="mode === 'order' ? 204 : 216" :alt="view.alt">
  <DArrow v-for="(arrow, i) in arrows" :key="i" :from="arrow.from" :via="arrow.via" :to="arrow.to" :kind="arrow.kind" />
  <DArrow v-if="mode === 'cycle'" :from="[380, 44]" :via="[[380, 24], [240, 24]]" :to="[240, 42.5]" kind="accent" />
  <DBox v-for="(place, task) in at" :key="task" :x="place[0] - 36" :y="place[1] - 16" :w="72" :h="32" :text="task" :state="view.states?.[task] || ''" small />
  <text v-for="(count, task) in view.numbers" :key="task" class="dg-tag" :x="places[task][0] + 40" :y="places[task][1] - 22">{{ count }}</text>
  <text class="dg-note" :x="mode === 'order' ? 340 : 310" :y="mode === 'order' ? 192 : 204">{{ view.note }}</text>
 </Diagram>
</template>
