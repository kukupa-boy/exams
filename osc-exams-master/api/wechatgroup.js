import { request } from '../utils/request'

export async function wechatgroupInfo(productid){
	let result = await  request('wechatgroup/'+productid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
