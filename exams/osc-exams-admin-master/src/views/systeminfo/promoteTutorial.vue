<template>
  <div class="app-container">
    <div style="display:flex;justify-content:flex-start;">
      <el-form ref="dataForm" :inline="false" :model="systeminfoData" label-position="top" label-width="160px" style="width: 400px; margin-left:20px;">
        <el-form-item :label="$t('systeminfo.shareTitle')">
          <el-input v-model="systeminfoData.shareTitle" maxlength="200" :placeholder="$t('systeminfo.editShareTitle')" style="width: 380px;" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.shareImageUrl')">
          <el-upload
            v-model="systeminfoData.shareImageUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessShareImageUrl"
            :before-upload="beforeUploadShareImageUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="systeminfoData.shareImageUrl" :src="systeminfoData.httpShareImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.uploadShareImageText') }}</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item :label="$t('systeminfo.shareUrl')" prop="shareUrl">
          <el-input v-model="systeminfoData.shareUrl" :placeholder="$t('systeminfo.editShareUrl')" style="width: 380px;" />
          <el-alert :title="$t('systeminfo.shareUrlTips')" type="info" show-icon style="width: 380px;" />
        </el-form-item> -->
        <el-form-item :label="$t('systeminfo.promoteTutorial')">
          <tinymce ref="promoteTutorialTinymce" v-model="systeminfoData.promoteTutorial" :height="300" :width="600" :placeholder="$t('systeminfo.editPromoteTutorial')" />
        </el-form-item>
      </el-form>
      <el-form ref="dataForm" :inline="false" :model="systeminfoData" label-position="top" label-width="160px" style="width: 400px; margin-left:250px;">
        <el-form-item :label="$t('systeminfo.shareTitleYu')">
          <el-input v-model="systeminfoData.shareTitleYu" maxlength="200" :placeholder="$t('systeminfo.editShareTitleYu')" style="width: 380px;" />
        </el-form-item>
        <el-form-item :label="$t('systeminfo.shareImageUrlYu')">
          <el-upload
            v-model="systeminfoData.shareImageUrlYu"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessShareImageUrlYu"
            :before-upload="beforeUploadShareImageUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="systeminfoData.shareImageUrlYu" :src="systeminfoData.httpShareImageUrlYu" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('systeminfo.uploadShareImageText') }}</div>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item :label="$t('systeminfo.shareUrl')" prop="shareUrl">
          <el-input v-model="systeminfoData.shareUrl" :placeholder="$t('systeminfo.editShareUrl')" style="width: 380px;" />
          <el-alert :title="$t('systeminfo.shareUrlTips')" type="info" show-icon style="width: 380px;" />
        </el-form-item> -->
        <el-form-item :label="$t('systeminfo.promoteTutorialYu')">
          <tinymce ref="promoteTutorialYuTinymce" v-model="systeminfoData.promoteTutorialYu" :height="300" :width="600" :placeholder="$t('systeminfo.editPromoteTutorialYu')" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer" style="margin-left:35%">
      <el-button type="primary" icon="el-icon-circle-check" @click="updateSysteminfo()">{{ $t('systeminfo.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { findSysteminfo, updateSysteminfo } from '@/api/systeminfo'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

export default {
  name: 'PromoteTutorial', // 招募设置
  directives: {
    waves
  },
  components: { Tinymce },
  filters: {
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
      imgUrl: `${process.env.VUE_APP_BASE_API}file/systeminfo/upload/share`,
      systeminfoData: {},
      downloadLoading: false
    }
  },
  created() {
    this.getSysteminfo()
  },
  methods: {
    handleSuccessShareImageUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.systeminfoData.shareImageUrl = res.data.url
          this.systeminfoData.httpShareImageUrl = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    beforeUploadShareImageUrl(file) {
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
    handleSuccessShareImageUrlYu(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.systeminfoData.shareImageUrlYu = res.data.url
          this.systeminfoData.httpShareImageUrlYu = res.data.httpUrl
          this.$forceUpdate()
        }, 1000)
      }
    },
    uploadUrl() {
      return this.imgUrl
    },
    getSysteminfo() {
      findSysteminfo().then(response => {
        this.systeminfoData = Object.assign({}, response.data)
        if (!this.systeminfoData.promoteTutorial) {
          this.$refs['promoteTutorialTinymce'].setContent('请输入使用教程（中文）')
        }
        if (!this.systeminfoData.promoteTutorialYu) {
          this.$refs['promoteTutorialYuTinymce'].setContent('请输入使用教程（维文）')
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateSysteminfo() {
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
