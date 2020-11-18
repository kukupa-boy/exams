<template>
	<view class="content" :class="qrShow? (ltr?'':' rtlDirection ') : (ltr?'modalView':'modalView rtlDirection ')">
		<view class="help-text">
			<view>{{i18n.desc1}}</view>
			<view>{{i18n.desc2}}</view>
			<!-- <text>2.打印出来贴在车里吧，学员扫码更方便！</text> -->
		</view>
		<view>
			<image v-if="qrShow" class="img" :src="poster.finalPath"></image>
		</view>
		<view class="save">
			<!-- <image class="save" src="../../static/123.jpg"></image> -->
			<text class="ps-tx">{{i18n.desc3}}</text>
			<button class="save-button cu-btn bg-gradual-orange shadow-blur" @tap.prevent.stop="saveImage()">{{i18n.button}}</button>
		</view>
		<view class="hideCanvasView">
			<canvas class="hideCanvas" 
			canvas-id="default_PosterCanvasId"
			:style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}">
			</canvas>
		</view>
	</view>
</template>

<script>
	import { shareInfoOfStudentBackground, codeImageInfoOfPromoter } from '@/api/share';
	import { categoryInfo } from '@/api/category';
	import _app from '@/components/QS-SharePoster/app.js';
	import getSharePoster from '@/components/QS-SharePoster/QS-SharePoster.js';
	import {
	    mapState 
	} from 'vuex';  
	export default {
		data() {
			return {
				poster: {width: 500, height: 600},
				qrShow: false,
				canvasId: 'default_PosterCanvasId',
				httpBackgroundImageUrl: '/static/PromotionCode-img.jpg',
				httpCoverUrl: 'https://mobile.guaguu.com/exams/static/images/poster_article_bg.jpg',
				httpCodeUrl: null,
				avatar: '/static/missing-face.png'
			}
		},
		computed: {
			...mapState(['ltr','langtype']),
			i18n () {  
			  return this.$t('poster').promoter
			}
		},
		async onLoad() {
			let title = this.$t('poster').promoter.title;
			uni.setNavigationBarTitle({
			　　title: title
			})
			let bgInfo = await shareInfoOfStudentBackground(this.langtype);
			if(bgInfo && bgInfo.httpImageUrl) {
				this.httpBackgroundImageUrl = bgInfo.httpImageUrl;
			}
			let codeInfo = await codeImageInfoOfPromoter(this.langtype);
			if(codeInfo && codeInfo.qrcodeUrl) {
				this.httpCodeUrl = codeInfo.qrcodeUrl;
			}
			if(this.httpCoverUrl) {
				this.shareFc();
			}
			
		},
		methods: {
			async shareFc() {
				if(!this.httpCoverUrl) {
					return;
				}
				try {
					if (!this.poster.finalPath) {
						const d = await getSharePoster({
							type: 'testShareType',
							backgroundImage: this.httpBackgroundImageUrl,
							posterCanvasId: this.canvasId,
							// qrCodeArray: ({bgObj, type, bgScale}) => {
							// 	return [{
							// 		text: 'Hello world',
							// 		// #ifndef H5
							// 		image: this.avatar,
							// 		// #endif
							// 		// #ifdef H5
							// 		image: '/static/2.jpg',
							// 		// #endif
							// 		size: bgObj.width*0.5,
							// 		dx: bgObj.width*0.5/2,
							// 		dy: bgObj.width*0.63/2
							// 	}]
							// },
							imagesArray: ({bgObj, type, bgScale}) => { //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
								const dx = bgObj.width*0.3; 
								return [{
									// #ifndef H5
									url: this.httpCodeUrl,
									// #endif
									// #ifdef H5
									url: '/static/3.jpg',
									// #endif
									size: bgObj.width*0.15,
									dx: bgObj.width*0.5/2,
									dy: bgObj.width*0.63/2,
									//circleSet: true,
									infoCallBack(imageInfo) {
										// let scale = bgObj.width*0.8 / imageInfo.width;
										return {
											dWidth: bgObj.width*0.5,    // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width*0.5
										}
									}
								}]
							},
							setCanvasWH: ({bgObj, type, bgScale}) => { // 为动态设置画布宽高的方法，
								this.poster = bgObj;
							}
							// setDraw: ({Context, bgObj, type, bgScale}) => {
							// 	Context.setFillStyle('black');
							// 	Context.setGlobalAlpha(0.3);
							// 	Context.fillRect(0, bgObj.height - bgObj.height*0.2, bgObj.width, bgObj.height*0.2);
							// }
						});
						console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath)
						this.poster.finalPath = d.poster.tempFilePath;
					}
					this.qrShow = true;
				} catch (e) {
					_app.hideLoading();
					_app.showToast(JSON.stringify(e));
					console.log(JSON.stringify(e));
				}
			},
			saveImage() {
				// #ifndef H5
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_app.showToast('保存成功');
					}
				})
				// #endif
				// #ifdef H5
				_app.showToast('保存了');
				// #endif
			},
			share() {
				// #ifdef APP-PLUS
				_app.getShare(false, false, 2, '', '', '', this.poster.finalPath, false, false);
				// #endif
			
				// #ifndef APP-PLUS
				_app.showToast('分享了');
				// #endif
			},
			hideQr() {
				this.qrShow = false;
			}
		}
	}
</script>


<style lang="scss">
	.hideCanvasView {
		position: relative;
	}
	
	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}
	
	.content{
		padding:60upx 40upx 0upx;
		.help-text{
			height: auto;
			width: 100%;
			line-height:50upx;
			margin-bottom: 60upx;
		}
		.img{
			width: 100%;
			height: 760upx;
			border-radius: 10upx;
		}
		.save{
			height: 200upx;
			width: 100%;
			margin-top: 60upx;
			text-align:center;
			background-color: #F1F1F1;
			.ps-tx{
				font-size: 27upx;
				color: orange;
			}
			.save-button{
				width: 100%;
				height: 80upx;
				margin-top: 15upx;
			}
		}
	}
	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(3);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.8);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 999;
		
		.show {
			opacity: 1;
			transform: scale(1);
			pointer-events: auto;
		}
	}
</style>
