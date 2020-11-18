import request from '@/utils/request'

export function findShareConfigById(id) {
  return request({
    url: 'shareconfig/select/' + id,
    method: 'get'
  })
}

export function getShareConfigList(model) {
  return request({
    url: 'shareconfig/page',
    method: 'post',
    data: model
  })
}

export function addShareConfig(model) {
  return request({
    url: 'shareconfig/insert',
    method: 'post',
    data: model
  })
}

export function deleteShareConfigById(model) {
  return request({
    url: 'shareconfig/delete',
    method: 'post',
    data: model
  })
}

export function updateShareConfig(model) {
  return request({
    url: 'shareconfig/update',
    method: 'post',
    data: model
  })
}
