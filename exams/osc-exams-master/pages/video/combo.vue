<template>
	<view class="content" :class="rtlClazz">
		<!-- 区域名称 -->
		<!-- <view :class="'f-header'+(ltr?'':' rtlDirection ')">
			<text class="lg text-orange cuIcon-locationfill" :class="ltr?'':' image-rtl '"></text>
			<view class="tit-box">
				<text class="tit">{{ ltr?exam.name:exam.yuname }}</text>
			</view>
			<picker @change="PickerChange" :value="pickerIndex" :range="exams" :range-key="ltr?'name':'yuname'" class="cu-btn line-grey shadow">
				<text class="text-grey cuIcon-refresh" :class="ltr?'':' image-rtl '"></text>{{i18n.examChange}}
			</picker>
		</view> -->
		<view class="combo-box">
			<image :src="comboInfo.httpimageurl"></image>
			<view class="title">
				<view class="text-bold price">￥{{ comboInfo.price }} <view class="cu-tag round line-pink margin-left-sm margin-right-sm ">{{comboInfo.name}}</view> </view>
				<view class="text-bold">{{comboInfo.descrip}}</view>
			</view>
			
		</view>
		<view class="f-header">
			<view class="tit-box">
				<text class="tit">{{i18n.combotip}}</text>
			</view>
		</view>
		<view class="productItem">
			<product-item :showDetail="true" :goodsList="comboInfo.products" :navToDetailPage="navToDetailPage" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :share="i18n.detail"></product-item>
		</view>
		<!-- <uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more> -->
		<view class="btn-group">
			<view class="cu-btn bg-gradual-orange round" @click="buy">{{i18n.btnpay}}(￥{{ comboInfo.price }})</view>
		</view>
	</view>
</template>

<script>
	import { shareInfoOfHome } from '@/api/share';
	import { loginAsync } from '@/api/user';
	import { comboActivityInfo } from '@/api/combo';
	import { paymentWechatMiniCombo } from '@/api/payment';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import productItem from '@/components/exams-product-item';
	import {  
	    mapState,
		mapMutations
	} from 'vuex'; 
	export default {
		components: {
			uniLoadMore,
			productItem
		},
		data() {
			return {
				shareInfo: null,
				pickerIndex: 0,
				loadingType: 'more', //加载更多状态
				page: 1,
				goodsList: [],
				shareList: [],
				exam: {
					id: 0
				},
				exams: [],
				city: { name: '未授权'},
				comboInfo: null,
				clicked: false,
				navToDetailPage: function(item){
					let id = item.id;
					let url = `/pages/video/video?id=${id}`;
					if(item.producttype == 1) {
						url = `/pages/video/course?id=${id}`;
					}
					uni.redirectTo({
						url: url
					});
				}
			};
		},
		computed: {
			...mapState(['ltr','langtype','hasLogin','rtlClazz','android']),
			i18n () {  
			  return this.$t('videolist')
			}
		},
		onLoad(options) {
			this.loadData(Number(options.id));
		},
		created() {
			//分享情况下，以上三个对象可能为空：BUG,那么分享的时候直接进首页
			shareInfoOfHome(this.langtype).then(res=>{
				this.shareInfo = res;
			});
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			//加载分类
			async loadShareList(){
				this.shareList = await this.$api.json('shareList');
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(activityid) {
				comboActivityInfo(activityid).then((res) => {
					this.comboInfo = res;
				});
			},
			buy() {
				if(!this.android) {
					this.$api.msg(this.i18n.iosForbbiden);
				}else{
					if(this.comboInfo && this.comboInfo.id && this.comboInfo.products  && this.comboInfo.products.length > 0) {
						let that = this;
						if (this.clicked) {
							return;
						}
						this.clicked = true;
						paymentWechatMiniCombo(this.comboInfo.id).then(res=>{
							if(res){
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.timeStamp,
									nonceStr: res.nonceStr,
									package: res.packageValue,
									signType: res.signType,
									paySign: res.paySign,
									success: (result) => {
										this.navToDetailPage(this.comboInfo.products[0]);
										console.log('success:' + JSON.stringify(result));
									},
									fail: (err) => {
										console.log('fail:' + JSON.stringify(err));
										this.clicked = false;
									}
								});	
							}else {
								this.clicked = false;
							}
						});
					}
				}
			},
			PickerChange: function(e) {
				this.exam = this.exams[e.target.value];
				this.loadData('refresh');
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: #FFFFFF;
	}
	.content {
		padding-bottom: 120rpx;
		position: relative;
		.btn-group {
			position: fixed;
			bottom: 10rpx;
			left: 0rpx;
			width: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 30rpx;
			.cu-btn {
				width: 100%;
				height: 80rpx;
				font-size: $font-lg;
			}
		}
	}
	.combo-box {
		border-bottom: 2rpx solid #f8f8f8;
		image {
			width: 100%;
			height: 420rpx;
		}
		.title {
			padding: 10rpx 30rpx 30rpx;
			.price {
				font-size: 60rpx;
			}
		}
	}
	.f-header{
		display:flex;
		align-items:center;
		height: 100upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		.cuIcon-locationfill{
			flex-shrink: 0;
			font-size: 50upx;
			margin-right: 10upx;
		}
		.cuIcon-activityfill{
			flex-shrink: 0;
			font-size: 50upx;
			margin-right: 10upx;
		}
		.cuIcon-refresh {
			margin-right: 10upx;
		}
		.image-rtl{
			margin-left: 10upx;
			margin-right: 0upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit{
			font-size: $font-lg;
			color: #font-color-dark;
			font-weight: bold;
		}
		.icon-you{
			font-size: $font-lg;
			color: $font-color-light;
		}
	}
	.productItem{
		background-color: #fff;
		padding-top: 20upx;
	}
	.cuIcon{
		font-size: 46upx;
	}

</style>
