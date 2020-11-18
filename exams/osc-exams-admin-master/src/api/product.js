import request from '@/utils/request'

export function findProductById(id) {
  return request({
    url: 'product/select/' + id,
    method: 'get'
  })
}

export function getProductList(model) {
  return request({
    url: 'product/page',
    method: 'post',
    data: model
  })
}

export function addProduct(model) {
  return request({
    url: 'product/insert',
    method: 'post',
    data: model
  })
}

export function deleteProductById(model) {
  return request({
    url: 'product/delete',
    method: 'post',
    data: model
  })
}

export function updateProduct(model) {
  return request({
    url: 'product/update',
    method: 'post',
    data: model
  })
}

export function uploadProductIcon(model) {
  return request({
    url: 'product/upload',
    method: 'post',
    data: model
  })
}

export function uploadProductSort(model) {
  return request({
    url: 'product/update/sort',
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

export function uploadProductUser(model) {
  return request({
    url: 'product/update/user',
    method: 'post',
    data: model
  })
}

export function productPageBycourse(model) {
  return request({
    url: 'product/page/bycourse',
    method: 'post',
    data: model
  })
}

export function productInsertbycourse(model) {
  return request({
    url: 'product/insertbycourse',
    method: 'post',
    data: model
  })
}

export function productUpdateWechatgroup(model) {
  return request({
    url: 'product/update/wechatgroup',
    method: 'post',
    data: model
  })
}

export function productUpdateRecommended(model) {
  return request({
    url: 'product/update/recommended',
    method: 'post',
    data: model
  })
}

export function productActivitiesPage(model) {
  return request({
    url: 'product/activities/page',
    method: 'post',
    data: model
  })
}

export function productCourseproductUpdateUser(model) {
  return request({
    url: 'product/courseproduct/update/user',
    method: 'post',
    data: model
  })
}

export function productUpdateSort(model) {
  return request({
    url: 'product/update/sort',
    method: 'post',
    data: model
  })
}
export function productCommentReply(model) {
  return request({
    url: 'product/comment/reply',
    method: 'post',
    data: model
  })
}

