<template>
	<view :class="(ltr?'':' rtlDirection ')">
		<form>
			<view class="cu-bar bg-white">
				<view class="action">
					{{i18n.feedtext}}
				</view>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="260" :disabled="modalName!=null" @input="contentInput" :placeholder="i18n.feedtextDesc"></textarea>
			</view>
			<view class="cu-form-group margin-top ">
				<view class="title" :class="ltr?'':' titlertl '">{{i18n.contact}}</view>
				<input :placeholder="i18n.contactDesc" name="input" @input="userTelInput" maxlength="11" type="number" ></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
			</view>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					{{i18n.upload}}
				</view>
				<view class="action">
					{{imgList.length}}/{{maxImgCount}}
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
					 <image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<maxImgCount">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<button class="cu-btn bg-gradual-orange shadow-blur b-button" @click="submitData">{{i18n.submit}}</button>
		</form>
	</view>
</template>

<script>
	import { submitFeedback, uploadImages } from '@/api/feedback';
	import {  
	    mapState 
	} from 'vuex'; 
	export default {
		data() {
			return {
				maxImgCount: 5,
				imgList: [],
				submiting: false,
				fbModel: {
					userTel: '',
					content: '',
					attachments: null
				}
			}
		},
		computed: {
			...mapState(['ltr']),
			i18n () {  
			  return this.$t('feedback')
			}
		},
		created() {
			let title = this.$t('feedback').title;
			uni.setNavigationBarTitle({
			　　title: title
			})	
		},
		methods: {
		 	async submitData() {
				if(!this.fbModel.content) {
					// this.$api.msg('请输入反馈内容');
					this.$api.msg(this.$t('feedback').feedtextDesc);
					return;
				}
				if(!this.fbModel.userTel) {
					this.$api.msg(this.$t('feedback').contactDesc);
					return;
				}
				if(this.submiting) {
					return;
				}
				uni.showLoading({
					title: ''
				});
				this.submiting = true;
				//上传图片
				if(this.imgList && this.imgList.length>0) {
					for(let i=0;i<this.imgList.length;++i){
						let img = this.imgList[i];
						let res = await uploadImages(img);
						if(res && res.data) {
							let attachs = res.data.map((value, index) => {
								let suffixStr = 'unknow';
								if(value.url){
									let vurl = value.url.toLowerCase();
									if(vurl.indexOf('.png')!=-1){
										suffixStr='png';
									}else if(vurl.indexOf('.jpg')!=-1){
										suffixStr='jpg';
									}else if(vurl.indexOf('.gif')!=-1){
										suffixStr='gif';
									}else if(vurl.indexOf('.bmp')!=-1){
										suffixStr='bmp';
									}
								}
								return {
										oldFileName: value.oldFileName, 
										fileUrl: value.url,
										suffix: suffixStr
									}
							});
							if(!this.fbModel.attachments){
								this.fbModel.attachments = [];
							}
							this.fbModel.attachments = this.fbModel.attachments.concat(attachs);
						}
					}
				}
				// 保存信息
				var sres = await submitFeedback(this.fbModel);
				uni.hideLoading();
				if(sres && sres.data) {
					this.$api.msg(this.$t('feedback').success);
					setTimeout(function(){
						uni.navigateBack({
							delta: 1
						});
					}, 2000);
				}else{
					this.submiting = false;
				}
			},
			ChooseImage() {
				if(this.maxImgCount<=0){
					return;
				}
				uni.chooseImage({
					count: this.maxImgCount - this.imgList.length, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						console.log(res);
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths);
						} else {
							this.imgList = res.tempFilePaths;
						}
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: this.$t('feedback').delTip,
					content: this.$t('feedback').delMsg,
					cancelText: this.$t('feedback').delCancel,
					confirmText: this.$t('feedback').delSure,
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
						}
					}
				})
			},
			userTelInput(e) {
				this.fbModel.userTel = e.detail.value;
			},
			contentInput(e) {
				this.fbModel.content = e.detail.value;
			}
		}
	}
</script>
<style lang="scss">
	.cu-btn{
		width: 90%;
		margin-left: 5%;
		margin-right: 5%;
		margin-top: 30upx;
	}
	.cu-bar {
		.action {
			margin-right: 30upx;
			margin-left: 30upx;
		}
	}
	.cu-form-group {
		.titlertl{
			padding-right: 0upx;
			padding-left: 30upx;
		}
	}
	.b-button{
		height: 80upx;
	}
	.cu-capsule {
		direction: ltr;
	}
</style>
