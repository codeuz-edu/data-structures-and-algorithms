<script setup>
// push_back on the singly linked list page. The chain starts at x = 120, so node i is centred at
// 162 + 124 * i and its next dot is at (190 + 124 * i, 88). TAIL moves from node 2 to node 3.
import Diagram from './Diagram.vue'
import DArrow from './DArrow.vue'
import DChain from './DChain.vue'
import DStep from './DStep.vue'
</script>

<template>
 <Diagram label="Insert at the tail" cost="O(1)" :width="650" :height="124" alt="A list holding 12, 7 and 3, with HEAD on 12 and TAIL on 3. Step 1 links 3 to a new node 5. Step 2 moves TAIL from 3 to 5. No other node is visited.">
  <text class="dg-name" x="50" y="88">HEAD</text>
  <DArrow :from="[76, 88]" :to="[118, 88]" />
  <DChain :x="120" :y="70" :values="[12, 7, 3, 5]" :states="['', '', '', 'new']" :links="['solid', 'solid', 'none']" />
  <DArrow :from="[438, 88]" :to="[490, 88]" kind="accent" />
  <DStep :x="464" :y="88" :n="1" />
  <text class="dg-name" x="410" y="22">TAIL</text>
  <DArrow :from="[410, 32]" :to="[410, 67]" kind="removed" />
  <DArrow :from="[432, 22]" :via="[[534, 22]]" :to="[534, 67]" kind="accent" />
  <DStep :x="534" :y="44" :n="2" />
 </Diagram>
</template>
