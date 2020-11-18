<template>
	<view :class="'bg' + (ltr?'':' rtlDirection ')" :style="'background:url('+recruitInfo.bgUrl+') no-repeat; background-size: 100% 100%;'">
		<text>{{i18n.toptext}}</text>
		<view class="Body" :style="'background:url('+recruitInfo.txtUrl+') no-repeat; background-size: 100% 100%;'">
			<view class="b-btn" :style="'background:url('+recruitInfo.titleUrl+') no-repeat; background-size: 100% 100%; line-height: 75rpx;'">
				{{i18n.reward}}
			</view>
			<view class="tx">
				<rich-text class="tx-size" :nodes="recruitInfo.desc"></rich-text>
			</view>
		</view>
		<view class="bottom">
			<view class="Application">
				<text>{{i18n.applicationForCooperation}}</text>
			</view>
				<view class="input-style">
					<text class="size">{{i18n.userName}}</text>
						<input 
							class="size-input"
							type="text" 
							:value="mobile" 
							:placeholder="i18n.userName2"
							maxlength="20"
							data-key="mobile"
							@input="userNameInput"
						/>
				</view>
				<view class="input-style">
					<text class="size">{{i18n.userTel}}</text>
						<input 
							class="size-input"
							type="number" 
							:value="mobile" 
							:placeholder="i18n.userTel2"
							maxlength="11"
							data-key="mobile"
							@input="userTelInput"
						/>
				</view>
				<view class="input-style">
					<text class="size">{{i18n.userCity}}</text>
						<input 
							class="size-input"
							type="text" 
							:value="mobile" 
							:placeholder="i18n.userCity2"
							maxlength="20"
							data-key="mobile"
							@input="userCityInput"
						/>
				</view>
				<view class="input-style">
					<text class="size">{{i18n.nameOfTheExaminationRoom}}</text>
						<input 
							class="size-input"
							type="text" 
							:value="mobile" 
							:placeholder="i18n.nameOfTheExaminationRoom2"
							maxlength="60"
							data-key="mobile"
							@input="examNameInput"
						/>
				</view>
				<view>
					<button class="cu-btn bg-gradual-orange shadow-blur b-button" @click="onSubmit()">{{i18n.Submit}}</button>
				</view>
			</view>
			<view class="copywechat m-t">
				<view class="tit-box">
					<text>{{i18n.customerWechatTip}}</text>
					<text>{{config.customerWechat}}</text>
				</view>
				<view class="text-orange">
					<text @click="copyWechatNumber()">{{i18n.copy}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { loginAsync } from '@/api/user';
	import { shareInfoOfAffiliate } from '@/api/share';
	import { recruitInfo, submitRecruit } from '@/api/feedback';
	import {
	    mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				joinModel: {
					trueName: null,
					tel: null,
					cityName: null,
					examName: null
				},
				shareInfo: null,
				recruitInfo: {
					bgUrl: '',//背景图
					txtUrl: '', //文字背景
					desc: '' //招募说明
				},
				isSubmiting: false
			};
		},
		computed: {//login状态保持
			...mapState(['hasLogin','userInfo','ltr','config','langtype']),
			i18n () {  
			  return this.$t('recruit')
			}
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
			let user = this.$api.getUserInfo();
			let page = '/pages/recruit/recruit';
			if(user && user.id) {
				page = page + '?id=' + user.id+'&langtype='+this.langtype;
			}else{
				page = page+'?langtype='+this.langtype
			}
			if(this.shareInfo) {
				return {
					title: this.shareInfo.title,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page
				}
			}else{
				return {
				  title: this.$t('recruit').title,
				  path: page
				}
			}
		},
		async onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.$t('recruit').title
			});
			let pid = options?options.id||0 : 0;
			if(pid&&pid>0) {
				loginAsync(pid);
			}
			shareInfoOfAffiliate(this.langtype).then(res=>{
				this.shareInfo = res;
			});
			let recruit = await recruitInfo(this.langtype);
			if(recruit) {
				this.recruitInfo = recruit;
			}
			
			if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			userNameInput(e) {
				this.joinModel.trueName = e.detail.value;
			},
			userTelInput(e) {
				this.joinModel.tel = e.detail.value;
			},
			userCityInput(e) {
				this.joinModel.cityName = e.detail.value;
			},
			examNameInput(e) {
				this.joinModel.examName = e.detail.value;
			},
			onSubmit(){
				if(this.isSubmiting) {
					return;
				}
				console.log(this.isSubmiting);
				if(!this.joinModel.trueName) {
					this.$api.msg(this.i18n.userName2);
					return;
				}
				if(!this.joinModel.tel) {
					this.$api.msg(this.i18n.userTel2);
					return;
				}
				if(!this.joinModel.cityName) {
					this.$api.msg(this.i18n.userCity2);
					return;
				}
				if(!this.joinModel.examName) {
					this.$api.msg(this.i18n.nameOfTheExaminationRoom2);
					return;
				}
				this.isSubmiting = false;
				submitRecruit(this.joinModel).then(res=>{
					if(res && res.data) {
						this.$api.msg('提交成功');
						setTimeout(function(){
							uni.navigateBack({
								delta: 1
							});
						}, 2000);
					}else{
						this.isSubmiting = true;
					}
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
		}
	}
</script>

<style lang="scss">

	.bg{
		width: 100%;
		font-size: 50upx;
		padding: 30upx 30upx 50upx;
		background-size: 100% 100%;
		text-align: center;
		.Body{
			width: 100%;
			height: 100%;
			margin: 55upx 0upx 30upx;
			padding: 60upx 30upx 25upx;
			position:relative;
			.b-btn{
				height: 77upx;
				width: 490upx;
				line-height: 65upx;
				border-radius: 20px;
				position: absolute;
				left: 85upx;
				top: -25upx;
				font-size: 30upx;
				display: flex;
				justify-content: center;
				color: #fff;
			}
			.tx{
				margin-top: 30upx;
				.tx-size{
					font-size: 30upx;
				}
				
			}
		}
		.bottom{
			width: 100%;
			height: 690upx;
			background-color: #fff;
			border-radius: 15upx;
			padding: 30upx 30upx 30upx;
			.Application{
				font-size: 45upx;
				margin-bottom: 30upx;
			}
			.size{
				font-size: 30upx;
				white-space:nowrap;
				float: left;
				margin-top: 5upx;
			}
			.size-input{
				font-size: 30upx;
				white-space:nowrap;
				//float: left;
				//margin-left: 165upx;
			}
			.input-style{
				height: 100upx;
				padding-top: 10upx;
				border: #F5F5F5 solid 4upx;
				border-top-style: none;
				border-left-style: none;
				border-right-style: none;
				display:flex;
				justify-content: space-between;
				align-items: center;
			}
			.b-button{
				width: 100%;
				height: 80upx;
				margin-top: 50upx;
			}
		}
		.copywechat {
			text-align: center;
			margin-top: 16upx;
			font-size: 30upx;
			.tit-box {
				color:#F8F8F8;
			}
		}
	}
</style>
