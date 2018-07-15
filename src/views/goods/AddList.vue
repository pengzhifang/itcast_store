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
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="fileList2"
          :headers="headers"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-row>
          <el-col :span="24">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <!-- 富文本编辑器-->
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
        goods_introduce: '',
        pics: []
      },
      activeName: '0',
      stepActive: 0,
      fileList2: [],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    };
  },
  components: {
    CategoryCascader,
    quillEditor
  },
  methods: {
    // 添加商品事件
    async handleAdd() {
      const res = await this.$http({
        url: '/goods',
        method: 'post',
        data: this.goodsForm
      });
      // console.log(res);
      const {meta: {msg, status}} = res.data;
      if (status === 201) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
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
    },
    // 移除图片的函数
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // console.log(file.response.data.tmp_path);
      const index = this.goodsForm.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      // console.log(index);
      if (index !== -1) {
        this.goodsForm.pics.splice(index, 1);
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    // 上传成功的函数
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      this.goodsForm.pics.push({
        pic: response.data.tmp_path
      });
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
