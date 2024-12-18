<template>
  <div class="container">
    <div class="content-section">
      <div class="table-section">
        <el-input
          v-model="searchText"
          placeholder="输入学号或姓名搜索"
          prefix-icon="el-icon-search"
          class="mb-4">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        </el-input>
        
        <el-table
          :data="filteredGradeList"
          height="600"
          style="width: 100%"
          :border="true"
          :header-cell-style="{ background: '#f0f9eb', color: '#606266' }"
          @current-change="handleCurrentChange"
          highlight-current-row
        >
          <el-table-column prop="id" label="序号" width="80" />
          <el-table-column prop="njuid" label="学号" width="120" />
          <el-table-column prop="sname" label="姓名" width="120" />
          <el-table-column prop="middle" label="期中" width="120" sortable>
            <template #default="scope">
              <el-input
                v-model="scope.row.middle"
                @change="validateGrade(scope.row, 'middle')"
              />
            </template>
          </el-table-column>
          <el-table-column prop="finall" label="期末" width="120" sortable>
            <template #default="scope">
              <el-input
                v-model="scope.row.finall"
                @change="validateGrade(scope.row, 'finall')"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info-section">
        <div class="selected-info">
          <h2>学生信息</h2>
          <div class="info-item">
            <label>序号：</label>
            <span>{{ selectedRow ? selectedRow.id : '-' }}</span>
          </div>
          <div class="info-item">
            <label>学号：</label>
            <span>{{ selectedRow ? selectedRow.njuid : '-' }}</span>
          </div>
          <div class="info-item">
            <label>姓名：</label>
            <span>{{ selectedRow ? selectedRow.sname : '-' }}</span>
          </div>
          <div class="info-item">
            <label>期中成绩：</label>
            <span>{{ selectedRow ? selectedRow.middle : '-' }}</span>
          </div>
          <div class="info-item">
            <label>期末成绩：</label>
            <span>{{ selectedRow ? selectedRow.finall : '-' }}</span>
          </div>
        </div>
        <div class="button-section">
          <el-button type="primary" @click="confirmUpload" :loading="isSubmitting" class="action-btn">
            确认录入
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  setup() {
    const gradelist = ref([])
    const selectedRow = ref(null)
    const searchText = ref('')
    const isSubmitting = ref(false)

    const filteredGradeList = computed(() => {
      if (!searchText.value) return gradelist.value
      const lowercasedSearch = searchText.value.toLowerCase()
      return gradelist.value.filter(
        student =>
          student.njuid.toLowerCase().includes(lowercasedSearch) ||
          student.sname.toLowerCase().includes(lowercasedSearch)
      )
    })

    const getGradeList = async () => {
      try {
        const response = await axios.get("http://103.133.176.168:8080/student/grade", {
          headers: { "Content-Type": "application/json" }
        })
        gradelist.value = response.data.data.filter(item => item != null)
      } catch (error) {
        console.error('Error fetching grade list:', error)
        ElMessage.error('获取成绩列表失败')
      }
    }

    const handleCurrentChange = (row) => {
      selectedRow.value = row
    }

    const validateGrade = (row, field) => {
      const grade = parseFloat(row[field])
      if (isNaN(grade) || grade < 0 || grade > 100) {
        ElMessage.warning('成绩必须是0到100之间的数字')
        row[field] = ''
      }
    }

    const confirmUpload = async () => {
      isSubmitting.value = true
      try {
        for (const student of gradelist.value) {
          await axios.post("http://103.133.176.168:8080/student/gradeimport", null, {
            headers: { "Content-Type": "application/json" },
            params: {
              njuid: student.njuid,
              middle: student.middle,
              finall: student.finall,
            }
          })
        }
        ElMessage.success('成绩更新成功')
      } catch (error) {
        console.error('Error updating grades:', error)
        ElMessage.error('成绩更新失败')
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(getGradeList)

    return {
      gradelist,
      selectedRow,
      searchText,
      isSubmitting,
      filteredGradeList,
      handleCurrentChange,
      validateGrade,
      confirmUpload
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-section {
  display: flex;
  gap: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.table-section {
  flex: 2;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selected-info {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
}

.info-item {
  margin-bottom: 10px;
}

.info-item label {
  font-weight: bold;
  margin-right: 5px;
}

.action-btn {
  width: 100%;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: #e6f7ff !important;
}

.mb-4 {
  margin-bottom: 16px;
  width: 300px;
}
</style>