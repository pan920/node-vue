import request from '@/utils/request'

// banner列表
export function bannerListApi(data) {
  return request({
    url: '/banner/list',
    method: 'post',
    data
  })
}

// 新增banner
export function addBannerApi(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}

// 编辑banner
export function editBannerApi(data) {
  return request({
    url: `/banner/edit/${data._id}`,
    method: 'post',
    data
  })
}

// banner详情
export function detailBannerApi(id) {
  return request({
    url: `/banner/${id}`,
    method: 'get'
  })
}

// 上传图片
export function uploadImgApi(data) {
  return request({
    url: '/banner/upload',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}
