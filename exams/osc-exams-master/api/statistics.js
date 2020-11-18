import { request, imageCodeUrl } from '../utils/request';
export async function statisticsSummary(){
	let result = await request('statistics/summary', 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
export async function statisticsSummaryForYearMouth(yearmonth){
	let result = await request('statistics/summary/product/'+yearmonth, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}
export async function statisticsSummaryForYear(year){
	let result = await request('statistics/summary/'+year, 'get');
	if(result && result.data) {
		return result.data;
	}
	return null;
}