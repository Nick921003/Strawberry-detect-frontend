<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getBatchHistory } from '../services/detectionService';

// --- (script 內的 JS 邏輯保持不變) ---
const batchJobs = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const pagination = ref({ count: 0, next: null, previous: null, currentPage: 1 });
const fetchBatchHistory = async (page = 1) => {
  isLoading.value = true;
  errorMessage.value = '';
  batchJobs.value = [];
  try {
    const response = await getBatchHistory(page);
    batchJobs.value = response.data.results || [];
    pagination.value.count = response.data.count || 0;
    pagination.value.next = response.data.next;
    pagination.value.previous = response.data.previous;
    pagination.value.currentPage = page;
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || '無法載入批次紀錄';
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => { fetchBatchHistory(1); });
const formatDate = (dateTimeString) => {
   if (!dateTimeString) return 'N/A';
    try {
        const date = new Date(dateTimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        return new Intl.DateTimeFormat('zh-TW', options).format(date).replace(/\//g, '-');
    } catch (e) { return dateTimeString; }
};
const statusBadgeClass = (status) => {
    switch (status) {
        case 'COMPLETED': return 'bg-success';
        case 'PROCESSING': return 'bg-info text-dark';
        case 'PENDING': return 'bg-secondary';
        case 'FAILED': return 'bg-danger';
        case 'PARTIAL_COMPLETION': return 'bg-warning text-dark';
        default: return 'bg-light text-dark';
    }
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
  if (pageQuery) { fetchBatchHistory(parseInt(pageQuery, 10)); }
};
const prevPage = () => {
  const pageQuery = getPageNumberFromUrl(pagination.value.previous);
  if (pageQuery) { fetchBatchHistory(parseInt(pageQuery, 10)); }
  else if (pagination.value.previous !== null) { fetchBatchHistory(1); }
};
</script>

<template>
  <main> <h2>批次辨識歷史紀錄</h2>
    <p class="text-muted">點擊列表項目可查看批次詳情。</p>

    <div v-if="isLoading" class="loading-indicator text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">正在載入批次紀錄...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      獲取紀錄失敗：{{ errorMessage }}
    </div>

    <div v-else-if="batchJobs.length > 0" class="list-group shadow-sm">
      <RouterLink
        v-for="job in batchJobs"
        :key="job.id"
        :to="{ name: 'batchDetail', params: { batchId: job.id } }"
        class="list-group-item list-group-item-action flex-column align-items-start"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1 list-item-title">批次任務 ID: {{ job.id?.substring(0, 8) }}...</h5>
          <small class="text-muted flex-shrink-0">{{ formatDate(job.created_at) }}</small>
        </div>

        <p class="mb-1 small text-truncate"> <strong>S3 路徑:</strong> {{ job.s3_bucket_name }}/{{ job.s3_folder_prefix }}
        </p>
        
        <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">
              總: {{ job.total_images_found ?? 'N/A' }} |
              成: {{ job.images_processed_successfully ?? 'N/A' }} |
              敗: {{ job.images_failed_to_process ?? 'N/A' }}
            </small>
            <span class="badge rounded-pill p-2" :class="statusBadgeClass(job.status)" style="min-width: 120px; text-align: center;">
                {{ job.status }}
            </span>
         </div>
         
         <p v-if="job.status === 'FAILED' && job.error_message" class="text-danger mt-1 mb-0 small text-truncate">
            錯誤: {{ job.error_message }}
        </p>
      </RouterLink>
    </div>

    <div v-else class="alert alert-info" role="alert">
      目前沒有任何批次辨識紀錄。
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
/* 【修改】移除 .batch-history-container 和其他全域樣式 */

/* 列表項標題樣式 (與 ManualHistoryView 相同) */
.list-item-title {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 確保 badge 有最小寬度且文字居中 */
.badge.p-2 {
    font-size: 0.8rem;
    min-width: 120px;
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