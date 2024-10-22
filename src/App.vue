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
      <el-button type="info" @click="logout">退出</el-button>  
    </el-header>
    <RouterView />
  </el-container>
</template>

<script>
export default {
    methods:{
      logout(){
        localStorage.clear();
        this.$router.push('/user/login');
      }
    }
};
</script>

<style>
  .el-header{
    background-color: #d672d6;
    display: flex; 
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #0e0d0d;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
  }

  .home-container{
    height: 100%;
    width: 100%;
  }



  body{
      background-image:url("./assets/background.jpg") ;
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
