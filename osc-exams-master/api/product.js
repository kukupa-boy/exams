import { request } from '../utils/request'

export function productList(examid, langtype, page, hiddenLoad){
	return request('product/list/'+examid+'/'+langtype+'/'+page, 'get', null, hiddenLoad);
}

export function productInfo(id){
	return request('product/'+id, 'get');
}

export function videoCert(videoId) {
	return request('video/play/certs', 'post',{videoid: videoId});
}

export function videoInfo(videoId) {
	return request('video/play/info', 'post',videoId);
}

export function videoPlay(productId) {
	return request('video/play/video', 'post',productId);
}

export function videoCourseInfo(productId, courseId) {
	return request('video/play/course/info/'+productId+'/'+courseId, 'post');
}

export function videoCoursePlay(productId, courseId) {
	return request('video/play/course/'+productId+'/'+courseId, 'post');
}

/**
 * 更新播放进度
 * @param {Object} model
 */
export function videoUpdateProgress(model) {
	return request('video/play/progress', 'post',model,true);
}

export function collecProduct(productId) {
	return request('product/collect/'+productId, 'post',productId);
}

export function favoriteProducts(page) {
	return request('user/favorites/'+page, 'get');
}

export async function productCategory(langtype){
	let result = await  request('product/category/'+langtype, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function productPage(langtype,categoryid, page, hiddenLoad){
	let result = await  request('product/page/'+langtype+'/'+categoryid+'/'+page, 'get',null,hiddenLoad);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function productSuggests(productid){
	let result = await  request('product/suggests/'+productid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
