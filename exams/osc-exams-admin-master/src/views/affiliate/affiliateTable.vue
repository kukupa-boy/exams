<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('affiliate.searchById')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.tel" :placeholder="$t('affiliate.tel')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.cityName" :placeholder="$t('affiliate.cityName')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('affiliate.search') }}</el-button>
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
      <el-table-column :label="$t('affiliate.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('affiliate.trueName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('affiliate.tel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('affiliate.cityName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('affiliate.examName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('affiliate.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('affiliate.actions')" align="center" class-name="small-padding fixed-width" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" style="width: 74px;" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('affiliate.delete') }}</el-button>
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
import { getAffiliateList, getAffiliateDelete } from '@/api/affiliate'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'AffiliateTable',
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
        cityName: null,
        tel: null,
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
      getAffiliateList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getAffiliateDelete(row.id).then(res => {
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
      if (this.listQueryFilter.tel) {
        this.listQuery.filter.filters.push({
          field: 'tel',
          operater: 'like',
          value: '%' + this.listQueryFilter.tel + '%'
        })
      }
      if (this.listQueryFilter.cityName) {
        this.listQuery.filter.filters.push({
          field: 'cityName',
          operater: 'like',
          value: '%' + this.listQueryFilter.cityName + '%'
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
        const tHeader = ['ID号', '真实姓名', '联系电话', '所在城市', '考场名称', '创建时间']
        const filterVal = ['id', 'trueName', 'tel', 'cityName', 'examName', 'createdOn']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '合作招募'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createdOn') {
          return parseTime(v[j])
        } else {
          return v[j] + ''
        }
      }))
    }
  }
}
</script>
