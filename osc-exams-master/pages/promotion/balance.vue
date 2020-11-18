<template>
	<view :class="'bg' + (ltr?'':' rtlDirection ')">
		<view class="bottom">
			<view class="input-style">
				<text class="size">{{i18n.accountBalance}}</text>
				<text class="size-right" style="color: orange;">¥{{balance.balance}}</text>
			</view>
			<view class="input-style">
				<text class="size">{{i18n.earnings}}</text>
				<text class="size-right">¥{{balance.todaySum}}</text>
			</view>
			<view class="input-style">
				<text class="size">{{i18n.earningsMonth}}</text>
				<text class="size-right">¥{{balance.monthSum}}</text>
			</view>
			<view class="input-style">
				<text class="size">{{i18n.lastMonth}}</text>
				<text class="size-right">¥{{balance.lastMonthSum}}</text>
			</view>
			<view class="input-style">
				<text class="size">{{i18n.totalRevenue}}</text>
				<text class="size-right">¥{{balance.totalMoney}}</text>
			</view>
			<view class="commit-button">
				<button class="button-style cu-btn bg-gradual-orange shadow-blur" @click="btnWithDraw">{{i18n.withdrawals}}</button>
				<text class="tx-color"  @click="navTo('/pages/promotion/capitals')">\n{{i18n.withdrawalRecords}}</text>
			</view>
			<view v-if="config.customerWechat" class="copywechat m-t">
				<view class="tit-box">
					<text>{{i18n.admin}}</text>
					<text>{{config.customerWechat}}</text>
				</view>
				<view class="text-orange">
					<text @click="copyWechatNumber()">{{i18n.copy}}</text>
				</view>
			</view>
		</view>
		<view v-bind:class="modalName!='' ?'show':''" class="cu-modal">
		  <view class="cu-dialog">
		    <view class="cu-bar bg-white justify-end">
		      <view class="content">{{i18n.amountOfCashWithdrawal}}</view>
		      <view class="action" bindtap="hideModal">
		        <text class="cuIcon-close text-red"  @click="off()"></text>
		      </view>
		    </view>
		    <view class="padding-xl">
		      <input
				  class="size-input input"
				  type="number" 
				  :placeholder= "i18n.amount"
				  maxlength="4"
				  data-key="mobile"
				  @input="onMoneyInput"
				  pattern="[0-9]*"
				  
			   />
		    </view>
		    <view class="cu-bar bg-white justify-end">
		      <view class="action submitBtn">
		        <button class="cu-btn line-green text-green" @click="off()">{{i18n.cancel}}</button>
		        <button class="cu-btn bg-green"  @click="test()">{{i18n.confirm}}</button>
		      </view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import {submitMoney, userBalance, userMsgtpls} from '@/api/user';
	import {
	    mapState 
	} from 'vuex';  
	export default {
		data() {
			return {
				modalName: '',
				nowmoney:null,
				decimal:null,
				balance: {
					balance: 0,
					lastMonthSum: 0, //上月
					monthSum: 0, //当月
					todaySum:0, // 今日
					totalMoney:0 // 总收益
				},
				tmplIds: ['bwZbdUjvOQ_43cirtG90exqDZ5qA2BExVVHJfdIK5I0','FI_1RWj7We44yJsAVn_mN0JA_BRgbFi7AmGwEK-Xz4E','ekuwminxlLNFrQ_hPzTAxE-ibRVU1XRAkixaJPhwNmA']
			};
		},
		computed: {//login状态保持
			...mapState(['hasLogin','userInfo','ltr','config']),
			i18n () {  
			  return this.$t('promotion').balance
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.$t('promotion').balance.title
			});
			if(options && options.model) {
				this.balance = JSON.parse(decodeURIComponent(options.model));
				console.log(this.balance.balance);
			}
			this.loadMsTmpls();
		},
		methods: {
			loadMsTmpls() {
				userMsgtpls().then((res) => {
					this.tmplIds = res || this.tmplIds;
				});
			},
			copyWechatNumber(){
				uni.setClipboardData({
					data: this.config.customerWechat,
					success: function () {
						console.log('success')
					}
				});
			},
			btnWithDraw(){
				let that = this;
				uni.requestSubscribeMessage({
				    tmplIds: this.tmplIds,// 
				    success: (res) => {
						if(that.balance.balance<that.config.minMoney) {
							that.$api.msg(that.i18n.minMoneyTip.replace('XXX',that.config.minMoney));
							return;
						}
						that.modalName = '1';
				    }
				})
			},
			off(){
				this.modalName = '';
			},
			test(){
				if(this.nowmoney<this.config.minMoney) {
					this.$api.msg(this.i18n.minMoneyTip.replace('XXX',this.config.minMoney));
					return;
				}
				if(this.nowmoney - 0 >= 0.00 && (this.balance.balance - this.nowmoney) >= 0.00){
					this.decimal = (this.balance.balance - this.nowmoney);
					submitMoney(this.nowmoney).then(res=>{
						if(res) {
							this.off();
							this.$api.msg(this.i18n.success);
							//加载钱包数据
							userBalance().then(res=>{
								this.balance = res;
							});
						}
					});
				}else{
					this.$api.msg(this.i18n.inputTip);
				}
			},
			onMoneyInput(e) {
				this.nowmoney = e.target.value - 0;
			},
			navTo(url){
				uni.navigateTo({  
					url
				})  
			},
		}
	}
</script>

<style lang="scss">
	.bg{
		padding: 20upx 30upx 20upx;
		.bottom{
			width: 100%;
			height: 530upx;
			background-color: #fff;
			border-radius: 10upx;
			padding: 30upx 30upx 30upx;
			.input-style{
				height: 100upx;
				padding-top: 6upx;
				border: #F5F5F5 solid 4upx;
				border-top-style: none;
				border-left-style: none;
				border-right-style: none;
				display:flex;
				justify-content: space-between;
				.size{
					font-size: 30upx;
					white-space:nowrap;
					//float: left;
					margin-top: 3%;
				}
				.size-right{
					font-size: 30upx;
					white-space:nowrap;
					//float: right;
					margin-top: 4%;
				}
			}
			.commit-button{
				width: 100%;
				text-align: center;
				margin-top: 120upx;
				.button-style{
					width: 80%;
					height: 80upx;
				}
				.tx-color{
					color: orange;
					//margin-top: 20upx;
					line-height: 100upx;
				}
			}
			.copywechat {
				text-align: center;
				margin-top: 125upx;
				font-size: 30upx;
			}
		}
		.input{
			border: 1upx solid #D3DAD3;
			font-size: 30upx;
			height: 80upx;
		}
	}
	.submitBtn{
		.text-green {
			margin-left: 30upx;
			margin-right: 30upx;
		}
	}
	.tit-box {
		color: $font-color-light;
	}
</style>
