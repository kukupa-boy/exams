<template>
  <div class="app-container">
    <el-form ref="dataForm" :inline="false" :model="systeminfoData" label-position="top" label-width="160px" style="display:flex;justi-content:flex-start;">
      <el-form-item :label="$t('systeminfo.affiliateTutorial')" style="margin:0px 20px;">
        <tinymce ref="affiliateTutorialTinymce" v-model="systeminfoData.affiliateTutorial" :height="300" :width="600" />
      </el-form-item>
      <el-form-item :label="$t('systeminfo.affiliateTutorialYu')" style="margin:0px 20px;">
        <tinymce ref="affiliateTutorialYuTinymce" v-model="systeminfoData.affiliateTutorialYu" :height="300" :width="600" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left:35%; margin-top: 50px;">
      <el-button type="primary" icon="el-icon-circle-check" @click="updateSysteminfo()">{{ $t('systeminfo.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { findSysteminfo, updateSysteminfo } from '@/api/systeminfo'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'AffiliateSetting', // 招募设置
  directives: {
    waves
  },
  components: { Tinymce },
  data() {
    return {
      systeminfoData: {},
      downloadLoading: false
    }
  },
  created() {
    this.getSysteminfo()
  },
  methods: {
    getSysteminfo() {
      findSysteminfo().then(response => {
        this.systeminfoData = Object.assign({}, response.data)
        if (!this.systeminfoData.affiliateTutorial) {
          this.$refs['affiliateTutorialTinymce'].setContent('请输入合作加盟说明（中文）')
        }
        if (!this.systeminfoData.affiliateTutorialYu) {
          this.$refs['affiliateTutorialYuTinymce'].setContent('请输入合作加盟说明（维文）')
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
