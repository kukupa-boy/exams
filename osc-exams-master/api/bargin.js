
import {request} from '../utils/request.js'

export async function orderBargain(orderid,langtype){
	let result = await  request('order/bargain/'+langtype+'/'+orderid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function bargainRecords(recordid,page){
	let result = await  request('bargain/records/'+recordid+'/'+page, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function bargainSubmit(recordid){
	let result = await  request('order/bargain/submit/'+recordid, 'post');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function paymentWechatMiniOrder(orderid){
	let result = await  request('payment/wechat/mini/order/'+orderid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
