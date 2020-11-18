import request from '@/utils/request'

export function getAdviceList(model) {
  return request({
    url: 'advice/page',
    method: 'post',
    data: model
  })
}

export function getAdviceDelete(model) {
  return request({
    url: 'advice/delete',
    method: 'post',
    data: model
  })
}

export function getAdviceHandle(model) {
  return request({
    url: 'advice/handle',
    method: 'post',
    data: model
  })
}
