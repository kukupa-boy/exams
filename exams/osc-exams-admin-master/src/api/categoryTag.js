import request from '@/utils/request'

export function findCategoryTagById(id) {
  return request({
    url: 'categorytag/select/' + id,
    method: 'get'
  })
}

export function getCategoryTagList(model) {
  return request({
    url: 'categorytag/page',
    method: 'post',
    data: model
  })
}

export function addCategoryTag(model) {
  return request({
    url: 'categorytag/insert',
    method: 'post',
    data: model
  })
}

export function deleteCategoryTagById(model) {
  return request({
    url: 'categorytag/delete',
    method: 'post',
    data: model
  })
}

export function updateCategoryTag(model) {
  return request({
    url: 'categorytag/update',
    method: 'post',
    data: model
  })
}

export function uploadCategoryTagSort(model) {
  return request({
    url: 'categorytag/update/sort',
    method: 'post',
    data: model
  })
}

export function updateCategorysTag(model) {
  return request({
    url: 'categorytag/updates',
    method: 'post',
    data: model
  })
}
