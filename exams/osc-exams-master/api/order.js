import { request } from '../utils/request'

export function orderList(page){
	return request('order/videos/'+page, 'get');
}

export async function customOrders(page){
	let result = await  request('order/suborderlist/'+page, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function recordOrderInfo(recordid){
	let result = await  request('order/info/'+recordid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
