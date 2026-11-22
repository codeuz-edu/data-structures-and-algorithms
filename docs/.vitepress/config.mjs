import { defineConfig } from 'vitepress'
import { createLogger } from 'vite'
import catppuccinLatte from '@shikijs/themes/catppuccin-latte'
import catppuccinMocha from '@shikijs/themes/catppuccin-mocha'
import { seo } from './seo.mjs'

// Catppuccin is drawn for its own background, not VitePress's, so several token colors land
// under the WCAG AA 4.5:1 contrast ratio on our code background (Latte comments reach only
// 2.4:1). Scale each failing color's luminance until it passes; multiplying the linear RGB
// channels keeps the hue, so the palette still looks like Catppuccin.
const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
 .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const toHex = rgb => '#' + rgb.map(c => {
 const srgb = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
 return Math.round(Math.min(1, Math.max(0, srgb)) * 255).toString(16).padStart(2, '0')
}).join('')
const ratio = (a, b) => {
 const [hi, lo] = [luminance(channels(a)), luminance(channels(b))].sort((x, y) => y - x)
 return (hi + 0.05) / (lo + 0.05)
}
const readable = (color, background, min = 4.6) => {
 if (ratio(color, background) >= min) return color
 const backgroundLuminance = luminance(channels(background))
 const target = backgroundLuminance > 0.5
  ? (backgroundLuminance + 0.05) / min - 0.05
  : min * (backgroundLuminance + 0.05) - 0.05
 const rgb = channels(color)
 const scaled = toHex(rgb.map(c => c * (target / luminance(rgb))))
 if (ratio(scaled, background) >= min - 0.1) return scaled
 // Scaling up can clip a channel; mix toward white instead.
 for (let t = 0.02; t <= 1; t += 0.02) {
  const mixed = toHex(rgb.map(c => c + (1 - c) * t))
  if (ratio(mixed, background) >= min) return mixed
 }
 return color
}
const contrastSafe = (theme, background) => ({
 ...theme,
 tokenColors: theme.tokenColors.map(token => {
  const foreground = token.settings?.foreground
  if (!/^#[0-9a-f]{6}$/i.test(foreground || '')) return token
  return { ...token, settings: { ...token.settings, foreground: readable(foreground, background) } }
 })
})
// --vp-code-block-bg in each mode.
const codeThemes = {
 light: contrastSafe(catppuccinLatte, '#f6f6f7'),
 dark: contrastSafe(catppuccinMocha, '#161618')
}

// Every page of the site, in reading order. A page is added here when its file exists.
const sidebar = [
 { text: 'Start Here', items: [{ text: 'Overview', link: '/' }, { text: 'Measuring Cost', link: '/foundations/measuring-cost' }, { text: 'References and Memory', link: '/foundations/references' }, { text: 'Playground', link: '/playground' }] },
 { text: 'Arrays', items: [{ text: 'Array', link: '/arrays/array' }, { text: 'Dynamic Array', link: '/arrays/dynamic-array' }, { text: 'Sorted Array and Binary Search', link: '/arrays/binary-search' }] },
 { text: 'Linked Lists', items: [{ text: 'Singly Linked List', link: '/linked-lists/singly-linked-list' }, { text: 'Doubly Linked List', link: '/linked-lists/doubly-linked-list' }] },
 { text: 'Stacks and Queues', items: [{ text: 'Stack', link: '/stacks-queues/stack' }, { text: 'Queue', link: '/stacks-queues/queue' }] },
 { text: 'Hash Tables', items: [{ text: 'Hash Table', link: '/hash-tables/hash-table' }] },
 { text: 'Recursion and Sorting', items: [{ text: 'Recursion', link: '/recursion/recursion' }, { text: 'Simple Sorts', link: '/sorting/simple-sorts' }, { text: 'Merge Sort', link: '/sorting/merge-sort' }, { text: 'Quicksort', link: '/sorting/quicksort' }] },
 { text: 'Trees', items: [{ text: 'Binary Tree', link: '/trees/binary-tree' }, { text: 'Binary Search Tree', link: '/trees/binary-search-tree' }, { text: 'AVL Tree', link: '/trees/avl-tree' }, { text: 'Heap', link: '/trees/heap' }, { text: 'Trie', link: '/trees/trie' }] },
 { text: 'Graphs', items: [{ text: 'Graph', link: '/graphs/graph' }, { text: 'Topological Sort', link: '/graphs/topological-sort' }, { text: 'Shortest Paths', link: '/graphs/shortest-paths' }, { text: 'Union-Find', link: '/graphs/union-find' }, { text: 'Minimum Spanning Tree', link: '/graphs/minimum-spanning-tree' }] },
 { text: 'Algorithm Design', items: [{ text: 'Greedy Algorithms', link: '/algorithm-design/greedy' }, { text: 'Backtracking', link: '/algorithm-design/backtracking' }, { text: 'Dynamic Programming', link: '/algorithm-design/dynamic-programming' }, { text: 'Dynamic Programming on Grids and Pairs', link: '/algorithm-design/dynamic-programming-2d' }] },
 { text: 'Wrap-up', items: [{ text: 'Choosing a Structure', link: '/choosing-a-structure' }] }
]

const uzSidebarTitles = [
 ['Birinçi qadamlar', 'Kurs haqida', 'Algoritmning vaqt va xotira sarfi', 'Havolalar va xotira', 'Sinov maydonçasi'],
 ['Massivlar', 'Massiv', 'Dinamik massiv', 'Tartiblangan massiv va ikkilik qidiruv'],
 ['Boğlangan röyxatlar', 'Bir tomonlama boğlangan röyxat', 'Ikki tomonlama boğlangan röyxat'],
 ['Steklar va navbatlar', 'Stek', 'Navbat'],
 ['Xeş jadvallari', 'Xeş jadvali'],
 ['Rekursiya va saralaş', 'Rekursiya', 'Oddiy saralaş algoritmlari', 'Birlaştirib saralaş', 'Tez saralaş'],
 ['Daraxtlar', 'Ikkilik daraxt', 'Ikkilik qidiruv daraxti', 'AVL daraxti', 'Uyum', 'Prefiks daraxti'],
 ['Graflar', 'Graf', 'Topologik tartiblaş', 'Eng qisqa yöllar', 'Töplamlarni birlaştiriş va topiş', 'Minimal qamrovçi daraxt'],
 ['Algoritm tuziş', 'Oçköz algoritmlar', 'Ortga qaytib qidiriş', 'Dinamik dasturlaş', 'Jadval va juftliklarda dinamik dasturlaş'],
 ['Yakun', 'Tuzilmani tanlaş']
]

const uzSidebar = sidebar.map(({ items }, index) => {
 const [text, ...titles] = uzSidebarTitles[index]
 return { text, items: items.map(({ link }, itemIndex) => ({ text: titles[itemIndex], link: '/uz' + link })) }
})

const courseLinks = (language, currentTitle, currentPath) => [
 { text: 'Python Foundations', link: `https://codeuz-edu.github.io/python-tutorials/${language}/` },
 { text: 'Advanced Python', link: `https://codeuz-edu.github.io/python-advanced/${language}/` },
 { text: currentTitle, link: currentPath },
 { text: 'Algorithms Roadmap', link: 'https://codeuz-edu.github.io/algorithms-roadmap/' }
]

const brand = '<span class="site-brand">code<span class="site-tld">uz</span><span class="site-cursor"></span></span>'
const siteTitle = title => brand + '<span class="site-course">' + title + '</span>'
const editPattern = 'https://github.com/codeuz-edu/data-structures-and-algorithms/edit/main/docs/:path'

const base = process.env.SITE_BASE || '/'

// Head tags for search engines, link previews and AI tools (seo.mjs). English is at the site root,
// Uzbek under /uz/.
const site = seo({
 url: 'https://codeuz-edu.github.io/data-structures-and-algorithms/',
 name: 'Data Structures and Algorithms',
 image: { path: 'og-image.png', width: 1200, height: 600, alt: 'codeuz: Data Structures and Algorithms' },
 languages: { en: '', uz: 'uz/' },
 defaultLanguage: 'en',
 homes: { 'index.md': 'Data Structures and Algorithms', 'uz/index.md': 'Maʼlumot tuzilmalari va algoritmlar' }
})

// VitePress 1.x is written for Vite 5; this project runs it on Vite 6, which prints a warning
// about one line in VitePress's own search box ("Failed to resolve /@localSearchIndex") every time
// the dev server starts. Search works either way, so that one message is dropped. Every other
// warning still gets through.
const logger = createLogger()
const warn = logger.warn
logger.warn = (message, options) => { if (!String(message).includes('/@localSearchIndex')) warn(message, options) }

export default defineConfig({
 vite: { customLogger: logger },
 title: 'Data Structures and Algorithms',
 description: 'Data structures and algorithms explained with diagrams and Python code you can run in the browser.',
 lang: 'en',
 base, outDir: '../dist',
 sitemap: { hostname: 'https://codeuz-edu.github.io/data-structures-and-algorithms/', transformItems: site.sitemapItems },
 transformHead: site.transformHead,
 lastUpdated: true,
 // Catppuccin Latte/Mocha, contrast-corrected above; the CodeMirror editor matches (--cm-* in theme/style.css).
 markdown: { theme: codeThemes },
 head: [
  ['link', { rel: 'icon', href: `${base}favicon.svg?v=2` }],
  ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
  // Inter is the page font. Barlow and Barlow Condensed are used inside the diagrams only.
  ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@800&display=swap' }],
  ...site.head
 ],
 themeConfig: {
  // The site carries the name of the author's YouTube channel, codeuz, drawn as a logo (theme/style.css),
  // with the course name under it.
  siteTitle: siteTitle('Data Structures &amp; Algorithms'),
  nav: [{ text: 'Overview', link: '/' }, { text: 'Playground', link: '/playground' }, { text: 'Courses', items: courseLinks('en', 'Data Structures & Algorithms', '/') }],
  sidebar,
  outline: { label: 'On this page', level: [2, 3] },
  docFooter: { prev: 'Previous', next: 'Next' },
  editLink: { pattern: editPattern, text: 'Suggest a change to this page' },
  lastUpdatedText: 'Last updated',
  socialLinks: [{ icon: 'youtube', link: 'https://youtube.com/codeuz', ariaLabel: 'YouTube' }, { icon: 'github', link: 'https://github.com/codeuz-edu/data-structures-and-algorithms', ariaLabel: 'GitHub' }],
  search: {
   provider: 'local',
   options: {
    miniSearch: { options: {
     tokenize: text => text.replace(/['‘’ʼʻ]/gu, '').split(/[^\p{L}\p{N}_]+/u).filter(Boolean),
     processTerm: term => term.toLowerCase().replaceAll('ş', 'sh').replaceAll('ç', 'ch').replaceAll('ö', 'o').replaceAll('ğ', 'g')
    } },
    locales: { uz: { translations: {
     button: { buttonText: 'Qidiriş', buttonAriaLabel: 'Darslardan qidiriş' },
     modal: { noResultsText: 'Natija topilmadi', resetButtonTitle: 'Tozalaş', footer: { selectText: 'tanlaş', navigateText: 'ötiş', closeText: 'yopiş' } }
    } } }
   }
  }
 },
 locales: {
  root: { label: 'English', lang: 'en' },
  uz: {
   label: 'Özbekça',
   lang: 'uz',
   title: 'Maʼlumot tuzilmalari va algoritmlar',
   description: 'Maʼlumot tuzilmalari va algoritmlar rasmlar hamda brauzerda bajariladigan Python misollari orqali tuşuntiriladi.',
   themeConfig: {
    siteTitle: siteTitle('Maʼlumot tuzilmalari va algoritmlar'),
    nav: [{ text: 'Kurs haqida', link: '/uz/' }, { text: 'Sinov maydonçasi', link: '/uz/playground' }, { text: 'Darsliklar', items: courseLinks('uz', 'Maʼlumot tuzilmalari va algoritmlar', '/uz/') }],
    sidebar: uzSidebar,
    outline: { label: 'Bu sahifada', level: [2, 3] },
    docFooter: { prev: 'Oldingi dars', next: 'Keyingi dars' },
    editLink: { pattern: editPattern, text: 'Bu sahifaga özgartiriş taklif qiliş' },
    lastUpdatedText: 'Oxirgi yangilaniş',
    returnToTopLabel: 'Yuqoriga',
    sidebarMenuLabel: 'Mundarija',
    skipToContentLabel: 'Asosiy qismga ötiş',
    langMenuLabel: 'Tilni özgartiriş',
    darkModeSwitchLabel: 'Rang rejimi'
   }
  }
 }
})
