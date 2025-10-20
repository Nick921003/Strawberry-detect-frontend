<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getBatchDetail } from '../services/detectionService';
import ResultCard from '../components/ResultCard.vue';

const props = defineProps({
  batchId: {
    type: String,
    required: true
  }
});

const batchJobData = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

// --- (fetchBatchDetail 邏輯保持不變) ---
const fetchBatchDetail = async (id) => {
  isLoading.value = true;
  errorMessage.value = '';
  batchJobData.value = null;
  try {
    const response = await getBatchDetail(id);
    batchJobData.value = response.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || '無法載入批次任務詳情';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchBatchDetail(props.batchId);
});

// --- (recordsList 邏輯保持不變) ---
const recordsList = computed(() => {
  return batchJobData.value?.detection_records || [];
});

// --- (formatDate 和 statusBadgeClass 輔助函式保持不變) ---
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
</script>

<template>
  <main> <h2 v-if="isLoading">載入批次任務詳情中...</h2>
    <h2 v-else-if="batchJobData">批次任務詳情 (ID: {{ batchId.substring(0, 8) }}...)</h2>
    <h2 v-else>無法載入批次任務詳情</h2>

    <div v-if="isLoading" class="loading-indicator text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <p class="mt-2 text-muted">正在載入...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      獲取批次詳情失敗：{{ errorMessage }}
    </div>

    <div v-else-if="batchJobData" class="batch-summary card card-body bg-light mb-4 shadow-sm">
       <div class="row">
           <div class="col-md-6">
               <p><strong>S3 路徑:</strong> {{ batchJobData.s3_bucket_name }}/{{ batchJobData.s3_folder_prefix }}</p>
               <p><strong>狀態:</strong>
                   <span class="badge" :class="statusBadgeClass(batchJobData.status)">
                       {{ batchJobData.status }}
                   </span>
               </p>
               <p v-if="batchJobData.status === 'FAILED' && batchJobData.error_message" class="text-danger small">
                   <strong>錯誤:</strong> {{ batchJobData.error_message }}
               </p>
           </div>
            <div class="col-md-6">
               <p><strong>任務建立時間:</strong> {{ formatDate(batchJobData.created_at) }}</p>
               <p><strong>任務更新時間:</strong> {{ formatDate(batchJobData.updated_at) || 'N/A' }}</p> <p class="text-muted small">
                   總: {{ batchJobData.total_images_found ?? 'N/A' }} |
                   成: {{ batchJobData.images_processed_successfully ?? 'N/A' }} |
                   敗: {{ batchJobData.images_failed_to_process ?? 'N/A' }}
               </p>
           </div>
       </div>
    </div>

    <div v-if="batchJobData">
       <h3 class="mb-3">包含的辨識紀錄 ({{ recordsList.length }} 筆)</h3>

       <div v-if="recordsList.length > 0">
           <ResultCard
               v-for="record in recordsList"
               :key="record.id"
               :record="record"
               class="mb-3"
           />
       </div>
       <p v-else-if="batchJobData.status === 'PENDING' || batchJobData.status === 'PROCESSING'" class="text-muted">
           批次任務處理中，尚無辨識紀錄...
       </p>
       <p v-else class="text-muted">
           此批次任務沒有包含任何辨識紀錄。
       </p>
    </div>

    <hr class="my-4">
    <div class="text-center">
      <RouterLink :to="{ name: 'batchHistory' }" class="btn btn-outline-secondary me-2">
        返回批次歷史列表
      </RouterLink>
      <RouterLink :to="{ name: 'home' }" class="btn btn-outline-primary">
        返回上傳頁面
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
/* 【移除】 .batch-detail-container, h2 */

/* h3 樣式已移至 main.css */

.loading-indicator {
    color: #666;
}
.batch-summary {
    font-size: 0.9rem;
}
.batch-summary p {
    margin-bottom: 0.5rem;
}
.batch-summary p strong {
    color: #555;
}
.batch-summary .badge { /* 讓 badge 樣式統一 */
    font-size: 0.9rem;
    padding: 0.4em 0.6em;
}
</style>