<script setup>
import { ref, computed } from 'vue';
import ImageUploader from '../components/ImageUploader.vue';
import ResultCard from '../components/ResultCard.vue';
import { uploadImages } from '../services/detectionService';

// --- 狀態 ---
const isUploading = ref(false);
const uploadApiResponse = ref(null);
const errorMessage = ref('');
const uploaderComponent = ref(null);
const currentView = ref('uploader'); // 'uploader' 或 'results'

// --- 計算屬性 ---
const resultsToDisplay = computed(() => {
  if (!uploadApiResponse.value) return [];
  if (Array.isArray(uploadApiResponse.value)) {
    return uploadApiResponse.value;
  } else if (typeof uploadApiResponse.value === 'object' && uploadApiResponse.value !== null) {
    return [uploadApiResponse.value];
  }
  return [];
});

// --- 方法 ---
const handleFilesSelected = async (files) => {
  console.log('接收到檔案:', files);
  errorMessage.value = '';
  isUploading.value = true;

  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  try {
    const response = await uploadImages(formData);
    console.log('上傳成功:', response.data);
    uploadApiResponse.value = response.data;
    currentView.value = 'results'; // 切換視圖

    if (uploaderComponent.value) {
      uploaderComponent.value.clearFiles();
    }
  } catch (error) {
    console.error('上傳失敗:', error);
    errorMessage.value = error.response?.data?.detail || error.message || '上傳過程中發生錯誤';
    if (uploaderComponent.value) {
      uploaderComponent.value.clearFiles();
    }
  } finally {
    isUploading.value = false;
  }
};

const resetToUploadView = () => {
  currentView.value = 'uploader';
  uploadApiResponse.value = null;
  errorMessage.value = '';
};
</script>

<template>
  <main>
    <div v-if="currentView === 'uploader'">
      <ImageUploader
        ref="uploaderComponent"
        :uploading="isUploading"
        @files-selected="handleFilesSelected"
      />
      <div v-if="errorMessage" class="error-message">
        <p>錯誤：{{ errorMessage }}</p>
      </div>
    </div>

    <div v-else>
      <div v-if="resultsToDisplay.length > 0" class="result-display">
        <div class="text-center mb-4">
          <button @click="resetToUploadView" class="btn btn-primary btn-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16" style="margin-right: 0.5rem; margin-bottom: 2px;">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
            </svg>
            繼續上傳新圖片
          </button>
        </div>
        <h2>辨識結果：</h2>
        <ResultCard
          v-for="result in resultsToDisplay"
          :key="result.id"
          :record="result"
        />
      </div>
      <div v-else-if="!isUploading" class="result-display text-center">
         <p class="text-muted">辨識完成，但未返回有效的結果資料。</p>
         <button @click="resetToUploadView" class="btn btn-primary mt-2">
            返回上傳
         </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 移除了 main { ... } 樣式 */

.error-message {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
}

.result-display {
  margin-top: 1.5rem;
}

/* h2 樣式已移至 main.css，但 result-display 內的 h2 可能需要微調 */
.result-display h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  /* border-bottom 和 padding 已在 main.css 統一套用 */
}

.btn-lg {
    padding: 0.75rem 1.25rem;
    font-size: 1.1rem;
}
</style>