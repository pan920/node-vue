import request from '@/utils/request'

export function getListApi(query) {
  return request({
    url: '/profiles/list',
    method: 'get',
    params: query
  })
}

export function addFoundApi(data) {
  return request({
    url: '/profiles/add',
    method: 'post',
    data
  })
}

export function editFoundApi(data, id) {
  return request({
    url: `/profiles/edit/${id}`,
    method: 'post',
    data
  })
}

export function delFoundApi(id) {
  return request({
    url: `/profiles/del/${id}`,
    method: 'get'
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
