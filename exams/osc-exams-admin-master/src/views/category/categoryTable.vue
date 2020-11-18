<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('category.searchById')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.name" :placeholder="$t('category.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('category.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('category.add') }}</el-button>
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
      <el-table-column :label="$t('category.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.iconUrl')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpIconUrl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.city')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.exam')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.url')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.title')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.ctype')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ctype | ctypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.status')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.sort')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.actions')" align="center" class-name="small-padding fixed-width" width="520px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('category.edit') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('category.delete') }}
          </el-button>
          <el-button size="mini" style="width: 90px;" type="primary" :disabled="scope.row.ctype ===1 || scope.row.ctype ===2 || scope.row.ctype ===8 ? true : false" icon="el-icon-edit" @click="handleEditCategoryTag(scope.row)">{{ $t('category.editCategoryTwoTag') }}
          </el-button>
          <el-button :disabled="scope.row.sort<=0" size="mini" @click="handleUp(scope.row)">{{ $t('category.up') }}
          </el-button>
          <el-button :disabled="scope.row.sort>=tempMaxSort" size="mini" @click="handleDown(scope.row)">{{ $t('category.down') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempCategory" label-position="left" label-width="160px" style="width: 440px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('category.id')">
          <span>{{ tempCategory.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('category.city')" prop="cityId">
          <el-select v-model="tempCategory.cityId" clearable filterable class="filter-item" :placeholder="$t('category.editCity')" style="width: 280px;" @change="cityChange">
            <el-option v-for="item in cityList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('category.exam')" prop="examId">
          <el-select v-model="tempCategory.examId" clearable filterable class="filter-item" :placeholder="$t('category.editExam')" style="width: 280px;">
            <el-option v-for="item in examList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('category.ctype')" prop="ctype">
          <el-select v-model="tempCategory.ctype" filterable class="filter-item" :placeholder="$t('category.editCtype')" style="width: 280px;" @change="ctypeChange">
            <el-option v-for="item in ctypeOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="tempCategory.ctype===1" :label="$t('category.url')" prop="url">
          <el-input v-model="tempCategory.url" :placeholder="$t('category.editUrl')" maxlength="600" />
        </el-form-item>
        <el-form-item v-if="tempCategory.ctype===8" :label="$t('category.wxurl')" prop="wxappid">
          <el-input v-model="tempCategory.wxappid" :placeholder="$t('category.wxPlaceholder')" maxlength="600" />
        </el-form-item>
        <el-form-item :label="$t('category.name')" prop="name">
          <el-input v-model="tempCategory.name" :placeholder="$t('category.editName')" maxlength="60" />
        </el-form-item>
        <el-form-item :label="$t('category.yuname')" prop="yuname">
          <el-input v-model="tempCategory.yuname" :placeholder="$t('category.inputyuname')" maxlength="60" />
        </el-form-item>
        <el-form-item :label="$t('category.iconUrl')">
          <el-upload
            v-model="tempCategory.iconUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="successIconUrl"
            :before-upload="beforeUploadIconUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempCategory.httpIconUrl" :src="tempCategory.httpIconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，建议尺寸300x300</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('category.title')" prop="title">
          <el-input v-model="tempCategory.yutitle" :placeholder="$t('category.editTitle')" maxlength="600" />
        </el-form-item>
        <el-form-item :label="$t('category.yutitle')" prop="yutitle">
          <el-input v-model="tempCategory.title" :placeholder="$t('category.inputyutitle')" maxlength="600" />
        </el-form-item>
        <el-form-item :label="$t('category.status')" prop="status">
          <el-select v-model="tempCategory.status" class="filter-item" :placeholder="$t('category.editStatus')" style="width: 280px;">
            <el-option v-for="item in statusOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('category.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('category.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('category.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getCategoryList, updateCategory, addCategory, deleteCategoryById, uploadCategorySort } from '@/api/category'
import { getCitys } from '@/api/city'
import { getExamsByCityId } from '@/api/exam'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { mapState } from 'vuex'

const ctypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '链接' },
  { key: 2, display_name: '考场实景' },
  { key: 3, display_name: '科二攻略' },
  { key: 4, display_name: '科三攻略' },
  { key: 5, display_name: '模拟攻略' },
  { key: 6, display_name: '考生经验' },
  { key: 7, display_name: '考场信息' },
  { key: 8, display_name: '小程序' }
]
const statusOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '启用' },
  { key: 2, display_name: '停用' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const ctypeKeyValue = ctypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'CategoryTable',
  directives: {
    waves
  },
  filters: {
    ctypeFilter(type) {
      return ctypeKeyValue[type]
    },
    statusFilter(type) {
      return statusKeyValue[type]
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
      imgUrl: `${process.env.VUE_APP_BASE_API}file/category/upload`,
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
        id: null, // 栏目id
        name: null // 栏目名称
      },
      statusOptions,
      textMap: {
        update: '编辑考场栏目',
        create: '新增考场栏目'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tempCategory: {
        httpIconUrl: null
      },
      tempMinSort: 0,
      tempMaxSort: 0,
      tempCategorySort: {
        id: null,
        sort: null
      },
      cityList: [],
      examList: [],
      downloadLoading: false,
      rules: {
        examId: [{ required: true, message: '请选择考场', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
        ctype: [{ required: true, message: '请选择栏目类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入栏目名称（中文）', trigger: 'blur' }],
        yuname: [{ required: true, message: '请输入栏目名称（维文）', trigger: 'blur' }],
        iconUrl: [{ required: true, message: '请上传栏目图标', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题（中文）', trigger: 'blur' }],
        yutitle: [{ required: true, message: '请输入标题（维文）', trigger: 'blur' }],
        url: [{ required: true, message: '请输入跳转url', trigger: 'blur' }],
        wxappid: [{ required: true, message: '请输入小程序appid', trigger: 'blur' }],
        status: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      cityIds: state => state.user.cityIds,
      categoryIcons: state => state.user.categoryIcons
    })
  },
  created() {
    this.getListData()
  },
  methods: {
    ctypeChange(val) {
      if (!this.tempCategory.iconUrl) {
        this.tempCategory.httpIconUrl = this.categoryIcons[val - 2]
      }
    },
    handleEditCategoryTag(row) {
      // 带参数跳转userFavoritesList
      this.$router.push({
        name: 'CategoryTag',
        query: {
          categoryId: row.id
        }
      })
    },
    cityChange(cityId) {
      this.examList = []
      this.tempCategory.examId = null
      if (!cityId) {
        return Promise.resolve()
      }
      return getExamsByCityId(cityId).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.examList.push({
            key: response.data[i].id,
            display_name: response.data[i].name
          })
        }
      })
    },
    handleUp(row) {
      this.tempCategorySort = {}
      this.tempCategorySort.id = row.id
      this.tempCategorySort.sort = row.sort - 1
      uploadCategorySort(this.tempCategorySort).then(response => {
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
      this.tempCategorySort = {}
      this.tempCategorySort.id = row.id
      this.tempCategorySort.sort = row.sort + 1
      uploadCategorySort(this.tempCategorySort).then(response => {
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
    successIconUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempCategory.iconUrl = res.data.url
          this.tempCategory.httpIconUrl = res.data.httpUrl
          // this.$forceUpdate()
        }, 1000)
      }
    },
    beforeUploadIconUrl(file) {
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
    ctypeOptionsFilter() {
      return ctypeOptions.slice(1, ctypeOptions.length)
    },
    statusOptionsFilter() {
      return statusOptions.slice(1, statusOptions.length)
    },
    getListData() {
      var queryData = []
      if (this.cityIds && this.cityIds.length > 0) {
        queryData = this.cityIds
      }
      getCitys(queryData).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.cityList.push({
            key: response.data[i].id,
            display_name: response.data[i].name
          })
        }
        this.getList()
      })
    },
    agentCityFilter() {
      if (!this.cityIds || this.cityIds.length === 0) {
        return
      }
      if (!this.listQuery.liker || !this.listQuery.liker.filters) {
        this.listQuery.liker = {
          filters: []
        }
      }
      for (const cityId of this.cityIds) {
        this.listQuery.liker.filters.push({
          field: 'cityid',
          operater: '=',
          value: cityId
        })
      }
    },
    getList() {
      this.agentCityFilter()
      this.listLoading = true
      getCategoryList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.tempMaxSort = response.data.total - 1
        this.tempMinSort = 0
        // this.tempCategory = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
      if (this.listQueryFilter.name) {
        this.listQuery.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilter.name + '%'
        })
      }
      this.getList()
    },
    handleEdit(row) {
      this.tempCategory = {}
      this.tempCategory = Object.assign({}, row)
      this.$set(this.tempCategory, 'wxappid', row.url)
      // this.examList = [{
      //   key: this.tempCategory.examId,
      //   display_name: this.tempCategory.examName === null ? '' : this.tempCategory.examName
      // }]
      if (this.tempCategory.ctype === 0) {
        this.tempCategory.ctype = null
      }
      if (this.tempCategory.status === 0) {
        this.tempCategory.status = null
      }
      if (!this.tempCategory.cityId) {
        this.tempCategory.cityId = null
      }
      this.cityChange(this.tempCategory.cityId).then(() => {
        this.tempCategory.examId = row.examId
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempCategory.ctype === 8) {
            this.tempCategory.url = this.tempCategory.wxappid
          }
          updateCategory(this.tempCategory).then(response => {
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
      this.tempCategory = {}
      this.$set(this.tempCategory, 'examId', null)
      this.$set(this.tempCategory, 'iconUrl', null)
      this.$set(this.tempCategory, 'httpIconUrl', null)
      this.examList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      console.log(this.tempCategory)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.tempCategory.ctype === 8) {
            this.tempCategory.url = this.tempCategory.wxappid
          }
          addCategory(this.tempCategory).then(response => {
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
      this.$confirm('确定要删除该按钮吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategoryById(row.id).then(response => {
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
</style>
