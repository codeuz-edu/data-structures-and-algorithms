import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Playground from './Playground.vue'
import Mark from './Mark.vue'
import CodeEnhancer from './CodeEnhancer.vue'
import './style.css'

// Every file in theme/diagrams is a component named after its file, so a page can write
// <LinkedListAnatomy /> without importing anything.
const diagrams = import.meta.glob('./diagrams/*.vue', { eager: true })

export default {
 extends: DefaultTheme,
 // CodeEnhancer adds Run buttons to code blocks and a Check editor to each exercise.
 Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(CodeEnhancer) }),
 enhanceApp({ app }) {
  app.component('PythonPlayground', Playground)
  app.component('Yes', { render: () => h(Mark, { ok: true }) })
  app.component('No', { render: () => h(Mark, { ok: false }) })
  for (const [path, module] of Object.entries(diagrams)) app.component(path.match(/([^/]+)\.vue$/)[1], module.default)
 }
}
