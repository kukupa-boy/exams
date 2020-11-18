<template>
	<view :class="rtlClazz">
		<form>
			<view class="cu-form-group">
				<view class="title">{{i18n.title}}</view>
				<input :placeholder="i18n.titlePlace" v-model="title"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{i18n.project}}</view>
				<picker @change="projectChange" :value="projectIndex" :range="project">
					<view class="picker">
						{{projectIndex ? project[projectIndex]: i18n.projectPlace}}
					</view>
				</picker>
				
			</view>
			<view class="cu-form-group">
				<view class="title">{{i18n.language}}</view>
				<picker @change="languageChange" :value="languageIndex" :range="language">
					<view class="picker">
						{{languageIndex ? language[languageIndex] : i18n.languagePlace}}
					</view>
				</picker>
				
			</view>
			<view class="cu-form-group">
				<view class="title">{{i18n.telephone}}</view>
				<input :placeholder="i18n.telephonePlace" v-model="telephone"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{i18n.nikeName}}</view>
				<input :placeholder="i18n.nikeNamePlace" v-model="nikeName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{i18n.firstWxId}}</view>
				<input :placeholder="i18n.firstWxIdPlace" v-model="firstWxId"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{i18n.seconedWxId}}</view>
				<input :placeholder="i18n.seconedWxIdPlace" v-model="seconedWxId"></input>
			</view>
			<view class="cu-form-group picker">
				<view class="title">{{i18n.startDate}}</view>
				<picker mode="date" :value="startDate.date" :start="startDate.date" end="2050-10-10" @change="DateChange">
					<view class="picker">
						{{startDate.date}}
					</view>
				</picker>
				<view class="heng">
					<text class="cuIcon-move"></text>
				</view>
			   <picker mode="time" :value="startDate.time" start="00:00" end="23:59" @change="bindTimeChange">
				   <view class="uni-input">{{startDate.time}}</view>
			   </picker>
			</view>
			<view class="cu-form-group picker">
				<view class="title">{{i18n.endDate}}</view>
				<picker mode="date" :value="endDate.date" :start="startDate.date" end="2050-10-10" @change="DateChangeEnd">
					<view class="picker">
						{{endDate.date}}
					</view>
				</picker>
				<view class="heng">
					<text class="cuIcon-move"></text>
				</view>
			   <picker mode="time" :value="endDate.time" start="00:00" end="23:59" @change="bindTimeChangeEnd">
				   <view class="uni-input">{{endDate.time}}</view>
			   </picker>
			</view>
		</form>
			<button class="cu-btn bg-gradual-orange shadow-blur b-button" @click="submit">{{i18n.submit}}</button>
	</view>
</template>

<script>
	import {
	    mapState,
		mapMutations
	} from 'vuex'; 
	import {timeConvertDay} from "@/utils/time.js" 
	import {liveroomApply} from "@/api/live.js"
	export default {
		data() {
			return {
				title:"",
				telephone:"",
				nikeName:"",
				firstWxId:"",
				seconedWxId:"",
				projectIndex:null,
				project:[this.$t('live').projectOne,this.$t('live').projectTwo,this.$t('live').projectThree,this.$t('live').projectFour],
				language:[this.$t('live').chinese,this.$t('live').otherLanguage],
				languageIndex:null,
				startDate:{
					date:"2018-10-10",
					time: '12:01'
				},
				endDate:{
					date:"2018-10-10",
					time: '12:01'
				}
			}
		},
		computed: {
			...mapState(['ltr','langtype','rtlClazz']),
			i18n () {  
			  return this.$t('live')
			}
		},
		created(){
			let time = new Date()
			this.startDate.date = timeConvertDay(time.getTime())
		},
		methods: {
			projectChange(e) {
			    this.projectIndex = e.detail.value
			},
			languageChange(e){
				this.languageIndex = e.detail.value
			},
			bindTimeChange(e) {
				this.startDate.time = e.target.value
			},
			DateChange(e) {
				this.startDate.date = e.detail.value
			},
			bindTimeChangeEnd(e) {
				this.endDate.time = e.target.value
			},
			DateChangeEnd(e) {
				this.endDate.date = e.detail.value
			},
			submit(){
				// 转换时间措
				let model = {
					authorname: this.nikeName ,
					authorwechat: this.firstWxId ,
					endtime: new Date(this.endDate.date+" "+this.endDate.time).getTime() ,
					langtype: parseInt(this.languageIndex) ,
					name: this.title ,
					starttime: new Date(this.startDate.date+" "+this.startDate.time).getTime() ,
					steptype: parseInt(this.projectIndex)+1 ,
					subauthorwechat: this.seconedWxId
				}
				liveroomApply(model).then((res)=>{
					console.log(res.data)
				}).catch((err)=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.formbutton{
		padding-left:120rpx;
		padding-right:120rpx;
	}
	.data-v-1fecaef4{
		text-align: right;
	}
	.picker picker::after {
		content:""
	}
	.picker picker{
		-webkit-box-flex: none;
		-webkit-flex: none;
		flex: none;
		padding-right: 0;
	}
	.picker picker:nth-of-type(1){
		right: -100rpx;
	}
	.cu-form-group .heng{
		position: relative;
		right:-50rpx;
	}
	.cu-form-group input{
		padding-right: 0!important;
	}
	.cu-btn{
		width: 90%;
		margin-left: 5%;
		margin-right: 5%;
		margin-top: 30upx;
	}
	.b-button{
		height: 80upx;
	}
</style>
