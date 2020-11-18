<template>
	<view class="content" :class="'bg' + (ltr?'':' rtlDirection ')">
		<!-- 空白页 -->
		<empty v-if="loaded === true && moneylist.length === 0" :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty>
		<view class="filterTag">
			<button data-id="0" class="cu-btn" :class="buttonTargetValue=='0'?'bg-gradual-orange':'line-gray'" @click="changeValue">{{i18n.all}}</button>
			<button data-id="1" class="cu-btn" :class="buttonTargetValue=='1'?'bg-gradual-orange':'line-gray'" @click="changeValue">{{i18n.salary}}</button>
			<button data-id="2" class="cu-btn" :class="buttonTargetValue=='2'?'bg-gradual-orange':'line-gray'" @click="changeValue">{{i18n.drawCash}}</button>
		</view>
		<view v-if="loaded === true && moneylist.length > 0" class="middleView">
			<view v-for="info in moneylist" :key="info" class="list">
				<view class="list-left">
					<view>
						<text style="font-size: 30upx;">{{info.description}} : {{ transitionType(info.capitalType) }}\n</text>
						<text style="color: #D3D3D3; font-size: 25upx;">{{info.createdOn|transitionTime}}</text>
					</view>
					<!-- <text v-if="info.id%2 === 0 " class="list-right">{{info.money}}</text> -->
					<text class="list-right-tow" :class="info.capitalType == 1 || info.capitalType == 3 || info.capitalType == 6 || info.capitalType == 9 ? 'text-red':'text-green'">{{info.money}}</text>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
	</view>
</template>

<script>
	import { userCapitals } from '@/api/user';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {timeConvert} from"@/utils/time.js"
	import {
	    mapState 
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page: 1,
				loadingType: '',
				loaded: false,
				moneylist: [],
				buttonTargetValue:"0"
			};
		},
		filters:{
			transitionTime(value){
				return timeConvert(value)
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
		computed: {//login状态保持
			...mapState(['hasLogin','userInfo','ltr']),
			i18n () {  
			  return this.$t('promotion').capitals
			}
		},
		created() {
			let title = this.$t('promotion').capitals.title;
			uni.setNavigationBarTitle({
			　　title: title
			})
		    this.loadData();
		},
		methods: {
			transitionType(value){
				if(this.i18n.capitaltypes.length>value) {
					return this.i18n.capitaltypes[value];
				}
				return '';
			},
			//获取订单列表
			async loadData(type='add'){
				if(type === 'refresh'){
					this.page = 1;
				}else if(this.loadingType === 'nomore') {
					return;
				}
				if(this.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				this.loadingType = 'loading';
				let moneylist = await userCapitals(parseInt(this.buttonTargetValue),this.page);
				if(type === 'refresh'){
					this.moneylist = [];
				}
				moneylist = moneylist || [];
				this.moneylist = this.moneylist.concat(moneylist);
				//判断是否还有数据， 有改为 more， 没有改为noMore 
				this.loaded = true;
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}
				if(moneylist.length<20) {
					this.loadingType = 'nomore';
				}else{
					this.loadingType = 'more';
					this.page++;
				}
			},
			changeValue(e){
				this.buttonTargetValue = e.target.dataset.id
				this.loadData('refresh')
			}
		}
	}
</script>

<style lang="scss">
	.filterTag{
		width:100%;
		padding:30rpx;
		box-sizing:border-box;
		display:flex;
		justify-content: space-around;
		align-items: center;
		flex-direction: row;
		background-color: white;
		border-bottom:1rpx solid #f1f1f1;
		position:fixed;
		top:0;
		left:0;
	}
	.middleView{
		margin-top: 127rpx;
	}
	.bg{
		overflow-x:hidden;
		padding: 0upx 40upx 20upx;
		background-color: #ffffff;
		.list{
			width: 100%;
			height: 130upx;
			border: #F5F5F5 solid 3rpx;
			border-top-style: none;
			border-left-style: none;
			border-right-style: none;
			padding: 20upx 0rpx;
			.list-left{
				width: 100%;
				height: 100upx;
				padding: 2% 0rpx;
				font-size: 30upx;
				line-height: 55upx;
				display:flex;
				justify-content: space-between;
				align-items: center;
				.list-right{
					//float: right;
					text-align: center;
					font-size: 30upx;
					color: #FA8072;
				}
				.list-right-tow{
					//float: right;
					text-align: center;
					font-size: 30upx;
					// color: #00FF7F;
					direction: ltr;
					&.text-red::before {
						content: '-';
					}
					&.text-green::before {
						content: '+';
					}
				}
			}
		}
	}
</style>
