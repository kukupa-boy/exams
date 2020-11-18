<template name="exams">
	<view class="container">
		<scroll-view scroll-y>
			<!-- 头部轮播 -->
			<view class="carousel-section">
				<!-- 标题栏和状态栏占位符 -->
				<view class="titleNview-placing"></view>
				<!-- 背景色区域 -->
				<swiper class="carousel" autoplay="true" circular @change="swiperChange">
					<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="bannerNavTo(item.httpUrlType, item.httpUrl)">
						<image :src="ltr? item.httpFileUrl : item.httpFileYuUrl"/>
					</swiper-item>
				</swiper>
				<button class="cu-btn bg-yellow shadow-blur round address" @click="navTo(0, '/pages/address/address')">{{city.name}}<text class="cuIcon-locationfill"></text></button>
				<view v-if="exams && exams.length>0" class="address-exam">
					<text class="address-examname">{{i18n.currentExam}}{{ ltr ? currentExam.name : currentExam.yuname}}</text>
					<picker @change="PickerChange" :value="pickerIndex" :range="exams" :range-key="ltr?'name':'yuname'" class="cu-btn bg-yellow shadow-blur round address-examchange">
						<text class="cuIcon-refresh"></text>{{i18n.examChange}}
					</picker>
				</view>
				<!-- 自定义swiper指示器 -->
				<view class="swiper-dots">
					<text class="num">{{swiperCurrent+1}}</text>
					<text class="sign">/</text>
					<text class="num">{{swiperLength}}</text>
				</view>
			</view>
			<!-- 分类 -->
			<view v-if="categories.length>0" :class="'cate-section'+(ltr?'':' rtlDirection ')">
				<view v-for="(item, index) in categories" :key="index" class="cate-item" @click="navTo(item.ctype, item.mpUrl, item.url)">
					<image :src="item.httpIconUrl"></image>
					<text>{{ ltr ? item.name : item.yuname }}</text>
				</view>
				<!-- <view class="cate-item" @click="navTo('/pages/article/article')">
					<image src="/static/temp/c5.png"></image>
					<text>科二攻略</text>
				</view>
				<view class="cate-item">
					<image src="/static/temp/c6.png"></image>
					<text>科三攻略</text>
				</view>
				<view class="cate-item">
					<image src="/static/temp/c6.png"></image>
					<text>模拟攻略</text>
				</view>
				<view class="cate-item">
					<image src="/static/temp/c7.png"></image>
					<text>考生经验</text>
				</view>
				<view class="cate-item">
					<image src="/static/temp/c5.png"></image>
					<text>考场信息</text>
				</view> -->
			</view>
			
			<view v-if="centerBanners && centerBanners.length>0" class="carousel-section m-t">
				<swiper class="carousel advert" autoplay="true" circular @change="swiperChange">
					<swiper-item v-for="(item, index) in centerBanners" :key="index" class="carousel-item" @click="bannerNavTo(item.httpUrlType, item.httpUrl)">
						<image :src="ltr? item.httpFileUrl : item.httpFileYuUrl" />
					</swiper-item>
				</swiper>
			</view>
			
			<!-- 考场实景 -->
			<view v-if="products && products.length>0" :class="'f-header m-t'+(ltr?'':' rtlDirection ')">
				<text class="cuIcon-camerafill text-orange text-shadow" :class="ltr?'':' image-rtl '"></text>
				<view class="tit-box">
					<text class="tit">{{i18n.examReal}}</text>
					<text class="tit2">{{i18n.examRealTip}}</text>
				</view>
				<!-- <text class="yticon icon-you"></text> -->
			</view>
			<product-item :goodsList="products" :navToDetailPage="navToDetailPage" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :share="i18n.share"></product-item>
		</scroll-view>
	</view>
</template>

<script>
	import { initHome } from '@/api/home';
	import { productList } from '@/api/product';
	import { categoryList } from '@/api/category';
	import productItem from '@/components/exams-product-item';
	import {  
        mapState 
    } from 'vuex';  
	export default {
		name: 'exams',
		components:{
			productItem
		},
		data() {
			return {
				city: {
					id: 0,
					name: '未授权'
				},
				pickerIndex: 0,
				exams: [],
				currentExam: {},
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				products: [],
				categories: [],
				centerBanners: [],
				navToDetailPage: function(item){
					if(!this.isJustShare){
						let id = item.id;
						uni.navigateTo({
							url: `/pages/video/video?id=${id}`
						})
					}
				}
			};
		},
		computed: {
			...mapState(['ltr','langtype']),
			i18n () {  
			  return this.$t('home')
			}
		},
		created() {
			uni.$on('EVENT_UPDATE_CITY',(city)=>{
				this.city = city;
				this.loadData(city.id);
			});
			this.loadData();
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData(cityid) {
				if(!cityid) {
					let cityModel = await this.$api.getCity();
					if(cityModel) {
						cityid = cityModel.id;
					}
				}
				let res = await initHome(cityid,this.langtype);
				let data = res ? res.data || {} : {};
				this.products = data.products || [];
				this.categories = data.categories || [];
				let carouselList = data.banners || [];
				this.swiperLength = carouselList.length;
				this.carouselList = carouselList;
				this.centerBanners = data.centerBanners || [];
				
				this.city = data.city || { name: '未授权', id: 0 };
				this.$api.setCity(this.city);
				this.exams = data.exams || [];
				this.$api.setExams(data.exams);
				let that = this;
				this.exams.forEach(item=>{
					if(item.id === data.examId) {
						this.currentExam = item;
						that.$api.setExam(item);
					}
				})
			},
			PickerChange: function(e) {
				this.currentExam = this.exams[e.target.value];
				this.$api.setExam(this.currentExam);
				productList(this.currentExam.id,this.langtype, 1).then(res=>{
					this.products = res.data || [];
				});
				categoryList(this.currentExam.id).then(res=>{
					this.categories = res.data || [];
				});
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			navTo(ctype, mpurl, url){
				if(ctype===1) {
					uni.navigateTo({
						url: '/pages/website/website?url='+url
					});
				}else if(ctype===8){
					uni.navigateToMiniProgram({
						appId : url
					});
				}else {
					uni.navigateTo({  
						url: mpurl
					});
				}
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
	.advert {
		height: 150upx;
		image {
			border-radius: 10upx;
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
	/* 分类 */
	.cate-section {
		//direction: rtl;
		display: flex;
		//justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding-top: 30upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 33.33%;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			margin-bottom: 30upx;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			//opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.ad-1{
		width: 100%;
		height: 210upx;
		padding: 16upx 0;
		//background: #fff;
		image{
			width:100%;
			height: 100%; 
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
	
	.address{
		position: absolute;
		left: 30upx;
		top: 80upx;
		height: 40upx;
	}
	.address-exam{
		position: absolute;
		left:30upx;
		top:150upx;
		float: left;
		direction: ltr;
	}
	.address-examname{
		color: white;
		margin-right: 10upx;
		font-size: $font-lg;
	}
	.picker-examchange{
		
	}
	.address-examchange{
		height: 40upx;
	}
</style>
