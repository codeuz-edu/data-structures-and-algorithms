<script setup>
// The standard picture of growth rates: steps against input size for the common Big-O classes.
// Each curve is sampled and drawn as a polyline, and is cut off where it leaves the top of the plot.
// Moving over the plot shows the exact step counts for that n.
import { ref, computed } from 'vue'
import Diagram from './Diagram.vue'
const WIDTH = 680, HEIGHT = 434
const MAX_N = 20, MAX_STEPS = 60
const LEFT = 64, RIGHT = 616, TOP = 70, BOTTOM = 362
const x = n => LEFT + (n / MAX_N) * (RIGHT - LEFT)
const y = steps => BOTTOM - (steps / MAX_STEPS) * (BOTTOM - TOP)
// Colours are fixed per class (--gc-1 to --gc-6 below). `legendX` places the class in the key.
const classes = [
 { name: 'O(1)', f: () => 1, legendX: 64 },
 { name: 'O(log n)', f: n => Math.log2(n), legendX: 137 },
 { name: 'O(n)', f: n => n, legendX: 239 },
 { name: 'O(n log n)', f: n => n * Math.log2(n), legendX: 312 },
 { name: 'O(n²)', f: n => n * n, legendX: 428 },
 { name: 'O(2ⁿ)', f: n => 2 ** n, legendX: 508 }
]
const curves = classes.map((item, i) => {
 const points = []
 let end = null
 for (let n = 1; n <= MAX_N + 0.001; n += 0.05) {
  const steps = item.f(n)
  if (steps > MAX_STEPS) break
  points.push(`${x(n).toFixed(1)},${y(steps).toFixed(1)}`)
  end = [n, steps]
 }
 const cut = end[0] < MAX_N - 0.2
 // The four classes that end well apart are also named at the end of their line.
 const direct = i >= 2
 return { ...item, color: `var(--gc-${i + 1})`, points: points.join(' '), cut, direct, lx: cut ? x(end[0]) : RIGHT + 8, ly: cut ? TOP - 10 : y(end[1]) }
})
const ticksN = [0, 5, 10, 15, 20], ticksSteps = [0, 20, 40, 60]

const hover = ref(null)
function move(event) {
 const box = event.currentTarget.ownerSVGElement.getBoundingClientRect()
 const px = (event.clientX - box.left) * WIDTH / box.width
 hover.value = Math.min(MAX_N, Math.max(1, Math.round((px - LEFT) / (RIGHT - LEFT) * MAX_N)))
}
const readout = computed(() => {
 if (hover.value === null) return null
 const n = hover.value
 const rows = curves.map(curve => {
  const steps = curve.f(n)
  return { name: curve.name, color: curve.color, steps, text: Math.round(steps).toLocaleString('en-US'), inside: steps <= MAX_STEPS }
 })
 // The box sits to the right of the crosshair, or to the left when there is no room.
 const boxX = x(n) + 12 + 164 > RIGHT ? x(n) - 12 - 164 : x(n) + 12
 return { n, rows, cx: x(n), boxX }
})
</script>

<template>
 <Diagram label="How the step count grows" :width="WIDTH" :height="HEIGHT" alt="A line chart of steps against input size n, from 1 to 20, with one line per growth rate. O(1) is flat along the bottom. O(log n) rises slowly to about 4 steps at n = 20. O(n) is a straight line reaching 20 steps. O(n log n) bends upward and passes 60 steps near n = 14. O(n squared) passes 60 steps before n = 8, and O(2 to the n) before n = 6.">
  <g v-for="curve in curves" :key="`k${curve.name}`">
   <line class="gc-line" :stroke="curve.color" :x1="curve.legendX" y1="24" :x2="curve.legendX + 18" y2="24" />
   <text class="dg-code start" :x="curve.legendX + 24" y="24">{{ curve.name }}</text>
  </g>
  <line v-for="t in ticksSteps" :key="`h${t}`" class="dg-grid" :x1="LEFT" :y1="y(t)" :x2="RIGHT" :y2="y(t)" />
  <text v-for="t in ticksSteps" :key="`s${t}`" class="dg-index end" :x="LEFT - 10" :y="y(t)">{{ t }}</text>
  <text v-for="t in ticksN" :key="`n${t}`" class="dg-index" :x="x(t)" :y="BOTTOM + 16">{{ t }}</text>
  <line class="dg-link is-muted" :x1="LEFT" :y1="TOP" :x2="LEFT" :y2="BOTTOM" />
  <line class="dg-link is-muted" :x1="LEFT" :y1="BOTTOM" :x2="RIGHT" :y2="BOTTOM" />
  <text class="dg-note" :x="(LEFT + RIGHT) / 2" :y="BOTTOM + 42">input size n</text>
  <text class="dg-note" x="20" :y="(TOP + BOTTOM) / 2" :transform="`rotate(-90 20 ${(TOP + BOTTOM) / 2})`">steps</text>
  <template v-for="curve in curves" :key="curve.name">
   <polyline class="gc-line" :stroke="curve.color" :points="curve.points" />
   <text v-if="curve.direct" :class="['dg-code', curve.cut ? 'middle' : 'start']" :x="curve.lx" :y="curve.ly">{{ curve.name }}</text>
  </template>
  <g v-if="readout" class="gc-readout">
   <line class="dg-link is-muted" :x1="readout.cx" :y1="TOP" :x2="readout.cx" :y2="BOTTOM" />
   <template v-for="row in readout.rows" :key="`d${row.name}`">
    <circle v-if="row.inside" class="gc-dot" :fill="row.color" :cx="readout.cx" :cy="y(row.steps)" r="4.5" />
   </template>
   <rect class="gc-box" :x="readout.boxX" :y="TOP + 8" width="164" height="142" rx="4" />
   <text class="dg-code start gc-strong" :x="readout.boxX + 12" :y="TOP + 26">n = {{ readout.n }}</text>
   <g v-for="(row, i) in readout.rows" :key="`r${row.name}`">
    <line class="gc-line" :stroke="row.color" :x1="readout.boxX + 12" :y1="TOP + 46 + 18 * i" :x2="readout.boxX + 26" :y2="TOP + 46 + 18 * i" />
    <text class="dg-code start" :x="readout.boxX + 32" :y="TOP + 46 + 18 * i">{{ row.name }}</text>
    <text class="dg-code end gc-strong" :x="readout.boxX + 152" :y="TOP + 46 + 18 * i">{{ row.text }}</text>
   </g>
  </g>
  <rect class="gc-hit" :x="LEFT" :y="TOP" :width="RIGHT - LEFT" :height="BOTTOM - TOP" @pointermove="move" @pointerleave="hover = null" />
 </Diagram>
</template>

<style>
/* Six line colours, checked for colour-blind separation on both diagram surfaces. */
:root{--gc-1:#2a78d6;--gc-2:#eb6834;--gc-3:#1baf7a;--gc-4:#eda100;--gc-5:#e87ba4;--gc-6:#008300}
.dark{--gc-1:#3987e5;--gc-2:#d95926;--gc-3:#199e70;--gc-4:#c98500;--gc-5:#d55181;--gc-6:#0ca30c}
.gc-line{fill:none;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.gc-dot{stroke:var(--dg-surface);stroke-width:2}
.gc-box{fill:var(--vp-c-bg);stroke:var(--dg-line);stroke-width:1}
.gc-strong{font-weight:700}
.gc-hit{fill:transparent;cursor:crosshair}
.gc-readout{pointer-events:none}
</style>
