<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
        <el-form-item :label="$t('userAnalysis.year')">
          <el-date-picker
            v-model="dataForm.yearDate"
            type="year"
            :placeholder="$t('userAnalysis.chooseYear')"
            value-format="yyyy"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLineData">{{ $t('userAnalysis.lookup') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="components-container">
      <line-chart v-loading="loading" :blue="$t('userAnalysis.newIncreasePeople')" :chart-data="lineChartDataOne" />
    </div>
  </div>
</template>
<script>
import LineChart from '@/views/dashboard/admin/components/LineChart'
import { statisticUsersUps } from '@/api/statisticorder'
const lineChartDataOne = {
  newVisitis: {
    expectedData: [],
    actualData: [],
    xyDATA: []
  }
}
export default {
  name: 'UserAnalysis',
  components: {
    LineChart
  },
  data() {
    return {
      dataForm: {
        yearDate: '2019'
      },
      lineChartDataOne: lineChartDataOne.newVisitis,
      loading: true
    }
  },
  created() {
    this.getLineData()
  },
  methods: {
    convertNumberString(val) {
      const item = val + ''
      return item.substr(4, 6) + '月'
    },
    getLineData() {
      statisticUsersUps(this.dataForm.yearDate)
        .then((res) => {
          this.loading = true
          const chartLineData = res.data
          const lineChartsOne = {
            expectedData: [],
            actualData: [],
            xyDATA: []
          }
          if (chartLineData) {
            chartLineData.forEach((item) => {
              lineChartsOne.xyDATA.push(this.convertNumberString(item.datenumber))
              lineChartsOne.expectedData.push(item.count)
              lineChartsOne.actualData.push(item.count)
            })
          }
          this.lineChartDataOne = lineChartsOne
          setTimeout(() => {
            this.loading = false
          }, 1.5 * 1000)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped lang="scss">
</style>
