<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.orderNum" :placeholder="$t('order.searchByOrderNum')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.id" :placeholder="$t('order.wxUserId')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.productId" :placeholder="$t('order.productId')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.productName" :placeholder="$t('order.productName')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.payStatus" clearable class="filter-item" :placeholder="$t('order.searchByPayStatus')" @keyup.enter.native="handleFilter">
        <el-option v-for="item in payStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="listQueryFilter.dates"
        style="width: 404px;"
        value-format="timestamp"
        clearable
        class="filter-item"
        type="daterange"
        :start-placeholder="$t('order.stimes')"
        :end-placeholder="$t('order.etimes')"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('order.search') }}</el-button>
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
      <!-- <el-table-column :label="$t('order.userName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left">
            <el-form-item :label="$t('order.parentUserId')">
              <span>{{ scope.row.parentUserId ? scope.row.parentUser.id : '' }}</span>
            </el-form-item>
            <el-form-item :label="$t('order.parentUserHeadImg')">
              <img v-if="scope.row.parentUserId > 0" :src="(scope.row.parentUser ? scope.row.parentUser.avatar : '') | imgFilter" width="50" height="50">
            </el-form-item>
            <el-form-item :label="$t('order.parentUserNickName')">
              <span>{{ scope.row.parentUser ? scope.row.parentUser.nickName || '' : '' }}</span>
            </el-form-item>
            <el-form-item :label="$t('order.grandpaUserId')">
              <span>{{ scope.row.grandpaUser ? scope.row.grandpaUser.id : '' }}</span>
            </el-form-item>
            <el-form-item :label="$t('order.grandpaUserHeadImg')">
              <img v-if="scope.row.grandpaUser" :src="(scope.row.grandpaUser ? scope.row.grandpaUser.avatar : '') | imgFilter" width="50" height="50">
            </el-form-item>
            <el-form-item :label="$t('order.grandpaUserNickName')">
              <span>{{ scope.row.grandpaUser ? scope.row.grandpaUser.nickName || '' : '' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.wxUserId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'商品ID'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.productName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.orderNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.wechatNickName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wechatNickName ? scope.row.wechatNickName : $t('order.tourists') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.payStatus')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus | payStatusTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.payMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.payNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.payTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.reason')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reason }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.parentUserId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentUserId && scope.row.parentUserId > 0 ? scope.row.parentUserId : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('order.grandpaUserId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.grandpaUser ? scope.row.grandpaUser.id : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('notify.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.actions')" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.payStatus == 1" type="primary" icon="el-icon-edit" @click="handleSuccessPay(scope.row)">处理为已支付
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getOrderList, orderUpdate } from '@/api/order'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const payStatusOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '待支付' },
  { key: 2, display_name: '已支付' },
  { key: 3, display_name: '已取消' }
]

const payStatusTypeKeyValue = payStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'OrderTable',
  directives: {
    waves
  },
  filters: {
    payStatusTypeFilter(type) {
      return payStatusTypeKeyValue[type]
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
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      payStatusOptions,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: '',
        filter: null
      },
      listQueryFilter: {
        dates: null,
        id: null,
        orderNum: null,
        rechargeTel: null
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(response => {
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
      this.listQuery.page = 1
      this.listQuery.filter = {
        filters: []
      }
      this.listQuery.liker = {
        filters: []
      }
      if (this.listQueryFilter.orderNum) {
        this.listQuery.filter.filters.push({
          field: 'orderNum',
          operater: 'like',
          value: '%' + this.listQueryFilter.orderNum + '%'
        })
      }
      if (this.listQueryFilter.id) {
        this.listQuery.liker.filters.push({
          field: 'id',
          operater: 'like',
          value: '%' + this.listQueryFilter.id + '%'
        })
      }
      if (this.listQueryFilter.productName) {
        this.listQuery.liker.filters.push({
          field: 'productName',
          operater: 'like',
          value: '%' + this.listQueryFilter.productName + '%'
        })
      }
      if (this.listQueryFilter.productId) {
        this.listQuery.liker.filters.push({
          field: 'productId',
          operater: 'like',
          value: '%' + this.listQueryFilter.productId + '%'
        })
      }
      if (this.listQueryFilter.payStatus) {
        this.listQuery.liker.filters.push({
          field: 'payStatus',
          operater: '=',
          value: this.listQueryFilter.payStatus
        })
      }
      if (this.listQueryFilter.dates && this.listQueryFilter.dates.length > 0) {
        this.listQuery.filter.filters.push({
          field: 'createdon',
          operater: '>=',
          value: this.listQueryFilter.dates[0]
        },
        {
          field: 'createdon',
          operater: '<',
          value: this.listQueryFilter.dates[1]
        })
      }
      console.log(this.listQuery.filter)
      console.log(this.listQuery.liker)
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
    handleSuccessPay(row) {
      this.$prompt('请输入第三方流水号', '处理订单' + row.id + '为已支付', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{2,50}$/,
        inputErrorMessage: '流水号不能为空，且不能超过50字'
      }).then(({ value }) => {
        const model = {
          orderid: row.id,
          tradeId: value
        }
        orderUpdate(model).then(response => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.handleFilter()
        })
      }).catch(() => {
        // 取消切换
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
