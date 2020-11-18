import { request } from '../utils/request';

export function liveroomApply(model) {
	return request('liveroom/apply', 'post', model, true);
}
export async function liveroomLists(langtype,page) {
	let result = await request('liveroom/lists/'+langtype+"/"+page, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
export async function liveroomUpdateCount(id) {
	let result = await request('liveroom/update/count/' + id,'post');
	if(result && result.data) {
		return result.data;
	}
	return null;
}