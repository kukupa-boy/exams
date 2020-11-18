<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" :placeholder="$t('withdrawal.searchByWechatNickName')" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" clearable style="width: 200px;" :placeholder="$t('withdrawal.status')" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('withdrawal.search') }}</el-button>
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
      <el-table-column :label="$t('withdrawal.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.wechatNickName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wechatNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.money')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.status')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.reason')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reason | reasonFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.capitalNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.capitalNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.paytime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.paytime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('withdrawal.actions')" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status==0" size="mini" style="width: 86px;" type="primary" icon="el-icon-circle-check" @click="handleAudit(scope.row,1)">{{ $t('withdrawal.successClick') }}
          </el-button>
          <el-button v-if="scope.row.status!=0" size="mini" style="width: 86px;" icon="el-icon-circle-check" disabled>{{ $t('withdrawal.successClick') }}
          </el-button>
          <el-button v-if="scope.row.status==0" size="mini" style="width: 86px;" type="danger" icon="el-icon-circle-close" @click="handleAudit(scope.row,2)">{{ $t('withdrawal.failureClick') }}
          </el-button>
          <el-button v-if="scope.row.status!=0" size="mini" style="width: 86px;" icon="el-icon-circle-close" disabled>{{ $t('withdrawal.failureClick') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="$t('withdrawal.failureReason')" :visible.sync="dialogReasonVisible">
      <el-form ref="dataForm" :model="withdrawalStatus" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('withdrawal.reason')">
          <el-input v-model="withdrawalStatus.reason" :placeholder="$t('withdrawal.editReason')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogReasonVisible = false">{{ $t('withdrawal.cancel') }}</el-button>
        <el-button type="primary" icon="el-icon-check" @click="auditFailure()">{{ $t('withdrawal.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getWithdrawalList, setWithdrawalStatus } from '@/api/withdrawal'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const statusOptions = [
  { key: '0', display_name: '转账中' },
  { key: '1', display_name: '转账完成' },
  { key: '2', display_name: '转账失败' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'WithdrawalListTable',
  directives: {
    waves
  },
  filters: {
    statusFilter(type) {
      return statusKeyValue[type]
    },
    reasonFilter(type) {
      if (type && type.length > 0) {
        return type
      }
      return '无'
    }
  },
  data() {
    return {
      dialogReasonVisible: false,
      withdrawalStatus: {
        id: undefined,
        reason: undefined,
        status: undefined
      },
      statusOptions,
      tempReason: undefined,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
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
      getWithdrawalList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 0
      this.listQuery.filter = {
        filters: []
      }
      if (this.listQuery.title) {
        this.listQuery.filter.filters.push({
          field: 'wechatnickname',
          operater: 'like',
          value: '%' + this.listQuery.title + '%'
        })
      }
      if (this.listQuery.status) {
        this.listQuery.filter.filters.push({
          field: 'status',
          operater: '=',
          value: this.listQuery.status
        })
      }
      this.getList()
    },
    handleAudit(row, status) {
      if (status === 1) {
        this.$confirm('确定要转账吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateStatus(row, status)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
      if (status === 2) {
        this.withdrawalStatus = {}
        this.withdrawalStatus.id = row.id
        this.withdrawalStatus.status = status
        this.dialogReasonVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    auditFailure() {
      this.dialogReasonVisible = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.updateStatus(null, 2)
    },
    updateStatus(row, status) {
      if (status === 1) {
        this.withdrawalStatus = {}
        this.withdrawalStatus.id = row.id
        this.withdrawalStatus.status = status
      }
      setWithdrawalStatus(this.withdrawalStatus).then(response => {
        if (response.code === 0) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: '操作失败! 错误码：' + response.code,
            type: 'error',
            duration: 2000
          })
        }
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
    handleGetWithdrawalcapital(row) {
      // 带参数跳转addproduct
      this.$router.push({
        name: 'withdrawalcapitallist',
        query: {
          withdrawalId: row.id
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
