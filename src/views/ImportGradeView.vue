<template>
    <el-container>
    <el-aside class="table-container" style="width: 65%;">
      <el-table
        class="grade-table"
        :data="gradelist"
        ref="multipleTable"
        @select="selectInfo"
        row-class-name="tableRowClassName"
        :header-cell-style="{
          background: '#A6A6A6',
          color: '#FFF',
          fontSize: '15px',
          fontWeight: 'bold',
          textAlign: 'center',
          border: '1px solid #A6A6A6'
        }"
        border
        :table-layout="auto"
        :cell-style="{ 'text-align': 'center' }"
        height="800px"
        :row-key="getRowKey"
        highlight-current-row
        style="max-width: 100%; overflow-x: auto;"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="njuid" label="学号" />
        <el-table-column prop="sname" label="姓名" />
        <el-table-column prop="middle" label="期中" />
        <el-table-column prop="finall" label="期末" />
      </el-table>
      <!--分页部分 -->
    </el-aside>

    <el-main class="displayer-container" style="width: 35%;">
      <div class="display-container">
        <el-image v-loading="loading" style="height: 180px; width: 160px;" :src="imgsrc"></el-image>
        <div class="student-info">
          <h3>序号：{{ this.selectitem.id }}</h3>
          <h3>学号：{{ this.selectitem.njuid }}</h3>
          <h3>姓名：{{ this.selectitem.sname }}</h3>
        </div>
        
      </div>

      <el-form-item prop="gradeinput">
          <!-- <el-input type="text" placeholder="请输入名称" ></el-input> -->
          <el-input type="text" placeholder="期中成绩" ></el-input>
          <el-input type="text" placeholder="期末成绩" ></el-input>
      </el-form-item>
        
      <el-button type="success" >确认录入</el-button>
      <!-- <el-button type="success" @click="stopAttendance">结束点名</el-button> -->
    </el-main>

    </el-container>
</template>

<script>
import { ref } from 'vue'

export default {
    data() {
        return {
            gradelist:[],
            selectitem:{
                id: 0,
                njuid: "000000000000",
                sname: "",
            },

        };
    },
    created() {
        this.getGradeList();
    },

    methods: {
        async getGradeList() {
        
        this.axios({
                url: "/api/student/grade",
                method: "get",
                headers:{
                    "Content-Type":"application/json",
                },
            }).then((res)=>{
                for(var i=0; i<res.data.data.length; i++)
                if(res.data.data[i]!=null)
                    this.gradelist.push(res.data.data[i]);
            })
        },

        selectInfo(selection, row) {
            console.log(selection, row);
            // 清除 所有勾选项
            this.$refs.multipleTable.clearSelection();
            // 当表格数据都没有被勾选的时候 就返回
            // 主要用于将当前勾选的表格状态清除
            if (selection.length == 0) return;
            this.$refs.multipleTable.toggleRowSelection(row, true);
            this.selectionRows=selection;
            if(this.selectionRows.length > 0){
                this.selectitem = this.selectionRows[this.selectionRows.length-1];
                this.attendanceid = this.selectitem.id-1;
            }
            },        
        handleSelectionChange(val) {
            this.selectionRows = val;
            if(this.selectionRows.length > 0){
                this.selectid = this.selectionRows[this.selectionRows.length-1].id;
            }
            else{
                this.selectid = 0;
            }
            this.attendanceid = this.selectitem.id-1;
        },
        getRowKey(row) {
        return row.id;
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
            return 'warning-row';
            } else if (rowIndex === 3) {
            return 'success-row';
            }
            return '';
        },
    }
}

</script>

<style>
::v-deep .el-table__body tr.current-row>td {
		background: #BDDBBB !important;
	}
.grade-table{
    .el-table-column--selection.is-leaf .el-checkbox {
            display: none;
          }

}
.display-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.student-info {
  flex: 1;
  margin-left: 20px;
}

/* #attendance {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0;
    } */
</style>