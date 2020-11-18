<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.id" :placeholder="$t('activities.searchById')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.name" :placeholder="$t('activities.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('activities.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('activities.add') }}</el-button>
    </div>
    <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <div class="pagination-container" />
    <!-- table -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column :label="$t('activities.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.discountPrice')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discountPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.discountRate')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discountRateShow + '%' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.discountType')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.discountType | discountTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.startTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.endTime')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.status')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('activities.actions')" align="center" class-name="small-padding fixed-width" width="350px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('activities.edit') }}
          </el-button>
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-edit" @click="handleUpdateActivityProduct(scope.row)">{{ $t('activities.updateActivityProduct') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('activities.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- insert -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="760px">
      <el-form ref="dataForm" :rules="rules" :model="tempActivities" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('activities.id')">
          <span>{{ tempActivities.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('activities.name')" prop="name">
          <el-input v-model="tempActivities.name" :placeholder="$t('activities.editName')" maxlength="60" style="width: 380px;" />
        </el-form-item>
        <el-form-item :label="$t('activities.discountPrice')" prop="discountPrice">
          <el-input v-model="tempActivities.discountPrice" :placeholder="$t('activities.editDiscountPrice')" maxlength="20" style="width: 380px;" />
        </el-form-item>
        <el-form-item :label="$t('activities.discountRate')" prop="discountRateShow">
          <el-input v-model="tempActivities.discountRateShow" :placeholder="$t('activities.editDiscountRate')" maxlength="20" style="width: 380px;">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('activities.discountType')" prop="discountType">
          <el-select v-model="tempActivities.discountType" class="filter-item" :placeholder="$t('activities.editDiscountType')" style="width: 380px;">
            <el-option v-for="item in discountTypeOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('activities.timezone')" prop="tempTimes">
          <el-date-picker
            v-model="tempActivities.tempTimes"
            class="filter-item"
            clearable
            type="datetimerange"
            range-separator="-"
            :start-placeholder="$t('activities.startTime')"
            :end-placeholder="$t('activities.endTime')"
            style="width: 380px;"
          />
        </el-form-item>
        <el-form-item :label="$t('activities.status')" prop="status">
          <el-select v-model="tempActivities.status" clearable class="filter-item" :placeholder="$t('activities.editStatus')" style="width: 380px;">
            <el-option v-for="item in statusOptionsFilter()" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('activities.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('activities.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('activities.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('activities.updateActivityProduct')" :visible.sync="dialogActivityProductFormVisible" width="1300px">
      <el-form ref="ActivityProductDataForm" :rules="rules" :model="tempActivityProduct" label-position="left" label-width="120px" style="width: 85%; margin-left:100px;">
        <el-form-item :label="$t('activities.activitiesId')">
          <span>{{ tempActivityProduct.activitiesId }}</span>
        </el-form-item>
        <div align="center"><span><h4>{{ $t('activities.productList') }}</h4></span></div>
        <el-pagination :current-page="productListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="productListQuery.limit" :total="productTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleProductSizeChange" @current-change="handleProductCurrentChange" />
        <div class="pagination-container" />
        <el-table
          ref="productTable"
          :key="productTableKey"
          v-loading="productListLoading"
          :data="productList"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column :label="$t('product.name')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('product.coverUrl')" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.httpCoverUrl | imgFilter" width="50" height="50">
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination :current-page="productListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="productListQuery.limit" :total="productTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleProductSizeChange" @current-change="handleProductCurrentChange" />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogActivityProductFormVisible = false">{{ $t('activities.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateActivityProductData">{{ $t('activities.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getActivitiesList, addActivities, deleteActivitiesById, updateActivities, findActivityProductList, updateActivityProducts } from '@/api/activities'
import { productActivitiesPage } from '@/api/product'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const statusOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '启用' },
  { key: 2, display_name: '停用' }
]
const discountTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '固定价格' },
  { key: 2, display_name: '折扣率' }
]
const videoTypeOptions = [
  { key: 0, display_name: '未知' },
  { key: 1, display_name: '文件播放' },
  { key: 2, display_name: '点播播放' }
]

const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const discountTypeKeyValue = discountTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const videoTypeKeyValue = videoTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

var validMoney = (rule, value, callback) => {
  const valid_money = /^0\.([1-9]|\d[1-9])$|^[0]$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
  if (!valid_money.test(value)) {
    return callback(new Error('请输入正确的金额'))
  }
  return callback()
}
var validPromote = (rule, value, callback) => {
  const valid = /^\d+$/
  if (!valid.test(value) || parseInt(value) > 100) {
    return callback(new Error('请输入正确的提成比例'))
  }
  return callback()
}

export default {
  name: 'ActivitiesTable',
  directives: {
    waves
  },
  filters: {
    statusFilter(type) {
      return statusKeyValue[type]
    },
    discountTypeFilter(type) {
      return discountTypeKeyValue[type]
    },
    videoTypeFilter(type) {
      return videoTypeKeyValue[type]
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
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      productListQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listQueryFilter: {
        id: null,
        name: null
      },
      tempActivities: {
        id: null,
        cityId: null,
        name: null
      },
      tempActivityProduct: {
        activitiesId: null,
        productIds: [], // 所有活动商品的，商品id
        pageProductIds: [], // 当前页所有活动商品的，商品id
        updateProducts: [{ // 需要添加或者删除的活动商品，有id则删除，无id添加
          id: null,
          productId: null,
          activitiesId: null
        }],
        products: [{ // 所有活动商品
          id: null,
          productId: null,
          activitiesId: null
        }],
        pageProducts: [{ // 当前页所有活动商品
          id: null,
          productId: null,
          activitiesId: null
        }]
      },
      productTotal: null,
      productTableKey: 0,
      productList: null,
      productListLoading: true,
      dialogActivityProductFormVisible: false,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑活动',
        create: '新增活动'
      },
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入考场名称', trigger: 'blur' }],
        discountPrice: [{ validator: validMoney, trigger: 'blur' }],
        discountRateShow: [{ validator: validPromote, trigger: 'blur' }],
        discountType: [{ required: true, message: '请选择折扣类型', trigger: 'change' }],
        tempTimes: [{ type: 'array', required: true, message: '请选择活动时间区间', trigger: 'change' }],
        status: [{ required: true, message: '请选择活动状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    statusOptionsFilter() {
      return statusOptions.slice(1, statusOptions.length)
    },
    discountTypeOptionsFilter() {
      return discountTypeOptions.slice(1, discountTypeOptions.length)
    },
    handleFindActivityProduct() {
      findActivityProductList()
      updateActivityProducts()
    },
    updateActivityProductData(row) {
      this.$refs['ActivityProductDataForm'].validate((valid) => {
        if (valid) {
          if (this.$refs.productTable.selection && this.$refs.productTable.selection.length > 0) {
            // 添加
            var flag = true
            for (var i = 0; i < this.$refs.productTable.selection.length; i++) {
              flag = true
              for (var item of this.tempActivityProduct.pageProductIds) {
                if (item === this.$refs.productTable.selection[i].id) {
                  flag = false
                  break
                }
              }
              // 添加
              if (flag) {
                this.tempActivityProduct.updateProducts.push({
                  productId: this.$refs.productTable.selection[i].id,
                  activitiesId: this.tempActivityProduct.activitiesId
                })
              }
            }
            // 删除
            flag = true
            for (var n = 0; n < this.tempActivityProduct.pageProducts.length; n++) {
              flag = true
              for (var m = 0; m < this.$refs.productTable.selection.length; m++) {
                if (this.tempActivityProduct.pageProducts[n].productId === this.$refs.productTable.selection[m].id) {
                  flag = false
                  break
                }
              }
              // 删除
              if (flag) {
                this.tempActivityProduct.updateProducts.push({
                  id: this.tempActivityProduct.pageProducts[n].id,
                  productId: null,
                  activitiesId: null
                })
              }
            }
          }
          console.log(this.tempActivityProduct)
          // 更新活动商品
          updateActivityProducts(this.tempActivityProduct.updateProducts).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.initTempActivityProduct(this.tempActivityProduct.activitiesId)
              // this.dialogFormVisible = false
              // this.dialogActivityProductFormVisible = false
              this.getList()
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
    initTempActivityProduct(_activitiesId) {
      this.tempActivityProduct = {
        activitiesId: _activitiesId,
        productIds: [], // 所有活动商品的，商品id
        pageProductIds: [], // 当前页所有活动商品的，商品id
        updateProducts: [], // 需要添加或者删除的活动商品，有id则删除，无id添加
        products: [], // 所有活动商品
        pageProducts: [] // 当前页所有活动商品
      }
      // 活动商品
      findActivityProductList(_activitiesId).then(response => {
        this.tempActivityProduct.products = response.data
        for (var i = 0; i < response.data.length; i++) {
          this.tempActivityProduct.productIds.push(response.data[i].productId)
        }
      }).then(() => {
        this.getProducts()
      })
    },
    handleUpdateActivityProduct(row) {
      this.dialogActivityProductFormVisible = true
      this.initTempActivityProduct(row.id)
      this.$nextTick(() => {
        this.$refs['ActivityProductDataForm'].clearValidate()
      })
    },
    handleProductSizeChange(val) {
      this.productListQuery.pageSize = val
      this.getProducts()
    },
    handleProductCurrentChange(val) {
      this.productListQuery.page = val
      this.getProducts()
    },
    getProducts() {
      this.productListLoading = true
      productActivitiesPage(this.productListQuery).then(response => {
        this.productList = response.data.items
        this.productTotal = response.data.total
        setTimeout(() => {
          this.productListLoading = false
          this.tempActivityProduct.pageProductIds = []
          this.tempActivityProduct.pageProducts = []
          if (this.tempActivityProduct.products && this.tempActivityProduct.products.length > 0 && this.productList && this.productList.length > 0) {
            for (var i = 0; i < this.tempActivityProduct.products.length; i++) {
              // this.tempActivityProduct.products[i]
              for (var j = 0; j < this.productList.length; j++) {
                if (this.tempActivityProduct.products[i].productId === this.productList[j].id) {
                  this.tempActivityProduct.pageProductIds.push(this.productList[j].id)
                  this.tempActivityProduct.pageProducts.push(this.tempActivityProduct.products[i])
                  // 设置选中
                  this.$refs.productTable.toggleRowSelection(this.productList[j])
                }
              }
            }
          }
        }, 1.5 * 1000)
      })
    },
    handleEdit(row) {
      this.tempActivities = {}
      this.tempActivities = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.tempActivities.tempTimes) {
            this.tempActivities.tempTimes = [null, null]
          }
          this.tempActivities.startTime = this.tempActivities.tempTimes[0]
          this.tempActivities.endTime = this.tempActivities.tempTimes[1]
          console.log(this.tempActivities)
          updateActivities(this.tempActivities).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
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
    handleAdd() {
      this.tempActivities = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.tempActivities.tempTimes) {
            this.tempActivities.tempTimes = [null, null]
          }
          this.tempActivities.startTime = this.tempActivities.tempTimes[0]
          this.tempActivities.endTime = this.tempActivities.tempTimes[1]
          addActivities(this.tempActivities).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
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
    handleDelete(row) {
      this.$confirm('确定要删除该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteActivitiesById(row.id).then(response => {
          if (response.code === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: '操作失败! 错误码：' + response.code,
              type: 'error',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    getList() {
      this.listLoading = true
      getActivitiesList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].tempTimes = []
          if (this.list[i].startTime && this.list[i].endTime) {
            this.list[i].tempTimes = Object.assign([], [this.list[i].startTime, this.list[i].endTime])
          }
        }
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
      if (this.listQueryFilter.name) {
        this.listQuery.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilter.name + '%'
        })
      }
      if (this.listQueryFilter.id) {
        this.listQuery.filter.filters.push({
          field: 'id',
          operater: 'like',
          value: '%' + this.listQueryFilter.id + '%'
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
    }
  }
}
</script>
