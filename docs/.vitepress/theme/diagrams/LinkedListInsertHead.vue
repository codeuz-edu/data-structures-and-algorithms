<script setup>
import { useData } from 'vitepress'
import Diagram from './Diagram.vue'
import DChain from './DChain.vue'
import DNode from './DNode.vue'
import DStep from './DStep.vue'

const { lang } = useData()
</script>

<template>
 <Diagram :label="lang === 'uz' ? 'Boşiga qöşiş' : 'Insert at the head'" cost="O(1)" :width="610" :height="180" :alt="lang === 'uz' ? '5 qiymatli yangi tugun eski birinçi tugun 12 ga ulanadi. Keyin HEAD yangi tugunga ötkaziladi.' : 'A new node 5 is linked to the old first node 12, then HEAD is moved from 12 to the new node.'">
  <DNode :x="110" :y="20" :value="5" state="new" />
  <rect class="dg-box" x="40" y="120" width="56" height="36" /><text class="dg-name" x="68" y="138">HEAD</text>
  <line class="dg-link is-removed" x1="100" y1="138" x2="166" y2="138" />
  <DChain :x="170" :y="120" :values="[12, 7, 3]" />
  <path class="dg-link is-accent" d="M180 38H212V118" marker-end="url(#dg-arrow-accent)" />
  <DStep :x="212" :y="78" :n="1" />
  <path class="dg-link is-accent" d="M68 120V38H108" marker-end="url(#dg-arrow-accent)" />
  <DStep :x="68" :y="78" :n="2" />
 </Diagram>
</template>
