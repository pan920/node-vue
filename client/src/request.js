import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router'

let loading;
function startLoading() {
  loading  = Loading.service(
      {
          lock: true,
          text: '拼命加载中...',
          background: 'rgba(0,0,0,0,7)'  
      }
  );
}

function endLoading() {
    loading.close();
}
// 请求拦截
axios.interceptors.request.use(config => {
    // 加载动画
    startLoading();
    // 设置统一得请求头
    config.headers.Authorization = localStorage.pantoken
    return config;
},error => {
    return Promise.reject(error)
}
)



// 响应拦截
axios.interceptors.response.use(response => {
    // 结束加载动画
    endLoading();
    return response;
    },error => {
        // 错误提醒
        endLoading();
        Message.error(error.response.data);

        // 获取错误状态吗
        const { status } = error.response;
        if(status == 401) {
            Message.error('token失效，请重新登陆！');
            // 清楚toekn
            localStorage.removeItem('pantoken')
            //  跳转登陆页
            router.push('/login')
        }

        return Promise.reject(error);
    }
)

export default axios;