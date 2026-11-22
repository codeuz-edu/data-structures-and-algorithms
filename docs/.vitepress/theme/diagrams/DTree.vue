<script setup>
// A binary tree, given level by level the way a heap is stored: the children of values[i] are
// values[2i + 1] and values[2i + 2]. Use null for a missing node.
//   states: per node, by index: new, hit, done, ghost or muted
//   edges:  how the edge above a node is drawn, by the child's index: accent, muted, removed or none
//   notes:  a short label next to a node, by index (a visit order, for example); it is drawn
//           to the left of a left child and to the right of a right child or the root
// The root is centred at (x, y). A node at depth d is at y + d * gap, and the nodes of one level
// are spread evenly over `width`.
const props = defineProps({
 x: Number, y: Number, width: { type: Number, default: 360 },
 values: { type: Array, required: true },
 states: { type: Object, default: () => ({}) },
 edges: { type: Object, default: () => ({}) },
 notes: { type: Object, default: () => ({}) },
 gap: { type: Number, default: 60 }, r: { type: Number, default: 17 }
})
const at = i => {
 const depth = Math.floor(Math.log2(i + 1)), position = i + 1 - 2 ** depth
 return [props.x + props.width * ((position + 0.5) / 2 ** depth - 0.5), props.y + depth * props.gap]
}
const edge = i => {
 const [x1, y1] = at((i - 1) >> 1), [x2, y2] = at(i), length = Math.hypot(x2 - x1, y2 - y1)
 const ux = (x2 - x1) / length, uy = (y2 - y1) / length
 return { x1: x1 + ux * props.r, y1: y1 + uy * props.r, x2: x2 - ux * props.r, y2: y2 - uy * props.r }
}
// A note sits beside its node on the side away from its parent's edge: left of a left child,
// right of a right child and of the root.
const left = i => i % 2 === 1
const has = i => props.values[i] !== null && props.values[i] !== undefined
</script>

<template>
 <g>
  <template v-for="(value, i) in values" :key="`e${i}`">
   <line v-if="i > 0 && has(i) && has((i - 1) >> 1) && edges[i] !== 'none'" :class="['dg-link', edges[i] && `is-${edges[i]}`]" v-bind="edge(i)" />
  </template>
  <template v-for="(value, i) in values" :key="`n${i}`">
   <g v-if="has(i)" :class="states[i] && `is-${states[i]}`">
    <circle class="dg-box" :cx="at(i)[0]" :cy="at(i)[1]" :r="r" />
    <text class="dg-value" :x="at(i)[0]" :y="at(i)[1]">{{ value }}</text>
    <text v-if="notes[i] !== undefined" :class="['dg-tag', left(i) && 'end']" :x="at(i)[0] + (left(i) ? -r - 3 : r + 3)" :y="at(i)[1] - r + 3">{{ notes[i] }}</text>
   </g>
  </template>
 </g>
</template>
