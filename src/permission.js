import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'// 从cookie中获取令牌
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress 配置

const whiteList = ['/login']// 无重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // 启动进度条
  if (getToken()) { // 确定if there has令牌
    /* has token*/
    if (to.path === '/login') {
      //next()
      next({ path: '/' })
      NProgress.done() // 如果当前页面是仪表板，则不会在每个钩子之后触发，因此手动处理它。
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          console.log(res.data.roles)
          const roles = res.data.roles // 注意：角色必须是数组！如：[编辑]，“发展”
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,设置替换：true:导航不会留下历史记录
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '验证失败，请再次登录')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
      //next()


    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }


  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
