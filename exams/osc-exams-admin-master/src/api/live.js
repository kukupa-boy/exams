import request from '@/utils/request'

export function liveroomPage(model) {
  return request({
    url: 'liveroom/page',
    method: 'post',
    data: model
  })
}
export function liveroomUpdate(model) {
  return request({
    url: 'liveroom/update',
    method: 'post',
    data: model
  })
}
export function liveroomDelete(model) {
  return request({
    url: 'liveroom/delete',
    method: 'post',
    data: model
  })
}
export function liveroomAudit(model) {
  return request({
    url: 'liveroom/audit',
    method: 'post',
    data: model
  })
}
