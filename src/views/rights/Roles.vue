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
      v-loading="loading"
      border
      :data="list"
      style="width: 100%">
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
          v-for="item1 in scope.row.children"
          :key="item1.id"
          class="level1">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag closable>{{ item1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
               <!-- 二级权限 -->
              <el-row
              v-for="item2 in item1.children"
              :key="item2.id">
                <el-col :span="4">
                  <el-tag closable type="success">{{ item2.authName }}</el-tag>
                </el-col>
                 <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    type="warning"
                    class="level3">
                    {{ item2.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 未分配角色 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              未分配角色
            </el-col>
          </el-row>
        </template>
      </el-table-column>
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
      list: [],
      loading: true
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const res = await this.$http.get('roles');
      this.loading = false;
      const {meta: {msg, status}, data} = res.data;
      if (status === 200) {
        this.list = data;
      } else {
        this.$message(msg);
      }
    },
    // 移除标签事件
    handleClose() {
      // alert(1);
    }
  }
};
</script>

<style>
.btn {
  margin: 15px 0;
}
.level1 {
  margin-bottom: 10px;
}
.level3 {
  margin: 0 5px 5px 0;
}
</style>
