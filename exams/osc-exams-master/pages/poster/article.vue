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
	import { shareInfoOfAffiliate, shareInfoOfstrategyBackground, codeImageInfoOfCategory } from '@/api/share';
	import { categoryInfo } from '@/api/category';
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
				productTitle: '',
				buttonDesc: '',
				bottomTitle: '',
				bottomDesc1: '',
				bottomDesc2: '',
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
			let articleId = options?options.id || 0:0;
			let article = articleId>0? await categoryInfo(articleId):null;
			if(article && article.data) {
				this.httpCoverUrl = article.data.imageUrl;
				this.productName = article.data.title;
			}
			let user = await this.$api.getUserInfo();
			if(user) {
				this.avatar = user.avatar || this.avatar;
				this.nickName = user.nickName || this.nickName;
			}
			let city = await this.$api.getCity();
			let cityName = '';
			if(city && city.name) {
				cityName = city.name;
			}
			if(this.$t('poster').article.titleDesc) {
				this.productTitle = cityName + this.productName+','+this.$t('poster').article.titleDesc;
			}else {
				this.productTitle = cityName + this.productName;
			}
			
			this.productName =  this.$t('poster').article.nickDesc + cityName + this.productName;
			// this.nickName = this.$t('poster').nickDesc.replace('XX', this.nickName);
			this.buttonDesc = this.$t('poster').article.buttonDesc;
			this.bottomTitle = this.$t('poster').article.bottomTitle;
			this.bottomDesc1 = this.$t('poster').article.bottomDesc1;
			this.bottomDesc2 = this.$t('poster').article.bottomDesc2;
			if(!this.httpCoverUrl) {
				this.shareInfo = await shareInfoOfAffiliate(this.langtype);
				if(this.shareInfo && this.shareInfo.httpImageUrl) {
					this.httpCoverUrl = this.shareInfo.httpImageUrl;
				}
			}
			let bgInfo = await shareInfoOfstrategyBackground(this.langtype);
			if(bgInfo && bgInfo.httpImageUrl) {
				this.httpBackgroundImageUrl = bgInfo.httpImageUrl;
			}
			if(articleId>0) {
				let codeInfo = await codeImageInfoOfCategory(articleId, this.langtype);
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
							// 		dx: bgObj.width-bgObj.width*0.235,
							// 		dy: bgObj.height - bgObj.width*0.235
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
									dx: bgObj.width*0.1,
									dy: 20,
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
									dx: bgObj.width/2 - bgObj.width*0.825/2,
									dy: 233,
									//circleSet: true,  // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
									infoCallBack(imageInfo) {
										// 4:3 = bgObj.width*0.8:x
										// let scale = bgObj.width*0.8 / imageInfo.width;
										return {
											dWidth: bgObj.width*0.825,    // 因为设置了圆形图片 所以要乘以2
											dHeight: bgObj.width*0.68,
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
									dx: bgObj.width-bgObj.width*0.235,
									dy: bgObj.height - bgObj.width*0.235,
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
									fontSize = bgObj.width*0.04;
								}
								const lineHeight = bgObj.height*0.04;
								let ltr =  this.ltr;
								return [{
									text: this.nickName,
									size: fontSize*1.1,
									color: 'black',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width*0.15+10+bgObj.width*0.12, //bgObj.width - textLength - fontSize,
											dy: 40
										}
									}
								}, {
									text: this.productName,
									size: fontSize*0.9,
									color: 'black',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width*0.15+10+bgObj.width*0.12, //bgObj.width - textLength - fontSize,
											dy: 40 + 43
										}
									}
								}, 
								{
									text: this.productTitle,
									size: fontSize*1.2,
									color: 'black',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width - bgObj.width*0.08*2,
										lineNum: 2,
										lineHeight: fontSize*1.4
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width*0.08, //bgObj.width - textLength - fontSize,
											dy: 100 + bgObj.width*0.12
										}
									}
								},
								{
									text: this.buttonDesc,
									size: fontSize,
									color: 'white',
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
											dy: bgObj.height*0.725
										}
									}
								},
								{
									text: this.bottomTitle,
									size: fontSize*0.75,
									color: 'black',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width*0.3,
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width*0.04, //bgObj.width - textLength - fontSize,
											dy: bgObj.height - bgObj.width*0.05 - 40
										}
									}
								},
								{
									text: this.bottomDesc1,
									size: fontSize*(ltr?0.9:0.8),
									color: 'black',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width*(ltr?0.4:0.8),
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width*(ltr?0.33:0.3), //bgObj.width - textLength - fontSize,
											dy: bgObj.height - bgObj.width*0.05 - 60
										}
									}
								},
								{
									text: this.bottomDesc2,
									size: fontSize*(ltr?0.9:0.8),
									color: 'black',
									alpha: 1,
									textAlign: 'left',
									textBaseline: 'middle',
									lineFeed: {
										maxWidth: bgObj.width*(ltr?0.4:0.8),
										lineNum: 1
									},
									infoCallBack(textLength) {
										return {
											dx: bgObj.width*(ltr?0.33:0.1), //bgObj.width - textLength - fontSize,
											dy: bgObj.height - bgObj.width*(ltr?0.05:0.045) - 20
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
