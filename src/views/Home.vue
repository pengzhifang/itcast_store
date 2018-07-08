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
          <a href="#">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

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
}
.main {
  background-color: #e9eef3;
}
</style>
