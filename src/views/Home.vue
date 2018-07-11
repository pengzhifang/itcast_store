<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="/static/logo.png" alt="">
        </el-col>
        <el-col :span="18">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2">
          <a href="#" @click.prevent="handleLogout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu
          unique-opened
          router
          class="el-menu-vertical-demo">
          <el-submenu
          :index="item1.id + ''"
          v-for="item1 in menus"
          :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item
            :index="'/' + item2.path"
            v-for="item2 in item1.children"
            :key="item2.id">
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
  // beforeCreate() {
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     this.$router.push({name: 'login'});
  //     this.$message.warning('请先登录!');
  //   }
  // },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$http.get('menus');
      console.log(res);
      const {meta: {msg, status}, data} = res.data;
      if (status === 200) {
        this.menus = data;
      } else {
        this.$message.error(msg);
      }
    },
    handleLogout() {
      sessionStorage.clear();
      this.$router.push({name: 'login'});
      this.$message.success('退出成功');
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
  height: 60px;
  line-height: 60px;
  padding-left: 0;
}
.header h2 {
  text-align: center;
  color: #fff;
}
.header a {
  text-decoration: none;
  color: orangered;
}
.aside {
  background-color: #d3dce6;
  height: 100%;
}
.main {
  background-color: #e9eef3;
}
</style>
