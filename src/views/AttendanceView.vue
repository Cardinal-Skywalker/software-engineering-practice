<template>
  <el-container>
    <el-aside class="table-container" style="width: 65%;">
      <el-table
        class="student-table"
        :data="studentlist"
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
        <el-table-column
          prop="date"
          :label=attendanceForm.date 
        >
        </el-table-column>
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
          <el-button type="success" @click="handleSpeak(selectitem.sname)">
          <el-icon><Headset /></el-icon>
          </el-button>
        </div>
        
      </div>
      <el-form ref="attendanceForm" :model="attendanceForm" :rules="rules">
        <!-- 表单内容 -->
      <el-form-item prop="date">
          <el-input type="text" v-model="attendanceForm.date" placeholder="请输入日期" >
          </el-input>
      </el-form-item>
      <!-- <el-form-item prop="status">
          <h3>出勤: {{radio1}}</h3>
      </el-form-item> -->
        
 
      
      </el-form>

      <div class="mb-2 ml-4">
        <el-radio-group v-model="radio1">
          <el-radio value="1" size="large">出席</el-radio>
          <el-radio value="2" size="large">缺席</el-radio>
          <el-radio value="3" size="large">迟到</el-radio>
          <el-radio value="4" size="large">早退</el-radio>
          <el-radio value="5" size="large">请假</el-radio>
        </el-radio-group>
      </div>
      <el-button type="success" @click="autoAttendance">开始点名</el-button>
    </el-main>
  </el-container>
</template>


<script>
import { ref } from 'vue';
// const radio1 = ref('1')
// const radio2 = ref('1')
// const radio3 = ref('1')
const synth = window.speechSynthesis // 启用文本
const msg = new SpeechSynthesisUtterance()
export default {
  setup() {
    const radio1 = ref(null);

    return {
      radio1
    };
  },
  name: "Attendance",
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      studentlist:[
      ],
      selectionRows: [],
      selectitem: {
        id: 0,
        njuid: "00000000000",
        sname: "",
        photo:"",
        date:"",
      },
      attendanceid : 0,
      attendanceForm:{
        date:"2024/11/27",
        njuid: "",
        status: "",
      },
      stateMAP: {
          "1": "出勤",
          "2": "缺席",
          "3": "迟到",
          "4": "早退",
          "5": "请假",
      },
      atdStopFlag: false,
      speakFlag: true,
      onlyonece: false,
    };
  },
  created() {
    this.getUsersList();
  },
  // watch: {
  //   // 监听 studentlist 的变化
  //   studentlist: {
  //     deep: true,
  //     handler(newVal, oldVal) {
  //       this.refreshTable();
  //     }
  //   }
  // },
  // mounted() {
  //   this.$nextTick(() => {
  //     setTimeout(() => {
  //       // 在这里执行可能会触发重新渲染的操作
  //     }, 0);
  //   });
  //   window.addEventListener('resize', this.handleResize);
  // },
  // beforeDestroy() {
  //   window.removeEventListener('resize', this.handleResize);
  // },
  methods: {

    async getUsersList() {

    this.axios({
                    url: "/api/student/attendance",
                    method: "get",
                    headers:{
                        "Content-Type":"application/json",
                    },
                }).then((res)=>{
                    for(var i=0; i<res.data.data.length; i++)
                    if(res.data.data[i]!=null)
                        this.studentlist.push(res.data.data[i]);
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
    // playVoice() {
    //   this.handleSpeak('测试111111111') // 传入需要播放的文字
    // },
    handleSpeak(text) {
      msg.text = text // 内容
      msg.lang = 'zh-CN' // 使用的语言:中文
      msg.volume = 1 // 声音音量：1
      msg.rate = 1 // 语速：1
      msg.pitch = 1 // 音高：1
      synth.speak(msg) // 播放
    },
    // 语音停止
    handleStop(e) {
      msg.text = e
      msg.lang = 'zh-CN'
      synth.cancel(msg) // 取消该次语音播放
    },

  async autoAttendance() {
    this.atdStopFlag = true;
    while (this.atdStopFlag) {
      if(this.speakFlag && this.attendanceid < this.studentlist.length && this.onlyonece == false){
        this.handleSpeak(this.studentlist[this.attendanceid].sname);
        this.onlyonece = true;
      }
      if (this.radio1 === null) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 等待300毫秒
      } else {
        this.startAttendance();
      }
    }
  },

    startAttendance(){
      
      if(this.attendanceid < this.studentlist.length){
        this.selectitem = this.studentlist[this.attendanceid];
        this.sellectid = this.selectitem.id;
        this.attendanceForm.njuid = this.selectitem.njuid;
        this.attendanceForm.status = this.radio1;
        this.studentlist[this.attendanceid]["date"] = this.stateMAP[this.radio1];

        this.$refs.attendanceForm.validate((valid) => {
              if (valid) {
                let _this = this;
                this.axios({
                    url: "/api/student/startAtd",
                    method: "post",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    params: {
                        njuid: _this.attendanceForm.njuid,
                        status: _this.attendanceForm.status,
                        date: _this.attendanceForm.date,
                    },
                }).then((res)=>{
                    if(res.data.code === "0"){
                        // this.$router.push("/main");
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'warning',
                        })
                    }
                    // console.log(res);
                });
              } else {
                // console.log('error submit!!');
                this.$message.error('出勤状态录入出错');
                return false;
              }
        });
        this.radio1 = null;
        this.$refs.multipleTable.clearSelection();

        this.attendanceid++;
        this.onlyonece = false;
        if(this.attendanceid < this.studentlist.length){
          this.$refs.multipleTable.toggleRowSelection(this.studentlist[this.attendanceid], true);
        }else{
          this.attendanceid = 0;
          this.atdStopFlag = false;
          this.$refs.multipleTable.toggleRowSelection(this.studentlist[this.attendanceid], true);
        }
        

      }else{
        this.attendanceid = 0;
        this.onlyonece = false;
        this.radio1 = null;
      }
    },
    // refreshTable() {
    //   // this.$refs.multipleTable.clearSelection();
    //   this.$nextTick(() => {
    //     this.$refs.multipleTable.doLayout();
    //   });
    // }
  }
};
</script>


<style>
::v-deep .el-table__body tr.current-row>td {
		background: #BDDBBB !important;
	}
.student-table{
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

#attendance {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0;
    }
</style>

