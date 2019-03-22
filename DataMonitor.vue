<template>
  <div class="monitor1">
    <div>
      <div class="title"><h1>上报情况统计表（{{myTime}}）</h1></div>
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
        <tbody>
          <tr v-for="(value,index) in message" :key="index">
            <td class="num">{{index+1}}</td>
            <td>{{value.adnm}}</td>
            <td @click="check(value.adnm,value.adcd,1)" class="on">{{value.reportedNum}}</td>
            <td @click="check(value.adnm,value.adcd)" class="on">{{value.stationNum-value.reportedNum}}</td>
            <td>{{value.stationNum}}</td>
            <td>{{(value.stationNum!==0?((value.reportedNum/value.stationNum)*100).toFixed(2):('0.00'))}}</td>
          </tr>
          <tr>
            <td>合计</td>
            <td></td>
            <td>{{reportedTotal}}</td>
            <td>{{noneTotal}}</td>
            <td>{{reportedTotal+noneTotal}}</td>
            <td>{{(reportedTotal/(reportedTotal+noneTotal)*100).toFixed(2)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <popup class="popup" v-if="show" @emitClose="back()" :width="tableW" :height="tableH" :border='1' :modal='false' :draggable='false' color="#0A68CC" :title='Title'>
      <table class="style2">
        <thead>
          <tr>
            <th class="thead" style="height:34px;width:80px">
              <div class="relative"><span class="colHeader">序号</span></div>
            </th>
            <th class="thead" style="height:34px;width:160px">
              <div class="relative"><span class="colHeader">测站编码</span></div>
            </th>
            <th class="thead" style="width:160px">
              <div class="relative"><span class="colHeader">测站名称</span></div>            
            </th>
            <th class="thead" style="width:160px">
              <div class="relative"><span class="colHeader">最新上报时间</span></div>            
            </th>
            <th class="thead" style="width:160px">
              <div class="relative"><span class="colHeader">雨量值(mm)</span></div>            
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value,index) in datas" :key="index">
            <td class="num">{{index+1}}</td>
            <td>{{value.stcd}}</td>
            <td>{{value.stnm}}</td>
            <td>{{value.tm?(value.tm.substring(5,7)+'月'+value.tm.substring(8,10)+'日'+value.tm.substring(11,13)+'时'):value.tm}}</td>
            <td>{{(((value.drp>=0)&&(value.drp!==null))?(value.drp).toFixed(1):value.drp)}}</td>
          </tr>
          <tr v-if='!datas.length'>
            <td colspan="5">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </popup>
  </div>
</template>

<script>
import Vue from "vue";
import popup from "../../components/Popup";
var mytime = new Date()
export default {
  components:{
    popup
  },
  data(){
    return{
      tableW:0,
      tableH:0,
      areaName:'',
      situation:'',
      show:false,
      message:[],
      datas:[],
      myTime:'',
      b_time:0,
    }
  },
  mounted(){
    this.tableW=this.$el.clientWidth*0.9;
    this.tableH=this.$el.clientHeight*0.8;
    this.myTime = mytime.getFullYear()+'-'+(mytime.getMonth()+1)+"-"+mytime.getDate()
    this.monitor()
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
      var myDate = new Date();
      var b_time = mytime.getFullYear()+'-'+(mytime.getMonth()+1)+'-'+mytime.getDate()+" 00:00"
      var afterDate = new Date(myDate.setDate(myDate.getDate()+1))
      var e_time = afterDate.getFullYear()+'-'+(afterDate.getMonth()+1)+'-'+afterDate.getDate()+" 00:00"
      T.ajax({
        method:"GET",
        url:'API/Monitor/reportedList',
        data:{
          btime:b_time,
          etime:e_time,
          adcd:adcd,
          isreported:isreported
        },
        success:data=>{
          this.datas = data.data
          this.areaName = adnm
          if(isreported===1){
            this.situation = '已报'
          }else{
            this.situation = '未报'
          }
        }
      })
    },
    back(){
      this.show = false
    },
    monitor(){
      var myDate = new Date();
      var b_time = mytime.getFullYear()+'-'+(mytime.getMonth()+1)+'-'+mytime.getDate()+" 00:00"
      var afterDate = new Date(myDate.setDate(myDate.getDate()+1))
      var e_time = afterDate.getFullYear()+'-'+(afterDate.getMonth()+1)+'-'+afterDate.getDate()+" 00:00"
      T.ajax({
        method:"GET",
        url:'API/Monitor/areacount',
        data:{
          btime:b_time,
          etime:e_time 
        },
        success:data=>{
          this.message = data.data
        },
        error:function(request){
        }
      })
    },
  }
}
</script>


<style>
  .monitor1{
    height:100%;
    width:100%;
    padding:0px;
    margin:0px;
    position: relative;
  }
  .monitor1 .title{
    height:50px;
    text-align: center;
    color: #fff;
  }
  .monitor1 .style1,.style2{
    border-collapse:collapse;
		border-spacing:0;
		border-left:1px solid #0d2d4d !important;;
    border-top:1px solid #0d2d4d !important;;
    margin:0 auto;
    color:#fff;
  }
  .monitor1 .style1{
    width:90%;
    margin-top:30px;
  }
  .monitor1 .style2{
    width:100%
  }
  .monitor1 .popup{
    position: absolute;
    top:0px;
  }
  .monitor1 .thead{
    height:34px;
    position: relative;
    font-size: 18px;
  }
  .num{
    width: 20px
  }
  th,td{
    border-right:1px solid #17385b !important;;
		border-bottom:1px solid #17385b !important;;
    padding:5px 15px;
    height: 30px;
    line-height: 30px;    
  }
  th{
    background-color: #225c95 !important;
  }
  tr:nth-child(odd) td{
    background-color:#081d33 !important;
  }
  tr:nth-child(even) td{
    background-color:#0d2d4d !important;
  }
  tr,th{
    text-align:center;
  }
  .on{
    text-decoration: underline;
    cursor: pointer;
  }
</style>


