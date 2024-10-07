<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div> {{ webUrl }}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const webUrl = ref(process.env.VUE_APP_WEBSERVER)

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
