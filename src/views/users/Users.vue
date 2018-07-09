<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input class="searchInput" clearable placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="formdataVisible = true">添加用户</el-button>
        <!-- 点击添加的弹出层 -->
        <el-dialog
          title="添加用户"
          :visible.sync="formdataVisible">
          <el-form :model="form" label-width="120px" label-position="right">
            <el-form-item label="用户名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="formdataVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <el-table
      stripe
      border
      v-loading="isLoading"
      :data="list"
      style="width: 100%">
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="130">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleState(scope.row.id, scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
      label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
          <!-- 点击修改用户弹出层 -->
          <el-dialog
          title="修改用户"
          :visible.sync="editdataVisible">
          <el-form :model="form" label-width="120px" label-position="right">
            <el-form-item label="用户名">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editdataVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureEdit(scope.row.id)">确 定</el-button>
          </span>
        </el-dialog>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
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
      isLoading: true,
      formdataVisible: false,
      editdataVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
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
      const res = await this.$http.get('users?pagenum=1&pagesize=10');
      // console.log(res);
      this.isLoading = false;
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 200) {
        const {data: {users}} = data;
        if (status === 200) {
          this.list = users;
        } else {
          this.$message.error(msg);
        }
      }
    },
    async handleAdd () {
      this.formdataVisible = false;
      // console.log(this.form);
      const res = await this.$http.post('users', this.form);
      // console.log(res);
      const {meta: {status, msg}} = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.loadData();
        this.form = {};
      }
    },
    handleDelete(id) {
      // console.log(id);
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .delete(`users/${id}`)
          .then((res) => {
            console.log(res);
            const {meta: {msg, status}} = res.data;
            if (status === 200) {
              this.$message({
                type: 'success',
                message: msg
              });
              this.loadData();
            }
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async handleState(id, state) {
      const res = await this.$http.put(`users/${id}/state/${state}`, {uId: id, type: state});
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async handleEdit(id) {
      this.editdataVisible = true;
      const res = await this.$http.get(`users/${id}`);
      // console.log(res);
      const {meta: {status}, data} = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    async sureEdit(id) {
      this.editdataVisible = false;
      const res = await this.$http.put(`users/${id}`, this.form);
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.searchArea {
  margin: 15px 0;
}
.searchArea .searchInput{
  width: 350px;
}
</style>
