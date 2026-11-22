<script setup>
import Diagram from './Diagram.vue'
import DArrow from './DArrow.vue'
import DChain from './DChain.vue'
import DStep from './DStep.vue'
</script>

<template>
 <Diagram label="Delete a node" cost="O(n) find · O(1) unlink" :width="640" :height="170" alt="Node 3 is removed by linking the node before it, 7, straight to the node after it, 9. Node 3 still refers to 9, but nothing in the list refers to node 3 any more.">
  <text class="dg-label is-accent" x="226" y="50">Prev</text>
  <text class="dg-label" x="350" y="50">Target</text>
  <DChain :x="60" :y="62" :values="[12, 7, 3, 9]" :states="['', '', 'ghost']" :links="['solid', 'removed', 'none']" />
  <DArrow :from="[378, 80]" :to="[430, 80]" kind="muted" />
  <path class="dg-link is-accent" d="M254 80V134H474V100" marker-end="url(#dg-arrow-accent)" />
  <DStep :x="364" :y="134" :n="2" />
 </Diagram>
</template>
