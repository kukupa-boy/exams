<template>
	<view :class="ltr?'':'rtlDirection'">
		<view class="cu-item" v-for="(item,index) in records" :key="index">
		  <view class="content">
			<view class="topParty margin-bottom-sm">
				<view class="margin-right-sm"></view>
				<image v-if="item.user && item.user.avatar" class="round" :src="item.user.avatar"></image>
				<image v-else class="round" src="../../static/missing-face.png"></image>
				<view class="margin-left-sm"></view>
				<view class="text">
					<view class="text-black text-bold" v-if="item.user && item.user.nickName">{{item.user.nickName}}</view>
					<view class="text-black text-bold" v-else>{{i18n.defaultNickName}}</view>
					<view class="text-gray time">{{item.createdon | timeFilter }}</view>
					<view class="margin-top">{{item.content}}</view>
					<view class="margin-top text-gray" v-if="item.replymsg">
						<text class="text-grey">{{i18n.replytip}}</text>{{ item.replymsg }}
					</view>
				</view>
			</view>
		  </view>
		</view>
	</view>
</template>

<script>
	import {parseTime} from '@/utils/index';
	import {
	    mapState 
	} from 'vuex'; 
	export default {
		data() {
			return {};
		},
		props: {
			records: {
				type: Array,
				default: function(){
					return [];
				}
			}
		},
		filters:{
			timeFilter(value){
				if(value){
					return parseTime(value,'{y}-{m}-{d} {h}:{i}:{s}')
				}
				return value;
			},
		},
		computed:{
			...mapState(['hasLogin','ltr','rtlClazz','userInfo']),
			i18n () {
			  return this.$t('videoitem')
			}
		},
		methods: {
		},
	}
</script>

<style lang="scss" scoped>
.content {
	padding: 30upx 0upx;
	width:100%;
	background: #ffffff;
	border-bottom: 1px solid $border-color-light;
	.cont {
		font-size: 30upx;
		word-break: break-word;
	}
	.topParty {
		display: flex;
		justify-content: flex-start;
		.round {
			width:80upx;
			height:80upx;
			border-radius: 40upx;
		}
		.text {
			width: 80%;
			flex-flow: column;
			justify-content: space-between;
			align-items: flex-end;
			.time {
				margin-top: 10upx;
				font-size: $font-sm;
			}
		}
	}
}
</style>
