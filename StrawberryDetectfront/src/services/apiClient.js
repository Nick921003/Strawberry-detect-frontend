import axios from 'axios';

// 從環境變數讀取 API 的基礎 URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

// 建立一個 Axios 實例 (instance)
const apiClient = axios.create({
  baseURL: baseURL, // 設定 API 的基本路徑
  timeout: 150000, // 設定請求超時時間 (例如 30 秒)
  headers: {
    'Content-Type': 'application/json', // 預設請求內容類型為 JSON
    // 如果你的 API 需要身份驗證 (例如 Token)，可以在這裡或請求時加入
    // 'Authorization': `Bearer ${your_token}`
  }
});

// 你可以在這裡加入請求攔截器 (interceptors)，例如統一處理錯誤或加入驗證 Token
apiClient.interceptors.response.use(
  response => response, // 成功的回應直接回傳
  error => {
    // 在這裡可以做全域的錯誤處理
    console.error('API 請求錯誤:', error.response || error.message);
    // 可以根據 error.response.status 做不同的處理，例如 401 跳轉登入頁
    return Promise.reject(error); // 把錯誤繼續拋出，讓呼叫的地方也能處理
  }
);

export default apiClient; // 將設定好的 Axios 實例匯出