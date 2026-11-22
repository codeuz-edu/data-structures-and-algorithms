<script setup>
import Diagram from './Diagram.vue'
import DChain from './DChain.vue'
</script>

<template>
 <Diagram label="Search for 3" cost="O(n)" :width="640" :height="160" alt="The cursor starts at 12, moves to 7, then finds 3 on the third step. Node 9 is never visited.">
  <text class="dg-note" x="102" y="30">cur · step 1</text>
  <line class="dg-link is-muted" x1="102" y1="38" x2="102" y2="68" marker-end="url(#dg-arrow-muted)" />
  <text class="dg-note" x="226" y="30">cur · step 2</text>
  <line class="dg-link is-muted" x1="226" y1="38" x2="226" y2="68" marker-end="url(#dg-arrow-muted)" />
  <text class="dg-note is-accent" x="350" y="30" font-weight="600">cur · step 3 · match</text>
  <line class="dg-link is-accent" x1="350" y1="38" x2="350" y2="68" marker-end="url(#dg-arrow-accent)" />
  <DChain :x="60" :y="70" :values="[12, 7, 3, 9]" :states="['', '', 'hit']" />
  <text class="dg-note" x="474" y="134">not visited</text>
 </Diagram>
</template>
