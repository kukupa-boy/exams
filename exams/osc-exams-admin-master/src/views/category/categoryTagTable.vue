<template>
  <div class="app-container">
    <img :src="htmlUrl">
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: left; height:220px; font-size: 12px">
        <el-form ref="dataForm" :rules="rules" :model="tempCategory" label-position="left" label-width="120px">
          <el-form-item :label="$t('categoryTag.categoryId')">
            <span>{{ tempCategory.id }}</span>
          </el-form-item>
          <el-form-item :label="$t('categoryTag.categoryName')">
            <span>{{ tempCategory.name }}</span>
          </el-form-item>
          <el-form-item :label="$t('categoryTag.exam')">
            <span>{{ tempCategory.examName }}</span>
          </el-form-item>
        </el-form>
        <div style="width: 700px; margin-left:-20px">
          <el-alert :title="$t('categoryTag.previewTips')" type="info" show-icon />
        </div>
      </el-header>
      <el-container style="height: 600px;">
        <el-aside width="400px" style="background-color: #fff; border: 1px solid #eee">
          <!-- <div style="width: 100%; line-height:20px" class="image_tofile" ref="imageTofile" v-html="tagContentDataHtml" /> -->
          <!-- <div style="width: 100%; line-height:20px" class="image_tofile" ref="imageTofile" v-html="tagList[0].tagContent"></div> -->
          <div ref="imageTofile" style="width: 100%; line-height:20px">
            <div v-for="(tag) in tagList" :key="tag.id" ref="imageTofiles" style="width: 100%; line-height:20px" v-html="tag.tagContent" />
          </div>
        </el-aside>
        <el-aside width="300px" style="background-color: #fff; border: 1px solid #eee">
          <ul>
            <li v-for="(tag) in tagList" :key="tag.id">
              <!-- <el-button :disabled="i<=0" size="mini" style="margin-left:0px; margin-right:0px" @click="handleUp(tag, i)">{{ $t('categoryTag.up') }}</el-button>
              <el-button :disabled="i>=tagList.length-1" size="mini" style="margin-left:0px; margin-right:0px" @click="handleDown(tag, i)">{{ $t('categoryTag.down') }}
              </el-button> -->
              <el-tag
                closable
                type="success"
                style="margin-left:0px; margin-right:0px"
                @close="handleTagClose(tag)"
              >
                {{ tag.tagName }}
              </el-tag>
            </li>
          </ul>
        </el-aside>
        <el-main width="600px">
          <div class="inputHeader">
            <el-input v-model="tempCategoryTag.tagName" :placeholder="$t('categoryTag.editTagName')" maxlength="600" style="width: 600px" />
          </div>
          <tinymce ref="textTipsTinymce" v-model="tempCategoryTag.tagContent" :height="200" :width="600" :placeholder="$t('categoryTag.editTagContent')" />
          <div class="buttonHeader">
            <el-button icon="el-icon-check" type="primary" @click="handleAdd()">{{ $t('categoryTag.add') }}</el-button>
            <el-button icon="el-icon-check" type="primary" @click="handleSubmit()">{{ $t('categoryTag.submit') }}</el-button>
          </div>
          <div class="buttonHeader">
            <el-alert :title="$t('categoryTag.addTips')" type="info" show-icon />
            <el-alert :title="$t('categoryTag.submitTips')" type="info" show-icon />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { findCategoryById } from '@/api/category'
import { updateCategorysTag } from '@/api/categoryTag'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Tinymce from '@/components/Tinymce'
import html2canvas from 'html2canvas'

export default {
  name: 'CategoryTag',
  directives: {
    waves
  },
  components: { Tinymce },
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
      htmlUrl: '',
      tagList: [],
      tempCategory: {
        id: null,
        name: null,
        categoryTags: []
      },
      tempCategoryTag: {
        id: null,
        tagName: null,
        tagContent: null
      },
      tagContentDataList: [],
      tagContentDataHtml: '内容展示',
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
        name: null
      },
      paramCategoryId: null,
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑城市',
        create: '新增城市'
      },
      downloadLoading: false,
      rules: {
        name: [{ required: true, message: '请输入城市名称', trigger: 'blur' }]
      },
      isSubmiting: false
    }
  },
  created() {
    // this.getList()
    this.getData()
  },
  methods: {
    // 页面元素转图片
    handleSubmit() {
      if (this.isSubmiting === true) {
        this.$message({
          type: 'info',
          message: '正在保存中，请勿重复提交'
        })
        return
      }
      this.isSubmiting = true
      this.$message({
        type: 'info',
        message: '正在处理标签内容.....'
      })
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      if (this.tagList.length > 0) {
        this.loopCreateImage(0)
      } else {
        this.handleSubmitInfo()
      }
    },
    loopCreateImage(index) {
      html2canvas(this.$refs.imageTofiles[index], {
        backgroundColor: null
      }).then((canvas) => {
        const url = canvas.toDataURL('image/png')
        this.tagList[index].imageUrl = url
        if (this.tagList.length - 1 > index) {
          setTimeout(() => {
            this.loopCreateImage(index + 1)
          }, 800)
        } else {
          this.createCategoryImage()
        }
      })
    },
    createCategoryImage() {
      html2canvas(this.$refs.imageTofile, {
        backgroundColor: null,
        height: 289,
        width: 350
      }).then((canvas) => {
        const url = canvas.toDataURL('image/png')
        this.tempCategory.imageUrl = url
        this.handleSubmitInfo()
      })
    },
    handleUp(tag, i) {
      this.tagList[i] = this.tagList[i - 1]
      this.tagList[i - 1] = tag
      this.tagContentDataList[i] = this.tagList[i - 1]
      this.tagContentDataList[i - 1] = tag
      this.tagContentDataHtml = this.tagContentDataList.join('<div style="height:0px;width:100%;"></div>')
      this.$forceUpdate()
    },
    handleDown(tag, i) {
      this.tagList[i] = this.tagList[i + 1]
      this.tagList[i + 1] = tag
      this.tagContentDataList[i] = this.tagList[i + 1]
      this.tagContentDataList[i + 1] = tag
      this.tagContentDataHtml = this.tagContentDataList.join('<div style="height:0px;width:100%;"></div>')
      this.$forceUpdate()
    },
    handleSubmitInfo() {
      this.$message({
        type: 'info',
        message: '正在保存数据中.....'
      })
      const that = this
      this.tempCategory.categoryTags = Object.assign([], this.tagList)
      updateCategorysTag(this.tempCategory).then(response => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        that.getData()
        that.isSubmiting = false
      })
    },
    handleTagClose(tag) {
      var index = this.tagList.indexOf(tag)
      this.tagList.splice(index, 1)
      this.tagContentDataList.splice(index, 1)
      this.tagContentDataHtml = this.tagContentDataList.join('<br/>')
    },
    handleAdd() {
      var categoryTag = Object.assign({}, this.tempCategoryTag)
      if (!categoryTag.tagName) {
        this.$message({
          type: 'error',
          message: '请输入标签名称'
        })
        return
      }
      var tagContent = categoryTag.tagContent
      tagContent = tagContent.substring('<p>'.length, tagContent.lastIndexOf('</p>'))
      categoryTag.tagContent = tagContent
      this.tagList.push(categoryTag)
      this.tagContentDataList.push(tagContent)
      this.tagContentDataHtml = this.tagContentDataList.join('<div style="height:0px;width:100%;"></div>')
      // 重置
      this.tempCategoryTag = {
        id: null,
        tagName: null,
        tagContent: null
      }
      this.$refs['textTipsTinymce'].setContent('')
    },
    getData() {
      // 接收跳转参数
      this.paramCategoryId = this.$route.query.categoryId
      if (!this.paramCategoryId) {
        this.$notify({
          title: '失败',
          message: '操作失败! 栏目id不存在',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.getCategoryData()
    },
    getCategoryData() {
      this.listLoading = true
      findCategoryById(this.paramCategoryId).then(response => {
        this.tempCategory = response.data
        this.tagContentDataList = []
        this.tagList = Object.assign([], this.tempCategory.categoryTags ? this.tempCategory.categoryTags : [])
        for (var i = 0; i < this.tagList.length; i++) {
          this.tagList[i]
          this.tagContentDataList.push(this.tagList[i].tagContent)
          this.tagContentDataHtml = this.tagContentDataList.join('<div style="height:0px;width:100%;"></div>')
        }
        this.$refs['textTipsTinymce'].setContent('')
        this.listLoading = false
        console.log(this.tagList)
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
  }
}
</script>

<style>
  .inputHeader {
    padding-bottom: 10px;
  }
  .buttonHeader {
    padding-top: 10px;
    width: 600px;
  }
</style>
