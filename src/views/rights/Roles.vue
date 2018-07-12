<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 添加角色 -->
    <el-row>
      <el-col :span="24">
        <el-button class="btn" @click="addRolesVisible = true">添加角色</el-button>
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
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
          <el-button plain size="mini" type="warning" icon="el-icon-check" @click="handleShowRights(scope.row)"></el-button>
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
        node-key="id"
        ref="tree"
        :default-checked-keys="checkedlist"
        default-expand-all
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色弹出框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      width="30%"
      @closed="handleCloseDialog">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹出框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesVisible"
      width="30%"
      @closed="handleCloseDialog">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
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
      addRolesVisible: false,
      editRolesVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkedlist: [],
      currentRoleId: -1,
      // 添加角色所需数据
      form: {
        roleName: '',
        roleDesc: ''
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
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
    // 显示分配角色权限的事件
    async handleShowRights(role) {
      this.currentRoleId = role.id;
      this.dialogVisible = true;
      const res = await this.$http.get('rights/tree');
      const {meta: {msg, status}, data} = res.data;
      if (status === 200) {
        this.treeData = data;
      } else {
        this.$message.error(msg);
      }
      const array = [];
      // 遍历一级权限
      role.children.forEach((item1) => {
        // array.push(item1.id);
        // 遍历二级权限
        item1.children.forEach((item2) => {
          // array.push(item2.id);
          // 遍历三级权限
          item2.children.forEach((item3) => {
            // 只需要将三级权限的id存在checkedlist中,树形控件会自动选中对应的二级和一级权限
            array.push(item3.id);
          });
        });
      });
      this.checkedlist = array;
    },
    // 点击确定按钮分配角色事件
    async handleSetRights() {
      this.dialogVisible = false;
      // 获取当前被选中的节点的id
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      // 获取当前半选节点的id
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      // console.log(checkedKeys, halfCheckedKeys);
      const newArray = [...checkedKeys, ...halfCheckedKeys];
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: newArray.join(',')
      });
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 添加角色事件
    async handleAdd() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入完整数据');
        } else {
          this.addRolesVisible = false;
          const res = await this.$http.post('roles', this.form);
          const {meta: {msg, status}} = res.data;
          if (status === 201) {
            this.$message.success(msg);
            this.loadData();
          } else {
            this.$message.error(msg);
          }
        }
      });
    },
    // 关闭弹出框事件-清空输入框
    handleCloseDialog() {
      for (let key in this.form) {
        this.form[key] = '';
      }
    },
    // 删除角色
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`roles/${id}`);
        const {meta: {msg, status}} = res.data;
        if (status === 200) {
          this.loadData();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 编辑角色弹出框
    async handleEdit(id) {
      this.currentRoleId = id;
      this.editRolesVisible = true;
      const res = await this.$http(`roles/${id}`);
      const {data} = res.data;
      this.form = data;
    },
    // 确定编辑事件
    async sureEdit() {
      this.editRolesVisible = false;
      const res = await this.$http.put(`roles/${this.currentRoleId}`, this.form);
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.loadData();
        this.$message.success('编辑角色成功');
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
