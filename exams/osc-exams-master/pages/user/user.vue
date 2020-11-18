<template>  
    <view class="container">  
		
		<view class="user-section">
			<image class="bg" src="/static/my_bg_01.jpg"></image>
			<view :class="'user-info-box'+(ltr?'':' rtlDirection ')">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.avatar || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<view :class="'userid'+(ltr?'':'-rtl')">ID: {{userInfo.id}}</view>
					<view :class="'username'+(ltr?'':'-rtl')">{{userInfo.nickName || i18n.defaultNickName }}</view>
				</view>
				<view v-if="!hasLogin" class="user-info-login">
					<button class="cu-btn bg-orange shadow-blur" open-type="getUserInfo" @getuserinfo="getWxUserInfo">{{i18n.login}}</button>
				</view>
			</view>
			<view class="vip-card-box">
				<!-- <image class="card-bg" src="/static/card-bg.png" mode=""></image> -->
				<view class="b-btn" @click="navTo('/pages/promotion/promotion')">
					{{i18n.promotionCenter}}
				</view>
				<view class="tit">
					<text class="cuIcon cuIcon-wefill"></text>
					{{i18n.promotionTitle}}
				</view>
				<text class="e-m">{{i18n.promotionRequest}}</text>
				<text class="e-b">{{i18n.promotionTip}}</text>
			</view>
		</view>
		
		<view 
			class="cover-container"
			:style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>
			
			<!-- <view class="tj-sction">
				<view class="tj-item">
					<text class="num">128.8</text>
					<text>余额</text>
				</view>
				<view class="tj-item">
					<text class="num">0</text>
					<text>今日收益</text>
				</view>
				<view class="tj-item">
					<text class="num">20</text>
					<text>推广订单数</text>
				</view>
			</view> -->
			<!-- 订单 -->
			<!-- <view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/order?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=1')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>永久回看</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>推广订单</text>
				</view>
			</view> -->
			<!-- 我的收藏 -->
			<view :class="'history-section icon'+(ltr?'':' rtlDirection ')">
				<!-- <button v-if="!hasLogin" :class="ltr?'':' button-rtl '" open-type="getUserInfo" @getuserinfo="gotoOrderList"><list-cell icon="cuIcon cuIcon-videofill" iconColor="#f37b1d" :title="getLang('orderTitle')" :navigateType="ltr?'right':'left'" @eventClick="navTo('/pages/order/order')"></list-cell></button> -->
				<list-cell icon="cuIcon cuIcon-videofill" iconColor="#f37b1d" :title="getLang('orderTitle')" :navigateType="ltr?'right':'left'" @eventClick="navTo('/pages/order/order')"></list-cell>
				<!-- <button v-if="!hasLogin" :class="ltr?'':' button-rtl '" open-type="getUserInfo" @getuserinfo="gotoCollection"><list-cell icon="cuIcon cuIcon-favorfill" iconColor="#54b4ef" :title="getLang('myCollection')" :navigateType="ltr?'right':'left'" @eventClick="navTo('/pages/collection/collection')"></list-cell></button> -->
				<list-cell icon="cuIcon cuIcon-favorfill" iconColor="#54b4ef" :title="getLang('myCollection')" :navigateType="ltr?'right':'left'" @eventClick="navTo('/pages/collection/collection')"></list-cell>
				<list-cell icon="cuIcon cuIcon-wefill" iconColor="#e07472" :title="getLang('promotionCenter')" :navigateType="ltr?'right':'left'" @eventClick="navTo('/pages/promotion/promotion')"></list-cell>
				<list-cell icon="cuIcon cuIcon-message" iconColor="#5fcda2" :title="getLang('feedback')" :navigateType="ltr?'right':'left'" @eventClick="navTo('/pages/feedback/feedback')"></list-cell>
				<list-cell icon="cuIcon cuIcon-global" iconColor="#9789f7" :title="getLang('language')" :navigateType="ltr?'right':'left'" @eventClick="changeLang()"></list-cell>
			</view>
			<view class="carousel-section m-t">
				<swiper class="carousel" autoplay="true" circular>
					<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="bannerNavTo(item.httpUrlType, item.httpUrl)">
						<image :src="ltr? item.httpFileUrl : item.httpFileYuUrl" />
					</swiper-item>
				</swiper>
			</view>
			<view v-if="config.customerWechat" class="copywechat m-t">
				<view class="tit-box">
					<text>{{ i18n.customerWechatTip }}：</text>
					<text>{{config.customerWechat}}</text>
				</view>
				<view class="text-orange" style="margin-bottom: 100upx;">
					<text @click="copyWechatNumber()">{{ i18n.customerCopy }}</text>
				</view>
			</view>
		</view>
			
		
    </view>  
</template>  
<script>
	import { login, loginAsync } from '@/api/user';
	import { banners } from '@/api/banner';
	import listCell from '@/components/mix-list-cell';
    import {  
        mapState,
		mapMutations
    } from 'vuex';  
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				carouselList: []
			}
		},
		onLoad(){
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
        computed: {
			...mapState(['hasLogin','userInfo','ltr','promoter','config']),
			i18n () {  
			  return this.$t('user')
			}
		},
		created() {
			this.loadData();
			// if(!this.userInfo || !this.userInfo.nickName) {
			// 	this.loginCallback();
			// }
		},
        methods: {
			...mapMutations(['language','Login','InitConfig']),
			getLang(title){
				let keys = Object.keys(this.i18n);
				for (const locale of keys) {
					if (title.indexOf(locale) > -1) {
					  return this.i18n[locale]
					}
				}
				return ' ';
			},
			async loadData() {
				let carouselList = await banners(3);
				this.carouselList = carouselList;
			},
			//详情页
			navToDetailPage(item) {
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			copyWechatNumber(){
				uni.setClipboardData({
					data: this.config.customerWechat,
					success: function () {
						console.log('success')
					}
				});
			},
			changeLang() {
				if(this.ltr) {
					this.language('zhuy');
					//this.$i18n.locale = 'zhuy';
				}else {
					this.language('zhcn');
					//this.$i18n.locale = 'zhcn';
				}
				let title = this.$t('index').userTitle;
				uni.setNavigationBarTitle({
				　　title: title
				})
			},
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
			getWxUserInfo(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo);
				}
			},
			// gotoOrderList(res) {
			// 	
			// },
			// gotoCollection(res){
			// 	console.log(res);
			// },
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				uni.navigateTo({  
					url
				})  
			}, 
			bannerNavTo(ctype, url){
				if(ctype===1) {
					uni.navigateTo({
						url: '/pages/website/website?url='+url
					});
				}else if(ctype===12){
					uni.navigateToMiniProgram({
						appId : url
					});
				}else {
					uni.navigateTo({  
						url: url
					});
				}
			},
			/**
			 *  下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
        }  
    }  
</script>  
<style lang='scss'>
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}
	.user-section{
		height: 520upx;
		padding: 100upx 30upx 0;
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
		.username-rtl{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-right: 20upx;
		}
		.userid {
			font-size: $font-sm;
			color: $font-color-base;
			margin-left: 20upx;
		}
		.userid-rtl {
			font-size: $font-sm;
			color: $font-color-base;
			margin-right: 20upx;
		}
		.user-info-login {
			margin: 0upx 20% 0upx 10%;
			button{
				width: 140upx;
			}
		}
	}

	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0,0,0,.7), rgba(0,0,0,.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;
		.card-bg{
			position:absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}
		.b-btn{
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;
			.cuIcon{
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}
	.cover-container{
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
		button{
			border: 0upx;
			border-radius: 0upx;
			background: #fff;
			height: auto;
			margin: 0upx 0upx;
			padding:0rpx;
			text-align: left;
		}
		.button-rtl{
			text-align: right;
		}
		button:after {
			border: 0upx;
			border-radius: 0upx;
			
		}
		button:hover {
			border: 0upx;
			border-radius: 0upx;
			background:#fafafa;
			padding:0rpx;
		}
		.button-hover {
			border: 0upx;
			border-radius: 0upx;
			background:#fafafa;
			margin: 0upx 0upx;
			padding:0rpx;
		}
	}
	/* 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;
		direction: rtl;
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}
	}
	.carousel {
		width: 100%;
		height: 135upx;
	
		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 0upx;
			overflow: hidden;
		}
		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	.tit-box {
		color: $font-color-light;
	}
	.copywechat {
		text-align: center;
		margin-top: 16upx;
		margin-bottom: 50upx;
	}
</style>