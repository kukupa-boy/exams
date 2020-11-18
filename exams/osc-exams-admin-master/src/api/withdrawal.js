import request from '@/utils/request'

export function getWithdrawalList(model) {
  return request({
    url: 'withdrawal/page',
    method: 'post',
    data: model
  })
}

export function setWithdrawalStatus(model) {
  return request({
    url: 'withdrawal/update/status',
    method: 'post',
    data: model
  })
}
