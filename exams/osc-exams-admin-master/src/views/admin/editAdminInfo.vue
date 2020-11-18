<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item :label="$t('admin.username')">
        <span>{{ temp.adminName }}</span>
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
        <el-input v-model="temp.trueName" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item :label="$t('admin.tel')" prop="tel">
        <el-input v-model="temp.tel" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item :label="$t('admin.choosesex')" prop="sex">
        <el-select v-model="temp.sex" class="filter-item" placeholder="选择性别">
          <el-option v-for="item in sexOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="el-icon-check" @click="handleUpdateData">{{ $t('admin.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import { getInfo } from '@/api/login'
import { updateAdminPersonalInfo } from '@/api/admin'
import waves from '@/directive/waves' // 水波纹指令
import { getToken } from '@/utils/auth'
import { parseTime } from '@/utils'

const sexOptions = [
  { key: 0, display_name: '保密' },
  { key: 1, display_name: '美女' },
  { key: 2, display_name: '帅哥' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const sexTypeKeyValue = sexOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'EditAdminInfo',
  directives: {
    waves
  },
  filters: {
    sexFilter(type) {
      return sexTypeKeyValue[type]
    },
    imgFilter(v) {
      if (v) {
        return v + '?x-oss-process=image/resize,m_fill,h_50,w_50'
      }
      return v
    }
  },
  data() {
    return {
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/admin/upload`,
      token: getToken(),
      sexOptions,
      temp: {},
      rules: {
        trueName: [{ required: true, message: '真实姓名是必填字段', trigger: 'blur' }],
        tel: [{ required: true, message: '手机号码是必填字段', trigger: 'blur' }],
        sex: [{ required: true, message: '性别是必选字段', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getAdminInfo()
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
          updateAdminPersonalInfo(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            // this.closeSelectedTag()
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
