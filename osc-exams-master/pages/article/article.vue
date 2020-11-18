<template>
	<view :class="ltr?'':'rtlDirection'">
		<view :class="'title-section'+(ltr?'':' rtlDirection ')">
			<text :class="'title'+(ltr?'':' title-rtl')">{{category.title}}</text>
			<view :class="'bot-row'+(ltr?'':' bot-row-rtl')">
				<view class="share-btn" @click="share">
					<text class="cuIcon text-gray cuIcon-share"></text>
					<text class="text-gray">{{i18n.share}}</text>
				</view>
			</view>
			<view class="tag-section">
				<scroll-view scroll-x="true" style="width: auto;overflow:hidden;height:100%">
					<button v-for="(item,index) in category.categoryTags" :key="index" class="cu-btn shadow round" :class="index==selectIndex?'bg-yellow text-black':'line-grey'" @click="gotoScroll(index, item)">{{item.tagName}}</button>
				</scroll-view>
			</view>
		</view>
		<view class="content">
			<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - 100px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
				 <block v-for="(item,index) in category.categoryTags" :key="index">
					 <rich-text v-if="!item.imageUrl" :class="'indexItem-' + item.id" :id="'indexes-' + item.id" :data-index="item.id" :nodes="filterNodesContent(item.tagContent)"></rich-text>
					<image v-if="item.imageUrl" mode="widthFix" :class="'indexItem-' + item.id" :id="'indexes-' + item.id" :data-index="item.id" :src="item.imageUrl" />
				 </block>
			</scroll-view>
			<wm-watermark v-if="showWaterMark" :text="i18n.watermark" num="50" top="200" opacity="0.2"></wm-watermark>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:shareModel="{data:category, type:'article'}"
		></share>
	</view>
</template>

<script>
	import { loginAsync } from '@/api/user';
	import { shareInfoOfStrategy, codeRecordInfo } from '@/api/share';
	import { categoryInfo } from '@/api/category';
	import wmWatermark from '@/components/wm-watermark';
	import share from '@/components/share';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			share,
			wmWatermark
		},
		data() {
			return {
				shareInfo: null,
				category: {
					title: '',
					categoryTags: []
				},
				selectIndex: 0,
				listCurID: '',
				list: [],
				listCur: '',
				scrollTop: 0,
				scrollWidth: 0,
				scrollHeight: 0,
				showWaterMark: false,
				strings: ''
			}
		},
		onShareAppMessage(res) {
			let city = this.$api.getCity();
			let user = this.$api.getUserInfo();
			let page = '/pages/article/article?id='+this.category.id;
			if(user && user.id) {
				page = page + '&userid=' + user.id+'&langtype='+this.langtype;
			}else{
				page = page+'?langtype='+this.langtype;
			}
			let cityName = '';
			if(city && city.name) {
				cityName= city.name;
			}
			if(this.shareInfo && this.shareInfo.httpImageUrl) {
				return {
					title: cityName + this.category.title,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page
				}
			}else{
				return {
				  title: cityName + this.category.title,
				  path: page
				}
			}
		},
		async onLoad(options) {
			let userid = options ? options.userid || 0 : 0;
			if(userid) {
				this.parentUser(userid);
			}
			let id = options ? options.id || 0 : 0;
			if(options && options.scene) {
				var scene = decodeURIComponent(options.scene);
				if(scene) {
					let recordid = Number(scene);
					if(recordid) {
						this.qrcodeRecordId(recordid);
						let record = await codeRecordInfo(recordid);
						if(record){
							userid = record.userId;
							id = record.entityId;
							this.resetlanguage(record.langtype);
						}
					}
				}
			}else if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
			if(id>0) {
				this.loadData(id);
			}
			shareInfoOfStrategy(this.langtype).then(res=>{
				this.shareInfo = res;
			});
			loginAsync(userid);
		},
		computed: {
			...mapState(['ltr','langtype','hasLogin']),
			i18n () {  
			  return this.$t('article')
			}
		},
		created() {
			const res = uni.getSystemInfoSync();
			this.scrollWidth=res.windowWidth;
			this.scrollHeight=res.windowHeight - 200;
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			filterNodesContent(text) {
				return text.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
			},
			async loadData(id){
				let responseData = await categoryInfo(id);
				let category = responseData ? responseData.data || null : null;
				if(category) {
					this.category = category;
				}
			},
			gotoScroll(index, item){
				this.listCurID = item.id;
				this.selectIndex = index;
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	/* 标题简介 */
	.title-section{
		position: fixed;
		left: 0;
		top: var(--window-top);
		z-index: 10;
		background: #fff;
		padding: 20upx 30upx;
		height: 200upx;
		width: 100%;
		border-bottom: 0.5upx solid $border-color-base;
		.title{
			font-size: 32upx;
			font-weight: bold;
			color: $font-color-dark;
			width: 80%;
			height: 50upx;
			line-height: 45upx;
			float: left;
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-base;
			width: 18%;
			float: left;
			
			text{
				flex: 1;
			}
		}
		.share-btn {
			float: left;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 32upx;
			color: $font-color-base;
			width: 100%;
			height: 50upx;
		}
		.title-rtl {
			width: 77%;
		}
		.bot-row-rtl{
			width: 23%;
		}
	}
	
	
	.tag-section{
		margin-top: 95upx;
		height: 80upx;
		width: 100%;
		position: fixed;
		white-space: nowrap; // 滚动必须加的属性
		.cu-btn {
			margin: 0upx 12upx; 
		}
	}
	.content {
		position: absolute;
		left: 0;
		top: 200upx;
		width: 100%;
	}
	.indexes {
		position: absolute;
		top: 3upx;
		left: 0upx;
		padding: 0rpx 10upx;
	}
</style>
