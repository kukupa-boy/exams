<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :rules="rules" :model="listQueryFilter" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="$t('agentCapital.city')" prop="cityId">
          <el-select v-model="listQueryFilter.cityId" clearable class="filter-item" :placeholder="$t('agentCapital.searchByCity')" style="width: 280px;">
            <el-option v-for="item in cityList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('agentCapital.timeInterval')" prop="tempTimes">
          <el-date-picker
            v-model="listQueryFilter.tempTimes"
            value-format="timestamp"
            class="filter-item"
            clearable
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('agentCapital.startTime')"
            :end-placeholder="$t('agentCapital.endTime')"
            style="width: 280px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="getAgentCapitalTotalCount">{{ $t('agentCapital.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <PanelGroup :total-count="agentCapitalTotalCount" />
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getTotalCount } from '@/api/agentCapital'
import { getCitys } from '@/api/city'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { mapState } from 'vuex'
import PanelGroup from './components/PanelGroup' // 统计图标

export default {
  name: 'AgentCapital',
  directives: {
    waves
  },
  components: {
    PanelGroup
  },
  filters: {
    imgFilter(v) {
      if (v) {
        return v
      }
      return v
    }
  },
  data() {
    return {
      myHeaders: { token: getToken() },
      tableKey: 0,
      listQueryFilter: {
        cityId: null,
        tempTimes: []
      },
      agentCapitalTotalCount: null,
      cityList: [],
      downloadLoading: false,
      rules: {
        cityId: [{ required: true, message: '请选择城市名称', trigger: 'change' }],
        tempTimes: [{ type: 'array', required: true, message: '请选择活动时间区间', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      cityIds: state => state.user.cityIds
    })
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      var queryData = []
      if (this.cityIds && this.cityIds.length > 0) {
        queryData = this.cityIds
      }
      getCitys(queryData).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.cityList.push({
            key: response.data[i].id,
            display_name: response.data[i].name
          })
        }
      })
    },
    getAgentCapitalTotalCount() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.listQueryFilter)
          this.listQueryFilter.startTime = this.listQueryFilter.tempTimes[0]
          this.listQueryFilter.endTime = this.listQueryFilter.tempTimes[1]
          getTotalCount(this.listQueryFilter).then(response => {
            this.agentCapitalTotalCount = response.data
            console.log(this.agentCapitalTotalCount)
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
