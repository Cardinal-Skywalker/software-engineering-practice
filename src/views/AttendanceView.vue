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
          background: '#f0cfb3',
          color: 'black',
          fontSize: '22px',
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
        <el-image v-loading="loading" style="height: 200px; width: 180px;" :src="imgsrc"></el-image>
        <div class="student-info">
          <h3>序号：{{ this.selectitem.id }}</h3>
          <h3>学号：{{ this.selectitem.njuid }}</h3>
          <h3>姓名：{{ this.selectitem.sname }}</h3>
          <div class="button-checkbox-container">
        <div class="button-container">
          <el-button type="success" @click="handleSpeak(selectitem.sname)">
            <el-icon><Headset /></el-icon>
          </el-button>
          <el-button type="success" @click="randChoose()">
            <el-icon><Orange /></el-icon>
          </el-button>
        </div>
        <el-checkbox class="checkbox" v-model="speakFlag" label="自动语音" size="large" />
      </div>
    </div>
        
      </div>
      <el-form ref="attendanceForm" :model="attendanceForm" :rules="rules">
        <!-- 表单内容 -->
      <el-form-item prop="date">
          <el-date-picker
            v-model="attendanceForm.rawDate"
            type="date"
            placeholder="请选择日期"></el-date-picker>
          <!-- <el-input type="text" v-model="attendanceForm.date" placeholder="请输入日期" >
          </el-input> -->
          <!-- <div>{{ formattedDate }}</div> -->
      </el-form-item>
      <!-- <el-form-item prop="status">
          <h3>出勤: {{radio1}}</h3>
      </el-form-item> -->
        

      <el-progress class="progress-bar" type="circle" :width="100" :percentage="attendancePercentage" ></el-progress>
 
      
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
      <el-button v-if="isStart" type="success" @click="autoAttendance">开始点名</el-button>
      <el-button v-if="isStop" type="success" @click="stopAttendance">结束点名</el-button>
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
    //自动语音播报控制
    const speakFlag = ref(false);

    return {
      radio1
    };
  },
  name: "Attendance",
  data() {
    // const today = new Date();
    // const formattedDate = today.getFullYear() + '-' + 
    //                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    //                       String(today.getDate()).padStart(2, '0');
    return {
      imgsrc: require("../assets/default.png"),
      isStart: true,
      isStop: false,
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      //学生列表，存储每个学生的信息
      studentlist:[
      ],
      selectionRows: [],
      //选择的学生对象
      selectitem: {
        id: '-',
        njuid: '-',
        sname: '-',
        photo:"",
        date:"",
      },
      //点名时的id
      attendanceid : -1,
      attendanceForm:{
        // date:ref(''),
        rawDate: '', // 用于存储原始日期
        date: this.formattedDate(),     // 用于存储格式化后的日期
        njuid: "",
        status: "",
      },
      attendancePercentage: 0, // 点名进度百分比
      //状态映射
      stateMAP: {
          "1": "出勤",
          "2": "缺席",
          "3": "迟到",
          "4": "早退",
          "5": "请假",
      },
      totalCount: 0,      // 总人数
      attendedCount: 0,   // 已点名人数
      //点名停止标志
      atdStopFlag: false,
      //自动语音播报控制
      // speakFlag: true,
      //控制点名语音只播报一次
      onlyonece: false,
    };
  },
  // computed: {
  //   formattedDate() {
  //     if (!this.attendanceForm.date) return '';
  //     const date = new Date(this.attendanceForm.date);
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const day = String(date.getDate()).padStart(2, '0');
  //     return `${year}/${month}/${day}`;
  //   }
  // },
  watch: {
    'attendanceForm.rawDate'(newDate) {
      if (!newDate) {
        this.attendanceForm.date = '';
        return;
      }
      const date = new Date(newDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.attendanceForm.date = `${year}/${month}/${day}`;
    }
  },
  created() {
    this.getUsersList();
  },

  methods: {
    formattedDate() {
      // if (!this.attendanceForm.date) return '';
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    },
    // setDefaultDate() {
    //   const date = new Date(); // 获取当前日期
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');
    //   this.attendanceForm.date = `${year}/${month}/${day}`; // 赋值给 date
    // },

    //异步调用，获取学生列表
    async getUsersList() {

    this.axios({
                    url: "/api/student/attendance",
                    method: "get",
                    headers:{
                        "Content-Type":"application/json",
                    },
                }).then((res)=>{
                    for(var i=0; i<res.data.data.length; i++){
                    if(res.data.data[i]!=null){
                        res.data.data[i].isAttended = false; // 初始化点名状态
                        this.studentlist.push(res.data.data[i]);}}
                    this.totalCount = this.studentlist.length; // 设置总人数
                })

    },
    //随机选择学生方法
    randChoose(){
      this.$refs.multipleTable.clearSelection();
      var randomIndex = Math.floor(Math.random() * this.studentlist.length);
      this.$refs.multipleTable.toggleRowSelection(this.studentlist[randomIndex], true);
      this.selectitem = this.studentlist[randomIndex];
      this.attendanceid = this.selectitem.id-1;
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
        console.log("attendanceid:"+this.attendanceid);
        console.log("itemid:"+this.selectitem.id);
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

    stopAttendance(){
      this.isStart = true;  // 显示“开始点名”按钮
      this.isStop = false;  // 隐藏“结束点名”按钮
      this.atdStopFlag = false;
    },
    //异步自动点名
  async autoAttendance() {
    this.isStart = false; // 隐藏“开始点名”按钮
    this.isStop = true;   // 显示“结束点名”按钮
    this.atdStopFlag = true;
    if(this.attendanceid < this.studentlist.length&&this.attendanceid>=0){
      ;
    }else{
      this.attendanceid = 0;
      this.$refs.multipleTable.toggleRowSelection(this.studentlist[this.attendanceid], true);
    }
    let count = 0;
    while (this.atdStopFlag) {
      if(this.speakFlag && this.attendanceid < this.studentlist.length && this.onlyonece == false){
        this.handleSpeak(this.studentlist[this.attendanceid].sname);
        this.onlyonece = true;
      }
      if (this.radio1 === null) {
        await new Promise(resolve => setTimeout(resolve, 300)); // 等待300毫秒
      } else {
        count = count+1;
        this.attendancePercentage = (100 * count / this.studentlist.length).toFixed(2); // 计算点名进度，并保留两位小数
        this.startAttendance();
      }
    }
  },

    startAttendance(){
        console.log("attendanceid:"+this.attendanceid);
        console.log("itemid:"+this.selectitem.id);
      if(this.attendanceid < this.studentlist.length-1&&this.attendanceid>=-1){
        this.selectitem = this.studentlist[this.attendanceid];
        this.sellectid = this.selectitem.id+1;
        this.attendanceForm.njuid = this.selectitem.njuid;
        this.attendanceForm.status = this.radio1;
        this.selectitem = this.studentlist[this.attendanceid+1];
        // 更新当前学生的点名状态为已点名
        this.studentlist[this.attendanceid].isAttended = true;
        // 更新已点名人数
        this.attendedCount = this.studentlist.filter(student => student.isAttended).length;

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
          this.$refs.multipleTable.toggleRowSelection(this.studentlist[this.attendanceid-1], true);
          this.attendanceid = 0;
          this.atdStopFlag = false;
          this.isStart = true;  // 显示“开始点名”按钮
          this.isStop = false;  // 隐藏“结束点名”按钮
          // this.$refs.multipleTable.toggleRowSelection(this.studentlist[this.attendanceid], true);
        }
        

      }else if(this.attendanceid == this.studentlist.length-1){
        this.selectitem = this.studentlist[this.attendanceid];
        this.attendanceForm.njuid = this.selectitem.njuid;
        this.attendanceForm.status = this.radio1;

        // 更新当前学生的点名状态为已点名
        this.studentlist[this.attendanceid].isAttended = true;
        // 更新已点名人数
        this.attendedCount = this.studentlist.filter(student => student.isAttended).length;

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

        this.attendanceid = 0;
        this.onlyonece = false;
        this.radio1 = null;
        this.atdStopFlag = false;
        this.isStart = true;  // 显示“开始点名”按钮
        this.isStop = false;  // 隐藏“结束点名”按钮
      }else{
        this.attendanceid = 0;
        this.onlyonece = false;
        this.radio1 = null;
        this.atdStopFlag = false;
        this.isStart = true;  // 显示“开始点名”按钮
        this.isStop = false;  // 隐藏“结束点名”按钮
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
.attendance-view {
  font-size: 32px;
  color: white;
}
.student-info h3 {
  font-size: 32px;
  color: white;
}
.el-button {
  font-size: 24px;
  color: white;
}

.button-checkbox-container {
  display: flex;
  flex-direction: column; /* 使按钮和复选框垂直排列 */
  align-items: center; /* 水平居中对齐 */
  gap: 10px; /* 按钮和复选框之间的间距 */
}

.button-container {
  display: flex;
  flex-direction: row; /* 使按钮水平排列 */
  gap: 10px; /* 按钮之间的间距 */
}

::v-deep .el-table__body tr.current-row>td {
		background: #ff8f57 !important;
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
  background: #ff8f57;
}
.student-info {
  flex: 1;
  margin-left: 20px;
}
.progress-bar{
  stroke-width:20;
  color:#409EFF;
}

#attendance {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0;
        background: #ff8f57;
    }
</style>

