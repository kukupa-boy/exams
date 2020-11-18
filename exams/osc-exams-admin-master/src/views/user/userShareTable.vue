<template>
  <div class="app-container">
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
      <el-table-column :label="$t('user.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.account')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.nickName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.tel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.avatar')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.banlace')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.banlace">{{ scope.row.banlace.balance }}</span>
          <span v-if="!(scope.row.banlace)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.parentUserId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.parentUserEndTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentUserEndTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.promoter')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.promoter | promoterFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.createdOn')" align="center">
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
import { getUserList } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const promoterOptions = [
  { key: false, display_name: '否' },
  { key: true, display_name: '是' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const promoterKeyValue = promoterOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserShareList',
  directives: {
    waves
  },
  filters: {
    promoterFilter(type) {
      return promoterKeyValue[type]
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
      IParentUserId: null,
      downloadLoading: false,
      dialogFormVisible: false,
      rules: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    promoterOptionsFilter() {
      return promoterOptions
    },
    getUrlParam() {
      // 接收跳转参数
      this.IParentUserId = this.$route.query.parentUserId
      if (!this.IParentUserId) {
        this.listLoading = false
        this.$notify({
          title: '失败',
          message: '操作失败! 用户id不存在',
          type: 'error',
          duration: 2000
        })
      }
      this.listQuery.filter = {
        filters: [
          {
            field: 'parentuserid',
            operater: '=',
            value: this.IParentUserId
          }
        ]
      }
    },
    getList() {
      this.getUrlParam()
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
