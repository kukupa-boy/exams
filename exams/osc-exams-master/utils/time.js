export function formatDateTime(time){
	 let oldTime = parseInt(time);
	 let currentTime = new Date().getTime()
	 let totalTime = parseInt(oldTime-currentTime);
	 let days = parseInt(totalTime / (1000 * 60 * 60 * 24));
	 let hours = parseInt((totalTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	 let minutes = parseInt((totalTime % (1000 * 60 * 60)) / (1000 * 60));
	 let seconds = parseInt((totalTime % (1000 * 60)) / 1000);
	 return  days+'天' + hours + '时' + minutes + "分" + seconds + "秒"; 
}
function add(m){
	return m<10?'0'+m:m;
}
export function timeConvert(shijianchuo){
		 var time = new Date(shijianchuo);
		 var y = time.getFullYear();
		 var m = time.getMonth()+1;
		 var d = time.getDate();
		 var h = time.getHours();
		 var mm = time.getMinutes();
		 var s = time.getSeconds();
		 return y+'-'+add(m)+'-'+add(d)+' '+add(h)+':'+add(mm)+':'+add(s);
}
export function timeConvertDay(shijianchuo){
		 var time = new Date(shijianchuo);
		 var y = time.getFullYear();
		 var m = time.getMonth()+1;
		 var d = time.getDate();
		 return y+'-'+add(m)+'-'+add(d);
}

export function parseTime(time, cFormat) {
  if (!time || time.length === 0) {
    return null
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}