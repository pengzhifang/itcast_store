<template>
  <div style="height: 100%">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表" class="bread"></my-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :space="200" :active="0" finish-status="success" align-center style="margin-bottom: 30px;">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- Tab标签页 -->
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form
        :model="goodsForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top">
          <el-form-item label="商品名称">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            
          </el-form-item>
          <el-button type="primary">立即创建</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      }
    };
  }
};
</script>

<style>
.bread {
  margin-bottom: 30px;
}
</style>
