<script setup>
// pop_front on the singly linked list page. Same layout as LinkedListInsertHead: the HEAD box on
// the left, the chain from x = 170, so node i is centred at 212 + 124 * i.
import Diagram from './Diagram.vue'
import DArrow from './DArrow.vue'
import DChain from './DChain.vue'
</script>

<template>
 <Diagram label="Remove the head" cost="O(1)" :width="610" :height="156" alt="A list holding 12, 7 and 3. HEAD moves from 12 to 7. Node 12 has left the list and its value is returned. It still refers to 7, but nothing in the list refers to it.">
  <rect class="dg-box" x="40" y="90" width="56" height="36" /><text class="dg-name" x="68" y="108">HEAD</text>
  <line class="dg-link is-removed" x1="100" y1="108" x2="166" y2="108" />
  <DChain :x="170" :y="90" :values="[12, 7, 3]" :states="['ghost']" :links="['none']" />
  <DArrow :from="[240, 108]" :to="[292, 108]" kind="muted" />
  <DArrow :from="[68, 90]" :via="[[68, 50], [336, 50]]" :to="[336, 86]" kind="accent" />
  <text class="dg-note" x="212" y="146">returned</text>
 </Diagram>
</template>
