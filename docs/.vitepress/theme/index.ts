import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './styles/custom.css'

import GlossaryTable from './components/GlossaryTable.vue'
import ProgressOverview from './components/ProgressOverview.vue'
import DomainScore from './components/DomainScore.vue'
import ReviewQueue from './components/ReviewQueue.vue'
import DataPort from './components/DataPort.vue'
import ContinueCard from './components/ContinueCard.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 仪表盘与术语表页面里直接用这些组件，所以注册为全局组件
    app.component('GlossaryTable', GlossaryTable)
    app.component('ProgressOverview', ProgressOverview)
    app.component('DomainScore', DomainScore)
    app.component('ReviewQueue', ReviewQueue)
    app.component('DataPort', DataPort)
    app.component('ContinueCard', ContinueCard)
  },
} satisfies Theme
