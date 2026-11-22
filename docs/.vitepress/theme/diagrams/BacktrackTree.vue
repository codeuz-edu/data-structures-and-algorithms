<script setup>
// The two search trees on the Backtracking page, for the items 1, 2, 3. Each box shows the list
// `chosen` at that point of the search, and the filled leaves are the answers.
//   mode subsets:      each level decides one item: the left branch takes it, the right branch
//                      skips it. The path take 1, skip 2, take 3 is outlined, with accent edges.
//   mode permutations: each level appends one of the items not used yet.
// Leaves are spread evenly over `span` around `mid`, and a parent sits midway between its first
// and last child. The box at depth d is w by h with its top edge at top + d * gap. The note at
// x = 628 beside each level counts the boxes on it.
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DBox from './DBox.vue'
const props = defineProps({ mode: { type: String, default: 'subsets' } })
const items = [1, 2, 3]
const subsets = (chosen, i) => i === items.length ? { chosen } : { chosen, children: [subsets([...chosen, items[i]], i + 1), subsets(chosen, i + 1)] }
const orderings = chosen => chosen.length === items.length ? { chosen } : { chosen, children: items.filter(item => !chosen.includes(item)).map(item => orderings([...chosen, item])) }
const settings = {
 subsets: {
  tree: subsets([], 0), path: [0, 1, 0], mid: 320, span: 600, top: 40, gap: 58, w: 64, h: 28, height: 282,
  levels: ['2', '2 × 2 = 4', '2 × 2 × 2 = 8'],
  label: 'Subsets of [1, 2, 3]', cost: 'O(n · 2ⁿ)',
  alt: 'The search tree for the subsets of [1, 2, 3]. The root is the empty list. Each level decides one item: the left branch takes it and the right branch skips it, so the levels have 2, 4 and 8 boxes. The 8 leaves, from left to right, are [1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3] and []. The path take 1, skip 2, take 3 is highlighted and ends at [1, 3].'
 },
 permutations: {
  tree: orderings([]), path: [], mid: 330, span: 600, top: 24, gap: 56, w: 72, h: 28, height: 236,
  levels: ['3', '3 × 2 = 6', '3 × 2 × 1 = 6'],
  label: 'Orderings of [1, 2, 3]', cost: 'O(n · n!)',
  alt: 'The search tree for the orderings of [1, 2, 3]. The root is the empty list. It has three children, [1], [2] and [3]. Each of those has two children, one for each item not used yet, and each of those has one child. The 6 leaves are [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2] and [3, 2, 1].'
 }
}
const s = computed(() => settings[props.mode])
const drawing = computed(() => {
 const { tree, path, mid, span, top, gap, w, h } = s.value
 const boxes = [], links = []
 const leaves = node => node.children ? node.children.reduce((sum, child) => sum + leaves(child), 0) : 1
 const slot = span / leaves(tree)
 let next = 0
 const place = (node, depth, onPath) => {
  const y = top + depth * gap
  let x
  if (node.children) {
   const onChild = i => onPath && path[depth] === i
   const xs = node.children.map((child, i) => place(child, depth + 1, onChild(i)))
   x = (xs[0] + xs[xs.length - 1]) / 2
   xs.forEach((childX, i) => links.push({ x1: x, y1: y + h, x2: childX, y2: y + gap, accent: onChild(i) }))
  } else {
   x = mid - span / 2 + (next++ + 0.5) * slot
  }
  boxes.push({ x: x - w / 2, y, text: `[${node.chosen.join(', ')}]`, state: node.children ? (onPath ? 'done' : '') : 'hit' })
  return x
 }
 place(tree, 0, path.length > 0)
 return { boxes, links }
})
</script>

<template>
 <Diagram :label="s.label" :cost="s.cost" :width="700" :height="s.height" :alt="s.alt">
  <line v-for="(link, i) in drawing.links" :key="`l${i}`" :class="['dg-link', link.accent && 'is-accent']" :x1="link.x1" :y1="link.y1" :x2="link.x2" :y2="link.y2" />
  <DBox v-for="(box, i) in drawing.boxes" :key="`b${i}`" :x="box.x" :y="box.y" :w="s.w" :h="s.h" :text="box.text" :state="box.state" small />
  <text v-for="(level, d) in s.levels" :key="`n${d}`" class="dg-note start" x="628" :y="s.top + (d + 1) * s.gap + s.h / 2 + 4">{{ level }}</text>
  <template v-if="mode === 'subsets'">
   <text class="dg-edge-label end" x="234" y="72">take 1</text>
   <text class="dg-edge-label start" x="406" y="72">skip 1</text>
   <text class="dg-note" x="320" y="268">each level decides one item: the left branch takes it, the right branch skips it</text>
  </template>
 </Diagram>
</template>
