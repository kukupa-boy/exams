
const keyConfig = {
	city: 'currentCity',
	exam: 'currentExam',
	exams: 'currentExams'
}

export function setCity(city) {
	uni.setStorage({
		key: 'keyConfig.city',
		data: city,
		success() {
			console.log('save city success');
		}
	});
}

export function getCity() {
	try {
		const value = uni.getStorageSync('keyConfig.city');
		return value;
	} catch (e) {
		return { name: '未授权', id: 0 };
	}
}

export function setExam(exam) {
	uni.setStorage({
		key: 'keyConfig.exam',
		data: exam,
		success() {
			console.log('save exam success');
		}
	});
}

export function getExam() {
	try {
		const value = uni.getStorageSync('keyConfig.exam');
		return value;
	} catch (e) {
		return null;
	}
}

export function setExams(exams) {
	uni.setStorage({
		key: 'keyConfig.exams',
		data: exams,
		success() {
			console.log('save exams success');
		}
	});
}

export function getExams() {
	try {
		const value = uni.getStorageSync('keyConfig.exams');
		return value;
	} catch (e) {
		return [];
	}
}

export function setToken(token) {
	uni.setStorage({
		key: 'keyConfig.token',
		data: token,
		success() {
			console.log('save token success');
		}
	});
}

export function getToken() {
	try {
		const value = uni.getStorageSync('keyConfig.token');
		return value;
	} catch (e) {
		return null;
	}
}

export function setUserInfo(data) {
	uni.setStorage({
		key: 'userInfo',
		data: data,
		success() {
			console.log('save userInfo success');
		}
	});
}

export function getUserInfo() {
	try {
		const value = uni.getStorageSync('userInfo');
		return value;
	} catch (e) {
		return null;
	}
}

export function setSysConfig(data) {
	uni.setStorage({
		key: 'keyConfig.sysConfig',
		data: data,
		success() {
			console.log('save sysconfig success');
		}
	});
}

export function getSysConfig() {
	try {
		const value = uni.getStorageSync('keyConfig.sysConfig');
		return value;
	} catch (e) {
		return null;
	}
}
