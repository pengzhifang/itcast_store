export default {
  data() {
    return {
      list: [],
      searchValue: '',
      isLoading: true,
      formdataVisible: false,
      editdataVisible: false,
      setRolesVisible: false,
      // 表单所需数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 当前页
      pagenum: 1,
      // 每页多少条数据
      pagesize: 4,
      // 总条数
      total: 0,
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 分配角色所需数据
      currentUsername: '',
      currentUserId: -1,
      currentRoleId: -1,
      roles: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 加载用户列表
    async loadData() {
      // 发送请求之前，获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      // console.log(res);
      this.isLoading = false;
      const data = res.data;
      const {meta: {msg, status}} = data;
      if (status === 200) {
        const {data: {users, total}} = data;
        if (status === 200) {
          this.list = users;
          this.total = total;
        } else {
          this.$message.error(msg);
        }
      }
    },
    // 搜索用户
    handleSearch() {
      this.loadData();
    },
    // 添加用户
    async handleAdd () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入完整数据');
        } else {
          this.formdataVisible = false;
          // console.log(this.form);
          const res = await this.$http.post('users', this.form);
          // console.log(res);
          const {meta: {status, msg}} = res.data;
          if (status === 201) {
            this.$message.success(msg);
            this.loadData();
            // 清空文本框
            // this.form = {};
            // for (let key in this.form) {
            //   this.form[key] = '';
            // }
          }
        }
      });
    },
    // 删除用户
    async handleDelete(id) {
      // console.log(id);
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${id}`);
        const {meta: {msg, status}} = res.data;
        if (status === 200) {
          this.$message({
            type: 'success',
            message: msg
          });
          this.pagenum = 1;
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 修改用户状态
    async handleState(id, state) {
      const res = await this.$http.put(`users/${id}/state/${state}`);
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 点击编辑按钮
    async handleEdit(user) {
      this.editdataVisible = true;
      // const res = await this.$http.get(`users/${id}`);
      // // console.log(res);
      // const {meta: {status}, data} = res.data;
      // if (status === 200) {
      //   this.form = data;
      // }
      // 直接利用scope.row中的数据显示
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
    },
    // 确定编辑
    async sureEdit(id) {
      this.editdataVisible = false;
      const res = await this.$http.put(`users/${id}`, this.form);
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.loadData();
        this.$message.success(msg);
        for (let key in this.form) {
          this.form[key] = '';
        }
      } else {
        this.$message.error(msg);
      }
    },
    // 关闭弹出框
    handleClosed() {
      // 清空文本框
      for (let key in this.form) {
        this.form[key] = '';
      }
    },
    // 显示分配角色弹出框
    async handleShowRoles(user) {
      this.currentUserId = user.id;
      this.setRolesVisible = true;
      this.currentUsername = user.username;
      const res = await this.$http.get('roles');
      // console.log(res);
      const {data} = res.data;
      this.roles = data;
      // 获取角色id 通过rid设置当前用户的角色
      const res1 = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = res1.data.data.rid;
      // console.log(this.currentRoleId);
    },
    // 点击确定分配用户角色
    async handleSetRoles() {
      this.setRolesVisible = false;
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.currentUsername = '';
        this.currentUserId = -1;
        this.currentRoleId = -1;
      } else {
        this.$message.error(msg);
      }
    }
  }
};