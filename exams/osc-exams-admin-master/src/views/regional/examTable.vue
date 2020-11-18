<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.cityId" :placeholder="$t('exam.searchByCityId')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQueryFilter.name" :placeholder="$t('exam.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('exam.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('exam.add') }}</el-button>
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
      <el-table-column :label="$t('exam.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('exam.cityId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cityId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('exam.cityName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('exam.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('exam.yuname')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yuname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('exam.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('exam.actions')" align="center" class-name="small-padding fixed-width" width="280px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('exam.edit') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('exam.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempExam" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('exam.id')">
          <span>{{ tempExam.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('exam.cityName')" prop="cityId">
          <el-select v-model="tempExam.cityId" clearable class="filter-item" :placeholder="$t('exam.editCity')" style="width: 280px;">
            <el-option v-for="item in cityList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('exam.name')" prop="name">
          <el-input v-model="tempExam.name" :placeholder="$t('exam.editName')" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('exam.yuname')" prop="yuname">
          <el-input v-model="tempExam.yuname" :placeholder="$t('exam.editYuname')" maxlength="20" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('exam.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('exam.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('exam.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getExamList, addExam, deleteExamById, updateExam } from '@/api/exam'
import { getCitys } from '@/api/city'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { mapState } from 'vuex'

export default {
  name: 'ExamTable',
  directives: {
    waves
  },
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
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listQueryFilter: {
        name: null,
        cityId: null
      },
      tempExam: {
        id: null,
        cityId: null,
        name: null
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑考场',
        create: '新增考场'
      },
      cityList: [],
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入考场名称(中文)', trigger: 'blur' }],
        yuname: [{ required: true, message: '请输入考场名称(维文)', trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择城市名称', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      cityIds: state => state.user.cityIds
    })
  },
  created() {
    this.getListData()
    // this.getList()
  },
  methods: {
    handleEdit(row) {
      if (!this.cityList || this.cityList.length <= 0) {
        return
      }
      console.log(this.cityList)
      this.tempExam = {}
      this.tempExam = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateExam(this.tempExam).then(response => {
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
      console.log(this.cityList)
      if (!this.cityList || this.cityList.length <= 0) {
        return
      }
      this.tempExam = {}
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addExam(this.tempExam).then(response => {
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
      this.$confirm('确定要删除该考场吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteExamById(row.id).then(response => {
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
    getListData() {
      var queryData = []
      if (this.cityIds && this.cityIds.length > 0) {
        queryData = this.cityIds
      }
      getCitys(queryData).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          this.cityList.push({
            key: response.data[i].id,
            display_name: response.data[i].name
          })
        }
        this.getList()
      })
    },
    agentCityFilter() {
      if (!this.cityIds || this.cityIds.length === 0) {
        return
      }
      if (!this.listQuery.liker || !this.listQuery.liker.filters) {
        this.listQuery.liker = {
          filters: []
        }
      }
      for (const cityId of this.cityIds) {
        this.listQuery.liker.filters.push({
          field: 'cityid',
          operater: '=',
          value: cityId
        })
      }
    },
    getList() {
      this.listLoading = true
      this.agentCityFilter()
      console.log(this.listQuery)
      getExamList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        console.log(this.list)
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
      if (this.listQueryFilter.cityId) {
        this.listQuery.filter.filters.push({
          field: 'cityid',
          operater: 'like',
          value: '%' + this.listQueryFilter.cityId + '%'
        })
      }
      console.log(this.listQuery)
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
