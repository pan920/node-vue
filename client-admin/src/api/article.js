import request from '@/utils/request'

// 新闻列表
export function articleListApi(data) {
  return request({
    url: '/article/list',
    method: 'post',
    data
  })
}

// 新增新闻
export function addArticleApi(data) {
  return request({
    url: '/article/detail',
    method: 'post',
    data
  })
}

// 编辑新闻
export function editArticleApi(data, id) {
  return request({
    url: `/article/edit/${id}`,
    method: 'get',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}
