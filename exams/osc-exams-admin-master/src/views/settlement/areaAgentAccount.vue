<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQueryFilter" class="demo-form-inline">
        <el-form-item label="ID">
          <el-input v-model="listQueryFilter.id" :placeholder="'用户ID'" style="width: 200px;" class="filter-item" />
        </el-form-item>
        <el-form-item label="年月">
          <el-date-picker
            v-model="listQueryFilter.yearmonth"
            type="month"
            placeholder="选择日期"
            value-format="yyyyMM"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterS">{{ $t('usercapital.search') }}</el-button>
        </el-form-item>
      </el-form>
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
      <el-table-column :label="'用户ID'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户名'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户头像'" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.user.avatar | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="'结算金额'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'结算类型'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.capitalType | capitalTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'结算状态'" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.settleStatus == 0" type="danger">{{ scope.row.settleStatus | settlestatusFilter }}</el-tag>
          <el-tag v-if="scope.row.settleStatus == 1" type="success">{{ scope.row.settleStatus | settlestatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'结算年月'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yearmonth }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center">
        <template slot-scope="scope">
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="handleFindDetail(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="90vw"
      top="5vh"
    >
      <el-pagination :current-page="listQueryDetail.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryDetail.limit" :total="totalDetail" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeDetailChange" @current-change="handleCurrentDetailChange" />
      <div class="pagination-container" />
      <el-table
        :key="tabledeailKey"
        v-loading="listDetailLoading"
        :data="listDetail"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column :label="'用户ID'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.userId }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'用户名'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.user.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'用户头像'" align="center">
          <template slot-scope="scope1">
            <img :src="scope1.row.user.avatar | imgFilter" width="50" height="50">
          </template>
        </el-table-column>
        <el-table-column :label="'订单id'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'订单号'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'金额'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'实际金额'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.actualMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'支付状态'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.payStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'类型'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.capitalType | capitalTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'第三方流水'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.capitalNum }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'结算状态'" align="center">
          <template slot-scope="scope1">
            <el-tag v-if="scope1.row.settleStatus == 0" type="danger">{{ scope1.row.settleStatus | settlestatusFilter }}</el-tag>
            <el-tag v-if="scope1.row.settleStatus == 1" type="success">{{ scope1.row.settleStatus | settlestatusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="'描述'" align="center">
          <template slot-scope="scope1">
            <span>{{ scope1.row.descrip }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page="listQueryDetail.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryDetail.limit" :total="totalDetail" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeDetailChange" @current-change="handleCurrentDetailChange" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { settlementAgent, settlementAgentDetail } from '@/api/settlement'
import waves from '@/directive/waves' // 水波纹指令

const capitalTypeOptions = [
  { key: '0', display_name: '未知' },
  { key: '1', display_name: '现金流水' },
  { key: '2', display_name: '推广佣金' },
  { key: '3', display_name: '提现成功' },
  { key: '4', display_name: '提现失败' },
  { key: '5', display_name: '视频创作佣金' },
  { key: '6', display_name: '朋友代付' },
  { key: '7', display_name: '区域代理佣金' },
  { key: '8', display_name: '间接推广佣金' },
  { key: '9', display_name: '超时佣金作废' }
]

const settlestatusOptions = [
  { key: '0', display_name: '待结算' },
  { key: '1', display_name: '已结算' }
]

const capitalTypeKeyValue = capitalTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const settlestatusKeyValue = settlestatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserCapitalList',
  directives: {
    waves
  },
  filters: {
    imgFilter(v) {
      if (v) {
        return v
      }
      return v
    },
    capitalTypeFilter(type) {
      return capitalTypeKeyValue[type]
    },
    settlestatusFilter(type) {
      return settlestatusKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      tabledeailKey: 0,
      list: null,
      listDetail: null,
      total: null,
      totalDetail: null,
      listLoading: true,
      listDetailLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: '',
        filter: {
          filters: []
        }
      },
      listQueryDetail: {
        page: 1,
        pageSize: 10
      },
      listQueryDeailFilter: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listDetailValue: {
        yearmonth: '',
        userId: ''
      },
      listQueryFilter: {
        capitalType: null,
        payStatus: null,
        dates: null
      },
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 取到路由带过来的参数
    getListDetail() {
      this.listDetailLoading = true
      settlementAgentDetail(this.listDetailValue.yearmonth, this.listDetailValue.userId, this.listQueryDeailFilter)
        .then((res) => {
          this.listDetail = res.data.items
          this.totalDetail = res.data.total
          setTimeout(() => {
            this.listDetailLoading = false
          }, 1.5 * 1000)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getList() {
      this.listLoading = true
      settlementAgent(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeDetailChange(val) {
      this.listQueryDetail.pageSize = val
      this.getListDetail()
    },
    handleCurrentDetailChange(val) {
      this.listQueryDetail.page = val
      this.getListDetail()
    },
    handleFilterS() {
      this.listQuery.page = 1
      this.listQuery.filter.filters = []
      if (this.listQueryFilter.id) {
        this.listQuery.filter.filters.push({
          field: 'userId',
          operater: '=',
          value: this.listQueryFilter.id
        })
      }
      if (this.listQueryFilter.yearmonth) {
        this.listQuery.filter.filters.push({
          field: 'yearmonth',
          operater: '=',
          value: this.listQueryFilter.yearmonth
        })
      }
      this.getList()
    },
    handleFindDetail(value) {
      this.dialogVisible = true
      this.listDetailValue.yearmonth = value.yearmonth
      this.listDetailValue.userId = value.userId
      this.getListDetail()
    }
  }
}
</script>
