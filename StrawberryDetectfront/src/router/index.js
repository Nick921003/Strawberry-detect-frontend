import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // 我們保留這個作為上傳頁面

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 路由 1: 首頁 / 上傳頁面
    {
      path: '/',
      name: 'home', // 或 'upload'
      component: HomeView // 指向 src/views/HomeView.vue
    },
    // 路由 2: 歷史紀錄選擇頁
    {
      path: '/history',
      name: 'historyLanding',
      // 使用路由級別的代碼分割 (Lazy Loading)
      // 這會為此路由生成一個單獨的 chunk (檔案)
      // 只有當使用者訪問此路由時才會載入對應的組件
      component: () => import('../views/HistoryLandingView.vue') // 指向未來會建立的 src/views/HistoryLandingView.vue
    },
    // 路由 3: 手動上傳歷史列表頁
    {
      path: '/history/manual',
      name: 'manualHistory',
      component: () => import('../views/ManualHistoryView.vue') // 指向未來會建立的 src/views/ManualHistoryView.vue
    },
    // 路由 4: 批次任務歷史列表頁
    {
      path: '/history/batch',
      name: 'batchHistory',
      component: () => import('../views/BatchHistoryView.vue') // 指向未來會建立的 src/views/BatchHistoryView.vue
    },
    // 路由 5: 單筆紀錄詳情頁 (使用動態路由參數 :recordId)
    {
      path: '/record/:recordId', // :recordId 是一個動態參數，可以在組件中獲取
      name: 'recordDetail',
      component: () => import('../views/RecordDetailView.vue'), // 指向未來會建立的 src/views/RecordDetailView.vue
      props: true // 將路由參數 ($route.params) 作為 props 傳遞給組件
    },
    // 路由 6: 批次任務詳情頁 (使用動態路由參數 :batchId)
    {
      path: '/batch/:batchId', // :batchId 是一個動態參數
      name: 'batchDetail',
      component: () => import('../views/BatchDetailView.vue'), // 指向未來會建立的 src/views/BatchDetailView.vue
      props: true
    },
    // 路由 7: S3 批次觸發頁面
    {
      path: '/s3-trigger',
      name: 's3Trigger',
      component: () => import('../views/S3TriggerView.vue') // 指向我們即將建立的新頁面
    }
    // (可選) 404 Not Found 頁面路由，通常放在最後
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'NotFound',
    //   component: () => import('../views/NotFoundView.vue')
    // }
  ]
})

export default router