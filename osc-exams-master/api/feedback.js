import { apiconfig, upload, request } from '../utils/request';

export async function uploadImages(file){
	let files = [];
	files.push(file);
	return await upload('file/feedback/upload', files);
}

export function submitFeedback(model) {
	return request('feedback/fb', 'post', model, true);
}

export function submitRecruit(model) {
	return request('feedback/join', 'post', model, true);
}

export async function recruitInfo(langtype) {
	let result = await request('feedback/join/desc/'+langtype, 'get');
	if(result && result.data) {
		let resModel = {
			bgUrl: apiconfig.BASE_API_WEB+'static/images/recruit_bg.png',
			txtUrl: apiconfig.BASE_API_WEB+'static/images/recruit_text.png',
			titleUrl: apiconfig.BASE_API_WEB+'static/images/recruit_title.png',
			desc: result.data
		}
		return resModel;
	}
	return null;
}
