import { request } from '../utils/request'

export function categoryList(examid, hiddenload){
	return request('category/list/'+examid, 'get', null, hiddenload);
}

export function categoryInfo(categoryId) {
	return request('category/'+categoryId, 'get');
}
