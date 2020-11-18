<template>
	<view class="container" :class="ltr?'':'rtlDirection'">
		<scroll-view scroll-x class="bg-white nav shadow">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==tabCurrentIndex?'text-orange cur':''" v-for="(item,index) in navList" :key="index"
				 @tap="tabSelect(index)">
					<view class="linetext">{{ item }}</view>
				</view>
			</view>
		</scroll-view>
		<view class="ptitle" v-if="showTitle">
			<view class="ptitle-left">
				<text class="sort">{{i18n.index}}</text>
				<text class="margin-right-lg"></text>
				<text>{{i18n.headimg}}</text>
				<text class="margin-right-lg"></text>
				<text class="nickname">{{i18n.nickname}}</text>
			</view>
			<view class="ptitle-right">
			  <text class="text-orange amount">{{i18n.amount}}</text>				
			</view>
		</view>
		<view class="content-detail" v-if="tabCurrentIndex==0">
			<empty-List v-if="!paicontsOne || paicontsOne.length == 0" :desc="i18n.emptyDesc"></empty-List>
			<pai-content :paiconts="paicontsOne"></pai-content>
		</view>
		<view class="content-detail" v-if="tabCurrentIndex==1">
			<empty-List v-if="!paicontsTwo || paicontsTwo.length == 0" :desc="i18n.emptyDesc"></empty-List>
			<pai-content :paiconts="paicontsTwo"></pai-content>
		</view>
		<view class="content-detail" v-if="tabCurrentIndex==2">
			<empty-List v-if="!paicontsThree || paicontsThree.length == 0" :desc="i18n.emptyDesc"></empty-List>
			<pai-content :paiconts="paicontsThree"></pai-content>
		</view>
	</view>
</template>

<script>
	import emptyList from '@/components/emptyList';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more';
	import paiContent from '@/components/pai-content/pai-content-item'
	import { mapState } from 'vuex'
	import { userLeaderboardType } from '@/api/user'
	export default {
		name: 'paihangbang',
		components:{
			emptyList,
			uniLoadMore,
			paiContent
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: ['上月','当前','累计'],
				paicontsOne:[],
				paicontsTwo:[],
				showTitle: false,
				paicontsThree:[]
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.loadInfo(this.tabCurrentIndex + 1);
		},
		computed: {
			...mapState(['ltr','langtype']),
			i18n () {  
			  return this.$t('paihangbang')
			}
		},
		created() {
			let i18n = this.$t('paihangbang');
			this.navList[0] = i18n.navList[0];
			this.navList[1] = i18n.navList[1];
			this.navList[2] = i18n.navList[2];
			this.loadData();
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				this.loadInfo(1)
			},
			tabSelect(e) {
				this.tabCurrentIndex = e;
				this.loadInfo(e + 1)
			},
			async loadInfo(type) {
				let res = await userLeaderboardType(type)
				if(res && res.code == 0 && res.data.length > 0) {
					this.showTitle = true
					if(type == 1) {
						this.paicontsOne = res.data
					} else if(type == 2) {
						this.paicontsTwo = res.data
					} else if(type == 3) {
						this.paicontsThree = res.data
					}
				} else {
					this.showTitle = false
					this.paicontsOne = []
					this.paicontsTwo = []
					this.paicontsThree = []
				}
				uni.stopPullDownRefresh();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
	.container{
		width: 100%;
		position: relative;
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
		.ptitle {
			width: 100%;
			padding:30upx;
			background: #ffffff;
			border-bottom: 1px solid $border-color-light;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: $font-color-disabled;
			.ptitle-left {
				width: 80%;
				display: flex;
				align-items: center;
			}
			.nickname {
				font-size: $font-base ;
			}
			.amount {
				font-size:$font-base;
				color: $font-color-disabled;
			}
			.sort {
				font-size:$font-base;
			}
		}
	}
	
</style>

