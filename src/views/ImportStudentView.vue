<template>
	<div class="container">
	  <div class="content-section">
		<div class="table-section">
		  <el-table
			:data="studentData"
			height="600"
			style="width: 100%"
			:border="true"
			:header-cell-style="{ background: '#f0f9eb', color: '#606266' }"
			@current-change="handleCurrentChange"
			highlight-current-row
		  >
			<el-table-column prop="index" label="序号" width="80">
			  <template #default="scope">
				<el-input
				  v-model="scope.row.index"
				  @change="validateIndex(scope.row)"
				  :disabled="!scope.row.isEditing"
				></el-input>
			  </template>
			</el-table-column>
			<el-table-column prop="studentId" label="学号" width="120">
			  <template #default="scope">
				<el-input
				  v-model="scope.row.studentId"
				  @change="validateStudentId(scope.row)"
				  :disabled="!scope.row.isEditing"
				></el-input>
			  </template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120">
			  <template #default="scope">
				<el-input
				  v-model="scope.row.name"
				  @change="validateName(scope.row)"
				  :disabled="!scope.row.isEditing"
				></el-input>
			  </template>
			</el-table-column>
			<el-table-column label="操作" width="120">
			  <template #default="scope">
				<el-button
				  :type="scope.row.isEditing ? 'success' : 'primary'"
				  @click="toggleEdit(scope.row)"
				  size="small"
				>
				  {{ scope.row.isEditing ? '保存' : '编辑' }}
				</el-button>
			  </template>
			</el-table-column>
		  </el-table>
		</div>
		<div class="info-section">
		  <div class="selected-info">
			<div class="info-item">
			  <label>序号：</label>
			  <span>{{ selectedRow ? selectedRow.index : '-' }}</span>
			</div>
			<div class="info-item">
			  <label>学号：</label>
			  <span>{{ selectedRow ? selectedRow.studentId : '-' }}</span>
			</div>
			<div class="info-item">
			  <label>姓名：</label>
			  <span>{{ selectedRow ? selectedRow.name : '-' }}</span>
			</div>
		  </div>
		  <el-upload
			  action="#"
			  :auto-upload="false"
			  :show-file-list="false"
			  :on-change="handleFileChange"
			  accept=".xls,.xlsx"
			  class ="action-upload"
			>
			  <el-button type="warning" class="action-btn circular-btn">
				导入表格
			  </el-button>
		  </el-upload>
		  <div class="button-section">			
			<el-button type="primary" @click="confirmUpload" :loading="isSubmitting" class="action-btn">
			  确认录入
			</el-button>
			<el-button type="success" @click="addNewRow" class="action-btn">
			  添加新行
			</el-button>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
<script setup>
  import { ref, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Upload } from '@element-plus/icons-vue'
  import * as XLSX from 'xlsx'
  
  const studentData = ref([])
  const isSubmitting = ref(false)
  const selectedRow = ref(null)
  
  const totalCount = computed(() => studentData.value.length)
  const completedCount = computed(() => 
	studentData.value.filter(row => row.studentId && row.name).length
  )
  
  const handleCurrentChange = (currentRow) => {
	selectedRow.value = currentRow
  }
  
  const handleFileChange = (file) => {
	const reader = new FileReader()
	reader.onload = (e) => {
	  try {
		const data = new Uint8Array(e.target.result)
		const workbook = XLSX.read(data, { type: 'array' })
		const firstSheetName = workbook.SheetNames[0]
		const worksheet = workbook.Sheets[firstSheetName]
		const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['index', 'studentId', 'name', 'photo'] })
  
		// Remove header row and validate data
		const validData = jsonData.slice(1).filter(row => row.studentId && row.name)
  
		if (validData.length === 0) {
		  ElMessage.error('文件中没有有效的学生数据')
		  return
		}
  
		studentData.value = validData.map((item, index) => ({
		  index: String(index + 1),
		  studentId: String(item.studentId || ''),
		  name: String(item.name || ''),
		  isEditing: false
		}))
  
		ElMessage.success('文件解析成功')
	  } catch (error) {
		console.error(error)
		ElMessage.error('文件解析失败，请确保文件格式正确')
	  }
	}
	reader.readAsArrayBuffer(file.raw)
  }
  
  const confirmUpload = async () => {
  if (studentData.value.length === 0) {
    ElMessage.warning('没有数据可以上传')
    return
  }

  try {
    isSubmitting.value = true

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(studentData.value.map(row => ({
      序号: row.index,
      学号: row.studentId,
      姓名: row.name
    })))
    XLSX.utils.book_append_sheet(wb, ws, "学生信息")

    // 生成 XLS 文件
    const xlsBuffer = XLSX.write(wb, { type: 'array', bookType: 'xls' })
    const xlsFile = new File([xlsBuffer], 'student_data.xls', { type: 'application/vnd.ms-excel' })

    // 创建 FormData 对象并添加文件
    const formData = new FormData()
    formData.append('file', xlsFile)

    // 发送 XLS 文件到后端
    const response = await fetch('http://103.133.176.168:8080/student/import', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
	console.log('Server response:', result); // 在控制台打印 result

    if (result.code === "0") {
      ElMessage.success('数据上传成功')
      studentData.value = [] // 清空数据
      selectedRow.value = null
    } else {
      throw new Error(result.message || '上传失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '数据上传失败')
  } finally {
    isSubmitting.value = false
  }
  }
  
  const toggleEdit = (row) => {
	row.isEditing = !row.isEditing
	if (!row.isEditing) {
	  validateRow(row)
	}
  }
  
  const validateIndex = (row) => {
	row.index = parseInt(row.index) || studentData.value.indexOf(row) + 1
  }
  
  const validateStudentId = (row) => {
	row.studentId = String(row.studentId || '').trim()
  }
  
  const validateName = (row) => {
	row.name = String(row.name || '').trim()
  }
  
  const validateRow = (row) => {
	validateIndex(row)
	validateStudentId(row)
	validateName(row)
  }
  
  const addNewRow = () => {
	const newIndex = studentData.value.length + 1
	studentData.value.push({
	  index: String(newIndex),
	  studentId: '',
	  name: '',
	  isEditing: true
	})
  }
</script>
  
<style scoped>
.container {
display: flex;
flex-direction: column;
gap: 20px;
padding: 20px;
background-color: #f5f7fa;
min-height: 100vh;
}

.content-section {
display: flex;
gap: 20px;
background-color: #ffffff;
border-radius: 8px;
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
padding: 20px;
/* align-items: center; */
justify-content: center;
}

.table-section {
flex: 1;
}

.info-section {
flex: 1;
display: flex;
flex-direction: column;
gap: 20px;
}

.selected-info {
background-color: #f0f9eb;
padding: 20px;
border-radius: 8px;
}

.info-item {
margin-bottom: 15px;
display: flex;
align-items: center;
}

.info-item label {
font-weight: bold;
width: 60px;
}


.status-info {
color: #67c23a;
font-weight: bold;
}

.button-section {
display: flex;

justify-content: center;
gap: 15px;
margin-top: auto;
}
.action-upload {
display: flex; 
/* align-items: center;  */
justify-content: center;
width: 100%;
}
.action-btn {
width: 100%;

}
.circular-btn {
width: 100px; /* 设置按钮的宽度 */
height: 100px; /* 设置按钮的高度，使其与宽度相等 */
border-radius: 50%; /* 设置边框半径为50%以创建圆形 */
display: flex; 
align-items: center; 
padding: 0; /* 移除内边距 */
font-size: 14px; /* 调整字体大小 */
color: white; /* 文字颜色 */
background-color: #eb5612;
cursor: pointer; /* 鼠标悬停时显示手形图标 */
transition: background-color 0.3s, transform 0.3s; /* 平滑过渡效果 */
}
/* 鼠标悬停时的样式 */
.circular-btn:hover {
  background-color: #ff6600; /* 悬停时的背景颜色 */
}

/* 鼠标点击时的样式 */
.circular-btn:active {
  background-color: #c44500; /* 点击时的背景颜色 */
  transform: scale(0.95); /* 点击时稍微缩小按钮 */
}
:deep(.el-table) {
border-radius: 8px;
overflow: hidden;
}

:deep(.el-table__header) {
background-color: #f0f9eb;
}

:deep(.el-input__inner) {
text-align: center;
}

:deep(.el-table .current-row) {
background-color: #f0f9eb;
}
</style>

