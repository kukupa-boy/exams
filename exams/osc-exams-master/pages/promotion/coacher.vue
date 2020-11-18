<template>
	<view :class="rtlClazz">
		<view class="content">
		{{i18n.content}}
		</view>
		<view class="viewButton">
			<button class="cu-btn bg-gradual-orange" @click="sureClick">{{i18n.becomeCoacher}}</button>
			<button class="cu-btn line-gray" @click="backIndex">{{i18n.backIndex}}</button>
		</view>
	</view>
</template>

<script>
	import { userCoacherBecome,loginAsync } from '@/api/user';
	import {
	    mapState,
		mapMutations
	} from 'vuex';  
	export default {
		name:"coacher",
		data() {
			return {
				parentid: 0,
				loaded:false
			}
		},
		computed:{
			...mapState(['rtlClazz']),
			i18n () {
			  return this.$t('coacher')
			}
		},
		onLoad(options) {
			if(options) {
				console.log(options);
				let parentid = Number(options.id);
				this.parentid = parentid;
				this.parentUser(parentid);
				loginAsync(parentid);
				this.loaded = true;
				setTimeout(()=>{
					this.resetlanguage(Number(options.langtype));
					let i18n = this.$t('coacher');
					uni.setNavigationBarTitle({
						title:i18n.title
					})
				},600);
			}
		},
		methods: {
			...mapMutations(['language','Login','InitConfig','parentUser','resetlanguage']),
			sureClick() {
				if(this.loaded == true) {
					userCoacherBecome().then(res => {
						if(res == true) {
							this.$api.msg(this.i18n.success);
							setTimeout(() => {
								this.backIndex();
							},1500);
						}else {
							this.$api.msg(this.i18n.faild);
						}
					});
				}
			},
			backIndex(){
				uni.reLaunch({
				    url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}
	 .content{
		 text-indent:30rpx;
		 padding:60rpx 60rpx;
		 line-height:50rpx;
		 text-align: justify;
	 }
	 .viewButton{
		 width:100%;
		 display: flex;
		 justify-content: space-around;
		 align-items: center;
	 }
</style>
