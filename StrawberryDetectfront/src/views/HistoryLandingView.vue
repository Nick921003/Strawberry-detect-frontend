<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <main class="text-center"> <h1>查看歷史紀錄</h1>
    <p class="description">請選擇您想查看的歷史紀錄類型：</p>

    <div class="link-container">
      <RouterLink :to="{ name: 'batchHistory' }" class="history-link card">
        <div class="card-body">
          <h5 class="card-title">🚛 自走車批次辨識紀錄</h5>
          <p class="card-text">查看由自走車或 S3 資料夾觸發的完整批次處理任務。</p>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'manualHistory' }" class="history-link card">
        <div class="card-body">
          <h5 class="card-title">🖐️ 手動上傳辨識紀錄</h5>
          <p class="card-text">查看您手動上傳的單張圖片辨識結果。</p>
        </div>
      </RouterLink>
    </div>

     <hr class="my-4">
     <div class="text-center">
        <RouterLink :to="{ name: 'home' }" class="btn btn-outline-secondary">
           返回上傳頁面
        </RouterLink>
     </div>
  </main>
</template>

<style scoped>
/* 【移除】 .history-landing-container { ... } */

/* h1 樣式已移至 main.css (h2)，若要 h1 可在 main.css 新增 */
h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 2.5rem;
}

.link-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.history-link.card {
  text-decoration: none;
  color: inherit;
  border: 1px solid #eee;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.history-link.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-color: var(--bs-primary-border-subtle, #cfe2ff);
}

 .card-title {
    color: #0d6efd;
    margin-bottom: 0.75rem;
 }
 .card-text {
    font-size: 0.9rem;
    color: #555;
 }

@media (min-width: 768px) {
  .link-container {
    grid-template-columns: 1fr 1fr;
  }
}

.btn-outline-secondary {
   margin-top: 1rem;
}
</style>