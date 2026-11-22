<script setup>
// Merge sort on the input shared by the sorting pages: 35, 80, 15, 67, 80, 89, 29, 24, with the
// two 80s drawn 80a and 80b. The top half splits the list down to single items and the bottom
// half merges them back. The numbered circles give the order in which the recursive calls do
// the seven merges.
// Geometry: cells are 40 wide and 30 high. Row r has its top edge at 14 + 52 * r, and every row
// is centred on x = 340 with 28 units between its groups (row 3, the widest, runs from 82 to
// 598). Row labels end at x = 64. A line joins the centre of each half of a group to the centre
// of the group that half becomes on the next row. A merge number sits 14 left of its group.
import Diagram from './Diagram.vue'
import DCells from './DCells.vue'
import DStep from './DStep.vue'
const w = 40, h = 30, gap = 28, cx = 340, top = 14, step = 52
const rows = [
 [[35, '80a', 15, 67, '80b', 89, 29, 24]],
 [[35, '80a', 15, 67], ['80b', 89, 29, 24]],
 [[35, '80a'], [15, 67], ['80b', 89], [29, 24]],
 [[35], ['80a'], [15], [67], ['80b'], [89], [29], [24]],
 [[35, '80a'], [15, 67], ['80b', 89], [24, 29]],
 [[15, 35, 67, '80a'], [24, 29, '80b', 89]],
 [[15, 24, 29, 35, 67, '80a', '80b', 89]]
]
const labels = ['start', 'split', 'split', 'split', 'merge', 'merge', 'merge']
const steps = { 4: [1, 2, 4, 5], 5: [3, 6], 6: [7] }
const y = r => top + r * step
// Left edge of every group, row by row.
const lefts = rows.map(groups => {
 let x = cx - (groups.flat().length * w + (groups.length - 1) * gap) / 2
 return groups.map(group => { const at = x; x += group.length * w + gap; return at })
})
const middle = (r, i) => lefts[r][i] + rows[r][i].length * w / 2
const half = (r, i, side) => lefts[r][i] + (side + 0.5) * rows[r][i].length * w / 2
const links = []
for (let r = 0; r < 6; r++) {
 const parents = r < 3 ? rows[r] : rows[r + 1]
 parents.forEach((_, i) => [0, 1].forEach(side => {
  const child = 2 * i + side
  if (r < 3) links.push({ x1: half(r, i, side), y1: y(r) + h, x2: middle(r + 1, child), y2: y(r + 1) })
  else links.push({ x1: middle(r, child), y1: y(r) + h, x2: half(r + 1, i, side), y2: y(r + 1) })
 }))
}
</script>

<template>
 <Diagram label="Merge sort" cost="O(n log n)" :width="640" :height="370" alt="Merge sort on 35, 80a, 15, 67, 80b, 89, 29, 24. The top half of the picture splits the list in half three times: into two lists of four, four lists of two, and finally eight single items. The bottom half merges them back in pairs: 35 80a, 15 67, 80b 89 and 24 29; then 15 35 67 80a and 24 29 80b 89; then the sorted list 15, 24, 29, 35, 67, 80a, 80b, 89. Numbers 1 to 7 give the order of the merges: the whole left half is finished before the right half starts.">
  <line v-for="(link, i) in links" :key="`l${i}`" class="dg-link" v-bind="link" />
  <template v-for="(groups, r) in rows" :key="r">
   <text class="dg-note end" x="64" :y="y(r) + h / 2 + 4">{{ labels[r] }}</text>
   <DCells v-for="(group, i) in groups" :key="i" :x="lefts[r][i]" :y="y(r)" :w="w" :h="h" :values="group" />
   <DStep v-for="(n, i) in steps[r] || []" :key="`s${i}`" :x="lefts[r][i] - 14" :y="y(r) + h / 2" :n="n" />
  </template>
 </Diagram>
</template>
