import axios from 'axios';
import { ElMessage } from 'element-plus';

axios.defaults.timeout = 1000 * 60; //设置接口超时时间
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded; charset=UTF-8';
axios.interceptors.request.use(
  (config) => {
    // // 暂时写死token
    // // eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6Imx4a2oiLCJpYXQiOjE1NjYzNTU5NTQsImp0aSI6IjY2NjY2NiJ9.5MaKCpzwnwojjUJPowXjaMrz4apl3AOAW4oK0LD7vqo
    const TOKEN =
      'eyJ0eXAiOiJqd3QiLCJjbGFnIjoiSFM1MTIiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiIxNzIuMjIuMS4xNCIsImlhdCI6MTc0NTI4NzE0OSwic3ViIjoiRTI1NkM4QTQ3RTMxOEI2RTYxNUU4QkI4MEM0OEMyQzIxMDhFNjIzNzZCM0E3QzUxM0MyNTMxRkYxNTYxQTcwMEU5MkI3MTE1MkM1OTdEQTE5N0ZGRkYyQzk0NERCMUREIiwianRpIjoiNDNmYmFlNzg2MzJmNGRmOTllMjI0YTlmNjYxZTdjNDUifQ.M5KN9XHm2YbMnd5NPozlr05dtpspyNE5Gfj8jOh29PgYBbk-fqw3UOSzzBjJScspVDtTWv5u4I_enBfc0dtL-A';
    if (TOKEN) {
      config.headers['TA-JTOKE'] = TOKEN;
      // config.headers['Content-Type'] =
      //   'application/x-www-form-urlencoded; charset=UTF-8';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    /* let {
            data,
            config
        } = response;
        if (response.status === 200 && response.data.code == 2) {
            window.location.href = `${server_path}/#/login`;
            window.sessionStorage.clear();
            ElMessage.error('登录超时了,请重新登录');
        } */
    return response;
  },
  (error) => {
    //断网处理或者请求超时
    console.log(error, '接口调用失败');
    if (!error.response) {
      //请求超时
      if (error.ElMessage.includes('timeout')) {
        ElMessage.error('请求超时了,请稍后重试');
      } else {
        //断网，可以展示断网组件
        ElMessage.error('请检查网络连接是否正常');
      }
      return;
    }
    const status = error.response.status;
    switch (status) {
      case 500:
        ElMessage.error('服务器内部错误');
        break;
      case 404:
        ElMessage.error('未找到远程服务器');
        break;
      case 400:
        ElMessage.error('数据异常');
        break;
      default:
        ElMessage.error(error.response.data.ElMessage);
    }
    return Promise.reject(error);
  }
);

export default axios;

// 封装动态url
let _hostname;
let _protocol;
let _port;
let _hostname_sess = window.localStorage.getItem('_host');
let _protocol_sess = window.localStorage.getItem('_protocol');
let _port_sess = window.localStorage.getItem('_port');
let url1: string = '';
let modelUrl: string = '';
if (process.env.NODE_ENV == 'development') {
  // 开发环境
  /* const HOST_NAME = [
        '172.17.11.59',
    ];
    const PORT = [
        8861,
        1111
    ];
    _hostname = '172.17.11.59';
    _protocol = 'https:';
    _port = 8861; */
  url1 = '/local/';
  // modelUrl = 'http://23.210.52.80:18081/cockpit/api';
  modelUrl = 'http://localhost:8080/cockpit1';
} else if (process.env.NODE_ENV == 'production') {
  const { hostname, protocol, port } = window.location;
  // 生产环境
  _hostname = _hostname_sess ? _hostname_sess : hostname;
  _protocol = _protocol_sess ? _protocol_sess : protocol;
  _port = _port_sess ? _port_sess : port;
  url1 = `${_protocol}//${_hostname}:${_port}/`;
  modelUrl = `${_protocol}//${_hostname}:${_port}/`;
}

console.log('设置之后的ip地址是', url1);

export { url1, modelUrl };
