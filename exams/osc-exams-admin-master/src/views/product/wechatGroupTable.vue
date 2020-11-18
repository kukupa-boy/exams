<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.name" :placeholder="$t('wechatGroup.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('wechatGroup.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('wechatGroup.add') }}</el-button>
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
      <el-table-column :label="$t('wechatGroup.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wechatGroup.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wechatGroup.subtitle')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subtitle }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wechatGroup.qrcodeurl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpqrcodeurl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('wechatGroup.scantip')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scantip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wechatGroup.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wechatGroup.actions')" align="center" class-name="small-padding fixed-width" width="380px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('wechatGroup.edit') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('wechatGroup.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempWechatGroup" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('wechatGroup.id')">
          <span>{{ tempWechatGroup.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('wechatGroup.name')" prop="name">
          <el-input v-model="tempWechatGroup.name" maxlength="120" :placeholder="$t('wechatGroup.editName')" />
        </el-form-item>
        <el-form-item :label="$t('wechatGroup.subtitle')" prop="subtitle">
          <el-input v-model="tempWechatGroup.subtitle" maxlength="120" :placeholder="$t('wechatGroup.editSubtitle')" />
        </el-form-item>
        <el-form-item :label="$t('wechatGroup.qrcodeurl')" prop="qrcodeurl">
          <el-upload
            v-model="tempWechatGroup.qrcodeurl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessIconUrl"
            :before-upload="beforeWechatGroupUpload"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempWechatGroup.qrcodeurl" :src="tempWechatGroup.httpqrcodeurl" class="avatar2">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('wechatGroup.tipQrcodeurl') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('wechatGroup.scantip')" prop="scantip">
          <el-input v-model="tempWechatGroup.scantip" maxlength="60" :placeholder="$t('wechatGroup.editScantip')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('wechatGroup.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('wechatGroup.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('wechatGroup.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { wechatgroupPage, wechatgroupInsert, wechatgroupDelete, wechatgroupUpdate } from '@/api/wechatGroup'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'WechatGroupTable',
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
      imgClass: 'avatar',
      imgClassArr: [],
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/wechatgroup/upload`,
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
        name: null
      },
      textMap: {
        update: '编辑微信群',
        create: '新增微信群'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tempWechatGroup: {},
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入群标题', trigger: 'blur' }],
        subtitle: [{ required: true, message: '请输入群副标题', trigger: 'blur' }],
        qrcodeurl: [{ required: true, message: '请上传群二维码图', trigger: 'blur' }],
        scantip: [{ required: true, message: '请输入扫码提示文字', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSuccessIconUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempWechatGroup.qrcodeurl = res.data.url
          this.tempWechatGroup.httpqrcodeurl = res.data.httpUrl
          this.$refs['dataForm'].validateField('qrcodeurl')
        }, 1000)
      }
    },
    beforeWechatGroupUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    uploadUrl() {
      return this.imgUrl
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.filter = {
        filters: []
      }
      if (this.listQueryFilter.name) {
        this.listQuery.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilter.name + '%'
        })
      }
      this.getList()
    },
    getList() {
      this.listLoading = true
      wechatgroupPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleEdit(row) {
      this.tempWechatGroup = {}
      this.tempWechatGroup = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          wechatgroupUpdate(this.tempWechatGroup).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
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
        }
      })
    },
    handleAdd() {
      this.tempWechatGroup = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$set(this.tempWechatGroup, 'qrcodeurl', null)
      this.$set(this.tempWechatGroup, 'httpqrcodeurl', null)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          wechatgroupInsert(this.tempWechatGroup).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
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
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该微信群吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        wechatgroupDelete(row.id).then(response => {
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
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 90px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 300px;
    display: block;
  }
  .avatar-uploader-icon2 {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height:150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar2 {
    width: 150px;
    height:150px;
    display: block;
  }
</style>
