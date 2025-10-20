<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getRecordDetail } from '../services/detectionService';
import ResultCard from '../components/ResultCard.vue';

const props = defineProps({
  recordId: {
    type: String,
    required: true
  }
});

const recordData = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchRecordDetail = async (id) => {
  isLoading.value = true;
  errorMessage.value = '';
  recordData.value = null;
  try {
    const response = await getRecordDetail(id);
    recordData.value = response.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || '無法載入紀錄詳情';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchRecordDetail(props.recordId);
});
</script>

<template>
  <main> <h2 v-if="isLoading">載入紀錄詳情中...</h2>
    <h2 v-else-if="recordData">辨識結果詳情 (ID: {{ recordId.substring(0, 8) }}...)</h2>
    <h2 v-else>無法載入紀錄詳情</h2>

    <div v-if="isLoading" class="loading-indicator text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
       <p class="mt-2 text-muted">正在載入...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger" role="alert">
      獲取紀錄詳情失敗：{{ errorMessage }}
    </div>

    <ResultCard v-else-if="recordData" :record="recordData" />

    <hr class="my-4">
    <div class="text-center">
      <RouterLink v-if="recordData?.batch_job_id" :to="{ name: 'batchDetail', params: { batchId: recordData.batch_job_id } }" class="btn btn-outline-secondary me-2">
        返回所屬批次 ({{ recordData.batch_job_id.substring(0,8) }}...)
      </RouterLink>
       <RouterLink v-else :to="{ name: 'manualHistory' }" class="btn btn-outline-secondary me-2">
         返回手動歷史列表
       </RouterLink>
      <RouterLink :to="{ name: 'home' }" class="btn btn-outline-primary">
        返回上傳頁面
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
/* 【移除】 .record-detail-container, h2 */

.loading-indicator {
    color: #666;
}
</style>