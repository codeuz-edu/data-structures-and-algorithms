<script setup>
// The hash table used on the Hash Table page: eight buckets, each with a chain of keys.
// `mode` is insert (fig joins the chain in bucket 6), lookup (the search for fig) or delete
// (the search for fig, which is then removed from the chain).
import { computed } from 'vue'
import Diagram from './Diagram.vue'
import DCells from './DCells.vue'
import DBox from './DBox.vue'
import DArrow from './DArrow.vue'
const props = defineProps({ mode: { type: String, default: 'insert' } })
const chains = { 0: ['pear'], 2: ['apple'], 4: ['kiwi'], 6: ['plum', 'fig'], 7: ['lime'] }
// How the keys of bucket 6 are drawn in each mode; a key not listed is plain.
const looks = { insert: { fig: 'new' }, lookup: { plum: 'done', fig: 'hit' }, delete: { plum: 'done', fig: 'ghost' } }
const entries = computed(() => Object.entries(chains).flatMap(([bucket, keys]) => keys.map((key, depth) => ({
 key, x: 32 + 72 * bucket + 6, y: 92 + 56 * depth, cx: 32 + 72 * bucket + 36,
 state: looks[props.mode][key] || '',
 link: Number(bucket) !== 6 ? '' : props.mode === 'delete' && key === 'fig' ? 'removed' : 'accent'
}))))
const text = {
 insert: { label: 'Insert fig', cost: 'O(1) average', alt: 'Eight buckets numbered 0 to 7. The key fig hashes to bucket 6, which already holds plum, so fig is added to the end of that bucket\'s chain.' },
 lookup: { label: 'Look up fig', cost: 'O(1) average', alt: 'To find fig, go straight to bucket 6, compare with plum, which does not match, then with fig, which does. No other bucket is touched.' },
 delete: { label: 'Delete fig', cost: 'O(1) average', alt: 'To delete fig, go straight to bucket 6, pass plum, which does not match, and remove fig, which does. plum stays in the bucket, and no other bucket is touched.' }
}
</script>

<template>
 <Diagram :label="text[mode].label" :cost="text[mode].cost" :width="640" :height="190" :alt="text[mode].alt">
  <DCells :x="32" :y="28" :w="72" :h="34" :values="[0, 1, 2, 3, 4, 5, 6, 7]" :states="{ 0: 'muted', 1: 'muted', 2: 'muted', 3: 'muted', 4: 'muted', 5: 'muted', 6: 'hit', 7: 'muted' }" />
  <template v-for="entry in entries" :key="entry.key">
   <DArrow :from="[entry.cx, entry.y - 30 + (entry.y > 92 ? 4 : 0)]" :to="[entry.cx, entry.y - 2]" :kind="entry.link" />
   <DBox :x="entry.x" :y="entry.y" :w="60" :h="30" :text="entry.key" :state="entry.state" small />
  </template>
 </Diagram>
</template>
