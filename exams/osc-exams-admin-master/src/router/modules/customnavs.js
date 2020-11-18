/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const customRouter = [
  {
    menuId: 10001000,
    path: '/regional', // 区域管理
    component: Layout,
    redirect: '/regional/cityList',
    name: 'Regionals',
    meta: {
      title: 'regionals',
      icon: 'regional',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10001001,
        path: '/regional/cityList', // 城市列表
        component: () => import('@/views/regional/cityTable.vue'),
        name: 'CityTable',
        meta: { title: 'cityList', icon: 'city', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10001002,
        path: '/regional/examList', // 考场列表
        component: () => import('@/views/regional/examTable.vue'),
        name: 'ExamTable',
        meta: { title: 'examList', icon: 'exam', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10001003,
        path: '/regional/categoryList', // 栏目设置
        component: () => import('@/views/category/categoryTable'),
        name: 'CategoryTable',
        meta: { title: 'categoryList', icon: 'category', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10001004,
        hidden: true,
        path: '/regional/categoryTag', // 栏目内容
        component: () => import('@/views/category/categoryTagTable'),
        name: 'CategoryTag',
        meta: { title: 'categoryTag', icon: 'categoryTag', noCache: false }
      }
      // ,
      // {
      //   menuId: 10001005,
      //   path: '/regional/agent', // 代理管理
      //   component: () => import('@/views/admin/agentListTable'),
      //   name: 'AgentListTable',
      //   meta: { title: 'agentsettings', icon: 'agent', noCache: false, roles: ['admin'] }
      // },
      // {
      //   menuId: 10001006,
      //   path: '/regional/agentCapital', // 代理收益
      //   component: () => import('@/views/regional/agentCapital'),
      //   name: 'AgentCapital',
      //   meta: { title: 'agentCapital', icon: 'agentCapital', noCache: false, roles: ['admin'] }
      // }
    ]
  },
  {
    // type: 'admin',
    menuId: 10002000,
    path: '/product', // 商品管理
    component: Layout,
    redirect: '/product/wechatGroupList', // 微信群
    name: 'products',
    meta: {
      title: 'products',
      icon: 'product',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10002003,
        path: '/product/wechatGroupList', // 微信群
        component: () => import('@/views/product/wechatGroupTable'),
        name: 'WechatGroupTable',
        meta: { title: 'wechatGroupList', icon: 'wechatGroupList', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10002004,
        path: '/product/productCategoryList', // 课程分类
        component: () => import('@/views/product/productCategoryTable'),
        name: 'ProductCategoryTable',
        meta: { title: 'productCategoryList', icon: 'productCategoryList', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10002005,
        path: '/product/courseProductList', // 理论课程
        component: () => import('@/views/product/courseProductTable'),
        name: 'courseProductTable',
        meta: { title: 'courseProductList', icon: 'courseProductList', noCache: false, roles: ['admin'] }
      },
      {
        hidden: true,
        menuId: 10002006,
        path: '/product/chapterList', // 课程管理
        component: () => import('@/views/product/chapterTable'),
        name: 'ChapterList',
        meta: { title: 'chapterList', icon: 'chapterList', noCache: false }
      },
      {
        menuId: 10002001,
        path: '/product/productList', // 考场视频
        component: () => import('@/views/product/productListTable'),
        name: 'ProductListTable',
        meta: { title: 'productList', icon: 'productList', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10002002,
        path: '/product/activitiesList', // 活动设置
        component: () => import('@/views/product/activitiesTable'),
        name: 'ActivitiesTable',
        meta: { title: 'activitiesList', icon: 'activities', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10002007, // 砍价活动
        path: '/product/bargainActivityTable',
        component: () => import('@/views/product/bargainActivityTable'),
        name: 'BargainActivityTable',
        meta: { title: 'bargainActivityTable', icon: 'bargain', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10002008, //  套餐活动
        path: '/product/setMenuActivity',
        component: () => import('@/views/product/setMenuActivity'),
        name: 'setMenuActivity',
        meta: { title: 'setMenuActivity', icon: 'category', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10014000,
    path: '/live', // 直播
    component: Layout,
    redirect: '/live/liveTable',
    name: 'live',
    meta: {
      title: 'live',
      icon: 'live',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10014001,
        path: '/live/liveTable', // 直播管理列表
        component: () => import('@/views/live/liveTable.vue'),
        name: 'liveTable',
        meta: { title: 'live', icon: 'live', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10003000,
    path: '/order', // 订单管理
    component: Layout,
    redirect: '/order/orderList',
    name: 'orders',
    meta: {
      title: 'orders',
      icon: 'orders',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10003001, // 订单列表
        path: '/order/orderList',
        component: () => import('@/views/order/orderTable'),
        name: 'OrderTable',
        meta: { title: 'orderList', icon: 'orders', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10003002,
        hidden: false,
        path: '/order/commissionusercapital', // 资金流水
        component: () => import('@/views/order/usercapitalTable'),
        name: 'UsercapitalTable',
        meta: { title: 'commissionusercapital', icon: 'withdrawalIcon', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10004000,
    path: '/user', // 用户管理
    component: Layout,
    redirect: '/user/userList',
    name: 'Users',
    meta: {
      title: 'userRoot',
      icon: 'peoples',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10004001,
        path: '/user/userList', // 用户列表
        component: () => import('@/views/user/userTable'),
        name: 'UserTable',
        meta: { title: 'userList', icon: 'peoples', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10004002,
        hidden: true,
        path: '/user/userFavoritesList', // 用户收藏
        component: () => import('@/views/user/userFavoritesTable'),
        name: 'UserFavoritesList',
        meta: { title: 'userFavoritesList', icon: 'peoples', noCache: true }
      },
      {
        menuId: 10004003,
        hidden: true,
        path: '/user/usercapital', // 资金流水
        component: () => import('@/views/user/usercapitalTable'),
        name: 'UserCapitalList',
        meta: { title: 'usercapitalList', icon: 'withdrawalIcon', noCache: true, roles: ['admin'] }
      },
      {
        menuId: 10004004,
        hidden: true,
        path: '/user/userShareList', // 用户分享
        component: () => import('@/views/user/userShareTable'),
        name: 'UserShareList',
        meta: { title: 'userShareList', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    menuId: 10005000,
    path: '/comment', // 评论管理
    component: Layout,
    redirect: '/comment/proCommentList',
    name: 'Comment',
    meta: {
      title: 'commentRoot',
      icon: 'peoples',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10005001,
        path: '/comment/proCommentList', // 评论列表
        component: () => import('@/views/proComment/proCommentTable'),
        name: 'ProCommentTable',
        meta: { title: 'commentList', icon: 'commentList', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10006000,
    path: '/accounting', // 提现管理
    component: Layout,
    redirect: '/accounting/withdrawalList',
    name: 'accounting',
    meta: {
      title: 'accounting',
      icon: 'money',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10006001,
        path: '/accounting/withdrawalList',
        component: () => import('@/views/accounting/withdrawalListTable'),
        name: 'WithdrawalListTable',
        meta: { title: 'withdrawalList', icon: 'withdrawalIcon', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10006002,
        path: '/accounting/withdrawalAudit',
        component: () => import('@/views/accounting/withdrawalAuditTable'),
        name: 'WithdrawalAuditTable',
        meta: { title: 'withdrawalAudit', icon: 'auditIcon', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10012000,
    path: '/analysis', // 统计分析
    component: Layout,
    redirect: '/analysis/userAnalysis',
    name: 'analysis',
    meta: {
      title: 'analysis',
      icon: 'analysis',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10012001,
        path: '/analysis/userAnalysis', // 用户统计
        component: () => import('@/views/analysis/userAnalysis.vue'),
        name: 'userAnalysis',
        meta: { title: 'userAnalysis', icon: 'userAnalysis', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10012001,
        path: '/analysis/productAnalysis', // 产品统计
        component: () => import('@/views/analysis/productAnalysis.vue'),
        name: 'productAnalysis',
        meta: { title: 'productAnalysis', icon: 'productAnalysis', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10013000,
    path: '/settlement', // 结算
    component: Layout,
    redirect: '/settlement/creatorAccount',
    name: 'settlement',
    meta: {
      title: 'settlement',
      icon: 'finalAccount',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10013001,
        path: '/settlement/creatorAccount', // 创作者结算
        component: () => import('@/views/settlement/creatorAccount.vue'),
        name: 'creatorAccount',
        meta: { title: 'creatorAccount', icon: 'creatorAccount', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10013001,
        path: '/settlement/areaAgentAccount', // 区域代理结算
        component: () => import('@/views/settlement/areaAgentAccount.vue'),
        name: 'areaAgentAccount',
        meta: { title: 'areaAgentAccount', icon: 'areaAgentAccount', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10007000,
    path: '/promote', // 推广中心
    component: Layout,
    redirect: '/promote/promoteConfig',
    name: 'promotes',
    meta: {
      title: 'promotes',
      icon: 'promotes',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10007001,
        path: '/promote/promoteConfig', // 推广设置
        component: () => import('@/views/systeminfo/promote'),
        name: 'PromoteConfig',
        meta: { title: 'promoteConfig', icon: 'promoteConfig', noCache: true, roles: ['admin'] }
      },
      // {
      //   menuId: 10007002,
      //   path: '/promote/commission', // 佣金设置
      //   component: () => import('@/views/systeminfo/commission'),
      //   name: 'Commission',
      //   meta: { title: 'commission', icon: 'commission', noCache: true, roles: ['admin'] }
      // },
      {
        menuId: 10007003,
        path: '/promote/withdrawal', // 提现设置
        component: () => import('@/views/systeminfo/withdrawal'),
        name: 'Withdrawal',
        meta: { title: 'withdrawal', icon: 'withdrawal', noCache: true, roles: ['admin'] }
      },
      {
        menuId: 10007004,
        path: '/promote/promoteTutorial', // 使用教程
        component: () => import('@/views/systeminfo/promoteTutorial'),
        name: 'PromoteTutorial',
        meta: { title: 'promoteTutorial', icon: 'promoteTutorial', noCache: true, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10008000,
    path: '/systeminfo', // 系统管理
    component: Layout,
    redirect: '/systeminfo/systeminfoToParam',
    name: 'systeminfos',
    meta: {
      title: 'systeminfos',
      icon: 'systemIcon',
      roles: ['admin', 'client']
    },
    children: [
      {
        menuId: 10008001,
        path: '/systeminfo/systeminfoToParam', // 参数设置
        component: () => import('@/views/systeminfo/systeminfoToParamTable'),
        name: 'SysteminfoToParamTable',
        meta: { title: 'systeminfoToParam', icon: 'paramIcon', noCache: true, roles: ['admin'] }
      },
      {
        menuId: 10008002,
        path: '/systeminfo/bannerList', // 广告设置
        component: () => import('@/views/systeminfo/bannerTable'),
        name: 'BannerTable',
        meta: { title: 'bannerList', icon: 'bannerIcon', noCache: true, roles: ['admin'] }
      },
      {
        menuId: 10008003,
        path: '/systeminfo/adminmanage', // 管理员
        component: () => import('@/views/admin/adminTable'),
        name: 'AdminTable',
        meta: { title: 'adminmanage', icon: 'peoples', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10008004,
        path: '/systeminfo/role', // 角色权限
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: { title: 'rolePermission', icon: 'rolePermission', noCache: true, roles: ['admin'] }
      },
      {
        menuId: 10008005,
        path: '/systeminfo/shareConfigList', // 分享配置
        component: () => import('@/views/systeminfo/shareConfigTable'),
        name: 'ShareConfigTable',
        meta: { title: 'shareConfigList', icon: 'shareConfigList', noCache: true, roles: ['admin'] }
      },
      {
        menuId: 10008006,
        path: '/systeminfo/poster', // 海报设置
        component: () => import('@/views/systeminfo/posterTable'),
        name: 'PosterTable',
        meta: { title: 'posterList', icon: 'postersIcon', noCache: true, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10009000,
    path: '/affiliate', // 合作招募
    component: Layout,
    redirect: '/affiliate/affiliateList',
    name: 'affiliates',
    meta: {
      title: 'affiliates',
      icon: 'affiliates',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10009001,
        path: '/affiliate/affiliateList', // 合作招募
        component: () => import('@/views/affiliate/affiliateTable.vue'),
        name: 'AffiliateTable',
        meta: { title: 'affiliateList', icon: 'affiliateList', noCache: false, roles: ['admin'] }
      },
      {
        menuId: 10009002,
        path: '/affiliate/affiliateSetting', // 招募设置
        component: () => import('@/views/systeminfo/affiliateSetting.vue'),
        name: 'AffiliateSetting',
        meta: { title: 'affiliateSetting', icon: 'affiliateSetting', noCache: true, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10010000,
    path: '/advice', // 意见反馈
    component: Layout,
    redirect: '/advice/adviceList',
    name: 'advices',
    meta: {
      title: 'advices',
      icon: 'advices',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10010001,
        path: '/advice/adviceList', // 意见反馈
        component: () => import('@/views/advice/adviceTable.vue'),
        name: 'AdviceTable',
        meta: { title: 'adviceList', icon: 'advices', noCache: false, roles: ['admin'] }
      }
    ]
  },
  {
    menuId: 10011000,
    path: '/notify', // 订阅通知
    component: Layout,
    redirect: '/notify/notifyList',
    name: 'notifys',
    hidden: true,
    meta: {
      title: 'notifys',
      icon: 'notifys',
      roles: ['admin']
    },
    children: [
      {
        menuId: 10011001,
        path: '/notify/notifyList', // 订阅列表
        component: () => import('@/views/notify/notifyTable.vue'),
        name: 'NotifyTable',
        hidden: true,
        meta: { title: 'notifyList', icon: 'notifys', noCache: false, roles: ['admin'] }
      }
    ]
  }
]

export default customRouter

export function getcustomRouters() {
  return customRouter
}
