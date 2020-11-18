<template>
    <view v-if="src">
        <web-view :webview-styles="webviewStyles" :src="src"></web-view>
    </view>
</template>

<script>
	import {
	    mapState 
	} from 'vuex';
    export default {
        data() {
            return {
				src: null,
				shareInfo: null,
                webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
            }
        },
		onLoad(options) {
			this.src = options.url;
		}
    }
</script>
