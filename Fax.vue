<template>
  <div class="fax">
    <div style="height:100%;overflow:auto;display:flex;flex-direction:column">
      <div class="subject" v-for="(value,index) in ticks" :key="index" :class="{'active1':value.isActive}">
        <div class="subtitle" @click="open(index)">
          <img class="iconLeft" :src="icon" >
          {{value.label}}
          <img class="iconRight" :src="value.active?`${assets}/img/mobile/document/list_jts.png`:`${assets}/img/mobile/document/list_jsx.png`">
        </div>
        <ul style="height:914px;overflow-y:auto" :style="{display:value.active&&value.message.length>0?'block':'none'}"
            v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100">
          <li  v-for="(item,index) in value.message" :key="index"> 
            <a @click="getImage(item.path)"><span class="cname">{{item.cname}}</span><span class="time">{{item.tm?item.tm.substr(5,11):''}}</span></a>
          </li>           
        </ul>
        <div v-if="value.active&&(!value.message || value.message.length<=0)" :style="`margin:auto auto;width:192px;height:168px;background:url(${assets}/img/common/table/nodata.png) no-repeat;`">
          <div class="no-data">暂无数据</div>
        </div> 
      </div>
    </div>
    <div class="maskLayerWeather" v-show="popup" style="width:100%">
      <div class="closeIcon" @click="close()" :style="`background-image:url(${assets}/img/mobile/document/close.png)`"></div>
      <div class="faxlist">
        <div class="pageview" v-for="(value,index) in mySrc" :key="index">
          <img :src="'/'+value" style="width:100%">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @author xyr
 * @since created by xyr 2018-12-09
 * @description  邮箱及预览
 */
import Vue from "vue";
import { InfiniteScroll ,Toast} from 'mint-ui';
Vue.use(InfiniteScroll);
export default {
  data(){
    return{
      icon:`${T.assets}/img/mobile/document/list_icon.png`,
      ticks:[
        {
          label:'收件箱',
          active:false,
          isActive:false,
          message:[]
        },
        {
          label:'发件箱',
          active:false,
          isActive:false,
          message:[]
        }
      ],
      recvpage:1,
      sendpage:1,
      popup:false,
      mySrc:[]
    }
  },
  mounted(){
    this.getMessage()
  },
  methods:{
    loadMore(){
      if(this.ticks[0].active ===true){
        this.recvpage++
        this.getMessage()
      }
      if(this.ticks[1].active ===true){
        this.getMessage()
        this.sendpage++
      }
    },
    open(index){
      for(let i=0;i<this.ticks.length;i++){
        if(i==index){
          this.ticks[i].active = (this.ticks[i].active===false?true:false)
          this.ticks[i].isActive = (this.ticks[i].isActive===false?true:false)
        }else{
          this.ticks[i].active = false;
          this.ticks[i].isActive = false;
        }
      }
    },
    getMessage(){
      T.ajax({
        method:"GET",
        url:"/api/exam/faxlist",
        success:data=>{
          this.ticks[0].message = this.ticks[1].message.concat(data.cdata)
          this.ticks[1].message = this.ticks[1].message.concat(data.sdata)
        }
      })
    },
    getImage(path){
      this.popup = true
      this.mySrc = path.split(",")
    },
    close(){
      this.popup = false
    }
  }
}
</script>

<style>
  .fax{
    margin:0px;
    padding:0px;
    width: 100%;
    height: 100%;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    overflow: hidden;
    position: absolute;
  }
  .fax .subject {
    font-family: "MicrosoftYaHei";
  }
  .fax .subject:nth-child(1) {
    padding-top: 8px;
    background-color: #f6f6f6;
    border-top: 1pt solid #eeeeee;
  }
  .fax .subject ul {
    padding-left: 15pt;
    background-color: #f9f9f9;
    overflow: hidden;
    margin-bottom: 0px;
    border-bottom: 1pt solid #eeeeee;
    list-style:none;
    flex:1;
    margin:0px;
  }
  .fax li {
    display: list-item;
    text-align: -webkit-match-parent;
    }
  .fax .subject ul li:not(:last-child) {
    border-bottom: 1px solid #eee;
    }
  @media (min-device-width : 396px){
    .subject ul li {
        padding: 8px 0pt 8px 0px;
    }
  }
  @media (max-device-width : 395px){
    .subject ul li{
        padding: 14px 0pt 14px 14px;
    }
  }
  .fax .subject li a, .subject li a:hover, .subject li a:active, .subject li a:focus {
    color: #333333;
    text-decoration: none;
    display: block;
  }

  .fax .subject  .time {
    color: #959595;
    font-size: 14px;
  }

  .fax li a span[class="cname"] {
    display:inline-block;
    width: 60%
  }

  .fax li a span[class="time"] {
    padding: 0px 10px;
    display: inline-block;
    float: right;
  }
  .fax .subject .subtitle {
    font-size: 16px;
    line-height: 16px;
    color: #121212;
    text-align: left;
    padding: 16px 20px 14px 14px;
    border-bottom: 1pt solid #eeeeee;
    background-color: #fff;
    display: block;
  }
  .fax .subtitle img {
    margin-right: 1rem;
    margin-bottom: 3px;
  }
  .fax .subtitle .iconLeft {
    width: 12pt;
    margin-bottom: 2px;
    margin-right: 2px;
  }
  .fax .subtitle .iconRight {
    float: right;
    width: 14pt;
  }
  .fax .maskLayerWeather {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    position: absolute;
    top: 8px;
    left: 0;
    z-index: 1000;
    filter: alpha(opacity=30);
  }
  .fax .maskLayerWeather .closeIcon {
    display: block;
    font-size: 28px;
    right: 2%;
    top: 1%;
    position: absolute;
    background-color: #333;
    color: #fff;
    border-radius: 14px;
    width: 26px;
    height: 26px;
    text-align: center;
    background-size: 100% 100%;
  }
  .fax .maskLayerWeather .faxlist {
    height: 90%;
    width: 90%;
    margin: 5% auto auto;
    background-color: rgba(255, 255, 255, 0.9);
    overflow-y: auto;
  }
  .fax .pageview {
    padding: 0px 0px 5px;
  }

  .fax .active1{
    display:flex;
    flex-direction:column;
    flex:1
  }
  .fax .no-data{
    color: #5d5d5d;
  text-align: center;
  padding-top: 140px;
  }
</style>
