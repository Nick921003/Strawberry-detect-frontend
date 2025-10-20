<script setup>
import { ref } from 'vue';

// 定義組件可以接收的 props (屬性) 和可以觸發的事件
const props = defineProps({
  uploading: { // 外部傳入的狀態，表示是否正在上傳中
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['files-selected']); // 定義一個事件，當選擇檔案後觸發

const selectedFiles = ref([]); // 用來存放使用者選擇的檔案 (File 物件)
const isDragging = ref(false); // 用來追蹤是否有檔案拖曳到區域上

// 處理檔案選擇 (點擊 input 或拖曳放下)
const handleFileChange = (event) => {
  let files;
  if (event.dataTransfer) { // 拖曳事件
    files = Array.from(event.dataTransfer.files);
    isDragging.value = false; // 拖曳結束
  } else { // input change 事件
    files = Array.from(event.target.files);
  }

  // 過濾掉非圖片檔案 (可選)
  selectedFiles.value = files.filter(file => file.type.startsWith('image/'));

  // 如果有選擇檔案，觸發 files-selected 事件，並將檔案列表傳遞出去
  if (selectedFiles.value.length > 0) {
    emit('files-selected', selectedFiles.value);
  }
};

// 清除已選擇的檔案 (例如上傳後)
const clearFiles = () => {
  selectedFiles.value = [];
  // 如果 input 元素還存在，可以清空它的值，以便可以再次選擇同一個檔案
  const inputElement = document.getElementById('image_input');
  if (inputElement) {
    inputElement.value = '';
  }
};

// 將 clearFiles 方法暴露給父組件使用 (如果需要)
defineExpose({
  clearFiles
});

// 處理拖曳進入事件
const handleDragEnter = (event) => {
  event.preventDefault(); // 阻止瀏覽器預設行為 (例如打開檔案)
  isDragging.value = true;
};

// 處理拖曳離開事件
const handleDragLeave = (event) => {
  event.preventDefault();
  isDragging.value = false;
};

// 處理拖曳在上方事件 (必須阻止預設行為才能觸發 drop)
const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true; // 保持 dragging 狀態
};

// 處理放下事件
const handleDrop = (event) => {
  event.preventDefault(); // 阻止瀏覽器預設行為
  handleFileChange(event); // 使用 handleFileChange 處理檔案
};

</script>

<template>
  <div class="image-uploader">
    <label
      for="image_input"
      class="drop-zone"
      :class="{ 'is-dragging': isDragging }"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <input
        type="file"
        id="image_input"
        accept="image/jpeg, image/png"
        multiple
        @change="handleFileChange"
        :disabled="uploading"
        style="display: none;"
      />

      <div v-if="uploading" class="upload-state">
        <p>正在上傳中...</p>
      </div>
      <div v-else-if="selectedFiles.length > 0" class="file-preview">
        <p>已選擇 {{ selectedFiles.length }} 個檔案：</p>
        <ul>
          <li v-for="file in selectedFiles" :key="file.name">
            {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
          </li>
        </ul>
        <p class="hint">可以再次點擊或拖曳來更換檔案</p>
      </div>
      <div v-else class="initial-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path d="M13 5.41V17a1 1 0 0 1-2 0V5.41l-3.3 3.3a1 1 0 0 1-1.4-1.42l5-5a1 1 0 0 1 1.4 0l5 5a1 1 0 1 1-1.4 1.42L13 5.4zM3 17a1 1 0 0 1 2 0v3h14v-3a1 1 0 0 1 2 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z" />
        </svg>
        <p><strong>點擊或拖曳檔案到此處</strong></p>
        <p class="hint">支援 JPG、PNG 格式 (可多選)</p>
      </div>
    </label>
  </div>
</template>

<style scoped>
.image-uploader {
  margin-bottom: 1.5rem;
  position: relative; /* 如果要放 loading overlay */
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px; /* 增加最小高度 */
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #666;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.drop-zone:hover {
  border-color: #aaa;
  background-color: #f0f0f0;
}

.drop-zone.is-dragging {
  border-color: #4CAF50; /* 拖曳時邊框變色 */
  background-color: #e8f5e9;
  color: #388E3C;
}

.drop-zone svg {
  fill: currentColor; /* 讓 SVG 顏色跟隨文字顏色 */
  margin-bottom: 0.8rem;
  width: 40px;
  height: 40px;
  opacity: 0.8;
}

.hint {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
}

.upload-state p,
.file-preview p:first-child {
  font-weight: bold;
  margin-bottom: 0.8rem;
}

.file-preview ul {
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  max-height: 100px; /* 限制列表高度 */
  overflow-y: auto; /* 超出範圍顯示滾動條 */
}
 .file-preview li {
   margin-bottom: 0.3rem;
   white-space: nowrap; /* 不換行 */
   overflow: hidden; /* 超出部分隱藏 */
   text-overflow: ellipsis; /* 超出部分顯示省略號 */
   max-width: 90%; /* 避免太長 */
   margin-left: auto;
   margin-right: auto;
 }
</style>