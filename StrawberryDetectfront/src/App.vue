<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <h1>草莓病蟲害辨識系統</h1>
      <nav>
        <RouterLink :to="{ name: 'home' }">上傳辨識</RouterLink>
        <RouterLink :to="{ name: 'historyLanding' }">查看歷史紀錄</RouterLink>
        <RouterLink :to="{ name: 's3Trigger' }">S3 批次觸發</RouterLink>
      </nav>
  </header>
  
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  </template>