import request from '@/utils/request'

export function getUsercapitalList(model) {
  return request({
    url: 'usercapital/page',
    method: 'post',
    data: model
  })
}
