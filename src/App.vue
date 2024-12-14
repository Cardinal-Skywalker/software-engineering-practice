<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <el-container class="home-container" style="width: 100%;">
    <el-header><!--头部区-->
      <div>
        <img src="./assets/NJUlogo.svg" alt="" style="width: 50px; height: 50px; margin-right: 10px;">
        <span>软件工程实践课堂考核系统</span>
      </div>
      <el-button v-if="!isLoggedIn" class="login-button" type="info" @click="handleLogin">登录</el-button> 
      <el-button class="logout-button" type="info" @click="logout">退出</el-button> 
     
    </el-header>
    <RouterView />
  </el-container>
</template>

<script>
export default {
    data() {
      return {
        // 添加一个布尔变量来控制登录按钮的显示与隐藏
        isLoggedIn: false
      };
    },
    methods:{
      logout(){
        localStorage.clear();
        this.isLoggedIn = false;
        this.$router.push('/');
      },
      handleLogin() {
      // 在这里处理登录逻辑
      // 登录成功后，将 isLoggedIn 设置为 true
      this.isLoggedIn = true;
      // 跳转到登录页面
      this.$router.push('/user/login');
      },
    }
};
</script>

<style>
  .el-header{
    background-color: #C55A11;
    display: flex; 
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: white;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
  }

  .home-container {
  height: 100%;
  width: 100%;
}

:root {
  --login-button-position: 120px; /* 登录按钮的右侧位置 */
  --logout-button-position: 10px; /* 退出按钮的右侧位置 */
  --button-width: 100px; /* 按钮宽度 */
  --button-height: 50px; /* 按钮高度 */
}

.login-button, .logout-button {
  padding: 10px 20px;
  font-size: 16px;
  width: var(--button-width);
  height: var(--button-height);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button {
  position: fixed;
  right: var(--login-button-position);
  top: 20px; /* 可以调整按钮的垂直位置 */
  background: linear-gradient(135deg, #6f4f1e, #3e2a1d); /* 棕色渐变背景 */
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-button:hover {
  background: linear-gradient(135deg, #8b6b3b, #5c4028); /* 悬停时的渐变效果 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.logout-button {
  position: fixed;
  right: var(--logout-button-position);
  top: 20px; /* 退出按钮垂直位置 */
  background: linear-gradient(135deg, #f44336, #d32f2f); /* 红色渐变背景 */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  width: var(--button-width);
  height: var(--button-height);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logout-button:hover {
  background: linear-gradient(135deg, #e57373, #c62828); /* 悬停时背景变浅 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

  body{
      background-image:url("./assets/Home_BackGround.png") ;
      background-repeat:"no-repeat";
      background-size: cover;
      width:"100%";
      height:"100%";
      /* position:"fixed"; */
      top:"0px";
      left:"0px";

      /* overflow:"hidden"; */
    } 
  .element {
    overflow: hidden;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;height: 0;
  }
</style>
