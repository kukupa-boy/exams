<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div v-if="uploadFiles.length > 0" class="topprogress">
      <div role="alert" class="el-alert el-alert--success is-light">
        <div v-for="item in uploadFiles" :key="item.productId" class="el-alert__content"><span class="el-alert__title"><span class="filenamespan">{{ item.filename }}</span><el-progress :text-inside="true" :stroke-width="16" :percentage="item.authProgress" /></span>
        </div>
      </div>
    </div>
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { getCerts, refreshCerts, updateVideoId } from '@/api/video'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      filename: '',
      timeout: '',
      partSize: '',
      parallel: '',
      retryCount: '',
      retryDuration: '',
      region: 'cn-shanghai',
      userId: '223069864717075749',
      file: null,
      authProgress: 0,
      uploader: null,
      uploadFiles: []
    }
  },
  computed: {
    ...mapState({
      aliyunUserId: state => state.user.aliyunUserId,
      aliyunRegionId: state => state.user.aliyunRegionId,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.$root.$eventHub.$on('ALIYUN_UPLOAD_VIDEO', (upinfo) => {
      console.log('--------aliyunRegionId-----' + this.aliyunRegionId)
      console.log('--------aliyunUserId-----' + this.aliyunUserId)
      upinfo.authProgress = 0
      upinfo.success = false
      if (!upinfo.file) {
        this.$message({
          message: '请选择需要上传的文件',
          type: 'warning'
        })
        return
      }
      upinfo.filename = upinfo.file.name
      this.uploadFiles.push(upinfo)
      var userData = '{"Vod":{"productId":"' + upinfo.productId + '","chapterId":"' + (upinfo.chapterId ? upinfo.chapterId : 0) + '","courseId":"' + (upinfo.courseId ? upinfo.courseId : 0) + '","filename":"' + upinfo.filename + '","title":"' + upinfo.title + '"}}'
      upinfo.uploader = this.createUploader()
      upinfo.uploader.addFile(upinfo.file, null, null, null, userData)
      upinfo.uploader.startUpload()
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    createUploader(type) {
      var self = this
      const uploader = new window.AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.aliyunRegionId,
        userId: self.aliyunUserId,
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          console.log('addFileSuccess: ' + uploadInfo.file.name)
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          console.log(uploadInfo.videoInfo)
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          if (!uploadInfo.videoId) {
            const upModel = {
              fileName: uploadInfo.videoInfo.filename,
              productId: uploadInfo.videoInfo.productId,
              chapterId: uploadInfo.videoInfo.chapterId,
              courseId: uploadInfo.videoInfo.courseId,
              title: uploadInfo.videoInfo.title
            }
            getCerts(upModel).then(response => {
              console.log('----------------创建cert---------------')
              const data = response.data
              const uploadAuth = data.uploadAuth
              const uploadAddress = data.uploadAddress
              const videoId = data.videoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            })
          } else {
            refreshCerts(uploadInfo.videoId).then(response => {
              console.log('----------------刷新cert---------------')
              const data = response.data
              const uploadAuth = data.uploadAuth
              const uploadAddress = data.uploadAddress
              const videoId = data.videoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            })
          }
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          var updateVideoModel = {
            productId: uploadInfo.videoInfo.productId,
            chapterId: uploadInfo.videoInfo.chapterId,
            courseId: uploadInfo.videoInfo.courseId,
            videoId: uploadInfo.videoId
          }
          updateVideoId(updateVideoModel).then(response => {
            console.log(response.data)
          })
          self.$notify({
            title: '上传成功',
            message: uploadInfo.file.name + '上传成功',
            duration: 30000,
            type: 'success'
          })
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          self.$notify({
            title: '上传失败',
            message: uploadInfo.file.name + '上传失败',
            duration: 0,
            type: 'error'
          })
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {
          self.$notify({
            title: '上传已取消',
            message: uploadInfo.file.name + '已取消或者中断上传',
            duration: 0,
            type: 'info'
          })
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          const progressPercent = Math.ceil(progress * 100)
          for (var i = 0; i !== self.uploadFiles.length; i++) {
            if (self.uploadFiles[i].productId - 0 === uploadInfo.videoInfo.productId - 0) {
              const item = self.uploadFiles[i]
              item.authProgress = progressPercent
              Vue.set(self.uploadFiles, i, item)
              break
            }
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          self.$notify({
            title: '上传耗时提醒',
            message: uploadInfo.file.name + '文件较大，请勿关闭或刷新浏览器，请耐心等待上传完成',
            duration: 0,
            type: 'warning'
          })
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          var isAllSuccess = true
          for (var i = 0; i !== self.uploadFiles.length; i++) {
            if (self.uploadFiles[i].authProgress < 100) {
              isAllSuccess = false
            }
          }
          if (isAllSuccess === true) {
            self.$notify({
              title: '全部上传成功',
              message: '全部文件已上传完成',
              duration: 30000,
              type: 'success'
            })
            self.uploadFiles = []
          }
        }
      })
      return uploader
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
    .topprogress{
      position: absolute;
      text-align: center;
      left: 0;
      top: 0;
      width: 40%;
      margin-left: 30%;
      z-index: 1002;
      .el-alert {
        width: 100%;
        margin: 0 auto;
      }
      .el-alert__content {
        width: 100%;
      }
      .el-progress {
        width: 100%;
      }
      .filenamespan {
        font-size: 10px;
      }
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
