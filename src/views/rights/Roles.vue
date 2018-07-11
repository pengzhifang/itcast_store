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
              <el-tag closable @close="handleClose(scope.row, item1.id)">{{ item1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
               <!-- 二级权限 -->
              <el-row
              v-for="item2 in item1.children"
              :key="item2.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="handleClose(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                </el-col>
                 <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    type="warning"
                    class="level3"
                    @close="handleClose(scope.row, item3.id)">
                    {{ item3.authName }}
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
          <el-button plain size="mini" type="warning" icon="el-icon-check" @click="handleShowRoles"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权弹出框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="dialogVisible"
      width="30%">
      <!-- 树形控件 -->
      <el-tree
        :data="treeData"
        show-checkbox
        :default-checked-keys="[5]"
        default-expand-all
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      dialogVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
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
    async handleClose(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const {meta: {msg, status}, data} = res.data;
      if (status === 200) {
        this.$message.success(msg);
        role.children = data;
      } else {
        this.$message.error(msg);
      }
    },
    async handleShowRoles() {
      this.dialogVisible = true;
      const res = await this.$http.get('rights/tree');
      const {meta: {msg, status}, data} = res.data;
      if (status === 200) {
        this.treeData = data;
      } else {
        this.$message.error(msg);
      }
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
