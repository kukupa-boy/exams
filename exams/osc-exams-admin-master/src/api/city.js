import request from '@/utils/request'

export function findCityById(id) {
  return request({
    url: 'city/select/' + id,
    method: 'get'
  })
}

export function getCityList(model) {
  return request({
    url: 'city/page',
    method: 'post',
    data: model
  })
}

export function addCity(model) {
  return request({
    url: 'city/insert',
    method: 'post',
    data: model
  })
}

export function deleteCityById(model) {
  return request({
    url: 'city/delete',
    method: 'post',
    data: model
  })
}

export function updateCity(model) {
  return request({
    url: 'city/update',
    method: 'post',
    data: model
  })
}

export function getCitys(model) {
  return request({
    url: 'city/select/list',
    method: 'post',
    data: model
  })
}

export function openedCity(model) {
  return request({
    url: 'city/openedcity',
    method: 'post',
    data: model
  })
}

export function cityPage(model) {
  return request({
    url: 'city/page',
    method: 'post',
    data: model
  })
}
