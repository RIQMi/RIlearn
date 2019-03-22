<template>
  <div class="monitor2">
    <div class="load" :style="loading">
      <el-progress stroke-width="10" color="#01B9FF" type="circle" status="text"  :percentage="val"
        style="position:absolute;z-index:99;top:40%;left:45%" :style="loading"><span style="color:#fff;font-size:20px;font-weight:bold">Loading</span></el-progress>
    </div>
    <div class="divTop">
      <div class="title">
        <div class="type">
          <button :style="{'background-color':(origin==='山洪')?'#00c2fd':'#042549'}" @click="changeorigin('sh')">防汛</button>
          <button :style="{'background-color':(origin==='水文')?'#00c2fd':'#042549'}" @click="changeorigin('sw')">水文</button>
        </div>
        <div class="middle">
          <span>上数情况统计表</span>
          <date-time-component class="timecontrol" width="200" dt-format="yyyy-MM-dd" picker-type='date' :dt-value="myTime"  v-on:onChange="changeTime"></date-time-component>
        </div>
        <div class="statistics">
          <button :style="{'background-color':(dpmethod===true)?'#00c2fd':'#042549'}"  @click="changedisplay('tj')">统计</button>
          <button :style="{'background-color':(!dpmethod===true)?'#00c2fd':'#042549'}"  @click="changedisplay('bb')">报表</button>
        </div>
      </div>
    </div>
    <div class="continar1" v-show="dpmethod">
      <div class="count">
        <div class="divCount">
          <div class="name" style="background-color:#08416f"><span>总数</span></div>
          <div class="number">{{reportedTotal+noneTotal}}</div>
        </div>
        <div class="divCount">
          <div class="name" style="background-color:#008642"><span>已上数</span></div>
          <div class="number">{{reportedTotal}}</div>
        </div>
        <div class="divCount">
          <div class="name" style="background-color:#a9211c"><span>未上数</span></div>
          <div class="number">{{noneTotal}}</div>
        </div>
        <div class="divCount">
          <div class="name" style="background-color:#08416f"><span>上数率</span></div>
          <div class="number">{{reportedTotal+noneTotal!==0?(reportedTotal/(reportedTotal+noneTotal)==1?(reportedTotal/(reportedTotal+noneTotal)*100).toFixed(0):(reportedTotal/(reportedTotal+noneTotal)*100).toFixed(1)):(0.0)}}%</div>
        </div>  
      </div>
      <nodata-component v-if='!message.length' :height="nodataHeight"/>  
      <div class="area">
        <div class="details"  v-for="(value,index) in message" :key="index">
          <div class="divDetails">
            <div class="region">{{value.adnm}}</div>
            <div class="echarts">
              <monitor-chart  style="height:100%;width:100%;" :data-provider="[{value:value.reportedNum,name:'已上报',itemStyle:{color:'#2b82c8'}},
                             {value:(value.stationNum-value.reportedNum),name:'未上报',itemStyle:{color:'#c13435'}}]"
                             :percent="(value.stationNum!==0?((value.reportedNum/value.stationNum)==1?(value.reportedNum/value.stationNum*100).toFixed(0):(value.reportedNum/value.stationNum*100).toFixed(1)):('0.0'))"/>
            </div>
            <div class="census">
              <div class="box">
                <div class="boxName">总数</div>
                <div class="boxNumber">{{value.stationNum}}</div>
              </div>
              <div class="box" >
                <div class="boxName">上数</div>
                <div class="boxNumber" @click="check(value.adnm,value.adcd,1)" style="text-decoration: underline;cursor: pointer;">{{value.reportedNum}}</div>
              </div>
              <div class="box">
                <div class="boxName">未上数</div>
                <div class="boxNumber" @click="check(value.adnm,value.adcd)" style="text-decoration: underline;cursor: pointer;">{{value.stationNum-value.reportedNum}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="continar2" v-show="!dpmethod">
      <table class="style1">
        <thead>
          <tr>
            <th class="thead" style="height:34px;width:80px">
              <div class="relative"><span class="colHeader">序号</span></div>
            </th>
            <th class="thead" style="height:34px;width:150px">
              <div class="relative"><span class="colHeader">区域</span></div>
            </th>
            <th class="thead" style="width:150px">
              <div class="relative"><span class="colHeader">已报</span></div>            
            </th>
            <th class="thead" style="width:150px">
              <div class="relative"><span class="colHeader">未报</span></div>            
            </th>
            <th class="thead" style="width:150px">
              <div class="relative"><span class="colHeader">总数</span></div>            
            </th>
            <th class="thead" style="width:150px">
              <div class="relative"><span class="colHeader">上报率(%)</span></div>            
            </th>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr v-for="(value,index) in message" :key="index">
            <td class="num">{{index+1}}</td>
            <td>{{value.adnm}}</td>
            <td @click="check(value.adnm,value.adcd,1)" class="on">{{value.reportedNum}}</td>
            <td @click="check(value.adnm,value.adcd)" class="on">{{value.stationNum-value.reportedNum}}</td>
            <td>{{value.stationNum}}</td>
            <td>{{(value.stationNum!==0?((value.reportedNum/value.stationNum)*100).toFixed(1):('0.0'))}}</td>
          </tr>
          <tr>
            <td>合计</td>
            <td></td>
            <td>{{reportedTotal}}</td>
            <td>{{noneTotal}}</td>
            <td>{{reportedTotal+noneTotal}}</td>
            <td>{{(reportedTotal/(reportedTotal+noneTotal)*100).toFixed(1)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <popup class="popup" v-if="show" @emitClose="back()" :width="tableW" :height="tableH" :border='1' :modal='false' :draggable='false' color="#0A68CC" :title='Title'>
      <iframe class="popupIframe" :src="myUrl" frameborder="0" scrolling="auto"></iframe>
     
    </popup>
  </div>
</template>

<script>
/**
 * @author xyr
 * @since created by xyr 2018-12-05 
 * @description  潍坊上数情况统计表
 */

import Vue from "vue";
import { Progress } from "element-ui";
import DateTimeComponent from "../../components/DateTimeComponent";
import popup from "../../components/Popup";
import Time from "../../utils/Time";
import MonitorChart from "./MonitorChart";
import NodataComponent from "../../components/NodataComponent";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/chart/pie";

Vue.use(Progress);
export default {
  components:{
    DateTimeComponent,
    popup,
    NodataComponent,
    MonitorChart
  },
  data(){
    return{
      tableW:0,
      tableH:0,
      myTime:'',
      message:[],
      datas:[],
      reqSTime: null,
      myTime:T.clock(T.now()).fmt("YYYY-MM-DD"),
      show:false,
      dpmethod:true,
      situation:'',
      areaName:'',
      loading:{display:'block'},
      val:0,
      origin:'山洪',
      val_timer:null,
      hourDiff:24,
      myUrl:''
    }
  },
  mounted(){
    this.tableW=this.$el.clientWidth*0.6;
    this.tableH=this.$el.clientHeight*0.7;
    this.monitor()
  },
  created(){
    let { hour } = this.$route.query;
    if(hour){
      this.hourDiff = hour 
    }     
  },
  computed:{
    Title:function(){
      return this.areaName+'上报情况('+this.situation+')';
    },
    reportedTotal:function(){
      var reportedtotal=0;
      this.message.map((item,i)=>{
        reportedtotal=reportedtotal+item.reportedNum;
      })
      return reportedtotal
    },
    noneTotal:function(){
      var nonetotal=0;
      this.message.map((item,i)=>{
        nonetotal=nonetotal+item.stationNum-item.reportedNum;
      })
      return nonetotal
    }
  },
  methods:{
    check(adnm,adcd,isreported){
      this.show = true
      let mytime = this.myTime + " " + new Date().getHours() +":00"
      let e_time = Time.GetDateDiff(mytime,1,"HH").substring(0,16)
      let b_time = Time.GetDateDiff(e_time,-this.hourDiff,"HH").substring(0,16)
      if(isreported)
        this.myUrl ="/CommonReport/TableListReport.aspx?isreported="+isreported+"&adcd="+adcd+"&btime="+b_time+"&etime="+e_time+"&type="+this.origin+"&ISDISPLAY=5291&skin=default"
      else
        this.myUrl ="/CommonReport/TableListReport.aspx?adcd="+adcd+"&btime="+b_time+"&etime="+e_time+"&type="+this.origin+"&ISDISPLAY=5291&skin=default"
      this.areaName = adnm
      if(isreported===1){
        this.situation = '已报'
      }else{
        this.situation = '未报'
      }
    },
    //关闭弹窗
    back(){
      this.show = false
    },
    monitor(){
      let mytime = this.myTime + " " + new Date().getHours() +":00"
      let e_time = Time.GetDateDiff(mytime,1,"HH").substring(0,16)
      let b_time = Time.GetDateDiff(e_time,-this.hourDiff,"HH").substring(0,16)
      this.timer()
      T.ajax({
        method:"GET",
        url:'/API/Monitor/areacount',
        data:{
          btime:b_time,
          etime:e_time,
          adcd:""+T.cookie('AreaCode')+"",
          type:this.origin
        },
        success:data=>{
          clearInterval(this.val_timer)
          this.message = data.data
          this.loading.display='none';
        },
        error:function(request){
          this.loading.display='none';
          clearInterval(this.val_timer)
        }
      })
    },
    //切换山洪、水文
    changeorigin(origin){
      if(origin === 'sh'){
        this.origin = '山洪'
      }
      if(origin === 'sw'){
        this.origin = '水文'
      }
      this.loading.display='block'
      this.monitor()
    },
    //切换统计、报表
    changedisplay(method){
      if(method === 'tj'){
        this.dpmethod = true
      }
      if(method === 'bb'){
        this.dpmethod = false
      }
    },
    changeTime(tm){
      this.val = 0;
      this.myTime = T.clock(tm).fmt("YYYY-MM-DD ")
      this.loading.display='block'
      this.monitor()
    },
    timer(){
      this.val = 0;
      this.val_timer = setInterval(() => {
          this.val+=9;
        if(this.val >= 99){
          clearInterval(this.val_timer);
        }
      },1);
    }
  }
}
</script>

<style>
  .monitor2 .load{
    width: 100%;
    height:100%;
    z-index:999;
    position: absolute;
    background: rgba(255, 255, 255, 0.5)
  }
  .monitor2{
    width: 100%;
    height: 100%;
    background-color: #052c50;
    overflow:auto;
  }
  .monitor2 .scheme,.report{
    width: 100%;
    height: 100%;
    background-color: #052c50;
    z-index:-1;
  }
  .monitor2 .divTop{
    width: 100%;
    height: 7%;
    font-size:26px;
    position: relative;
    min-width: 800px;
    min-height: 60px;
  }
  .monitor2 .divTop .title{
    width: 100%;
    height: 40%;
    bottom:15%;
    position: absolute;
    text-align:center;
    color: #ffffff;
    display: flex;
    flex-direction: row;
  }
  .monitor2 .buttons{
    display: inline;
    z-index:1
  }
  .monitor2 .title .type{
    margin-left: 50px;
    height: 30px;
    width:100px ;
  }
  .monitor2 .title .statistics{
    margin-right: 32px;
    height: 30px;
    width:100px ;
  }
  .monitor2 button{
    color: #fff;
    height: 30px;
    width: 45px;
    font-size:14px;
    background-color: #042549;
    border:1px solid #00c2fd;
    float: left;
    cursor: pointer;
  }
  .monitor2 .title .middle{
    margin:0 auto
  }
  .monitor2 .timecontrol .el-input__inner {
    background-color: #052c50 !important;
    border: 1px solid #046684 !important;
    font-size: 20px !important;
    line-height: 30px;
    text-align: center;
    color:#fff;
}
  .monitor2 .continar1{
    height: 93%;
    width: 100%;
  }
  .monitor2 .continar1 .count{
    width: 100%;
    height: 12%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: relative;
    min-width: 800px;
  }
  .monitor2 .count .divCount{
    width: 21%;
    height: 82%;
    display: flex;
    flex-direction: row;
    margin:20px 0px 0px 20px;
  }
  .monitor2 .name{
    width: 35%;
    color: #ffffff;
    text-align: center;
    line-height: 9vh;
    font-size: 2.5vh;
  }
  .monitor2 .number{
    background-color: #012140;
    width: 65%;
    height: 100%;
    color: #ffffff;
    text-align: center;
    font-size: 3vh;
    line-height: 9vh;
  }
  .monitor2 .area{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: hidden;
    margin-left:25px;
  }
  .monitor2 .details{
    height: 335px;
    width: 280px;
    margin-left: 25px;
    margin-top:20px;
  }
  .monitor2 .divDetails{
    height: 335px;
    width: 280px;
    background-color: #012140;
    color: #ffffff;
    border-top: 1px solid #0091fd;
  }
  .monitor2 .region{
    height: 10%;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
  }
  .monitor2 .echarts{
    width:100%;
    height: 65%;
  }
  .monitor2 .census{
    width:100%;
    height: 25%;
    display: flex;
    flex-direction: row;
  }
  .monitor2 .box{
    height: 95%;
    width: 30%;
    background-color: #012c56;
    margin-left:7px;
    position: relative;
  }
  .monitor2 .boxName{
    position: absolute;
    margin-left:10%;
    margin-top:5px;
    width: 80%;
    height: 35%;
    text-align: center;
    font-size: 15px;
    line-height: 20px;
  }
  .monitor2 .boxNumber{
    position: absolute;
    margin-top:30px;
    margin-left:10%;
    width: 80%;
    height: 65%;
    color: #ffffff;
    font-size:28px;
    text-align: center;
    line-height: 35px;
    border-top:1px solid #0086aa;
  }
  .continar2 .style1{
    border-collapse:collapse;
		border-spacing:0;
		border-left:1px solid #0d2d4d !important;
    border-top:1px solid #0d2d4d !important;
    margin:0 auto;
    color:#fff;
  }
  .continar2 .style1{
    width:90%;
    margin-top:30px;
  }
  .continar2 .style2{
    width:100%
  }
  .continar2 .thead{
    height:34px;
    position: relative;
    font-size: 24px;
  }
  .continar2 .popup{
    position: absolute;
    top:0px;
    margin:0px;
    padding:0px;
  }
  .monitor2 .popup-box .popup-body{
    background-color: #052c50;
    overflow: visible
  }
  .thead,.monitor2 .continar2 .style1 .tbody td{
    border-right:1px solid #17385b !important;;
		border-bottom:1px solid #17385b !important;;
    padding:5px 15px;
    height: 30px;
    line-height: 30px;    
  }
  .monitor2 .popup .popupIframe{
    width: 100%;
    height: 100%;
  }
  .monitor2 .style1 th{
    background-color: #225c95 !important;
  }
  .monitor2 .style1 tr:nth-child(odd) td{
    background-color:#081d33 !important;
  }
  .monitor2 .style1 tr:nth-child(even) td{
    background-color:#0d2d4d !important;
  }
  .thead,.monitor2 .continar2 .style1 .tbody tr{
    text-align:center;
    font-size:20px;
  }
  .monitor2 .style1 .num{
    width: 20px
  }
  .monitor2 .style1 .on{
    text-decoration: underline;
    cursor: pointer;
  }
</style>