<template>
  <div class="dynamic-table">
    <h2>考勤表格</h2>
    <div class="controls">
      <el-input
        v-model="searchQuery"
        placeholder="输入学号或姓名搜索"
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="renewDataList">刷新数据</el-button>
    </div>
    <el-table
      class="atdInfo-table"
      :data="filteredTableData"
      ref="multipleTable"
      row-class-name="tableRowClassName"
      :header-cell-style="{
        background: '#409EFF',
        color: '#FFF',
        fontSize: '15px',
        fontWeight: 'bold',
        textAlign: 'center',
        border: '1px solid #409EFF'
      }"
      border
      :table-layout="auto"
      :cell-style="getCellStyle"
      style="width: 100%; height: 100%; overflow-x: auto;"
      :row-key="getRowKey"
      highlight-current-row
    >
      <el-table-column
        prop="id"
        label="序号"
        width="80"
        :sortable="false"
      ></el-table-column>
      <el-table-column
        prop="njuid"
        label="学号"
        sortable
      ></el-table-column>
      <el-table-column
        prop="sname"
        label="姓名"
      ></el-table-column>
      <el-table-column
        prop="attendanceRate"
        label="出勤率"
        sortable
        :sort-method="sortByAttendanceRate"
      >
        <template #default="scope">
          {{ scope.row.attendanceRate }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(label, key) in dynamicColumns"
        :key="key"
        :prop="key"
        :label="label"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';

export default {
  name: "DynamicTable",
  components: {
    Search
  },
  data() {
    return {
      stateMAP: {
        "1": "出勤",
        "2": "缺席",
        "3": "迟到",
        "4": "早退",
        "5": "请假",
      },
      tableHeader: {
        id: "序号",
        njuid: "学号",
        sname: "姓名",
        attendanceRate: "出勤率"
      },
      tableData: [],
      resultList: [],
      isDataLoaded: false,
      searchQuery: '',
      dynamicColumns: {}
    }
  },
  created() {
    this.getData();
  },
  computed: {
    filteredTableData() {
      if (!this.searchQuery) {
        return this.tableData;
      }
      const query = this.searchQuery.toLowerCase();
      return this.tableData.filter(row => 
        row.njuid.toLowerCase().includes(query) || 
        row.sname.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async getData() {
      if (this.isDataLoaded) return;
      try {
        const response = await this.axios.get("http://103.133.176.168:8080/student/attendanceInfo");
        this.resultList = response.data.data.filter(item => item != null);
        if (this.resultList.length > 0) {
          const dates = this.resultList[0].states || {};
          this.dynamicColumns = Object.keys(dates).reduce((acc, key) => {
            acc[key] = key;
            return acc;
          }, {});
        }
        this.isDataLoaded = true;
        this.renewDataList();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    renewDataList() {
      this.tableData = this.resultList.map((item, index) => {
        const newItem = {
          id: index + 1,
          njuid: item.njuid,
          sname: item.sname,
        };
        if (item.states) {
          Object.keys(item.states).forEach(key => {
            newItem[key] = this.stateMAP[item.states[key]] || '未知';
          });
        }
        newItem.attendanceRate = this.calculateAttendanceRate(newItem);
        return newItem;
      });
    },
    calculateAttendanceRate(row) {
      const dynamicColumnKeys = Object.keys(this.dynamicColumns);
      const totalColumns = dynamicColumnKeys.length;
      if (totalColumns === 0) {
        return '0%';
      }
      const attendanceCount = dynamicColumnKeys.filter(key => row[key] === '出勤').length;
      return ((attendanceCount / totalColumns) * 100).toFixed(2) + '%';
    },
    handleSearch() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    getCellStyle({ row, column }) {
      if (this.searchQuery && (column.property === 'njuid' || column.property === 'sname')) {
        const cellValue = row[column.property].toLowerCase();
        if (cellValue.includes(this.searchQuery.toLowerCase())) {
          return { backgroundColor: '#FFF9C4' };
        }
      }
      return { textAlign: 'center' };
    },
    getRowKey(row) {
      return row.njuid;
    },
    sortByAttendanceRate(a, b) {
      const rateA = parseFloat(a.attendanceRate);
      const rateB = parseFloat(b.attendanceRate);
      return rateB - rateA;  // 降序排列
    }
  }
}
</script>

<style scoped>
.dynamic-table {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #409EFF;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.el-table {
  margin-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table__header-wrapper th {
  background-color: #409EFF !important;
}

.el-table__row:hover > td {
  background-color: #ecf5ff !important;
}
</style>