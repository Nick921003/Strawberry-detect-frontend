import apiClient from './apiClient'; // 匯入我們剛剛設定好的 apiClient

/**
 * 上傳圖片進行辨識 (支援單張或多張)
 * @param {FormData} formData 包含 'images' 欄位的 FormData 物件
 * @returns {Promise} Axios 回應 Promise 物件 (包含辨識結果)
 */
export const uploadImages = (formData) => {
  return apiClient.post('upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 上傳檔案需要用 multipart/form-data
    }
  });
};

/**
 * 獲取手動上傳歷史紀錄
 * @param {number} [page=1] 要獲取的頁碼
 * @returns {Promise} Axios 回應 Promise 物件 (包含歷史紀錄列表和分頁資訊)
 */
export const getManualHistory = (page = 1) => {
  return apiClient.get('/history/manual/', {
    params: { page: page } // 將頁碼作為查詢參數
  });
};

/**
 * 獲取批次任務歷史紀錄
 * @param {number} [page=1] 要獲取的頁碼
 * @returns {Promise} Axios 回應 Promise 物件 (包含批次任務列表和分頁資訊)
 */
export const getBatchHistory = (page = 1) => {
    return apiClient.get('/history/batch/', {
        params: { page: page }
    });
};

/**
 * 根據 ID 獲取單筆辨識紀錄詳情
 * @param {string} recordId 辨識紀錄的 UUID
 * @returns {Promise} Axios 回應 Promise 物件 (包含紀錄詳情)
 */
export const getRecordDetail = (recordId) => {
    // 注意 URL 中的斜線，確保與後端 API 路由匹配
    return apiClient.get(`/record/${recordId}/`);
};

/**
 * 根據 ID 獲取單筆批次任務詳情
 * @param {string} batchId 批次任務的 UUID
 * @returns {Promise} Axios 回應 Promise 物件 (包含批次任務詳情)
 */
export const getBatchDetail = (batchId) => {
    return apiClient.get(`/batch/${batchId}/`);
};

/**
 * 觸發 S3 資料夾批次處理任務
 * @param {string} bucketName S3 儲存桶名稱
 * @param {string} folderPrefix S3 資料夾前綴
 * @returns {Promise} Axios 回應 Promise 物件 (包含任務提交成功的訊息和 Celery Task ID)
 */
export const triggerS3Batch = (bucketName, folderPrefix) => {
    return apiClient.post('/process_s3_folder/', {
        s3_bucket_name: bucketName,
        s3_folder_prefix: folderPrefix
    }); // 這裡使用預設的 application/json Content-Type
};


// 你可以在這裡繼續加入其他 API 呼叫函式...