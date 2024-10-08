<template>
    <el-table :data="formattedData">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="value" label="值" />
      <el-table-column prop="desc" label="" />
    </el-table>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const data = ref([
        { name: '姓名', value: '张三', desc: '测试数据' },
        { name: '年龄', value: 20, desc: '测试数据' },
        { name: '性别', value: '男', desc: '测试数据' },
      ]);
  
      const formattedData = data.value.map(item => ({
        name: item.name,
        value: item.value,
        desc: item.desc,
      }));
  
      return {
        formattedData,
      };
    },
  };
  </script>

<style></style>
