<script setup>
// Kahn's algorithm on the dinner tasks of DagTasks.vue, one row per step. Each row shows the task
// taken from the queue, the arrows still coming into every task after the step (filled = taken in
// this step, dashed = taken before), and the queue after the step.
// Column headings sit on y = 18. Rows are 38 apart; the cells are 56 x 30 from x = 92.
import Diagram from './Diagram.vue'
import DCells from './DCells.vue'
import DStep from './DStep.vue'
const tasks = ['shop', 'boil', 'chop', 'pasta', 'sauce', 'serve']
const rows = [
 { taken: '', counts: [0, 0, 1, 2, 1, 2], queue: 'shop, boil' },
 { taken: 'shop', counts: [0, 0, 0, 1, 1, 2], queue: 'boil, chop' },
 { taken: 'boil', counts: [0, 0, 0, 0, 1, 2], queue: 'chop, pasta' },
 { taken: 'chop', counts: [0, 0, 0, 0, 0, 2], queue: 'pasta, sauce' },
 { taken: 'pasta', counts: [0, 0, 0, 0, 0, 1], queue: 'sauce' },
 { taken: 'sauce', counts: [0, 0, 0, 0, 0, 0], queue: 'serve' },
 { taken: 'serve', counts: [0, 0, 0, 0, 0, 0], queue: 'empty' }
]
// Row i has taken the first i tasks of `tasks`, which is also the order Kahn's algorithm gives.
const states = i => Object.fromEntries(tasks.slice(0, i).map((task, j) => [j, j === i - 1 ? 'hit' : 'ghost']))
const alt = 'Kahn\'s algorithm step by step. At the start the counts of arrows coming in are shop 0, boil 0, chop 1, pasta 2, sauce 1, serve 2, and the queue holds shop and boil. Step 1 takes shop: chop drops to 0 and joins the queue, pasta drops to 1. Step 2 takes boil: pasta drops to 0. Step 3 takes chop: sauce drops to 0. Step 4 takes pasta: serve drops to 1. Step 5 takes sauce: serve drops to 0. Step 6 takes serve and the queue is empty.'
</script>

<template>
 <Diagram label="Kahn's algorithm, one step per row" cost="O(V + E)" :width="560" :height="326" :alt="alt">
  <text class="dg-label start" x="34" y="18">taken</text>
  <text v-for="(task, j) in tasks" :key="task" class="dg-label" :x="120 + 56 * j" y="18">{{ task }}</text>
  <text class="dg-label start" x="446" y="18">queue after</text>
  <template v-for="(row, i) in rows" :key="i">
   <DStep v-if="i > 0" :x="16" :y="45 + 38 * i" :n="i" />
   <text v-if="i > 0" class="dg-code start" x="34" :y="45 + 38 * i">{{ row.taken }}</text>
   <text v-else class="dg-note start" x="34" y="49">start</text>
   <DCells :x="92" :y="30 + 38 * i" :w="56" :h="30" :values="row.counts" :states="states(i)" />
   <text class="dg-code start" x="446" :y="45 + 38 * i">{{ row.queue }}</text>
  </template>
  <text class="dg-note" x="280" y="314">number: arrows still coming in · filled: taken in this step · dashed: taken before</text>
 </Diagram>
</template>
