import {createApp} from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from "vue-axios";
import router from "./router";
//引入store
import store from "./store/index.js";
// import {mixins} from "./mixins";


import {Plugin} from 'vue-responsive-video-background-player'
import VideoBackground from 'vue-responsive-video-background-player'


//解决菜单收缩是文字不能覆盖完整问题
// import Fragment from 'vue-fragment'
// Vue.use(Fragment.Plugin)
// 全局引入ElementPlus，当然也可以使用局部引入
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css"; //引入样式
import locale from "element-plus/lib/locale/lang/zh-cn";


//引入mock.js
// import ('./mock/index')

//引入阿里图标
import '../src/assets/icon/iconfont.css'
import '../src/assets/icon/iconfont'


//全局
// import Cookies from 'js-cookie';
import {getToken, removeToken, removeUserId} from "@/utils/auth";

//白名单配置
const whiteList = ['/login'];


// 选项卡 选择
router.beforeEach(async (to, from, next) => {
    console.log('进入全局守卫路由')
    console.log(to)
    console.log(from)
    console.log(next)
    // 从cookies里面获取token
    // 2.0 从工具类获取
    let token = getToken()
    if (token) {//token 存在
        if (to.path === "/login" || to.path === "/") {
            next({path: '/home'})
        } else {
            console.log(1)
            console.log(store.state)
            let menuList = store.state.MenuStore.menuList;
            if (menuList && menuList.length > 0) {
                next()
            } else {
                //从我们的服务器获取我们的权限数据
                //延时一下，防止报错
                try {
                    await store.dispatch("getMenuList", router)
                    next()
                } catch (error) {
                    //重置token
                    // Cookies.remove("token")
                    removeToken();
                    //重置用户id
                    removeUserId();
                    //跳到登录
                    next({path: "/login"})
                }
            }
        }
        //获取tabs
        store.commit('getTabs')
        //设置当前选择的tabs
        store.commit('setActiveTabs', to.name)
    } else {// token不存在
        //判断是否存在白名单中
        if (whiteList.indexOf(to.path) !== -1) {// 存在白名单中
            next()
        } else {// 不存在白名单，就重定向去登录
            next({path: '/login'})
        }
    }


    // next()
})

//全局挂载
const app = createApp(App);


//引入清空表单工具类
import resetForm from '../src/utils/resetForm'

app.config.globalProperties.$restForm = resetForm;

//快速复制对象中的数值
import objCoppy from "@/utils/objCoppy";

app.config.globalProperties.$objCoppy = objCoppy;

//信息提示
import MessageUtils from '../src/utils/MessageUtils'

app.config.globalProperties.$MessageUtils = MessageUtils;

//按钮权限判断
import hasPermisson from '@/pesmisson/index'

app.config.globalProperties.hasPerm = hasPermisson;


app.use(store)
    .use(router)
    .use(Plugin)
    .component('video-background', VideoBackground)
    // .mixin(mixins)
    .use(VueAxios, axios)
    .use(ElementPlus, {size: "small", zIndex: 3000, locale})
    .use(router)
    .mount("#app");
