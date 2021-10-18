import {getMenuList} from "@/api/login";

export default {
    state: {
        //当前选中的选项卡
        editableTabsValue: 'DeskTop',
        // 选项卡的数据域
        editableTabs: [
            //默认首页
            {
                title: '首页',
                name: 'DeskTop'
            }
        ],

        //按钮全局折叠 菜单伸缩控制
        isCollapsed: false,


        // 菜单数据
        menuList: [],

        // 路由数据
        routerList: [],
    },
    mutations: {

        //获取sessionStorage的tabs
        getTabs(state) {
            let tabs = sessionStorage.getItem('tableList')
            if (tabs) {
                state.editableTabs = JSON.parse(tabs)
            }
        },

        //设置当前激活的选项卡
        setActiveTabs(state, val) {
            state.editableTabsValue = val
        },

        //全局折叠方法
        setOpenOrClose(state) {
            state.isCollapse = !state.isCollapse;
        },

        //菜单选项卡
        clickMenu(state, val) {
            // console.log(val)
            //1.当前点中菜单是否在tabs里面
            let res = state.editableTabs.findIndex(item => item.name === val.name)
            //2.如果不存在，组织tabs数据，存放到editableTabs
            if (res === -1) {
                let tab = {};
                tab.title = val.label;
                tab.name = val.name;
                state.editableTabs.push(tab)
            }
            //3.设置当前选中卡
            state.editableTabsValue = val.name;
            //4.把选中的放入sessionStore里面
            sessionStorage.setItem('tableList', JSON.stringify(state.editableTabs))
        },

        //设置菜单数据
        setMenuList(state, list) {
            state.menuList = list
        },

        //设置菜单数据
        setRouterList(state, list) {
            state.routerList = list
        },
        //生成动态路由
        // dynamicRouter(state, router) {
        //     console.log(state)
        //     console.log(1)
        //     console.log(router)
        //     //获取原来的路由
        //     let oldRouter = router.options.routes;
        //     //获取后台生成的路由
        //     let routerList = state.routerList;
        //     routerList.forEach(item =>{
        //         //html 页面需要IFrame展示
        //         if (/^.+\.html$/ig.test(item.url)) {
        //             item.component = resolve => require([`@/views/IFrame/IFrame.vue`,resolve])
        //         }else {
        //             item.component = resolve => require([`@/components${item.url}.vue`],resolve)
        //         }
        //         oldRouter[1].children.push(item);
        //     })
        //     router.addRoute(oldRouter)
        // }
    },
    actions: {
        async getMenuList({commit}, router) {
            console.log(router)
            let res = await getMenuList()
            //菜单数据
            let menuList = res.data.data.menuList
            // 路由数据
            let routerList = res.data.data.routerList
            //权限字段
            sessionStorage.setItem('codeList',JSON.stringify(res.data.data.authList))
            //把获取到的菜单路由数据，存放到vuex里面
            commit('setMenuList', menuList)
            commit('setRouterList', routerList)
            // //生成动态路由
            // commit('dynamicRouter', router)

        }
    },
}