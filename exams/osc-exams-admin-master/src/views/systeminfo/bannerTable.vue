<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('banner.add') }}</el-button>
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
      <el-table-column :label="$t('banner.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.title')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.fileUrl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpFileUrl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.wwfileUrl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpFileYuUrl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.httpUrlType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.httpUrlType | httpUrlTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.httpUrl')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.httpUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.positionType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.positionType | positionTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.show')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.show | showFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.sort')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('banner.actions')" align="center" class-name="small-padding fixed-width" width="380px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('banner.edit') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('banner.delete') }}
          </el-button>
          <el-button :disabled="scope.row.sort<=0" size="mini" @click="handleUp(scope.row)">{{ $t('banner.up') }}
          </el-button>
          <el-button :disabled="scope.row.sort>=tempMaxSort" size="mini" @click="handleDown(scope.row)">{{ $t('banner.down') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempBanner" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('banner.id')">
          <span>{{ tempBanner.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('banner.title')" prop="title">
          <el-input v-model="tempBanner.title" :placeholder="$t('banner.editTitle')" maxlength="200" />
        </el-form-item>
        <el-form-item :label="$t('banner.httpUrlType')" prop="httpUrlType">
          <el-select v-model="tempBanner.httpUrlType" filterable class="filter-item" :placeholder="$t('banner.editHttpUrlType')" style="width: 280px;">
            <el-option v-for="item in httpUrlTypeOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tempBanner.httpUrlType===1" :label="$t('banner.httpUrl')" prop="httpUrl">
          <el-input v-model="tempBanner.httpUrl" :placeholder="$t('banner.editHttpUrl')" />
        </el-form-item>
        <el-form-item v-if="tempBanner.httpUrlType===12" :label="$t('banner.wxUrl')" prop="wxappid">
          <el-input v-model="tempBanner.wxappid" :placeholder="$t('banner.editWxAppId')" />
        </el-form-item>
        <el-form-item :label="$t('banner.positionType')" prop="positionType">
          <el-select v-model="tempBanner.positionType" class="filter-item" :placeholder="$t('banner.positionType')" style="width: 280px;" @change="positionTypeChange">
            <el-option v-for="item in positionTypeOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('banner.show')" prop="show">
          <el-select v-model="tempBanner.show" class="filter-item" :placeholder="$t('banner.editShow')" style="width: 280px;">
            <el-option v-for="item in showOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('banner.fileUrl')" prop="fileUrl">
          <el-upload
            v-model="tempBanner.fileUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessIconUrl"
            :before-upload="beforeBannerUpload"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempBanner.fileUrl" :src="tempBanner.httpFileUrl" :class="imgClass">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div v-if="tempBanner.positionType===1" slot="tip" class="el-upload__tip">{{ $t('banner.tipHomeTop') }}</div>
            <div v-if="tempBanner.positionType===2" slot="tip" class="el-upload__tip">{{ $t('banner.tipHomeCenter') }}</div>
            <div v-if="tempBanner.positionType===3" slot="tip" class="el-upload__tip">{{ $t('banner.tipPersonal') }}</div>
            <div v-if="tempBanner.positionType===4" slot="tip" class="el-upload__tip">{{ $t('banner.tipHomeTop') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('banner.wwfileUrl')" prop="fileyuurl">
          <el-upload
            v-model="tempBanner.fileyuurl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handlewwSuccessIconUrl"
            :before-upload="beforewwBannerUpload"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempBanner.fileyuurl" :src="tempBanner.httpFileYuUrl" :class="imgClass">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div v-if="tempBanner.positionType===1" slot="tip" class="el-upload__tip">{{ $t('banner.tipHomeTop') }}</div>
            <div v-if="tempBanner.positionType===2" slot="tip" class="el-upload__tip">{{ $t('banner.tipHomeCenter') }}</div>
            <div v-if="tempBanner.positionType===3" slot="tip" class="el-upload__tip">{{ $t('banner.tipPersonal') }}</div>
            <div v-if="tempBanner.positionType===4" slot="tip" class="el-upload__tip">{{ $t('banner.tipHomeTop') }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('banner.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('banner.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('banner.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getBannerList, updateBanner, addBanner, deleteBannerById, uploadBannerSort } from '@/api/banner'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const positionTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '考场顶部' },
  { key: 2, display_name: '考场中间' },
  { key: 3, display_name: '个人中心' },
  { key: 4, display_name: '理论顶部' }
]
const showOptions = [
  { key: true, display_name: '显示' },
  { key: false, display_name: '不显示' }
]
const httpUrlTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '链接' },
  { key: 2, display_name: '考场实景' },
  { key: 3, display_name: '科二攻略' },
  { key: 4, display_name: '科三攻略' },
  { key: 5, display_name: '模拟攻略' },
  { key: 6, display_name: '考生经验' },
  { key: 7, display_name: '考场信息' },
  { key: 8, display_name: '使用教程' },
  { key: 9, display_name: '推广中心' },
  { key: 10, display_name: '意见反馈' },
  { key: 11, display_name: '合作招募' },
  { key: 12, display_name: '小程序' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const positionTypeKeyValue = positionTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const showKeyValue = showOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const httpUrlTypeKeyValue = httpUrlTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'BannerTable',
  directives: {
    waves
  },
  filters: {
    positionTypeFilter(type) {
      return positionTypeKeyValue[type]
    },
    showFilter(type) {
      return showKeyValue[type]
    },
    httpUrlTypeFilter(type) {
      return httpUrlTypeKeyValue[type]
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
      imgUrl: `${process.env.VUE_APP_BASE_API}file/banner/upload`,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      positionTypeOptions,
      httpUrlTypeOptions,
      showOptions,
      textMap: {
        update: '编辑广告',
        create: '新增广告'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tempBanner: {},
      tempMinSort: 0,
      tempMaxSort: 0,
      tempBannerSort: {
        id: null,
        sort: null
      },
      downloadLoading: false,
      rules: {
        httpUrlType: [{ required: true, message: '请选择显示位置', trigger: 'change' }],
        positionType: [{ required: true, message: '请选择显示位置', trigger: 'change' }],
        httpUrl: [{ required: true, message: '请输入跳转地址', trigger: 'blur' }],
        wxappid: [{ required: true, message: '请输入小程序appid', trigger: 'blur' }],
        fileUrl: [{ required: true, message: '请上传广告图片', trigger: 'blur' }],
        fileyuurl: [{ required: true, message: '请上传广告图片(维文)', trigger: 'blur' }],
        show: [{ required: true, message: '请选择是否显示', trigger: 'change' }],
        title: [{ required: true, message: '请输入跳转地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.imgClassArr[0] = 'avatar'
    this.imgClassArr[1] = 'homeTopImg'
    this.imgClassArr[2] = 'homeCenterImg'
    this.imgClassArr[3] = 'personalImg'
    this.imgClassArr[4] = 'homeTopImg'
    this.getList()
  },
  methods: {
    positionTypeChange(val) {
      this.imgClass = this.imgClassArr[val]
    },
    handleUp(row) {
      this.tempBannerSort = {}
      this.tempBannerSort.id = row.id
      this.tempBannerSort.sort = row.sort - 1
      uploadBannerSort(this.tempBannerSort).then(response => {
        if (response.code === 0) {
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
    handleDown(row) {
      this.tempBannerSort = {}
      this.tempBannerSort.id = row.id
      this.tempBannerSort.sort = row.sort + 1
      uploadBannerSort(this.tempBannerSort).then(response => {
        if (response.code === 0) {
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
    handleSuccessIconUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempBanner.fileUrl = res.data.url
          this.tempBanner.httpFileUrl = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    handlewwSuccessIconUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempBanner.fileyuurl = res.data.url
          this.tempBanner.httpFileYuUrl = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    beforewwBannerUpload(file) {
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
    beforeBannerUpload(file) {
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
    httpUrlTypeOptionsFilter() {
      return httpUrlTypeOptions.slice(1, httpUrlTypeOptions.length)
    },
    positionTypeOptionsFilter() {
      return positionTypeOptions.slice(1, positionTypeOptions.length)
    },
    showOptionsFilter() {
      return showOptions
    },
    getList() {
      this.listLoading = true
      getBannerList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.tempMaxSort = response.data.total - 1
        this.tempMinSort = 0
        // this.tempBanner = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleEdit(row) {
      this.tempBanner = {}
      this.tempBanner = Object.assign({}, row)
      this.$set(this.tempBanner, 'wxappid', row.httpUrl)
      if (this.tempBanner.httpUrlType === 0) {
        this.tempBanner.httpUrlType = null
      }
      if (this.tempBanner.positionType === 0) {
        this.tempBanner.positionType = null
      }
      if (this.tempBanner.positionType) {
        this.imgClass = this.imgClassArr[this.tempBanner.positionType]
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempBanner.httpUrlType === 12) {
            this.tempBanner.httpUrl = this.tempBanner.wxappid
          }
          updateBanner(this.tempBanner).then(response => {
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
      this.tempBanner = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempBanner.httpUrlType === 12) {
            this.tempBanner.httpUrl = this.tempBanner.wxappid
          }
          addBanner(this.tempBanner).then(response => {
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
      this.$confirm('确定要删除该广告吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBannerById(row.id).then(response => {
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
    width: 280px;
    height: 56px;
    line-height: 56px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 300px;
    display: block;
  }
  .homeTopImg {
    width: 320px;
    height: 106px;
    display: block;
  }
  .homeCenterImg {
    width: 320px;
    height: 64px;
    display: block;
  }
  .personalImg {
    width: 320px;
    height: 64px;
    display: block;
  }
</style>
