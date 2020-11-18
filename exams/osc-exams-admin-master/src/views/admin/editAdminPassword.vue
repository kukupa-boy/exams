<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
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
      <el-button type="primary" icon="el-icon-check" @click="handleUpdateData">{{ $t('admin.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import { getInfo } from '@/api/login'
import { updateAdminPersonalPersonal } from '@/api/admin'
import waves from '@/directive/waves' // 水波纹指令
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils'

export default {
  name: 'EditAdminPassword',
  directives: {
    waves
  },
  filters: {
    imgFilter(v) {
      if (v) {
        return v + '?x-oss-process=image/resize,m_fill,h_50,w_50'
      }
      return v
    }
  },
  data() {
    return {
      token: getToken(),
      temp: {},
      rules: {
        password: [{ required: true, message: '登录密码是必填字段', trigger: 'blur' }],
        rpassword: [{ required: true, message: '确认密码是必填字段', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getAdminInfo()
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag() {
      const view = this.generateRoute()
      if (!view) {
        return false
      }
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    getAdminInfo() {
      getInfo(this.token).then(response => {
        this.temp = response.data
        console.log(this.temp)
        // Just to simulate the time of the request
      })
    },
    handleUpdateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('重置密码后无法恢复，请确定要重置密码吗?', '提示', {
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
              password: this.temp.password,
              rpassword: this.temp.rpassword
            }
            updateAdminPersonalPersonal(req).then(response => {
              this.$notify({
                title: '成功',
                message: '重置密码成功',
                type: 'success',
                duration: 2000
              })
              // this.closeSelectedTag()
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
