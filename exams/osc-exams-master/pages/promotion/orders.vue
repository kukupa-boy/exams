<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="loaded === true && orderList.length === 0" :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty>
		
		<view v-if="loaded === true && orderList.length > 0" :class="'bg' + (ltr?'':' rtlDirection ')">
			<view  v-for="info in orderList" :key="info" class="order-item">
				<view class="i-top b-b">
					<view class="user-portrait">
						<image style="width: 60upx;height: 60upx;" :src="info.avatar || '/static/missing-face.png'"></image>
						<text class="user-name">{{info.nickName}}</text>
					</view>
					<view class="time">
						<text>{{info.createdOnText}}</text>
					</view>
				</view>
				<view class="Describe-left">
					<image :src="info.httpCoverUrl || info.coverUrl" class="img">
						<text class="play cuIcon-playfill cuIcon-playfill text-white text-white" ></text>
					</image>
					<view class="tx">
						<text class="test">{{info.name}}</text>
						<text style="color: #D3D3D3;line-height: 60upx;">{{i18n.player}}{{info.totalPlay}}\n</text>
						<text class="player-tx">￥{{info.price}}</text>
					</view>
				</view>
				<view class="Income">
					<text class="Income-tx">{{i18n.promotionalBenefits}}{{info.promoteMoney}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
	</view>
</template> 

<script>
	import { customOrders } from '@/api/order';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
	    mapState 
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page: 1,
				loadingType: '',
				loaded: false,
				orderList: []
			};
		},
		computed: {//login状态保持
			...mapState(['hasLogin','userInfo','ltr']),
			i18n () {  
			  return this.$t('promotion').customOrders
			}
		},
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
			
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		created() {
			let title = this.$t('promotion').customOrders.title;
			uni.setNavigationBarTitle({
			　　title: title
			})
		    this.loadData();
		},
		methods: {
			//获取订单列表
			async loadData(type='add'){
				if(type === 'refresh'){
					this.page = 1;
				}else if(this.loadingType === 'nomore') {
					return;
				}
				if(this.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				this.loadingType = 'loading';
				let orderList = await customOrders(this.page);
				if(type === 'refresh'){
					this.orderList = [];
				}
				orderList = orderList || [];
				this.orderList = this.orderList.concat(orderList);
				//判断是否还有数据， 有改为 more， 没有改为noMore
				this.loaded = true;
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}
				if(orderList.length<20) {
					this.loadingType = 'nomore';
				}else{
					this.loadingType = 'more';
					this.page++;
				}
			}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.bg{
		overflow-x:hidden;
		.order-item{
			display: flex;
			flex-direction: column;
			padding: 0upx 30upx;
			background: #fff;
			margin-bottom: 20upx;
			//margin-top: 16upx;
			.i-top{
				display: flex;
				align-items: center;
				height: 90upx;
				padding-right:30upx;
				font-size: $font-base;
				color: $font-color-dark;
				position: relative;
				display:flex;
				justify-content: space-between;
				align-items: center;
				.time{
					//flex: 1;
					//line-height: 10upx;
					color: #D3D3D3;
					//margin-left: 62%;
				}
				.state{
					color: $base-color;
				}
				.user-portrait{
					//width: 60upx;
					height: 60upx;
					//margin-top: 12upx;
					//border:5upx solid #fff;
					//border-radius: 50%;
					//text-align: center;
					align-items: center;
					display:flex;
					.user-name{
						margin: 0upx 10upx;
						font-size: 30upx;
					}
				}
			}
			.Describe-left{
				width: 100%;
				height: 180upx;
				align-items: center;
				display:flex;
				margin: 20upx 0upx 20upx;
				.img{
					width: 40%;
					height: 100%;
					border-radius: 10upx;
					overflow: hidden;
					//position: relative;
					//margin: 20upx 0upx 10upx;
					//margin-right: 15upx;
					white-space:nowrap;
				}
				.play{
					font-size: 60upx;
					position: absolute;
					left: 40%;
					top: 31%;
					opacity: 0.4;
				}
				.tx{
					width: 60%;
					padding: 0upx 20upx;
					.test{
						width: 100%;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}
			}
			.Income{
				width: 100%;
				height: 60upx;
				align-items: center;
				display:flex;
				justify-content:flex-end;
				.Income-tx{
					color: orange;
					margin: 0upx 20upx;
				}
			}
		}
	}
</style>