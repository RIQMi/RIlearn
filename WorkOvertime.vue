<template>
  <div class="workovertime">
    <div class="subject">
      <div class="nape">
        <div>
          <span class="necessary">*</span>
          <span class="option">开始时间</span>
        </div>
        <span>
          <el-input class="form-control" placeholder="请选择" readonly @focus="openPicker('start')" v-model="startFmtTime"></el-input>
          <img :style="startImg" class="electImg" :src="`${assets}/img/mobile/attendance/enter.png`">
          <mt-datetime-picker :type="pickType" :format="dtFormat" ref="stPicker" year-format="{value}年" month-format="{value}月"
            date-format="{value}日" hour-format="{value}时" minute-format="{value}分" @confirm="selectTime" :value="value"></mt-datetime-picker>
        </span>
      </div>
      <div class="nape">
        <div>
          <span class="necessary">*</span>
          <span class="option">结束时间</span>
        </div>
        <span>
          <el-input class="form-control" placeholder="请选择" readonly @focus="openPicker('end')" v-model="endFmtTime"></el-input>
          <img :style="endImg" class="electImg" :src="`${assets}/img/mobile/attendance/enter.png`">
          <mt-datetime-picker :type="pickType" :format="dtFormat" ref="etPicker" year-format="{value}年" month-format="{value}月"
            date-format="{value}日" hour-format="{value}时" minute-format="{value}分" @confirm="selectTime" :value="value"></mt-datetime-picker>
        </span>
      </div>
      <div class="nape">
        <div>
          <span class="necessary">*</span>
          <span class="option">加班时长</span>
        </div>
        <span>
          <el-input type="number" placeholder="请输入时长" readonly v-model="overtimehours"></el-input>
        </span>
      </div>
      <div class="nape">
        <div>
          <span class="option">是否法定节假日</span>
        </div>
        <span class="ftType">
          <el-input v-model="festivalType" readonly="" placeholder="请选择" @focus="openpopup()"></el-input>
          <img class="electImg" :src="`${assets}/img/mobile/attendance/enter.png`" :style="typeImg">
          <mt-popup v-model="popupVisible" popup-transition="popup-fade">
            <div>
              <div style="width:100%;height: 20px;padding-top:8px">
                <span  class="cancel" @click="popupVisible = false">取消</span>
                <span class="confirm" @click="confirm()">确认</span>
              </div>
              <mt-radio v-model="timeValue" :options="options" align="right" @change="check"></mt-radio>
            </div>
          </mt-popup>
        </span>
      </div>
      <div class="col flex">
        <div>
          <span class="necessary">*</span>
          <span class="option">加班事由</span>
        </div>
        <div>
          <el-input placeholder="请输入加班事由" type="textarea" v-model="workreason"/>
        </div>
      </div>
      <div class="col flex">
        <div>
          <span class="necessary">*</span>
          <span class="option">审批人</span>
          <span style="color:rgb(97,95,93);">(审批人已由管理员预设)</span>
        </div>
        <div class="approve">
          <div class="head" v-for="(head,index) in heads" :key="index">
            <img :src="head['img']">
            <span>{{head['label']}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button class="submit"  @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
/**
 * @author xyr
 * @since created by xyr 2018-12-06
 * @description  霍山OA加班页面
 */
import Vue from "vue";
import DatetimePicker from "../mint-ui/lib/datetime-picker";
import {Input , Button ,  Option ,MessageBox} from "element-ui"
import {Toast ,Popup ,Radio} from "mint-ui";
import "../mint-ui/lib/style.css";
import "element-ui/lib/theme-chalk/input.css";
import "element-ui/lib/theme-chalk/option.css";
import "element-ui/lib/theme-chalk/button.css";
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Popup.name, Popup);
Vue.component(Radio.name, Radio);
if (process.env.NODE_ENV === 'component') {
  require('mint-ui/lib/popup/style.css');
  require('mint-ui/lib/radio/style.css');
}
Vue.use(Input);
Vue.use(Button);
Vue.use(Option);


export default {
  data(){
    return{
      pickType: 'datetime',
      value: '', //作用仅是设置弹出层的默认时间
      dtCustomFmt: "YYYY-MM-DD hh:mm",
      startTime: '',
      endTime: '',
      festivalType:'',
      startFmtTime:'',
      endFmtTime:'',
      overtimehours:'',
      workreason:'',
      popupVisible:false,
      timeValue:'',
      tab:'',
      heads: [
        {
          img: `${T.assets}/img/mobile/attendance/wsh.png`,
          label: '张三',
        }, 
        {
          img: `${T.assets}/img/mobile/attendance/wsh.png`,
          label: '李四',
        }
      ],
      options: [
        {
          value: '是',
          label: '是'
        },
        {
          value: '否',
          label: '否'
        },
      ],
      startImg:{display:'block'},
      endImg:{display:'block'},
      typeImg:{display:'block'},
      slots:[
        {
          flex:1,
          values:['是','否'],
          textAlign: 'center',
        }
      ]
    }
  },
  watch:{
    festivalType(newType,oldType){
      if( newType !==''){
        this.typeImg.display = 'none'
      }
    }
  },
  methods:{
    submit() {
      console.log(
        ` 是否节假日:${this.festivalType},
          开始时间:${this.startTime},
          结束时间:${this.endTime},
          加班时长:${this.overtimehours},
          加班事由:${this.workreason}
        `
      )
      if (T.Clock.sub(this.startTime, this.endTime) > 0) {
        Toast("开始时间不能大于结束时间");
        return;
      }
    },
    openPicker(type) {
      this.type = type;
      this.value = new Date()
      if (this.type == "start") {
        this.$refs.stPicker.open();
      }
      if (this.type == "end") {
        this.$refs.etPicker.open();
      }
    },
    selectTime(data) {
      let date = T.Clock.fmt(data, "YYYY-MM-DD hh:mm:00");
      if (this.type == "start") {
        this.startTime = date;
        this.startFmtTime=T.clock(this.startTime).fmt(this.dtCustomFmt);
        this.startImg.display = "none"
      }
      if (this.type == "end") {
        this.endTime = date;
        this.endFmtTime = T.clock(this.endTime).fmt(this.dtCustomFmt);
        this.endImg.display = "none"
      }
      if(this.startFmtTime!==''&this.endFmtTime!==''){
        if(T.Clock.sub(this.startTime, this.endTime) > 0){
          Toast("开始时间不能大于结束时间");
          return
        }
        let difference = (T.Clock.sub(this.endFmtTime, this.startFmtTime))
        this.overtimehours = (difference/1000/60/60).toFixed(2)
      }
    },
    openpopup(){
      this.popupVisible = true
    },
    confirm() {
      this.popupVisible = false;
      this.festivalType = this.timeValue
    },
  }
}
</script>

<style>
  .workovertime{
    width: 100%;
    height: 100%;
    background-color: rgb(240, 239, 244);
    display: flex;
    flex-direction: column;
    font-size: 15px;
    font-family: 微软雅黑;
  }

  .workovertime .subject{
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .workovertime .subject .nape{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #fff;
    margin-bottom: 5px;
    align-items: center;
    min-height: 35px;
    padding-left: 10px;
  }

  .workovertime .nape>span{
    cursor: pointer;
    padding-right: 15px;
    display: flex;
  }

  .workovertime .cancel{
    color:#8a8678;
    width: 50%;
    font-size: 17px;
    padding-left:16px;
    
  }

  .workovertime .confirm{
    color:#26a2ff;
    width: 50%;
    font-size: 17px;
    text-align: right;
    float: right;
    padding-right: 14px
  }

  .workovertime .subject .electImg{
    height: 15px;
    margin-top: 13px;
    margin-left: 8px;
  }
  .workovertime .subject .necessary{
    color: red;
    padding-right: 0px;
  }

  .workovertime .ftType .mint-popup{
    width: 70%;
  }

  .workovertime .col {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding-left: 10px;
    margin-bottom: 5px;
  }

  .workovertime  .flex {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .workovertime .flex>div:first-child {
    height: 35px;
    line-height: 35px;
  }

  .workovertime .flex>div:nth-child(2) {
    flex: 1;
  }

  .workovertime .el-input__inner {
    border: none;
    outline: none;
    text-align: right;
    padding-right: 0px;
    font-size: 16px;
    color: #000;
    width: 45vw;
  }

  .workovertime .picker-slot{
    font-size:16px;
  }

  .workovertime .el-textarea {
    height: 100%;
  }

  .workovertime .el-textarea__inner {
    border: none;
    outline: none;
    font-size: 16px;
    height: 100%;
  }

  .workovertime .approve {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    flex-wrap: wrap;
  }

  .workovertime .head {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 19vw;
  }

  .workovertime .head>img{
    width: 50px;
    height: 50px;
  }

  .workovertime .footer{
    display: flex;
    justify-content: center;
    height: 52px;
  }

  .workovertime .footer .submit {
    background: #3598fe;
    color: white;
    width: 90%;
    margin: 5px 0px;
    font-size: 16px;
  }

  .el-select .el-input__inner {
    padding-right: 0px;
  }
  .el-input__suffix, .el-popper .popper__arrow {
    display: none;
  }
</style>

