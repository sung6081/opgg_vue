<!-- App.vue -->
<template>
  <div>
    <AppToolbar />
    <router-view />
  </div>
</template>

<script>
import AppToolbar from '@/components/AppToolbar.vue'

export default {
  components: {
    AppToolbar,
  },
}
</script>
