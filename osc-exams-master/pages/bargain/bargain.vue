<template>
	<view class="container" :class="rtlClazz+(!showEmpty?' bg-gradual-orange':'')">
		<view class="bargainProduct">
			<view class="avater">
				<image :src="bargain.avatar"></image>
			</view>
			<view class="introdution">
				<view>{{i18n.personNameForStudy|filterPriceOrTime(this.bargain.nickName)}}</view>
				<view>{{i18n.helpBargainToLowwerPrice}}</view>
			</view>
			<view class="product text-black">
				<view class="productImg">
					<image :src="bargain.coverUrl" :mode="scaleToFill"></image>
				</view>
				<view class="productIntroduce">
					<view>{{bargain.productName}}</view>
					<view class="detail">{{bargain.summary}}</view>
					<view><text>{{i18n.origainPrice|filterPriceOrTime(this.bargain.totalmoney)}}</text><text class="text-red">{{i18n.currentPrice|filterPriceOrTime(this.bargain.amount)}}</text></view>
				</view>
			</view>
		</view>
		<view v-if="bargain && userInfo.id != bargain.userId">
			<view class="barginButton" >
				<view><rich-text :nodes="residualTime"></rich-text></view>
				<view class="buttonGulp">
					<button v-if="!hasLogin" class="cu-btn bg-gradual-green round lg" open-type="getUserInfo" @getuserinfo="getWxUserInfoBargain">{{i18n.helpBargain}}</button>
					<button v-if="hasLogin" class="cu-btn bg-gradual-green round lg" @click="helpBargain">{{i18n.helpBargain}}</button>
					<button class="cu-btn bg-white round lg" @click="onSelfBargain">{{i18n.self_bargain}}</button>
				</view>
			</view>
		</view>
		<view v-if="bargain && userInfo.id == bargain.userId">
			<view class="barginButton" >
				<view><rich-text :nodes="resetactivityTime"></rich-text></view>
				<view class="buttonGulp">
					<button v-if="!hasLogin" class="cu-btn bg-gradual-green round lg" open-type="getUserInfo" @getuserinfo="getWxUserInfoBuy">{{i18n.immediateBuy}}</button>
					<button v-if="hasLogin" class="cu-btn bg-gradual-green round lg" @click="immediateBuy">{{i18n.immediateBuy}}</button>
					<button class="cu-btn bg-white round lg" @click="waitThink">{{i18n.waitThink}}</button>
				</view>
			</view>
		</view>
		<view class="bargainFriends">
			<view class="bargainFriendsTitle text-black text-bold">
				{{i18n.help_friends}}
			</view>
			<view v-if="showEmpty" class="text-center">
				{{i18n.empty}}
			</view>
			<scroll-view 
			v-if="!showEmpty"
			scroll-y="true" 
			class="scrollbox" 
			refresher-background="white" 
			@scrolltolower="lower" 
			refresher-enabled="true"
			@refresherpulling="onPulling"
			@refresherrefresh="onRefresh"
			@refresherrestore="onRestore" 
			@refresherabort="onAbort"
			:refresher-triggered="triggered">
				<view v-if="!showEmpty">
					<view class="friendsItem" v-for="(item,index) in list" :key="index">
						<view class="avater">
							<image :src="item.httpjoinuseravatarurl"></image>
						</view>
						<view>
							<text>{{item.joinusernick}}</text>
							<text>{{item.createdon|useHelpBargainTime}}</text>
						</view>
						<view class="text-black">{{i18n.bargain_detailPrice|filterPriceOrTime(item.amount)}}</view>
					</view>
				</view>
				<view v-else>
					<empty :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex';
	import {codeRecordInfo} from '@/api/share';
	import { loginAsync, login } from '@/api/user';
	import {orderBargain,bargainRecords,bargainSubmit,paymentWechatMiniOrder} from '@/api/bargin';
	import {formatDateTime,timeConvert} from "../../utils/time.js"
	import empty from "@/components/bargain_empty";
	export default {
		data() {
			return {
				bargain:{
					avatar: null,
					coverUrl: null,
					productName: null,
					amount: null,
					nickName: null,
					summary: null,
					totalmoney: null,
					bargainendtime: null,
				},
				list:[],
				page:1,
				orderid:null,
				timeForInterval:"",
				loadType:"",
				triggered:false,
				freshing:true,
				showEmpty:false,
				fromscan: false // 是否来源为扫码
			}
		},
		computed: {
			...mapState(['rtlClazz','userInfo','langtype','hasLogin','android']),
			i18n () {
			  return this.$t('bargain')
			},
			residualTime(){
				return this.i18n.residual_value.replace("XXX",this.bargain.bargainamount).replace("XXX",this.bargain.bargainmaxamount - this.bargain.bargainamount);
			},
			resetactivityTime(){
				return this.i18n.activity_endtime.replace("XXX",this.timeForInterval);
			}
		},
		filters: {
		  filterPriceOrTime: function (value,value1) {
			return value.replace("XXX",value1)
		  },
		  useHelpBargainTime: function (value) {
		  	return timeConvert(value)
		  }
		},
		components:{
			empty
		},
		onLoad(options) {
			let title = this.$t('bargain').title;
			uni.setNavigationBarTitle({
				title:title
			});
			this.getUserId(options);
			this.$nextTick(function(){
				this.setIntervalForTime()
			})
			// 异步登录
			if(!this.hasLogin) {
				loginAsync();
			}
		},
		methods: {
			...mapMutations(['resetlanguage']),
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
			async getUserId(options){
				if(options) {
					if(options.scene) {
						var scene = decodeURIComponent(options.scene);
						if(scene) {
							let recordid = Number(scene);
							if(recordid) {
								let record = await codeRecordInfo(recordid);
								if(record){
									this.orderid = record.entityId;
									this.resetlanguage(record.langtype);
									this.fromscan = true;
								}
							}
						}
					}else if(options.orderid){
						this.orderid = Number(options.orderid);
					}
					if(this.orderid > 0) {
						this.getUserBargainInfo();
						this.getBargainShareInfoList();
					}
				}
			},
			async getUserBargainInfo(){
				let data = await orderBargain(this.orderid,this.langtype);
				this.bargain = data || this.bargain;
			},
			async getBargainShareInfoList(type="add"){
				// 防止重复刷新，上啦刷新的情况，下拉加载
				if(type==="refresh"){
					this.page=1;
				} 
				if(this.loadType === 'nomore') {
					return ;
				}
				if(this.loadType==="loading"){
					return ;
				}
				this.loadType="loading";
				let data = await bargainRecords(this.orderid,this.page)
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
			lower(e){
				this.getBargainShareInfoList()
			},
			setIntervalForTime(){
				setInterval(()=>{
					this.timeForInterval = formatDateTime(this.bargain.bargainendtime);
					console.log("倒计时过程中....")
				},1000)
			},
			getWxUserInfoBargain(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						this.helpBargain();
					});
				}
			},
			async helpBargain(){
				let data = await bargainSubmit(this.orderid);
				if(data){
					this.getUserBargainInfo(this.orderid);
					this.getBargainShareInfo(this.orderid,this.page)
				}else{
					this.$api.msg(this.i18n.failBargain)
				}
			},
			onSelfBargain() {
				// 自己想参与砍价
				if(this.bargain && this.bargain.productId) {
					if(this.bargain.productype===0){
						uni.navigateTo({
							 url: `/pages/video/video?id=${this.bargain.productId}`
						})
					}else{
						uni.navigateTo({
							url: `/pages/video/course?id=${this.bargain.productId}`
						})
					}
				}
			},
			waitThink() {
				// 是否立即支付，砍价为自己时，再考虑的点击事件
				// 用户来源，若是扫码进入，那么此事件无法进行返回
				// 用户来源，若是从商品详情页进行，则可以返回
				if(this.fromscan === true) {
					//来源扫码
					uni.reLaunch({
						url: 'pages/index/index'
					});
				}else {
					uni.navigateBack({
						delta:1
					});
				}
			},
			onPulling(e){
				this.freshing = false;
				setTimeout(() => {
					this.triggered = true;
				}, 1000)
			},
			onRefresh(){
				if (this.freshing) return;
				this.freshing = true;
				setTimeout(() => {
					this.triggered = false;
					this.freshing = false;
				}, 3000)
			},
			onRestore(){
				this.getBargainShareInfoList("refresh")
				this.triggered = 'restore'; // 需要重置
			},
			onAbort(){
				// 刷新终止
			},
			getWxUserInfoBuy(res) {
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						this.immediateBuy();
					});
				}
			},
			async immediateBuy(){
				if(!this.android) {
					return this.$api.msg(this.i18n.iosForbbiden);
				}
				let res = await paymentWechatMiniOrder(this.orderid);
				if(res){
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.timeStamp,
						nonceStr: res.nonceStr,
						package: res.packageValue,
						signType: res.signType,
						paySign: res.paySign,
						success: (res) =>{
							this.$api.msg(this.i18n.successPay);
							setTimeout(()=>{
								if(this.bargain.productype===0){
									uni.redirectTo({
										 url: `/pages/video/video?id=${this.bargain.productId}`
									})
								}else{
									uni.redirectTo({
										url: `/pages/video/course?id=${this.bargain.productId}`
									})
								}
							},1500);
						},
						fail: (err) => {
							console.log('fail:' + JSON.stringify(err));
							this.$api.msg(this.i18n.failPay)
						}
					});	
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-image: linear-gradient(45deg, #ff9700, #ed1c24);
		color: #ffffff;
	}
	.container{
		padding-bottom:30rpx;
		padding-top: 30rpx;
	}
	.bargainProduct{
		margin:0rpx 32rpx;
		padding:32rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border-radius: 16rpx;
		background-color: rgba(244, 244, 244, 0.4);
		.avater{
			width:160rpx;
			height:160rpx;
			border-radius: 100%;
			image{
				width:100%;
				height:100%;
				border-radius: 100%;
				border: 8rpx solid rgba(244, 244, 244, 0.6);
			}
		}
		.introdution{
			padding:16rpx 0px;
			width:100%;
			view{
				text-align: center;
			}
			view:nth-of-type(1){
				font-size: 32rpx;
				display: flex;
				justify-content: space-around;
				flex-direction: row;
			}
			view:nth-of-type(2){
				margin-top:16rpx;
			}
		}
		.product{
			width:100%;
			margin: 24rpx 30rpx 0rpx 30rpx;
			padding:16rpx;
			background-color: white;
			align-items: center;
			display: flex;
			flex-direction: row;
			border-radius: 10rpx;
			overflow: hidden;
			.productImg{
				width: 36%;
				height:160rpx;
				image{
					height:100%;
					border-radius: 6rpx;
				}
			}
			.productIntroduce{
				width: 60%;
				padding:16rpx;
				flex: 1;
				view{
					display: flex;
					justify-content: space-around;
				}
				.detail{
					display: block;
					overflow: hidden;
					text-align: left;
					white-space: nowrap;
					text-overflow: ellipsis;
					width:400rpx;
				}
				view:nth-of-type(3){
					margin-top:8rpx;
					font-size: 22rpx;
					text:nth-of-type(1){
						text-decoration: line-through;
					}
				}
			}
		}
	}
	.barginButton{
		margin:0rpx 32rpx;
		padding:32rpx;
		view{
			padding-top:16rpx;
			text-align: center;
		}
		view:nth-of-type(1){
			font-size: 32rpx;
		}
		.buttonGulp{
			display: flex;
			justify-content: space-around;
			flex-direction: row;
		}
	
	}
	.bargainFriends{
		margin:0 30rpx;
		padding:32rpx;
		border-radius: 16rpx;
		overflow: hidden;
		background-color: rgba(244, 244, 244, 0.4);
		.bargainFriendsTitle{
			margin:0 auto;
			text-align: center;
			font-size: 32rpx;
			line-height: 40rpx;
			padding-bottom:32rpx;
		}
		.scrollbox{
			height:630rpx;
			.friendsItem{
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				align-items: center;
				padding:15rpx;
				view:nth-of-type(1){
					width:90rpx;
					height:90rpx;
					border-radius: 100%;
					image{
						width:100%;
						height:100%;
						border-radius: 100%;
						border: 6rpx solid rgba(244, 244, 244, 0.4);
					}
				}
				view:nth-of-type(2){
					flex:4;
					display: flex;
					align-items: space-around;
					flex-direction: column;
					padding: 16rpx;
					text:nth-of-type(1){
						font-size: 24rpx;
					}
				}
				view:nth-of-type(3){
					flex:2;
					text-align: center;
					font-size: 24rpx;
				}
			}
		}
	}
</style>
