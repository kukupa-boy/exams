import request from '@/utils/request'

export function findCategoryById(id) {
  return request({
    url: 'category/select/' + id,
    method: 'get'
  })
}

export function getCategoryList(model) {
  return request({
    url: 'category/page',
    method: 'post',
    data: model
  })
}

export function addCategory(model) {
  return request({
    url: 'category/insert',
    method: 'post',
    data: model
  })
}

export function deleteCategoryById(model) {
  return request({
    url: 'category/delete',
    method: 'post',
    data: model
  })
}

export function updateCategory(model) {
  return request({
    url: 'category/update',
    method: 'post',
    data: model
  })
}

export function uploadCategoryIcon(model) {
  return request({
    url: 'file/category/upload',
    method: 'post',
    data: model
  })
}

export function uploadCategorySort(model) {
  return request({
    url: 'category/update/sort',
    method: 'post',
    data: model
  })
}
