<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.userid" :placeholder="$t('usercapital.userId')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.orderNum" :placeholder="$t('usercapital.orderNum')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.capitaltype" clearable style="width: 200px;" class="filter-item" :placeholder="$t('usercapital.capitalType')">
        <el-option v-for="item in capitalTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="listQueryFilter.dates"
        style="width: 404px;"
        value-format="timestamp"
        clearable
        class="filter-item"
        type="daterange"
        :start-placeholder="$t('usercapital.stimes')"
        :end-placeholder="$t('usercapital.etimes')"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('order.search') }}</el-button>
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
      <!-- <el-table-column :label="$t('usercapital.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('usercapital.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('usercapital.orderId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column> -->
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
      <el-table-column :label="$t('usercapital.actualMoney')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.capitalType === 2 || scope.row.capitalType === 5" style="color:green;">+{{ scope.row.actualMoney }}</span>
          <span v-if="scope.row.capitalType != 2 && scope.row.capitalType != 5" style="color:red;">-{{ scope.row.actualMoney }}</span>
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
  { key: '2', display_name: '推广佣金' },
  { key: '5', display_name: '视频创作佣金' },
  { key: '7', display_name: '区域代理佣金' },
  { key: '8', display_name: '间接推广佣金' }
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
  name: 'UsercapitalTable',
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
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      capitalTypeOptions,
      listQueryFilter: {
        dates: null,
        userid: null,
        orderid: null,
        capitaltype: null
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
      this.listLoading = true
      if (!this.listQueryFilter.capitaltype) {
        this.listQuery.filter = this.listQuery.filter || { filters: [] }
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '<>',
          value: 0
        })
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '<>',
          value: 1
        })
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '<>',
          value: 3
        })
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '<>',
          value: 4
        })
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '<>',
          value: 6
        })
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '<>',
          value: 9
        })
      }
      getUsercapitalList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.filter = {
        filters: []
      }
      if (this.listQueryFilter.userid) {
        this.listQuery.filter.filters.push({
          field: 'userid',
          operater: '=',
          value: this.listQueryFilter.userid
        })
      }
      if (this.listQueryFilter.orderNum) {
        this.listQuery.filter.filters.push({
          field: 'orderNum',
          operater: '=',
          value: this.listQueryFilter.orderNum
        })
      }
      if (this.listQueryFilter.capitaltype) {
        this.listQuery.filter.filters.push({
          field: 'capitaltype',
          operater: '=',
          value: this.listQueryFilter.capitaltype
        })
      }
      if (this.listQueryFilter.dates && this.listQueryFilter.dates.length > 0) {
        this.listQuery.filter.filters.push({
          field: 'createdon',
          operater: '>=',
          value: this.listQueryFilter.dates[0]
        },
        {
          field: 'createdon',
          operater: '<',
          value: this.listQueryFilter.dates[1]
        })
      }
      this.getList()
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

