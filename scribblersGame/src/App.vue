<script setup lang="ts">
import { RouterView } from 'vue-router'
import { SettingState } from '@/stores/SettingState'
import SettingsOverlay from '@/components/SettingsOverlay.vue'

const settingsState = SettingState()
</script>

<template>
  <div class="app-wrapper">
    <!-- Dim background when settings overlay is open -->
    <div v-if="settingsState.showSettings" class="background-dim"></div>

    <!-- Main app content -->
    <div class="main-content">
      <RouterView />
    </div>

    <!-- Settings modal overlay -->
    <SettingsOverlay v-if="settingsState.showSettings" />
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background-dim {
  position: fixed;
  inset: 0;
  background: rgba(191, 189, 189, 0.4);
  z-index: 998;
}

.main-content {
  position: relative;
  z-index: 1;
}
</style>
