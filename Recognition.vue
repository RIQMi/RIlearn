<template>
  <container :style="{'width':'550px'}" :title="title" @onClose="close">
    <div class="recognition">
    <div class="plugin"><a href="/Video/Controls/ActiveXSDK.exe"  target="_blank">插件下载</a></div>
      <div class="up">
        <img
          class="iframe-img"
          :src="assets+'/img/flood/sp2.png'"
          v-show="!isVideo"     
          @click="broadcast()"
        >
        <iframe :src="videoUrl"  width="100%" height="100%" scrolling="no" frameborder="0"/>
      </div>
      <div class="chart-title">{{range_time}}</div>
      <div class="down">
        <div class="echarts" ref="waterChart"></div>
      </div>
      <div class="staff" :style="staff">
        <div class="staff-bottom">
          <span class="staff-wz">水尺高度：</span>
          <span class="staff-sz">{{gaugeH}}</span>
          <span>(cm)</span>
        </div>
        <div class="staff-bottom">
          <span class="staff-wz">实际水位：</span>
          <span class="staff-sz">{{curRz}}</span>
          <span>(m)</span>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import Vue from "vue";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";
// 引入折线图、柱状图
import "echarts/lib/chart/line";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";

import Container from "@/components/PopupComponent";

//import getDTime from "../../utils/getDTime";
import Time from "../../utils/Time";
export default {
  components: { Container },
  data() {
    return {
      isVideo: 0,
      Xdatas: [],
      Sdatas: [],
      gaugeH: "-",
      curRz: "-",
      maxVal: null,
      minVal: null,
      range_time: "",
      stcd: null,
      title: null,
      vid:null,
      videoUrl:null
    };
  },
  created() {
    if (this.data && this.data.data) {
      this.stcd = this.data.data.stcd;
      this.title = this.data.data.stnm;
      //水尺高度
      if(this.data.data.val)
        this.gaugeH=this.data.data.val.toFixed(2);
      //实测水位
      if(this.data.data.rz)  
        this.curRz=this.data.data.rz.toFixed(2);
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    // 关闭弹窗
    close() {
      this.data.owner._close();
    },
    broadcast() {
      this.isVideo = !this.isVideo;
      if(this.isVideo)
        this.videoUrl="/Video/Video.htm?Vid="+this.vid;
    },
    load() {
      //加载请求数据
      let begin_time = Time.GetTime(1);
      let end_time = Time.GetTime(2);
      if (begin_time.slice(8, 10) == end_time.slice(8, 10)) {
        this.range_time =begin_time.slice(8, 10) +"日" +begin_time.slice(11, 13) +"时至" +end_time.slice(11, 13) +"时";
      } else {
        this.range_time =begin_time.slice(8, 10) +"日" +begin_time.slice(11, 13) +"时至" +end_time.slice(8, 10) +"日" +end_time.slice(11, 13) +"时";
      }
      this.range_time+="水位过程线";
      T.ajax({
        methods: "POST",
        url: "/api/recognition/reservior/image",
        dataType: "json",
        data: {
          stcd: this.stcd,
          begin_time: begin_time,
          end_time: end_time
        },
        success: data => {
          //赋值视频编号
          if(data.vdata&&data.vdata.length>0)
          {
            this.vid=data.vdata[0].vid;
          }
          //绘制报图数据
          if (data.data && data.data.length > 0) {
            data=data.data;
            (this.maxVal = data[0].val), (this.minVal = data[0].val);
            //console.log(data);
            //data.forEach(()=>)
            data.map((item, index) => {
              if (item.tm)
                this.Xdatas.push(
                  item.tm.slice(8, 10) + "日" + item.tm.slice(11, 13) + "时"
                );

              if (item.val) {
                this.Sdatas.push(item.val.toFixed(2));
                if (item.val > this.maxVal) {
                  this.maxVal = item.val;
                }
                if (item.val < this.minVal) {
                  this.minVal = item.val;
                }
              }
            });

            this.maxVal += 0.5;
            this.minVal -= 0.5;
          }
          
          if(!this.maxVal&&!this.minVal){
            this.maxVal=1;
            this.minVal=0;
          }
          this.drawChart();
        },
        error: function() {
          alert("获取数据异常");
        }
      });

      //this.drawChart();
    },
    drawChart() {
      //绘制报图
      var option = {
        tooltip: {
          show: true,
          trigger: "axis"
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          top: 30,
          bottom: 20,
          left: 55,
          right: 5
        },
        xAxis: {
          boundaryGap: false,
          data: this.Xdatas,
          axisLine: {
            lineStyle: {
              color: "#081d33"
            }
          }
        },
        yAxis: {
          type: "value", 
          name: "水位(m)",
          //nameLocation:'middle',
          min: this.minVal,  
          max: this.maxVal,
          axisLine: {
            lineStyle: {
              color: "#081d33"
            }
          },
          axisLabel: {
            formatter: function(value, index) {
              return value.toFixed(2);
            }
          }
        },
        series: [
          {
            name: "当前水位",
            type: "line",
            data: this.Sdatas,
            lineStyle: {
              color: "#1896de"
            },
            symbol: "emptycircle",
            itemStyle: {
              normal: {
                color: "#00CDFF"
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00ccff"
                  },
                  {
                    offset: 1,
                    color: "#fff"
                  }
                ])
              }
            }
          }
        ]
      };

      let myChart = (this.chart = echarts.init(this.$refs.waterChart));
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.recognition {
  overflow: hidden;
  width: 550px;
  height: 490px;
  margin: 0px;
  padding: 0px;
  background: #fff;
}

.recognition .plugin a{
    position: absolute;
    right: 50px;
    top: 0px;
    color: rgb(255, 255, 255);
    height: 30px;
    line-height: 30px;
    font-size: 16px;
}

.recognition .up,
.recognition .down {
  width: 530px;
  height: 215px;
  margin-top: 5px;
  margin-left: 10px;
}
.recognition .echarts {
  width: 100%;
  height: 210px;
  margin-top: 5px;
}
.recognition .iframe-img {
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.recognition .iframe-video {
  overflow: hidden;
  width: 530px;
  height: 215px;
}

.recognition .chart-title {
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.recognition .staff {
  display: block;
  width: 100%;
  height: 25px;
  line-height: 25px;
  margin-top: 5px;
}
.recognition .staff .staff-bottom {
  float: left;
  width: 50%;
  font-size: 12px;
  font-weight: bold;
}
.recognition .staff .staff-wz {
  display: inline-block;
  margin-left: 80px;
}

.recognition .staff .staff-sz {
  text-align: center;
  color: #0076dc;
}
</style>
