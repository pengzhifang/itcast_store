<template>
  <div style="height: 100%">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表" class="bread"></my-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :space="200" :active="stepActive" finish-status="success" align-center style="margin-bottom: 30px;">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- Tab标签页 -->
    <el-tabs
    tab-position="left"
    v-model="activeName"
    @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="0">
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
            <category-cascader
            type="3"
            @gaibianle="handleGaiBianLe">
            </category-cascader>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="24">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">
        商品参数
        <el-row>
          <el-col :span="24">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        商品属性
        <el-row>
          <el-col :span="24">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        商品图片
        <el-row>
          <el-col :span="24">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <!-- bidirectional data binding（双向数据绑定） -->
        <quill-editor v-model="goodsForm.goods_introduce"
          ref="myQuillEditor"
          class="Editor">
        </quill-editor>
        <el-button type="primary" @click="handleAdd">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CategoryCascader from '@/component/CategoryCascader';
// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
  data() {
    return {
      goodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: ''
      },
      activeName: '0',
      stepActive: 0
    };
  },
  components: {
    CategoryCascader,
    quillEditor
  },
  methods: {
    async handleAdd() {
      console.log(this.goodsForm);
      const res = await this.$http.post('goods', this.goodsForm);
      console.log(res);
    },
    handleGaiBianLe(data) {
      // console.log('改变了:' + data);
      this.goodsForm.goods_cat = data.join(',');
    },
    // 点击下一步
    handleNextStep() {
      this.activeName = parseInt(this.activeName) + 1 + '';
      this.stepActive++;
    },
    // 点击tab标签
    handleTabClick(tab, event) {
      // console.log('handleTabClick');
      this.stepActive = tab.index - 0;
    }
  }
};
</script>

<style>
.bread {
  margin-bottom: 30px;
}
.ql-editor {
  height: 300px;
}
</style>
