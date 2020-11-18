<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.productname" :placeholder="$t('comment.productname')" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.producttype" clearable class="filter-item" :placeholder="$t('comment.producttype')">
        <el-option v-for="item in proStatus" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.status" clearable class="filter-item" :placeholder="$t('comment.status')">
        <el-option v-for="item in status" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('user.search') }}</el-button>
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
      <el-table-column
        align="center"
        type="expand"
      >
        <template slot-scope="scope">
          <el-form label-position="left">
            <el-form-item :label="$t('comment.comment')">
              <span>{{ scope.row.content }}</span>
            </el-form-item>
            <el-form-item :label="$t('comment.reply')">
              <span>{{ scope.row.replymsg }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('comment.id')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.coverurl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.coverurl" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.productname')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.producttype')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.producttype | proStatusFiler }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.status')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFiler }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.content')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.nickName')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.user">{{ scope.row.user.nickName || '游客' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.avatar')" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.user && scope.row.user.avatar" :src="scope.row.user.avatar" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('advice.status')" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 2 ? 'success' : 'primary'">{{ scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment.actions')" align="center" class-name="small-padding fixed-width" width="270px">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status === 1 ? false : true " size="mini" type="primary" icon="el-icon-edit" @click="handleShow(scope.row)">{{ $t('comment.show') }}</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('comment.delete') }}</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-comment" @click="handleReplyShow(scope.row)">回复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      title="回复"
      :visible.sync="dialogReplyVisible"
      width="30%"
    >
      <el-form ref="ruleForm" :rules="rules" :model="simpleData" label-position="left" label-width="80px" style="width:350px;margin:0 auto">
        <el-form-item label="用户ID">
          <span>{{ simpleData.id }}</span>
        </el-form-item>
        <el-form-item label="评价内容">
          <span>{{ simpleData.content }}</span>
        </el-form-item>
        <el-form-item label="用户评价" prop="replyTextarea">
          <el-input
            v-model="simpleData.replyTextarea"
            type="textarea"
            :rows="5"
            :maxlength="600"
            placeholder="请输入评价内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCommentForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { productCommentAudit, productCommentDelete, productCommentPage } from '@/api/productComment'
import { productCommentReply } from '@/api/product'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const status = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '待审核' },
  { key: 2, display_name: '审核通过' },
  { key: 3, display_name: '审核失败' }
]
const proStatus = [
  { key: 0, display_name: '考场视频' },
  { key: 1, display_name: '理论课程' }
]
export default {
  name: 'ProCommentTable',
  directives: {
    waves
  },
  filters: {
    statusFiler(v) {
      return status[v].display_name
    },
    proStatusFiler(v) {
      return proStatus[v].display_name
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
      status,
      proStatus,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listQueryFilter: {
        productname: null,
        producttype: null,
        status: null
      },
      downloadLoading: false,
      dialogFormVisible: false,
      simpleData: {
        replyTextarea: ''
      },
      dialogReplyVisible: false,
      rules: {
        replyTextarea: [{ required: true, message: '请选择考场', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    selectChange() {
      this.$forceUpdate()
    },
    getList() {
      this.listLoading = true
      productCommentPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleShow(row) {
      this.$confirm('确定要显示吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productCommentAudit(row.id).then(response => {
          if (response.code === 0) {
            this.$notify({
              title: '成功',
              message: '审核成功',
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
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productCommentDelete(row.id).then(response => {
          if (response.code === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
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
      if (this.listQueryFilter.productname) {
        this.listQuery.filter.filters.push({
          field: 'productname',
          operater: 'like',
          value: '%' + this.listQueryFilter.productname + '%'
        })
      }
      if (this.listQueryFilter.producttype) {
        this.listQuery.filter.filters.push({
          field: 'producttype',
          operater: '=',
          value: this.listQueryFilter.producttype
        })
      }
      if (this.listQueryFilter.status) {
        this.listQuery.filter.filters.push({
          field: 'status',
          operater: '=',
          value: this.listQueryFilter.status
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleReplyShow(value) {
      this.dialogReplyVisible = true
      this.simpleData = value
    },
    submitCommentForm() {
      const model = {
        id: this.simpleData.id,
        replymsg: this.simpleData.replyTextarea
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          productCommentReply(model).then((res) => {
            if (res) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              this.dialogReplyVisible = false
              return false
            }
          })
            .catch((err) => {
              this.dialogReplyVisible = false
              if (err) {
                this.$notify({
                  title: '成功',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
        } else {
          this.dialogReplyVisible = true
          return true
        }
      })
    }
  }
}
</script>
