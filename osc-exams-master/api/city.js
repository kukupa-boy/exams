import { request } from '../utils/request'

export function cityList(){
	return request('city/list', 'get');
}

export function cityPosition(lon, lat){
	return request('city/local', 'post',{lon:lon, lat:lat});
}

export function cityInfo(cityId){
	return request('city/local', 'post',{cityId:cityId});
}
