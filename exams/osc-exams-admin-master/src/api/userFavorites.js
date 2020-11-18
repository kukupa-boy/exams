import request from '@/utils/request'

export function findUserFavoritesById(id) {
  return request({
    url: 'userfavorites/select/' + id,
    method: 'get'
  })
}

export function getUserFavoritesList(model) {
  return request({
    url: 'userfavorites/page',
    method: 'post',
    data: model
  })
}
