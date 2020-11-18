<template>
	<view :class="'product-section'+(ltr?'':' rtlDirection ')">
		<view 
			v-for="(item, index) in productList" :key="index"
			class="product-item"
			@click="navToDetail(item)"
		>
			<view class="image-wrapper">
				<image :src="item.httpCoverUrl || item.coverUrl" mode="aspectFill"></image>
				<view v-if="!isPaid && !item.paied && item.activity" :class="ltr?'image-tip':'image-tip-rtl'"><text>{{item.activity.name}}</text></view>
				<!-- <text class="cuIcon-playfill text-white" v-if="item.producttype!=1"></text> -->
			</view>
			<view :class="'product-item-title'+(ltr?'':'-rtl rtlDirection ')">
				<view class="title"><text>{{item.name}}</text></view>
				<view v-if="item.expired" class="playcount red"><text>{{expired}}</text></view>
				<view v-if="!item.expired" class="playcount"><text>{{playCount}}：{{item.totalPlay}}</text></view>
				<view v-if="isPromoter" class="promoterDesc"><text>{{promoterDesc}}：￥{{item.promoteMoney}}</text></view>
				<view v-if="isPromoter" class="promoterDesc sub"><text>{{subPromoterDesc}}：￥{{item.subPromoteMoney}}</text></view>
				<view v-if="!isPromoter && item.paied" class="promoterDesc"><text>{{hasPaiedDesc}}</text></view>
				<view v-if="isPaid && !isPromoter" class="promoterDesc">
					<text>{{i18n.createDate}}：{{item.createdOn | filterTime}}</text>
				</view>
				<view v-if="isPaid && !isPromoter" class="promoterDesc sub">
					<text>{{i18n.expireDate}}：{{item.expiretime | filterTime}}</text>
				</view>
				<view v-if="!item.paied && android" class="price">
					<!-- <text v-if="isPaid && !isPromoter" class="text-gray">{{playCount}}：{{item.totalPlay}}</text> -->
					<text v-if="!isPaid">￥{{item.price}}</text>
					<text v-if="!isPaid" class="oldprice">￥{{item.price}}</text>
				</view>
				<button v-if="showDetail" class="cu-btn line-orange shadow product-item-btn" :class="ltr?'':(isPromoter||isPaid)?'sm':''" @click="navToDetail(item)">{{share}}</button>
				<button v-if="!showCollection && !showDetail" class="cu-btn line-orange shadow product-item-btn" :class="ltr?'':(isPromoter||isPaid)?'sm':''" @click="shareToFreind(item)">{{share}}</button>
				<view v-if="showCollection && showDetail" class="product-item-btn">
					<view class="collection-btn" :class="item.favorite?'text-orange':'text-gray'" @click="toFavorite(item)">
						<text class="cuIcon" :class="item.favorite?'cuIcon-favorfill':'cuIcon-favor'"></text>
						<text>{{collection}}</text>
					</view>
					<view class="share-btn" @click="shareToFreind(item)">
						<text class="cuIcon text-gray cuIcon-share"></text>
						<text class="text-gray">{{share}}</text>
					</view>
				</view>
			</view>
			<text class="line-grey" v-if="index<goodsList.length-1"></text>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:shareModel="shareModel"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import { parseTime } from '@/utils/time';
	import {  
	    mapState 
	} from 'vuex';  
	export default {
		components: {
			share
		},
		data() {
			return {
				isJustShare: false,
				shareModel: {}
			};
		},
		props: {
			showDetail: {
				type: Boolean,
				default: false
			},
			isPaid: {
			    type: Boolean,
			    default: false
			},
			isPromoter: {
			    type: Boolean,
			    default: false
			},
			showCollection: {
				type: Boolean,
				default: false
			},
			expired: {
				type: String,
				default: '订单已过期'
			},
			playCount: {
			    type: String,
				default: '播放量'
			},
			promoterDesc: {
				type: String,
				default: '自己推广收益'
			},
			subPromoterDesc: {
				type: String,
				default: '客户推广收益'
			},
			hasPaiedDesc: {
				type: String,
				default: '已购买'
			},
			share: {
				type: String,
				default: '推广'
			},
			collection: {
				type: String,
				default: '收藏'
			},
			goodsList: {
				type: Array,
				default: function(){
					return [];
				}
			},
			navToDetailPage: {
				type: Function,
				default: function(item){}
			},
			toMyFavorite: {
				type: Function,
				default: function(item){}
			}
		},
		filters: {
			filterTime(v) {
				if(v>0) {
					return parseTime(v,'{y}-{m}-{d}');
				}
				return '--';
			}
		},
		computed: {
			...mapState(['ltr','android']),
			i18n() {
				return this.$t('order');
			},
			productList(){
				return this.goodsList;
			}
		},
		methods: {
			shareToFreind(item){
				if (this.showCollection) {
					item = item.product;
				}
				this.shareModel.type = item.producttype == 1 ? 'course' : 'product';
				this.shareModel.data = item;
				this.isJustShare = true;
				this.$refs.share.toggleMask();
				setTimeout(()=>{
					this.isJustShare = false;
				},300);
			},
			toFavorite(item){
				this.isJustShare = true;
				//处理收藏逻辑开始
				item.favorite=!item.favorite;
				// let list = this.goodsList;
				// let index = list.findIndex(val=>val.id === item.id);
				// this.goodsList[index]=item;
				this.toMyFavorite(item);
				//处理收藏逻辑结束
				setTimeout(()=>{
					this.isJustShare = false;
				},300);
			},
			//详情页
			navToDetail(item) {
				if(!this.isJustShare) {
					let title = item.title;
					this.navToDetailPage(item);
				}
			}
		},
	}
</script>

<style lang="scss">
/* 考场实景 */
	.product-section{
		//direction: rtl;
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		padding-top: 20rpx;
		.product-item{
			display:flex;
			flex-direction: row;
			width: 100%;
			padding-bottom: 40upx;
			position: relative;
			&:nth-child(2n+1){
				margin-left: 0%;
			}
			
			.line-grey {
				width: 100%;
				height: 1upx;
				position: absolute;
				bottom: 18upx;
				left: 0upx;
				background-color: #eee;
			}
		}
		
		.image-wrapper{
			width: 40%;
			height: 180upx;
			border-radius: 3px;
			overflow: hidden;
			position: relative;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
			.cuIcon-playfill {
				font-size: 60upx;
				position: absolute;
				left: 40%;
				top: 31%;
				opacity: 0.4;
			}
			
			.image-tip{
				position: absolute;
				right: 0%;
				bottom: 0%;
				text-align: center;
				line-height: 40upx;
				font-size: 22upx;
				color: #36343c;
				border-top-left-radius: 2px;
				border-bottom-right-radius: 3px;
				background: linear-gradient(left, #f9e6af, #ffd465);
				z-index: 1;
				padding-left: 10upx;
				padding-right: 10upx;
			}
			.image-tip-rtl{
				position: absolute;
				left: 0%;
				bottom: 0%;
				text-align: center;
				line-height: 40upx;
				font-size: 22upx;
				color: #36343c;
				border-top-right-radius: 2px;
				border-bottom-left-radius: 3px;
				background: linear-gradient(right, #f9e6af, #ffd465);
				z-index: 1;
				padding-left: 10upx;
				padding-right: 10upx;
			}
		}
		.product-item-title{
			display: row;
			width: 57%;
			margin-left: 3%;
			flex-direction: row;
			position: relative;
			.title{
				font-size: $font-lg;
				color: $font-color-dark;
				word-break: break-all;
				width: 100%;
				font-weight: bold;
			}
			.playcount{
				font-size: $font-normal;
				color: $font-color-light;
				width: 100%;
				&.red {
					color: red;
				}
			}
			.promoterDesc{
				font-size: $font-mini;
				color: $uni-color-primary;
				width: 100%;
				position: absolute;
				left: 0upx;
				bottom: 35upx;
				
				&.sub {
					bottom: 0upx;
				}
			}
			.price{
				font-size: $font-normal;
				color: $uni-color-primary;
				width: 100%;
				position: absolute;
				left: 0upx;
				bottom: 0upx;
			}
			.oldprice{
				margin:0 10upx;
				color: $font-color-light;
				text-decoration: line-through;
			}
			.product-item-btn{
				position: absolute;
				right: 1%;
				bottom: 2%;
			}
		}
		.product-item-title-rtl{
			//direction: rtl;
			display: flex;
			width: 57%;
			margin-right: 3%;
			flex-direction: column;
			position: relative;
			.title{
				font-size: $font-lg;
				color: $font-color-dark;
				word-break: break-all;
				width: 100%;
				font-weight: bold;
			}
			.playcount{
				font-size: $font-normal;
				color: $font-color-light;
				width: 100%;
				&.red {
					color: red;
				}
			}
			.promoterDesc{
				font-size: $font-mini;
				color: $uni-color-primary;
				width: 100%;
				position: absolute;
				left: 0upx;
				bottom: 36upx;
				
				&.sub {
					bottom: 0upx;
				}
			}
			.price{
				font-size: $font-normal;
				color: $uni-color-primary;
				width: 100%;
				direction: rtl;
				position: absolute;
				right: 0upx;
				bottom: 0upx;
			}
			.oldprice{
				margin-left: 10upx;
				color: $font-color-light;
				text-decoration: line-through;
			}
			.product-item-btn{
				position: absolute;
				left: 1%;
				bottom: 2%;
			}
		}
		.collection-btn{
			float: left;
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			//width: 96upx;
			height: 80upx;
			margin:0 10upx;
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
		}
		.share-btn {
			float: left;
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			//width: 96upx;
			height: 80upx;
			margin:0 10upx;
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
		}
		.cuIcon{
			font-size: 46upx;
		}
	}
</style>
