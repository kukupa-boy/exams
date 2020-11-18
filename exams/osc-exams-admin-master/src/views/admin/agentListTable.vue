<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" :placeholder="$t('admin.username')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('admin.search') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('admin.add') }}</el-button>
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
      <el-table-column :label="$t('admin.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.avatar')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpAvatarUrl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.username')" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.adminName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.truename')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trueName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.tel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.sex')" align="center">
        <template slot-scope="scope">
          <el-tag type="info">{{ scope.row.sex | sexFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.status')" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="danger">{{ scope.row.status | statusFilter }}</el-tag>
          <el-tag v-if="scope.row.status!=1">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.agentCity')" align="center">
        <template slot-scope="scope">
          <li v-for="(tag) in cityTagList(scope.row.cityIds)" :key="tag.key" style="list-style-type:none;">
            <el-tag
              type="success"
            >
              {{ tag.display_name }}
            </el-tag>
          </li>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.roles')" align="center">
        <template slot-scope="scope">
          <li v-for="(tag) in roleAdminTagList(scope.row.roleAdmins)" :key="tag.key" style="list-style-type:none;">
            <el-tag
              type="success"
            >
              {{ tag.display_name }}
            </el-tag>
          </li>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.date')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.actions')" align="center" width="430px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)">{{ $t('admin.edit') }}
          </el-button>
          <el-button size="mini" style="width: 72px;" type="primary" icon="el-icon-edit" @click="handleUpdatePassword(scope.row)">{{ $t('admin.resetpassword') }}
          </el-button>
          <el-button v-if="scope.row.status==2&&scope.row.isSuper==0" size="mini" type="danger" icon="el-icon-warning" @click="handleModifyStatus(scope.row,1)">{{ $t('admin.forbidden') }}
          </el-button>
          <el-button v-if="scope.row.status==1" size="mini" type="success" icon="el-icon-success" @click="handleModifyStatus(scope.row,2)">{{ $t('admin.usefull') }}
          </el-button>
          <el-button v-if="scope.row.isSuper==0" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(scope.row)">{{ $t('admin.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('admin.username')" prop="adminName">
          <el-input v-if="temp.id==undefined" v-model="temp.adminName" maxlength="13" placeholder="请输入登录账号,长度为5-13" />
          <span v-if="temp.id!=undefined">{{ temp.adminName }}</span>
        </el-form-item>
        <el-form-item :label="$t('admin.avatar')" prop="avatar">
          <el-upload
            v-model="temp.avatar"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessAvatar"
            :before-upload="beforeUploadAvatar"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="temp.httpAvatarUrl" :src="temp.httpAvatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('admin.uploadText') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('admin.truename')" prop="trueName">
          <el-input v-model="temp.trueName" placeholder="请输入真实姓名" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('admin.tel')" prop="tel">
          <el-input v-model="temp.tel" placeholder="请输入手机号码" maxlength="11" />
        </el-form-item>
        <el-form-item :label="$t('admin.choosesex')" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="选择性别" style="width: 280px;">
            <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('admin.choosestatus')" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="选择状态" style="width: 280px;">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('admin.city')" prop="cityIds">
          <el-select v-model="temp.cityIds" clearable multiple class="filter-item" :placeholder="$t('admin.editCity')" style="width: 280px;">
            <el-option v-for="item in cityList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('admin.roles')" prop="roleAdmins">
          <el-select v-model="temp.roleAdmins" clearable multiple class="filter-item" :placeholder="$t('admin.editRoles')" style="width: 280px;">
            <el-option v-for="item in rolesList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.id==undefined" :label="$t('admin.password')" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item v-if="temp.id==undefined" :label="$t('admin.rpassword')" prop="rpassword">
          <el-input v-model="temp.rpassword" type="password" placeholder="请再次输入登录密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('admin.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" icon="el-icon-check" @click="createData">{{ $t('admin.confirm') }}</el-button>
        <el-button v-else type="primary" icon="el-icon-check" @click="updateData">{{ $t('admin.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('admin.resetpassword')" :visible.sync="dialogResetPwdFormVisible">
      <el-form ref="passwordDataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('admin.username')">
          <span>{{ temp.adminName }}</span>
        </el-form-item>
        <el-form-item :label="$t('admin.truename')">
          <span>{{ temp.trueName }}</span>
        </el-form-item>
        <el-form-item :label="$t('admin.tel')">
          <span>{{ temp.tel }}</span>
        </el-form-item>
        <el-form-item :label="$t('admin.password')" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item :label="$t('admin.rpassword')" prop="rpassword">
          <el-input v-model="temp.rpassword" type="password" placeholder="请再次输入登录密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogResetPwdFormVisible = false">{{ $t('admin.cancel') }}</el-button>
        <el-button type="primary" icon="el-icon-check" @click="updatePassword">{{ $t('admin.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchAdminList, createAdmin, updateAdmin, deleteAdmin, updateAdminPassword, updateAdminStatus } from '@/api/admin'
import { findRoles } from '@/api/adminRoles'
import { getCitys } from '@/api/city'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'

const sexOptions = [
  { key: 0, display_name: '保密' },
  { key: 1, display_name: '美女' },
  { key: 2, display_name: '帅哥' }
]
const statusOptions = [
  { key: 1, display_name: '锁定' },
  { key: 2, display_name: '正常' }
]
const statusViewOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '锁定' },
  { key: 2, display_name: '正常' }
]
var cityOptions = []
var rolesOptions = []

// arr to obj ,such as { CN : "China", US : "USA" }
const sexTypeKeyValue = sexOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const statusKeyValue = statusViewOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'AgentListTable',
  directives: {
    waves
  },
  filters: {
    roleAdminsFilter(roleAdmins) {
      if (!roleAdmins || roleAdmins.length <= 0) {
        return
      }
      var roleNames = []
      for (const roleAdmin of roleAdmins) {
        for (const rolesItem of rolesOptions) {
          if (parseInt(roleAdmin.roleId) === parseInt(rolesItem.key)) {
            roleNames.push(rolesItem.display_name)
            break
          }
        }
      }
      return roleNames.join(',')
    },
    cityFilter(_cityIds) {
      if (!_cityIds || _cityIds.length <= 0) {
        return
      }
      const cityIds = _cityIds.split(',')
      var cityNames = []
      for (const cityId of cityIds) {
        for (const cityItem of cityOptions) {
          if (parseInt(cityItem.key) === parseInt(cityId)) {
            cityNames.push(cityItem.display_name)
            break
          }
        }
      }
      return cityNames.join(',')
    },
    tagFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    sexFilter(type) {
      return sexTypeKeyValue[type]
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
    var validName = (rule, value, callback) => {
      const valid_map = /\w{4,12}\w$/
      if (!valid_map.test(value)) {
        return callback(new Error('用户名不能包含中文和特殊字符，且最多5到13个字符'))
      }
      callback()
    }
    return {
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/admin/upload`,
      cityList: [],
      rolesList: [],
      adminType: 2,
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
              field: 'adminType',
              operater: '=',
              value: 2
            }
          ]
        }
      },
      importanceOptions: [1, 2, 3],
      sexOptions,
      statusOptions,
      cityOptions,
      rolesOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        adminName: '',
        trueName: '',
        sex: 0,
        tel: '',
        password: '',
        rpassword: '',
        status: 0,
        isSuper: 0,
        cityIds: [],
        adminType: this.adminType,
        roleAdmins: [],
        avatar: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑区域代理',
        create: '新增区域代理'
      },
      dialogResetPwdFormVisible: false,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        adminName: [
          { validator: validName, trigger: 'blur' }
        ],
        trueName: [{ required: true, message: '真实姓名是必填字段', trigger: 'blur' }],
        tel: [{ required: true, message: '手机号码是必填字段', trigger: 'blur' }],
        sex: [{ required: true, message: '性别是必选字段', trigger: 'change' }],
        status: [{ required: true, message: '状态是必选字段', trigger: 'change' }],
        password: [{ required: true, message: '登录密码是必填字段', trigger: 'blur' }],
        rpassword: [{ required: true, message: '确认密码是必填字段', trigger: 'blur' }],
        cityIds: [{ required: true, message: '代理城市不能为空', trigger: 'change' }],
        roleAdmins: [{ required: true, message: '角色不能为空', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    handleSuccessAvatar(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.temp.avatar = res.data.url
          this.temp.httpAvatarUrl = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    beforeUploadAvatar(file) {
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
    roleAdminTagList(roleAdmins) {
      if (!roleAdmins || roleAdmins.length <= 0) {
        return
      }
      var roleNames = []
      for (const roleAdmin of roleAdmins) {
        for (const rolesItem of rolesOptions) {
          if (parseInt(roleAdmin.roleId) === parseInt(rolesItem.key)) {
            roleNames.push(rolesItem)
            break
          }
        }
      }
      return roleNames
    },
    cityTagList(_cityIds) {
      if (!_cityIds || _cityIds.length <= 0) {
        return
      }
      const cityIds = _cityIds.split(',')
      var cityNames = []
      for (const cityId of cityIds) {
        for (const cityItem of cityOptions) {
          if (parseInt(cityItem.key) === parseInt(cityId)) {
            cityNames.push(cityItem)
            break
          }
        }
      }
      return cityNames
    },
    getListData() {
      getCitys([]).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.cityList.push({
            key: response.data[i].id,
            display_name: response.data[i].name
          })
        }
        cityOptions = this.cityList
      }).then(() => {
        return findRoles()
      }).then(response => {
        for (var j = 0; j < response.data.length; j++) {
          this.rolesList.push({
            key: response.data[j].id,
            display_name: response.data[j].roleName
          })
        }
        rolesOptions = this.rolesList
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      fetchAdminList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 0
      if (this.listQuery.title) {
        this.listQuery.filter = {
          filters: [
            {
              field: 'adminType',
              operater: '=',
              value: 2
            },
            {
              field: 'adminName',
              operater: 'like',
              value: '%' + this.listQuery.title + '%'
            }
          ]
        }
      } else {
        this.listQuery.filter = null
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
    handleModifyStatus(row, status) {
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.status = status
      var data = Object.assign({}, row)
      data.status = status
      updateAdminStatus(data).then(response => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        adminName: '',
        trueName: '',
        sex: 0,
        tel: '',
        password: '',
        rpassword: '',
        status: 2,
        isSuper: 0,
        cityIds: [],
        adminType: this.adminType,
        roleAdmins: [],
        avatar: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.roleIds = this.temp.roleAdmins
          this.temp.adminType = this.adminType
          // 避免接口调用失败 cityIds类型被改变
          var insertData = Object.assign({}, this.temp)
          insertData.cityIds = this.temp.cityIds.join(',')
          createAdmin(insertData).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.oldRoleIds = []
      this.temp.cityIds = []
      const tempArr = row.cityIds.split(',')
      for (const cityId of tempArr) {
        this.temp.cityIds.push(parseInt(cityId))
      }
      this.temp.roleIds = []
      for (const roleAdmin of row.roleAdmins) {
        this.temp.roleIds.push(parseInt(roleAdmin.roleId))
        this.temp.oldRoleIds.push(parseInt(roleAdmin.roleId))
      }
      // 赋值给this.temp原有的属性，防止添加的属性 v-model动态更新不了
      this.temp.roleAdmins = this.temp.roleIds
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.roleIds = this.temp.roleAdmins
          this.temp.deleteRoleIds = []
          var newRoleIds = []
          this.temp.oldRoleIds
          // 添加角色
          for (const roleId of this.temp.roleIds) {
            let flag = false
            for (const oldRoleId of this.temp.oldRoleIds) {
              if (roleId === oldRoleId) {
                flag = true
                break
              }
            }
            if (!flag) {
              newRoleIds.push(roleId)
            }
          }
          // 删除角色
          for (const oldRoleId of this.temp.oldRoleIds) {
            let flag = false
            for (const roleId of this.temp.roleIds) {
              if (oldRoleId === roleId) {
                flag = true
                break
              }
            }
            if (!flag) {
              this.temp.deleteRoleIds.push(oldRoleId)
            }
          }
          this.temp.roleIds = newRoleIds
          this.temp.adminType = this.adminType
          // 避免接口调用失败 cityIds类型被改变
          var insertData = Object.assign({}, this.temp)
          // 城市
          insertData.cityIds = this.temp.cityIds.join(',')
          updateAdmin(insertData).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleUpdatePassword(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.roleAdmins = []
      this.temp.cityIds = []
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogResetPwdFormVisible = true
      this.$nextTick(() => {
        this.$refs['passwordDataForm'].clearValidate()
      })
    },
    updatePassword() {
      this.$refs['passwordDataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('重置密码后无法恢复，请确定要重置该区域代理密码吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.temp.password !== this.temp.rpassword) {
              this.$notify({
                title: '失败',
                message: '两次密码输入不一致',
                type: 'error',
                duration: 2000
              })
              return
            }
            const req = {
              adminId: this.temp.id,
              password: this.temp.password,
              rpassword: this.temp.rpassword
            }
            updateAdminPassword(req).then(response => {
              this.$notify({
                title: '成功',
                message: '重置密码成功',
                type: 'success',
                duration: 2000
              })
              this.dialogResetPwdFormVisible = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该区域代理吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.id).then(response => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.dialogFormVisible = false
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleFetchPv(pv) {

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
    width: 150px;
    height: 150px;
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
