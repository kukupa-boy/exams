<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('notify.searchById')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.openId" :placeholder="$t('notify.searchByOpenId')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('notify.search') }}</el-button>
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
      <el-table-column :label="$t('notify.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('notify.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('notify.openId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('notify.city')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('notify.notifyType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.notifyType | notifyTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('notify.createdOn')" align="center">
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
import { getNotifyList } from '@/api/notify'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const notifyTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '订阅' }
]

const notifyTypeKeyValue = notifyTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'NotifyTable',
  directives: {
    waves
  },
  filters: {
    notifyTypeFilter(type) {
      return notifyTypeKeyValue[type]
    },
    imgFilter(v) {
      if (v) {
        return v
      }
      return v
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
      listQueryFilter: {
        id: null,
        openId: null
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getNotifyList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
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
      if (this.listQueryFilter.id) {
        this.listQuery.filter.filters.push({
          field: 'id',
          operater: 'like',
          value: '%' + this.listQueryFilter.id + '%'
        })
      }
      if (this.listQueryFilter.openId) {
        this.listQuery.filter.filters.push({
          field: 'openid',
          operater: 'like',
          value: '%' + this.listQueryFilter.openId + '%'
        })
      }
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
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
