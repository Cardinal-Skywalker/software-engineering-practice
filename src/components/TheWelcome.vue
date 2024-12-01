<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    南京大学软件工程实践课堂考核系统是一个专为软件工程专业学生和教师设计的在线平台，旨在提供一个高效、便捷的考核和评估工具。
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Function</template>
    
    我们提供了多种系统功能，包括课堂点名、成绩录入、作业提交、成绩查询、课程管理等，帮助您更好地管理课程和考核工作。
    我们还提供了详细的用户手册和技术支持，帮助您更好地了解和使用系统。同时，我们还不断优化系统功能，以满足您的需求。

  </WelcomeItem>


  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>
    如在使用过程中遇到任何技术问题，欢迎通过系统内的“帮助中心”联系我们的技术支持团队。
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    南京大学软件工程实践课堂考核系统致力于为您提供一个优质的在线学习环境，我们期待您的加入，一起探索软件工程的奥秘！
  </WelcomeItem>
</template>

<style>
@media screen {
  
}
</style>
<!-- body{
  background-image:url("../assets/background.jpg") ;
  /* background-repeat:"no-repeat"; */
  background-size: cover;
  width:"100%";
  height:"100%";
  /* position:"fixed"; */
  top:"0px";
  left:"0px";

  /* overflow:"hidden"; */
}  -->