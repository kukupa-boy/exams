import request from '@/utils/request'

export function transcodeTemplates() {
  return request({
    url: '/video/transcode/templates',
    method: 'get'
  })
}

export function getCerts(model) {
  return request({
    url: '/video/upload/certs',
    method: 'post',
    data: model
  })
}

export function refreshCerts(videoId) {
  return request({
    url: '/video/upload/certs/refresh',
    method: 'post',
    data: { videoId }
  })
}

export function updateVideoId(model) {
  return request({
    url: '/product/update/video',
    method: 'post',
    data: model
  })
}
