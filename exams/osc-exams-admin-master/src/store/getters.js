const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  aliyunUserId: state => state.user.aliyunUserId,
  aliyunRegionId: state => state.user.aliyunRegionId,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  serverRoutes: state => state.user.serverRoutes,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  cityIds: state => state.user.cityIds,
  categoryIcons: state => state.user.categoryIcons
}
export default getters