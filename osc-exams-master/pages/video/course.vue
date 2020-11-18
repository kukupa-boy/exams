<template>
	<view class="container" :class="ltr?'':'rtlDirection'">
		<view class="carousel">
			<view v-if="tryplay">
                <video id="myVideo" :src="src" 
				objectFit="fill"
				@error="videoErrorCallback" @waiting="videoWaitingCallback" 
				@timeupdate="videoTimeUpdateCallback"
				autoplay="true"
				:show-center-play-btn="disable" :poster="product.httpCoverUrl">
					<view class="video-time" v-if="!product.paied"><text @click="type = 1, payModel = true" class="text-orange">{{i18n.tryPlayBtn}}</text></view>
				</video>
            </view>
			<view v-if="tryplay==false && product.paied">
				<image :src="product.httpCoverUrl"></image>
				<!-- <button class="cu-btn bg-video shadow-blur round paid-play" @click="videoPlay()">{{i18n.playVideo}}</button> -->
			</view>
			<view v-if="tryplay==false && !product.paied">
				<image :src="product.httpCoverUrl"></image>
				<view v-if="android" class="price-desc">
					<view class="price-new">
						<text class="price-dor">￥</text>
						<text v-if="product.activity" class="price-now">{{product.activPrice}}</text>
						<text v-if="!(product.activity)" class="price-now">{{product.price}}</text>
						<!-- <text class="price-dor">.90</text> -->
					</view>
					<view v-if="product.activity" :class="'price-info'+(ltr?'':' rtlDirection ')">
						<view class="bg-orange coupon-tip">{{product.activity.name}}</view>
						<view class="price-old">￥{{product.price}}</view>
					</view>
					<view v-if="product.activity" :class="'activity-info'+(ltr?'':' rtlDirection ')">
						<view class="activity-desc">{{i18n.activiEnd}}</view>
						<view :class="'activity-time'+(ltr?'':' rtlDirection ')">
							<text class="timespace">{{activity.day}}</text>
							<text>天</text>
							<text class="timespace">{{activity.hour}}</text>
							<text>时</text>
							<text class="timespace">{{activity.minute}}</text>
							<text>分</text>
							<text class="timespace">{{activity.seconds}}</text>
							<text>秒</text>
						</view>
					</view>
				</view>
				<!-- <button v-if="tryplayend==false" class="cu-btn bg-video shadow-blur round tryplay" @click="videoPlay()">{{i18n.tryPlay}}</button>
				<button v-if="tryplayend" class="cu-btn bg-video shadow-blur round tryplay" @click="videoTryPlayEnd()"> {{i18n.tryPlayEnd}}</button>-->
			</view>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{product.name}}</text>
			<view class="title-min">
				<text>{{product.synopsis || ''}}</text>
			</view>
			<view class="bot-row">
				<view class="playcount text-gray"><text v-if="chapters && chapters.length>0">{{i18n.courseUpdates.replace('XXX',product.courses?product.courses:0)}}</text><text class="margin-left-xs margin-right-xs">|</text><text>{{i18n.courseFeeds.replace('XXX',product.sales?product.sales:0)}}</text></view>
				<view class="collection-btn" :class="product.favorite?'text-orange':'text-gray'" @click="toFavorite">
					<text v-if="!product.paied" class="cuIcon" :class="product.favorite?'cuIcon-favorfill':'cuIcon-favor'"></text>
					<text v-if="!product.paied">{{i18n.collection}}</text>
				</view>
				<view class="share-btn" @click="share">
					<text class="cuIcon text-gray cuIcon-share"></text>
					<text class="text-gray">{{i18n.share}}</text>
				</view>
				<view class="share-btn" v-if="product && (product.bargain || product.bargainorderid>0)" @click="bargainNav">
					<text class="cuIcon text-gray cuIcon-creative"></text>
					<text class="text-gray">{{i18n.creative}}</text>
				</view>
			</view>
			<!-- 微信群 -->
			<view class="wechatgroup shadow-blur" v-if="product && product.wechatgroupid>0" @click="showOrHideWechat">
				<view class="stamp stamp-wxgroup">
					<text class="i" :class="ltr?'':'ileft'"></text>
					<view class="par">
						<text class="cuIcon cuIcon-group"></text><text>{{product.wechatGroupTitle || ''}}</text>
					</view>
					<view class="copy"><text>{{i18n.courseWxGroup}}</text><text class="cuIcon" :class="ltr?'cuIcon-right':'cuIcon-back'"></text></view>
					
				</view>
			</view>
			<view class="btn-group" v-if="!product.paied && hasLogin && product.price > 0">
				<button class="cu-btn bg-gradual-orange shadow-blur buy" @click="type = 1,payModel = true">{{ android?i18n.rewards:i18n.tryPlayBtn}}<text v-if="android" class="margin-left-xs margin-right-xs">￥{{product.activPrice}}</text></button>
				<button class="cu-btn bg-gradual-green shadow-blur freindbuy" @click="type = 2,payModel = true">{{i18n.freindPay}}</button>
			</view>
			<view class="btn-group" v-if="!product.paied && !hasLogin && product.price > 0">
				<button class="cu-btn bg-gradual-orange shadow-blur buy" open-type="getUserInfo" @getuserinfo="getWxUserInfoBuy">{{ android?i18n.rewards:i18n.tryPlayBtn}}<text v-if="android" class="margin-left-xs margin-right-xs">￥{{product.activPrice}}</text></button>
				<button class="cu-btn bg-gradual-green shadow-blur freindbuy" open-type="getUserInfo" @getuserinfo="getWxUserInfoProxyBuy">{{i18n.freindPay}}</button>
			</view>
			<view :class="payModel ? 'cu-modal show' : 'cu-modal'">
			  <view class="cu-dialog">
			    <view class="cu-bar bg-white justify-between">
				<view class="dialogTitle margin-left-xl">{{i18n.wenxinInfo}}</view>
			      <view class="action" @click="payModel = false">
			        <text class="cuIcon-close text-red"></text>
			      </view>
			    </view>
			    <view class="padding-sm bg-white flex-direction">
					<view class="flex flex-direction">
						<text class="text-black text-bold text-lg">{{product.name}}</text>
						<text class="text-red priceTitle">￥{{product.price}}</text>
					</view>
					<view class="dialogMsg">{{i18n.surePay}}</view>
			    </view>
			    <view class="cu-bar bg-white justify-end">
			      <view class="action">
			        <button class="cu-btn line-green text-green margin-left" @click="payModel = false">{{i18n.cancel}}</button>
			        <button v-if="hasTel" class="cu-btn bg-green margin-left" @click="surePay">{{i18n.sure}}</button>
					<button v-if="!hasTel" class="cu-btn bg-green margin-left" open-type="getPhoneNumber" @getphonenumber="getUserPhoneBuy">{{i18n.sure}}</button>
			      </view>
			    </view>
			  </view>
			</view>
			<view v-if="!product.paied && product.price > 0" class="detail-desc">
				<view class="d-header text-orange">
					<text>{{i18n.rewardsDesc}}</text>
				</view>
			</view>
		</view>
		<view class="comboactivty-box" v-if="product && !product.paied && product.comboactivity" @click="onComboActivity">
			<image :src="product.comboactivity.httpimageurl"></image>
			<view class="title">
				<view class="price text-red">￥{{ product.comboactivity.price }} <view class="cu-tag round line-pink margin-left-sm margin-right-sm ">{{product.comboactivity.name}}<text class="cuIcon" :class="ltr?'cuIcon-right':'cuIcon-back'"></text><text class="cuIcon" :class="ltr?'cuIcon-right':'cuIcon-back'"></text>
				</view>
				</view>
				<view>{{ product.comboactivity.descrip }}</view>
			</view>
		</view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==tabCurrentIndex?'text-orange cur':''" v-for="(item,index) in navList" :key="index"
				 @tap="tabSelect" :data-id="index" v-if="(index == 1 && showDirectory && chapters && chapters.length>0) || index!=1">
					<view>{{item}}</view>
				</view>
			</view>
		</scroll-view>
		<!-- 详情 -->
		<view class="content-detail" v-if="tabCurrentIndex==0">
			<empty-List v-if="!product || !product.detail"></empty-List>
			<rich-text :nodes="productDetail"></rich-text>
		</view>
		<view :class="'f-header m-t'+(ltr?'':' rtlDirection ')" v-if="tabCurrentIndex==0">
			<text class="lg text-orange cuIcon-comment" :class="ltr?'':' image-rtl '"></text>
			<view class="tit-box">
				<text class="tit">{{i18n.courseChat}}</text>
			</view>
		</view>
		<view class="content-detail maocatPosition" v-if="tabCurrentIndex==0">
			<empty-List :desc="i18n.emptyDesc" v-if="!chatBox || chatBox.length <= 0"></empty-List>
			<video-chat-item :records="chatBox"></video-chat-item>
			<uni-load-more v-if="chatBox && chatBox.length > 0" :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
		</view>
		<!-- 目录 -->
		<view class="content-detail" v-if="tabCurrentIndex==1">
			<empty-List v-if="(!chapters || chapters.length<=0)"></empty-List>
			<view class="video-item" v-for="(item) in chapters" :key="item.id">
				<view class="video-title" @click="openOrClose(item)">
					<text class="cuIcon cuIcon-unfold"></text><text class="text-bold text-cut">{{item.name}}</text>
				</view>
				<view class="video-list" v-if="item.show" v-for="(video) in item.courses" :key="video.id" @click="playCourse(video)">
					<view class="video-left" :class="courseId==video.id?'text-blue':''">
						<view class="video-con">
							<!-- <text class="cuIcon cuIcon-recordfill"></text> -->
							<text class="cuIcon" :class="courseId==video.id?'cuIcon-recordfill':'cuIcon-record'"></text>
							<text class="text-cut">{{video.name}}</text>
							<view class="cu-tag round line-green sm" v-if="video.free">{{i18n.courseFree}}</view>
							<!-- <view class="cu-tag round line-orange sm">需购买课程</view> -->
						</view>
						<view class="time" :class="ltr?'':'paddingr'"><text class="text-gray">{{video.createdon | datetimeFilter}} | {{ i18n.studyTimes.replace('XXX',video.totalplay) }}</text></view>
					</view>
					<view class="video-right">
						<circleProgress :percent="video.playpercent"></circleProgress>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<!-- <view class="content-detail margin-bottom" v-if="tabCurrentIndex==2">
			<empty-List v-if="!chatBox || chatBox.length <= 0"></empty-List>
			<video-chat-item :records="chatBox"></video-chat-item>
			<uni-load-more v-if="chatBox && chatBox.length > 0" :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
		</view> -->
		<view class="cu-bar tabbar input foot" v-if="tabCurrentIndex==0 && showComment">
			<view class="cu-avatar round" :style="'background-image:url('+userInfo.avatar+');'"></view>
		    <input class="solid-bottom" :placeholder="i18n.msgplaceholder" v-model.trim="chatMsg" maxlength="300" cursor-spacing="10"></input>
			<button v-if="hasLogin" class="cu-btn bg-green shadow-blur margin-left" @click="sendMsg">{{i18n.send}}</button>
		    <button v-if="!hasLogin" class="cu-btn bg-green shadow-blur margin-left" open-type="getUserInfo" @getuserinfo="getWxUserInfoMsg">{{i18n.send}}</button>
		</view>
		<!-- 相关推荐 -->
		<view class="content-detail" v-if="tabCurrentIndex==2">
			<empty-List v-if="(!productList || productList.length<=0)"></empty-List>
			<product-item :goodsList="productList" :navToDetailPage="navToDetailPage" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :share="i18n.share"></product-item>
		</view>
		<view class="wechatgroup-dialog" v-if="showWechatgroup && wechatGroup">
			<view class="wechatcontent">
				<view class="text-lg text-green text-center">{{wechatGroup.name}}</view>
				<view class="text-center">{{wechatGroup.subtitle}}</view>
				<view class="text-center codeimg" @click="reviewImage()">
					<image :src="wechatGroup.httpqrcodeurl" mode="aspectFit"></image>
				</view>
				<view class="text-center">
					<text class="text-gray">{{wechatGroup.scantip}}</text>
				</view>
				<view class="text-center">
					<button class="cu-btn bg-gradual-orange shadow-blur" @click="saveImage()">{{i18n.saveBtn}}</button>
				</view>
			</view>
			<text class="cuIcon cuIcon-roundclose text-white closeicon" @click="showOrHideWechat"></text>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:shareModel="{data:product, type:'course'}"
		></share>
		<proxypay
			ref="proxypay" 
			:shareModel="{data:proxyInfo, type:'proxypay'}"
		></proxypay>
		
		<view :class="payResultWarning ? 'cu-modal show' : 'cu-modal'">
		  <view class="cu-dialog">
		    <view class="cu-bar bg-white justify-between">
			<view class="dialogTitle margin-left-xl">{{i18n.paytip}}</view>
		      <view class="action" @click="payResultWarning = false">
		        <text class="cuIcon-close text-red"></text>
		      </view>
		    </view>
		    <view class="padding-sm bg-white flex-direction">
				<view class="text-left">{{i18n.paytipCon}}</view>
		    </view>
		    <view class="cu-bar bg-white justify-end">
		      <view class="action">
		        <button class="cu-btn line-green text-green margin-left" @click="payResultWarning = false">{{i18n.cancel}}</button>
		        <button class="cu-btn bg-green margin-left" @click="loadData(product.id, true)">{{i18n.refresh}}</button>
		      </view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import { shareInfoOfProduct,codeRecordInfo, proxyOrderInfo } from '@/api/share';
	import { loginAsync, login, bindUserTel } from '@/api/user';
	import { videoUpdateProgress, productInfo, videoCourseInfo, videoCoursePlay, collecProduct, productSuggests } from '@/api/product';
	import { courseChapters } from '@/api/course';
	import { proComPage, proComSubmit } from '@/api/productComment';
	import { wechatgroupInfo } from '@/api/wechatgroup';
	import { paymentInfo } from '@/api/payment';
	import { categoryList } from '@/api/category';
	import share from '@/components/share';
	import proxypay from '@/components/proxypay';
	import productItem from '@/components/exams-product-item';
	import categoryItem from '@/components/exams-category-item';
	import listCell from '@/components/mix-list-cell';
	import circleProgress from '@/components/circle-inprogress';
	import emptyList from '@/components/emptyList';
	import videoChatItem from '@/components/video-chat/video-chat-item';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more';
	import {  
	    mapState,
		mapMutations
	} from 'vuex';  
	export default{
		components: {
			share,
			proxypay,
			productItem,
			categoryItem,
			listCell,
			circleProgress,
			emptyList,
			videoChatItem
		},
		data() {
			return {
				code: null, // 授权手机号code
				payResultWarning: false,
				loadingType: '',
				clicked: false,
				type:0, // 打赏1，找朋友帮打赏2
				pageChat: 1,
				proxyInfo: null,
				shareUserId: 0,
				payModel:false,
				chatMsg: null,
				chatBox: [],
				showWechatgroup: false,
				shareInfo: null,
				pickerIndex: 0,
				isPickerChange: false,
				tryplay: false, //试看
				tryplayend: false, //是否试看结束
				src: null, // 视频地址
				tempProgress: null,
				disable: false,
				duration: 10,
				maxPlayTime: 60,
				specClass: 'none',
				specSelected:[],
				tabCurrentIndex: 0,
				loadedCourses: false,
				loadedChats: false,
				loadedSuggests: false,
				navList: ['详情','目录', '相关推荐'],
				goodsList: [],
				product: {
					favorite: false,
					activPrice: '',
					price: ''
				},
				activity: {
					day: 0,
					hour: 0,
					minute: 0,
					seconds: 0
				},
				chapters: null,
				wechatGroup: null,
				courseId: 0, // 正在播放的课程ID
				coursePlaypercent: 0, //点击播放的时候之前的播放进度比
				timer: null,
				exam: this.$api.getExam(),
				exams: this.$api.getExams(),
				showComment: false,
				commentTop: 0,
				windowHeight: 0,
				navToDetailPage: function(item){
					let id = item.id;
					uni.redirectTo({
						url: `/pages/video/course?id=${id}`
					})
				}
			};
		},
		filters:{
			datetimeFilter(value) {
				if(value) {
					let date = new Date(value);
					return date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
				}
				return '';
			}
		},
		computed: {
			...mapState(['ltr','config','android','langtype','hasLogin','parentUserId','recordId','userInfo','hasTel']),
			i18n () {  
			  return this.$t('video')
			},
			productList(){
				return this.goodsList || [];
			},
			showDirectory() {
				if(this.shareUserId>0 || this.parentUserId>0 || this.recordId>0 || (this.product && this.product.paied)) {
					return true;
				}
				return false;
			},
			productDetail() {
				if(this.product && this.product.detail) {
					return this.product.detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
				}
				return '';
			}
		},
		onShareAppMessage(res) {
			let user = this.$api.getUserInfo();
			let page = '/pages/video/course?id='+this.product.id;
			if (res.from === 'button') {// 来自页面内分享按钮
			  console.log(res.target)
			  let id = res.target.id;
			  let type = res.target.dataset.type;
			  let title = res.target.dataset.name;
			  let imgurl = res.target.dataset.imgurl;
			  if(user && user.nickName) {
				  if(type==='proxypay') {
					title = this.$t('video').wantForHelp.replace('XXX',user.nickName);
				  }else{
					title = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY',title);
				  }
			  }
			  if(type === 'product') {
				  //产品分享
				  page = '/pages/video/video?id='+id;
			  }else if(type === 'course') {
				  //课程分享
				  page = '/pages/video/course?id='+id;
			  }else if(type === 'article') {
				  //攻略分享
				  page = '/pages/article/article?id='+id;
			  }else if(type === 'proxypay') {
				  //代付
				  imgurl = null;
				  page = '/pages/video/proxy?id='+id;
			  }
			  if(user && user.id) {
			  	page = page + '&userid=' + user.id;
			  }
			  return {
			  	title: title,
			  	imageUrl: imgurl,
			  	path: page+'&langtype='+this.langtype
			  }
			}
			if(user && user.id>0) {
				page = page + "&userid=" + user.id;
			}
			let nickName = '';
			if(user && user.nickName) {
				nickName = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY','');
			}
			let shareImgurl = this.product.httpCoverUrl;
			if(!shareImgurl&&this.shareInfo && this.shareInfo.httpImageUrl) {
				shareImgurl = this.shareInfo.httpImageUrl;
				
			}
			if(shareImgurl){
				return {
					title: nickName + this.product.name,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page+'&langtype='+this.langtype
				}
			}else{
				return {
				  title: nickName + this.product.name,
				  path: page+'&langtype='+this.langtype
				}
			}
		},
		// created() {
		// 	this.loadData();
		// },
		onPageScroll(obj) {
			if (this.commentTop - obj.scrollTop < this.windowHeight ){
				this.showComment = true;
			}else {
				this.showComment = false;
			}
			// console.log(obj.scrollTop);
		},
		async onLoad(options){
			let userid = options ? options.userid || 0 : 0;
			if(userid) {
				this.parentUser(userid);
			}
			let id = options ? options.id || 0 : 0;
			if(options && options.scene) {
				var scene = decodeURIComponent(options.scene);
				if(scene) {
					let recordid = Number(scene);
					if(recordid) {
						this.qrcodeRecordId(recordid);
						let record = await codeRecordInfo(recordid);
						if(record){
							userid = record.userId;
							id = record.entityId;
							this.resetlanguage(record.langtype);
						}
					}
				}
			}else if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
			if(id>0){
			   await this.loadData(id);
			}
			shareInfoOfProduct(this.langtype).then(res=>{
				this.shareInfo = res;
			});
			if(userid>0) {
				this.shareUserId = userid;
				loginAsync(userid);
			}
			this.initPlayTime();
			
			let i18n = this.$t('video');
			this.navList[0] = i18n.courseDetail;
			this.navList[1] = i18n.courseCatalog;
			// this.navList[2] = i18n.courseChat;
			this.navList[2] = i18n.courseSuggest;
			this.$nextTick(()=>{
				uni.getSystemInfo({
				　　success: (res) => { 
						this.windowHeight = res.windowHeight;
						let info = uni.createSelectorQuery().select(".maocatPosition");
						info.boundingClientRect((data) => { 
							if (data && data.top) {
								this.commentTop = data.top;
								if (res.windowHeight>data.top) {
									this.showComment = true;
								}
							}
						}).exec();
					}
				});
			});
			// setTimeout(() => {
			// 	uni.getSystemInfo({
			// 	　　success: (res) => { 
			// 			this.windowHeight = res.windowHeight;
			// 			let info = uni.createSelectorQuery().select(".maocatPosition");
			// 			info.boundingClientRect((data) => { 
			// 				if (data && data.top) {
			// 					this.commentTop = data.top;
			// 					if (res.windowHeight>data.top) {
			// 						this.showComment = true;
			// 					}
			// 				}
			// 			}).exec();
			// 		}
			// 	});
			// }, 600);
			this.initWxLogin();
		},
		onUnload() {
			if(this.timer) {
				clearInterval(this.timer);
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			if(this.tabCurrentIndex == 0) {
				this.loadChatContent();
				uni.stopPullDownRefresh();
			} else if(this.tabCurrentIndex == 1) {
				this.loadCourseChapters()
				uni.stopPullDownRefresh();
			} else if(this.tabCurrentIndex == 2) {
				// this.loadChatContent('refresh')
				this.loadProductSuggests()
				uni.stopPullDownRefresh();
			} 
			// else if(this.tabCurrentIndex == 3) {
			// 	this.loadProductSuggests()
			// 	uni.stopPullDownRefresh();
			// }
		},
		//加载更多
		onReachBottom(){
			if(this.tabCurrentIndex == 0) {
				this.loadChatContent();
				uni.stopPullDownRefresh();
			} else if(this.tabCurrentIndex == 1) {
				this.loadCourseChapters()
				uni.stopPullDownRefresh();
			} else if(this.tabCurrentIndex == 2) {
				// this.loadChatContent()
				this.loadProductSuggests()
				uni.stopPullDownRefresh();
			} 
			// else if(this.tabCurrentIndex == 3) {
			// 	this.loadProductSuggests()
			// 	uni.stopPullDownRefresh();
			// }
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo')
			// #endif
		},
		methods:{
			...mapMutations(['InitConfig','Login','resetlanguage','parentUser','qrcodeRecordId','refreshUserTel']),
			onComboActivity() {
				uni.redirectTo({
					url:'/pages/video/combo?id='+this.product.comboactivity.id
				});
			},
			initWxLogin(){
				uni.login({
				  provider: 'weixin',
				  success: (loginRes) => {
					  this.code = loginRes.code;
				  }
				});
			},
			initPlayTime() {
				if(this.config && this.config.trytime>0) {
					this.maxPlayTime = this.config.trytime;
				}else {
					this.maxPlayTime = -1;
				}
			},
			saveImage(){
				if(this.wechatGroup && this.wechatGroup.httpqrcodeurl) {
					uni.downloadFile({
						url: this.wechatGroup.httpqrcodeurl,
						success:(res)=>{
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success:(result) =>{
									this.$api.msg(this.i18n.saveSuccess);
								}
							})
							
						}
					});
				}
			},
			reviewImage(){
				if(this.wechatGroup && this.wechatGroup.httpqrcodeurl) {
					uni.previewImage({
						urls: this.wechatGroup.httpqrcodeurl,
						longPressActions: {
							itemList: [this.i18n.saveBtn],
							success: (data) => {
								this.saveImage();
							},
							fail: function(err) {
								console.log(err.errMsg);
							}
						}
					});
				}
			},
			showOrHideWechat(){
				if(this.product && this.product.id>0 && this.product.paied) {
					this.showWechatgroup = !this.showWechatgroup;
					if(!this.wechatGroup && this.showWechatgroup == true) {
						wechatgroupInfo(this.product.id).then((res) => {
							this.wechatGroup = res || null;
						});
					}
				}else{
					this.$api.msg(this.i18n.wechatTip);
				}
			},
			openOrClose(item) {
				item.show = !item.show;
			},
			async loadData(productId, checkpay){
				if(this.timer) {
					clearInterval(this.timer);
				}
				//跳转到指定的s位置
				//this.videoContext.seek(100);	
				var videoRes = await productInfo(productId);
				this.product = videoRes? videoRes.data || {} : {};
				if(this.product && this.product.name) {
					uni.setNavigationBarTitle({
					　　title: this.product.name
					});
					if(this.product.paied) {
						this.tabCurrentIndex = 1;
						this.payResultWarning = false;
					}else if(checkpay) {
						this.payResultWarning = true;
					}
				}else {
					this.$api.msg(this.i18n.deleteTip);
					setTimeout(()=>{
						uni.navigateBack();
					},2000);
				}
				this.loadCourseChapters();
				let that = this;
				that.timer = setInterval(function(){
					that.startActivity();
				}, 1000);
			},
			startActivity(){
				if(this.product && this.product.activity) {
					let startTime = this.product.activity.startTime;
					let endTime = this.product.activity.endTime;
					let now = new Date();
					var preTime=startTime-now.getTime();
					if(preTime<=0){
						var leftTime = endTime - now.getTime();
						var dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
						var hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
						var mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
						var ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
						this.activity.day = this.checkTime(dd);
						this.activity.hour = this.checkTime(hh);
						this.activity.minute = this.checkTime(mm);
						this.activity.seconds = this.checkTime(ss);
					}else{
						this.product.activity = null;
						clearInterval(this.timer);
					}
				}
			},
			checkTime(num) {
				if (num < 10) {
					num = "0" + num;
				}
				return num;
			},
			tabSelect(e) {
				this.tabCurrentIndex = Number(e.currentTarget.dataset.id);
				if(this.tabCurrentIndex == 1) {
					this.loadCourseChapters();
				}else if(this.tabCurrentIndex == 2) {
					this.loadProductSuggests();
				} else if(this.tabCurrentIndex == 0) {
					this.loadChatContent()
				}
			},
			async sendMsg() {
				if(!this.chatMsg || this.chatMsg.length == 0) {
					this.chatMsg = ''
					return this.$api.msg(this.i18n.writeMsg)
				}
				let model = {
					content: this.chatMsg,
					productid: this.product.id
				}
				let res = await proComSubmit(model);
				if(res && res === true) {
					this.chatMsg = '';
					return this.$api.msg(this.i18n.successSend);
					// 显示提交的评论-未审核仅自己可见
					// let msg = {
					// 	createdon: new Date(),
					// 	content: this.chatMsg,
					// 	user: {
					// 		avatar: this.userInfo.avatar,
					// 		nickName: this.userInfo.nickName
					// 	}
					// }
					// this.chatMsg = '';
					// let msgs = [];
					// msgs.push(msg);
					// msgs = msgs.concat(this.chatBox);
					// this.chatBox = msgs;
				} else {
					return this.$api.msg(this.i18n.failedSend)
				}
			},
			async loadChatContent(type='add') {
				if(this.product && this.product.id) {
					if(type === 'refresh'){
						this.pageChat = 1;
					}
					if(this.loadingType === 'loading'){
						//防止重复加载
						this.loadedChats = true
						return;
					}
					this.loadingType = 'loading';
					let chatBox = await proComPage(this.product.id, this.pageChat);
					if(type === 'refresh'){
						this.chatBox = [];
					}
					chatBox = chatBox || [];
					this.chatBox = this.chatBox.concat(chatBox);
					//判断是否还有数据， 有改为 more， 没有改为noMore 
					if (chatBox.length <= 0) {
						this.loadingType = 'nomore';
					}else {
						this.loadingType = 'more';
						this.pageChat++;
					}
					this.loadedChats = true;
					if(type === 'refresh'){
						uni.stopPullDownRefresh();
					}
				}
			},
			loadCourseChapters() {
				if(!this.loadedCourses && this.product && this.product.id) {
					courseChapters(this.product.id).then((res) => {
						if(res) {
							this.chapters = this.chapters || [];
							let tempChapters = [];
							for(var i=0; i!=res.length; ++i) {
								let item = res[i];
								item.show = true;
								tempChapters.push(item);
							}
							this.chapters = tempChapters || [];
						}
						this.loadedCourses = true;
					});	
				}
			},
			loadProductSuggests(){
				if(!this.loadedSuggests && this.product && this.product.id) {
					productSuggests(this.product.id).then((res) => {
						if(res) {
							this.goodsList = res || [];
						}
						this.loadedSuggests = true;
					});	
				}
			},
			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			videoWaitingCallback: function(e) {
				console.log(e)
			},
			videoTimeUpdateCallback: function(e) {
				// 更新播放进度
				let progress = {
					productid: this.product.id,
					courseid: this.courseId,
					progress: parseInt(e.detail.currentTime)
				}
				if(!this.tempProgress || this.tempProgress.progress!=progress.progress){
					this.tempProgress = progress;
					videoUpdateProgress(progress);
				}
			},
			getMinVideo(playInfoList){
				if(playInfoList && playInfoList.length>0) {
					if(playInfoList.length == 1){
						return playInfoList[0];
					}else{
						let minbitrate = 0;
						let returnItem = null;
						for(let i=0; i!=playInfoList.length; ++i) {
							let item = playInfoList[i];
							let bitrate = Number(item.bitrate)
							if(minbitrate <=0){
								minbitrate = Number(item.bitrate);
								returnItem = item;
							}else if(minbitrate>bitrate) {
								minbitrate = bitrate;
								returnItem = item;
							}
						}
						return returnItem;
					}
				}
				return null;
			},
			playCourse(item) {
				this.courseId = item.id;
				this.coursePlaypercent = item.playpercent;
				if(this.product.paied) {
					videoCoursePlay(this.product.id,this.courseId).then(res => {
						if(res && res.code === 0 && res.data){
							let playInfo = this.getMinVideo(res.data.playInfoList);
							if(playInfo) {
								this.src = playInfo.playURL;
								this.tryplay = true;
								if(res.data.progress && this.coursePlaypercent<95) {
									this.videoContext.seek(res.data.progress);
								}
							}
						}
					});
				}else if(item.free) {
					videoCourseInfo(this.product.id,this.courseId).then(res => {
						if(res && res.code === 0 && res.data){
							let playInfo = this.getMinVideo(res.data.playInfoList);
							if(playInfo) {
								this.src = playInfo.playURL;
								this.tryplay = true;
								if(res.data.progress && this.coursePlaypercent<95) {
									this.videoContext.seek(res.data.progress);
								}
							}
						}
					});
				}else{
					this.$api.msg(this.i18n.playTip);
				}
			},
			videoTryPlayEnd(){
				this.$api.msg(this.i18n.playTip);
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			bargainNav() {
				if(this.product.bargainorderid > 0) {
					uni.navigateTo({
						url: '/pages/bargain/bargain?orderid=' + this.product.bargainorderid
					});
				}else{
					uni.navigateTo({
						url: '/pages/poster/bargain?productid=' + this.product.id
					});
				}
			},
			loginCallback(info,callback) {
				let loginRes = login(info);
				if(loginRes){
					loginRes.then(result=>{
						if(result && result.code ===0 && result.data && result.data.user){
							this.Login(result.data.user);
							this.InitConfig(result.data.config);
							if(callback){
								callback();
							}
						}
					})
				}
			},
			getWxUserInfoMsg(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						this.sendMsg();
					});
				}
			},
			getWxUserInfoBuy(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						// 显示弹窗提示
						this.type = 1;
						this.payModel = true;
					});
				}
			},
			getWxUserInfoProxyBuy(res){
				if(res && res.detail && res.detail.userInfo) {
					//已授权
					this.loginCallback(res.detail.userInfo,()=>{
						// 显示弹窗提示
						this.type = 2;
						this.payModel = true;
					});
				}
			},
			getUserPhoneBuy(res){
				let that = this;
				if(res && res.detail) {
					res.detail.code = this.code;
					bindUserTel(res.detail).then(result=>{
						if(result) {
							// 刷新hastel
							this.refreshUserTel(result);
							this.surePay();
						}
					});
				}
			},
			proxypay() {
				if(this.product && this.product.id) {
					if(this.proxyInfo){
						this.$refs.proxypay.toggleMask();	
					}else{
						proxyOrderInfo(this.product.id,this.langtype).then((res)=>{
							this.proxyInfo = res;
							if(this.proxyInfo){
								this.$refs.proxypay.toggleMask();	
							}
						});
					}
				}
			},
			//收藏
			toFavorite(){
				this.product.favorite = !this.product.favorite;
				collecProduct(this.product.id);
			},
			surePay() {
				this.payModel = false
				if(this.type == 1) {
					this.buy()
				} else if(this.type ==2 ) {
					this.proxypay()
				}
			},
			buy(){
				if(!this.android) {
					this.$api.msg(this.i18n.iosForbbiden);
				}else{
					
					if(this.product && this.product.id) {
						var that = this;
						if (this.clicked) {
							return;
						}
						this.clicked = true;
						paymentInfo(this.product.id).then(res=>{
							if(res && res.data){
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.data.timeStamp,
									nonceStr: res.data.nonceStr,
									package: res.data.packageValue,
									signType: res.data.signType,
									paySign: res.data.paySign,
									success: function (res) {
										that.loadData(that.product.id, true);
										console.log('success:' + JSON.stringify(res));
									},
									fail: function (err) {
										console.log('fail:' + JSON.stringify(err));
										that.clicked = false;
									}
								});	
							}else {
								this.clicked = false;
							}
						});
					}
				}
			}
		},

	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 20upx;
	}
	.dialogTitle {
		font-size: $font-normal;
		text-align: left;
	}
	.dialogMsg {
		margin-top: 20upx;
	}
	.priceTitle {
		font-size: $font-lg + 30upx;
	}
	#myVideo {
		direction:ltr !important;
		position: fixed;
		width: 100%;
		display: table;
		z-index: 1000;
	}
	.carousel {
		height: 422upx;
		width: 100%;
		position:relative;
		text-align: center;
		video{
			height: 422upx;
			width: 100%;
		}
		.video-time{
			background-color: black;
			opacity: 0.5;
			height: 50upx;
			color: white;
			position: absolute;
			right: 3%;
			top: 5%;
			font-size: $font-sm;
			border-radius: 26upx;
			text-align: center;
			line-height: 55upx;
			padding-left: 40upx;
			padding-right: 40upx;
		}
		image {
			height: 422upx;
			width: 100%;
		}
		.tryplay {
			position: absolute;
			top: 35%;
			left: 35.2%;
			padding: 0 60upx; 
		}
		.paid-play {
			position: absolute;
			top: 40%;
			left: 35.2%;
			padding: 0 60upx; 
		}
		.price-desc {
			height: 90upx;
			width: 100%;
			position: absolute;
			bottom: 0upx;
			left: 0upx;
			background-color: black;
			opacity: 0.7;
			padding-left: 50upx;
			line-height: 95upx;
			.price-new {
				float: left;
				opacity: 1;
				.price-dor {
					color: white;
					font-weight: bold;
				}
				.price-now {
					color: white;
					font-size: $font-lg + 30upx;
					font-weight: bold;
				}
			}
			.price-info {
				height: 90upx;
				width: 100upx;
				float: left;
				margin-left: 20upx;
				position: relative;
				.price-old {
					width: 100%;
					text-decoration: line-through;
					height: 40%;
					line-height: 100%;
					position: absolute;
					left: 0upx;
					bottom: 0upx;
					color: #ccc;
				}
				.coupon-tip {
					width: 100%;
					height: 30upx;
					margin-top: 15%;
					position: absolute;
					left: 0upx;
					top: 0upx;
					align-items: center;
					font-size: $font-sm - 2upx;
					border-radius: 6upx;
					line-height: 30upx;
					transform: translateY(-4upx); 
					text-align: center;
				}
			}
			.activity-info {
				position: absolute;
				width: 50%;
				height: 100%;
				right: 0upx;
				.activity-desc{
					height: 50%;
					line-height: 100%;
					text-align: center;
					padding: 12upx;
					font-size: $font-sm;
					color: white;
				}
				.activity-time{
					height: 50%;
					line-height: 50%;
					text-align: center;
					padding: 10upx;
					color: #ccc;
					.timespace {
						background-color: #ccc;
						border-radius: 2upx;
						color: black;
						padding: 0upx 3upx;
						margin:0 6upx;
					}
				}
			}
		}
	}
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			font-weight: bold;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.title-min{
			font-size: $font-sm;
			color: #888;
			padding: 20upx 0;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 80upx;
			font-size: $font-sm;
			color: $font-color-base;
			text{
				flex: 1;
			}
			.playcount {
				float: left;
				width: 73%;
				.text-blue{
					margin-left: 10upx;
				}
			}
			.collection-btn{
				float: right;
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: $font-sm;
				width: 96upx;
				height: 80upx;
				.yticon{
					font-size: 40upx;
					line-height: 48upx;
					color: $font-color-light;
				}
				&.active, &.active .yticon{
					color: $uni-color-primary;
				}
			}
			.share-btn {
				float: right;
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: $font-sm;
				color: $font-color-base;
				width: 96upx;
				height: 80upx;
				.yticon{
					font-size: 40upx;
					line-height: 48upx;
					color: $font-color-light;
				}
				&.active, &.active .yticon{
					color: $uni-color-primary;
				}
			}
		}
		.btn-group {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.buy{
			width: 60%;
			height: 80upx;
			font-size: $font-lg;
			font-weight: bold;
			margin-top: 20upx;
		}
		.freindbuy {
			width: 38%;
			height: 80upx;
			font-size: $font-lg;
			font-weight: bold;
			margin-top: 20upx;
		}
	}
	.comboactivty-box {
		width: 100%;
		margin: 15rpx 0rpx;
		background: #FFFFFF;
		position: relative;
		height: 420rpx;
		image {
			width: 100%;
			height: 420rpx;
		}
		.title {
			position: absolute;
			bottom: 40rpx;
			left: 5%;
			width: 90%;
			background: rgba($color: #FFFFFF, $alpha: 0.7);
			border-radius: 10rpx;
			padding: 15rpx;
			color: #000000;
			.price {
				font-size: 50rpx;
				.cuIcon {
					font-size: 20rpx;
					margin-right: -5rpx;
				}
			}
		}
	}
	.nav {
		font-size: 36upx;
		margin-top: 20upx;
		margin-bottom: 5upx;
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: $font-base;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 400upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #eee; 
			}
		}
	}
	
	
	.f-header{
		display:flex;
		align-items:center;
		height: 100upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		margin-bottom: 1upx;
		margin-top: 20upx;
		.cuIcon-locationfill{
			flex-shrink: 0;
			font-size: 50upx;
			margin-right: 10upx;
		}
		.cuIcon-comment{
			flex-shrink: 0;
			font-size: 50upx;
			margin-right: 10upx;
		}
		.cuIcon-refresh {
			margin-right: 10upx;
		}
		.image-rtl{
			margin-left: 10upx;
			margin-right: 0upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.tit{
			font-size: $font-lg;
			color: #font-color-dark;
			font-weight: bold;
		}
		.icon-you{
			font-size: $font-lg;
			color: $font-color-light;
		}
	}
	.cuIcon{
		font-size: 46upx;
	}
	.content-detail {
		width: 100%;
		padding: 20upx 40upx;
		background: #fff;
		
		&.margin-bottom {
			margin-bottom: 80upx;
		}
	}
	.maocatPosition {
		margin-bottom: 100upx;
	}
	/**
	 * 微信群楼层
	 */
	.wechatgroup {
		margin-top: 20upx;
		/**微信群公共样式*/
		.stamp { display: flex; width: 100%;padding: 0 10upx;position: relative;overflow: hidden;margin: 0 auto; height: 80upx;}
		.stamp:before {content: '';position: absolute;top:0;bottom:0;left:10upx;right:10upx;z-index: -1;}
		.stamp:after {content: '';position: absolute;left: 10upx;top: 10upx;right: 10upx;bottom: 10upx;box-shadow: 0 0 20upx 1px rgba(0, 0, 0, 0.5);z-index: -2;}
		.stamp .i{position: absolute;left:-100upx;top: -200upx;height: 400upx;width: 90%;background-color: rgba(255,255,255,.15);transform: rotate(-45deg);}
		.stamp .par{float: left;padding: 16upx;width: 70%;border-right:2px dashed rgba(255,255,255,.3);text-align: left; color: #bba07f; }
		.stamp .copy{display: inline-block;padding:21upx 14upx;width:80px;vertical-align: text-bottom;color:rgb(255,255,255);}
		
		/**微信群样式一**/
		.stamp-wxgroup{background: #eaddcb; border-radius: 10upx; background-size: 15upx 15upx;background-position: 9upx 3upx;}
		.stamp-wxgroup .par {border:0upx; display: flex; justify-content: flex-start; align-items: center; }
		.stamp-wxgroup .par .cuIcon-group {
			margin-left: 10upx;
			margin-right: 10upx;
		}
		.stamp-wxgroup:before{background-color:#f02a20;}
		.stamp-wxgroup .copy{text-align:center;color: #bba07f;height: 100%; padding: 0 40rpx;display: flex; justify-content: center; align-items: center;}
		.stamp-wxgroup .copy .cuIcon-right {
			font-size: 30upx;
		}
		.stamp-wxgroup .ileft{position: absolute;right:-100upx;top: -200upx;height: 400upx;width: 90%;background-color: rgba(255,255,255,.15);transform: rotate(45deg);}
	}
	
	.video-item {
		width: 100%;
		line-height: 90upx;
		font-size: $font-lg;
		border-bottom: 1upx solid #f1f1f1;

		.cuIcon {
			margin: 0upx 10upx;
		}
		
		.video-title {
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		.video-list {
			width: 100%;
			padding-left: 40upx;
			line-height: 60upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 10upx;
			.video-left {
				width: 88%;
				.video-con {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: 30upx;
				}
				.time {
					padding-left: 64upx;
					font-size: $font-base;
					displat: flex;
					justify-content: flex-start;
					align-items: center;
				}
				.paddingr {
					padding-left: unset;
					padding-right: 64upx;
				}
			}
		}
	}
	.wechatgroup-dialog {
		position: fixed;
		display: flex;
		left:0;
		top:0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index:1;
		flex-direction: column;
		.closeicon {
			font-size: 60rpx;
			margin: 0rpx 45%;
		}
	}
	.wechatcontent {
		postion: fixed;
		width: 86%;
		height: 940upx;
		background-color: #fff;
		z-index: 1;
		margin: 100upx auto 40upx;
		padding: 60upx 40upx 0upx;
		overflow: scroll;
		border-radius: 10upx;
		line-height: 60upx;
		.text-center {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		
		.codeimg {
			width: 100%;
			padding: 20rpx 0rpx;
			image{
				width: 560upx;
				height: 560upx;
			}
		}
	}
</style>
