<template>
	<view class="contain" :class="rtlClazz">
		<!-- :class="qrShow? (ltr?'':' rtlDirection ') : (ltr?'modalView':'modalView rtlDirection ')" -->
		<view class="accountDetail">
			<view class="detailTop">
				<view>{{i18n.account_balance}}：<text class="text-xxl text-bold">{{accountData.balance||0}}</text>{{i18n.rmb}}</view>
				<button class="cu-btn bg-white lg" @click="navTo('/pages/promotion/capitals')">{{i18n.check_accountBalance}}</button>
			</view>
			<view class="detailBottom">
				<view class="detailBottomItem">
					<view class="text-lg text-bold">{{accountData.orders||0}}</view>
					<view>{{i18n.sum_order}}</view>
				</view>
				<view class="detailBottomItem">
					<view class="text-lg text-bold">{{accountData.students||0}}</view>
					<view>{{i18n.sum_student}}</view>
				</view>
				<view class="detailBottomItem">
					<view class="text-lg text-bold">{{accountData.coachers||0}}</view>
					<view>{{i18n.sum_coacher}}</view>
				</view>
				<view class="detailBottomItem">
					<view class="text-lg text-bold">{{accountData.totalamount||0}}</view>
					<view>{{i18n.sum_account}}</view>
				</view>
			</view>
		</view>
		<!-- 列表项部分 -->
		<view class="collapseBox">
			<uni-collapse accordion="true">
			    <uni-collapse-item 
				:title="CUserYearStatisticBaseDTO.year?CUserYearStatisticBaseDTO.year:currentYear" 
				class="collapseItem" 
				:itemHeight="'50px'" 
				:fontSize="'40rpx'" 
				:otherText="'¥'+CUserYearStatisticBaseDTO.totalmoney" 
				>
					<uni-collapse v-if="reFresh" accordion="true" v-for="(item,index) in CUserYearStatisticBaseDTO.items" :key="index">
						<uni-collapse-item  @getYearMonthData="getYearMonthData" :title="monthTransfer(item.datenumber)+i18n.month" :otherText="'¥'+item.amount" :open="item.open">
							<view class="itemDeatil" v-for="(item1,index1) in item.productList" :key="item1">
								<view class="item-image">
									<image :src="item1.productimageurl" />
								</view>
								<view class="productIntroduce">
									<view class="text-lg">{{item1.productname}}asda阿达啊实打实啊实打实阿松大阿松大啊实打实啊实打实阿达阿达</view>
									<view class="text-sm">{{i18n.sum_salesmoney}}￥{{item1.salesmoney}}</view>
								</view>
								<view class="sum_commis text-orange">
									<view>{{i18n.sum_account}}</view>
									<view>￥{{item1.amount}}</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
			    </uni-collapse-item>
			</uni-collapse>
		</view>
		<view class="fixedView">
			<button class="cu-btn bg-gradual-orange lg" @click="toPreviousYear">{{i18n.provious_year}}</button>
			<button class="cu-btn bg-gradual-orange lg" @click="toNextYear">{{i18n.next_year}}</button>
		</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import {statisticsSummary,statisticsSummaryForYearMouth,statisticsSummaryForYear} from "@/api/statistics.js"
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import {
	    mapState,
		mapMutations
	} from 'vuex';  
	export default {
		components: {
			uniCollapse,
			uniCollapseItem
		},
		data() {
			return {
				reFresh:true,
				accountData:{
					balance: null,
					coachers: null,
					orders: null,
					students: null,
					totalamount: null,
					userId: null
				},
				CUserYearStatisticBaseDTO: {
					items:[
						{
							amount:"20",// 累计收入 ,
							datenumber :"5",// 统计年月
							productList:[
								{
									amount: "累计收入1", 
									productid: 0,
									productimageurl: require("../../static/my_bg_01.jpg"),
									productname: "产品名称",
									salesmoney: 22
								},
								{
									amount: "累计收入2", 
									productid: 0,
									productimageurl: require("../../static/my_bg_01.jpg"),
									productname: "产品名称",
									salesmoney: 22
								}
							]
						},
						{
							amount:'300',  // 累计收入
							datenumber :"6",// 统计年月
							productList:[
								{
									amount: "累计收入3", 
									productid: 0,
									productimageurl: require("../../static/my_bg_01.jpg"),
									productname: "产品名称",
									salesmoney: 23
								},
								{
									amount: "累计收入4", 
									productid: 0,
									productimageurl: require("../../static/my_bg_01.jpg"),
									productname: "产品名称",
									salesmoney: 24
								}
							]
						}
					],// 每月收益明细 ,
					totalmoney:"19274",// 年总收入 ,
					year :"2020",// 统计年份
				},
				currentYear:new Date().getFullYear()
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo','ltr','promoter','config','langtype','rtlClazz']),
			i18n () {  
			  return this.$t('video_area')
			}
		},
		watch:{
			CUserYearStatisticBaseDTO(){
				this.reFresh= false
				this.$nextTick(()=>{
					this.reFresh = true
				})
			}
		},
		onLoad(options){
			let title = this.$t('video_area').title;
			uni.setNavigationBarTitle({
			　　title:title
			})
			this.getAcountData()
			this.getYearData()
		},
		methods: {
			monthTransfer(date) {
				return String(date).substr(4);
			},
			async getAcountData(){
				let data = await statisticsSummary()
				this.accountData = data
			},
			async getYearData(){
				let data = await statisticsSummaryForYear(this.currentYear)
				this.CUserYearStatisticBaseDTO = data || null;
			},
			async getYearMonthData(value){
				if(!value){
					value=parseInt(this.currentYear+'01');
				}
				value=parseInt(value)
				let data = await statisticsSummaryForYearMouth(value);
				//  做请求处理
				if(data && data.length>0) {
					for(let i =0;i<this.CUserYearStatisticBaseDTO.items.length;i++){
						if(parseInt(month)===parseInt(this.CUserYearStatisticBaseDTO.items[i].datenumber)){
							this.CUserYearStatisticBaseDTO.items[i].productList=[...data]
						}
					}
				}
			},
			toPreviousYear(){
				this.currentYear = --this.currentYear
				this.getAcountData()
				this.getYearData()
				// 把展开的收起来
				// this.getYearMonthData()
			},
			toNextYear(){
				this.currentYear = ++this.currentYear
				this.getAcountData()
				this.getYearData()
				// 把展开的收起来
				// this.getYearMonthData()
			},
			navTo(url) {
				uni.navigateTo({
					url:url
				});
			}
		}
	}
</script>

<style lang="scss">
	.contain{
		position:absolute;
		top:0;
		left:0;
		bottom:0;
		right:0;
		background-color: white;
	}
	.accountDetail{
		border-radius:16rpx;
		//background-color: rgba(244, 244, 244, 0.8);
		background-image: linear-gradient(45deg, #ff9700, #ed1c24);
		color: #ffffff;
		display:flex;
		justify-content:space-around;
		align-items:space-around;
		flex-direction: column;
		padding:40rpx 10rpx;
		margin:16rpx;
		.detailTop{
			display:flex;
			justify-content:space-around;
			align-items:center;
			view{
				padding: 32rpx 40rpx;
			}
		}
		.detailBottom{
			display:flex;
			justify-content:space-around;
			align-items:center;
			margin-top:16rpx;
			width: 100%;
			.detailBottomItem{
				padding: 24rpx 12rpx;
				width: 25%;
				// margin-right:10rpx;
				// margin-left:10rpx;
				view{
					text-align: center;
					height: 40rpx;
				}
			}
		}
	}
	.collapseBox{
		margin-top:24rpx;
		padding:0rpx 16rpx;
		box-sizing: border-box;
		.itemDeatil{
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding:20rpx 30rpx;
			background-color: #fff;
			border-radius: 10rpx;
			margin: 10rpx;
			.item-image{
				width:140rpx;
				height:120rpx;
				image{
					width:100%;
					height:100%;
					border-radius: 10rpx;
				}
			}
			.productIntroduce{
				width:300rpx;
				height:120rpx;
				display: flex;
				align-items: left;
				flex-direction: column;
				justify-content: space-between;
				&>view{
					width:100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
			.sum_commis {
				line-height: 50rpx;
				width: 160rpx;
				text-align: center;
			}
		}
	}
	.fixedView{
		//position: fixed;
		//z-index:1;
		width:100%;
		//bottom:10%;
		margin: 30rpx 0rpx;
		display:flex;
		justify-content:space-around;
		align-items:center;
	}
</style>
