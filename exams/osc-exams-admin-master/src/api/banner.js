import request from '@/utils/request'

export function findBannerById(id) {
  return request({
    url: 'banner/select/' + id,
    method: 'get'
  })
}

export function getBannerList(model) {
  return request({
    url: 'banner/page',
    method: 'post',
    data: model
  })
}

export function addBanner(model) {
  return request({
    url: 'banner/insert',
    method: 'post',
    data: model
  })
}

export function deleteBannerById(model) {
  return request({
    url: 'banner/delete',
    method: 'post',
    data: model
  })
}

export function updateBanner(model) {
  return request({
    url: 'banner/update',
    method: 'post',
    data: model
  })
}

export function uploadBannerSort(model) {
  return request({
    url: 'banner/update/sort',
    method: 'post',
    data: model
  })
}
