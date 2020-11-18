<template>
	<view class="content">
		<!-- 区域名称 -->
		<view :class="'f-header'+(ltr?'':' rtlDirection ')">
			<text class="lg text-orange cuIcon-locationfill" :class="ltr?'':' image-rtl '"></text>
			<view class="tit-box">
				<text class="tit">{{ ltr?exam.name:exam.yuname }}</text>
			</view>
			<picker @change="PickerChange" :value="pickerIndex" :range="exams" :range-key="ltr?'name':'yuname'" class="cu-btn line-grey shadow">
				<text class="text-grey cuIcon-refresh" :class="ltr?'':' image-rtl '"></text>{{i18n.examChange}}
			</picker>
		</view>
		<view class="productItem">
			<product-item :goodsList="goodsList" :navToDetailPage="navToDetailPage" :hasPaiedDesc="i18n.hasPaiedDesc" :playCount="i18n.playCount" :share="i18n.share"></product-item>
		</view>
		<uni-load-more :status="loadingType" :contentText="i18n.contentText"></uni-load-more>
	</view>
</template>

<script>
	import { shareInfoOfHome } from '@/api/share';
	import { loginAsync } from '@/api/user';
	import { productList } from '@/api/product';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import productItem from '@/components/exams-product-item';
	import {  
	    mapState,
		mapMutations
	} from 'vuex'; 
	export default {
		components: {
			uniLoadMore,
			productItem
		},
		data() {
			return {
				shareInfo: null,
				pickerIndex: 0,
				loadingType: 'more', //加载更多状态
				page: 1,
				goodsList: [],
				shareList: [],
				exam: {
					id: 0
				},
				exams: [],
				city: { name: '未授权'},
				navToDetailPage: function(item){
					let id = item.id;
					uni.navigateTo({
						url: `/pages/video/video?id=${id}`
					})
				}
			};
		},
		onShareAppMessage(res) {
			console.log(res);
			let user = this.$api.getUserInfo();
			let page = '/pages/index/index';
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
			  let id = res.target.id;
			  let type = res.target.dataset.type;
			  let title = res.target.dataset.name;
			  let imgurl = res.target.dataset.imgurl;
			  if(user && user.nickName) {
				  title = this.$t('video').recomYou.replace('XXX',user.nickName).replace('YYY',title);
			  }
			  if(type === 'product') {
				  //产品分享
				  page = '/pages/video/video?id='+id;
			  }else if(type === 'article') {
				  //攻略分享
				  page = '/pages/article/article?id='+id;
			  }else {
				  page = page + '&id=' + (user ? user.id || 0 : 0);
			  }
			  if(user && user.id) {
			  	page = page + '&userid=' + user.id;
			  }
			  console.log(page);
			  return {
			  	title: title,
			  	imageUrl: imgurl,
			  	path: page +'&langtype='+this.langtype
			  }
		    }
			// 分享出去的页面不进此页面，否则需要处理基础数据为空情况
			// return {
			// 	title: this.$t('videolist').title,
			// 	path: '/pages/video/list?id='+(user?user.id||0:0)
			// }
			page = '/pages/index/index?id='+(user?user.id||0:0)+'&langtype='+this.langtype;
			if(this.shareInfo) {
				return {
					title: this.shareInfo.title,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page
				}
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		computed: {
			...mapState(['ltr','langtype','hasLogin']),
			i18n () {  
			  return this.$t('videolist')
			}
		},
		onLoad(options) {
			let userid = options?options.id:0;
			if(userid) {
				loginAsync(userid);
			}
			if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
		},
		created() {
			this.exam = this.$api.getExam();
			this.exams = this.$api.getExams();
			this.city = this.$api.getCity();
			//分享情况下，以上三个对象可能为空：BUG,那么分享的时候直接进首页
			this.loadData();
			shareInfoOfHome(this.langtype).then(res=>{
				this.shareInfo = res;
			});
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			//加载分类
			async loadShareList(){
				this.shareList = await this.$api.json('shareList');
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add') {
				if(type === 'refresh'){
					this.page = 1;
				}
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				let examid = this.exam.id;
				if(!examid) {
					this.exam = await this.$api.getExam();
					examid = this.exam.id;
				}
				let responseData = examid ? await productList(examid,this.langtype, this.page) : null;
				let goodsList = responseData ? responseData.data || [] : [];
				if(type === 'refresh'){
					this.goodsList = [];
				}
				goodsList = goodsList || [];
				this.goodsList = this.goodsList.concat(goodsList);
				//判断是否还有下一页，有是more  没有是nomore
				this.loadingType  = 'nomore';
				if(type === 'refresh'){
					uni.stopPullDownRefresh();
				}else{
					this.page++;
				}
			},
			PickerChange: function(e) {
				this.exam = this.exams[e.target.value];
				this.loadData('refresh');
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.f-header{
		display:flex;
		align-items:center;
		height: 100upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		border-bottom: 0.5upx solid $border-color-base;
		.cuIcon-locationfill{
			flex-shrink: 0;
			font-size: 50upx;
			margin-right: 10upx;
		}
		.cuIcon-activityfill{
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
	.productItem{
		background-color: #fff;
		padding-top: 20upx;
	}
	.cuIcon{
		font-size: 46upx;
	}

</style>
