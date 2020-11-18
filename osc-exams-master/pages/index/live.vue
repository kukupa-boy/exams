<template>
	<view :class="rtlClazz" class="container">
		<scroll-view 
		class="outerBox"
		scroll-y="true"
		refresher-enabled="true" 
		:refresher-triggered="triggered"
        :refresher-threshold="50"
		refresher-background="#f8f8f8" 
		@refresherpulling="onPulling"
        @refresherrefresh="onRefresh" 
		@refresherrestore="onRestore"
		@refresherabort="onAbort"
		:scroll-anchoring="true"
		@scrolltolower="toLower"
		>
			<view class="flex justify-center padding solid-bottom">
				<button class="cu-btn round bg-gradual-orange shadow" @click="urlTo('/pages/live/live')">
					<text class="cuIcon-add"></text>
					{{i18n.wantToBecomeAnchor}}
				</button>
			</view>
			<empty-inner  v-if="showEmpty" :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty-inner>
			<view v-if="!showEmpty" class="live-container">
				<view class="live-content-item" v-for="(item,index) in list" :key="index" @click="gotoLive(item.roomid,item.id)">
					<view class="image_box">
						<image  :src="item.httpCoverImg" mode="center"></image>
						<view v-if="isEnd(item.endtime)" class="meng flex justify-center align-center">
							<image src="../../static/live_finish.png"></image>
						</view>
						<view v-if="!isEnd(item.endtime)" class="cu-tag tag bg-green" :class="ltr?'':'left'">
							{{i18n.living}}
						</view>
						<view v-else class="cu-tag tag bg-gray" :class="ltr?'':'left'">
							{{i18n.livingEnd}}
						</view>
						<view class="image_info flex justify-between">
							<view class="live_author">{{item.authorname}}</view>
							<view class="live_peopleNum">
								<text class="cuIcon-people cuPeople"></text>{{item.visits?item.visits:0}}
							</view>
						</view>
					</view>
					<view class="live-theme">
						<text>{{item.name}}</text>
					</view>
					<view class="live-footer flex justify-between">
						<text class="live-class">{{projectOptionsFn(item.status)}}</text>
						<text class="live-langType">{{item.langtype===0?i18n.chinese:i18n.otherLanguage}}</text>
					</view>
				</view>
			</view>
			<view v-if="!showEmpty">
				<uni-load-more :status="loadType"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
	    mapState,
		mapMutations
	} from 'vuex'; 
	import emptyInner from "@/components/emptyInner";
	import {liveroomLists, liveroomUpdateCount} from "@/api/live.js";
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import {utc8TimeConvert} from "@/utils/index.js"
	// const projectOptions = [
	// 	{key:0,value:"未知"},
	// 	{key:1,value:"科目一"},
	// 	{key:2,value:"科目二"},
	// 	{key:3,value:"科目三"},
	// 	{key:4,value:"科目四"}
	// ]
	export default {
		data() {
			return {
				_freshing:false,
				loadType:'refresh', // refresh(刷新)  more(加载更多) noMore(加载完成) loading（正在加载中）
				triggered:false,
				page:1,
				showEmpty:false,
				list:[
					
				],
				projectOptions:[
					{key:0,value:this.$t('live').unKown},
					{key:1,value:this.$t('live').projectOne},
					{key:2,value:this.$t('live').projectTwo},
					{key:3,value:this.$t('live').projectThree},
					{key:4,value:this.$t('live').projectFour}
				]
			}
		},
		created(){
			this.getBargainShareInfoList("refresh")
		},
		onLoad() {
			this._freshing = false;
			setTimeout(() => {
				this.triggered = true;
			}, 1000)
		},
		computed: {
			...mapState(['ltr','langtype','rtlClazz']),
			i18n () {  
			  return this.$t('live')
			}
		},
		components: {
			emptyInner,
			uniLoadMore
		},
		methods: {
			projectOptionsFn(v){
				return this.projectOptions[v].value
			},
			// 预留打开直播逻辑,禁止删除
			async gotoLive(v,m){
				let roomId = v;// 通过列表数据中的参数值赋值
				await liveroomUpdateCount(m);
				let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 }));
				uni.navigateTo({
				    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
				})
			},
			async getBargainShareInfoList(type="add"){
				// 防止重复刷新，上啦刷新的情况，下拉加载
				if(type==="refresh"){
					this.page=1;
				} 
				if(this.loadType === 'nomore' && this.list && this.list.length>0) {
					return ;
				}
				if(this.loadType==="loading"){
					return ;
				}
				this.loadType="loading";
				let data = await liveroomLists(this.langtype,this.page)
				if(type==="refresh"){
					this.list = []
					if(data){
						 this.list = [...data]
						 this.page++;
						 this.loadType="loadFinish"
					}else{
						 this.loadType="nomore"
					}
				}else{
					if(data){
						this.list = [...this.list,...data]
						this.page++ 
						this.loadType="loadFinish"
					}else{
						this.loadType="nomore"
					}
				}
				if(this.list.length===0){
					this.showEmpty = true
				}
			},
			toLower(){
				this.getBargainShareInfoList()
			},
			onPulling(e) {
			},
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				this.getBargainShareInfoList("refresh")
				if (!this.triggered)//界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;  
				setTimeout(() => {  
					this.triggered = false;//触发onRestore，并关闭刷新图标  
					this._freshing = false;  
				}, 1000)  
			},
			onRestore() {
			},
			onAbort() {
				console.log("onAbort");
			},
			urlTo(url){
				uni.navigateTo({
					url:url
				})
			},
			isEnd(v){
				let date = new Date()
				if(v>utc8TimeConvert(date).getTime()){
					return false
				}
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		overflow: hidden;
		background: $page-color-base;
	}
	.outerBox{
		height:1090rpx;
		position: relative;
	}
	.live-container{
		display: flex;
		justify-content: space-around;
		flex-wrap:wrap;
		padding-bottom: 24rpx;
	}
	.live-content-item:nth-of-type(1),.live-content-item:nth-of-type(2){
		margin-top: 0;
	}
	.live-content-item{
		flex-shrink: 0;
		border-radius: 30rpx;
		width:340rpx;
		background-color:white;
		margin-top:24rpx;
		.image_box{
			position: relative;
			.tag{
				position: absolute;
				right:0;
				top:0;
				z-index:3;
				border-top-right-radius:8rpx;
				border-bottom-left-radius:8rpx;
				border-bottom-right-radius:0rpx;
				border-top-left-radius:0rpx;
				&.left{
					left: 0;
					right:unset;
					border-bottom-left-radius:0rpx;
					border-bottom-right-radius:8rpx;
					border-top-left-radius:8rpx;
					border-top-right-radius:0rpx;
				}
			}
			image{
				height:204rpx;
				width:100%;
				border-top-left-radius:10rpx ;
				border-top-right-radius:10rpx ;
			}
			.meng{
				height:204rpx;
				width:100%;
				border-top-left-radius:10rpx ;
				border-top-right-radius:10rpx ;
				position: absolute;
				top:0;
				left:0;
				z-index: 2;
				background-color:rgba(128,128,128,0.6);
				color:white;
				image{
					width:172rpx;
					height:128rpx
				}
			}
			.image_info{
				position: absolute;
				bottom:16rpx;
				color:white;
				width:100%;
				padding-left: 24rpx;
				padding-right:24rpx;
				color: #F8F8F8;
				font-size: 24rpx;
				.cuPeople{
					padding-right:8rpx;
					font-size:26rpx;
				}
			}
		}
		.live-theme{
			font-size: 28rpx;
			font-weight: bold;
			text-indent: 28rpx;
			padding:16rpx 0rpx;
			color:black;
		}
		.live-footer{
			padding:16rpx 0rpx;
			color:gray;
			font-size: 24rpx;
			padding-left: 16rpx;
			padding-right: 16rpx;
		}
	}
</style>
