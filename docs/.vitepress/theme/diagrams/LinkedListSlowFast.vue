<script setup>
// Slow and fast references on the singly linked list page. The chain starts at x = 40, so node i is
// centred at 82 + 124 * i. Where slow is after each step is marked above the nodes, fast below.
import Diagram from './Diagram.vue'
import DArrow from './DArrow.vue'
import DChain from './DChain.vue'
</script>

<template>
 <Diagram label="Find the middle" cost="O(n) time · O(1) space" :width="690" :height="156" alt="A list of five nodes holding 12, 7, 3, 9 and 5. slow starts at 12 and moves one node per step, to 7 and then to 3. fast starts at 12 and moves two nodes per step, to 3 and then to 5. Node 5 has no next node, so the loop stops with slow on the middle node, 3.">
  <text class="dg-note" x="82" y="28">slow · 0</text><DArrow :from="[82, 34]" :to="[82, 58]" kind="muted" />
  <text class="dg-note" x="206" y="28">slow · 1</text><DArrow :from="[206, 34]" :to="[206, 58]" kind="muted" />
  <text class="dg-note is-accent" x="330" y="28">slow · 2 · middle</text><DArrow :from="[330, 34]" :to="[330, 58]" kind="accent" />
  <DChain :x="40" :y="62" :values="[12, 7, 3, 9, 5]" :states="['', '', 'hit']" />
  <DArrow :from="[82, 126]" :to="[82, 102]" kind="muted" /><text class="dg-note" x="82" y="144">fast · 0</text>
  <DArrow :from="[330, 126]" :to="[330, 102]" kind="muted" /><text class="dg-note" x="330" y="144">fast · 1</text>
  <DArrow :from="[578, 126]" :to="[578, 102]" /><text class="dg-note" x="578" y="144">fast · 2 · next is None</text>
 </Diagram>
</template>
