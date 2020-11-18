import request from '@/utils/request'

export function getAffiliateList(model) {
  return request({
    url: 'affiliate/page',
    method: 'post',
    data: model
  })
}

export function getAffiliateDelete(model) {
  return request({
    url: 'affiliate/delete',
    method: 'post',
    data: model
  })
}
