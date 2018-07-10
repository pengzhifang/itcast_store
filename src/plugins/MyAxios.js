import axios from 'axios';

const MyAxios = {};
MyAxios.install = function (Vue) {
  // axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // Vue.prototype.$http = axios;

  // 创建自定义的axios实例
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  });

  // Add a request interceptor(请求拦截器)
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log(config);
    if (config.url.toLocaleLowerCase !== 'login') {
      // 发送请求之前，获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor(响应拦截器)
  instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  Vue.prototype.$http = instance;
};

export default MyAxios;
