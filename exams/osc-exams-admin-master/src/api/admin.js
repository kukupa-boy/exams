import request from '@/utils/request'

export function fetchAdminList(model) {
  return request({
    url: 'admin/page',
    method: 'post',
    data: model
  })
}

export function createAdmin(model) {
  return request({
    url: 'admin/insert',
    method: 'post',
    data: model
  })
}

export function deleteAdmin(adminId) {
  return request({
    url: 'admin/delete',
    method: 'post',
    data: adminId
  })
}

export function updateAdmin(model) {
  return request({
    url: 'admin/update',
    method: 'post',
    data: model
  })
}

export function updateAdminStatus(model) {
  return request({
    url: 'admin/update/status',
    method: 'post',
    data: model
  })
}

export function updateAdminPassword(model) {
  return request({
    url: 'admin/update/password',
    method: 'post',
    data: model
  })
}

export function updateAdminPersonalInfo(model) {
  return request({
    url: 'admin/update/personalinfo',
    method: 'post',
    data: model
  })
}

export function updateAdminPersonalPersonal(model) {
  return request({
    url: 'admin/update/personalpassword',
    method: 'post',
    data: model
  })
}
