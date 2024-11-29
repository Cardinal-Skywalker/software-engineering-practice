<template>
    <div>
      <h2>Vue3 + Element plus 动态表格</h2>
      <el-button type="primary" @click="renewDataList">获取数据</el-button>
      <el-table
        class="atdInfo-table"
        :data="tableData"
        ref="multipleTable"

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
        style="width: 100%; height: 100%; overflow-x: auto;"
        :row-key="getRowKey"
        highlight-current-row
      >
        <el-table-column
          :prop="index"
          :label="item"
          v-for="(item, index) in tableHeader"
          :key="index"
        >
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';

  export default {
    name: "test",
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
        },
        tableData: [
        ],
        dataForm:{
            id: "",
            njuid: "",
            sname: "",
            states: {
            }
        },
        tableDataForm:{
          id: "",
          njuid: "",
          sname: "",
        },
        resultList:[],
        isDataLoaded: false, // 添加标志位，初始值为 false
      }
    },
    created() {
        this.getData();
    },
    methods: {
        async getData() {
          if(this.isDataLoaded) return; // 如果数据已经加载过，则直接返回
          this.axios({
                    url: "/api/student/attendanceInfo",
                    method: "get",
                    headers:{
                        "Content-Type":"application/json",
                    },
                }).then((res)=>{
                    this.resultList = [];
        //this.tableHeader = { id: "序号", njuid: "学号", sname: "姓名" }; // 如果需要重置表头

        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i] != null) {
            // 使用对象展开运算符创建新对象，避免重用 dataForm
            let newDataForm = {
              ...this.dataForm,
              states: res.data.data[i].states,
              id: res.data.data[i].id,
              njuid: res.data.data[i].njuid,
              sname: res.data.data[i].sname,
            };
            this.resultList.push(newDataForm);
            }

        }
          let dates = this.resultList.length > 0 ? this.resultList[0].states : {};
          console.log('dates:', dates);
          Object.keys(dates).forEach((key) => {
              console.log('check:', key);
              // this.$set(this.tableHeader, key, key);
              this.tableHeader[key] = key;
              });
          }).catch((error) => {
          console.error('Error fetching data:', error);
      });  
        },

        renewDataList(){
          for(let i = 0; i < this.resultList.length; i++){
          // this.tableDataForm.id = this.resultList[i]
          let newtableDataForm = {
            ...this.tableDataForm,
            id: this.resultList[i].id,
            njuid: this.resultList[i].njuid,
            sname: this.resultList[i].sname,
          };
          for (let key in this.resultList[i].states) {
            newtableDataForm[key] = this.stateMAP[this.resultList[i].states[key]];
          }
          this.tableData.push(newtableDataForm);
        }
        console.log(this.tableData);
        }
    }

  }
  </script>
  