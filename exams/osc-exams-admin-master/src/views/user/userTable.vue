<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('user.searchById')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.wechatNickName" :placeholder="$t('user.searchBywechatNickName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.promoter" clearable class="filter-item" :placeholder="$t('user.searchByPromoter')">
        <el-option v-for="item in promoterOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.spended" clearable class="filter-item" :placeholder="$t('user.searchBySpend')">
        <el-option v-for="item in promoterOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-date-picker
        v-model="listQueryFilter.dates"
        value-format="timestamp"
        class="filter-item"
        clearable
        type="daterange"
        range-separator="-"
        :start-placeholder="$t('user.startDate')"
        :end-placeholder="$t('user.endDate')"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('user.search') }}</el-button>
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
      <el-table-column :label="$t('user.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.account')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.nickName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.tel')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.avatar')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.banlace')" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.balance">{{ scope.row.balance.balance }}</span>
          <span v-if="!(scope.row.balance)">0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.spendamount')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.spendamount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.commisamount')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.commisamount || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.parentUserId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.parentUserEndTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parentUserEndTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.promoter')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.promoter | promoterFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.usertype')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usertype | userTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.isForbid')" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.forbidden"
            active-color="#13ce66"
            inactive-color="lightgray"
            :active-value="true"
            :inactive-value="false"
            @change="handleSwitch($event,scope.row,scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.actions')" align="center" class-name="small-padding fixed-width" width="380px">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            :title="$t('user.findUserLogs')"
            width="400px"
            style="height: 300px;"
            trigger="click"
          >
            <div v-infinite-scroll="load" infinite-scroll-disabled="discroll" style="overflow:auto; width:400px; height:300px">
              <el-timeline :reverse="true">
                <el-timeline-item
                  v-for="(activity, index) in arr"
                  :key="index"
                  :timestamp="activity.createdon | parseTime('{y}-{m}-{d} {h}:{i}')"
                >
                  {{ activity.content }}
                </el-timeline-item>
              </el-timeline>
              <el-divider v-if="loading" content-position="center">{{ $t('user.loading') }}</el-divider>
              <el-divider v-if="noMore" content-position="center">{{ $t('user.noMore') }}</el-divider>
            </div>
            <el-button slot="reference" size="mini" style="width: 74px;" type="primary" icon="el-icon-arrow-up" @click="handleFindLogs(scope.row)">{{ $t('user.findUserLogs') }}</el-button>
          </el-popover>
          <!-- <el-button size="mini" style="width: 74px;" type="primary" icon="el-icon-arrow-up" @click="handleFindLogs(scope.row)">{{ $t('user.findUserLogs') }}</el-button> -->
          <el-button size="mini" style="width: 74px;" type="primary" icon="el-icon-arrow-up" @click="handleFindUserFavorites(scope.row)">{{ $t('user.findUserFavorites') }}</el-button>
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="handleFindUsercapital(scope.row)">{{ $t('user.findUsercapital') }}</el-button>
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="handleFindUserShares(scope.row)">{{ $t('user.findUserShares') }}</el-button>
          <div style="padding-top:10px">
            <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="handleFindUserType(scope.row)">{{ $t('user.changeType') }}</el-button>
            <el-dialog
              :title="$t('user.changeUserType')"
              :visible.sync="userTypeDialogVisible"
              width="30%"
              style="text-align:left"
              min-width="320px"
            >
              <el-form ref="form" label-position="left" :model="changeUserTypeinfo" label-width="120px" style="width:300px;margin:0 auto">
                <el-form-item :label="$t('user.id')">
                  <span>{{ changeUserTypeinfo.id }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.nickName')">
                  <span>{{ changeUserTypeinfo.nickName }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.tel')">
                  <span>{{ changeUserTypeinfo.tel }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.usertype')">
                  <el-select v-model="changeUserTypeinfo.usertype" value="12345" placeholder="请选择用户类型" style="max-width: 240px;">
                    <el-option v-for="item in userTypeOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="userTypeDialogVisible = false">{{ $t('user.cancel') }}</el-button>
                <el-button type="primary" @click="changeUserType">{{ $t('user.confirm') }}</el-button>
              </span>
            </el-dialog>
            <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="handleFindUserCapital(scope.row)">{{ $t('user.changeCapitor') }}</el-button>
            <el-dialog
              :title="$t('user.changeUserCapitor')"
              :visible.sync="userCapitalDialogVisible"
              width="30%"
              min-width="320px"
              style="text-align:left"
            >
              <el-form ref="form" :model="changeUserCapitalinfo" label-position="left" label-width="120px" style="width:300px;margin:0 auto;">
                <el-form-item :label="$t('user.id')">
                  <span>{{ changeUserCapitalinfo.id }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.nickName')">
                  <span>{{ changeUserCapitalinfo.nickName }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.tel')">
                  <span>{{ changeUserCapitalinfo.tel }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.userPreviousId')">
                  <el-input v-model="changeUserCapitalinfo.parentid" :placeholder="$t('user.inputUserCapitorId')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="userCapitalDialogVisible = false">{{ $t('user.cancel') }}</el-button>
                <el-button type="primary" @click="changeUserCaptial">{{ $t('user.confirm') }}</el-button>
              </span>
            </el-dialog>
            <el-button v-if="isManage(scope.row)" size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="handleFindUserAgentArea(scope.row)"> {{ $t('user.changeArea') }} </el-button>
            <el-dialog
              :title="$t('user.changeAreaAngel')"
              :visible.sync="userAgentAreaDialogVisible"
              width="30%"
              min-width="320px"
              style="text-align:left"
            >
              <el-form ref="form" :model="changeuserAgentAreainfo" label-position="left" label-width="120px" style="width:300px;margin:0 auto">
                <el-form-item :label="$t('user.id')">
                  <span>{{ changeuserAgentAreainfo.id }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.nickName')">
                  <span>{{ changeuserAgentAreainfo.nickName }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.tel')">
                  <span>{{ changeuserAgentAreainfo.tel }}</span>
                </el-form-item>
                <el-form-item :label="$t('user.chooseArea')">
                  <el-select
                    v-model="cityListConfirm.selectValue"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="$t('user.writeCityName')"
                    :remote-method="remoteMethod"
                    :loading="cityLoading"
                  >
                    <el-option
                      v-for="item in cityListConfirm.itemValue"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="userAgentAreaDialogVisible = false">{{ $t('user.cancel') }}</el-button>
                <el-button type="primary" @click="changeuserAgentArea">{{ $t('user.confirm') }}</el-button>
              </span>
            </el-dialog>
            <el-button v-if="scope.row.usertype==1 || scope.row.usertype==2" size="mini" style="width: 86px;" type="primary" icon="el-icon-arrow-up" @click="showAmountLine(scope.row)">统计分析</el-button>
            <el-dialog
              :title="dataForm.type===2?$t('user.agentSalary'):$t('user.coacherSalary')"
              :visible.sync="userCoacherAgentDialogVisible"
              width="70%"
              min-width="320px"
              style="text-align:left"
            >
              <div class="filter-container">
                <el-form :inline="true" :model="dataForm" label-position="left" class="demo-form-inline" style="width:400px;">
                  <el-form-item :label="$t('userAnalysis.year')">
                    <el-date-picker
                      v-model="dataForm.yearCoacherAgentDate"
                      type="year"
                      :placeholder="$t('userAnalysis.chooseYear')"
                      value-format="yyyy"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="changeCoacherAgentData">{{ $t('userAnalysis.lookup') }}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="components-container">
                <el-table
                  v-loading="listLoading"
                  :data="tableData"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column :label="$t('userAnalysis.productId')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.productid }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.productName')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.productname }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.productImage')" align="center">
                    <template slot-scope="scope1">
                      <img :src="scope1.row.productimageurl" style="width:60px;height:60px;">
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.one')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.one | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.two')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.two | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.three')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.three | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.four')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.four | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.five')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.five | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.six')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.six | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.seven')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.seven | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.eight')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.eight | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.nine')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.nine | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.ten')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.ten | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.ele')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.ele | amount }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('userAnalysis.tew')" align="center">
                    <template slot-scope="scope1">
                      <span>{{ scope1.row.tew | amount }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-dialog>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getUserList, getUserIdPage, userChangeType, userChangeParent, userChangeAgentArea, userForbidden } from '@/api/user'
import { statisticProductsAgent, statisticProductsCoacher } from '@/api/statisticorder'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { cityPage } from '@/api/city'

const promoterOptions = [
  { key: false, display_name: '否' },
  { key: true, display_name: '是' }
]
const userTypeOptions = [
  { key: 0, display_name: '学员' },
  { key: 1, display_name: '教练' },
  { key: 2, display_name: '经理' }
]
// arr to obj ,such as { CN : "China", US : "USA" }
const promoterKeyValue = promoterOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const userTypeKeyValue = userTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const monthFilter = {
  0: 'one',
  1: 'two',
  2: 'three',
  3: 'four',
  4: 'five',
  5: 'six',
  6: 'seven',
  7: 'eight',
  8: 'nine',
  9: 'ten',
  10: 'ele',
  11: 'tew'
}
export default {
  name: 'UserTable',
  directives: {
    waves
  },
  filters: {
    promoterFilter(type) {
      return promoterKeyValue[type]
    },
    imgFilter(v) {
      if (v) {
        return v
      }
      return v
    },
    numToBoolean(v) {
      if (parseInt(v) === 0 || parseInt(v) === 1) {
        return false
      } else if (parseInt(v) === 2) {
        return true
      }
    },
    userTypeFilter(v) {
      return userTypeKeyValue[v]
    },
    amount(value) {
      if (!value) {
        return 0
      }
      return value
    },
    cityIdToCityName(value) {

    }
  },
  data() {
    return {
      inputItem: 0,
      tableKey: 0,
      arr: [],
      count: 0,
      loading: false,
      page: 1,
      discroll: false,
      damal: null,
      noMore: false,
      list: null,
      total: null,
      listLoading: true,
      PopShow: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listQueryFilter: {
        id: null,
        wechatNickName: null,
        level: null,
        dates: []
      },
      downloadLoading: false,
      dialogFormVisible: false,
      rules: {},
      userTypeDialogVisible: false,
      changeUserTypeinfo: {},
      userCapitalDialogVisible: false,
      changeUserCapitalinfo: {},
      userAgentAreaDialogVisible: false,
      changeuserAgentAreainfo: {},
      cityList: { // 获取城市列表提交
        page: 1,
        pageSize: 10,
        filter: {}
      },
      cityListConfirm: {
        selectValue: [], // 选择的城市
        itemValue: [] // 渲染的列表
      },
      cityLoading: false,
      dataForm: {
        yearCoacherAgentDate: '2019',
        id: '',
        type: ''
      },
      statDatas: [{
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 1,
        year: 2019
      },
      {
        items: [
          { productid: '6', productimageurl: '6', productname: '商品6', salesmoney: '6666' },
          { productid: '7', productimageurl: '7', productname: '商品7', salesmoney: '7777' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 2,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '6', productimageurl: '6', productname: '商品6', salesmoney: '6666' },
          { productid: '7', productimageurl: '7', productname: '商品7', salesmoney: '7777' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 3,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '6', productimageurl: '6', productname: '商品6', salesmoney: '6666' },
          { productid: '7', productimageurl: '7', productname: '商品7', salesmoney: '7777' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 4,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '6', productimageurl: '6', productname: '商品6', salesmoney: '6666' },
          { productid: '7', productimageurl: '7', productname: '商品7', salesmoney: '7777' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 5,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 6,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' }
        ],
        month: 7,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' }
        ],
        month: 8,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' }
        ],
        month: 9,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 10,
        year: 2019
      },
      {
        items: [
          { productid: '1', productimageurl: '1', productname: '商品1', salesmoney: '1111' },
          { productid: '2', productimageurl: '2', productname: '商品2', salesmoney: '2222' },
          { productid: '3', productimageurl: '3', productname: '商品3', salesmoney: '3333' },
          { productid: '4', productimageurl: '4', productname: '商品4', salesmoney: '4444' },
          { productid: '5', productimageurl: '5', productname: '商品5', salesmoney: '5555' }
        ],
        month: 11,
        year: 2019
      },
      {
        items: [
        ],
        month: 12,
        year: 2019
      }],
      tableData: [],
      coacherAgentTable: '',
      coacherAgentTableLoading: true,
      userCoacherAgentDialogVisible: false
    }
  },
  computed: {
    isManage() {
      return (value) => {
        if (value.usertype === 2) {
          return true
        }
        return false
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    load() {
      this.loading = true
      setTimeout(() => {
        this.page += 1
        this.getData()
        this.loading = false
      }, 1000)
      this.discroll = true
    },
    selectChange() {
      this.$forceUpdate()
    },
    promoterOptionsFilter() {
      return promoterOptions
    },
    userTypeOptionsFilter() {
      return userTypeOptions
    },
    handleFindUserShares(row) {
      this.$router.push({
        name: 'UserShareList',
        query: {
          parentUserId: row.id
        }
      })
    },
    handleFindUserFavorites(row) {
      // 带参数跳转userFavoritesList
      this.$router.push({
        name: 'UserFavoritesList',
        query: {
          userId: row.id
        }
      })
    },
    handleFindUsercapital(row) {
      // 带参数跳转userFavoritesList
      this.$router.push({
        name: 'UserCapitalList',
        query: {
          userId: row.id
        }
      })
    },
    handleFindLogs(row) {
      this.damal = row
      this.loading = true
      this.noMore = false
      this.discroll = this.loading || this.noMore
      this.arr = []
      this.page = 1
      this.getData()
    },
    getData() {
      getUserIdPage(this.damal.id, this.page, {}).then(response => {
        if (response.code === 0 && response.data && response.data.length > 0) {
          for (var i = 0; i < response.data.length; i++) {
            this.arr.push(response.data[i])
          }
          this.noMore = false
          this.discroll = false
        } else {
          this.noMore = true
          this.discroll = true
          this.loading = false
        }
      })
    },
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
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
      if (this.listQueryFilter.id) {
        this.listQuery.filter.filters.push({
          field: 'id',
          operater: 'like',
          value: '%' + this.listQueryFilter.id + '%'
        })
      }
      if (this.listQueryFilter.wechatNickName) {
        this.listQuery.filter.filters.push({
          field: 'nickname',
          operater: 'like',
          value: '%' + this.listQueryFilter.wechatNickName + '%'
        })
      }
      if (this.listQueryFilter.promoter) {
        this.listQuery.filter.filters.push({
          field: 'promoter',
          operater: '=',
          value: this.listQueryFilter.promoter
        })
      }
      if (this.listQueryFilter.spended) {
        this.listQuery.filter.filters.push({
          field: 'spendamount',
          operater: '>',
          value: 0
        })
      }
      if (this.listQueryFilter.dates && this.listQueryFilter.dates.length > 0) {
        this.listQuery.filter.filters.push({
          field: 'createdOn',
          operater: '>=',
          value: this.listQueryFilter.dates[0]
        },
        {
          field: 'createdOn',
          operater: '<',
          value: this.listQueryFilter.dates[1]
        })
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
    },
    // 打开用户类型对话框
    handleFindUserType(row) {
      this.changeUserTypeinfo = Object.assign({}, row)
      this.userTypeDialogVisible = true
    },
    changeUserType() {
      const model = {
        userid: this.changeUserTypeinfo.id,
        type: this.changeUserTypeinfo.usertype
      }
      userChangeType(model)
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '变更成功',
            type: 'success',
            duration: 2000
          })
          this.userTypeDialogVisible = false
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
      // this.userTypeDialogVisible = false
    },
    handleFindUserCapital(row) {
      this.changeUserCapitalinfo = Object.assign({}, row)
      this.userCapitalDialogVisible = true
    },
    changeUserCaptial() {
      const model = {
        userid: this.changeUserCapitalinfo.id,
        parentid: this.changeUserCapitalinfo.parentid
      }
      userChangeParent(model)
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '变更成功',
            type: 'success',
            duration: 2000
          })
          this.userCapitalDialogVisible = false
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleFindUserAgentArea(row) {
      this.changeuserAgentAreainfo = Object.assign({}, row)
      var citys = []
      if (this.changeuserAgentAreainfo.cityids && row.citynames) {
        var oldcitys = this.changeuserAgentAreainfo.cityids.split(',')
        if (oldcitys && oldcitys.length > 0 && row.citynames.length > 0) {
          for (var i = 0; i < row.citynames.length; ++i) {
            const cityname = row.citynames[i]
            citys.push({
              id: oldcitys[i],
              name: cityname
            })
          }
          this.cityListConfirm.itemValue = citys
          this.cityListConfirm.selectValue = oldcitys
        }
      }
      this.userAgentAreaDialogVisible = true
    },
    remoteMethod(query) {
      this.cityList.filter = {
        filters: []
      }
      this.cityList.filter.filters.push({
        field: 'name',
        operater: 'like',
        value: '%' + query + '%'
      })
      if (query !== '') {
        this.cityLoading = true
        cityPage(this.cityList)
          .then((res) => {
            if (res) {
              this.cityLoading = false
              this.cityListConfirm.itemValue = res.data.items
            }
          })
          .catch((err) => { console.log(err) })
      } else {
        this.cityListConfirm.itemValue = []
      }
    },
    changeuserAgentArea() {
      const model = {
        cityids: this.cityListConfirm.selectValue,
        userid: this.changeuserAgentAreainfo.id
      }
      userChangeAgentArea(model).then((data) => {
        this.$notify({
          title: '成功',
          message: '变更成功',
          type: 'success',
          duration: 2000
        })
        this.userAgentAreaDialogVisible = false
        this.getList()
      })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSwitch(event, value, index) {
      const userId = value.id
      this.$confirm(this.list[index].forbidden ? '确定将该用户设置为黑名单吗?' : '确定将该用户从黑名单移除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        userForbidden(userId).then((res) => {
          this.$notify({
            title: '成功',
            message: '变更成功',
            type: 'success',
            duration: 2000
          })
        })
          .catch((err) => {
            console.log(err)
          })
      }).catch(() => {
        this.list[index].forbidden = !this.list[index].forbidden
        this.$message({
          type: 'info',
          message: '已取消黑名单炒作'
        })
      })
    },
    showAmountLine(value) {
      this.dataForm.id = value.id
      this.userCoacherAgentDialogVisible = true
      this.dataForm.type = value.usertype
      this.getLineData()
    },
    convertNumberString(val) {
      const item = val + ''
      return item + '月'
    },
    changeDataStructrue(res) {
      this.coacherAgentTableLoading = true
      this.statDatas = res.data
      let id = []
      // 对新的结构进行附加值
      this.tableData = []
      // 筛选出主要的商品
      for (let i = 0; i < this.statDatas.length; i++) {
        for (let j = 0; j < this.statDatas[i].items.length; j++) {
          id.push(this.statDatas[i].items[j].productid)
        }
      }
      id = Array.from(new Set(id))
      for (let i = 0; i < id.length; i++) {
        this.tableData.push({ productid: id[i] })
      }
      for (let i = 0; i < this.statDatas.length; i++) {
        for (let j = 0; j < this.statDatas[i].items.length; j++) {
          for (let k = 0; k < id.length; k++) {
            if (this.statDatas[i].items[j].productid === this.tableData[k].productid) {
              this.tableData[k][monthFilter[i]] = this.statDatas[i].items[j].salesmoney
              this.tableData[k].productimageurl = this.statDatas[i].items[j].productimageurl
              this.tableData[k].productname = this.statDatas[i].items[j].productname
            }
          }
        }
      }
      this.coacherAgentTableLoading = false
    },
    getLineData() {
      if (this.dataForm.type === 2) {
        statisticProductsAgent(this.dataForm.yearCoacherAgentDate, this.dataForm.id)
          .then((res) => {
            this.changeDataStructrue(res)
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (this.dataForm.type === 1) {
        statisticProductsCoacher(this.dataForm.yearCoacherAgentDate, this.dataForm.id)
          .then((res) => {
            this.changeDataStructrue(res)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    changeCoacherAgentData() {
      this.getLineData()
    }
  }
}
</script>
