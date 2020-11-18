<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="dataForm" class="demo-form-inline">
        <el-form-item :label="$t('userAnalysis.year')">
          <el-date-picker
            v-model="dataForm.yearDateForproduct"
            type="year"
            :placeholder="$t('userAnalysis.chooseYear')"
            value-format="yyyy"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getProductData">{{ $t('userAnalysis.lookup') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column :label="$t('userAnalysis.productId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productid }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.productName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.productImage')" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.productimageurl" style="width:60px;height:60px;">
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.one')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.one | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.two')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.two | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.three')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.three | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.four')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.four | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.five')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.five | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.six')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.six | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.seven')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seven | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.eight')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.eight | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.nine')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nine | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.ten')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ten | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.ele')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ele | amount }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('userAnalysis.tew')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tew | amount }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { statisticProducts } from '@/api/statisticorder'

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
  name: 'UserAnalysis',
  filters: {
    amount(value) {
      if (!value) {
        return 0
      }
      return value
    }
  },
  data() {
    return {
      dataForm: {
        yearDateForproduct: '2019'
      },
      tableData: [],
      listLoading: true,
      statDatas: [
        {
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
        }
      ]
    }
  },
  created() {
    this.getProductData()
  },
  methods: {
    convertNumberString(val) {
      const item = val + ''
      return item.substr(0, 4) + '年'
    },
    getProductData() {
      statisticProducts(this.dataForm.yearDateForproduct)
        .then((res) => {
          this.listLoading = true
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
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped lang="scss">
</style>
