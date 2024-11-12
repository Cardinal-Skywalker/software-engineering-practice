<template>

<el-container>
<el-aside class="table-container"style="width: 50%;">
    <el-table class="student-table" 
    :data="studentlist"
    ref="multipleTable"
    @select="selectInfo"
    row-class-name="tableRowClassName" 
    :header-cell-style="{background:'#A6A6A6',color:'#FFF', fontSize: '15px', fontWeight: 'bold',  textAlign: 'center' ,border: '1px solid #A6A6A6'}"
          border 
         :table-layout="auto"
		 :cell-style="{'text-align':'center' }" max-height="100vh"  
         :row-key="getRowKey"
		 highlight-current-row
         >
         <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="njuid" label="学号" />
        <el-table-column prop="sname" label="姓名" />
        <el-table-column prop="photo" label="照片" />
    </el-table>
     <!--分页部分 -->
</el-aside>

<el-main class="displayer-container" style="width: 50%;">
    <div class="student-info">
        <h3>序号：{{ this.selectitem.id }}</h3>
        <h3>学号：{{ this.selectitem.njuid }}</h3>
        <h3>姓名：{{ this.selectitem.sname }}</h3>
        <h3>照片: {{ this.selectitem.photo }}</h3>
    </div>
    <el-image v-loading="loading" style='height: 480px;' :src="imgsrc"></el-image>
    <el-button type="success" @click="handleSpeak(selectitem.sname)">Web Speech API</el-button>

</el-main>
</el-container>


</template>

<script>
import { ref } from 'vue';
const synth = window.speechSynthesis // 启用文本
const msg = new SpeechSynthesisUtterance()
export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      studentlist:[],
      selectionRows: [],
      selectitem: {
        id: 0,
        njuid: "00000000000",
        sname: "",
        photo:"",
      },

    };
  },
  created() {
    this.getUsersList();
  },
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
    }
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
#attendance {
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 0;
    }
</style>

