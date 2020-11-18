<template>
  <div class="app-container">
    <el-form ref="dataForm" :inline="false" :rules="rules" :model="systeminfoData" label-position="right" label-width="160px" style="width: 400px; margin-left:50px;">
      <el-form-item :label="$t('systeminfo.agentCommission')" prop="agentCommissionShow">
        <el-input v-model="systeminfoData.agentCommissionShow" :placeholder="$t('systeminfo.editAgentCommission')">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.videoCreatorCommission')" prop="videoCreatorCommissionShow">
        <el-input v-model="systeminfoData.videoCreatorCommissionShow" :placeholder="$t('systeminfo.editVideoCreatorCommission')">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.snatchUser')">
        <el-switch v-model="systeminfoData.snatchUser" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left:18%">
      <el-button type="primary" icon="el-icon-circle-check" @click="updateSysteminfo()">{{ $t('systeminfo.confirm') }}</el-button>
    </div>
  </div>
</template>
<script>
import { findSysteminfo, updateSysteminfo } from '@/api/systeminfo'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'Commission', // 佣金设置
  directives: {
    waves
  },
  data() {
    var validPromote = (rule, value, callback) => {
      const valid = /^\d+$/
      if (!valid.test(value) || parseInt(value) > 100) {
        return callback(new Error('请输入正确的提成比例'))
      }
      return callback()
    }
    return {
      systeminfoData: {},
      rules: {
        agentCommissionShow: [{ validator: validPromote, trigger: 'blur' }],
        videoCreatorCommissionShow: [{ validator: validPromote, trigger: 'blur' }]
      },
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
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateSysteminfo() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.systeminfoData)
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
