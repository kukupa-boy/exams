<template>
  <div class="dashboard-editor-container">
    <panel-group :data-model="statisticSummary" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div>近12月销售额统计</div>
      <line-chart red="销售额" blue="去年同月销售额" :chart-data="lineChartDataOne" />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div>近12月订单数曲线图</div>
          <line-chart red="订单数" blue="去年同月订单数" :chart-data="lineChartDataTwo" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div>近12月佣金金额曲线图</div>
          <line-chart red="产生佣金" blue="发放佣金" :chart-data="lineChartDataThree" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div>近30日销售额曲线图</div>
          <line-chart red="近30日销售额" :chart-data="lineChartDataFour" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart piepre="产品销售额百分比" :chart-data="lineChartDataFive" />
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { statisticSummary, statisticChart, statisticChartCommis, statisticChartSales, statisticPieSales } from '@/api/statisticorder'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import BarChart from './components/BarChart'
// import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

const lineChartDataOne = {
  newVisitis: {
    expectedData: [],
    actualData: [],
    xyDATA: []
  }
}
const lineChartDataTwo = {
  messages: {
    expectedData: [],
    actualData: [],
    xyDATA: []
  }
}
const lineChartDataThree = {
  messages: {
    expectedData: [],
    actualData: [],
    xyDATA: []
  }
}
const lineChartDataFour = {
  messages: {
    expectedData: [],
    actualData: [],
    xyDATA: []
  }
}
const lineChartDataFive = {
  messages: {
    expectedData: [],
    actualData: []
  }
}
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    // RaddarChart
    // PieChart
    PieChart
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      red: 'red',
      blue: 'green',
      lineChartDataOne: lineChartDataOne.newVisitis,
      lineChartDataTwo: lineChartDataTwo.messages,
      lineChartDataThree: lineChartDataThree.messages,
      lineChartDataFour: lineChartDataFour.messages,
      lineChartDataFive: lineChartDataFive.messages,
      statisticSummary: {
        monthcommis: 0,
        monthpaiedcommis: 0,
        todayorders: 0,
        todayamounts: 0,
        monthorders: 0,
        monthamounts: 0
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartDataOne[type]
    },
    convertNumberString(val) {
      const item = val + ''
      return item.substr(0, 4) + '年' + item.substr(4) + '月'
    },
    convertNumberDayString(val) {
      const item = val + ''
      return item.substr(0, 4) + '年' + item.substr(4, 2) + '月' + item.substr(6) + '日'
    },
    loadData() {
      statisticSummary().then((res) => {
        this.statisticSummary = res.data
        console.log(this.statisticSummary)
      })
      statisticChart().then((res) => {
        const chartLineData = res.data
        const lineChartsOne = {
          expectedData: [],
          actualData: [],
          xyDATA: []
        }
        const lineChartsTwo = {
          expectedData: [],
          actualData: [],
          xyDATA: []
        }
        if (chartLineData) {
          chartLineData.forEach((item) => {
            lineChartsOne.xyDATA.push(this.convertNumberString(item.datenumber))
            lineChartsOne.expectedData.push(item.amount)
            lineChartsOne.actualData.push(item.sums)
            lineChartsTwo.xyDATA.push(this.convertNumberString(item.datenumber))
            lineChartsTwo.expectedData.push(item.counts)
            lineChartsTwo.actualData.push(item.lastcounts)
          })
        }
        this.lineChartDataOne = lineChartsOne
        this.lineChartDataTwo = lineChartsTwo
      })
      statisticChartCommis().then((res) => {
        const chartLineData = res.data
        const lineChartsThree = {
          expectedData: [],
          actualData: [],
          xyDATA: []
        }
        if (chartLineData) {
          chartLineData.forEach((item) => {
            lineChartsThree.xyDATA.push(this.convertNumberString(item.datenumber))
            lineChartsThree.expectedData.push(item.amount)
            lineChartsThree.actualData.push(item.sums)
          })
        }
        this.lineChartDataThree = lineChartsThree
      })
      statisticChartSales().then((res) => {
        const chartLineData = res.data
        const lineChartsFour = {
          expectedData: [],
          actualData: [],
          xyDATA: []
        }
        if (chartLineData) {
          chartLineData.forEach((item) => {
            lineChartsFour.xyDATA.push(this.convertNumberDayString(item.datenumber))
            lineChartsFour.expectedData.push(item.amount)
            // lineChartsFour.actualData.push(item.sums)
          })
        }
        this.lineChartDataFour = lineChartsFour
      })
      statisticPieSales().then((res) => {
        const chartLineData = res.data
        const lineChartsFive = {
          expectedData: [],
          actualData: []
        }
        if (chartLineData) {
          var totalamount = 0
          chartLineData.forEach((item) => {
            totalamount += item.amount
          })
          var other = {
            productname: '其他',
            amount: 0
          }
          chartLineData.forEach((item) => {
            if (item.amount * 100 / totalamount < 10) {
              other.amount = other.amount + item.amount
            } else {
              lineChartsFive.expectedData.push(item.productname ? item.productname : '未知')
              lineChartsFive.actualData.push({
                value: item.amount,
                name: item.productname ? item.productname : '未知'
              })
            }
          })
          if (other.amount > 0) {
            lineChartsFive.expectedData.push(other.productname)
            lineChartsFive.actualData.push({
              value: other.amount,
              name: other.productname
            })
          }
        }
        console.log(lineChartsFive)
        this.lineChartDataFive = lineChartsFive
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
