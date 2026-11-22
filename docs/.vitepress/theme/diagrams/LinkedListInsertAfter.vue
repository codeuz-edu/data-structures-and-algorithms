<script setup>
import Diagram from './Diagram.vue'
import DChain from './DChain.vue'
import DNode from './DNode.vue'
import DStep from './DStep.vue'
</script>

<template>
 <Diagram label="Insert after a node" cost="O(1) given the node" :width="640" :height="190" alt="A new node 4 is placed after node 7, between 7 and 3. First 4 is linked to 3, then 7 is linked to 4, and the old link from 7 to 3 goes away.">
  <DNode :x="246" :y="20" :value="4" state="new" />
  <DChain :x="60" :y="120" :values="[12, 7, 3, 9]" :links="['solid', 'removed']" />
  <path class="dg-link is-accent" d="M316 38H350V118" marker-end="url(#dg-arrow-accent)" />
  <DStep :x="350" :y="80" :n="1" />
  <path class="dg-link is-accent" d="M254 138V58" marker-end="url(#dg-arrow-accent)" />
  <DStep :x="254" :y="92" :n="2" />
  <text class="dg-label is-accent" x="226" y="178">node</text>
 </Diagram>
</template>
