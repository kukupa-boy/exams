<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQueryFilter.capitalType" clearable filterable class="filter-item" style="width: 200px;" :placeholder="$t('usercapital.capitalType')">
        <el-option v-for="item in capitalTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.payStatus" clearable filterable class="filter-item" style="width: 200px;" :placeholder="$t('usercapital.payStatus')">
        <el-option v-for="item in payStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="listQueryFilter.dates"
        style="width: 404px;"
        value-format="timestamp"
        class="filter-item"
        clearable
        type="daterange"
        range-separator="-"
        :start-placeholder="$t('usercapital.startDate')"
        :end-placeholder="$t('usercapital.endDate')"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterS">{{ $t('usercapital.search') }}</el-button>
    </div>
    <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <div class="pagination-container" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column :label="$t('usercapital.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.orderId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.orderNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.description')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.money')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.actualMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.balance')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.payStatus')" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.payStatus | payStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.capitalType')" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.capitalType | capitalTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.capitalNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.capitalNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('usercapital.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getUsercapitalList } from '@/api/usercapital'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const payStatusOptions = [
  { key: '0', display_name: '未知' },
  { key: '1', display_name: '未支付' },
  { key: '2', display_name: '已支付' },
  { key: '3', display_name: '已取消' }
]
const capitalTypeOptions = [
  { key: '0', display_name: '未知' },
  { key: '1', display_name: '现金流水' },
  { key: '2', display_name: '推广佣金' },
  { key: '3', display_name: '提现成功' },
  { key: '4', display_name: '提现失败' },
  { key: '5', display_name: '视频创作佣金' },
  { key: '6', display_name: '朋友代付' },
  { key: '7', display_name: '区域代理佣金' },
  { key: '8', display_name: '间接推广佣金' },
  { key: '9', display_name: '超时佣金作废' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const payStatusKeyValue = payStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const capitalTypeKeyValue = capitalTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserCapitalList',
  directives: {
    waves
  },
  filters: {
    payStatusFilter(type) {
      return payStatusKeyValue[type]
    },
    capitalTypeFilter(type) {
      return capitalTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      capitalTypeOptions,
      payStatusOptions,
      total: null,
      listLoading: true,
      IUserId: undefined,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: '',
        filter: {
          filters: []
        }
      },
      listQueryFilter: {
        capitalType: null,
        payStatus: null,
        dates: null
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 取到路由带过来的参数
    getList() {
      this.IUserId = this.$route.query.userId
      if (this.IUserId) {
        this.listLoading = true
        this.listQuery.filter.filters.push({
          field: 'userid',
          operater: '=',
          value: this.IUserId
        })
        getUsercapitalList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      } else {
        this.listLoading = false
        this.$notify({
          title: '失败',
          message: '操作失败! 用户id不存在',
          type: 'error',
          duration: 2000
        })
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.listQuery.page = val
      this.getList()
    },
    handleFilterS() {
      this.listQuery.page = 1
      this.listQuery.filter.filters = []
      if (this.listQueryFilter.capitalType) {
        this.listQuery.filter.filters.push({
          field: 'capitalType',
          operater: '=',
          value: this.listQueryFilter.capitalType
        })
      }
      if (this.listQueryFilter.payStatus) {
        this.listQuery.filter.filters.push({
          field: 'payStatus',
          operater: '=',
          value: this.listQueryFilter.payStatus
        })
      }
      if (this.listQueryFilter.dates && this.listQueryFilter.dates.length > 0) {
        this.listQuery.filter.filters.push({
          field: 'createdOn',
          operater: '>=',
          value: this.listQueryFilter.dates[0]
        },
        {
          field: 'createdOn',
          operater: '<',
          value: this.listQueryFilter.dates[1]
        })
      }
      this.getList()
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
