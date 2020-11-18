<template>
	<view class="promoter-background" :class="rtlClazz">
		<view class="Share-msg">
			<text class="text-orange cuIcon-redpacket_fill tx-size">{{i18n2.rewardDescription}}</text>
			<view class="tx-msg">
				<rich-text :nodes="htmlRewardDesc()"></rich-text>
			</view>
			<text class="text-orange cuIcon-friendfill tx-size">{{i18n2.customerDescription}}</text>
			<view class="tx-msg"><rich-text :nodes="htmlStr()"></rich-text></view>
			<text class="text-orange cuIcon-moneybagfill">{{i18n2.settlement}}</text>
			<view class="tx-msg"><rich-text :nodes="htmlStrTow()"></rich-text></view>
			<view class="b-Position">
				<button v-if="userinfo === false" class="cu-btn bg-gradual-orange shadow-blur" open-type="getUserInfo" @getuserinfo="onuserinfo">{{i18n.Authorized}}</button>
				<button v-if="userinfo === true" class="cu-btn bg-grey shadow-blur">{{i18n.Authorized}}</button>
				<button v-if="userphone === false" class="cu-btn bg-gradual-orange shadow-blur" open-type="getPhoneNumber" @getphonenumber="onuserphone">{{i18n.AuthorizedTel}}</button>
				<button v-if="userphone === true" class="cu-btn bg-grey shadow-blur">{{i18n.AuthorizedTel}}</button>
			</view>
			<view class="ps">
				<text>{{i18n.Notetext}}</text>
			</view>
		</view>
		<view class="onvip">
			<button v-if="userinfo === false || userphone === false" class="cu-btn bg-grey shadow-blur vip-button">{{i18n.Authorizedbutton}}</button>
			<button v-if="userinfo === true && userphone === true" class="cu-btn bg-gradual-orange shadow-blur vip-button" @click="askPromoter()">{{i18n.AuthorizedbuttonTow}}</button>
		</view>
	</view>
</template>

<script>
	import { login, bindUserTel, becomePromoter } from '@/api/user';
	import {
	    mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				htmlRewardDesc: function() {
					let html = this.i18n2.rewardDescriptionText;
					if(this.config) {
						html=html.replace('XXX', '<span style="color:orange; direction: ltr;"><span>'+(this.config.promotePercent || 0)+'</span><span>%</span></span>');
						html=html.replace('YYY', '<span style="color:orange; direction: ltr;"><span>'+(this.config.subPromotePercent || 0)+'</span><span>%</span></span>');
					}
					return html;
				},
				htmlStr: function(){
					let html = this.i18n2.userExplainText;
					if(this.config.promoteEffectiveTime === 0){
						html=html.replace('XXX','<span style="color:orange;">'+this.i18n2.time+'</span>');
						return html;
					}else{
						html=html.replace('XXX','<span style="color:orange;">'+this.config.promoteEffectiveTime+'天</span>');
						return html;
					}
				},
				htmlStrTow: function(){
					let html = this.i18n2.userBillingInstructions;
					html=html.replace('XXX','<span style="color:orange;">'+this.i18n2.seeaccount+'</span>');
					html=html.replace('YYY','<span style="color:orange;">'+this.i18n2.withdrawals+'</span>');
					return html;
				},
				userinfo:false,
				userphone:false,
				code: null,
				back: function(){
					// uni.$emit('EVENT_PROMOTER_UPDATE',this.userinfo && this.userphone);
					uni.navigateBack({
						delta: 1
					});
				},
			};
		},
		computed: {
			...mapState(['hasLogin','userInfo','ltr','rtlClazz','promoter','config']),
			i18n () {  
			  return this.$t('promotion').promoter
			},
			i18n2() {
				return this.$t('promotion')
			}
		},
		onLoad() {
			this.initWxLogin();
		},
		methods: {
			...mapMutations(['Login','InitConfig']),
			initWxLogin(){
				uni.login({
				  provider: 'weixin',
				  success: (loginRes) => {
					  this.code = loginRes.code;
				  }
				});
			},
			askPromoter() {
				let that = this;
				becomePromoter().then(res=>{
					if(res) {
						login().then(lres=>{
							if(lres && lres.data) {
								if(lres.data.user) {
									that.Login(lres.data.user);
									that.$api.msg(that.$t('feedback').success);
									setTimeout(function(){
										that.back();
									},2000);
								}
							}
						});
						
					}
				})
			},
			onuserinfo(res){
				let that = this;
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					let loginRes = login(res.detail.userInfo);
					if(loginRes){
						loginRes.then(result=>{
							if(result && result.code ===0 && result.data && result.data.user){
								that.Login(result.data.user);
								that.InitConfig(result.data.config);
								that.userinfo = true;
								that.initWxLogin();
							}
						})
					}
				}
			},
			onuserphone(res){
				let that = this;
				if(res && res.detail) {
					res.detail.code = this.code;
					console.log(this.code);
					bindUserTel(res.detail).then(result=>{
						if(result) {
							that.userphone = true;
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.promoter-background{
		background-color: #fff;
	}
	.Share-msg{
		postion: fixed;
		background-color: #fff;
		z-index: 1;
		padding: 60upx 40upx 0upx;
		overflow: scroll;
		margin: 0upx 0upx 140upx;
		line-height: 60upx;
	}
	.tx-br{
		word-wrap: break-word;
	}
	.b-Position{
		text-align: center;
		margin-top: 80upx;
		display: flex;
		justify-content: space-between;
		.cu-btn {
			width: 49%;
		}
	}
	.ps{
		text-align: center;
		margin-top: 20upx;
		color: orange;
	}
	// .b-but{
	// 	margin-right: 20upx;
	// }
	.vip-button{
		width: 100%;
	}
	.onvip{
		padding: 0upx 40upx 40upx;
	}
</style>
