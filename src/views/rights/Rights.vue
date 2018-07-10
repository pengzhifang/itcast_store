<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :data="list"
      style="width: 932px"
      class="tb">
      <el-table-column
        type="index"
        width="180">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="250">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级"
        width="250">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // 发送请求之前，获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get('rights/list');
      // console.log(res);
      const {meta: {status}, data} = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.tb {
  margin-top: 15px;
}
</style>
