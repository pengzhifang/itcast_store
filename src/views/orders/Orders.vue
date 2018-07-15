<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="订单管理" level2="订单列表" class="bread"></my-breadcrumb>
    <!-- 地图容器 -->
    <el-button @click="handleMove">点击添加地图标注</el-button>
    <div id="mapContainer"></div>
    <!-- 省市区三级联动 -->
    <el-row class="test">
      <el-col :span="24">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          expand-trigger="hover">
        </el-cascader>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :data="list"
      style="width: 100%"
      class="tb">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格">
      </el-table-column>
      <el-table-column
        label="是否付款">
        <template slot-scope="scope">
          <el-button
            type="danger"
            plain
            size="mini"
            v-if="scope.row.order_pay === '1'">
            已付款
          </el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            v-else-if="scope.row.order_pay === '0'">
            未付款
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { regionData } from 'element-china-area-data';
const { BMap } = window;
export default {
  data() {
    return {
      list: [],
      options: regionData,
      selectedOptions: [],
      map: null
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    this.map = new BMap.Map('mapContainer');
    const point = new BMap.Point(116.404, 39.915);
    this.map.centerAndZoom(point, 15);
    this.map.enableScrollWheelZoom(true);
  },
  methods: {
    async loadData() {
      const res = await this.$http.get('orders?pagenum=1&pagesize=5');
      // console.log(res);
      this.list = res.data.data.goods;
    },
    handleMove() {
      const {map} = this;
      var point = new BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
    }
  }
};
</script>

<style>
.tb {
  margin-top: 20px;
}
.test {
  margin-top: 20px;
}
#mapContainer {
  width: 1500px;
  height: 300px;
}
</style>
