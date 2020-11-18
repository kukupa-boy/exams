import request from '@/utils/request'

export function productCommentAudit(model) {
  return request({
    url: 'product/comment/audit',
    method: 'post',
    data: model
  })
}

export function productCommentDelete(model) {
  return request({
    url: 'product/comment/delete',
    method: 'post',
    data: model
  })
}

export function productCommentPage(model) {
  return request({
    url: 'product/comment/page',
    method: 'post',
    data: model
  })
}
