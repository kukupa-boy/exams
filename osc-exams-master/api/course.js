import { request } from '../utils/request'

export async function courseChapters(productid){
	let result = await  request('course/chapters/'+productid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
