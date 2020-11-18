<template>
	<view :class="'promotion-center-background' + (ltr?'':' rtlDirection ')">
		<view class="'user-info-box'">
				<view class="user-portrait">
					<image class=".user-portrait-style" :src="userInfo.avatar || '/static/missing-face.png'" @click="navTo('/pages/recruit/recruit')"></image>
				</view>
				<view class="user-name-box" :class="promoter?'':'box-width-fix'">
					<view class="user-name">
						<text class="user-name-style"> {{userInfo.nickName || i18n.defaultNickName}}</text>
					</view>
					<view v-if="promoter" class="user-promotion-style">
						<text>{{i18n.promoterType[userInfo.usertype]}}</text>
					</view>
				</view>
				<view v-if="promoter === false" class="user-reward">
					<text class="user-reward-style text-orange cuIcon-recharge" @click="onShare">{{i18n.reward}}</text>
				</view>
				<view v-if="Share === true" class="mask">
					<view class="Share-msg">
						<text class="text-orange cuIcon-redpacket_fill tx-size">{{i18n.rewardDescription}}</text>
						<view class="tx-msg">
							<rich-text :nodes="htmlRewardDesc()"></rich-text>
						</view>
						<text class="text-orange cuIcon-friendfill tx-size">{{i18n.customerDescription}}</text>
						<view class="tx-msg"><rich-text :nodes="htmlStr()"></rich-text></view>
						<text class="text-orange cuIcon-moneybagfill">{{i18n.settlement}}</text>
						<view class="tx-msg"><rich-text :nodes="htmlStrTow()"></rich-text></view>
					</view>
					<text class="text-white cuIcon-roundclose share-ico" @click="offShare"></text>
			</view>
			<view class="user-info-box-right">
				<view v-if="promoter === true" class="user-reward-right" @click="onShare">
					<text class="user-reward-style-right text-orange cuIcon-recharge"></text>
					<text class="user-reward-style-right text-orange" :class="ltr?'':'sm'">{{i18n.reward}}</text>
				</view>
				<view v-if="promoter === false">
					<button class="b-btn" @click="navTo('/pages/promotion/promoter')"><text style="color: #8B814C;">{{i18n.applyingForPromotion}}</text></button>
				</view>
			</view>
		</view>
		<view v-if="promoter === false" class="user-info-box">
			<view class="help">
				<!-- <button class="help-style">使用教程</button> -->
				<button class="cu-btn bg-gradual-orange shadow-blur" @click="gotoTutorial()">{{i18n.helpTutorial}}</button>
			</view>
		</view>
		<view v-if="promoter === true" class="account">
			<view class="account-info-top">
				<view class="money-info">
					<view class="money-income">
						<text class="income">{{i18n.income}}</text>
						<text class="money">¥{{balance.monthSum==undefined?0:balance.monthSum}}</text>
					</view>
					<view class="info">
						<button class="cu-btn lines-orange" @click="navTo('/pages/promotion/balance', balance)">{{i18n.account}}</button>
					</view>
				</view>
			</view>
			<view class="account-info-dow">
				<view class="account-info-dow-up">
					<ul :class="(ltr?'':' rtlDirection ')">
						<li class="tab">
							<button class="tow-code" @click="navTo('/pages/promotion/customers')">
								<text class="text-orange cuIcon-people"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.customer}}</text>
								</view>
							</button>
						</li>
						<!-- <li class="tab">
							<button class="tow-code" @click="navTo('/pages/promotion/orders')">
								<text class="text-orange cuIcon-calendar" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.order}}</text>
								</view>
							</button>
						</li> -->
						<li class="tab">
							<button class="tow-code" @click="navTo('/pages/promotion/capitals')">
								<text class="text-orange cuIcon-moneybag" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.myaccount}}</text>
								</view>
							</button>
						</li>
						<li class="tab" v-if="userInfo.usertype == 1">
							<button class="tow-code" @click="navTo('/pages/video_area/video_area',i18n.myVideo)">
								<text class="text-orange cuIcon-video" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.myVideo}}</text>
								</view>
							</button>
						</li>
						<li class="tab" v-if="userInfo.usertype == 2">
							<button class="tow-code" @click="navTo('/pages/video_area/video_area',i18n.myArea)">
								<text class="text-orange cuIcon-radiobox" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.myArea}}</text>
								</view>
							</button>
						</li>
						<li class="tab">
							<button class="tow-code" @click="navTo('/pages/promotion/paihangbang')">
								<text class="text-orange cuIcon-upstage" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.paihang}}</text>
								</view>
							</button>
						</li>
						<li class="tab">
							<button class="tow-code" @click="navTo('/pages/promotion/code')">
								<text class="text-orange cuIcon-qr_code" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.code}}</text>
								</view>
							</button>
						</li>
						<li class="tab">
							<button class="tow-code" @click="gotoTutorial()">
								<text class="text-orange cuIcon-question" style="font-size: 60upx;"></text>
								<view>
									<text style="font-size: 30upx;">{{i18n.usingTheTutorial}}</text>
								</view>
							</button>
						</li>
					</ul>
				</view>
			</view>
			<!-- <view class="account-info-next">
				<view class="help">
					<button class="help-style cu-btn bg-gradual-orange shadow-blur" open-type="share">{{i18n.shareParticipants}}</button>
				</view>
			</view> -->
			<view class="share-info-box">
				<button class="cu-btn share-info-item green" :class="ltr?'':'rtl'" open-type="share">
					<view>
						<view>{{i18n.shareStudent}}</view>
						<view class="desc text-sm">{{ htmlShareStudentTip(config.promotePercent)}}</view>
					</view>
					<text class="cuIcon cuIcon-group text-green"></text>
				</button>
				<button v-if="userInfo.usertype > 0" class="cu-btn share-info-item orange" :class="ltr?'':'rtl'" @click="showDialog = true">
					<view>
						<view>{{i18n.shareCoacher}}</view>
						<view class="desc text-sm">{{ htmlShareStudentTip(config.subPromotePercent)}}</view>
					</view>
					<text class="cuIcon cuIcon-taxi text-orange"></text>
				</button>
			</view>
		</view>
		<view class="user-info-box">
			<view class="gps-left">
				<view class="button-gps">
					<button class="cu-btn line-grey shadow" @click="navTo('/pages/address/address')"><text class="cuIcon-locationfill">{{city.name}}∨</text></button>
				</view>
			</view>
			<view v-if="currentExam && currentExam.id" class="gps-right">
				<view class="address-exam">
					<text class="text-black">{{ltr?currentExam.name:currentExam.yuname}}</text>
					<picker @change="PickerChange" :value="pickerIndex" :range="exams" :range-key="ltr?'name':'yuname'" class="cu-btn line-grey shadow b-button">
						<text class="text-grey cuIcon-refresh" :class="ltr?'':' image-rtl '"></text>{{i18n.switch}}
					</picker>
				</view>
			</view>
		</view>
		<view class="content">
			<!-- 空白页 -->
			<empty v-if="loaded === true && goodsList.length === 0" :desc="i18n.emptyTip" :redirectDesc="i18n.emptyRedirect"></empty>
			
			<product-item :isPromoter="true" :isPaid="true" :share="i18n.share" :promoterDesc="i18n.promoterDesc" :subPromoterDesc="i18n.subPromoterDesc" :playCount="i18n.playCount" :goodsList="goodsList" :navToDetailPage="navToDetailPage" :toMyFavorite="toMyFavorite"></product-item>
		</view>
		<view :class="showDialog ? 'cu-modal show' : 'cu-modal'">
		  <view class="cu-dialog">
		    <view class="cu-bar bg-white justify-between">
			<view class="dialogTitle margin-left-xl">{{i18n.shareWarning}}</view>
		      <view class="action" @click="showDialog = false">
		        <text class="cuIcon-close text-red"></text>
		      </view>
		    </view>
		    <view class="padding-sm bg-white">
				{{i18n.shareWarningText}}
		    </view>
		    <view class="cu-bar bg-white justify-end">
		      <view class="action">
		        <button class="cu-btn line-green text-green margin-left" @click="showDialog = false">{{i18n.cancel}}</button>
				<button class="cu-btn bg-green margin-left" open-type="share" data-type="coacher" @click="showDialog = false">{{i18n.sure}}</button>
		      </view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	import { cityPosition } from '@/api/city';
	import { userBalance } from '@/api/user';
	import { shareInfoOfPromoter, shareInfoOfCoacher } from '@/api/share';
	import { productList } from '@/api/product';
	import { examList } from '@/api/exam';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import productItem from '@/components/exams-product-item';
	import {  
	    mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			empty,
			productItem,
		},
		data() {
			return {
				htmlShareStudentTip: function(v) {
					return this.i18n.shareStudentDesc.replace('XXX',v+'%');
				},
				htmlRewardDesc: function() {
					let html = this.i18n.rewardDescriptionText;
					if(this.config) {
						html=html.replace('XXX', '<span style="color:orange; direction: ltr;"><span>'+(this.config.promotePercent || 0)+'</span><span>%</span></span>');
						html=html.replace('YYY', '<span style="color:orange; direction: ltr;"><span>'+(this.config.subPromotePercent || 0)+'</span><span>%</span></span>');
					}
					return html;
				},
				htmlStr: function(){
					let html = this.i18n.userExplainText;
					if(this.config.promoteEffectiveTime === 0){
						html=html.replace('XXX','<span style="color:orange;">'+this.i18n.time+'</span>');
						return html;
					}else{
						html=html.replace('XXX','<span style="color:orange;">'+this.config.promoteEffectiveTime+'天</span>');
						return html;
					}
				},
				htmlStrTow: function(){
					let html = this.i18n.userBillingInstructions;
					html=html.replace('XXX','<span style="color:orange;">'+this.i18n.seeaccount+'</span>');
					html=html.replace('YYY','<span style="color:orange;">'+this.i18n.withdrawals+'</span>');
					return html;
				},
				showDialog: false,
				balance: {
					balance: 0, //余额
					lastMonthSum: 0, //上月
					monthSum: 0, //当月
					todaySum:0, // 今日
					totalMoney:0 // 总收益
				},
				shareInfo: null,
				shareCoacherInfo: null,
				city: {
					id: 0,
					name: '未授权'
				},
				exams: [],
				currentExam: {},
				goodsList: [],
				vip: false,
				Share:false,
				navToDetailPage: function(item){
					let id = item.id;
					uni.navigateTo({
						url: `/pages/video/video?id=${id}`
					})
				},
				toMyFavorite: function(item){
					let list = this.goodsList;
					let index = list.findIndex(val=>val.id === item.id);
					list[index].favorite = item.favorite;
					console.log(index)
				},
				pickerIndex: 0
			};
		},
		computed: {//login状态保持
			...mapState(['hasLogin','userInfo','ltr','promoter','config','langtype']),
			i18n () {  
			  return this.$t('promotion')
			}
		},
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
			
			if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
		},
		async created() {
			let title = this.$t('promotion').title;
			uni.setNavigationBarTitle({
			　　title: title
			});
			uni.$on('EVENT_UPDATE_CITY',(city)=>{
				this.city = city;
				if(city) {
					this.$api.setCity(this.city);
				}
				this.loadData(this.city.id);
			});
			this.currentExam = await this.$api.getExam();
			this.exams = await this.$api.getExams();
			this.city = await this.$api.getCity();
			if(!this.city || !this.city.id || this.city.id <=0 ){
				this.loadCity();
			}
		    this.loadData();
			this.loadBalance();
			shareInfoOfPromoter(this.langtype).then(res=>{
				this.shareInfo = res;
			});
			shareInfoOfCoacher(this.langtype).then(res=>{
				this.shareCoacherInfo = res;
			});
		},
		onShareAppMessage(res) {
			let user = this.userInfo;
			let page = '/pages/index/index';
			var isCoacher = false;
			if (res.from === 'button') {// 来自页面内分享按钮
			  let id = res.target.id;
			  let type = res.target.dataset.type;
			  let title = res.target.dataset.name;
			  let imgurl = res.target.dataset.imgurl;
			  if(user && user.nickName && title) {
				  title = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY',title);
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
			  }else if(type === 'coacher') {
				  // 发展教练
				  page = '/pages/promotion/coacher?id='+user.id;
				  isCoacher = true;
			  }else {
				  page = page + '?id=' + (user ? user.id || 0 : 0);
			  }
			  if(user && user.id) {
			  	page = page + '&userid=' + user.id;
			  }
			  if(title) {
				  return {
					title: title,
					imageUrl: imgurl,
					path: page+'&langtype='+this.langtype
				  }
			  }
			}else if(user && user.id) {
				page = page + '?id=' + user.id+'&langtype='+this.langtype;
			}else{
				page = page + '?langtype='+this.langtype;
			}
			if(isCoacher && this.shareCoacherInfo) {
				console.log(page);
				return {
					title: this.shareCoacherInfo.title,
					imageUrl: this.shareCoacherInfo.httpImageUrl,
					path: page+'&langtype='+this.langtype
				}
			}else if(this.shareInfo) {
				return {
					title: this.shareInfo.title,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page
				}
			}else{
				return {
				  title: this.$t('promotion').title,
				  path: page
				}
			}
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			navTo(url,model){
				if(model) {
					uni.navigateTo({
						url:url+'?model='+encodeURIComponent(JSON.stringify(model))
					});
				}else{
					uni.navigateTo({
						url:url
					});
				}
			},
			onShare(){
				this.Share = true;
			},
			offShare(){
				this.Share = false;
			},
			loadCity(){
				this.city = { id: 0, name: '定位城市' };
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {
						cityPosition(res.longitude, res.latitude).then(city=>{
							this.city = city.data || { id: 0, name: '定位城市' };
							if(this.city.id>0) {
								this.loadData(this.city.id);
							}
						})
					}
				});
			},
			async loadData(cityid){
				if(cityid) {
					let responseExam = await examList(cityid);
					this.exams = responseExam ? responseExam.data || [] : [];
					if(this.exams && this.exams.length>0) {
						this.currentExam = this.exams[0] || {};
					}else{
						this.currentExam = {};
					}
					this.$api.setExam(this.currentExam);
				}
				let examid = this.currentExam.id;
				if(!examid && !cityid) {
					this.currentExam = await this.$api.getExam();
					examid = this.currentExam.id;
				}
				let responseData = examid ? await productList(examid,this.langtype, 1) : null;
				let goodsList = responseData ? responseData.data || []: [];
				this.goodsList = goodsList;
				
			},
			loadBalance(){
				//加载钱包数据
				userBalance().then(res=>{
					this.balance = res;
				});
			},
			PickerChange: function(e) {
				this.currentExam = this.exams[e.target.value];
				this.loadData();
			},
			gotoTutorial() {
				uni.navigateTo({
					url:'/pages/promotion/tutorial'
				})
			}
		},
	}
</script>

<style lang="scss">
	.promotion-center-background{//背景
		background-color: #fff;
		.account{
			height: 720upx;
			z-index: 1;
		}
		.account-info-top{
			background-color: #FFEBCD;
			margin: 0upx 20upx 0upx;
			height: 100upx;
			border-radius: 10upx 10upx 0upx 0upx;
			border: 2upx solid #FFA500;
			padding: 0upx;
			display:flex;
			justify-content: space-between;
			.income{
				margin-left: 20upx;
				margin-right: 35upx;
				color: #FA863A;
			}
			.money{
				font-size: $font-lg + 24upx;
				color: #FA863A;
				font-weight:500;
				//margin-right:195upx; 
			}
			.money-info{
				height: 100upx;
				width: 100%;
				padding: 16upx 10upx;
				display:flex;
				justify-content: space-between;
				.money-income {
					width:60%;
					display:flex;
					justify-content: flex-start;
					align-items: center;
				}
				// .info{
				// 	margin: 0upx 10upx;
				// }
			}
		}
		.account-info-dow{
			margin: 0upx 20upx 20upx;
			height: 360upx;
			border-radius: 0upx 0upx 10upx 10upx;
			border: 2upx solid #FFA500;
			border-top:none;
			padding-top: 15upx; 
		}
		.account-info-dow-up{
			height: 165upx;
			text-align: center;
			.tab{
				float: left;
			}
			.rtlDirection{
				.tab{
					float: right;
				}
			}
		}
		.tab{
			width: 33%;
			padding:20upx 20upx;
			.tow-code{
				height: 130upx;
				width: 100%;
				background-color: #fff;
				margin-left: 1upx;
				line-height: 60upx;
				text{
					font-size: 60upx;
				}
			}
		}
		.account-info-next{
			height: 100upx;
			//padding-left: 31.5%;
			margin-right: 32%;
			margin-left: 32%;
		}
		.share-info-box {
			width: 100%;
			display: flex;
			justify-content: space-around;
			padding: 20rpx;
			.share-info-item {
				width: 48%;
				height: 200rpx;
				border-radius: 20rpx;
				padding: 30rpx;
				display: flex;
				justify-content: flex-start;
				text-align: unset;
				border:0rpx;
				line-height: 40rpx;
				align-items: flex-start;
				&.green {
					background-image: linear-gradient(45deg, rgba(57,181,74,0.2), rgba(141,198,63,0.2));
					color: black;
				}
				&.orange {
					background-image: linear-gradient(45deg, rgba(255,151,0,0.2), rgba(237,28,36,0.2));
					color: black;
				}
				.desc {
					color: #909399;
				}
				.cuIcon-group {
					font-size: 120rpx;
					position: absolute;
					bottom: 40rpx;
					right: 0rpx;
					left: unset;
					opacity: 0.4;
				}
				.cuIcon-taxi {
					font-size: 120rpx;
					position: absolute;
					bottom: 40rpx;
					right: 0rpx;
					left: unset;
					opacity: 0.4;
				}
				&.rtl {
					.cuIcon-group {
						left: 0rpx;
						right:unset;
					}
					.cuIcon-taxi {
						left: 0rpx;
						right:unset;
					}
				}
			}
		}
		.see-account{
			width: 280upx;
			height: 100upx;
			margin: 0upx auto;
			text-align: center;
			font-size: 26upx;
			color: #fff;
			margin-top: 15upx;
			width: 280upx;
			height: 65upx;
			background-color: #FA863A;
		}
		.user-info-box{//用户信息
			height: 100upx;
			display:flex;
			justify-content: space-between;
			align-items:center;
			z-index: 1;
			padding: 0upx 20upx;
			.user-name-box{
				width: 58%;
				height:100%;
				display:flex;
				
				//justify-content: space-between;
				align-items:center;
				.user-name{//用户名称
					float: left;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					//height:100%;
					font-size: $font-lg + 3upx;
					color: $font-color-dark;
					max-width: 70%;
				}
				.user-promotion-style{
					color: $font-color-dark;
					background-color: #f9e6af;
					color: #CD853F;
					padding-left: 10upx;
					padding-right: 10upx;
					display:flex;
					justify-content:center;
					align-items:center;
					// width: 150upx;
					max-width: 150px;
					// height:500upx;
					//line-height: 5upx ;
				}
			}
			.box-width-fix {
				width: 25%;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				.user-name {
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.user-promotion-style{
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.user-portrait-style{//头像
				width: 75upx;
				height: 75upx;
				border:5upx solid #fff;
				border-radius: 50%;
			}
			.user-reward{
				float: left;
				height: 75upx;
				margin: 0upx 10upx;
			}
			.user-reward-style{
				font-size: 30upx;
				color: #FFC125;
				float: left;
				margin-top: 15upx;
				//display:none;
			}
			.user-portrait{
				float: left;
				height: 75upx;
				width: 75upx;
			}
			.user-info-box-right{//用户信息右
				//width: 50%;
			}
			.user-reward-right{//奖励规则
				float: right;
				height: 75upx;
				margin-left: 20upx;
				display: flex;
				align-items: center;
			}
			.user-reward-style-right{//奖励规则风格右
				font-size: 30upx;
				color: #FFC125;
				&.sm {
					font-size: 22upx;
				}
			}
			.b-btn{//申请推广员
				float: right;
				width: 220upx;
				height: 40upx;
				text-align: center;
				line-height: 40upx;
				font-size: 22upx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(left, #f9e6af, #ffd465);
				margin-right: 30upx;
			}
			
			.help{
				text-align: center;
				width: 280upx;
				height: 100upx;
				margin: 0upx auto;
				margin-top: 50upx;
			}
			.help-style{
				text-align: center;
				font-size: 26upx;
				color: #fff;
				margin-top: 15upx;
				width: 280upx;
				height: 65upx;
				background-color: #FA863A;
			}
			.gps-left{
				padding-top: 25upx;
				height: 100upx;
				margin-left: 10upx;
				button {
					font-size: 25upx;
				}
			}
			.gps-right{
				padding-top: 25upx;
				height: 100upx;
				padding-right: 10upx;
				.b-button{
					// bottom: 2%;
					height: 64upx;
					font-size: 25upx;
					margin-left: 10upx;
					margin-right: 10upx;
				}
			}
			.text-style{
				margin-right: 20upx;
			}
		}
	}
	.help{
		width: 280upx;
		height: 100upx;
		text-align: center;
	}
	.help-style{
		text-align: center;
		font-size: 26upx;
		color: #fff;
		margin-top: 15upx;
		width: 280upx;
		height: 65upx;
		background-color: #FA863A;
	}
	.tow-code::after {
		border: none;
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.6);
		line-height: 50upx;
	}
	.Share-msg{
		postion: fixed;
		width: 600upx;
		height: 860upx;
		background-color: #fff;
		z-index: 1;
		margin: 100upx auto 40upx;
		padding: 60upx 40upx 0upx;
		overflow: scroll;
		border-radius: 10upx;
	}
	.share-ico{
		font-size: 60upx;
		margin: 0upx 45%;
	}
	.tx-br{
		word-wrap: break-word;
	}
	.tx-msg{
		margin: 15upx 0upx 15upx;
		text-indent:2em;
	}
	.tx-size{
		font-size: 30upx;
	}
	.cu-modal {
		.warn-title {
			justify-content: flex-start;
		}
	}
</style>