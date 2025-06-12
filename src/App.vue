<template>
  <div id="app">
    <!-- 툴바 -->
    <AppToolbar />

    <!-- 본문 콘텐츠는 툴바 높이만큼 아래에 배치 -->
    <main class="pt-16">
      <router-view /> 
    </main>
  </div>
</template>

<script>
import AppToolbar from './components/AppToolbar.vue'

export default {
  components: {
    AppToolbar
  }
}
</script>
