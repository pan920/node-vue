import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRolesApi(data) {
  return request({
    url: '/users/user-list',
    method: 'get',
    params: { data }
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
