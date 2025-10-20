<script setup>
import { computed } from 'vue';

const props = defineProps({
  healthyCount: {
    type: Number,
    required: true,
    default: 0
  },
  diseaseCount: {
    type: Number,
    required: true,
    default: 0
  },
  size: { // 允許自訂大小
    type: String,
    default: '100px'
  }
});

const totalCount = computed(() => props.healthyCount + props.diseaseCount);

// 計算健康百分比 (0 到 100)
const healthyPercent = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((props.healthyCount / totalCount.value) * 100);
});

// 計算 CSS conic-gradient 屬性
const pieStyle = computed(() => {
  if (totalCount.value === 0) {
    // 如果沒有數據，顯示灰色
    return {
      background: '#e9ecef' // Bootstrap 'light' color
    };
  }
  
  // --color-healthy 和 --color-disease 會在 style 區塊中定義
  // conic-gradient 會從 0% 到 healthyPercent% 顯示健康色，
  // 之後顯示病害色，直到 100%
  const gradient = `conic-gradient(
    var(--color-healthy) 0% ${healthyPercent.value}%, 
    var(--color-disease) ${healthyPercent.value}% 100%
  )`;
  
  return {
    background: gradient
  };
});
</script>

<template>
  <div class="pie-chart-container" :style="{ width: size, height: size }">
    <div class="pie-chart" :style="pieStyle">
      <div class="pie-center-label">
        <strong>{{ healthyPercent }}%</strong>
        <span v-if="totalCount > 0">健康</span>
        <span v-else>N/A</span>
      </div>
    </div>
    <div class="pie-legend">
      <div class="legend-item">
        <span class="dot healthy"></span> 健康 ({{ healthyCount }})
      </div>
      <div class="legend-item">
        <span class="dot disease"></span> 病害 ({{ diseaseCount }})
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 定義顏色變數 */
:root {
  --color-healthy: #28a745; /* Bootstrap success */
  --color-disease: #dc3545; /* Bootstrap danger */
}

.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem; /* 圖表和圖例之間的間距 */
  font-size: 0.9rem;
}

.pie-chart {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* 動畫效果 */
  transition: background 0.5s ease;
  animation: pie-fade-in 0.5s ease-out;
}

@keyframes pie-fade-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* 中間的白色圓形和文字 */
.pie-center-label {
  position: relative; /* 確保在漸層之上 */
  width: 75%; /* 內圓大小 */
  height: 75%;
  background: #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.2;
  text-align: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.pie-center-label strong {
  font-size: 1.25em; /* 相對大小 */
  color: #333;
}
.pie-center-label span {
  font-size: 0.85em;
  color: var(--color-healthy);
}
.pie-center-label span:not(:last-child) {
   color: #666; /* N/A 的顏色 */
}

/* 圖例 */
.pie-legend {
  display: flex;
  gap: 1rem;
  justify-content: center;
  color: #555;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.dot.healthy {
  background-color: var(--color-healthy);
}
.dot.disease {
  background-color: var(--color-disease);
}
</style>