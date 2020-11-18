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
      <el-table-column :label="$t('shareConfig.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.title')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.imageUrl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpImageUrl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.titleYu')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.titleYu }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.imageUrlYu')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpImageUrlYu | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.pageType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pageType | pageTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('shareConfig.actions')" align="center" class-name="small-padding fixed-width" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('shareConfig.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="$t('shareConfig.updateShare')" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempShareConfig" label-position="left" label-width="160px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="$t('shareConfig.id')">
          <span>{{ tempShareConfig.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('shareConfig.pageType')">
          <span>{{ tempShareConfig.pageType | pageTypeFilter }}</span>
        </el-form-item>
        <el-form-item :label="$t('shareConfig.title')" prop="title">
          <el-input v-model="tempShareConfig.title" :placeholder="$t('shareConfig.editTitle')" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('shareConfig.titleYu')" prop="title">
          <el-input v-model="tempShareConfig.titleYu" :placeholder="$t('shareConfig.editTitleYu')" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('shareConfig.imageUrl')" prop="imageUrl">
          <el-upload
            v-model="tempShareConfig.imageUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessImageUrl"
            :before-upload="beforeUploadImageUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempShareConfig.imageUrl" :src="tempShareConfig.httpImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('shareConfig.tipShareImage') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('shareConfig.imageUrlYu')" prop="imageUrl">
          <el-upload
            v-model="tempShareConfig.imageUrlYu"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessImageUrlYu"
            :before-upload="beforeUploadImageUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempShareConfig.imageUrlYu" :src="tempShareConfig.httpImageUrlYu" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('shareConfig.tipShareImage') }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('shareConfig.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateData">{{ $t('shareConfig.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getShareConfigList, updateShareConfig } from '@/api/shareConfig'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'

const pageTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '首页' },
  { key: 2, display_name: '个人中心' },
  { key: 3, display_name: '推广中心' },
  { key: 4, display_name: '使用教程' },
  { key: 5, display_name: '产品详情' },
  { key: 6, display_name: '合作招募' },
  { key: 7, display_name: '考场攻略' },
  { key: 12, display_name: '发展教练' }
]

const pageTypeKeyValue = pageTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ShareConfigTable',
  directives: {
    waves
  },
  filters: {
    pageTypeFilter(type) {
      return pageTypeKeyValue[type]
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
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/shareconfig/upload`,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: '',
        liker: {
          filters: [
            {
              field: 'pagetype',
              operater: '<=',
              value: 7
            },
            {
              field: 'pagetype',
              operater: '=',
              value: 12
            }
          ]
        }
      },
      listQueryFilter: {
        name: null
      },
      tempShareConfig: {},
      pageTypeOptions,
      dialogFormVisible: false,
      downloadLoading: false,
      rules: {
        title: [{ required: true, message: '请上传分享图片', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请上传分享图片', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSuccessImageUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempShareConfig.imageUrl = res.data.url
          this.tempShareConfig.httpImageUrl = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    handleSuccessImageUrlYu(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempShareConfig.imageUrlYu = res.data.url
          this.tempShareConfig.httpImageUrlYu = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    beforeUploadImageUrl(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    uploadUrl() {
      return this.imgUrl
    },
    pageTypeOptionsFilter() {
      return pageTypeOptions.slice(1, pageTypeOptions.length)
    },
    handleEdit(row) {
      this.tempShareConfig = {}
      this.tempShareConfig = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateShareConfig(this.tempShareConfig).then(response => {
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
    getList() {
      this.listLoading = true
      getShareConfigList(this.listQuery).then(response => {
        console.log('3333333333')
        console.log(response.data.items)
        this.list = response.data.items
        this.total = response.data.total
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
    width: 100px;
    height: 100px;
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
