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
    redirect: () => {
      // Cek jika standalone SPA atau tidak
      if (process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true') {
        return '/tool/status' // Arahkan ke /tool/status untuk aplikasi standalone
      }

      // Cek jika token ada atau tidak
      if (!localStorage.id_token || localStorage.id_token == '') {
        return '/sc/login' // Arahkan ke halaman login jika tidak ada token
      }

      // Jika ada token, periksa apakah ada redirectAfterLogin
      return localStorage.getItem('redirectAfterLogin') || '/tool/status'
    },

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
        path: '/tool/history/firstcheck',
        name: 'HistoryFirstCheck',
        component: () => import('@/views/TMS/HistoryFirstCheck.vue'),
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
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/line',
        name: 'MasterLine',
        component: () => import('@/views/TMS/MasterLine.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/machine',
        name: 'MasterMachine',
        component: () => import('@/views/TMS/MasterMachine.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/master/first-check',
        name: 'MasterToolFC',
        component: () => import('@/views/TMS/MasterToolFC.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/distribution',
        name: 'MasterDistribution',
        component: () => import('@/views/TMS/MasterDistribution.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/system',
        name: 'MasterSystem',
        component: () => import('@/views/TMS/MasterSystem.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/users',
        name: 'MasterUsers',
        component: () => import('@/views/TMS/MasterUser.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/sc/login',
        name: 'Login',
        component: () => import('@/views/TMS/Login.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/TMS/Register.vue'),
      },
      {
        path: '/sc/profile',
        name: 'UserProfile',
        component: () => import('@/views/TMS/Profile.vue'),
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

router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem('auth_token') // Ambil auth_token dari localStorage

  // Jika rute memerlukan autentikasi (meta.requiresAuth === true)
  if (to.meta.requiresAuth) {
    if (!authToken || authToken === '') {
      // Jika tidak ada token atau token kosong, arahkan ke login
      localStorage.setItem('redirectAfterLogin', to.fullPath) // Menyimpan rute yang ingin diakses setelah login
      next({ path: '/sc/login' })
    } else {
      // Cek apakah token valid
      const tokenExp = JSON.parse(atob(authToken.split('.')[1])).exp * 1000
      const now = new Date().getTime() // Waktu saat ini dalam milidetik

      if (tokenExp < now) {
        console.log('Token expired, redirecting to login')
        localStorage.removeItem('auth_token') // Hapus token yang sudah kedaluwarsa
        next({ path: '/sc/login' }) // Arahkan ke halaman login
      } else {
        next() // Token masih valid, lanjutkan ke halaman tujuan
      }
    }
  } else {
    // Jika tidak memerlukan autentikasi, lanjutkan
    next()
  }
})

export default router
