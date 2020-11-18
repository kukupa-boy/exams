import { request } from '../utils/request'

export async function proComPage(productid, page){
	let result = await  request('product/comment/page/'+productid+'/'+page, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function proComSubmit(model){
	let result =  await request('product/comment/submit', 'post', model);
	if(result && result.data) {
		return result.data;
	}
	return null;
}