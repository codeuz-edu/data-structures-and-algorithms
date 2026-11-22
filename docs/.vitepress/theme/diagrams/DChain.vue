<script setup>
// A row of nodes joined by their next pointers, ending at None.
//   values: what each node holds
//   states: per node, '' | 'new' | 'hit' | 'ghost'
//   links:  per node, how the link leaving it is drawn: 'solid' (default), 'removed' or 'none'
// Node i is drawn at x + i * 124, so the pages can place labels and extra arrows by hand.
import DNode from './DNode.vue'
defineProps({
 x: Number, y: Number,
 values: { type: Array, required: true },
 states: { type: Array, default: () => [] },
 links: { type: Array, default: () => [] }
})
const PITCH = 124
</script>

<template>
 <g>
  <template v-for="(value, i) in values" :key="i">
   <template v-if="(links[i] || 'solid') !== 'none'">
    <line v-if="links[i] === 'removed'" class="dg-link is-removed" :x1="x + i * PITCH + 76" :y1="y + 18" :x2="x + (i + 1) * PITCH - (i === values.length - 1 ? 12 : 2)" :y2="y + 18" />
    <line v-else class="dg-link" :x1="x + i * PITCH + 70" :y1="y + 18" :x2="x + (i + 1) * PITCH - (i === values.length - 1 ? 12 : 2)" :y2="y + 18" marker-end="url(#dg-arrow)" />
   </template>
   <DNode :x="x + i * PITCH" :y="y" :value="value" :state="states[i]" />
  </template>
  <text class="dg-none" :x="x + values.length * PITCH - 6" :y="y + 18">None</text>
 </g>
</template>
