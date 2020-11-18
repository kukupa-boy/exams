<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.name" :placeholder="$t('city.searchByName')" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.openedStatus" style="width: 200px;" class="filter-item" clearable :placeholder="$t('city.status')">
        <el-option v-for="(item, index) in cityStatus" :key="index" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('city.search') }}</el-button>
    </div>
    <el-pagination :current-page="dataPage" :page-sizes="[10]" :page-size="10" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
      <el-table-column :label="$t('city.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('city.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('city.status')" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.openedStatus===true">{{ scope.row.openedStatus | openedStatusFilter }}</el-tag>
          <el-tag v-if="scope.row.openedStatus===false" type="danger">{{ scope.row.openedStatus | openedStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('city.actions')" align="center" class-name="small-padding fixed-width" width="280px">
        <template slot-scope="scope">
          <!-- <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('city.edit') }}
          </el-button> -->
          <el-button v-if="scope.row.openedStatus===false" size="mini" style="width: 90px;" type="primary" icon="el-icon-plus" @click="handleOpened(scope.row)">{{ $t('city.opened') }}
          </el-button>
          <el-button v-if="scope.row.openedStatus===true" size="mini" style="width: 90px;" type="danger" icon="el-icon-minus" @click="handleDelete(scope.row)">{{ $t('city.close') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="dataPage" :page-sizes="[10]" :page-size="10" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempCity" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('city.id')">
          <span>{{ tempCity.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('city.name')" prop="name">
          <el-input v-model="tempCity.name" :placeholder="$t('city.editName')" maxlength="20" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('city.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('city.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('city.confirm') }}</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getCityList, deleteCityById, openedCity } from '@/api/city'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import cityLetters from '@/utils/city'

const openedStatusOptions = [
  { key: true, display_name: '已开通' },
  { key: false, display_name: '未开通' }
]
const openedStatusKeyValue = openedStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'CityTable',
  directives: {
    waves
  },
  filters: {
    openedStatusFilter(type) {
      return openedStatusKeyValue[type]
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
      dataPage: 1,
      listData: null,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      cityStatus: [
        { key: 1, display_name: '已开通', value: 1 },
        { key: 2, display_name: '未开通', value: 2 }
      ],
      listQuery: {
        page: 1,
        pageSize: 10000,
        title: ''
      },
      listQueryFilter: {
        name: null,
        openedStatus: null
      },
      tempCity: {
        id: null,
        name: null
      },
      openedFlag: true,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑城市',
        create: '新增城市'
      },
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入城市名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleOpened(row) {
      this.$confirm('确定要开通城市吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.openedFlag) {
          return
        }
        this.openedFlag = false
        setTimeout(() => {
          this.openedFlag = true
        }, 5 * 1000)
        this.tempCity = {}
        // this.tempCity = Object.assign({}, row)
        this.tempCity = {
          name: row.name
        }
        openedCity(this.tempCity).then(response => {
          this.$notify({
            title: '成功',
            message: '开通成功',
            type: 'success',
            duration: 2000
          })
          this.openedFlag = true
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // handleEdit(row) {
    //   this.tempCity = {}
    //   this.tempCity = Object.assign({}, row)
    //   this.dialogStatus = 'update'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // updateData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       updateCity(this.tempCity).then(response => {
    //         if (response.code === 0) {
    //           this.$notify({
    //             title: '成功',
    //             message: '修改成功',
    //             type: 'success',
    //             duration: 2000
    //           })
    //           this.dialogFormVisible = false
    //           this.getList()
    //         } else {
    //           this.$notify({
    //             title: '失败',
    //             message: '操作失败! 错误码：' + response.code,
    //             type: 'error',
    //             duration: 2000
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    // handleAdd() {
    //   this.tempCity = {}
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       addCity(this.tempCity).then(response => {
    //         if (response.code === 0) {
    //           this.$notify({
    //             title: '成功',
    //             message: '添加成功',
    //             type: 'success',
    //             duration: 2000
    //           })
    //           this.dialogFormVisible = false
    //           this.getList()
    //         } else {
    //           this.$notify({
    //             title: '失败',
    //             message: '操作失败! 错误码：' + response.code,
    //             type: 'error',
    //             duration: 2000
    //           })
    //         }
    //       })
    //     }
    //   })
    // },
    handleDelete(row) {
      this.$confirm('确定要关闭该城市吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCityById(row.id).then(response => {
          if (response.code === 0) {
            this.$notify({
              title: '成功',
              message: '关闭成功',
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
      getCityList(this.listQuery).then(response => {
        const openedCitys = response.data.items
        // 对比城市json cityLetters
        for (const cityJson of cityLetters) {
          this.$set(cityJson, 'openedStatus', false)
          for (const openedCity of openedCitys) {
            if (cityJson.name === openedCity.name) {
              this.$set(cityJson, 'id', openedCity.id)
              cityJson.openedStatus = true
              break
            }
          }
        }
        this.listData = this.getListDataArr(cityLetters)
        if (!this.listData || this.listData.length < 1) {
          this.list = null
          this.total = 0
          this.dataPage = 1
        } else {
          this.list = this.listData[0]
          this.total = cityLetters.length
          this.dataPage = 1
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getListDataArr(cityList) {
      if (!cityList) {
        return []
      }
      const listData = []
      if (cityList.length < 10) {
        listData.push(cityList)
        return listData
      }
      for (var i = 10; i < cityList.length; i += 10) {
        listData.push(cityList.slice(i - 10, i))
        if (i + 10 > cityList.length && i < cityList.length) {
          listData.push(cityList.slice(i, cityList.length))
        }
      }
      return listData
    },
    handleFilter() {
      if (this.listQueryFilter.name && !this.listQueryFilter.openedStatus) {
        const queryName = this.listQueryFilter.name
        const filterListData = []
        for (const cityJson of cityLetters) {
          if (cityJson.name.indexOf(queryName) !== -1) {
            filterListData.push(cityJson)
          }
        }
        this.listData = this.getListDataArr(filterListData)
        if (!this.listData || this.listData.length < 1) {
          this.list = null
          this.total = 0
          this.dataPage = 1
          return
        }
        this.list = this.listData[0]
        this.total = filterListData.length
        this.dataPage = 1
      }
      if (!this.listQueryFilter.name && this.listQueryFilter.openedStatus) {
        let flag = null
        if (this.listQueryFilter.openedStatus === 1) {
          flag = true
        } else {
          flag = false
        }
        const filterListData = []
        for (const cityJson of cityLetters) {
          if (cityJson.openedStatus === flag) {
            filterListData.push(cityJson)
          }
        }
        this.listData = this.getListDataArr(filterListData)
        if (!this.listData || this.listData.length < 1) {
          this.list = null
          this.total = 0
          this.dataPage = 1
          return
        }
        this.list = this.listData[0]
        this.total = filterListData.length
        this.dataPage = 1
      }
      if (this.listQueryFilter.name && this.listQueryFilter.openedStatus) {
        const queryName = this.listQueryFilter.name
        let flag = null
        if (this.listQueryFilter.openedStatus === 1) {
          flag = true
        } else {
          flag = false
        }
        const filterListData = []
        const filterData = []
        for (const cityJson of cityLetters) {
          if (cityJson.name.indexOf(queryName) !== -1) {
            filterListData.push(cityJson)
          }
        }
        for (const cityJson of filterListData) {
          if (cityJson.openedStatus === flag) {
            filterData.push(cityJson)
          }
        }
        this.listData = this.getListDataArr(filterData)
        if (!this.listData || this.listData.length < 1) {
          this.list = null
          this.total = 0
          this.dataPage = 1
          return
        }
        this.list = this.listData[0]
        this.total = filterData.length
        this.dataPage = 1
      }
      if (!this.listQueryFilter.name && !this.listQueryFilter.openedStatus) {
        this.getList()
      }
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
      this.dataPage = val
      this.list = this.listData[val - 1]
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
