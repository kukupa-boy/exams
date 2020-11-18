import request from '@/utils/request'

export function settlementAgent(model) {
  return request({
    url: 'settlement/agent',
    method: 'post',
    data: model
  })
}

export function settlementAgentDetail(yearmonth, userid, query) {
  return request({
    url: `settlement/agent/detail/${yearmonth}/${userid}`,
    method: 'post',
    data: query
  })
}
export function settlementCoacher(model) {
  return request({
    url: 'settlement/coacher',
    method: 'post',
    data: model
  })
}

export function settlementCoacherDetail(yearmonth, userid, query) {
  return request({
    url: `settlement/coacher/detail/${yearmonth}/${userid}`,
    method: 'post',
    data: query
  })
}
