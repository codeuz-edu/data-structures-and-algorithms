<script setup>
// The trie used on the Trie page, holding car, cat, do and dog. A filled node ends a word.
// `mode` picks the picture; insert, search, complete and delete walk down from the root through c and a.
//   ''          the plain trie
//   insert      insert cab: one new node, b, under a
//   search      search for ca: the node for a exists but has no end flag
//   complete    complete ca: the words below a, numbered in the order they are found
//   delete      delete cat: the walk goes on to t, whose flag is cleared, and t is pruned
//   compressed  the same words twice, side by side: the trie (8 nodes, spaced closer) and the
//               compressed trie (6 nodes), where the chains c, a and d, o become single nodes
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DGraph from './DGraph.vue'
const props = defineProps({ mode: { type: String, default: '' } })
const base = [
 { id: 'root', label: '', x: 300, y: 30, note: 'root' },
 { id: 'c', x: 200, y: 88 }, { id: 'd', x: 420, y: 88 },
 { id: 'a', x: 200, y: 146 }, { id: 'o', x: 420, y: 146, end: true },
 { id: 'r', x: 140, y: 204, end: true }, { id: 't', x: 260, y: 204, end: true }, { id: 'g', x: 420, y: 204, end: true }
]
const links = [['root', 'c'], ['root', 'd'], ['c', 'a'], ['d', 'o'], ['a', 'r'], ['a', 't'], ['o', 'g']]
const path = ['root', 'c', 'a']
// Per mode, by node id: `nodes` overrides a node's state, `edges` the state of the edge into it,
// `notes` adds a note, and `below` puts that note at the bottom right of the node.
const looks = {
 '': {},
 insert: {},
 search: { nodes: { r: 'muted', t: 'muted', d: 'muted', o: 'muted', g: 'muted' }, notes: { a: 'no end flag' } },
 complete: { nodes: { d: 'muted', o: 'muted', g: 'muted' }, edges: { r: 'accent', t: 'accent' }, notes: { r: '1 · car', t: '2 · cat' }, below: ['r', 't'] },
 delete: { nodes: { t: 'ghost', d: 'muted', o: 'muted', g: 'muted' }, edges: { t: 'removed' }, notes: { a: 'still leads to car', t: 'pruned' } },
 compressed: {}
}
// The compressed mode draws its own two trees. Both have their bottom row at y = 214.
const plain = {
 nodes: [
  { id: 'root', label: '', x: 160, y: 40 },
  { id: 'c', x: 110, y: 98 }, { id: 'd', x: 220, y: 98 },
  { id: 'a', x: 110, y: 156 }, { id: 'o', x: 220, y: 156, state: 'hit' },
  { id: 'r', x: 70, y: 214, state: 'hit' }, { id: 't', x: 150, y: 214, state: 'hit' }, { id: 'g', x: 220, y: 214, state: 'hit' }
 ],
 edges: links.map(([from, to]) => ({ from, to }))
}
const merged = {
 nodes: [
  { id: 'root', label: '', x: 470, y: 98 },
  { id: 'ca', x: 420, y: 156 }, { id: 'do', x: 540, y: 156, state: 'hit' },
  { id: 'r', x: 380, y: 214, state: 'hit' }, { id: 't', x: 460, y: 214, state: 'hit' }, { id: 'g', x: 540, y: 214, state: 'hit' }
 ],
 edges: [['root', 'ca'], ['root', 'do'], ['ca', 'r'], ['ca', 't'], ['do', 'g']].map(([from, to]) => ({ from, to }))
}
const nodes = computed(() => {
 const look = looks[props.mode]
 const list = base.map(node => {
  let state = node.end ? 'hit' : ''
  if (props.mode && path.includes(node.id)) state = 'done'
  if (look.nodes?.[node.id]) state = look.nodes[node.id]
  return { ...node, state, note: look.notes?.[node.id] ?? node.note, noteBelow: look.below?.includes(node.id) }
 })
 if (props.mode === 'insert') list.push({ id: 'b', x: 200, y: 204, state: 'new', note: 'new', noteBelow: true })
 return list
})
const edges = computed(() => {
 const look = looks[props.mode]
 const list = links.map(([from, to]) => {
  let state = props.mode && path.includes(to) ? 'accent' : ''
  if (look.nodes?.[to] === 'muted') state = 'muted'
  if (look.edges?.[to]) state = look.edges[to]
  return { from, to, state }
 })
 if (props.mode === 'insert') list.push({ from: 'a', to: 'b', state: 'accent' })
 return list
})
const text = {
 '': { label: 'Anatomy', cost: '', alt: 'A trie holding the words car, cat, do and dog. From the root, c leads to a, which leads to r and t. The root also leads to d, then o, then g. The nodes r, t, o and g are marked as the end of a word.' },
 insert: { label: 'Insert cab', cost: 'O(m)', alt: 'Inserting cab follows the existing nodes c and a, then adds one new node, b, under a and marks it as the end of a word.' },
 search: { label: 'Search for ca', cost: 'O(m)', alt: 'Searching for ca follows c, then a. The node for a exists, so some stored word starts with ca, but it has no end flag, so ca itself is not a stored word. The rest of the trie is not visited.' },
 complete: { label: 'Complete ca', cost: 'O(m + k)', alt: 'Completing ca follows c, then a. It then visits the nodes below a in letter order and finds car first and cat second. The branch for d is never visited.' },
 delete: { label: 'Delete cat', cost: 'O(m)', alt: 'Deleting cat follows c, a and t. The end flag on t is cleared, and since t has no children it is removed from a. The walk back up stops at a, which still leads to car. The branch for d is not touched.' },
 compressed: { label: 'Trie and compressed trie', cost: '', alt: 'The words car, cat, do and dog drawn twice. On the left, the trie, with eight nodes: c leads only to a, and d leads only to o. On the right, the compressed trie, with six nodes: c and a are merged into one node, ca, and d and o into one node, do. In both, the nodes for r, t, g and do or o end words.' }
}
</script>

<template>
 <Diagram :label="text[mode].label" :cost="text[mode].cost" :width="mode === 'compressed' ? 640 : 600" :height="mode === 'compressed' ? 272 : 236" :alt="text[mode].alt">
  <template v-if="mode === 'compressed'">
   <DGraph :nodes="plain.nodes" :edges="plain.edges" />
   <DGraph :nodes="merged.nodes" :edges="merged.edges" />
   <text class="dg-label" x="160" y="260">trie: 8 nodes</text>
   <text class="dg-label" x="470" y="260">compressed: 6 nodes</text>
  </template>
  <template v-else>
   <DGraph :nodes="nodes" :edges="edges" />
   <text v-if="!mode" class="dg-note" x="520" y="208">filled = end of a word</text>
  </template>
 </Diagram>
</template>
