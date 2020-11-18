<template>
  <div class="app-container">
    <el-form ref="dataForm" :inline="false" :rules="rules" :model="systeminfoData" label-position="right" label-width="160px" style="width: 400px; margin-left:50px;">
      <el-form-item :label="$t('systeminfo.minMoney')" prop="minMoney">
        <el-input v-model="systeminfoData.minMoney" :placeholder="$t('systeminfo.editMinMoney')">
          <template slot="append">{{ $t('systeminfo.mon') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.withdrawalReview')">
        <el-select v-model="systeminfoData.withdrawalReview" class="filter-item" :placeholder="$t('systeminfo.editWithdrawalReview')" style="width: 240px;">
          <el-option v-for="item in withdrawalReviewOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.limitWithdrawalMoney')" prop="withdrawPerDay">
        <el-input v-model="systeminfoData.limitWithdrawalMoney" :placeholder="$t('systeminfo.editlimitWithdrawalMoney')">
          <template slot="append">{{ $t('systeminfo.mon') }}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('systeminfo.withdrawPerDay')" prop="withdrawPerDay">
        <el-input v-model="systeminfoData.withdrawPerDay" :placeholder="$t('systeminfo.editwithdrawPerDay')" />
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

const withdrawalReviewOptions = [
  { key: false, display_name: '否' },
  { key: true, display_name: '是' }
]

export default {
  name: 'Withdrawal', // 提现设置
  directives: {
    waves
  },
  data() {
    var validMoney = (rule, value, callback) => {
      const valid_money = /^0\.([1-9]|\d[1-9])$|^[0]$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
      if (!valid_money.test(value)) {
        return callback(new Error('请输入正确的金额'))
      }
      return callback()
    }
    return {
      withdrawalReviewOptions,
      systeminfoData: {},
      rules: {
        minMoney: [{ validator: validMoney, trigger: 'blur' }]
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
        // 默认值
        if (this.systeminfoData.minMoney === null) {
          this.systeminfoData.minMoney = 0
        }
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
