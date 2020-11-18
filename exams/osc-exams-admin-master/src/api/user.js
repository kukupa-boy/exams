import request from '@/utils/request'

export function findUserById(userId) {
  return request({
    url: 'user/select/' + userId,
    method: 'get'
  })
}

export function getUserIdPage(userid, page, model) {
  return request({
    url: 'user/logs/' + userid + '/' + page,
    method: 'post',
    data: model
  })
}

export function getUserList(model) {
  return request({
    url: 'user/page',
    method: 'post',
    data: model
  })
}

export function userProductPage(model) {
  return request({
    url: 'user/product/page',
    method: 'post',
    data: model
  })
}
export function userChangeType(model) {
  return request({
    url: 'user/change/type/' + model.userid + '/' + model.type,
    method: 'post'
  })
}
export function userChangeParent(model) {
  return request({
    url: 'user/change/parent/' + model.userid + '/' + model.parentid,
    method: 'post'
  })
}
export function userCourseproductPage(model) {
  return request({
    url: 'user/courseproduct/page',
    method: 'post',
    data: model
  })
}
export function userChangeAgentArea(model) {
  return request({
    url: 'user/change/agent/area',
    method: 'post',
    data: model
  })
}
export function userForbidden(id) {
  return request({
    url: 'user/forbidden/' + id,
    method: 'post'
  })
}
