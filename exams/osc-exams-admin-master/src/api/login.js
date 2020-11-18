import request from '@/utils/request'

export function login(username, password) {
  const user = {
    userName: username,
    password: password,
    code: ''
  }
  return request({
    url: 'admin/login',
    method: 'post',
    data: user
  })
}

export function logout() {
  return request({
    url: 'login/logout',
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: 'admin/account',
    method: 'get'
  })
}

