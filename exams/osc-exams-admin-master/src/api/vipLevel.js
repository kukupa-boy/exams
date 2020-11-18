import request from '@/utils/request'

export function findVipLevelById(id) {
  return request({
    url: 'viplevel/select/' + id,
    method: 'get'
  })
}

export function getVipLevelList(model) {
  return request({
    url: 'viplevel/page',
    method: 'post',
    data: model
  })
}

export function updateVipLevel(model) {
  return request({
    url: 'viplevel/update',
    method: 'post',
    data: model
  })
}

export function updateVipLevelSpreadMoney(model) {
  return request({
    url: 'viplevel/update/spreadmoney',
    method: 'post',
    data: model
  })
}

export function getAgentList(model) {
  return request({
    url: 'viplevel/page',
    method: 'post',
    data: model
  })
}
