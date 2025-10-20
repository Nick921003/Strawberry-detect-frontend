<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { triggerS3Batch } from '../services/detectionService';

const bucketName = ref('');
const folderPrefix = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  if (!bucketName.value || !folderPrefix.value) {
    errorMessage.value = '儲存桶名稱和資料夾前綴為必填項。';
    isLoading.value = false;
    return;
  }

  try {
    const response = await triggerS3Batch(bucketName.value, folderPrefix.value);
    successMessage.value = `任務提交成功！Task ID: ${response.data.celery_task_id || 'N/A'}`; // 【修正】匹配 views.py 回傳的 task id
    bucketName.value = '';
    folderPrefix.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.detail || error.message || '觸發失敗';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main> <h2>S3 批次任務觸發</h2>
    <p class="text-muted">
      在此手動提交 S3 儲存桶中的資料夾進行批次辨識。
    </p>

    <div v-if="successMessage" class="alert alert-success" role="alert">
      {{ successMessage }}
      <hr>
      <RouterLink :to="{ name: 'batchHistory' }" class="btn btn-sm btn-outline-success">
        前往查看批次歷史 (可能需稍候)
      </RouterLink>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit" class="card card-body shadow-sm">
      <div class="mb-3">
        <label for="s3Bucket" class="form-label">S3 儲存桶名稱 (Bucket Name)</label>
        <input
          type="text"
          class="form-control"
          id="s3Bucket"
          v-model.trim="bucketName"
          placeholder="例如：my-strawberry-bucket"
          :disabled="isLoading"
        />
      </div>
      <div class="mb-3">
        <label for="s3Prefix" class="form-label">S3 資料夾前綴 (Folder Prefix)</label>
        <input
          type="text"
          class="form-control"
          id="s3Prefix"
          v-model.trim="folderPrefix"
          placeholder="例如：raw-images/batch-001/"
          :disabled="isLoading"
        />
        <div class="form-text">
          請確保後端有權限讀取此路徑。結尾的斜線 `/` 通常是必要的。
        </div>
      </div>
      
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ isLoading ? ' 提交中...' : '開始批次處理' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
/* 【移除】 .s3-trigger-container, h2, .text-muted */
</style>