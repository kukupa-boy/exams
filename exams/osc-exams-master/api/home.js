import { request } from '../utils/request'

export async function initHome(cityid,langtype){
	if(!langtype) {
		langtype = 0;
	}
	var model = {}
	if(cityid && cityid>0){
		model = {cityId:cityid}
	}else{
		var [error, res] = await uni.getLocation({
			type: 'wgs84'
		})
		let lat = 0, lon = 0;
		if(res) {
			lat = res.latitude;
			lon = res.longitude;
		}
		model = {lat:lat, lon:lon};
	}
	return await request('home/init/'+langtype, 'post', model);
}
