<template>
	<view v-if="show" class="mask" @click="toggleMask" @touchmove.stop.prevent="stopPrevent"
		:style="{backgroundColor: backgroundColor}"
	>
		<view v-if="showCode" class="qrcode-content" @click.stop.prevent="stopPrevent">
			<image :src="shareModel.data.qrcodeUrl" mode="aspectFit"></image>
			<button class="cu-btn bg-gradual-orange shadow-blur share-ico" @click="saveCode">{{i18n.saveBtn}}</button>
		</view>
		<view 
			v-if="!showCode"
			class="mask-content"
			@click.stop.prevent="stopPrevent"
			:style="[{
				height: config.height, 
				transform: transform
			}]"
		>
			<scroll-view class="view-content" scroll-y>
				<!-- <view class="share-header">
					分享到
				</view> -->
				<view class="share-list">
					<button
						class="share-item" 
						open-type="share"
						:id="shareModel.data.recordId"
						:data-type="shareModel.type"
						data-name=""
						:data-imgurl="shareModel.data.qrcodeUrl"
					>
						<image :src="shareList[0].icon" mode=""></image>
						<text>{{shareList[0].text}}</text>
					</button>
					<button v-if="!hasLogin"
						class="share-item" 
						open-type="getUserInfo" @getuserinfo="getWxUserInfo"
					>
						<image :src="shareList[1].icon" mode=""></image>
						<text>{{shareList[1].text}}</text>
					</button>
					<button
						v-if="hasLogin"
						class="share-item" 
						@click="shareToFriend()"
					>
						<image :src="shareList[1].icon" mode=""></image>
						<text>{{shareList[1].text}}</text>
					</button>
					<!-- <view 
						v-for="(item, index) in shareList" :key="index"
						class="share-item" 
						@click="shareToFriend(item.text)"
					>
						<image :src="item.icon" mode=""></image>
						<text>{{item.text}}</text>
					</view> -->
				</view>
			</scroll-view>
			<!-- <view class="bottom b-t" @click="toggleMask">取消</view> -->
		</view>
	</view>
</template>

<script>
	import { login } from '@/api/user';
	import {
	    mapState,
		mapMutations
	} from 'vuex'; 
	export default {
		data() {
			return {
				showCode: false,
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				show: false,
				config: {}
			};
		},
		props:{
			contentHeight:{
				type: Number,
				default: 0
			},
			//是否是tabbar页面
			hasTabbar:{
				type: Boolean,
				default: false
			},
			shareModel: {
				type: Object,
				default: function(){
					return {};
				}
			}
		},
		computed:{
			...mapState(['hasLogin']),
			i18n () {
			  return this.$t('proxypay')
			},
			shareList() {
				return [
					{
						type: 1,
						icon: '/static/share_wechat.png',
						text: this.$t('proxypay').sharefreind
					},
					{
						type: 2,
						icon: '/static/share_qrcode.png',
						text: this.$t('proxypay').shareposter
					}
				];
			}
		},
		created() {
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		methods:{
			...mapMutations(['language','Login','InitConfig']),
			saveCode(){
				if(this.shareModel.data && this.shareModel.data.qrcodeUrl) {
					uni.downloadFile({
						url: this.shareModel.data.qrcodeUrl,
						success:(res)=>{
							if(res.tempFilePath) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success:(result) =>{
										this.$api.msg(this.i18n.saveSuccess);
										this.showCode = false;
									}
								})
							}
						}
					});
				}else{
					this.$api.msg(this.i18n.saveFail);
					this.showCode = false;
				}
			},
			toggleMask(){
				if(this.showCode) {
					this.showCode = false;
					return;
				}
				//防止高频点击
				if(this.timer == 1){
					return;
				}
				this.timer = 1;
				setTimeout(()=>{
					this.timer = 0;
				}, 500)
				
				if(this.show){
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					setTimeout(()=>{
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 200)
					return;
				}
				
				this.show = true;
				//等待mask重绘完成执行
				if(this.hasTabbar){
					uni.hideTabBar({
						success: () => {
							setTimeout(()=>{
								this.backgroundColor = this.config.backgroundColor;
								this.transform = 'translateY(0px)';
							}, 10)
						}
					});
				}else{
					setTimeout(()=>{
						this.backgroundColor = this.config.backgroundColor;
						this.transform = 'translateY(0px)';
					}, 10)
				}
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			loginCallback(info) {
				let loginRes = login(info);
				if(loginRes){
					loginRes.then(result=>{
						if(result && result.code ===0 && result.data && result.data.user){
							this.Login(result.data.user);
							this.InitConfig(result.data.config);
							this.shareToFriend();
						}
					})
				}
			},
			getWxUserInfo(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo);
				}
			},
			//分享操作
			shareToFriend(){
				if(this.hasLogin) {
					//this.toggleMask();
					let page = null;
					this.showCode = true;
					// if(this.shareModel.type === 'proxypay'){
					// 	page = '/pages/poster/proxypay';
					// 	uni.setStorage({
					// 		key : 'proxypayDATA',
					// 		data: this.shareModel.data,
					// 		success: (res) => {
					// 			uni.navigateTo({
					// 				url: page
					// 			});
					// 		}
					// 	});
					// }
				}
			},
		}
	}
</script>

<style lang='scss'>
	.mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 1025;
		transition: .3s;
		.bottom{
			position:absolute;
			left: 0;
			bottom: 0;
			display:flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 90upx;
			background: #fff;
			z-index: 9;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
		}
	}
	.qrcode-content {
		width: calc(100vw - 80upx);
		height: calc(100vw - 80upx);
		background: #fff;
		position: absolute;
		left: 40upx;
		top:10%;
		border-radius: 20upx;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		line-height: 20upx;
		text-align: center;
		image {
			width: 100%;
			height: 100%;
		}
		.share-ico {
			display: flex;
			position: absolute;
			bottom: -100upx;
			width: calc(100vw - 80upx);
			left: 0upx;
		}
	}
	.mask-content{
		width: 100%;
		transition: .3s;
		background: #fff;
		&.has-bottom{
			padding-bottom: 90upx;
		}
		.view-content{
			height: 100%;
		}
	}
	.share-header{
		height: 110upx;
		font-size: $font-base+2upx;
		color: font-color-dark;
		display:flex;
		align-items:center;
		justify-content: center;
		padding-top: 10upx;
		&:before, &:after{
			content: '';
			width: 240upx;
			heighg: 0;
			border-top: 1px solid $border-color-base;
			transform: scaleY(.5);
			margin-right: 30upx;
		}
		 &:after{
			 margin-left: 30upx;
			 margin-right: 0;
		 }
	}
	.share-list{
		display:flex;
		flex-wrap: wrap;
		padding: 50upx 5% 50upx;
		justify-content: space-around;
		button {
			border:0upx;
			background: #fff;
			border-radius: 0upx;
			line-height: auto;
			min-width: 33.33%;
			display:flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			height: 180upx;
			margin:0upx;
			padding:0upx;
			position: none;
			image{
				width: 120upx;
				height: 120upx;
				position: absolute;
				top:5upx;
				overflow: auto;
			}
			text{
				font-size: $font-base;
				color: $font-color-base;
				position: absolute;
				bottom: 40upx;
				height: 15.2upx;
			}
		}
		button::after { 
			border: none;
		} 
		.button-hover {
			background: #fff;
			border: 0upx;
		}
	}
	.share-item{
		min-width: 33.33%;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 180upx;
		image{
			width: 120upx;
			height: 120upx;
			margin-bottom: 16upx;
		}
		text{
			font-size: $font-base;
			color: $font-color-base;
		}
	}
</style>
