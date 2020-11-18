<template>
	<view class="container">
		<view class="carousel">
			<view v-if="tryplay">
                <video id="myVideo" :src="src" 
				objectFit="fill"
				@error="videoErrorCallback" @waiting="videoWaitingCallback" 
				@timeupdate="videoTimeUpdateCallback"
				autoplay="true"
				:show-center-play-btn="disable" :poster="product.httpCoverUrl">
					<view class="video-time" v-if="!product.paied">{{i18n.tryPlayTime.replace('XXX',maxPlayTime)}}<text @click="buy()" class="text-orange">{{i18n.tryPlayBtn}}</text></view>
				</video>
            </view>
			<view v-if="tryplay==false && product.paied">
				<image :src="product.httpCoverUrl"></image>
				<button class="cu-btn bg-video shadow-blur round paid-play" @click="videoPlay()">{{i18n.playVideo}}</button>
			</view>
			<view v-if="tryplay==false && !product.paied">
				<image :src="product.httpCoverUrl"></image>
				<view v-if="android" class="price-desc">
					<view class="price-new">
						<text class="price-dor">￥</text>
						<text v-if="product.activity" class="price-now">{{product.activPrice}}</text>
						<text v-if="!(product.activity)" class="price-now">{{product.price}}</text>
						<!-- <text class="price-dor">.90</text> -->
					</view>
					<view v-if="product.activity" :class="'price-info'+(ltr?'':' rtlDirection ')">
						<view class="bg-orange coupon-tip">{{product.activity.name}}</view>
						<view class="price-old">￥{{product.price}}</view>
					</view>
					<view v-if="product.activity" :class="'activity-info'+(ltr?'':' rtlDirection ')">
						<view class="activity-desc">{{i18n.activiEnd}}</view>
						<view :class="'activity-time'+(ltr?'':' rtlDirection ')">
							<text class="timespace">{{activity.day}}</text>
							<text>天</text>
							<text class="timespace">{{activity.hour}}</text>
							<text>时</text>
							<text class="timespace">{{activity.minute}}</text>
							<text>分</text>
							<text class="timespace">{{activity.seconds}}</text>
							<text>秒</text>
						</view>
					</view>
				</view>
				<button v-if="tryplayend==false && maxPlayTime>1" class="cu-btn bg-video shadow-blur round tryplay" @click="videoPlay()">{{i18n.tryPlay}}</button>
				<button v-if="tryplayend" class="cu-btn bg-video shadow-blur round tryplay" @click="videoTryPlayEnd()">{{i18n.tryPlayEnd}}</button>
			</view>
		</view>
		
		<view :class="'introduce-section'+(ltr?'':' rtlDirection ')">
			<text class="title">{{product.name}}</text>
			<view class="title-min">
				<text>{{product.synopsis || ''}}</text>
			</view>
			<!-- <view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">341.6</text>
				<text class="m-price">¥488</text>
				<text class="coupon-tip">7折</text>
			</view> -->
			<view class="bot-row">
				<view class="playcount"><text>{{i18n.playCount}}</text><text class="text-blue">{{product.totalPlay}}</text></view>
				<view class="collection-btn" :class="product.favorite?'text-orange':'text-gray'" @click="toFavorite">
					<text v-if="!product.paied" class="cuIcon" :class="product.favorite?'cuIcon-favorfill':'cuIcon-favor'"></text>
					<text v-if="!product.paied">{{i18n.collection}}</text>
				</view>
				<view class="share-btn" @click="share">
					<text class="cuIcon text-gray cuIcon-share"></text>
					<text class="text-gray">{{i18n.share}}</text>
				</view>
				<view class="share-btn" v-if="product && (product.bargain || product.bargainorderid>0)" @click="bargainNav">
					<text class="cuIcon text-gray cuIcon-creative"></text>
					<text class="text-gray">{{i18n.creative}}</text>
				</view>
			</view>
			<view class="btn-group" v-if="!product.paied && hasLogin && hasTel && product.price > 0">
				<button class="cu-btn bg-gradual-orange shadow-blur buy" @click="buy()">{{ android?i18n.rewards:i18n.tryPlayBtn}}<text v-if="android" class="margin-left-xs margin-right-xs">￥{{product.activPrice}}</text></button>
				<button class="cu-btn bg-gradual-green shadow-blur freindbuy" @click="proxypay()">{{i18n.freindPay}}</button>
			</view>
			<view class="btn-group" v-if="!product.paied && hasLogin && !hasTel && product.price > 0">
				<button class="cu-btn bg-gradual-orange shadow-blur buy" open-type="getPhoneNumber" @getphonenumber="getUserPhoneBuy">{{ android?i18n.rewards:i18n.tryPlayBtn}}<text v-if="android" class="margin-left-xs margin-right-xs">￥{{product.activPrice}}</text></button>
				<button class="cu-btn bg-gradual-green shadow-blur freindbuy" open-type="getPhoneNumber" @getphonenumber="getUserPhoneProxyBuy">{{i18n.freindPay}}</button>
			</view>
			<view class="btn-group" v-if="!product.paied && !hasLogin && product.price > 0">
				<button class="cu-btn bg-gradual-orange shadow-blur buy" open-type="getUserInfo" @getuserinfo="getWxUserInfoBuy">{{ android?i18n.rewards:i18n.tryPlayBtn}}<text v-if="android" class="margin-left-xs margin-right-xs">￥{{product.activPrice}}</text></button>
				<button class="cu-btn bg-gradual-green shadow-blur freindbuy" open-type="getUserInfo" @getuserinfo="getWxUserInfoProxyBuy">{{i18n.freindPay}}</button>
			</view>
			<view v-if="!product.paied && product.price > 0" class="detail-desc">
				<view class="d-header text-orange">
					<text>{{i18n.rewardsDesc}}</text>
				</view>
			</view>
		</view>
		<view class="comboactivty-box" v-if="product  && !product.paied && product.comboactivity" @click="onComboActivity">
			<image :src="product.comboactivity.httpimageurl"></image>
			<view class="title">
				<view class="price text-red">￥{{ product.comboactivity.price }} <view class="cu-tag round line-pink margin-left-sm margin-right-sm ">{{product.comboactivity.name}}<text class="cuIcon" :class="ltr?'cuIcon-right':'cuIcon-back'"></text><text class="cuIcon" :class="ltr?'cuIcon-right':'cuIcon-back'"></text>
				</view>
				</view>
				<view>{{ product.comboactivity.descrip }}</view>
			</view>
		</view>
		<!-- 区域名称 -->
		<view :class="'f-header m-t'+(ltr?'':' rtlDirection ')">
			<text class="lg text-orange cuIcon-locationfill" :class="ltr?'':' image-rtl '"></text>
			<view class="tit-box">
				<text class="tit">{{ltr?exam.name:exam.yuname}}</text>
			</view>
			<picker @change="PickerChange" :value="pickerIndex" :range="exams" :range-key="ltr?'name':'yuname'" class="cu-btn line-grey shadow">
				<text class="text-grey cuIcon-refresh" :class="ltr?'':' image-rtl '"></text>{{i18n.examChange}}
			</picker>
		</view>
		<view class="productItem">
			<product-item :goodsList="goodsList" :navToDetailPage="navToDetailPage" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :share="i18n.share"></product-item>
		</view>
		<!-- 考场攻略 -->
		<view :class="'f-header m-t'+(ltr?'':' rtlDirection ')">
			<text class="lg text-orange cuIcon-activityfill" :class="ltr?'':' image-rtl '"></text>
			<view class="tit-box">
				<text class="tit">{{i18n.examStategy}}</text>
			</view>
		</view>
		<view class="productItem">
			<category-item :categories="categories"></category-item>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:shareModel="{data:product, type:'product'}"
		></share>
		<proxypay
			ref="proxypay" 
			:shareModel="{data:proxyInfo, type:'proxypay'}"
		></proxypay>
	</view>
</template>

<script>
	import { shareInfoOfProduct,codeRecordInfo, proxyOrderInfo } from '@/api/share';
	import { loginAsync, login, bindUserTel } from '@/api/user';
	import { productList, productInfo, videoInfo, videoPlay, videoCert, collecProduct } from '@/api/product';
	import { paymentInfo } from '@/api/payment';
	import { categoryList } from '@/api/category';
	import share from '@/components/share';
	import proxypay from '@/components/proxypay';
	import productItem from '@/components/exams-product-item';
	import categoryItem from '@/components/exams-category-item';
	import listCell from '@/components/mix-list-cell';
	import {  
	    mapState,
		mapMutations
	} from 'vuex';  
	export default{
		components: {
			share,
			proxypay,
			productItem,
			categoryItem,
			listCell
		},
		data() {
			return {
				code: null, // 授权手机号使用的code
				clicked: false,
				proxyInfo: null,
				shareInfo: null,
				pickerIndex: 0,
				isPickerChange: false,
				tryplay: false, //试看
				tryplayend: false, //是否试看结束
				disable: false,
				duration: 10,
				maxPlayTime: 0,
				src: '',
				specClass: 'none',
				specSelected:[],
				goodsList: [],
				product: {
					favorite: false,
					activPrice: '',
					price: ''
				},
				activity: {
					day: 0,
					hour: 0,
					minute: 0,
					seconds: 0
				},
				categories: [],
				timer: null,
				exam: this.$api.getExam(),
				exams: this.$api.getExams(),
				navToDetailPage: function(item){
					let id = item.id;
					uni.redirectTo({
						url: `/pages/video/video?id=${id}`
					})
				}
			};
		},
		computed: {
			...mapState(['ltr','config','android','langtype','hasLogin','hasTel']),
			i18n () {  
			  return this.$t('video')
			}
		},
		onShareAppMessage(res) {
			let user = this.$api.getUserInfo();
			let page = '/pages/video/video?id='+this.product.id;
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			  let id = res.target.id;
			  let type = res.target.dataset.type;
			  let title = res.target.dataset.name;
			  let imgurl = res.target.dataset.imgurl;
			  if(user && user.nickName) {
				  if(type==='proxypay') {
					title = this.$t('video').wantForHelp.replace('XXX',user.nickName);
				  }else{
					title = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY',title);
				  }
			  }
			  if(type === 'product') {
				  //产品分享
				  page = '/pages/video/video?id='+id;
			  }else if(type === 'article') {
				  //攻略分享
				  page = '/pages/article/article?id='+id;
			  }else if(type === 'proxypay') {
				  //代付
				  imgurl = null;
				  page = '/pages/video/proxy?id='+id;
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
			if(user && user.id>0) {
				page = page + "&userid=" + user.id;
			}
			let nickName = '';
			if(user && user.nickName) {
				nickName = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY','');
			}
			let shareImgurl = this.product.httpCoverUrl;
			if(!shareImgurl&&this.shareInfo && this.shareInfo.httpImageUrl) {
				shareImgurl = this.shareInfo.httpImageUrl;
				
			}
			if(shareImgurl){
				return {
					title: nickName + this.product.name,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page+'&langtype='+this.langtype
				}
			}else{
				return {
				  title: nickName + this.product.name,
				  path: page+'&langtype='+this.langtype
				}
			}
		},
		// created() {
		// 	this.loadData();
		// },
		async onLoad(options){
			let userid = options ? options.userid || 0 : 0;
			let id = options ? options.id || 0 : 0;
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
							id = record.entityId;
							this.resetlanguage(record.langtype);
						}
					}
				}
			}else if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
			if(id>0){
			   await this.loadData(id);
			}
			shareInfoOfProduct(this.langtype).then(res=>{
				this.shareInfo = res;
			});
			if(userid>0) {
				loginAsync(userid);
			}
			this.initPlayTime();
			this.initWxLogin();
		},
		onUnload() {
			if(this.timer) {
				clearInterval(this.timer);
			}
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif
		},
		methods:{
			...mapMutations(['InitConfig','Login','resetlanguage','parentUser','qrcodeRecordId','refreshUserTel']),
			onComboActivity() {
				uni.redirectTo({
					url:'/pages/video/combo?id='+this.product.comboactivity.id
				});
			},
			initWxLogin(){
				uni.login({
				  provider: 'weixin',
				  success: (loginRes) => {
					  this.code = loginRes.code;
				  }
				});
			},
			initPlayTime() {
				if(this.config && this.config.trytime>=0) {
					this.maxPlayTime = this.config.trytime;
				}else {
					this.maxPlayTime = -1;
				}
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
						if(this.hasTel) {
							this.buy();
						}else{
							this.$api.msg(this.i18n.telauthtip);
						}
					});
				}
			},
			getWxUserInfoProxyBuy(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						if(this.hasTel) {
							this.proxypay();
						}else{
							this.$api.msg(this.i18n.telauthproxytip);
						}
					});
				}
			},
			getUserPhoneBuy(res){
				let that = this;
				if(res && res.detail) {
					res.detail.code = this.code;
					bindUserTel(res.detail).then(result=>{
						if(result) {
							// 刷新hastel
							this.refreshUserTel(result);
							this.buy();
						}
					});
				}
			},
			getUserPhoneProxyBuy(res){
				let that = this;
				if(res && res.detail) {
					res.detail.code = this.code;
					bindUserTel(res.detail).then(result=>{
						if(result) {
							// 刷新hastel
							this.refreshUserTel(result);
							this.proxypay();
						}
					});
				}
			},
			async loadData(productId){
				if(this.timer) {
					clearInterval(this.timer);
				}
				//跳转到指定的s位置
				//this.videoContext.seek(100);	
				var videoRes = await productInfo(productId);
				this.product = videoRes? videoRes.data || {} : {};
				if(this.product && this.product.name) {
					uni.setNavigationBarTitle({
					　　title: this.product.name
					});
				}else {
					this.$api.msg(this.i18n.deleteTip);
					setTimeout(()=>{
						uni.navigateBack();
					},2000);
				}
				await this.loadProductList();
				await this.loadCategories();
			},
			async loadProductList(){
				let examid = this.exam.id;
				if(!examid) {
					this.exam = await this.$api.getExam();
					examid = this.exam.id;
				}
				let responseData = examid ? await productList(examid,this.langtype, 1, true) : null;
				let goodsList = responseData ? responseData.data : [];
				this.goodsList = [];
				if(goodsList && goodsList.length>0){
					goodsList.forEach(item=>{
						if(this.isPickerChange === false){
							if(item.id!==this.product.id) {
								this.goodsList.push(item);
							}
						}else{
							this.product = item;
							this.isPickerChange = false;
						}
					});
				}
				
				let that = this;
				that.timer = setInterval(function(){
					that.startActivity();
				}, 1000);
			},
			startActivity(){
				if(this.product && this.product.activity) {
					let startTime = this.product.activity.startTime;
					let endTime = this.product.activity.endTime;
					let now = new Date();
					var preTime=startTime-now.getTime();
					if(preTime<=0){
						var leftTime = endTime - now.getTime();
						var dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
						var hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
						var mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
						var ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
						this.activity.day = this.checkTime(dd);
						this.activity.hour = this.checkTime(hh);
						this.activity.minute = this.checkTime(mm);
						this.activity.seconds = this.checkTime(ss);
					}else{
						this.product.activity = null;
						clearInterval(this.timer);
					}
				}
			},
			checkTime(num) {
				if (num < 10) {
					num = "0" + num;
				}
				return num;
			},
			async loadCategories(){
				let cateRes= await categoryList(this.exam.id, true);
				this.categories = cateRes? cateRes.data || [] : [];
			},
			PickerChange: function(e) {
				this.exam = this.exams[e.target.value];
				this.isPickerChange = true;
				this.loadProductList();
				this.loadCategories();
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			videoWaitingCallback: function(e) {
				console.log(e)
			},
			videoTimeUpdateCallback: function(e) {
				if(!this.product.paied && this.maxPlayTime>=0) {
					if(e.detail.currentTime > this.maxPlayTime) {
						this.tryplay = false;
						this.tryplayend = true;
					}
				}
			},
			getMinVideo(playInfoList){
				if(playInfoList && playInfoList.length>0) {
					if(playInfoList.length == 1){
						return playInfoList[0];
					}else{
						let minbitrate = 0;
						let returnItem = null;
						for(let i=0; i!=playInfoList.length; ++i) {
							let item = playInfoList[i];
							let bitrate = Number(item.bitrate)
							if(minbitrate <=0){
								minbitrate = Number(item.bitrate);
								returnItem = item;
							}else if(minbitrate>bitrate) {
								minbitrate = bitrate;
								returnItem = item;
							}
						}
						return returnItem;
					}
				}
				return null;
			},
			videoPlay(){
				if(this.product) {
					if(this.product.paied) {
						videoPlay(this.product.id).then(res => {
							if(res && res.code === 0 && res.data){
								let playInfo = this.getMinVideo(res.data.playInfoList);
								if(playInfo) {
									this.src = playInfo.playURL;
									this.tryplay = true;
								}
							}
						});
					}else if (this.product.videoId){
						videoInfo(this.product.videoId).then(res => {
							if(res && res.code === 0 && res.data){
								let playInfo = this.getMinVideo(res.data.playInfoList);
								if(playInfo) {
									this.src = playInfo.playURL;
									this.tryplay = true;
								}
							}
						});
					}
				}
			},
			videoTryPlayEnd(){
				this.$api.msg(this.i18n.playTip);
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			bargainNav() {
				if(this.product.bargainorderid > 0) {
					uni.navigateTo({
						url: '/pages/bargain/bargain?orderid=' + this.product.bargainorderid
					});
				}else{
					uni.navigateTo({
						url: '/pages/poster/bargain?productid=' + this.product.id
					});
				}
			},
			proxypay() {
				if(this.product && this.product.id) {
					if(this.proxyInfo){
						this.$refs.proxypay.toggleMask();	
					}else{
						proxyOrderInfo(this.product.id,this.langtype).then((res)=>{
							this.proxyInfo = res;
							if(this.proxyInfo){
								this.$refs.proxypay.toggleMask();	
							}
						});
					}
				}
			},
			//收藏
			toFavorite(){
				this.product.favorite = !this.product.favorite;
				collecProduct(this.product.id);
			},
			buy(){
				if(!this.android) {
					this.$api.msg(this.i18n.iosForbbiden);
				}else{
					if(this.product && this.product.id) {
						let that = this;
						if (this.clicked) {
							return;
						}
						this.clicked = true;
						paymentInfo(this.product.id).then(res=>{
							if(res && res.data){
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.data.timeStamp,
									nonceStr: res.data.nonceStr,
									package: res.data.packageValue,
									signType: res.data.signType,
									paySign: res.data.paySign,
									success: function (res) {
										that.loadData(that.product.id);
										console.log('success:' + JSON.stringify(res));
									},
									fail: function (err) {
										console.log('fail:' + JSON.stringify(err));
										that.clicked = false;
									}
								});	
							}else {
								this.clicked = false;
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
	}
	#myVideo {
		direction:ltr !important;
		position: fixed;
		width: 100%;
		display: table;
		z-index: 1000;
	}
	.carousel {
		height: 422upx;
		width: 100%;
		position:relative;
		text-align: center;
		video{
			height: 422upx;
			width: 100%;
		}
		.video-time{
			background-color: black;
			opacity: 0.5;
			height: 50upx;
			color: white;
			position: absolute;
			right: 3%;
			top: 5%;
			font-size: $font-sm;
			border-radius: 26upx;
			text-align: center;
			line-height: 55upx;
			padding-left: 40upx;
			padding-right: 40upx;
		}
		image {
			height: 422upx;
			width: 100%;
		}
		.tryplay {
			position: absolute;
			top: 35%;
			left: 35.2%;
			padding: 0 60upx; 
		}
		.paid-play {
			position: absolute;
			top: 40%;
			left: 35.2%;
			padding: 0 60upx; 
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
			.activity-info {
				position: absolute;
				width: 50%;
				height: 100%;
				right: 0upx;
				.activity-desc{
					height: 50%;
					line-height: 100%;
					text-align: center;
					padding: 12upx;
					font-size: $font-sm;
					color: white;
				}
				.activity-time{
					height: 50%;
					line-height: 50%;
					text-align: center;
					padding: 10upx;
					color: #ccc;
					.timespace {
						background-color: #ccc;
						border-radius: 2upx;
						color: black;
						padding: 0upx 3upx;
						margin:0 6upx;
					}
				}
			}
		}
	}
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
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
		.bot-row{
			display:flex;
			align-items:center;
			height: 80upx;
			font-size: $font-sm;
			color: $font-color-base;
			text{
				flex: 1;
			}
			.playcount {
				float: left;
				width: 73%;
				.text-blue{
					margin-left: 10upx;
				}
			}
			.collection-btn{
				float: right;
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: $font-sm;
				width: 96upx;
				height: 80upx;
				.yticon{
					font-size: 40upx;
					line-height: 48upx;
					color: $font-color-light;
				}
				&.active, &.active .yticon{
					color: $uni-color-primary;
				}
			}
			.share-btn {
				float: right;
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: $font-sm;
				color: $font-color-base;
				width: 96upx;
				height: 80upx;
				.yticon{
					font-size: 40upx;
					line-height: 48upx;
					color: $font-color-light;
				}
				&.active, &.active .yticon{
					color: $uni-color-primary;
				}
			}
		}
		.btn-group {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10upx;
		}
		.buy{
			width: 60%;
			height: 80upx;
			font-size: $font-lg;
			font-weight: bold;
			margin-top: 20upx;
		}
		.freindbuy {
			width: 38%;
			height: 80upx;
			font-size: $font-lg;
			font-weight: bold;
			margin-top: 20upx;
		}
	}
	
	.comboactivty-box {
		width: 100%;
		margin: 15rpx 0rpx;
		background: #FFFFFF;
		position: relative;
		height: 420rpx;
		image {
			width: 100%;
			height: 420rpx;
		}
		.title {
			position: absolute;
			bottom: 40rpx;
			left: 5%;
			width: 90%;
			background: rgba($color: #FFFFFF, $alpha: 0.7);
			border-radius: 10rpx;
			padding: 15rpx;
			color: #000000;
			.price {
				font-size: 50rpx;
				.cuIcon {
					font-size: 20rpx;
					margin-right: -5rpx;
				}
			}
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
	
	.f-header{
		display:flex;
		align-items:center;
		height: 100upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		margin-bottom: 1upx;
		margin-top: 20upx;
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
