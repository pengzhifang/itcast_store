import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Users from '../views/users/Users.vue';
import Rights from '../views/rights/Rights.vue';
import Roles from '../views/rights/Roles.vue';
import Category from '../views/goods/Category.vue';
import List from '../views/goods/List.vue';
import AddList from '../views/goods/AddList.vue';
import { Message } from 'element-ui';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {name: 'users', path: '/users', component: Users},
        {name: 'rights', path: '/rights', component: Rights},
        {name: 'roles', path: '/roles', component: Roles},
        {name: 'category', path: '/categories', component: Category},
        {name: 'list', path: '/goods', component: List},
        {name: 'add-goods', path: '/goods/add', component: AddList}
      ]
    }
  ]
});

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  // 判断当前路由是否是login,如果是,直接next()
  if (to.name === 'login') {
    next();
  } else {
    // 如果不是login则判断是否有token
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push({name: 'login'});
      Message.warning('请先登录');
      // return;
    } else {
      next();
    }
  }
});

export default router;
