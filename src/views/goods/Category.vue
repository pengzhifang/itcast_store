<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-row class="btn">
      <el-col :span="24">
        <el-button type="success" plain @click="handleAdd">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      border
      :data="list"
      style="width: 100%">
      <el-tree-grid
      prop="cat_name"
      label="分类名称"
      treeKey="cat_id"
      parentKey="cat_pid"
      levelKey="cat_level"
      childKey="children"
      :indentSize="30">
      </el-tree-grid>
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-table-column
        label="级别"
        width="300">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
           {{ scope.row.cat_deleted ? '无效': '有效'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="handelete(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="handleclose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="levelData"
            change-on-select
            expand-trigger="hover"
            clearable
            placeholder="默认添加一级分类"
            v-model="selectedOptions"
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children'
            }">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类弹出框 -->
    <el-dialog
      title="编辑商品分类"
      :visible.sync="editDialogVisible"
      width="30%"
      @closed="handleclose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入element-tree-grid组件
import ElTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      currentCatId: -1,
      form: {
        cat_name: ''
      },
      levelData: [],
      selectedOptions: []
    };
  },
  props: this.levelData,
  // 注册组件
  components: {
    ElTreeGrid
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.loadData();
    },
    async loadData() {
      const res = await this.$http.get(`categories?type=3&pagesize=${this.pagesize}&pagenum=${this.pagenum}`);
      // console.log(res);
      const { data: {result, total} } = res.data;
      this.list = result;
      this.total = total;
    },
    // 添加分类
    async handleAdd() {
      this.dialogVisible = true;
      const res = await this.$http('categories?type=2');
      // console.log(res);
      const {data} = res.data;
      this.levelData = data;
    },
    // 点击确定添加事件
    async sureAdd() {
      this.dialogVisible = false;
      // 如果没有选择父级分类,则默认添加一级分类
      let catPid = 0;
      if (this.selectedOptions[0]) {
        catPid = this.selectedOptions[this.selectedOptions.length - 1];
      }
      const formData = {
        ...this.form,
        cat_pid: catPid,
        cat_level: this.selectedOptions.length
      };
      const res = await this.$http.post('categories', formData);
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 201) {
        this.loadData();
        this.$message.success(msg);
        // 清空父级分类选中项
        this.selectedOptions = [];
      } else {
        this.$message.error(msg);
      }
    },
    // 编辑分类
    async handleEdit(category) {
      this.currentCatId = category.cat_id;
      this.editDialogVisible = true;
      // console.log(category);
      this.form.cat_name = category.cat_name;
    },
    // 编辑提交事件
    async sureEdit() {
      this.editDialogVisible = false;
      const res = await this.$http.put(`categories/${this.currentCatId}`, this.form);
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 200) {
        this.loadData();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除分类事件
    async handelete(catId) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`categories/${catId}`);
        const {meta: {status}} = res.data;
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
    // 关闭弹出框事件
    async handleclose() {
      for (let key in this.form) {
        this.form[key] = '';
      }
    }
  }
};
</script>

<style>
.btn {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
