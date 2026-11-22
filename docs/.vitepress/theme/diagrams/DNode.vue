<script setup>
// One list node: a data cell and a pointer cell with a dot. The dot sits at (x + 70, y + 18),
// which is where a link leaving this node starts. `state` is new, hit or ghost.
defineProps({ x: Number, y: Number, value: [String, Number], state: { type: String, default: '' } })
</script>

<template>
 <g :class="['dg-node', state && `is-${state}`]" :transform="`translate(${x} ${y})`">
  <rect class="dg-box" width="84" height="36" />
  <line class="dg-split" x1="56" y1="0" x2="56" y2="36" />
  <text class="dg-value" x="28" y="18">{{ value }}</text>
  <circle class="dg-dot" cx="70" cy="18" r="3" />
 </g>
</template>
