<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <!-- 搜索框和添加按钮 -->
    <el-row>
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="searchInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button plain type="success" @click="$router.push({name: 'add-goods'})">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      style="width: 100%">
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="150">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="150">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
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
    };
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
      const res = await this.$http({
        url: 'goods',
        method: 'get',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.list = res.data.data.goods;
      this.total = res.data.data.total;
    }
  }
};
</script>

<style>
.searchInput {
  width: 350px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
