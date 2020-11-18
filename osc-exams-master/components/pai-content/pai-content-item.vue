<template>
	<view :class="ltr?'':'rtlDirection'">
		<view class="cu-item" v-for="(item,index) in paiconts" :key="index">
			<view class="content">
				<view class="bcont">
					<view class="bcont-left">
						<text class="margin-left-sm"></text>
						<text class='sort text-bold' :class="item.index <=3 ? 'text-orange' : 'text-gray'">{{item.index}}.</text>
						<text class="margin-right-lg"></text>
						<view v-if="item.avatar" class="cu-avatar round" :style="'background-image:url('+item.avatar+');'"></view>
						<view v-if="!item.avatar" class="cu-avatar round" style="background-image: url(../../static/missing-face.png);"></view>
						<view class="margin-right-lg"></view>
						<text class="text-black nickname">{{item.nickName}}</text>							
					</view>
					<view>
						<text class="text-green amount">￥{{item.amount}}</text>				
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: 'paihangbang-item',
		data() {
			return {}
		},
		computed: {
			...mapState(['ltr','langtype','userInfo']),
			i18n () {  
			  return this.$t('paiitem')
			}
		},
		props: {
			paiconts: {
				type: Array,
				default: function(){
					return [];
				}
			}
		},
		created() {
			this.loadData();
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				
			},
			tabSelect(e) {
				this.tabCurrentIndex = Number(e.currentTarget.dataset.id);
				if(this.tabCurrentIndex == 0) {
					
				} else if(this.tabCurrentIndex == 1) {
					
				} else if(this.tabCurrentIndex == 2) {
					
				}
			}
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 30upx;
		width: 100%;
		background: #ffffff;
		border-bottom: 1px solid $border-color-light;
		.bcont {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.bcont-left {
				width: 80%;
				display: flex;
				align-items: center;
				
				.cu-avatar {
					min-width: 64upx;
				}
			}
			.nickname {
				font-size: $font-lg ;
			}
			.amount {
				font-size:$font-base;
			}
			.sort {
				font-size:$font-normal;
			}
		}
	}
</style>


