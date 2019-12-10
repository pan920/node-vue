import request from '@/utils/request'

// 新闻列表
export function articleListApi(data) {
  return request({
    url: '/article/list',
    method: 'get',
    params: { data }
  })
}

// 新增新闻
export function addArticleApi(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data
  })
}

// 编辑新闻
export function editArticleApi(data) {
  return request({
    url: `/article/edit/${data._id}`,
    method: 'post',
    data
  })
}

// 新闻详情
export function detailArticleApi(id) {
  return request({
    url: `/article/${id}`,
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
