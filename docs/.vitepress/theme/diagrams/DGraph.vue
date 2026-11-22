<script setup>
// Circles joined by lines, each placed by hand. Used for graphs, tries and union-find forests.
//   nodes: { id, x, y, label, state, note, noteBelow }   (label defaults to the id; the note sits
//          at the top right of the node, or at the bottom right with noteBelow)
//   edges: { from, to, state, label, directed }
// `directed` on the diagram gives every edge an arrowhead.
import { computed } from 'vue'
const props = defineProps({ nodes: { type: Array, required: true }, edges: { type: Array, default: () => [] }, directed: Boolean, r: { type: Number, default: 17 } })
const lines = computed(() => props.edges.map(edge => {
 const a = props.nodes.find(node => node.id === edge.from), b = props.nodes.find(node => node.id === edge.to)
 const length = Math.hypot(b.x - a.x, b.y - a.y) || 1, ux = (b.x - a.x) / length, uy = (b.y - a.y) / length
 const arrow = edge.directed ?? props.directed
 const kind = edge.state === 'accent' || edge.state === 'muted' ? `-${edge.state}` : ''
 return {
  state: edge.state, label: edge.label,
  marker: arrow && edge.state !== 'removed' ? `url(#dg-arrow${kind})` : null,
  x1: a.x + ux * props.r, y1: a.y + uy * props.r, x2: b.x - ux * (props.r + (arrow ? 2 : 0)), y2: b.y - uy * (props.r + (arrow ? 2 : 0)),
  lx: (a.x + b.x) / 2 - uy * 11, ly: (a.y + b.y) / 2 + ux * 11
 }
}))
</script>

<template>
 <g>
  <template v-for="(line, i) in lines" :key="`e${i}`">
   <line :class="['dg-link', line.state && `is-${line.state}`]" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" :marker-end="line.marker" />
   <text v-if="line.label !== undefined" class="dg-edge-label" :x="line.lx" :y="line.ly">{{ line.label }}</text>
  </template>
  <g v-for="node in nodes" :key="node.id" :class="node.state && `is-${node.state}`">
   <circle class="dg-box" :cx="node.x" :cy="node.y" :r="r" />
   <text class="dg-value" :x="node.x" :y="node.y">{{ node.label ?? node.id }}</text>
   <text v-if="node.note !== undefined" class="dg-tag" :x="node.x + r + 3" :y="node.y + (node.noteBelow ? r - 1 : -r + 3)">{{ node.note }}</text>
  </g>
 </g>
</template>
