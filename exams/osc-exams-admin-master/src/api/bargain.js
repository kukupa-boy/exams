import request from '@/utils/request'

export function bargainActivityPage(model) {
  return request({
    url: 'bargain/activity/page',
    method: 'post',
    data: model
  })
}

export function bargainActivityInsert(model) {
  return request({
    url: 'bargain/activity/insert',
    method: 'post',
    data: model
  })
}

export function bargainActivityDelete(model) {
  return request({
    url: 'bargain/activity/delete',
    method: 'post',
    data: model
  })
}

export function bargainActivityUpdate(model) {
  return request({
    url: 'bargain/activity/update',
    method: 'post',
    data: model
  })
}

export function bargainActivitySelectActivityproducts(id) {
  return request({
    url: 'bargain/activity/select/activityproducts/' + id,
    method: 'get'
  })
}

export function bargainActivityUpdateActivityproduct(model) {
  return request({
    url: 'bargain/activity/update/activityproduct',
    method: 'post',
    data: model
  })
}

