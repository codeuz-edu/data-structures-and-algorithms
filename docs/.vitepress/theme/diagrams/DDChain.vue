<script setup>
// A row of doubly linked nodes. Each node has three cells: prev, data, next.
//   states: per node: new, hit or ghost
//   links:  per gap (between node i and node i + 1): solid (default), accent, removed or none
// Node i is drawn at x + i * 150 and is 100 wide. Its next dot is at (+89, +12) and its prev dot
// at (+11, +24). The forward links run along the upper line and the backward links along the lower.
defineProps({
 x: Number, y: Number,
 values: { type: Array, required: true },
 states: { type: Array, default: () => [] },
 links: { type: Array, default: () => [] },
 ends: { type: Boolean, default: true }
})
const PITCH = 150
</script>

<template>
 <g>
  <template v-if="ends">
   <text class="dg-none end" :x="x - 34" :y="y + 24">None</text>
   <line class="dg-link" :x1="x + 11" :y1="y + 24" :x2="x - 28" :y2="y + 24" marker-end="url(#dg-arrow)" />
   <line class="dg-link" :x1="x + (values.length - 1) * PITCH + 89" :y1="y + 12" :x2="x + (values.length - 1) * PITCH + 128" :y2="y + 12" marker-end="url(#dg-arrow)" />
   <text class="dg-none" :x="x + (values.length - 1) * PITCH + 134" :y="y + 12">None</text>
  </template>
  <template v-for="(value, i) in values" :key="i">
   <template v-if="i < values.length - 1 && links[i] !== 'none'">
    <template v-if="links[i] === 'removed'">
     <line class="dg-link is-removed" :x1="x + i * PITCH + 104" :y1="y + 12" :x2="x + (i + 1) * PITCH - 4" :y2="y + 12" />
     <line class="dg-link is-removed" :x1="x + i * PITCH + 104" :y1="y + 24" :x2="x + (i + 1) * PITCH - 4" :y2="y + 24" />
    </template>
    <template v-else>
     <line :class="['dg-link', links[i] === 'accent' && 'is-accent']" :x1="x + i * PITCH + 89" :y1="y + 12" :x2="x + (i + 1) * PITCH - 2" :y2="y + 12" :marker-end="`url(#dg-arrow${links[i] === 'accent' ? '-accent' : ''})`" />
     <line :class="['dg-link', links[i] === 'accent' && 'is-accent']" :x1="x + (i + 1) * PITCH + 11" :y1="y + 24" :x2="x + i * PITCH + 102" :y2="y + 24" :marker-end="`url(#dg-arrow${links[i] === 'accent' ? '-accent' : ''})`" />
    </template>
   </template>
   <g :class="states[i] && `is-${states[i]}`" :transform="`translate(${x + i * PITCH} ${y})`">
    <rect class="dg-box" width="100" height="36" />
    <line class="dg-split" x1="22" y1="0" x2="22" y2="36" /><line class="dg-split" x1="78" y1="0" x2="78" y2="36" />
    <text class="dg-value" x="50" y="18">{{ value }}</text>
    <circle class="dg-dot" cx="11" cy="24" r="3" /><circle class="dg-dot" cx="89" cy="12" r="3" />
   </g>
  </template>
 </g>
</template>
