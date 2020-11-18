<template>
	<view class="container" :class="rtlClazz">
		<view class="content margin-top">
			<rich-text :nodes="getHtml"></rich-text>
		</view>
	</view>
</template>

<script>
	import {loginAsync} from '@/api/user';
	import { shareInfoOfTutorial } from '@/api/share';
	import {
	    mapState,
		mapMutations
	} from 'vuex';
    export default {
        data() {
            return {
				src: null,
				webContent: null,
				shareInfo: null,
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		computed: {
			...mapState(['userInfo','ltr','langtype','hasLogin','rtlClazz']),
			i18n () {  
			  return this.$t('promotion').tutorial
			},
			getHtml() {
				if(this.webContent) {
					return this.webContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
				}
				return ''
			}
		},
		onShareAppMessage(res) {
			let user = this.userInfo;
			let page = '/pages/promotion/tutorial?id='+user?user.id||0:0;
			if(this.shareInfo) {
				return {
					title: this.shareInfo.title,
					imageUrl: this.shareInfo.httpImageUrl,
					path: page+'&langtype='+this.langtype
				}
			}else{
				return {
				  path: page
				}
			}
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title:this.$t('promotion').tutorial.title
			});
			this.loadData();
			loginAsync(options?options.id||0:0);
			if(options.langtype>=0) {
				this.resetlanguage(options.langtype);
			}
		},
		methods: {
			...mapMutations(['resetlanguage','parentUser','qrcodeRecordId']),
			async loadData(){
				let responseData = await shareInfoOfTutorial(this.langtype);
				if(responseData) {
					this.webContent = responseData.webContent;
					this.shareInfo = responseData;
				}
			},
			back(){
				uni.navigateBack({
					delta:3
				});
			}
		}
    }
</script>

<style lang="scss">
	page{
		background: #FFFFFF;
	}
	.content{
		padding: 0 20upx;
	}
</style>
