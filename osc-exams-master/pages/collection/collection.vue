<template>
	<view class="content">
		<!-- 空白页 -->
		<empty v-if="loaded === true && goodsList.length === 0" :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty>
		
		<product-item showCollection="true" :share="i18n.share" :collection="i18n.collection" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :goodsList="goodsList" :navToDetailPage="navToDetailPage" :toMyFavorite="toMyFavorite"></product-item>
		 
		<uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
	</view>
</template> 

<script>
	import { collecProduct, favoriteProducts } from '@/api/product';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import productItem from '@/components/exams-product-item';
	import {  
	    mapState,
		mapMutations
	} from 'vuex';  
	export default {
		components: {
			uniLoadMore,
			empty,
			productItem
		},
		data() {
			return {
				page: 1,
				goodsList: [],
				loadingType: '',
				loaded: false,
				navToDetailPage: function(item){
					let id = item.productId;
					let url = `/pages/video/video?id=${id}`;
					if(item.producttype == 1) {
						url = `/pages/video/course?id=${id}`;
					}
					uni.navigateTo({
						url: url
					})
				},
				toMyFavorite: function(item){
					let list = this.goodsList;
					let index = list.findIndex(val=>val.id === item.id);
					list[index].favorite = item.favorite;
					collecProduct(item.productId);
				}
			};
		},
		onShareAppMessage(res) {
			let user = this.$api.getUserInfo();
			let page = '/pages/index/index';
		    if (res.from === 'button') {// 来自页面内分享按钮
		    	let id = res.target.id;
		    	let type = res.target.dataset.type;
		    	let title = res.target.dataset.name;
		    	let imgurl = res.target.dataset.imgurl;
		    	if(user && user.nickName) {
		    		title = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY',title);
		    	}
		    	if(type === 'product') {
		    		//产品分享
		    		page = '/pages/video/video?id='+id;
		    	}else if(type === 'course') {
		    		//课程分享
		    		page = '/pages/video/course?id='+id;
		    	}else if(type === 'article') {
		    		//攻略分享
		    		page = '/pages/article/article?id='+id;
		    	}else if(type === 'home' && shareInfo) {
		    		return {
		    			title: shareInfo.title,
		    			imageUrl: shareInfo.httpImageUrl,
		    			path: page
		    		}
		    	}else {
		    		page = page + '&id=' + (user ? user.id || 0 : 0);
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
			if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		computed: {
			...mapState(['ltr','langtype']),
			i18n () {  
			  return this.$t('collection')
			}
		},
		created() {
			let title = this.$t('collection').title;
			uni.setNavigationBarTitle({
			　　title: title
			})
		    this.loadData()
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			//获取订单列表
			async loadData(type='add'){
				if(type === 'refresh'){
					this.page = 1;
				}
				if(this.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				this.loadingType = 'loading';
				let responseData = await favoriteProducts(this.page);
				let goodsList = responseData ? responseData.data : [];
				if(type === 'refresh'){
					this.goodsList = [];
				}
				goodsList = goodsList || [];
				this.goodsList = this.goodsList.concat(goodsList);
				// console.log(this.goodsList)
				//判断是否还有数据， 有改为 more， 没有改为noMore 
				this.loadingType = 'nomore';
				this.loaded = true;
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
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
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
		background-color: #fff;
		padding: 20upx 0upx;
	}
	
	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
