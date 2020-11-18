import { request } from '../utils/request'

export function examList(cityid){
	return request('exam/list/'+cityid, 'get');
}
