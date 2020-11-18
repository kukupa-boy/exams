<template>
	<view class="content">
		<view class="satisific bg-gradual-orange">
			<view class="satisific-today">
				<view>{{i18n.today}}</view>
				<view>{{statictis.todayMemberTotalSum}}</view>
			</view>
			<view class="satisific-total">
				<view>{{i18n.total}}</view>
				<view>{{statictis.memberTotalSum}}</view>
			</view>
		</view>
		<view class="customer-button">
			<button data-id="0" :class="['cu-btn',buttonType===0?'bg-gradual-orange':'line-gray']" @click="getButtonInfo">{{ i18n.allSpread }}</button>
			<button data-id="1" :class="['cu-btn',buttonType===1?'bg-gradual-orange':'line-gray']" @click="getButtonInfo">{{ i18n.directSpread }}</button>
			<button data-id="2" :class="['cu-btn',buttonType===2?'bg-gradual-orange':'line-gray']" @click="getButtonInfo">{{ i18n.indirectSpread }}</button>
		</view>
		<view class="uni-list customer-switch">
			<view class="uni-list-cell uni-list-cell-pd switch-order">
				<view class="uni-list-cell-db">{{i18n.showCostume}}</view>
				<switch class="orange" @change="SwitchFn" :class="switchData?'checked':''" :checked="switchData?true:false"  color="#e54d42"></switch>
			</view>
		</view>
		<view v-if="loaded === true && userList.length > 0" :class="'promoter-background' + (ltr?'':' rtlDirection ')">
			<view class="listbox">
				<view v-for="info in userList" :key="info" class="customerlist">
					<view class="customer-portrait">
						<image class="customer-portrait" :src="info.avatar || '/static/missing-face.png'"></image>
					</view>
					<view class="customer-name">
						<text>{{ info.nickName || i18n.defaultNickName }}</text>
						<view class="tx-id">
							<text class="text-orange">{{i18n.money}}</text><text class="margin-left-sm"></text><text class="text-orange text-lg">￥{{info.promotionCommission}}</text>
						</view>
						<view class="tx-time">
							<text>{{i18n.expiretime}}</text><text class="margin-left-sm"></text><text>{{info.expireTime}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
	</view>
</template>

<script>
	import { userStatictis, customList } from '@/api/user';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
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
				userList: [],
				loadingType: '',
				loaded: false,
				statictis: {
					memberTotalSum: 0,
					todayMemberTotalSum: 0
				},
				buttonType:0,
				switchData: true
			};
		},
		computed: {//login状态保持
			...mapState(['hasLogin','userInfo','ltr']),
			i18n () {  
			  return this.$t('promotion').customs
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
		created() {
			let title = this.$t('promotion').customs.title;
			uni.setNavigationBarTitle({
			　　title: title
			})
		    this.loadData();
			userStatictis().then(res=>{
				if(res) {
					this.statictis = res;
				}
			});
		},
		methods: {
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
				this.switchData=this.switchData?1:0
				let userList = await customList(this.buttonType,this.switchData,this.page);
				if(type === 'refresh'){
					this.userList = [];
				}
				userList = userList || [];
				this.userList = this.userList.concat(userList);
				//判断是否还有数据， 有改为 more， 没有改为noMore 
				this.loaded = true;
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}
				if(userList.length<20) {
					this.loadingType = 'nomore';
				}else{
					this.loadingType = 'more';
					this.page++;
				}
			},
			getButtonInfo(e){
				this.buttonType=parseInt(e.target.dataset.id)
				this.loadData('refresh')
			},
			SwitchFn(e) {
				this.switchData = e.detail.value
				this.loadData('refresh')
			}
		}
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	.customer-button{
		width:100%;
		display:flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding:20rpx;
	}
	.customer-switch{
		width:100%;
		.switch-order{
			padding:20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			// border:1px solid red;
		}
	}
	.satisific {
		height: 200upx;
		width: 100%;
		display: flex;
		flex-wrap:wrap;
		justify-content: space-between;
		align-items: center;
		line-height: 60upx;
		font-size: $font-lg;
		.satisific-today {
			width: 50%;
			height: 100%;
			display: flex;
			flex-direction:column;
			align-items: center;
			justify-content: center;
		}
		.satisific-total {
			width: 50%;
			height: 100%;
			float: left;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
	.promoter-background{
		background-color: #fff;
		width: 100%;
		padding: 0upx 20upx;
		.listbox{
			//margin-top: 0upx;
			.customerlist{
				width: 100%;
				border: #F5F5F5 solid 3rpx;
				border-top-style: none;
				border-left-style: none;
				border-right-style: none;
				display:flex;
				justify-content: flex-start;
				padding: 30upx 0upx;
				align-items:center;
				.customer-portrait{//头像
					width: 120upx;
					height: 120upx;
					//border:5upx solid #fff;
					border-radius: 50%;
					text-align: center;
				}
				.customer-name{//用户名称
					float: left;
					//margin-top: -16%;
					margin-left: 40upx;
					margin-right: 40upx;
					font-size: $font-lg + 6upx;
					color: $font-color-dark;
				}
				.tx-id{
					margin-top:15upx;
					font-size: 25upx;
					display: flex;
				}
				.tx-time{
					margin-top:15upx;
					font-size: 25upx;
					color: $font-color-light;
					display: flex;
				}
			}
		}
	}
</style>