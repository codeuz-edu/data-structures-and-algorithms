<script setup>
import Diagram from './Diagram.vue'
import DChain from './DChain.vue'
</script>

<template>
 <Diagram label="Anatomy" :width="676" :height="130" alt="A linked list of four nodes holding 12, 7, 3 and 9. Each node has a value and a next reference. HEAD refers to the first node and TAIL to the last node, whose next is None.">
  <text class="dg-name" x="50" y="78">HEAD</text>
  <line class="dg-link is-accent" x1="76" y1="78" x2="118" y2="78" marker-end="url(#dg-arrow-accent)" />
  <text class="dg-name" x="534" y="22">TAIL</text>
  <line class="dg-link is-accent" x1="534" y1="32" x2="534" y2="57" marker-end="url(#dg-arrow-accent)" />
  <DChain :x="120" :y="60" :values="[12, 7, 3, 9]" />
  <text class="dg-label is-accent" x="146" y="42">Value</text><line class="dg-link is-accent" x1="146" y1="48" x2="146" y2="57" />
  <text class="dg-label is-accent" x="190" y="42">Next</text><line class="dg-link is-accent" x1="190" y1="48" x2="190" y2="57" />
  <text class="dg-note" x="162" y="116">first node</text>
  <text class="dg-note" x="534" y="116">last node · next = None</text>
 </Diagram>
</template>
