import { request } from '../utils/request';
import { setToken, setUserInfo, setSysConfig } from '../utils/cacheUtils';

export function loginAsync(parentUserId){
	let parentuserid = parentUserId || uni.getStorageSync('parentUserId');
	let recordId = 0;
	if(!parentUserId){
		parentUserId = parentuserid;
		recordId = uni.getStorageSync('qrcodeRecordId') || 0;
	}
	uni.login({
	  provider: 'weixin',
	  success: function (loginRes) {
		if(loginRes && loginRes.code) {
			let model = {
				code: loginRes.code,
				parentUserId : parentUserId || 0,
				recordId: recordId || 0
			}
			// console.log('model.code='+model.code);
			request('user/login', 'post', model).then(res=>{
				// console.log('userlogin:'+res);
				if(res && res.code === 0 && res.data && res.data.token){
					// console.log('token:'+res.data.token);
					setToken(res.data.token);
					setUserInfo(res.data.user);
					setSysConfig(res.data.config);
				}
			});
		}
	  }
	});
}

export async function login(data){
	let parentuserid = uni.getStorageSync('parentUserId') || 0;
	let recordId = 0;
	if(!parentuserid){
		recordId = uni.getStorageSync('qrcodeRecordId') || 0;
	}
	var [error,res] = await uni.login({provider: 'weixin'});
	if(res && res.code) {
		let model = {
			code: res.code,
			parentUserId : parentuserid,
			recordId: recordId,
			wxuser: data
		}
		// console.log(res.code);
		let result =  request('user/login', 'post', model);
		if(result) {
			result.then((resu)=>{
				if(resu.code === 0 && resu.data && resu.data.token){
					setToken(resu.data.token);
					setUserInfo(resu.data.user);
					setSysConfig(resu.data.config);
				}
			});
		}
		return result;
	}
	return null;
}

export async function customList(type,consumer,page) {
	let url = 'user/subusers/'+type+'/'+consumer+'/'+page
	let result = await  request(url, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
//GET /api/client/user/subusers/{type}/{consumer}/{page}
export async function userBalance() {
	let result = await  request('user/wallet', 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function submitMoney(money) {
	let result = await  request('user/money', 'post', {money:money});
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function userCapitals(type,page) {
	let result = await  request('user/capitals/'+type+'/'+page, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function bindUserTel(model) {
	let result = await  request('user/bind', 'post', model);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function becomePromoter(model) {
	let result = await  request('user/promoter', 'post');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function userStatictis() {
	let result = await  request('user/membertotalsum', 'get', null, true);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function userLeaderboardType(type) {
	return await request('user/leaderboard/' + type, 'get');
}

export async function userMsgtpls() {
	let result = await request('user/msgtpls', 'get', null, true);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

/**
 * 确定成为教练
 */
export async function userCoacherBecome() {
	let result = await request('user/coacher/become', 'post');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
