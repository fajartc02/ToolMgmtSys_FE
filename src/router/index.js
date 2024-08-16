console.log('router/index.js')
import { createRouter, createWebHashHistory, Route } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'

/*define const other in here*/

console.log(process.env.VUE_APP_STANDALONE_SINGLE_SPA)

const routes = [
  {
    path: '/',
    name: 'Home',
    component:
      process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
        ? DefaultLayoutStandAlone
        : DefaultLayout,
    redirect:
      process.env.VUE_APP_STANDALONE_SINGLE_SPA !== 'true' &&
      (!localStorage.id_token || localStorage.id_token == '')
        ? () => {
            window.location.href = process.env.dc + '/#/sc/login'
            // return '/redirectingToLogin' // not important since redirecting
          }
        : '/tool/status',
    children: [
      {
        path: '/tool/status',
        name: 'ToolStatus',
        component: () => import('@/views/TMS/ToolStatus.vue'),
      },
      {
        path: '/tool/register',
        name: 'ToolRegister',
        component: () => import('@/views/TMS/ToolRegister.vue'),
      },

      {
        path: '/tool/history/regrinding',
        name: 'HistoryRegrinding',
        component: () => import('@/views/TMS/HistoryRegrinding.vue'),
      },

      {
        path: '/tool/history/setting',
        name: 'HistorySetting',
        component: () => import('@/views/TMS/HistorySetting.vue'),
      },
      {
        path: '/tool/history/scrab',
        name: 'HistoryScrab',
        component: () => import('@/views/TMS/HistoryScrab.vue'),
      },
      {
        path: '/tool/section',
        name: 'ToolSection',
        component: () => import('@/views/TMS/ToolSection.vue'),
      },
      {
        path: '/tool/drawing',
        name: 'MasterDrawing',
        component: () => import('@/views/TMS/MasterDrawing.vue'),
      },
      {
        path: '/tool/line',
        name: 'MasterLine',
        component: () => import('@/views/TMS/MasterLine.vue'),
      },
      {
        path: '/tool/machine',
        name: 'MasterMachine',
        component: () => import('@/views/TMS/MasterMachine.vue'),
      },
      {
        path: '/tool/distribution',
        name: 'MasterDistribution',
        component: () => import('@/views/TMS/MasterDistribution.vue'),
      },
      {
        path: '/tool/system',
        name: 'MasterSystem',
        component: () => import('@/views/TMS/MasterSystem.vue'),
      },
      {
        path: '/tool/users',
        name: 'MasterUsers',
        component: () => import('@/views/TMS/MasterUser.vue'),
      },

      /*define other in here*/
    ],
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/pages/Page404'),
  },
  {
    path: '/500',
    name: 'Page500',
    component: () => import('@/views/pages/Page500'),
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
