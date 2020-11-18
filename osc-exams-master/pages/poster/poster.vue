<template>
	<view class="content">
		<view class="flex_row_c_c modalView" :class="qrShow?'show':''">
			<view class="flex_column">
				<view>
					<image :src="poster.finalPath" mode="widthFix" class="posterImage"></image>
				</view>
				<view class="flex_row marginTop2vh">
					<button class="cu-btn bg-gradual-orange shadow-blur" @tap.prevent.stop="saveImage()">{{i18n.saveBtn}}</button>
				</view>
			</view>
		</view>
		<!-- <button type="primary" @tap="shareFc()">生成海报</button> -->
		<view class="hideCanvasView">
			<canvas class="hideCanvas" 
			canvas-id="default_PosterCanvasId"
			:style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}">
			</canvas>
		</view>
	</view>
</template>

<script>
	import { shareInfoOfProduct, shareInfoOfProductBackground, codeImageInfoOfProduct } from '@/api/share';
	import _app from '@/components/QS-SharePoster/app.js';
	import getSharePoster from '@/components/QS-SharePoster/QS-SharePoster.js';
	import {
	    mapState 
	} from 'vuex';  
	export default {
		data() {
			return {
				shareInfo: null,
				poster: {width: 500, height: 600},
				qrShow: false,
				canvasId: 'default_PosterCanvasId',
				httpBackgroundImageUrl: null,
				httpCoverUrl: null,
				avatar: '/static/missing-face.png',
				nickName: '游客',
				productName: '',
				tipTitle: '',
				tipDesc: '',
				tipTouch: '',
				httpCodeUrl: ''
			}
		},
		computed: {
			...mapState(['ltr','langtype']),
			i18n () {  
			  return this.$t('poster')
			}
		},
		async onLoad(options) {
			let title = this.$t('poster').title;
			uni.setNavigationBarTitle({
			　　title: title
			});
			let product = null;
			if(options) {
				// product = JSON.parse(decodeURIComponent(options.model));
				product = uni.getStorageSync("shareDATA");
				console.log(product)
				if(product) {
					this.httpCoverUrl = product.httpCoverUrl;
					this.productName = product.name;
				}
			}
			let user = await this.$api.getUserInfo();
			if(user) {
				this.avatar = user.avatar || this.avatar;
				this.nickName = user.nickName || this.nickName;
			}
			this.nickName = this.$t('poster').nickDesc.replace('XX', this.nickName);
			this.tipTitle = this.$t('poster').tipTitle;
			this.tipDesc = this.$t('poster').tipDesc;
			this.tipTouch = this.$t('poster').tipTouch;
			if(!this.httpCoverUrl) {
				this.shareInfo = await shareInfoOfProduct(this.langtype);
				if(this.shareInfo && this.shareInfo.httpImageUrl) {
					this.httpCoverUrl = this.shareInfo.httpImageUrl;
				}
			}
			let bgInfo = await shareInfoOfProductBackground(this.langtype);
			if(bgInfo && bgInfo.httpImageUrl) {
				this.httpBackgroundImageUrl = bgInfo.httpImageUrl;
			}
			if(product && product.id) {
				if(product.productId) {
					product.id = product.productId;
				}
				let codeInfo = await codeImageInfoOfProduct(product.id, this.langtype);
				if(codeInfo && codeInfo.qrcodeUrl) {
					this.httpCodeUrl = codeInfo.qrcodeUrl;
				}
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
							// 		text: '你好，我是取舍',
							// 		// #ifndef H5
							// 		image: this.avatar,
							// 		// #endif
							// 		// #ifdef H5
							// 		image: '/static/2.jpg',
							// 		// #endif
							// 		size: bgObj.width*0.2,
							// 		dx: bgObj.width/2-bgObj.width*0.2/2,
							// 		dy: bgObj.height - bgObj.width*0.2 - bgObj.width*0.35/2
							// 	}]
							// },
							imagesArray: ({bgObj, type, bgScale}) => { //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
								const dx = bgObj.width*0.3; 
								return [{
									// #ifndef H5
									url: this.avatar,
									// #endif
									// #ifdef H5
									url: '/static/3.jpg',
									// #endif
									size: bgObj.width*0.15,
									dx: bgObj.width/2 - bgObj.width*0.15/2,
									dy: bgObj.width*0.12,
									//circleSet: true,  // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
									infoCallBack(imageInfo) {
										// let scale = bgObj.width*0.8 / imageInfo.width;
										return {
											dWidth: bgObj.width*0.15,    // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width*0.15,
											roundRectSet: { // 圆角矩形
												r: bgObj.width*0.15/2
											}
										}
									}
								},
								{
									// #ifndef H5
									url: this.httpCoverUrl,
									// #endif
									// #ifdef H5
									url: '/static/3.jpg',
									// #endif
									dx: bgObj.width/2 - bgObj.width*0.6/2,
									dy: 220,
									//circleSet: true,  // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
									infoCallBack(imageInfo) {
										// 4:3 = bgObj.width*0.8:x
										// let scale = bgObj.width*0.8 / imageInfo.width;
										return {
											dWidth: bgObj.width*0.6,    // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width*0.6*3/4,
											// roundRectSet: { // 圆角矩形
											// 	r: imageInfo.width*.1
											// }
										}
									}
								},
								{
									// #ifndef H5
									url: this.httpCodeUrl,
									// #endif
									// #ifdef H5
									url: '/static/3.jpg',
									// #endif
									dx: bgObj.width/2-bgObj.width*0.2/2,
									dy: bgObj.height - bgObj.width*0.2 - bgObj.width*0.35/2,
									infoCallBack(imageInfo) {
										return {
											dWidth: bgObj.width*0.2, 
											dHeight: bgObj.width*0.2
										}
									}
								}]
							},
							textArray: ({bgObj, type, bgScale}) => {
								let fontSize = bgObj.width*0.045;
								if(!this.ltr) {
									fontSize = bgObj.width*0.03;
								}
								const lineHeight = bgObj.height*0.04;
								return [{
									text: this.nickName,
									size: fontSize*1.1,
									color: 'black',
									alpha: 1,
									textAlign: 'center',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width/2, //bgObj.width - textLength - fontSize,
											dy: bgObj.width*0.32
										}
									}
								}, {
									text: this.productName,
									size: fontSize*1.1,
									color: 'black',
									alpha: 1,
									textAlign: 'center',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width/2, //bgObj.width - textLength - fontSize,
											dy: 220 + bgObj.width*0.6*3/4 + 40
										}
									}
								}, 
								{
									text: this.tipTitle,
									size: fontSize*1.1,
									color: 'black',
									alpha: 1,
									textAlign: 'center',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width/2, //bgObj.width - textLength - fontSize,
											dy: 220 + bgObj.width*0.6*3/4 + 40 + fontSize*1.1 + 20
										}
									}
								},
								{
									text: this.tipDesc,
									size: fontSize*0.9,
									color: '#e56536',
									alpha: 1,
									textAlign: 'center',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width/2, //bgObj.width - textLength - fontSize,
											dy: 220 + bgObj.width*0.6*3/4 + 40 + (fontSize*1.1 + 20)*2
										}
									}
								},
								{
									text: this.tipTouch,
									size: fontSize*0.8,
									color: 'black',
									alpha: 1,
									textAlign: 'center',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width/2, //bgObj.width - textLength - fontSize,
											dy: bgObj.height - bgObj.width*0.25/2
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

	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}
/* 
	.backgroundColor-white {
		background-color: white;
	}

	.border_radius_10px {
		border-radius: 10px;
	}

	.padding1vh {
		padding: 1vh;
	}
 */
	.posterImage {
		width: 80vw;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.marginTop2vh {
		margin-top: 2vh;
		button {
			width: 100%;
		}
	}
</style>
