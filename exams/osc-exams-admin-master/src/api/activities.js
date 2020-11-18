import request from '@/utils/request'

export function findActivitiesById(id) {
  return request({
    url: 'activities/select/' + id,
    method: 'get'
  })
}

export function getActivitiesList(model) {
  return request({
    url: 'activities/page',
    method: 'post',
    data: model
  })
}

export function addActivities(model) {
  return request({
    url: 'activities/insert',
    method: 'post',
    data: model
  })
}

export function deleteActivitiesById(model) {
  return request({
    url: 'activities/delete',
    method: 'post',
    data: model
  })
}

export function updateActivities(model) {
  return request({
    url: 'activities/update',
    method: 'post',
    data: model
  })
}

export function findActivityProductList(id) {
  return request({
    url: 'activities/select/activityproducts/' + id,
    method: 'get'
  })
}

export function updateActivityProducts(model) {
  return request({
    url: 'activities/update/activityproduct',
    method: 'post',
    data: model
  })
}

