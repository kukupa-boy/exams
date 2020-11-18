<template>
	<view class="container">
		<view class="friend">
			<view class="avatar">
				<image class="portrait" :src="product.avatar || '/static/missing-face.png'"></image>
			</view>
			<view class="info-box">
				<text class="username">{{product.nickName || i18n.defaultNickName }}</text>
			</view>
			<view>
				<text class="text-green">{{i18n.helpTip}}</text>
			</view>
		</view>
		<view class="carousel">
			<view>
				<image :src="product.coverUrl"></image>
				<view v-if="android" class="price-desc">
					<view class="price-new">
						<text class="price-dor">￥</text>
						<text class="price-now">{{product.amount}}</text>
					</view>
				</view>
			</view>
		</view>
		<view :class="'introduce-section'+(ltr?'':' rtlDirection ')">
			<text class="title">{{product.productName}}</text>
			<view class="title-min">
				<text>{{product.synopsis || ''}}</text>
			</view>
			<button v-if="product.paid" class="cu-btn bg-gradual-green shadow-blur buy" @click="goHome()">{{i18n.completePay}}</button>
			<button v-if="!product.paid && hasLogin" class="cu-btn bg-gradual-orange shadow-blur buy" @click="buy()">{{ i18n.proxyBuy }}<text v-if="android">￥{{product.amount}}</text></button>
			<button v-if="!product.paid && !hasLogin" class="cu-btn bg-gradual-orange shadow-blur buy" open-type="getUserInfo" @getuserinfo="getWxUserInfoBuy">{{ i18n.proxyBuy }}<text v-if="android">￥{{product.amount}}</text></button>
			<view class="detail-desc">
				<view class="d-header">
					<text class="text-orange" v-if="!product.paid">{{i18n.helpWarn}}</text>
					<text class="text-green" v-if="product.paid">{{i18n.helpFeed}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { codeRecordInfo } from '@/api/share';
	import { recordOrderInfo } from '@/api/order';
	import { loginAsync, login } from '@/api/user';
	import { paymentProxyInfo } from '@/api/payment';
	import { categoryList } from '@/api/category';
	import {  
	    mapState,
		mapMutations
	} from 'vuex';  
	export default{
		data() {
			return {
				product: {
					favorite: false,
					activPrice: '',
					price: ''
				}
			};
		},
		computed: {
			...mapState(['ltr','config','android','langtype','hasLogin']),
			i18n () {  
			  return this.$t('proxy')
			}
		},
		async onLoad(options){
			let userid = options ? options.userid || 0 : 0;
			let id = options ? options.id || 0 : 0;
			// 代付需要变更上级则打开此注释代码
			// if(id) {
			// 	this.qrcodeRecordId(id);
			// }
			// if(userid) {
			// 	this.parentUser(userid);
			// }
			if(options && options.scene) {
				var scene = decodeURIComponent(options.scene);
				if(scene) {
					let recordid = Number(scene);
					if(recordid) {
						id = recordid;
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
			if(id>0){
			   await this.loadData(id);
			}else if(userid>0) {
				// 代付时变更上级
				// loginAsync(userid);
				// 代付不变更上级
				loginAsync();
			}
		},
		methods:{
			...mapMutations(['InitConfig','Login','resetlanguage','parentUser','qrcodeRecordId']),
			goHome() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			async loadData(recordid){
				recordOrderInfo(recordid).then((res)=>{
					this.product = res || null;
					if(this.product) {
						if(this.product.userId && this.product.userId>0){
							// 代付时变更上级
							// loginAsync(this.product.userId);
							// 代付不变更上级
							loginAsync();
						}
						this.resetlanguage(this.product.langtype);
						uni.setNavigationBarTitle({
							title:this.$t('proxy').title
						});
					}
				});
			},
			loginCallback(info,callback) {
				let loginRes = login(info);
				if(loginRes){
					loginRes.then(result=>{
						if(result && result.code ===0 && result.data && result.data.user){
							this.Login(result.data.user);
							this.InitConfig(result.data.config);
							if(callback){
								callback();
							}
						}
					})
				}
			},
			getWxUserInfoBuy(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						this.buy();
					});
				}
			},
			buy(){
				if(!this.android) {
					this.$api.msg(this.i18n.iosForbbiden);
				}else{
					if(this.product && this.product.recordId) {
						let that = this;
						paymentProxyInfo(this.product.recordId).then(res=>{
							if(res && res.data){
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.data.timeStamp,
									nonceStr: res.data.nonceStr,
									package: res.data.packageValue,
									signType: res.data.signType,
									paySign: res.data.paySign,
									success: function (res) {
										that.loadData(that.product.recordId);
									},
									fail: function (err) {
									}
								});	
							}
						});
					}
				}
			}
		},

	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 20upx;
		background: #fff;
	}
	.friend {
		width: 100%;
		height: 400upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
		}
	}
	.carousel {
		height: 400upx;
		width: 90%;
		position:relative;
		text-align: center;
		margin-left: 5%;
		margin-right: 5%;

		image {
			height: 400upx;
			width: 100%;
		}
		.price-desc {
			height: 90upx;
			width: 100%;
			position: absolute;
			bottom: 0upx;
			left: 0upx;
			background-color: black;
			opacity: 0.7;
			padding-left: 50upx;
			line-height: 95upx;
			.price-new {
				float: left;
				opacity: 1;
				.price-dor {
					color: white;
					font-weight: bold;
				}
				.price-now {
					color: white;
					font-size: $font-lg + 30upx;
					font-weight: bold;
				}
			}
			.price-info {
				height: 90upx;
				width: 100upx;
				float: left;
				margin-left: 20upx;
				position: relative;
				.price-old {
					width: 100%;
					text-decoration: line-through;
					height: 40%;
					line-height: 100%;
					position: absolute;
					left: 0upx;
					bottom: 0upx;
					color: #ccc;
				}
				.coupon-tip {
					width: 100%;
					height: 30upx;
					margin-top: 15%;
					position: absolute;
					left: 0upx;
					top: 0upx;
					align-items: center;
					font-size: $font-sm - 2upx;
					border-radius: 6upx;
					line-height: 30upx;
					transform: translateY(-4upx); 
					text-align: center;
				}
			}
		}
	}
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 40upx;
		text-align: center;
		.title{
			font-size: 32upx;
			font-weight: bold;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.title-min{
			font-size: $font-sm;
			color: #888;
			padding: 20upx 0;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.btn-group {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10upx;
		}
		.buy{
			width: 100%;
			height: 80upx;
			font-size: $font-lg;
			font-weight: bold;
			margin-top: 20upx;
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: $font-base;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 400upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #eee; 
			}
		}
	}
</style>
