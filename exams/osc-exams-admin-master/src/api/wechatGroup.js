import request from '@/utils/request'

export function wechatgroupPage(model) {
  return request({
    url: 'wechatgroup/page',
    method: 'post',
    data: model
  })
}

export function wechatgroupInsert(model) {
  return request({
    url: 'wechatgroup/insert',
    method: 'post',
    data: model
  })
}

export function wechatgroupDelete(model) {
  return request({
    url: 'wechatgroup/delete',
    method: 'post',
    data: model
  })
}

export function wechatgroupUpdate(model) {
  return request({
    url: 'wechatgroup/update',
    method: 'post',
    data: model
  })
}

export function wechatgroupCourseproductPage(model) {
  return request({
    url: 'wechatgroup/courseproduct/page',
    method: 'post',
    data: model
  })
}
