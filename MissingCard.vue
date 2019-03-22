<template>
  <div class="missingcard">
    <div class="subject">
      <div class="nape">
        <div>
          <span class="necessary">*</span>
          <span class="option">漏打卡类型</span>
        </div>
        <span class="mstype">
          <el-input v-model="missingtype"  readonly="" placeholder="请选择" @focus="openpopup()"></el-input>
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
      <div class="nape">
        <div>
          <span class="necessary">*</span>
          <span class="option">漏打卡日期</span>
        </div>
        <span>
          <el-input class="form-control" placeholder="请选择" readonly @focus="openPicker" v-model="missingtime"></el-input>
          <img :style="missingdate" class="electImg" :src="`${assets}/img/mobile/attendance/enter.png`">
          <mt-datetime-picker :type="pickType" :format="dtFormat" ref="Picker"   @confirm="selectTime" 
          year-format="{value}年" month-format="{value}月" date-format="{value}日" :value="value"></mt-datetime-picker>
        </span>
      </div>
      <div class="col flex">
        <div>
          <span class="necessary">*</span>
          <span class="option">漏打卡说明</span>
        </div>
        <div>
          <el-input placeholder="请输入漏打卡说明" type="textarea" v-model="illustrate"/>
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
            <!-- <i :class="head['img']"></i> -->
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
 * @description  霍山OA漏打卡页面
 */
import Vue from "vue";
import DatetimePicker from "../mint-ui/lib/datetime-picker";
import {Input , Button ,  Option} from "element-ui"
import { Popup,Radio } from 'mint-ui';
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
      missingtime:'',
      missingtype:'',
      timeValue:'',
      tab:'',
      missingdate:{display:'block'},
      typeImg:{display:'block'},
      pickType: 'date',
      dtFormat: 'YMD',
      value: '', //作用仅是设置弹出层的默认时间
      dtCustomFmt: "YYYY-MM-DD",
      illustrate:'',
      show:false,
      popupVisible:false,
      options:[
        {
          value: '上午',
          label: '上午'
        },
        {
          value: '下午',
          label: '下午'
        },
        {
          value: '全天',
          label: '全天'
        }
      ],
      heads: [
        {
          img:`${T.assets}/img/mobile/attendance/wsh.png`,
          label: '张三',
        }, 
        {
          img: `${T.assets}/img/mobile/attendance/wsh.png`,
          label: '李四',
        }
      ]
    }
  },
  computed: {
    missingtime() {
      if (this.dtCustomFmt != "")
        return T.clock(this.missingtime).fmt(this.dtCustomFmt);
    }
  },
  watch:{
    missingtype(newType,oldType){
      if(newType!==''){
        this.typeImg.display = 'none'
      }
    }
  },
  methods:{
    submit() {
      console.log(
        ` 漏打卡类型:${this.missingtype},
          漏打卡日期:${this.missingtime},
          漏打卡说明:${this.illustrate},
        `
      )
    },
    openPicker() {
        this.value = new Date()
        this.$refs.Picker.open();
    },
    selectTime(data) {
      let date = T.Clock.fmt(data, "YYYY-MM-DD");
      this.missingtime = date;
      this.missingdate.display = "none"
    },
    openpopup(){
      this.popupVisible = true
    },
    confirm() {
      this.popupVisible = false;
      this.missingtype = this.timeValue
    },
  }
}
</script>

<style>
  .missingcard{
    width: 100%;
    height: 100%;
    background-color: rgb(240, 239, 244);
    display: flex;
    flex-direction: column;
    font-size: 15px;
    font-family: 微软雅黑;
  }

  .missingcard .subject{
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .missingcard .subject .nape{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #fff;
    margin-bottom: 5px;
    align-items: center;
    min-height: 35px;
    padding-left: 10px;
  }

  .missingcard .nape>span{
    cursor: pointer;
    padding-right: 15px;
    display: flex
  }

  .missingcard .cancel{
    color:#8a8678;
    width: 50%;
    font-size: 17px;
    padding-left:26px;
    
  }

  .missingcard .confirm{
    color:#021590;
    width: 50%;
    font-size: 17px;
    text-align: right;
    float: right;
    padding-right: 14px
  }
  .missingcard .subject .electImg{
    height: 15px;
    margin-top: 13px;
    margin-left: 8px;
  }
  .missingcard .subject .necessary{
    color: red;
    padding-right: 0px;
  }

  .missingcard .mstype .mint-popup{
    width: 70%;
  }
  .missingcard .col {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding-left: 10px;
    margin-bottom: 5px;
  }

  .missingcard .flex {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .missingcard .flex>div:first-child {
    height: 35px;
    line-height: 35px;
  }

  .missingcard .flex>div:nth-child(2) {
    flex: 1;
  }

  .missingcard .el-input__inner {
    border: none;
    outline: none;
    text-align: right;
    padding-right: 0px;
    font-size: 16px;
    color: #000;
    width: 45vw;
  }

  
  .missingcard .el-textarea {
    height: 100%;
  }

  .missingcard .el-textarea__inner {
    border: none;
    outline: none;
    font-size: 16px;
    height: 100%;
  }

  .missingcard .el-select .el-input__inner {
    padding-right: 0px;
  }
  .missingcard .el-input__suffix, .el-popper .popper__arrow {
    display: none;
  }

  .missingcard .approve {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    flex-wrap: wrap;
  }

  .missingcard .approve .head {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 19vw;
  }

  .missingcard .head>img{
    width: 50px;
    height: 50px;
  }
  .missingcard .footer{
    display: flex;
    justify-content: center;
    height: 52px;
  }

  .missingcard .footer .submit {
    background: #3598fe;
    color: white;
    width: 90%;
    margin: 5px 0px;
    font-size: 16px;
  }
</style>

