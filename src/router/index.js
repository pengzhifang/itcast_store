import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Users from '../views/users/Users.vue';
import Rights from '../views/rights/Rights.vue';
import Roles from '../views/rights/Roles.vue';

Vue.use(Router);

export default new Router({
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
        {name: 'roles', path: '/roles', component: Roles}
      ]
    }
  ]
});
