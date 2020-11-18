import request from '@/utils/request'

export function findNotifyById(id) {
  return request({
    url: 'notify/select/' + id,
    method: 'get'
  })
}

export function getNotifyList(model) {
  return request({
    url: 'notify/page',
    method: 'post',
    data: model
  })
}

export function addNotify(model) {
  return request({
    url: 'notify/insert',
    method: 'post',
    data: model
  })
}

export function deleteNotifyById(model) {
  return request({
    url: 'notify/delete',
    method: 'post',
    data: model
  })
}

export function updateNotify(model) {
  return request({
    url: 'notify/update',
    method: 'post',
    data: model
  })
}
