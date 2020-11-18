import request from '@/utils/request'

export function findOrderById(userId) {
  return request({
    url: 'order/select/' + userId,
    method: 'get'
  })
}

export function getOrderList(model) {
  return request({
    url: 'order/page',
    method: 'post',
    data: model
  })
}

export function orderUpdate(model) {
  return request({
    url: 'order/update',
    method: 'post',
    data: model
  })
}
