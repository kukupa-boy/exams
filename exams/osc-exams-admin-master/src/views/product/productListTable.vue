<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('product.searchById')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.name" :placeholder="$t('product.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.cityId" clearable filterable class="filter-item" :placeholder="$t('product.editCity')" @change="cityChange">
        <el-option v-for="item in cityList" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.examId" clearable filterable class="filter-item" :placeholder="$t('product.editExam')">
        <el-option v-for="item in examList" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.langtype" clearable filterable class="filter-item" :placeholder="$t('product.editLangtype')" @change="cityChange">
        <el-option v-for="item in langtype" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('product.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('product.add') }}</el-button>
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
      <el-table-column :label="$t('product.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.langtype')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.langtype | languageType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.userNickName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.synopsis')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.synopsis }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('product.videoUrl')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.videoUrl }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('product.coverUrl')" align="center" width="110">
        <template slot-scope="scope">
          <img :src="scope.row.httpCoverUrl | imgFilter" width="90" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.totalPlay')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPlay }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.price')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.promoteMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.promoteMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.subPromoteMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subPromoteMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.cityName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.examName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.videoType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.videoType | videoTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.sales')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sales === null ? 0 : scope.row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.totalPlayNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPlay }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.actions')" align="center" class-name="small-padding fixed-width" width="340px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('product.edit') }}
          </el-button>
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-edit" @click="handleEditUserId(scope.row)">{{ $t('product.editProductUserId') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('product.delete') }}
          </el-button>
          <div class="buttonTop">
            <el-button size="mini" :disabled="moveButtonTypeTop(scope.$index)" icon="el-icon-caret-top" @click="moveButtonToTop(scope.$index,scope.row)">上移
            </el-button>
            <el-button size="mini" :disabled="moveButtonTypeBottom(scope.$index)" icon="el-icon-caret-bottom" @click="moveButtonToBottom(scope.$index,scope.row)">下移
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="80px" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="tempProduct" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('product.id')">
          <span>{{ tempProduct.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('product.langtype')" prop="langtype">
          <el-select v-model="tempProduct.langtype" clearable filterable class="filter-item" :placeholder="'请输入语言类型'" style="width: 280px;">
            <el-option v-for="item in langtype" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('product.cityName')" prop="cityId">
          <el-select v-model="tempProduct.cityId" clearable filterable class="filter-item" :placeholder="$t('product.editCity')" style="width: 280px;" @change="cityChange">
            <el-option v-for="item in cityList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('product.examName')" prop="examId">
          <el-select v-model="tempProduct.examId" clearable filterable class="filter-item" :placeholder="$t('product.editExam')" style="width: 280px;">
            <el-option v-for="item in examList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('product.name')" prop="name">
          <el-input v-model="tempProduct.name" maxlength="60" :placeholder="$t('product.editName')" />
        </el-form-item>
        <el-form-item :label="$t('product.synopsis')" prop="synopsis">
          <el-input v-model="tempProduct.synopsis" maxlength="60" :placeholder="$t('product.editSynopsis')" />
        </el-form-item>
        <el-form-item :label="$t('product.expireday')">
          <el-input v-model="tempProduct.expireday" maxlength="12" :placeholder="$t('product.editExpireday')">
            <template slot="append">{{ $t('product.day') }}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('product.videoUrl')">
          <input id="fileUpload" type="file" @change="fileChange($event)">
        </el-form-item>
        <el-form-item :label="$t('product.price')" prop="price">
          <el-input v-model="tempProduct.price" :placeholder="$t('product.editPrice')" />
        </el-form-item>
        <el-form-item :label="$t('product.transcodetemplategroupid')">
          <el-select v-model="tempProduct.transcodetemplategroupid" clearable filterable class="filter-item" :placeholder="$t('product.editTranscodetemplategroupid')" style="width: 280px;">
            <el-option v-for="item in templateMode" :key="item.key" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('product.coverUrlUploadType')">
          <el-radio v-model="coverUrlUploadType" label="0">{{ $t('product.manual') }}</el-radio>
          <el-radio v-model="coverUrlUploadType" label="1">{{ $t('product.automatic') }}</el-radio>
        </el-form-item>
        <el-form-item v-if="coverUrlUploadType==='0'" :label="$t('product.coverUrl')">
          <el-upload
            v-model="tempProduct.coverUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessCoverUrl"
            :before-upload="beforeUploadCoverUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempProduct.httpCoverUrl" :src="tempProduct.httpCoverUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('product.uploadText') }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('product.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('product.confirm') }}</el-button>
        <el-button v-else type="primary" icon="el-icon-check" @click="createData">{{ $t('product.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('product.editProductUser')" :visible.sync="productUserDialogFormVisible" top="80px" width="60%">
      <el-form ref="productUserDataForm" :rules="rules" :model="productUser" label-position="left" label-width="120px" style="width: 80%; margin-left:100px;">
        <el-form-item :label="$t('product.id')">
          <span>{{ productUser.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('product.name')">
          <span>{{ productUser.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('product.coverUrl')">
          <img :src="productUser.httpCoverUrl | imgFilter" width="100" height="60">
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-input v-model="userQuery.NickName" :placeholder="$t('user.searchBywechatNickName')" style="width: 200px;" class="filter-item" />
        <el-input v-model="userQuery.tel" :placeholder="$t('user.searchByTel')" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleUserFilter">{{ $t('user.search') }}</el-button>
      </div>
      <el-pagination :current-page="userListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="userListQuery.limit" :total="userTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" />
      <div class="pagination-container" />
      <el-table
        ref="productTable"
        :key="userTableKey"
        v-loading="userListLoading"
        :data="userList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @select="selectUser"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column :label="$t('user.id')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.account')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.nickName')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.tel')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.avatar')" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatar | imgFilter" width="50" height="50">
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page="userListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="userListQuery.limit" :total="userTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="userHandleCurrentChange" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="productUserDialogFormVisible = false">{{ $t('product.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateProductUserData">{{ $t('product.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProductList, updateProduct, addProduct, deleteProductById, uploadProductSort, findActivityProductList, uploadProductUser, productUpdateSort } from '@/api/product'
import { getCitys } from '@/api/city'
import { getExamsByCityId } from '@/api/exam'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { mapState } from 'vuex'
import { userProductPage } from '@/api/user'
import { transcodeTemplates } from '@/api/video'
const videoTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '文件播放' },
  { key: 2, display_name: '点播播放' }
]
const langtype = [
  { key: 0, display_name: '中文' },
  { key: 1, display_name: '维语' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const videoTypeKeyValue = videoTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

var validMoney = (rule, value, callback) => {
  const valid_money = /^0\.([1-9]|\d[1-9])$|^[0]$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
  if (!valid_money.test(value)) {
    return callback(new Error('请输入正确的金额'))
  }
  return callback()
}

export default {
  name: 'ProductListTable',
  directives: {
    waves
  },
  filters: {
    videoTypeFilter(type) {
      return videoTypeKeyValue[type]
    },
    languageType(value) {
      if (value === 0) {
        return '中文'
      } else {
        return '维语'
      }
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
      userTableKey: 1,
      userListLoading: false,
      productUserDialogFormVisible: false,
      userList: null,
      productUser: {
        productId: null,
        userId: null
      },
      userListQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      userQuery: {},
      userTotal: null,
      coverUrlUploadType: '0',
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/product/upload`,
      tempNewListMerge: {},
      vModelNull: null,
      editTableIndexs: {},
      tableKey: 0,
      tableKeyProductItems: 1,
      tableKeyProductItemsEdit: 2,
      list: null,
      total: null,
      newList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: '',
        filter: {
          filters: [
            {
              field: 'producttype',
              operater: '=',
              value: 0
            }
          ]
        }
      },
      uploadInfo: {
        file: null,
        productId: 0,
        title: ''
      },
      textMap: {
        update: '编辑商品',
        create: '新增商品'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tempProduct: {},
      tempMinSort: 0,
      tempMaxSort: 0,
      tempProductSort: {
        id: null,
        sort: null
      },
      listQueryFilter: {
        id: null,
        name: null
      },
      templateMode: [],
      examList: [],
      cityList: [],
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        synopsis: [{ required: true, message: '请输入视频简介', trigger: 'blur' }],
        videoUrl: [{ required: true, message: '请上传视频url', trigger: 'blur' }],
        price: [{ required: true, validator: validMoney, trigger: 'blur' }],
        promoteMoney: [{ validator: validMoney, trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择考场所在城市', trigger: 'change' }],
        langtype: [{ required: true, message: '请选择语言类型', trigger: 'change' }],
        examId: [{ required: true, message: '请选择考场', trigger: 'change' }],
        videoType: [{ required: true, message: '请选择视频播放类型', trigger: 'change' }]
      },
      moveButtonType: 'primary',
      langtype: langtype
    }
  },
  computed: {
    ...mapState({
      cityIds: state => state.user.cityIds
    }),
    moveButtonTypeTop() {
      return (value) => {
        if (value === 0 && this.listQuery.page === 1) {
          return true
        }
        return false
      }
    },
    moveButtonTypeBottom() {
      return (value) => {
        if (value === this.total % this.listQuery.pageSize - 1 && this.listQuery.page === Math.ceil(this.total / this.listQuery.pageSize)) {
          return true
        }
        return false
      }
    }
  },
  created() {
    this.getListData()
    this.getTemplate()
  },
  methods: {
    getTemplate() {
      transcodeTemplates().then(res => {
        if (res.code === 0) {
          const result = res.data
          result.forEach(item => {
            this.templateMode.push({
              key: item.transcodeTemplateGroupId,
              display_name: item.name,
              value: item.transcodeTemplateGroupId
            })
          })
        }
      })
    },
    selectUser(selection, row) {
      this.$refs.productTable.clearSelection()
      this.$refs.productTable.toggleRowSelection(row)
      this.productUser.userId = row.id
    },
    updateProductUserData() {
      this.$refs['productUserDataForm'].validate((valid) => {
        if (valid) {
          if (!this.productUser.userId) {
            this.$notify({
              title: '失败',
              message: '请先选择一位用户!',
              type: 'error',
              duration: 2000
            })
            return
          }
          const updateDate = {
            productId: this.productUser.id,
            userId: this.productUser.userId
          }
          uploadProductUser(updateDate).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.productUserDialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleEditUserId(row) {
      this.productUser = Object.assign({}, row)
      if (!this.productUser.userId || this.productUser.userId === 0) {
        this.productUser.userId = null
      }
      this.userList = null
      this.userTotal = null
      this.productUserDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['productUserDataForm'].clearValidate()
      })
    },
    userHandleSizeChange(val) {
      this.userListQuery.pageSize = val
      this.getUsers()
    },
    userHandleCurrentChange(val) {
      this.userListQuery.page = val
      this.getUsers()
    },
    handleUserFilter() {
      this.userListQuery.page = 1
      this.userListQuery.filter = {
        filters: []
      }
      if (this.userQuery.NickName) {
        this.userListQuery.filter.filters.push({
          field: 'nickname',
          operater: 'like',
          value: '%' + this.userQuery.NickName + '%'
        })
      }
      if (this.userQuery.tel) {
        this.userListQuery.filter.filters.push({
          field: 'tel',
          operater: '=',
          value: this.userQuery.tel
        })
      }
      if (this.userListQuery.filter.filters.length <= 0) {
        return
      }
      this.getUsers()
    },
    getUsers() {
      this.userListLoading = true
      userProductPage(this.userListQuery).then(response => {
        this.userList = response.data.items
        this.userTotal = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.userListLoading = false
        }, 1.5 * 1000)
      })
    },
    handleSuccessCoverUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempProduct.coverUrl = res.data.url
          this.tempProduct.httpCoverUrl = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    beforeUploadCoverUrl(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图标只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图标大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    uploadUrl() {
      return this.imgUrl
    },
    fileChange(e) {
      this.uploadInfo.file = null
      const file = e.target.files[0]
      const isVideo = file.type === 'video/mp4'
      if (isVideo) {
        this.uploadInfo.file = file
      } else {
        this.uploadInfo.file = null
      }
      // this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', e)
    },
    handleFindActivityProduct() {
      findActivityProductList()
    },
    videoTypeOptionsFilter() {
      return videoTypeOptions.slice(1, videoTypeOptions.length)
    },
    cityChange(cityId) {
      this.examList = []
      this.tempProduct.examId = null
      if (!cityId) {
        return
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
    handleUp(row) {
      this.tempProductSort = {}
      this.tempProductSort.id = row.id
      this.tempProductSort.sort = row.sort - 1
      uploadProductSort(this.tempProductSort).then(response => {
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
      this.tempProductSort = {}
      this.tempProductSort.id = row.id
      this.tempProductSort.sort = row.sort + 1
      uploadProductSort(this.tempProductSort).then(response => {
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
    changePricingType(row) {
      validMoney(null, row.price, function(error) {
        if (error) {
          row.price = null
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.filter = {
        filters: [
          {
            field: 'producttype',
            operater: '=',
            value: 0
          }
        ]
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
      if (this.listQueryFilter.cityId) {
        this.listQuery.filter.filters.push({
          field: 'cityid',
          operater: '=',
          value: this.listQueryFilter.cityId
        })
      }
      if (this.listQueryFilter.examId) {
        this.listQuery.filter.filters.push({
          field: 'examid',
          operater: '=',
          value: this.listQueryFilter.examId
        })
      }
      if (this.listQueryFilter.langtype) {
        this.listQuery.filter.filters.push({
          field: 'langtype',
          operater: '=',
          value: this.listQueryFilter.langtype
        })
      }
      this.getList()
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
      getProductList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleEdit(row) {
      this.coverUrlUploadType = '0'
      this.tempProduct = {}
      this.tempProduct = Object.assign({}, row)
      // this.examList = [{
      //   key: this.tempProduct.examId,
      //   display_name: this.tempProduct.examName === null ? '' : this.tempProduct.examName
      // }]
      this.uploadInfo.file = null
      this.cityChange(this.tempProduct.cityId).then(() => {
        this.tempProduct.examId = row.examId
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      // 暂时添加videoId
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateProduct(this.tempProduct).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              if (this.uploadInfo.file) {
                this.uploadInfo.productId = this.tempProduct.id
                this.uploadInfo.title = this.tempProduct.name
                this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', this.uploadInfo)
              }
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
      this.coverUrlUploadType = '0'
      this.tempProduct = {}
      this.$set(this.tempProduct, 'examId', null)
      this.examList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (!this.uploadInfo.file) {
          this.$message({
            type: 'info',
            message: '请上传mp4格式的视频文件'
          })
        }
        if (this.tempProduct.expireday) {
          var reg = /^(0|[1-9][0-9]*)$/
          if (!reg.test(this.tempProduct.expireday)) {
            this.$message({
              type: 'info',
              message: '请输入正确的购买期限'
            })
          }
        }
        if (valid && this.uploadInfo.file) {
          addProduct(this.tempProduct).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.uploadInfo.productId = response.data
              this.uploadInfo.title = this.tempProduct.name
              this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', this.uploadInfo)
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
      this.$confirm('确定要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProductById(row.id).then(response => {
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
    },
    moveButtonToTop(index, value) { // id是产品id ，sort根据原有的dortzhi进行加减，减一上移，加一下移
      const model = {
        id: value.id,
        sortid: value.sort - 1
      }
      productUpdateSort(model)
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '上移成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    moveButtonToBottom(index, value) {
      const model = {
        id: value.id,
        sortid: value.sort + 1
      }
      console.log()
      productUpdateSort(model)
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '下移成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
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
    height: 160px;
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
  .buttonTop{
    margin-top: 10px;
  }
</style>
