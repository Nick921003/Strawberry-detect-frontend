<script setup>
import { computed } from 'vue';
import HealthPieChart from './HealthPieChart.vue';

// 定義組件接收的屬性 (props)
const props = defineProps({
  record: {
    type: Object, // 接收來自 API 的單筆辨識結果物件
    required: true
  }
});

// 計算屬性：計算嚴重程度對應的 CSS class
const severityClass = computed(() => {
  const score = props.record?.severity_score;
  if (score === null || score === undefined) return 'text-muted'; // 未評分
  if (score >= 0.7) return 'text-danger';
  if (score >= 0.4) return 'text-warning';
  return 'text-success';
});

// 計算屬性：計算嚴重程度的文字描述
const severityDescription = computed(() => {
    const score = props.record?.severity_score;
    if (score === null || score === undefined) return '未評分';
    if (score >= 0.7) return '狀況較嚴重';
    if (score >= 0.4) return '潛在問題';
    return '狀況良好';
});

// 計算屬性：格式化顯示的辨識結果列表
const formattedResults = computed(() => {
  if (!props.record?.results_data || !Array.isArray(props.record.results_data)) {
    // 檢查 results_data 是否存在且為陣列
    if (props.record?.results_data?.error) {
         return [{ id: 'error', class: '處理錯誤', confidence_str: props.record.results_data.error }];
    }
    return [];
  }
  // 為每個結果加上一個唯一 key，方便 v-for 渲染
  return props.record.results_data.map((res, index) => ({
    ...res,
    id: `res-${index}` // 簡單地用索引當 key
  }));
});

// 根據信心度回傳 badge 的 CSS class
const confidenceBadgeClass = (confidence) => {
  if (confidence === undefined || confidence === null) return 'bg-secondary';
  if (confidence >= 0.7) return 'confidence-high';
  if (confidence >= 0.4) return 'confidence-medium';
  return 'confidence-low';
};
 
// 計算屬性：計算健康和病害的數量
const detectionStats = computed(() => {
  let healthyCount = 0;
  let diseaseCount = 0;

  if (Array.isArray(props.record?.results_data)) {
    for (const res of props.record.results_data) {
      if (res.class === 'healthy') {
        healthyCount++;
      } else if (res.class) { // 假設 'healthy' 以外的都是病害
        diseaseCount++;
      }
    }
  }
  return { healthyCount, diseaseCount };
});
</script>

<template>
  <div class="result-card card shadow-sm mb-4">
    <div class="row g-0">
      <div class="col-md-6">
        <div class="image-container p-3">
          <div class="mb-3">
            <h5 class="card-subtitle mb-2 text-muted">原始圖片</h5>
            <img v-if="record.original_image_url" :src="record.original_image_url" class="img-fluid rounded" alt="原始圖片">
            <p v-else class="text-muted small">無原始圖片 URL</p>
          </div>
          <div>
            <h5 class="card-subtitle mb-2 text-muted">標註結果</h5>
            <img v-if="record.annotated_image_url" :src="record.annotated_image_url" class="img-fluid rounded" alt="標註結果圖">
            <p v-else-if="record.original_image_url && (!formattedResults || formattedResults.length === 0 || formattedResults[0].class === '處理錯誤')" class="text-muted small">
              無標註結果 (可能未偵測到物件或處理錯誤)
            </p>
             <p v-else-if="!record.original_image_url" class="text-muted small">無標註圖片 URL</p>
             <p v-else class="text-muted small">處理中或無標註結果</p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card-body">
          <h5 class="card-title mb-3">辨識詳情</h5>
           <p class="card-text">
             <strong>紀錄 ID:</strong> <small>{{ record.id?.substring(0, 8) }}...</small>
           </p>
          <p v-if="record.severity_score !== null && record.severity_score !== undefined" class="card-text">
            <strong>嚴重程度:</strong>
            <span :class="severityClass" class="fw-bold">
              {{ record.severity_score.toFixed(2) }} ({{ severityDescription }})
            </span>
          </p>
           <p v-else class="card-text">
             <strong>嚴重程度:</strong> <span class="text-muted">未評分</span>
           </p>
           
          <h6 class="mt-3 mb-2">偵測到的物件:</h6>
          <ul v-if="formattedResults.length > 0" class="list-group list-group-flush result-list">
            <li v-for="res in formattedResults" :key="res.id" class="list-group-item d-flex justify-content-between align-items-center px-0 py-1">
              <span :class="{'text-danger': res.class === '處理錯誤'}">{{ res.class }}</span>
              <span v-if="res.confidence_float !== undefined" class="badge rounded-pill" :class="confidenceBadgeClass(res.confidence_float)">
                信心度: {{ res.confidence_str }}
              </span>
               <span v-else-if="res.class === '處理錯誤'" class="badge bg-danger rounded-pill">
                  錯誤
               </span>
            </li>
          </ul>
          <p v-else class="text-muted small">未偵測到物件。</p>

          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-card {
  border: 1px solid #dee2e6;
}
.image-container img {
  max-width: 100%;
  height: auto;
  max-height: 300px; /* 限制圖片最大高度 */
  object-fit: contain; /* 保持圖片比例 */
  display: block;
  margin: 0 auto; /* 居中 */
  background-color: #f8f9fa; /* 淺灰色背景 */
  border: 1px solid #eee;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.card-subtitle {
    font-size: 0.95rem;
}
.result-list {
    font-size: 0.9rem;
}
.badge {
  font-size: 0.75rem;
  padding: 0.3em 0.6em;
}
.confidence-high { background-color: rgba(76, 175, 80, 0.2); color: #2e7d32; }
.confidence-medium { background-color: rgba(255, 193, 7, 0.2); color: #ff8f00; }
.confidence-low { background-color: rgba(244, 67, 54, 0.2); color: #c62828; }

pre {
    background-color: #eee;
    padding: 0.5rem;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 200px;
    overflow-y: auto;
}



</style> 