import request from '@/utils/request'

export function updateSysteminfo(model) {
  return request({
    url: 'systeminfo/update',
    method: 'post',
    data: model
  })
}

export function findSysteminfo(id) {
  return request({
    url: 'systeminfo/select',
    method: 'get'
  })
}
