import request from '@/utils/request'

export function chapterProductidPage(model, productid) {
  return request({
    url: 'chapter/' + productid + '/page',
    method: 'post',
    data: model
  })
}

export function chapterInsert(model) {
  return request({
    url: 'chapter/insert',
    method: 'post',
    data: model
  })
}

export function chapterDelete(model) {
  return request({
    url: 'chapter/delete',
    method: 'post',
    data: model
  })
}

export function chapterUpdate(model) {
  return request({
    url: 'chapter/update',
    method: 'post',
    data: model
  })
}

export function chapterUpdateSort(model) {
  return request({
    url: 'chapter/update/sort',
    method: 'post',
    data: model
  })
}

export function chapterUpdateOnline(chapterId) {
  return request({
    url: 'chapter/update/online/' + chapterId,
    method: 'post'
  })
}
