
import { getToken, setToken } from './cacheUtils';

const API_HOST = 'http://192.168.1.1000/';
const IS_DEV_EVN = false

export const apiconfig = {
	dev: IS_DEV_EVN,
	BASE_API_WEB: IS_DEV_EVN?API_HOST+'exams/':API_HOST,
	BASE_API_DEV: IS_DEV_EVN?API_HOST+'exams/api/client/':API_HOST+'api/client/',
	BASE_API_PRO: API_HOST+'api/client/'
}

// 页面上需要之间访问地址时使用
export function imageCodeUrl(url) {
	let BASE_API = apiconfig.BASE_API_WEB;
	return BASE_API + url;
}

export async function request(url, method, param,hideload){
	let BASE_API = apiconfig.dev?apiconfig.BASE_API_DEV:apiconfig.BASE_API_PRO;
	let token = getToken();
	if(!hideload) {
		uni.showLoading({
			title: ''
		});
	}
	var [error, res] = await uni.request({
				url: BASE_API + url,
				method: method,
				data: param,
				dataType: 'json',
				header: {
					'token': token,
					'Accept': 'application/json',
					'Content-Type': 'application/json', //自定义请求头信息
				}
			});
	if(!hideload) {
		uni.hideLoading();
	}
	if(res && res.data) {
		var result = res.data;
		if(result.code == 0){
			if(res.header && res.header.token){
				setToken(res.header.token);
			}
			return result;
		}else{
			if(result.msg) {
				uni.showToast({
					title: result.msg,
					duration: 1500,
					mask: false,
					icon: 'none'
				});
			}
			return null;
		}
	}
	console.log('请求返回错误：'+res);
	return null;
}

export async function upload(url, files) {
	let BASE_API = apiconfig.dev?apiconfig.BASE_API_DEV:apiconfig.BASE_API_PRO;
	let token = getToken();
	var [error, res] = await uni.uploadFile({
		url: BASE_API+url, 
		files: files,
		name: 'files',
		filePath: files[0],
		header:{"Content-Type": "multipart/form-data", 'token': token}
	});
	if(res && res.data) {
		var result = res.data;
		result = JSON.parse(result);
		if(result.code == 0){
			if(res.header && res.header.token){
				setToken(res.header.token);
			}
			return result;
		}else{
			return null;
		}
	}
	console.log('上传返回错误：'+res);
	return null;
}
