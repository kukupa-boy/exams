<template>
	<view class="pagecontainer">
		<course v-if="!userInfo.forbidden && enableApp && PageCur=='course'" class="course-container"></course>
		<exam v-if="!userInfo.forbidden && enableApp && PageCur=='exam'"></exam>
		<live v-if="!userInfo.forbidden && enableApp && PageCur=='live'"></live>
		<user v-if="!userInfo.forbidden && enableApp && PageCur=='user'"></user>
		<view v-if="!userInfo.forbidden && enableApp" class="cu-bar tabbar bg-white shadow foot" :class="ltr?'':'rtlDirection'">
			<view class="action" @click="NavChange" data-cur="course">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tab-course' + [PageCur=='course'?'-current':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='course'?'text-black':'text-gray'">{{i18n.tabbarCourse}}</view>
			</view>
			<view class="action" @click="NavChange" data-cur="exam">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tab-exam' + [PageCur=='exam'?'-current':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='exam'?'text-black':'text-gray'">{{i18n.tabbarExam}}</view>
			</view>
			<view class="action" @click="NavChange" data-cur="live">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tab-exam' + [PageCur=='live'?'-current':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='live'?'text-black':'text-gray'">{{i18n.tabbarLive}}</view>
			</view>
			<view class="action" @click="NavChange" data-cur="user">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/tab-my' + [PageCur == 'user'?'-current':''] + '.png'"></image>
				</view>
				<view :class="PageCur=='user'?'text-black':'text-gray'">{{i18n.tabbarUser}}</view>
			</view>
		</view>
		<view v-if="!userInfo.forbidden && !enableApp" class="warning">
			<image v-if="dyImg && dyImg.miniQrcodeUrl" :src="dyImg.miniQrcodeUrl" mode="aspectFit"></image>
			<text class="text-red">{{i18n.tip}}</text>
		</view>
		<view v-if="userInfo.forbidden" class="warning">
			<image src="/static/empty.png" mode="aspectFit"></image>
			<text class="text-red">{{i18n.forbidden}}</text>
		</view>
	</view>
</template>

<script>
	import { login } from '@/api/user';
	import { shareInfoOfHome, shareInfoOfUser, codeRecordInfo,dynamicImages } from '@/api/share';
	import {  
	    mapState,
		mapMutations
	} from 'vuex';
	import course from '../index/course.vue'
	import exam from '../index/exams.vue'
	import live from '../index/live.vue'
	import user from '../user/user.vue'
	export default {
		components:{
		   'course': course,
           'exam': exam,
		   'user': user,
		   'live': live
        },  
		computed: {
			...mapState(['enableApp','hasLogin','ltr','langtype','userInfo']),
			i18n () {  
			  return this.$t('index')
			}
		},
		data() {
			return {
				PageCur: 'course',
				shareInfoUser: null,
				shareInfoHome: null,
				dyImg: null
			}
		},
		onShareAppMessage(res) {
			console.log(res);
			let user = this.$api.getUserInfo();
			let page = '/pages/index/index';
			let shareInfo = this.PageCur === 'course' || this.PageCur === 'exam'?this.shareInfoHome:this.shareInfoUser;
		    if (res.from === 'button') {// 来自页面内分享按钮
				let id = res.target.id;
				let type = res.target.dataset.type;
				let title = res.target.dataset.name;
				let imgurl = res.target.dataset.imgurl;
				if(user && user.nickName) {
					title = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY',title);
				}
				if(type === 'product') {
					//产品分享
					page = '/pages/video/video?id='+id;
				}else if(type === 'course') {
					//课程分享
					page = '/pages/video/course?id='+id;
				}else if(type === 'article') {
					//攻略分享
					page = '/pages/article/article?id='+id;
				}else if(type === 'home' && shareInfo) {
					return {
						title: shareInfo.title,
						imageUrl: shareInfo.httpImageUrl,
						path: page
					}
				}else {
					page = page + '&id=' + (user ? user.id || 0 : 0);
				}
				if(user && user.id) {
					page = page + '&userid=' + user.id;
				}
				return {
					title: title,
					imageUrl: imgurl,
					path: page+'&langtype='+this.langtype
				}
		    }
			if(user && user.id) {
				page = page + '?id=' + user.id+'&langtype='+this.langtype;
			}else{
				page = page + '?langtype='+this.langtype;
			}
			if(shareInfo) {
				return {
					title: shareInfo.title,
					imageUrl: shareInfo.httpImageUrl,
					path: page
				}
			}else{
				return {
				  title: this.$t('index').homeTitle,
				  path: page
				}
			}
		},
		async onLoad(options) {
			if(!this.enableApp) {
				this.dyImg = dynamicImages();
				return;
			}
			let userid = options?options.id||0 : 0;
			if(userid) {
				this.parentUser(userid);
			}
			if(options && options.scene) {
				var scene = decodeURIComponent(options.scene);
				if(scene) {
					let recordid = Number(scene);
					if(recordid) {
						this.qrcodeRecordId(recordid);
						let record = await codeRecordInfo(recordid);
						if(record){
							userid = record.userId;
							this.resetlanguage(record.langtype);
						}
					}
				}
			}else if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
			if(options && options.page) {
				this.PageCur = options.page
			}else{
				this.PageCur = 'course';
			}
			this.loginCallback();
			setTimeout(()=>{
				shareInfoOfHome(this.langtype).then(res=>{
					this.shareInfoHome = res;
				});
				shareInfoOfUser(this.langtype).then(res=>{
					this.shareInfoUser =  res;
				});
			},600);
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId','Login','InitConfig']),
			loginCallback(info) {
				let loginRes = login(info);
				if(loginRes){
					loginRes.then(result=>{
						if(result && result.code ===0 && result.data && result.data.user){
							this.Login(result.data.user);
							this.InitConfig(result.data.config);
						}
					})
				}
			},
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
				let title = this.$t('index').homeTitle;
				if(this.PageCur === 'user') {
					title = this.$t('index').userTitle
				}
				uni.setNavigationBarTitle({
				　　title: title
				})
			}
		}
	}
</script>
<style lang="scss">
	.pagecontainer {
		width: 100%;
		height: calc(100vh - calc(100upx + env(safe-area-inset-bottom) / 2) - 40rpx);
		.warning {
			padding: 60rpx 30rpx 30rpx;
			text-align: center;
			image {
				margin-bottom: 30rpx;
			}
		}
	}
	.course-container {
		width: 100%;
		height: calc(100vh - 40upx);
	}
	.cu-bar.tabbar 
	{
		.action 
		{
			.cuIcon-cu-image 
			{
			image
			{
				width: 40upx;
				height: 40upx;
				margin-bottom: 10upx;
			}
			}
		}
	}
</style>