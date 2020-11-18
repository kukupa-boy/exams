import { request, imageCodeUrl } from '../utils/request';
// Home("首页", 1),
// Center("个人中心", 2),
// Promote("推广中心", 3),
// Tutorial("使用教程", 4),
// Product("产品详情", 5),
// Affiliate("合作招募", 6),
// Strategy("考场攻略", 7),
// ProductBackground("产品海报背景图", 8),
// strategyBackground("攻略海报背景图", 9),
// StudentBackground("学员推广码背景图", 10)
const enumsshareType = {
	Home:1,
	Center:2,
	Promote:3,
	Tutorial:4,
	Product:5,
	Affiliate:6,
	Strategy:7,
	ProductBackground:8,
	strategyBackground:9,
	StudentBackground:10,
	BargainBackground:11,
	ShareCoacher:12
}

export async function shareInfo(type,langtype){
	let url = langtype || langtype === 0 ? 'poster/share/'+type+'/'+langtype : 'poster/share/'+type;
	let result = await request(url, 'get',null, true,true);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export function shareInfoOfHome(langtype){
	return shareInfo(enumsshareType.Home,langtype);
}

export async function shareInfoOfUser(langtype){
	return shareInfo(enumsshareType.Center,langtype);
}

export async function shareInfoOfPromoter(langtype){
	return shareInfo(enumsshareType.Promote,langtype);
}

export async function shareInfoOfCoacher(langtype){
	return shareInfo(enumsshareType.ShareCoacher,langtype);
}


export async function shareInfoOfTutorial(langtype){
	return shareInfo(enumsshareType.Tutorial,langtype);
}

export async function shareInfoOfProduct(langtype){
	return shareInfo(enumsshareType.Product,langtype);
}

export async function shareInfoOfAffiliate(langtype){
	return shareInfo(enumsshareType.Affiliate,langtype);
}

export async function shareInfoOfStrategy(langtype){
	return shareInfo(enumsshareType.Strategy,langtype);
}

export async function shareInfoOfProductBackground(langtype){
	return shareInfo(enumsshareType.ProductBackground,langtype);
}

export async function shareInfoOfstrategyBackground(langtype){
	return shareInfo(enumsshareType.strategyBackground,langtype);
}

export async function shareInfoOfStudentBackground(langtype){
	return shareInfo(enumsshareType.StudentBackground,langtype);
}

export async function codeImageInfoOfProduct(productId,lantype){
	let result = await request('poster/video/'+productId+"/"+lantype, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function codeImageInfoOfCategory(categoryId,lantype){
	let result = await request('poster/category/'+categoryId+'/'+lantype, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function codeImageInfoOfPromoter(lantype){
	let result = await request('poster/promoter/'+lantype, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function codeRecordInfo(id){
	let result = await request('poster/qrcode/'+id, 'get',null, true);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function proxyOrderInfo(productid,lantype){
	let result = await request('poster/order/'+productid+'/'+lantype, 'get',null);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export async function postBargainProduct(productid,lantype){
	let result = await request('poster/bargain/'+productid+'/'+lantype, 'get',null);
	if(result && result.data) {
		return result.data;
	}
	return null;
}

export function dynamicImages() {
	let urlprex = 'static/images/'
	return {
		zhuanImgUrl: imageCodeUrl(urlprex+'zhuan.gif'),
		zhuanImgYuUrl: imageCodeUrl(urlprex+'zhuanyu.gif'),
		miniQrcodeUrl: imageCodeUrl(urlprex+'miniappcode.png')
	} 
}
