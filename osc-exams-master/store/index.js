import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		ltr: true,
		langtype: 0,
		android: false,
		promoter: false,
		rtlClazz: 'rtlDirection',
		config: {},
		parentUserId: 0,
		recordId: 0,
		hasTel: false,
		enableApp: false,
		isdev: true,
		hasPostAuth: false
	},
	mutations: {
		refreshPostAuth(state) {
			state.hasPostAuth = true;
			uni.setStorage({
			    key: 'hasPostAuth',  
			    data: new Date().getTime()
			});
		},
		loadPostAuth(state) {
			uni.getStorage({
				key:'hasPostAuth',
				success: (res) => {
					let million = res.data;
					// 1天内则标识为已刷新资料
					if(million && new Date().getTime() - million < 86400000) {
						state.hasPostAuth = true;
					}
				}
			})
		},
		parentUser(state, userid) {
			state.parentUserId = userid;
			uni.setStorage({
			    key: 'parentUserId',  
			    data: userid  
			});
		},
		qrcodeRecordId(state,recordid) {
			state.recordId = recordid;
			uni.setStorage({
			    key: 'qrcodeRecordId',  
			    data: recordid  
			});
		},
		InitPlatform(state){
			try {
			    const res = uni.getSystemInfoSync();
			    state.android = 'ios' !== res.platform;
				if(state.isdev) {
					state.enableApp = true;
				}else {
					if(res.platform === 'ios' || res.platform === 'android') {
						state.enableApp = true;
					} else {
						state.enableApp = false;
					}
				}
			} catch (e) {
			    // error
				console.log(e);
			}
		},
		Login(state, provider) {
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
			if(state.userInfo){
				state.promoter = provider.promoter;
				if(provider.id && provider.nickName && provider.avatar && provider.account) {
					state.hasLogin = true;
				}
				if(provider.tel) {
					state.hasTel = true
				}else{
					state.hasTel = false
				}
			}
		},
		refreshUserTel(state, stel) {
			if(stel) {
				state.hasTel = true
			}else {
				state.hasTel = false
			}
		},
		InitConfig(state, data) {
			state.config = data;
			uni.setStorage({//缓存用户登陆状态
			    key: 'keyConfig.sysConfig',
			    data: data
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		},
		language(state, lang) {
			state.ltr = lang === 'zhcn';
			state.langtype = lang === 'zhcn'? 0 : 1;
			Vue.prototype._i18n.locale = lang ? lang : 'zhcn';
			state.rtlClazz = state.ltr ? '' : ' rtlDirection ';
			uni.setStorage({
			    key: 'language',  
			    data: lang
			}) 
		},
		resetlanguage(state, langtype) {
			let lang = langtype == 0 ? 'zhcn':'zhuy';
			state.ltr = langtype == 0;
			state.langtype = langtype;
			Vue.prototype._i18n.locale = lang ? lang : 'zhcn';
			state.rtlClazz = state.ltr ? '' : ' rtlDirection ';
			uni.setStorage({
			    key: 'language',  
			    data: lang
			}) 
		}
	},
	actions: {
	
	}
})

export default store
