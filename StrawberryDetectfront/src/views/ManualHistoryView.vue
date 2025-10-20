<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getManualHistory } from '../services/detectionService';

// --- (script 內的 JS 邏輯保持不變) ---
const historyRecords = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const pagination = ref({
  count: 0,
  next: null,
  previous: null,
  currentPage: 1
});

const fetchHistory = async (page = 1) => {
  isLoading.value = true;
  errorMessage.value = '';
  historyRecords.value = [];
  try {
    const response = await getManualHistory(page);
    historyRecords.value = response.data.results || [];
    pagination.value.count = response.data.count || 0;
    pagination.value.next = response.data.next;
    pagination.value.previous = response.data.previous;
    pagination.value.currentPage = page;
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || '無法載入歷史紀錄';
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => { fetchHistory(1); });
const formatDate = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('zh-TW', options).format(date).replace(/\//g, '-');
  } catch (e) { return dateTimeString; }
};
const getPageNumberFromUrl = (url) => {
  if (!url) return null;
  try {
    const urlParams = new URL(url).searchParams;
    return urlParams.get('page');
  } catch (e) { return null; }
};
const nextPage = () => {
  const pageQuery = getPageNumberFromUrl(pagination.value.next);
  if (pageQuery) { fetchHistory(parseInt(pageQuery, 10)); }
};
const prevPage = () => {
  const pageQuery = getPageNumberFromUrl(pagination.value.previous);
  if (pageQuery) { fetchHistory(parseInt(pageQuery, 10)); }
  else if (pagination.value.previous !== null) { fetchHistory(1); }
};
</script>

<template>
  <main> <h2>手動上傳辨識紀錄</h2>
    <p class="text-muted">點擊列表項目可查看詳細結果。</p>

    <div v-if="isLoading" class="loading-indicator text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">正在載入紀錄...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      獲取紀錄失敗：{{ errorMessage }}
    </div>

    <div v-else-if="historyRecords.length > 0" class="list-group shadow-sm">
      <RouterLink
        v-for="record in historyRecords"
        :key="record.id"
        :to="{ name: 'recordDetail', params: { recordId: record.id } }"
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex w-100 justify-content-between align-items-center">
          
          <div class="flex-grow-1 me-3" style="min-width: 0;"> <h5 class="mb-1 list-item-title">紀錄 ID: {{ record.id?.substring(0, 8) }}...</h5>
             <small class="text-muted d-block text-truncate">上傳於: {{ formatDate(record.uploaded_at) }}</small>
          </div>

          <div class="flex-shrink-0">
             <span v-if="record.severity_score !== null && record.severity_score !== undefined"
                   class="badge rounded-pill p-2" :class="{
                     'bg-danger': record.severity_score >= 0.7,
                     'bg-warning text-dark': record.severity_score >= 0.4 && record.severity_score < 0.7,
                     'bg-success': record.severity_score < 0.4
                   }">
               嚴重程度: {{ record.severity_score.toFixed(2) }}
             </span>
             <span v-else class="badge bg-secondary rounded-pill p-2">未評分</span>
          </div>

        </div>
      </RouterLink>
    </div>

    <div v-else class="alert alert-info" role="alert">
      目前沒有任何手動辨識紀錄。
    </div>

     <nav aria-label="Page navigation" class="mt-4 d-flex justify-content-center" v-if="!isLoading && (pagination.next || pagination.previous)">
       <ul class="pagination">
         <li class="page-item" :class="{ disabled: !pagination.previous }">
           <button class="page-link" @click="prevPage" :disabled="!pagination.previous">上一頁</button>
         </li>
         <li class="page-item disabled">
            <span class="page-link">第 {{ pagination.currentPage }} 頁 (共 {{ pagination.count }} 筆)</span>
         </li>
         <li class="page-item" :class="{ disabled: !pagination.next }">
           <button class="page-link" @click="nextPage" :disabled="!pagination.next">下一頁</button>
         </li>
       </ul>
     </nav>

    <hr class="my-4">
    <div class="text-center">
      <RouterLink :to="{ name: 'historyLanding' }" class="btn btn-outline-secondary me-2">
        返回歷史紀錄選擇
      </RouterLink>
       <RouterLink :to="{ name: 'home' }" class="btn btn-outline-primary">
           返回上傳頁面
        </RouterLink>
    </div>
  </main>
</template>

<style scoped>
/* 【修改】移除 .manual-history-container, h2, .text-muted, .loading-indicator 等全域樣式 */
/* 【移除】 .list-group-item 和 .list-group-item span:first-child */

/* 列表項標題樣式 */
.list-item-title {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    /* 避免標題太長換行 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 確保 badge 有最小寬度且文字居中 */
.badge.p-2 {
    font-size: 0.8rem;
    min-width: 120px; /* 統一最小寬度 */
    text-align: center;
}

/* 分頁按鈕樣式 */
.page-item.disabled .page-link {
    cursor: not-allowed;
}
.page-link {
    cursor: pointer;
}
</style>