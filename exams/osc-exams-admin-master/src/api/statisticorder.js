import request from '@/utils/request'

export function statisticSummary() {
  return request({
    url: 'statistic/summary',
    method: 'get'
  })
}

export function statisticChart() {
  return request({
    url: 'statistic/chart',
    method: 'get'
  })
}

export function statisticChartCommis() {
  return request({
    url: 'statistic/chart/commis',
    method: 'get'
  })
}

export function statisticChartSales() {
  return request({
    url: 'statistic/chart/sales',
    method: 'get'
  })
}

export function statisticPieSales() {
  return request({
    url: 'statistic/pie/sales',
    method: 'get'
  })
}

export function statisticUsersUps(year) {
  return request({
    url: 'statistic/users/ups/' + year,
    method: 'get'
  })
}

export function statisticProducts(year) {
  return request({
    url: `statistic/products/${year}`,
    method: 'get'
  })
}

export function statisticProductsAgent(year, userid) { // 经理统计图
  return request({
    url: `statistic/products/agent/${year}/${userid}`,
    method: 'get'
  })
}

export function statisticProductsCoacher(year, userid) { // 经理统计图
  return request({
    url: `statistic/products/coacher/${year}/${userid}`,
    method: 'get'
  })
}

