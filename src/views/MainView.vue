<script setup>
  import { ref } from 'vue';
  import DocumentationIcon from '../components/icons/IconDocumentation.vue'
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

<el-container>
  <el-container>
    <el-aside width="200px">
      <el-menu 
      :default-active="this.$route.path"
      background-color="#C55A11"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="true" 
      :collapse="isCollapse" :collapse-transition="false"
      :router="true"
      >
        <el-menu-item @click="this.$router.push('/attendance');">
          <el-icon :size="48"><Timer /></el-icon>
          <span>课堂考勤</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/homework')">
          <el-icon :size="48"><DocumentationIcon /></el-icon>
          <span>作业管理</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/import/grade-list')">
          <el-icon :size="48"><Trophy /></el-icon>
          <span>考试录入</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/import/student-list')">
          <el-icon :size="48"><User /></el-icon>
          <span>名单导入</span>
        </el-menu-item>
      </el-menu>>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</el-container>
    
</template>


<style scoped>
  .el-aside{
     background-color: #ff8f57;
 }
  .el-main{
     background-color: white;
 }
</style>


