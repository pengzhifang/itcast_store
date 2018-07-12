<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-row class="btn">
      <el-col :span="24">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
    border
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column>
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
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    }
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
