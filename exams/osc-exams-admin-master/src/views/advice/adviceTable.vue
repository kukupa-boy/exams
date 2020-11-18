<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('advice.searchById')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.userId" :placeholder="$t('advice.searchByUserId')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.userTel" :placeholder="$t('advice.userTel')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('advice.search') }}</el-button>
    </div>
    <div style="display:flex">
      <el-button type="primary" size="small" @click="handleDownload">{{ $t('advice.exportXLSL') }}</el-button>
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        style="padding-left:20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left">
            <el-form-item :label="$t('advice.attachments')">
              <img v-for="attachment in scope.row.attachments" :key="attachment.id" :src="attachment.httpFileUrl | imgFilter">
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.userTel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userTel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.content')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.status')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'primary'">{{ scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.actions')" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" style="width: 74px;" type="primary" :disabled="scope.row.status === 1" icon="el-icon-edit" @click="handleCheck(scope.row)">{{ $t('advice.check') }}</el-button>
          <el-button size="mini" style="width: 74px;" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('advice.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <div style="display:flex">
        <el-button type="primary" size="small" @click="handleDownload">{{ $t('advice.exportXLSL') }}</el-button>
        <el-pagination
          :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQuery.limit"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          style="padding-left:20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getAdviceList, getAdviceDelete, getAdviceHandle } from '@/api/advice'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
export default {
  name: 'AdviceTable',
  directives: {
    waves
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
        userId: null,
        userTel: null
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
      getAdviceList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleCheck(row) {
      this.$confirm('确定已处理此反馈信息了吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getAdviceHandle(row.id).then(res => {
          if (res.code === 0) {
            this.getList()
          }
        }).catch((err) => {
          this.$notify({
            title: '错误',
            type: 'error',
            message: `${err.res.data.message}`,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          title: '取消',
          message: '已取消操作',
          type: 'info',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除这条记录吗？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getAdviceDelete(row.id).then(res => {
          if (res.code === 0) {
            this.getList()
          }
        }).catch((err) => {
          this.$notify({
            title: '错误',
            type: 'error',
            message: `${err.res.data.message}`,
            duration: 2000
          })
        })
      }).catch(() => {
        this.$notify({
          title: '取消',
          message: '已取消操作',
          type: 'info',
          duration: 2000
        })
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
      if (this.listQueryFilter.userId) {
        this.listQuery.filter.filters.push({
          field: 'userid',
          operater: 'like',
          value: '%' + this.listQueryFilter.userId + '%'
        })
      }
      if (this.listQueryFilter.userTel) {
        this.listQuery.filter.filters.push({
          field: 'userTel',
          operater: 'like',
          value: '%' + this.listQueryFilter.userTel + '%'
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
        const tHeader = ['ID号', '用户ID', '联系方式', '意见内容', '状态', '创建时间']
        const filterVal = ['id', 'userId', 'userTel', 'content', 'status', 'createdOn']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '意见反馈'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'status') {
          return v[j] === 1 ? '已处理' : '待处理'
        } else if (j === 'createdOn') {
          return parseTime(v[j])
        } else {
          return v[j] + ''
        }
      }))
    }
  }
}
</script>
