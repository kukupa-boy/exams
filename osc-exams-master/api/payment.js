import { request } from '../utils/request'

export function paymentInfo(productId){
	return request('payment/wechat/mini/'+productId, 'get');
}

export function paymentProxyInfo(recordId){
	return request('payment/wechat/mini/proxy/'+recordId, 'get');
}

export async function paymentWechatMiniCombo(activityid){
	let result = await  request('payment/wechat/mini/combo/'+activityid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}