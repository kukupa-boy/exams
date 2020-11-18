import request from '@/utils/request'

export function comboActivityDelete(model) { // 删除活动 id
  return request({
    url: 'combo/activity/delete',
    method: 'post',
    data: model
  })
}

export function comboActivityInsert(model) { // 添加活动
  return request({
    url: 'combo/activity/insert',
    method: 'post',
    data: model
  })
}

export function comboActivityPage(model) { // 活动分页
  return request({
    url: 'combo/activity/page',
    method: 'post',
    data: model
  })
}

export function comboActivityDeleteSelectActivityProducts(id) { //  查询活动商品列表
  return request({
    url: `combo/activity/select/activityproducts/${id}`,
    method: 'get'
  })
}
export function comboActivitySelectList(id) { //  查询活动列表
  return request({
    url: `combo/activity/select/list`,
    method: 'get'
  })
}
export function comboActivitySelectById(id) { //  根据ID查询活动
  return request({
    url: `combo/activity/select/${id}`,
    method: 'get'
  })
}
export function comboActivityUpdate(model) { // 更新活动
  return request({
    url: `combo/activity/update`,
    method: 'post',
    data: model
  })
}

export function comboActivityUpdateActivityproduct(model) { // 设置活动商品
  return request({
    url: `combo/activity/update/activityproduct`,
    method: 'post',
    data: model
  })
}
