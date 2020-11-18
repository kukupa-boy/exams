<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    red: {
      type: String,
      default: ''
    },
    blue: {
      type: String,
      default: ''
    },
    redColor: {
      type: String,
      default: '#FF005A'
    },
    blueColor: {
      type: String,
      default: '#3888fa'
    },
    areaRedColor: {
      type: String,
      default: '#FF005A'
    },
    areaBlueColor: {
      type: String,
      default: '#f3f8ff'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData, xyDATA } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xyDATA,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [this.red, this.blue]
        },
        series: [{
          name: this.red, itemStyle: {
            normal: {
              color: this.redColor,
              lineStyle: {
                color: this.redColor,
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: this.blue,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: this.blueColor,
              lineStyle: {
                color: this.blueColor,
                width: 2
              },
              areaStyle: {
                color: this.areaBlueColor
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
