<script setup>
  import { ref } from 'vue';
  import DocumentationIcon from '../components/icons/IconDocumentation.vue'
  import { RouterLink, RouterView } from 'vue-router'

  // 侧边栏折叠状态
  const isCollapse = ref(false);
</script>

<template>

      >
        <el-menu-item @click="this.$router.push('/classinfo')">
          <el-icon :size="20"><Timer /></el-icon>
          <span>班级信息</span>
        </el-menu-item>

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
      </el-menu>
    </el-aside>

    <!-- 主体内容 -->
    <el-main style="padding: 20px; background-color: #ecf0f1;">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>


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
