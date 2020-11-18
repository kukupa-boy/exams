import { request } from '../utils/request'

export async function comboActivityInfo(activityid){
	let result = await  request('combo/activity/info/'+activityid, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
