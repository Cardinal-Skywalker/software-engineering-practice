<template>
  <el-container style="height: 100vh;">
    <!-- 侧边栏 -->
    <el-aside :style="{ background: 'linear-gradient(135deg, #C55A11, #8B4513)' }">
      <el-menu
        :default-active="route.path"
        background-color="#C55A11"
        text-color="#ecf0f1"
        active-text-color="#FFD700"
        :unique-opened="true"
        :collapse="false"
        :collapse-transition="false"
        :router="true"
        class="menu"
      >
        <el-menu-item @click="router.push('/classinfo')">
          <el-icon :size="22"><Timer /></el-icon>
          <span>班级信息</span>
        </el-menu-item>
        <el-menu-item @click="router.push('/attendance')">
          <el-icon :size="22"><DocumentationIcon /></el-icon>
          <span>课堂考勤</span>
        </el-menu-item>
        <!-- <el-menu-item @click="router.push('/homework')">
          <el-icon :size="22"><DocumentationIcon /></el-icon>
          <span>作业管理</span>
        </el-menu-item> -->
        <el-menu-item @click="router.push('/import/grade-list')">
          <el-icon :size="22"><Trophy /></el-icon>
          <span>考试录入</span>
        </el-menu-item>
        <el-menu-item @click="router.push('/import/student-list')">
          <el-icon :size="22"><User /></el-icon>
          <span>名单导入</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-main style="padding: 20px; background-color: #f5f5f5;">
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import DocumentationIcon from '../components/icons/IconDocumentation.vue';
  import { RouterView } from 'vue-router';

  // 侧边栏折叠状态
  const isCollapse = ref(false);

  // 使用useRouter和useRoute
  const router = useRouter();
  const route = useRoute();
</script>

<style>
/* 侧边栏样式 */
.el-aside {
  background: linear-gradient(135deg, #C55A11, #8B4513); /* 渐变背景 */
  border-right: 1px solid #2c3e50; /* 深色边框 */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); /* 增加更柔和的阴影 */
  border-radius: 15px 0 0 15px; /* 圆角效果 */
  transition: all 0.3s ease; /* 侧边栏平滑过渡 */
}

/* 菜单项样式 */
.el-menu {
  margin-top: 20px;
}

.el-menu-item {
  font-size: 16px;
  font-weight: 500;
  padding: 12px 20px; /* 增加内边距 */
  border-radius: 8px; /* 圆角效果 */
  transition: background-color 0.3s ease, transform 0.2s ease, padding-left 0.2s ease; /* 添加平滑过渡 */
}

.el-menu-item:hover {
  background-color: #8B4513; /* 悬停时背景色 */
  padding-left: 25px; /* 鼠标悬停时，左侧增加间距 */
  transform: translateX(5px); /* 菜单项微移动 */
}

/* 菜单项图标 */
.el-icon {
  margin-right: 14px; /* 图标与文字之间的间距 */
  color: #ecf0f1; /* 图标颜色 */
  transition: color 0.3s ease; /* 图标颜色过渡 */
}

.el-menu-item:hover .el-icon {
  color: #FFD700; /* 悬停时改变图标颜色 */
}

/* 主体内容区域 */
.el-main {
  background-color: #f5f5f5; /* 主体区域浅灰色背景 */
  padding: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); /* 主体区域阴影 */
  border-radius: 8px; /* 圆角效果 */
  transition: background-color 0.3s ease-in-out; /* 背景色平滑过渡 */
}

/* 高亮菜单项 */
.el-menu-item.is-active {
  background-color: #FFD700; /* 高亮项背景颜色 */
  color: #fff; /* 高亮项文字颜色 */
  font-weight: 700; /* 高亮项加粗 */
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.7); /* 高亮时加上光晕效果 */
  transform: scale(1.05); /* 高亮项放大效果 */
}
</style>
