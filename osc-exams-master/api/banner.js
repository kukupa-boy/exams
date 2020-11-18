import { request } from '../utils/request'

export async function banners(type){
	let result = await  request('banner/list/'+type, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
