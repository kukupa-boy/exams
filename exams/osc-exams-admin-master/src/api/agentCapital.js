import request from '@/utils/request'

export function getTotalCount(model) {
  return request({
    url: 'agentcapital/total',
    method: 'post',
    data: model
  })
}
