<template>
	<view class="circle_process">
	    <view class="wrapper right">
			<view class="static right_circle"></view>
	        <view class="circle rightcircle" :style="'-webkit-transform: rotate('+numberRight+'deg)'"></view>
	    </view>
		<view class="number text-green">
			{{percent}}%
		</view>
	    <view class="wrapper left">
			<view class="static left_circle"></view>
	        <view class="circle leftcircle" :style="'-webkit-transform: rotate('+numberLeft+'deg)'"></view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			percent: {
				type:Number,
				default:0
			}
		},
		computed: {
			numberRight() {
				if(this.percent>=50) {
					return 45;
				}else {
					return this.percent*3.6 - 135;
				}
			},
			numberLeft() {
				if(this.percent<=50) {
					return -135;
				}else {
					return (this.percent-50)*3.6 - 135;
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style lang='scss'>
	.circle_process{
	        position: relative;
	        width: 69upx;
	        height : 70upx;
	}
	.circle_process .wrapper{
		width: 35upx;
		height: 70upx;
		position: absolute;
		top:0;
		overflow: hidden;
	}
	
	.circle_process .right{
		right:0;
	}
	.circle_process .left{
		left:1upx;
	}
	.circle_process .circle{
		width: 70upx;
		height: 70upx;
		border:6upx solid transparent;
		border-radius: 50%;
		position: absolute;
		top:0;
		transform : rotate(-135deg);
	}
	.circle_process .rightcircle{
		border-top:6upx solid #39b54a;
		border-right:6upx solid #39b54a;
		right:0;
		/* -webkit-animation: circle_right 5s linear infinite; */
	}
	.circle_process .leftcircle{
		border-bottom:6upx solid #39b54a;
		border-left:6upx solid #39b54a;
		left:0;
		/* -webkit-animation: circle_left 5s linear infinite; */
	}
	.circle_process {
		.static {
			width: 70upx;
			height: 70upx;
			border:6upx solid transparent;
			border-radius: 50%;
			top:0;
			transform : rotate(-135deg);
			
			&.right_circle{
				position: absolute;
				border: 6upx solid #f1f1f1;
				right:0;
			}
			&.left_circle{
				position: absolute;
				border: 6upx solid #f1f1f1;
				left:0;
			}
		}
		.number {
			display: flex;
			position: absolute;
			width: 100%;
			height: 100%;
			text-align: center;
			justify-content: center;
			align-items: center;
			font-size: 22upx;
			padding: 8upx;
		}
	}
	@-webkit-keyframes circle_right{
		0%{
			-webkit-transform: rotate(-135deg);
		}
		50%,100%{
			-webkit-transform: rotate(45deg);
		}
	}
	@-webkit-keyframes circle_left{
		0%,50%{
			-webkit-transform: rotate(-135deg);
		}
		100%{
			-webkit-transform: rotate(45deg);
		}
	}
</style>
