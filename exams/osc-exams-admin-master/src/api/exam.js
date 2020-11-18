import request from '@/utils/request'

export function findExamById(id) {
  return request({
    url: 'exam/select/' + id,
    method: 'get'
  })
}

export function getExamList(model) {
  return request({
    url: 'exam/page',
    method: 'post',
    data: model
  })
}

export function addExam(model) {
  return request({
    url: 'exam/insert',
    method: 'post',
    data: model
  })
}

export function deleteExamById(model) {
  return request({
    url: 'exam/delete',
    method: 'post',
    data: model
  })
}

export function updateExam(model) {
  return request({
    url: 'exam/update',
    method: 'post',
    data: model
  })
}

export function getExamsByCityId(cityId) {
  return request({
    url: 'exam/select/list/cityid/' + cityId,
    method: 'get'
  })
}
