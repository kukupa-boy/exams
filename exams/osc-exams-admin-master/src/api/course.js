import request from '@/utils/request'

export function coursePage(model) {
  return request({
    url: 'course/page',
    method: 'post',
    data: model
  })
}

export function courseInsert(model) {
  return request({
    url: 'course/insert',
    method: 'post',
    data: model
  })
}

export function courseDelete(model) {
  return request({
    url: 'course/delete',
    method: 'post',
    data: model
  })
}

export function courseUpdate(model) {
  return request({
    url: 'course/update',
    method: 'post',
    data: model
  })
}

export function courseUpdateSort(model) {
  return request({
    url: 'course/update/sort',
    method: 'post',
    data: model
  })
}
