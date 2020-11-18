import request from '@/utils/request'

export function productcategoryPage(model) {
  return request({
    url: 'productcategory/page',
    method: 'post',
    data: model
  })
}

export function productcategoryInsert(model) {
  return request({
    url: 'productcategory/insert',
    method: 'post',
    data: model
  })
}

export function productcategoryDelete(model) {
  return request({
    url: 'productcategory/delete',
    method: 'post',
    data: model
  })
}

export function productcategoryUpdate(model) {
  return request({
    url: 'productcategory/update',
    method: 'post',
    data: model
  })
}

export function productcategoryUpdateSort(model) {
  return request({
    url: 'productcategory/update/sort',
    method: 'post',
    data: model
  })
}

export function productcategoryCourseproductPage(model) {
  return request({
    url: 'productcategory/courseproduct/page',
    method: 'post',
    data: model
  })
}
