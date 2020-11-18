<template>
  <div class="app-container">
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="systeminfoData" label-position="right" label-width="280px" style="width: 90%;">
      <el-form-item :label="$t('systeminfo.trytime')" prop="trytime">
        <el-input v-model="systeminfoData.trytime" :placeholder="$t('systeminfo.editTrytime')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.wechatAppId')">
        <el-input v-model="systeminfoData.wechatAppId" :placeholder="$t('systeminfo.editWechatAppId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.wechatMchId')">
        <el-input v-model="systeminfoData.wechatMchId" :placeholder="$t('systeminfo.editWechatMchId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.wechatKey')">
        <el-input v-model="systeminfoData.wechatKey" :placeholder="$t('systeminfo.editWechatKey')">
          <template slot="append"><a target="_blank" class="tip" href="http://tool.chinaz.com/Tools/MD5.aspx?q=&md5type=1">{{ $t('systeminfo.goToCreateKey') }}</a></template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.wechatAppSecret')">
        <el-input v-model="systeminfoData.wechatAppSecret" :placeholder="$t('systeminfo.editWechatAppSecret')" />
      </el-form-item>
      <!-- <el-form-item :label="$t('systeminfo.wechatToken')">
        <el-input v-model="systeminfoData.wechatToken" :placeholder="$t('systeminfo.editWechatToken')" />
      </el-form-item> -->
      <el-form-item :label="$t('systeminfo.customerWechat')">
        <el-input v-model="systeminfoData.customerWechat" :placeholder="$t('systeminfo.editCustomerWechat')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunUserId')">
        <el-input v-model="systeminfoData.aliyunUserId" :placeholder="$t('systeminfo.editAliyunUserId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunClientId')">
        <el-input v-model="systeminfoData.aliyunClientId" :placeholder="$t('systeminfo.editAliyunClientId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunVodRegionId')">
        <el-input v-model="systeminfoData.aliyunVodRegionId" :placeholder="$t('systeminfo.editAliyunVodRegionId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunAccessKeyId')">
        <el-input v-model="systeminfoData.aliyunAccessKeyId" :placeholder="$t('systeminfo.editAliyunAccessKeyId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunAccessKeySecret')">
        <el-input v-model="systeminfoData.aliyunAccessKeySecret" :placeholder="$t('systeminfo.editAliyunAccessKeySecret')" />
      </el-form-item>
      <!-- <el-form-item :label="$t('systeminfo.aliyunAuthGrantType')">
        <el-input v-model="systeminfoData.aliyunAuthGrantType" :placeholder="$t('systeminfo.editAliyunAuthGrantType')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunAuthClientId')">
        <el-input v-model="systeminfoData.aliyunAuthClientId" :placeholder="$t('systeminfo.editAliyunAuthClientId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunAuthClientSecret')">
        <el-input v-model="systeminfoData.aliyunAuthClientSecret" :placeholder="$t('systeminfo.editAliyunAuthClientSecret')" />
      </el-form-item> -->
      <el-form-item :label="$t('systeminfo.ossurl')">
        <el-input v-model="systeminfoData.ossurl" :placeholder="$t('systeminfo.editossurl')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunOssEndpoint')">
        <el-input v-model="systeminfoData.aliyunOssEndpoint" :placeholder="$t('systeminfo.editAliyunOssEndpoint')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunOssAccessKeyId')">
        <el-input v-model="systeminfoData.aliyunOssAccessKeyId" :placeholder="$t('systeminfo.editAliyunOssAccessKeyId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunOssAccessKeySecret')">
        <el-input v-model="systeminfoData.aliyunOssAccessKeySecret" :placeholder="$t('systeminfo.editAliyunOssAccessKeySecret')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunOssBucketName')">
        <el-input v-model="systeminfoData.aliyunOssBucketName" :placeholder="$t('systeminfo.editAliyunOssBucketName')" />
      </el-form-item>
      <!-- <el-form-item :label="$t('systeminfo.aliyunStsAccessKeyId')">
        <el-input v-model="systeminfoData.aliyunStsAccessKeyId" :placeholder="$t('systeminfo.editAliyunStsAccessKeyId')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunStsAccessKeySecret')">
        <el-input v-model="systeminfoData.aliyunStsAccessKeySecret" :placeholder="$t('systeminfo.editAliyunStsAccessKeySecret')" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.aliyunStsRolearn')">
        <el-input v-model="systeminfoData.aliyunStsRolearn" :placeholder="$t('systeminfo.editAliyunStsRolearn')" />
      </el-form-item> -->
      <!-- <el-form-item :label="$t('systeminfo.apiCertP12Url')">
        <el-upload
          v-model="systeminfoData.apiCertP12Url"
          :action="uploadUrl()"
          :file-list="apiCertP12UrlFileList"
          :on-success="handleSuccessApiCertP12Url"
          :headers="myHeaders"
          :on-change="handleChangeApiCertP12Url"
          :on-remove="handleOnRemoveApiCertP12Url"
          :before-upload="handleBeforeUploadApiCertP12Url"
          class="avatar-uploader"
        >
          <el-button size="small" type="primary" icon="el-icon-upload2">{{ $t('systeminfo.uploadClickText') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.editApiCertP12Url') }}</div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.apiCertPemUrl')">
        <el-upload
          v-model="systeminfoData.apiCertPemUrl"
          :action="uploadUrl()"
          :file-list="apiCertPemUrlFileList"
          :on-success="handleSuccessApiCertPemUrl"
          :headers="myHeaders"
          :on-change="handleChangeApiCertPemUrl"
          :on-remove="handleOnRemoveApiCertPemUrl"
          :before-upload="handleBeforeUploadApiCertPemUrl"
          class="avatar-uploader"
        >
          <el-button size="small" type="primary" icon="el-icon-upload2">{{ $t('systeminfo.uploadClickText') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.editApiCertPemUrl') }}</div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.apiKeyPemUrl')">
        <el-upload
          v-model="systeminfoData.apiKeyPemUrl"
          :action="uploadUrl()"
          :file-list="apiKeyPemUrlFileList"
          :on-success="handleSuccessApiKeyPemUrl"
          :headers="myHeaders"
          :on-change="handleChangeApiKeyPemUrl"
          :on-remove="handleOnRemoveApiKeyPemUrl"
          :before-upload="handleBeforeUploadApiKeyPemUrl"
          class="avatar-uploader"
        >
          <el-button size="small" type="primary" icon="el-icon-upload2">{{ $t('systeminfo.uploadClickText') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.editApiKeyPemUrl') }}</div>
        </el-upload>
      </el-form-item> -->
    </el-form>
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="systeminfoData" label-position="right" label-width="280px" class="dataform">
      <el-form-item :label="$t('systeminfo.apiCertP12Url')">
        <el-upload
          v-model="systeminfoData.apiCertP12Url"
          :action="uploadUrl()"
          :file-list="apiCertP12UrlFileList"
          :on-success="handleSuccessApiCertP12Url"
          :headers="myHeaders"
          :on-change="handleChangeApiCertP12Url"
          :on-remove="handleOnRemoveApiCertP12Url"
          :before-upload="handleBeforeUploadApiCertP12Url"
          class="avatar-uploader"
        >
          <el-button size="small" type="primary" icon="el-icon-upload2">{{ $t('systeminfo.uploadClickText') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.editApiCertP12Url') }}</div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.apiCertPemUrl')">
        <el-upload
          v-model="systeminfoData.apiCertPemUrl"
          :action="uploadUrl()"
          :file-list="apiCertPemUrlFileList"
          :on-success="handleSuccessApiCertPemUrl"
          :headers="myHeaders"
          :on-change="handleChangeApiCertPemUrl"
          :on-remove="handleOnRemoveApiCertPemUrl"
          :before-upload="handleBeforeUploadApiCertPemUrl"
          class="avatar-uploader"
        >
          <el-button size="small" type="primary" icon="el-icon-upload2">{{ $t('systeminfo.uploadClickText') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.editApiCertPemUrl') }}</div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.apiKeyPemUrl')">
        <el-upload
          v-model="systeminfoData.apiKeyPemUrl"
          :action="uploadUrl()"
          :file-list="apiKeyPemUrlFileList"
          :on-success="handleSuccessApiKeyPemUrl"
          :headers="myHeaders"
          :on-change="handleChangeApiKeyPemUrl"
          :on-remove="handleOnRemoveApiKeyPemUrl"
          :before-upload="handleBeforeUploadApiKeyPemUrl"
          class="avatar-uploader"
        >
          <el-button size="small" type="primary" icon="el-icon-upload2">{{ $t('systeminfo.uploadClickText') }}</el-button>
          <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.editApiKeyPemUrl') }}</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left:38%">
      <el-button type="success" icon="el-icon-circle-check" @click="updateSysteminfoToParam()">{{ $t('systeminfo.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { findSysteminfo, updateSysteminfo } from '@/api/systeminfo'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'SysteminfoToParamTable',
  directives: {
    waves
  },
  data() {
    var validNumber = (rule, value, callback) => {
      const valid = /^\d+$/
      if (value === '') {
        return callback()
      }
      if (!valid.test(value)) {
        return callback(new Error('请输入正确的试看时长'))
      }
      return callback()
    }
    return {
      myHeaders: { token: getToken() },
      fileUrl: `${process.env.VUE_APP_BASE_API}file/systeminfo/upload/cert`,
      apiCertP12UrlFileList: [],
      apiCertPemUrlFileList: [],
      apiKeyPemUrlFileList: [],
      apiCertP12UrlFileBackup: null,
      apiCertPemUrlFileBackup: null,
      apiKeyPemUrlFileBackup: null,
      systeminfoData: {
        apiCertP12Url: null, // apiclient_cert.p12文件
        apiCertPemUrl: null, // apiclient_cert.pem文件
        apiKeyPemUrl: null, // apiclient_key.pem文件
        apiCertP12Name: null, // apiclient_cert.p12文件名称
        apiCertPemName: null, // apiclient_cert.pem文件名称
        apiKeyPemName: null // apiclient_key.pem文件名称
      },
      rules: {
        trytime: [{ validator: validNumber, trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getSysteminfoToParam()
  },
  methods: {
    handleBeforeUploadApiCertP12Url(file) {
      const isPem = file.type === 'application/x-pkcs12'
      if (!isPem) {
        this.$message.error('上传图标只能是 pem 格式!')
        // 还原文件列表
        this.apiCertP12UrlFileList = []
        this.apiCertP12UrlFileList.push(this.apiCertP12UrlFileBackup)
      }
      return isPem
    },
    handleBeforeUploadApiCertPemUrl(file) {
      console.log(file.name)
      const isPem = file.name.substring(file.name.lastIndexOf('.') + 1) === 'pem'
      if (!isPem) {
        this.$message.error('上传图标只能是 pem 格式!')
        // 还原文件列表
        this.apiCertPemUrlFileList = []
        this.apiCertPemUrlFileList.push(this.apiCertPemUrlFileBackup)
      }
      return isPem
    },
    handleBeforeUploadApiKeyPemUrl(file) {
      console.log(file.name)
      const isPem = file.name.substring(file.name.lastIndexOf('.') + 1) === 'pem'
      if (!isPem) {
        this.$message.error('上传图标只能是 pem 格式!')
        // 还原文件列表
        this.apiKeyPemUrlFileList = []
        this.apiKeyPemUrlFileList.push(this.apiKeyPemUrlFileBackup)
      }
      return isPem
    },
    handleOnRemoveApiCertP12Url(file, fileList) {
      this.systeminfoData.apiCertP12Url = null
      this.systeminfoData.apiCertP12Name = null
    },
    handleChangeApiCertP12Url(file, fileList) {
      if (fileList.length > 1) {
        this.apiCertP12UrlFileBackup = Object.assign({}, fileList.slice(-2, -1)[0])
      }
      this.apiCertP12UrlFileList = fileList.slice(-1)
    },
    handleSuccessApiCertP12Url(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.systeminfoData.apiCertP12Url = res.data.url
          this.systeminfoData.apiCertP12Name = res.data.oldFileName
          this.$forceUpdate()
        }, 1000)
      }
    },
    handleSuccessApiCertPemUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.systeminfoData.apiCertPemUrl = res.data.url
          this.systeminfoData.apiCertPemName = res.data.oldFileName
          this.$forceUpdate()
        }, 1000)
      }
    },
    handleChangeApiCertPemUrl(file, fileList) {
      if (fileList.length > 1) {
        this.apiCertPemUrlFileBackup = Object.assign({}, fileList.slice(-2, -1)[0])
      }
      this.apiCertPemUrlFileList = fileList.slice(-1)
    },
    handleOnRemoveApiCertPemUrl(file, fileList) {
      this.systeminfoData.apiCertPemUrl = null
      this.systeminfoData.apiCertPemName = null
    },
    handleSuccessApiKeyPemUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.systeminfoData.apiKeyPemUrl = res.data.url
          this.systeminfoData.apiKeyPemName = res.data.oldFileName
          this.$forceUpdate()
        }, 1000)
      }
    },
    handleChangeApiKeyPemUrl(file, fileList) {
      if (fileList.length > 1) {
        this.apiKeyPemUrlFileBackup = Object.assign({}, fileList.slice(-2, -1)[0])
      }
      this.apiKeyPemUrlFileList = fileList.slice(-1)
    },
    handleOnRemoveApiKeyPemUrl(file, fileList) {
      this.systeminfoData.apiKeyPemUrl = null
      this.systeminfoData.apiKeyPemName = null
    },
    uploadUrl() {
      return this.fileUrl
    },
    getSysteminfoToParam() {
      findSysteminfo().then(response => {
        this.systeminfoData = Object.assign({}, response.data)
        // list
        this.apiCertP12UrlFileList = this.systeminfoData.apiCertP12Name ? [{ name: this.systeminfoData.apiCertP12Name }] : []
        this.apiCertPemUrlFileList = this.systeminfoData.apiCertPemName ? [{ name: this.systeminfoData.apiCertPemName }] : []
        this.apiKeyPemUrlFileList = this.systeminfoData.apiKeyPemName ? [{ name: this.systeminfoData.apiKeyPemName }] : []
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateSysteminfoToParam() {
      console.log(this.systeminfoData)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateSysteminfo(this.systeminfoData).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
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

<style type="text/css">
  .el-input {
    width: 320px;
  }
  .dataform .avatar-uploader {
    width: 320px;
  }
  .tip {
    font-size: 10px;
  }
</style>
