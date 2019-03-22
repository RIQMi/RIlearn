<template>
  <div></div>
</template>

<script>
import Vue from "vue";

import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/chart/pie";
export default {
  props: {
    dataProvider: {
      type: Array
    },
    percent:{
      type:JSON
    }
  },
  watch: {
    dataProvider() {
      this.doChart();
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.doChart();
  },
  methods:{
    doChart(){
      // if(!myChart){
        let myChart = echarts.init(this.$el)
        var option = {
          tooltip:{
            trigger:'item',
            formatter:"{a} <br/>{b}: {c} ({d}%)"
          },
          
          legend: {
            orient: 'vertical',
            x: 'left',
            data:['上数','未上数']
          },
          series:[
            {
       
              name:'上数情况',
              type:'pie',
              radius: ['45%', '70%'],
              avoidLabelOverlap: false,
              itemStyle:{
                normal:{
                  borderWidth:4,
                  borderColor:'#012140'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: params => {
                    return this.percent + "%"
                  },
                  textStyle:{
                    fontSize:'24',
                    color:'#ccc',
                  }
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.dataProvider
            }
          ]
        }
      myChart.setOption(option);
      // }else{
      //   var option = myChart.getOption()
      //   option.series[0].data = this.dataProvider;
      //   myChart.setOption(option);
      // }
      
    },
    // refreshData(){
    //   var option = myChart.getOption()
    //   option.series[0].data = this.dataProvider;
    //   myChart.setOption(option);
    // }
  }
}
</script>
