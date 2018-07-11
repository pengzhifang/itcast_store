<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>

    <!-- 添加角色 -->
    <el-row>
      <el-col :span="24">
        <el-button class="btn">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
    border
      :data="list"
      style="width: 100%">
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="400">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button plain size="mini" type="warning" icon="el-icon-check"></el-button>
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
      const res = await this.$http.get('roles');
      const {meta: {msg, status}, data} = res.data;
      if (status === 200) {
        this.list = data;
      } else {
        this.$message(msg);
      }
    }
  }
};
</script>

<style>
.btn {
  margin: 15px 0;
}
</style>
