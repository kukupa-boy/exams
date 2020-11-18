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
      <el-table-column :label="$t('userFavorites.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userFavorites.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userFavorites.productId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.name : scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.synopsis')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.synopsis : scope.row.synopsis }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.videoUrl')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.videoUrl : scope.row.videoUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.coverUrl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.product ? scope.row.product.coverUrl : scope.row.coverUrl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.totalPlay')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.totalPlay : scope.row.totalPlay }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.price')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.price : scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.promoteMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.promoteMoney : scope.row.promoteMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.cityName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.cityName : scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.examName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.examName : scope.row.examName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.videoType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product ? scope.row.product.videoType : scope.row.videoType | videoTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userFavorites.createdOn')" align="center">
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
import { getUserFavoritesList } from '@/api/userFavorites'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const videoTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '文件播放' },
  { key: 2, display_name: '点播播放' }
]

const videoTypeKeyValue = videoTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserFavoritesList',
  directives: {
    waves
  },
  filters: {
    videoTypeFilter(type) {
      return videoTypeKeyValue[type]
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
      IUserId: null,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listQueryFilter: {
        name: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getUrlParam() {
      // 接收跳转参数
      this.IUserId = this.$route.query.userId
      if (!this.IUserId) {
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
            field: 'userid',
            operater: '=',
            value: this.IUserId
          }
        ]
      }
    },
    getList() {
      this.getUrlParam()
      this.listLoading = true
      getUserFavoritesList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log(this.list)
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
