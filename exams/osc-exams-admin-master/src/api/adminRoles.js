import request from '@/utils/request'

// export function getRoutes() {
//   return request({
//     url: '/routes',
//     method: 'get'
//   })
// }

export function findRoles(model) {
  return request({
    url: 'roles/select/list',
    method: 'get'
  })
}

export function getRoleList(model) {
  return request({
    url: 'roles/page',
    method: 'post',
    data: model
  })
}

export function addRole(model) {
  return request({
    url: 'roles/insert',
    method: 'post',
    data: model
  })
}

export function updateRole(model) {
  return request({
    url: 'roles/update',
    method: 'post',
    data: model
  })
}

export function deleteRole(model) {
  return request({
    url: 'roles/delete',
    method: 'post',
    data: model
  })
}
// export function updateRole(id, data) {
//   return request({
//     url: `/role/${id}`,
//     method: 'put',
//     data
//   })
// }
//
// export function deleteRole(id) {
//   return request({
//     url: `/role/${id}`,
//     method: 'delete'
//   })
// }
