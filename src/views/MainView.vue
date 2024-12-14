<script setup>
  import { ref } from 'vue';
  import DocumentationIcon from '../components/icons/IconDocumentation.vue'
  import { RouterLink, RouterView } from 'vue-router'

  // 侧边栏折叠状态
  const isCollapse = ref(false);
</script>

<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside width="200px" :style="{ backgroundColor: '#34495e' }">
      <el-menu
        :default-active="this.$route.path"
        background-color="#34495e"
        text-color="#ecf0f1"
        active-text-color="#f39c12"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        class="menu"
      >
        <el-menu-item @click="this.$router.push('/classinfo')">
          <el-icon :size="20"><Timer /></el-icon>
          <span>班级信息</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/attendance')">
          <el-icon :size="20"><Timer /></el-icon>
          <span>课堂考勤</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/homework')">
          <el-icon :size="20"><DocumentationIcon /></el-icon>
          <span>作业管理</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/import/grade-list')">
          <el-icon :size="20"><Trophy /></el-icon>
          <span>考试录入</span>
        </el-menu-item>
        <el-menu-item @click="this.$router.push('/import/student-list')">
          <el-icon :size="20"><User /></el-icon>
          <span>名单导入</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-main style="padding: 20px; background-color: #ecf0f1;">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
/* 侧边栏样式 */
.el-aside {
  background-color: #34495e; /* 深灰色背景 */
  border-right: 1px solid #2c3e50; /* 更深的边框颜色 */
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}

/* 菜单项样式 */
.el-menu {
  margin-top: 20px;
}

.el-menu-item {
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease, padding-left 0.3s ease; /* 添加过渡效果 */
}

.el-menu-item:hover {
  background-color: #2c3e50; /* 悬停时的背景色 */
  padding-left: 20px; /* 鼠标悬停时，左侧添加间距，使其更加突出 */
}

/* 菜单项图标 */
.el-icon {
  margin-right: 10px;
  color: #ecf0f1; /* 图标的颜色 */
  transition: color 0.3s ease; /* 添加图标的颜色过渡效果 */
}

.el-menu-item:hover .el-icon {
  color: #f39c12; /* 悬停时改变图标颜色 */
}

/* 主体内容区域 */
.el-main {
  background-color: #ecf0f1; /* 主体区域淡灰色背景 */
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* 主体区域加阴影效果 */
}

/* 响应式布局，侧边栏在小屏幕上折叠 */
@media screen and (max-width: 1024px) {
  .el-aside {
    width: 80px; /* 小屏幕下侧边栏缩小 */
  }

  .el-menu-item span {
    display: none; /* 小屏幕下隐藏文字 */
  }

  .el-menu-item {
    text-align: center; /* 中央对齐图标 */
  }
}

/* 高亮菜单项 */
.el-menu-item.is-active {
  background-color: #f39c12; /* 高亮项背景颜色 */
  color: #fff; /* 高亮项文字颜色 */
}
</style>
