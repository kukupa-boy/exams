<template name="course">
	<view class="container">
		<!-- 空白页 -->
		<empty v-if="showEmpty" :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty>
		<scroll-view class="scrollcontainer" scroll-y v-if="!showEmpty" @scrolltolower="loadProduct">
			<!-- 头部轮播 -->
			<view class="carousel-section" v-if="carouselList && carouselList.length>0">
				<!-- 标题栏和状态栏占位符 -->
				<view class="titleNview-placing"></view>
				<!-- 背景色区域 -->
				<swiper class="carousel" autoplay="true" circular @change="swiperChange">
					<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="bannerNavTo(item.httpUrlType, item.httpUrl)">
						<image :src="ltr? item.httpFileUrl : item.httpFileYuUrl" />
					</swiper-item>
				</swiper>
				<!-- 自定义swiper指示器 -->
				<view class="swiper-dots">
					<text class="num">{{swiperCurrent+1}}</text>
					<text class="sign">/</text>
					<text class="num">{{swiperLength}}</text>
				</view>
			</view>
			<!-- <view class="btn_nav">
				<image :src="ltr?'/static/mini_nav_cn.png':'/static/mini_nav_yu.png'" @click="navToMini()" mode="aspectFit"></image>
			</view> -->
			<scroll-view scroll-x class="flex bg-white nav shadow" scroll-with-animation :scroll-left="scrollLeft">
				<view class="flex text-center">
					<view class="flex-sub cu-item" :class="index==tabCurrentIndex?'text-orange cur':''" v-for="(item,index) in categories" :key="index"
					 @tap="tabSelect" :data-id="index">
						<view class="linetext" :style="ltr?'':'direction: rtl;'">{{ ltr? item.name : item.yuname}}</view>
					</view>
				</view>
			</scroll-view>
			<product-item v-if="products && products.length > 0" :goodsList="products" :navToDetailPage="navToDetailPage" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :share="i18n.share"></product-item>
			<uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
		</scroll-view>
		<image :src="ltr ? zhuanImg.zhuanImgUrl : zhuanImg.zhuanImgYuUrl" class="zhuanGif" :class="ltr?'':'left'" @click="shareToFreind"></image>
		<!-- 分享 -->
		<shareBox 
			ref="share" 
			:shareModel="shareModel"
		></shareBox>
	</view>
</template>

<script>
	import { banners } from '@/api/banner';
	import { dynamicImages } from '@/api/share';
	import { productCategory, productPage } from '@/api/product';
	import productItem from '@/components/exams-product-item';
	import empty from "@/components/empty";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import shareBox from '@/components/share-box';
	import {  
        mapState 
    } from 'vuex';  
	export default {
		name: 'course',
		components:{
			shareBox,
			productItem,
			empty,
			uniLoadMore
		},
		data() {
			return {
				scrollLeft: 0,
				tabCurrentIndex: 0,
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				products: [],
				categories: [],
				bannerLoaded: false,
				categoryLoaded: false,
				productLoaded: false,
				loadingType: 'loading',
				categoryId: null,
				page: 1,
				zhuanImg: {
					zhuanImgUrl: '',
					zhuanImgYuUrl: ''
				},
				shareModel: null,
				navToDetailPage: function(item){
					if(!this.isJustShare){
						let id = item.id;
						uni.navigateTo({
							url: `/pages/video/course?id=${id}`
						})
					}
				}
			};
		},
		computed: {
			...mapState(['ltr','langtype','rtlClazz']),
			i18n () {  
			  return this.$t('course')
			},
			showEmpty() {
				if(this.bannerLoaded && this.categoryLoaded) {
					if((!this.carouselList || this.carouselList.length<=0) && (!this.categories || this.categories.length<=0)) {
						return true;
					}
				}
				return false;
			}
		},
		created() {
			uni.$on('EVENT_UPDATE_CITY',(city)=>{
				this.city = city;
				this.loadData(city.id);
			});
			const res = dynamicImages();
			this.zhuanImg = res;
			this.loadData();
		},
		methods: {
			shareToFreind(){
				this.shareModel = {
					type: 'home',
					data: {}
				}
				this.$refs.share.toggleMask();
			},
			async loadData(cityid) {
				this.bannerLoaded = false;
				this.categoryLoaded = false;
				this.productLoaded = false;
				banners(4).then((res)=>{
					if(res) {
						this.carouselList = res || [];
						this.swiperLength = this.carouselList.length;
					}
					this.bannerLoaded = true;
				});
				let lan = uni.getStorageSync('language') || '';
				let langtype = lan === 'zhuy'? 1 : 0;
				productCategory(langtype).then((res)=>{
					if(res) {
						this.categories = res || [];
						if(this.categories.length>0){
							this.categoryId = this.categories[0].id;
							this.products = this.categories[0].products;
						}
					}
					this.categoryLoaded = true;
					this.productLoaded = true;
					if(!this.products || this.products.length<20) {
						this.loadingType = 'nomore';
					}else {
						this.loadingType = 'more';
						this.page++;
					}
				});
			},
			loadProduct(type='add') {
				this.productLoaded = false;
				if(type == 'refresh') {
					this.page = 1;
				}else if(this.loadingType === 'nomore') {
					return;
				}
				if(this.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				this.loadingType = 'loading';
				productPage(this.langtype,this.categoryId,this.page).then((res) => {
					res = res || [];
					this.products = this.products || [];
					if(type == 'refresh') {
						this.products = [];
					}
					this.products = this.products.concat(res);
					this.productLoaded = true;
					if(!res || res.length<20) {
						this.loadingType = 'nomore';
					}else {
						this.loadingType = 'more';
					}
					this.page++;
				})
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			tabSelect(e) {
				this.tabCurrentIndex = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
				this.categoryId = this.categories[this.tabCurrentIndex].id;
				this.loadProduct('refresh');
			},
			navTo(ctype, url){
				uni.navigateTo({  
					url: url
				})  
			},
			navToMini(){
				uni.navigateToMiniProgram({
				  appId: 'wx70c6be53e27ed0c4',
				  success(res) {
				    console.log('打开成功');
				  }
				});
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
			}
		}
	}
</script>

<style lang="scss">
	.container{
		margin-bottom: 42px;
		width: 100%;
		height: calc(100vh);
		background-color: #FFFFFF;
	}
	.scrollcontainer {
		width: 100%;
		height: calc(100vh);
		position: relative;
	}
	/* #ifdef MP */
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				right:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #f5f5f5;
		margin-bottom: 42px;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;
	}
	.carousel {
		width: 100%;
		height: 250upx;
		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}
		image {
			width: 100%;
			height: 100%;
			border-radius: 0;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}
	.btn_nav {
		width: 100%;
		padding: 20upx 10upx;
		image {
			width: 100%;
			height: 90upx;
		}
	}
	.f-header{
		display:flex;
		align-items:center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		.cuIcon-camerafill{
			flex-shrink: 0;
			font-size: 70upx;
			margin-right: 20upx;
		}
		.image-rtl{
			margin-left: 20upx;
			margin-right: 0upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit{
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
		.icon-you{
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}
	.zhuanGif {
		position: fixed;
		width: 98upx;
		height: 117upx;
		right: 20upx;
		bottom: 200upx;
		&.left {
			right: unset;
			left: 20upx;
		}
	}
	.nav {
		font-size: 32upx;
		margin-top: 0upx;
		margin-bottom: 20upx;
		position:sticky;
		left: 0upx;
		top: 0upx;
		z-index: 10;
		.cu-item {
			border: 0upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.linetext {
				border-bottom: #FFFFFF 4upx solid;
				margin-bottom: 4upx;
			}
		}
		.cur{
			// .line {
			// 	background: $uni-color-primary;
			// }
			.linetext {
				border-bottom: $uni-color-primary 4upx solid;
				margin-bottom: 4upx;
			}
		}
	}
	.nav .cu-item.cur {
		border-bottom: 0upx;
	}
</style>
