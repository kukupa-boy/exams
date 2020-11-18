<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.userid" :placeholder="'请输入用户id'" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.authorname" :placeholder="'请输入主播昵称'" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.authortel" :placeholder="'请输入主播电话'" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.name" :placeholder="'请输入直播间名称'" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.langtype" clearable filterable class="filter-item" :placeholder="'请输入语言类型'" @keyup.enter.native="handleFilter">
        <el-option v-for="item in langtypeOptionsFn()" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.status" clearable filterable class="filter-item" :placeholder="'请选择审核状态'" @keyup.enter.native="handleFilter">
        <el-option v-for="item in verifyOptionsFn()" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.steptype" clearable filterable class="filter-item" :placeholder="'请选择科目类型'" @keyup.enter.native="handleFilter">
        <el-option v-for="item in steptypeOptionsFn()" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <div style="display:flex">
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
      <el-table-column :label="'ID'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户id'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steptype }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'主播昵称'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authorname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'主播电话'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authortel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'主播微信号'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.authorwechat }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'副主播微信号'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subauthorwechat }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'直播间名称'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'房间号'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomid }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'科目类型'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steptype | filterSteptype }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'直播描述'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.descrip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'背景图'" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.httpCoverImg" :src="scope.row.httpCoverImg" style="height:40px;width:60px">
        </template>
      </el-table-column>
      <el-table-column :label="'语言类型'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.langtype | filterLangtype }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'访问次数'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.visits?scope.row.visits:0 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'创建时间'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdon | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'审核状态'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | filterVerify }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'拒绝原因'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reason?scope.row.reason:"未拒绝" }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'开始时间'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.starttime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'结束时间'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="370px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="handlePass(scope.row)">通过</el-button>
          <el-button size="mini" type="primary" icon="info" @click="handleRefuse(scope.row)">拒绝</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <div style="display:flex">
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
    <el-dialog :title="'修改直播信息'" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataItem" label-position="left" label-width="160px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="'ID'">
          <el-input v-model="dataItem.id" readonly maxlength="80" />
        </el-form-item>
        <el-form-item :label="'主播昵称'" prop="authorname">
          <el-input v-model="dataItem.authorname" maxlength="80" :placeholder="'请输入主播昵称'" />
        </el-form-item>
        <el-form-item :label="'主播电话'" prop="authortel">
          <el-input v-model="dataItem.authortel" maxlength="80" :placeholder="'请输入主播电话'" />
        </el-form-item>
        <el-form-item :label="'主播微信号'" prop="authorwechat">
          <el-input v-model="dataItem.authorwechat" maxlength="80" :placeholder="'请输入主播微信号'" />
        </el-form-item>
        <el-form-item :label="'副主播微信号'" prop="subauthorwechat">
          <el-input v-model="dataItem.subauthorwechat" maxlength="80" :placeholder="'请输入副主播微信号'" />
        </el-form-item>
        <el-form-item :label="'房间号'" prop="roomid">
          <el-input v-model="dataItem.roomid" maxlength="80" :placeholder="'请输入直播房间号'" />
        </el-form-item>
        <el-form-item :label="'直播描述'" prop="descrip">
          <el-input v-model="dataItem.descrip" maxlength="80" :placeholder="'请输入直播描述'" />
        </el-form-item>
        <el-form-item :label="'直播名称'" prop="name">
          <el-input v-model="dataItem.name" maxlength="80" :placeholder="'请输入直播名称'" />
        </el-form-item>
        <el-form-item :label="'语言类型'" prop="langtype">
          <el-select v-model="dataItem.langtype" clearable filterable class="filter-item" :placeholder="'请选择语言类型'" style="width:240px" @keyup.enter.native="handleFilter">
            <el-option v-for="item in langtypeOptionsFn()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'审核状态'" prop="status">
          <el-select v-model="dataItem.status" clearable filterable class="filter-item" :placeholder="'请选择审核状态'" style="width:240px" @keyup.enter.native="handleFilter">
            <el-option v-for="item in verifyOptionsFn()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'科目类型'" prop="steptype">
          <el-select v-model="dataItem.steptype" clearable filterable class="filter-item" :placeholder="'请选择科目类型'" style="width:240px" @keyup.enter.native="handleFilter">
            <el-option v-for="item in steptypeOptionsFn()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="'背景图'" prop="imageurl">
          <el-upload
            v-model="dataItem.coverimg"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessCoverUrl"
            :before-upload="beforeUploadCoverUrl"
            :headers="getHeaders"
            class="avatar-uploader"
          >
            <img v-if="dataItem.httpimageurl" :src="dataItem.httpimageurl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('product.uploadText') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="'开始时间'" prop="starttime">
          <el-date-picker
            v-model="dataItem.starttime"
            type="datetime"
            style="width:240px"
            placeholder="选择开始时间"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item :label="'结束时间'" prop="endtime">
          <el-date-picker
            v-model="dataItem.endtime"
            type="datetime"
            style="width:240px"
            placeholder="选择结束时间"
            value-format="timestamp"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('productCategory.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateData">{{ $t('productCategory.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'通过'" :visible.sync="dialogPassVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataItem" label-position="left" label-width="160px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="'通过房间号'" prop="roomid">
          <el-input v-model="dataItem.roomid" maxlength="80" :placeholder="'请输入房间号'" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogPassVisible = false">{{ $t('productCategory.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="passVetity">{{ $t('productCategory.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'拒绝申请'" :visible.sync="dialogRefuseVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataItem" label-position="left" label-width="160px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="'拒绝原因'" prop="reason">
          <el-input v-model="dataItem.reason" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" maxlength="80" :placeholder="'请输入拒绝原因'" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogRefuseVisible = false">{{ $t('productCategory.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="refuseVetity">{{ $t('productCategory.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { liveroomPage, liveroomUpdate, liveroomDelete, liveroomAudit } from '@/api/live'
import { isPhone } from '@/utils/validate'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
const langtypeOptions = [
  { key: 0, display_name: '汉语' },
  { key: 1, display_name: '维语' }
]
const verifyOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '待审核' },
  { key: 2, display_name: '审核通过' },
  { key: 3, display_name: '审核失败' }
]
const steptypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '科目一' },
  { key: 2, display_name: '科目二' },
  { key: 3, display_name: '科目三' },
  { key: 4, display_name: '科目四' }
]
const statusLangtypeValue = langtypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const statusVerifyValue = verifyOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const statusSteptypeValue = steptypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const telephone = (rule, value, callback) => {
  if (!isPhone(value)) {
    return callback(new Error('请输入对应的金额'))
  }
  return callback()
}
export default {
  name: 'Live',
  directives: {
    waves
  },
  filters: {
    timeFilter(v) {
      return parseTime(v)
    },
    filterLangtype(v) {
      return statusLangtypeValue[v]
    },
    filterVerify(v) {
      return statusVerifyValue[v]
    },
    filterSteptype(v) {
      return statusSteptypeValue[v]
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
      downloadLoading: false,
      dialogFormVisible: false,
      dialogPassVisible: false,
      dialogRefuseVisible: false,
      getHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/product/upload`,
      dataItem: {}, // item数据存放
      rules: {// blur authorname authortel authorwechat descrip name roomid subauthorwechat
      // change imageurl starttime endtime langtype status steptype
        authorname: [{ required: true, message: '请输入主播昵称', trigger: 'blur' }],
        authortel: [{ required: true, validator: telephone, trigger: 'blur' }],
        authorwechat: [{ required: true, message: '请输入主播微信号', trigger: 'blur' }],
        descrip: [{ required: true, message: '请输入对应的描述', trigger: 'blur' }],
        name: [{ required: true, message: '请输入直播名称', trigger: 'blur' }],
        roomid: [{ required: true, message: '请输入直播间房间号', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入拒绝原因', trigger: 'blur' }],
        subauthorwechat: [{ required: true, message: '请输入副主播微信号', trigger: 'blur' }],
        imageurl: [{ required: true, message: '请上传封面', trigger: 'change' }],
        starttime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endtime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        langtype: [{ required: true, message: '请选择语言类型', trigger: 'change' }],
        status: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        steptype: [{ required: true, message: '请选择科目类型', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    verifyOptionsFn() {
      return verifyOptions.slice(1, verifyOptions.length)
    },
    steptypeOptionsFn() {
      return steptypeOptions.slice(1, steptypeOptions.length)
    },
    langtypeOptionsFn() {
      return langtypeOptions
    },
    getList() {
      this.listLoading = true
      liveroomPage(this.listQuery).then(response => {
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
        liveroomDelete(row.id).then(res => {
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
      // userid、authorname、authortel、name、langtype、status、steptype
      if (this.listQueryFilter.userid) {
        this.listQuery.filter.filters.push({
          field: 'userid',
          operater: 'like',
          value: '%' + this.listQueryFilter.userid + '%'
        })
      }
      if (this.listQueryFilter.authorname) {
        this.listQuery.filter.filters.push({
          field: 'authorname',
          operater: 'like',
          value: '%' + this.listQueryFilter.authorname + '%'
        })
      }
      if (this.listQueryFilter.authortel) {
        this.listQuery.filter.filters.push({
          field: 'authortel',
          operater: 'like',
          value: '%' + this.listQueryFilter.authortel + '%'
        })
      }
      if (this.listQueryFilter.name) {
        this.listQuery.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilter.name + '%'
        })
      }
      if (this.listQueryFilter.langtype) {
        this.listQuery.filter.filters.push({
          field: 'langtype',
          operater: 'like',
          value: '%' + this.listQueryFilter.langtype + '%'
        })
      }
      if (this.listQueryFilter.status) {
        this.listQuery.filter.filters.push({
          field: 'status',
          operater: 'like',
          value: '%' + this.listQueryFilter.status + '%'
        })
      }
      if (this.listQueryFilter.steptype) {
        this.listQuery.filter.filters.push({
          field: 'steptype',
          operater: 'like',
          value: '%' + this.listQueryFilter.steptype + '%'
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
    handleUpdate(row) {
      this.dialogFormVisible = true
      this.dataItem = row
    },
    updateData() {
      liveroomUpdate(this.dataItem).then(() => {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '更新成功',
          duration: 2000
        })
        this.dialogFormVisible = false
        this.getList()
      }).catch(() => {
        this.$notify({
          title: '错误',
          type: 'error',
          message: '更新失败',
          duration: 2000
        })
        this.dialogFormVisible = false
      })
    },
    uploadUrl() {
      return this.imgUrl
    },
    handleSuccessCoverUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.dataItem.coverimg = res.data.url
          this.dataItem.httpimageurl = res.data.httpUrl
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
    handlePass(row) {
      this.dataItem = row
      this.dialogPassVisible = true
    },
    handleRefuse(row) {
      this.dataItem = row
      this.dialogRefuseVisible = true
    },
    passVetity() {
      liveroomAudit(this.dataItem).then((res) => {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '申请成功',
          duration: 2000
        })
        this.dialogPassVisible = false
        this.getList()
      }).catch(() => {
        this.$notify({
          title: '失败',
          type: 'error',
          message: '申请失败',
          duration: 2000
        })
        this.getList()
      })
    },
    refuseVetity() {
      liveroomAudit(this.dataItem).then((res) => {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '拒绝成功',
          duration: 2000
        })
        this.dialogRefuseVisible = false
        this.getList()
      }).catch(() => {
        this.$notify({
          title: '失败',
          type: 'error',
          message: '拒绝失败',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
<style scoped lang="scss">
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
    width: 240px;
    height: 135px;
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
