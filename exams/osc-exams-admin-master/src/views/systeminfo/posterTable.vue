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
      <el-table-column :label="$t('shareConfig.imageUrl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpImageUrl | imgFilter" width="50" height="50">
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

    <el-dialog :title="$t('shareConfig.updatePoster')" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempShareConfig" label-position="left" label-width="150px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="$t('shareConfig.id')">
          <span>{{ tempShareConfig.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('shareConfig.pageType')">
          <span>{{ tempShareConfig.pageType | pageTypeFilter }}</span>
        </el-form-item>
        <el-form-item :label="$t('shareConfig.imageUrlNormal')" prop="imageUrl">
          <el-upload
            v-model="tempShareConfig.imageUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessImageUrl"
            :before-upload="beforeUploadImageUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempShareConfig.imageUrl" :src="tempShareConfig.httpImageUrl" :class="imgClass">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div v-if="tempShareConfig.pageType===9" slot="tip" class="el-upload__tip">{{ $t('shareConfig.tipStrategyBackground') }}</div>
            <div v-if="tempShareConfig.pageType===8" slot="tip" class="el-upload__tip">{{ $t('shareConfig.tisProductBackground') }}</div>
            <div v-if="tempShareConfig.pageType>=10" slot="tip" class="el-upload__tip">{{ $t('shareConfig.tisStudentBackground') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('shareConfig.imageUrlYu')" prop="imageUrlYu">
          <el-upload
            v-model="tempShareConfig.imageUrlYu"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handlewwSuccessImageUrl"
            :before-upload="beforewwUploadImageUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempShareConfig.imageUrlYu" :src="tempShareConfig.httpImageUrlYu" :class="imgClass">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div v-if="tempShareConfig.pageType===9" slot="tip" class="el-upload__tip">{{ $t('shareConfig.tipStrategyBackground') }}</div>
            <div v-if="tempShareConfig.pageType===8" slot="tip" class="el-upload__tip">{{ $t('shareConfig.tisProductBackground') }}</div>
            <div v-if="tempShareConfig.pageType>=10" slot="tip" class="el-upload__tip">{{ $t('shareConfig.tisStudentBackground') }}</div>
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
  { key: 8, display_name: '产品海报背景图' },
  { key: 9, display_name: '攻略海报背景图' },
  { key: 10, display_name: '学员推广码背景图' },
  { key: 11, display_name: '砍价推广码背景图' }
]

const pageTypeKeyValue = pageTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'PosterTable',
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
      imgClass: 'avatar',
      imgClassArr: [],
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
        filter: {
          filters: [
            {
              field: 'pagetype',
              operater: '>=',
              value: 8
            },
            {
              field: 'pagetype',
              operater: '<',
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
        imageUrl: [{ required: true, message: '请上传海报图片', trigger: 'blur' }],
        imageUrlYu: [{ required: true, message: '请上传海报图片', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.imgClassArr[0] = 'avatar'
    this.imgClassArr[8] = 'productBackgroundImg'
    this.imgClassArr[9] = 'strategyBackgroundImg'
    this.imgClassArr[10] = 'studentBackgroundImg'
    this.imgClassArr[11] = 'studentBackgroundImg'
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
    handlewwSuccessImageUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempShareConfig.imageUrlYu = res.data.url
          this.tempShareConfig.httpImageUrlYu = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    beforewwUploadImageUrl(file) {
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
      if (this.tempShareConfig.pageType) {
        this.imgClass = this.imgClassArr[this.tempShareConfig.pageType]
      }
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
    display: block;
  }
  .strategyBackgroundImg {
    width: 150px;
    height: 240px;
    display: block;
  }
  .productBackgroundImg {
    width: 150px;
    height: 240px;
    display: block;
  }
  .studentBackgroundImg {
     width: 150px;
    height: 164px;
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
