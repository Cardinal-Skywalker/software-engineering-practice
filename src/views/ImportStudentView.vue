<template>

<el-upload action="/api/student/import"
	      :show-file-list="false"
	       :on-success="hanleSuccess"
	       accept=".xls">
	<el-button type="primary">导入名单<el-icon class="el-icon--right"><Upload /></el-icon></el-button>
</el-upload>


</template>

<script>

</script>

<style>

</style>