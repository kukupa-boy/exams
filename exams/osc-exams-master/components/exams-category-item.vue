<template>
	<view :class="'cate-section'+(ltr?'':' rtlDirection ')">
		<view v-for="(item, index) in categories" :key="index"
			class="cate-item"
			@click="navToDetailPage(item)">
			<image :src="item.httpIconUrl"></image>
			<text class="text-gray">{{ ltr ? item.name : item.yuname }}</text>
		</view>
	</view>
</template>

<script>
	import {  
	    mapState 
	} from 'vuex';  
	export default {
		data() {
			return {
				
			};
		},
		props: {
			categories: {
				type: Array,
				default: function() {
					return [];
				}
			}
		},
		computed: {
			...mapState(['ltr'])
		},
		methods: {
			//详情页
			navToDetailPage(item) {
				this.navTo(item.ctype,item.mpUrl,item.url);
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
			}
		},
	}
</script>

<style lang="scss">
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
			width: 20%;
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
			box-shadow: 4upx 4upx 20upx rgba(217, 109, 26, 0.2);
		}
	}
</style>
