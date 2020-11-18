<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.name" :placeholder="$t('chapter.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('chapter.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('chapter.add') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAddCourse">{{ $t('chapter.addCourse') }}</el-button>
    </div>
    <!-- <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <div class="pagination-container" /> -->
    <el-table
      :key="tableKey"
      ref="tableButton"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :indent="36"
      size="mini"
      border
      fit
      :lazy="true"
      :load="load"
      style="width: 100%"
    >
      <el-table-column :label="$t('course.id')" width="240px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.chaptername')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.children ? scope.row.name : scope.row.chaptername }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.name')" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.courses ? scope.row.courses.name : '' }}</span> -->
          <span>{{ scope.row.children ? '' : scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.synopsis')" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.courses ? scope.row.courses.synopsis : '' }}</span> -->
          <span>{{ scope.row.synopsis }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.coverurl')" align="center">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.courses ? (scope.row.courses.httpcoverurl | imgFilter) : ''" width="50" height="50"> -->
          <img v-if="scope.row.httpcoverurl" :src="scope.row.httpcoverurl | imgFilter" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.totalplay')" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.courses ? scope.row.courses.totalplay : '' }}</span> -->
          <span>{{ scope.row.totalplay }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.free')" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.courses ? scope.row.courses.free : '' }}</span> -->
          <span>{{ scope.row.free | freeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('chapter.status')" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.children && scope.row.status == 1" type="success">{{ $t('chapter.online') }}</el-tag>
          <el-tag v-if="scope.row.children && scope.row.status != 1" type="warning">{{ $t('chapter.offline') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.sort')" align="center">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.courses ? scope.row.courses.sort : '' }}</span> -->
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('course.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('chapter.actions')" align="center" class-name="small-padding fixed-width" width="220px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.children && scope.row.status == 1" size="mini" type="warning" icon="el-icon-edit" @click="handleOnline(scope.row)">{{ $t('chapter.offline') }}
          </el-button>
          <el-button v-if="scope.row.children && scope.row.status != 1" size="mini" type="success" icon="el-icon-edit" @click="handleOnline(scope.row)">{{ $t('chapter.online') }}
          </el-button>
          <el-button v-if="scope.row.children" size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('chapter.edit') }}
          </el-button>
          <el-button v-if="!scope.row.children" size="mini" type="primary" icon="el-icon-edit" @click="handleEditCourse(scope.row)">{{ $t('chapter.edit') }}
          </el-button>
          <el-button v-if="scope.row.children" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('chapter.delete') }}
          </el-button>
          <el-button v-if="!scope.row.children" size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteCourse(scope.row)">{{ $t('chapter.delete') }}
          </el-button>
          <!-- <div class="buttonTop">
            <el-button v-if="scope.row.children" size="mini" :disabled="moveButtonTypeTop(scope.$index)" icon="el-icon-caret-top" @click="moveButtonToTop(scope.$index,scope.row)">上移
            </el-button>
            <el-button v-if="scope.row.children" size="mini" :disabled="moveButtonTypeBottom(scope.$index,scope.row)" icon="el-icon-caret-bottom" @click="moveButtonToBottom(scope.$index,scope.row)">下移
            </el-button> -->
          <!-- </div> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div> -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tempChapter" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('chapter.id')">
          <span>{{ tempChapter.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('chapter.name')" prop="name">
          <el-input v-model="tempChapter.name" maxlength="60" :placeholder="$t('chapter.editName')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('chapter.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('chapter.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createData">{{ $t('chapter.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMapCourse[dialogStatusCourse]" :visible.sync="dialogFormVisibleCourse">
      <el-form ref="dataFormCourse" :rules="rulesCourse" :model="tempCourse" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('course.id')">
          <span>{{ tempCourse.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('course.chapter')" prop="chapterid">
          <el-select v-model="tempCourse.chapterid" class="filter-item" :placeholder="$t('course.editChapter')" style="width: 280px;">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('course.name')" prop="name">
          <el-input v-model="tempCourse.name" maxlength="60" :placeholder="$t('course.editName')" />
        </el-form-item>
        <el-form-item :label="$t('course.synopsis')" prop="synopsis">
          <el-input v-model="tempCourse.synopsis" maxlength="60" :placeholder="$t('course.editSynopsis')" />
        </el-form-item>
        <el-form-item :label="$t('course.videourl')">
          <input id="fileUpload" type="file" @change="fileChange($event)">
        </el-form-item>
        <el-form-item :label="$t('course.coverUrlUploadType')">
          <el-radio v-model="coverUrlUploadType" label="0">{{ $t('course.manual') }}</el-radio>
          <el-radio v-model="coverUrlUploadType" label="1">{{ $t('course.automatic') }}</el-radio>
        </el-form-item>
        <el-form-item v-if="coverUrlUploadType==='0'" :label="$t('course.coverurl')">
          <el-upload
            v-model="tempCourse.coverurl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessCoverUrl"
            :before-upload="beforeUploadCoverUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempCourse.httpcoverurl" :src="tempCourse.httpcoverurl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('course.uploadText') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('course.transcodetemplategroupid')">
          <el-select v-model="tempCourse.transcodetemplategroupid" clearable filterable class="filter-item" :placeholder="$t('course.editTranscodetemplategroupid')" style="width: 280px;">
            <el-option v-for="item in templateMode" :key="item.key" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('course.free')" prop="free">
          <el-select v-model="tempCourse.free" class="filter-item" :placeholder="$t('course.editFree')" style="width: 280px;">
            <el-option v-for="item in freeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisibleCourse = false">{{ $t('course.cancel') }}</el-button>
        <el-button v-if="dialogStatusCourse=='update'" icon="el-icon-check" type="primary" @click="updateDataCourse">{{ $t('course.confirm') }}</el-button>
        <el-button v-else icon="el-icon-check" type="primary" @click="createDataCourse">{{ $t('course.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { chapterProductidPage, chapterInsert, chapterDelete, chapterUpdate, chapterUpdateOnline } from '@/api/chapter'
import { courseInsert, courseUpdate, courseDelete } from '@/api/course'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { transcodeTemplates } from '@/api/video'

const freeOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]

const freeKeyValue = freeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ChapterList',
  directives: {
    waves
  },
  filters: {
    freeFilter(type) {
      return freeKeyValue[type]
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
      uploadInfo: {
        file: null,
        productId: 0,
        chapterId: 0,
        courseId: 0,
        title: ''
      },
      textMapCourse: {
        update: '编辑章节目录',
        create: '新增章节目录'
      },
      dialogStatusCourse: '',
      dialogFormVisibleCourse: false,
      coverUrlUploadType: '0',
      freeOptions,
      tempCourse: {},
      productid: null,
      imgClass: 'avatar',
      imgClassArr: [],
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/course/upload`,
      tableKey: 0,
      list: null,
      total: null,
      templateMode: [],
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 100000,
        title: ''
      },
      listQueryFilter: {
        name: null
      },
      textMap: {
        update: '编辑章节目录',
        create: '新增章节目录'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tempChapter: {},
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入章节名称', trigger: 'blur' }]
        // subtitle: [{ required: true, message: '请输入群副标题', trigger: 'blur' }],
        // qrcodeurl: [{ required: true, message: '请上传群二维码图', trigger: 'blur' }],
        // scantip: [{ required: true, message: '请输入扫码提示文字', trigger: 'blur' }]
      },
      rulesCourse: {
        chapterid: [{ required: true, message: '请选择章节', trigger: 'change' }],
        name: [{ required: true, message: '请输入课程名称', trigger: 'change' }],
        synopsis: [{ required: true, message: '请输入课程简介', trigger: 'change' }],
        free: [{ required: true, message: '请选择是否免费（试看）', trigger: 'change' }],
        coverurl: [{ required: true, message: '请上传视频封面', trigger: 'blur' }]
      }
    }
  },
  // computed: {
  //   moveButtonTypeTop() {
  //     return (value) => {
  //       if (value === 0) {
  //         return true
  //       }
  //       return false
  //     }
  //   },
  //   moveButtonTypeBottom() {
  //     return (value, value1) => { // 找出最大的zi进行比较
  //       console.log(console.log(this.$refs.tableButton))
  //     }
  //   }
  // },
  created() {
    this.getList()
    this.getTemplate()
  },
  methods: {
    getTemplate() {
      transcodeTemplates().then(res => {
        if (res.code === 0) {
          const result = res.data
          result.forEach(item => {
            this.templateMode.push({
              key: item.transcodeTemplateGroupId,
              display_name: item.name,
              value: item.transcodeTemplateGroupId
            })
          })
        }
      })
    },
    fileChange(e) {
      this.uploadInfo.file = null
      const file = e.target.files[0]
      const isVideo = file.type === 'video/mp4'
      if (isVideo) {
        this.uploadInfo.file = file
      } else {
        this.uploadInfo.file = null
      }
      // this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', e)
    },
    handleSuccessCoverUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempCourse.coverurl = res.data.url
          this.tempCourse.httpcoverurl = res.data.httpUrl
          this.$refs['dataFormCourse'].validateField('coverurl')
        }, 1000)
      }
    },
    beforeUploadCoverUrl(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    uploadUrl() {
      return this.imgUrl
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
      this.getList()
    },
    load(tree, treeNode, resolve) {
      resolve([])
    },
    getUrlParam() {
      // 接收跳转参数
      if (this.$route.query) {
        this.productid = this.$route.query.productid
      }
      if (!this.productid) {
        this.listLoading = false
        this.$notify({
          title: '失败',
          message: '操作失败! 商品id不存在',
          type: 'error',
          duration: 2000
        })
      }
    },
    getList() {
      this.getUrlParam()
      this.listLoading = true
      chapterProductidPage(this.listQuery, this.productid).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleEdit(row) {
      this.tempChapter = {}
      this.tempChapter = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleOnline(row) {
      chapterUpdateOnline(row.id).then(response => {
        if (response.code === 0) {
          this.$notify({
            title: '成功',
            message: '操作成功',
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
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          chapterUpdate(this.tempChapter).then(response => {
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
    handleAddCourse() {
      console.log('handleAddCourse===================')
      this.coverUrlUploadType = '0'
      this.tempCourse = {}
      this.tempCourse.productid = this.productid
      this.dialogStatusCourse = 'create'
      this.dialogFormVisibleCourse = true
      this.$set(this.tempCourse, 'coverurl', null)
      this.$set(this.tempCourse, 'httpcoverurl', null)
      this.$nextTick(() => {
        this.$refs['dataFormCourse'].clearValidate()
      })
    },
    createDataCourse() {
      this.$refs['dataFormCourse'].validate((valid) => {
        if (!this.uploadInfo.file) {
          this.$message({
            type: 'info',
            message: '请上传mp4格式的视频文件'
          })
        }
        if (valid && this.uploadInfo.file) {
          courseInsert(this.tempCourse).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.uploadInfo.productId = this.productid
              this.uploadInfo.title = this.tempCourse.name
              this.uploadInfo.courseId = response.data
              this.uploadInfo.chapterId = this.tempCourse.chapterid
              this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', this.uploadInfo)
              this.dialogFormVisibleCourse = false
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
    handleEditCourse(row) {
      console.log('111111111111111111111')
      this.coverUrlUploadType = '0'
      this.tempCourse = {}
      this.tempCourse = Object.assign({}, row)
      this.dialogStatusCourse = 'update'
      this.dialogFormVisibleCourse = true
      this.$nextTick(() => {
        this.$refs['dataFormCourse'].clearValidate()
      })
    },
    updateDataCourse() {
      // 暂时添加videoId
      this.$refs['dataFormCourse'].validate((valid) => {
        if (valid) {
          courseUpdate(this.tempCourse).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              if (this.uploadInfo.file) {
                this.uploadInfo.productId = this.tempCourse.productid
                this.uploadInfo.title = this.tempCourse.name
                this.uploadInfo.courseId = this.tempCourse.id
                this.uploadInfo.chapterId = this.tempCourse.chapterid
                this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', this.uploadInfo)
              }
              this.dialogFormVisibleCourse = false
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
    handleDeleteCourse(row) {
      this.$confirm('确定要删除该视频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseDelete(row.id).then(response => {
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
    handleAdd() {
      this.tempChapter = {}
      this.tempChapter.productid = this.productid
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          chapterInsert(this.tempChapter).then(response => {
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
      this.$confirm('确定要删除该章节目录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapterDelete(row.id).then(response => {
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
    // ,
    // moveButtonToTop(index, value) { // id是产品id ，sort根据原有的dortzhi进行加减，减一上移，加一下移
    //   const model = {
    //     id: value.id,
    //     sortid: value.sort - 1
    //   }
    //   chapterUpdateSort(model)
    //     .then((res) => {
    //       this.$notify({
    //         title: '成功',
    //         message: '上移成功',
    //         type: 'success',
    //         duration: 2000
    //       })
    //       this.getList()
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // },
    // moveButtonToBottom(index, value) {
    //   const model = {
    //     id: value.id,
    //     sortid: value.sort + 1
    //   }
    //   chapterUpdateSort(model)
    //     .then((res) => {
    //       this.$notify({
    //         title: '成功',
    //         message: '下移成功',
    //         type: 'success',
    //         duration: 2000
    //       })
    //       this.getList()
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 90px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 160px;
    display: block;
  }

  .avatar-uploader-icon2 {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height:150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar2 {
    width: 150px;
    height:150px;
    display: block;
  }
  .buttonTop{
    margin-top: 10px;
  }
</style>
