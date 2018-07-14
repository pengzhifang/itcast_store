<template>
  <el-cascader
    :options="levelData"
    change-on-select
    expand-trigger="hover"
    clearable
    v-model="selectedOptions"
    :props="{
      label: 'cat_name',
      value: 'cat_id',
      children: 'children'
    }"
    @change="handleChange">
  </el-cascader>
</template>

<script>
export default {
  data() {
    return {
      levelData: [],
      selectedOptions: []
    };
  },
  props: {
    type: {
      type: [String, Number],
      default: 2
    }
  },
  async created() {
    this.dialogVisible = true;
    const res = await this.$http({
      url: 'categories',
      method: 'get',
      params: {
        type: this.type
      }
    });
    // console.log(res);
    const {data} = res.data;
    this.levelData = data;
  },
  methods: {
    handleChange() {
      this.$emit('gaibianle', this.selectedOptions);
    }
  }
};
</script>

<style>

</style>
