<script setup>
import Diagram from './Diagram.vue'
import DChain from './DChain.vue'
</script>

<template>
 <Diagram label="Reverse in place · mid-iteration" cost="O(n) time · O(1) space" :width="640" :height="200" alt="Halfway through a reversal. Node 12 now points to None and node 7 points back to 12. prev is at 7, cur is at 3 and nxt is at 9.">
  <text class="dg-note is-accent" x="178" y="34">already reversed</text>
  <DChain :x="60" :y="70" :values="[12, 7, 3, 9]" :links="['none', 'removed']" />
  <path class="dg-link is-accent" d="M254 88V44H102V68" marker-end="url(#dg-arrow-accent)" />
  <path class="dg-link is-accent" d="M130 88V140H98" marker-end="url(#dg-arrow-accent)" />
  <text class="dg-none" x="62" y="140">None</text>
  <line class="dg-link is-accent" x1="226" y1="158" x2="226" y2="110" marker-end="url(#dg-arrow-accent)" /><text class="dg-label is-accent" x="226" y="176">Prev</text>
  <line class="dg-link" x1="350" y1="158" x2="350" y2="110" marker-end="url(#dg-arrow)" /><text class="dg-label is-ink" x="350" y="176">Cur</text>
  <line class="dg-link is-muted" x1="474" y1="158" x2="474" y2="110" marker-end="url(#dg-arrow-muted)" /><text class="dg-label" x="474" y="176">Nxt</text>
 </Diagram>
</template>
