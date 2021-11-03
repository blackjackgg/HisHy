import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/Login.vue')
  },
  {
    path: '/Message',
    name: 'Message',
    component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/test/Message.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '',
        name: 'DeskTop',
        component: () => import(/* webpackChunkName: "about" */ '../views/DeskTop')
      },
      //  系统管理
      //  部门管理
      {
        path: '/department',
        name: 'department',
        component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/system/Department.vue')
      },
      // 用户管理
      {
        path: '/userList',
        name: 'userList',
        component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/system/UserList.vue')
      },
      // 角色管理
      {
        path: '/roleList',
        name: 'roleList',
        component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/system/RoleList.vue')
      },
      // 权限页面管理
      {
        path: '/menuList',
        name: 'menuList',
        component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/system/MenuList.vue')
      },
        //排班
      {
        path: '/paiBan',
        name: 'paiBan',
        component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/PanBan')
      },




      // 医生工作站-门诊处方
      {
        path: '/prescriptionManager',
        name: 'prescriptionManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/prescriptionManager')
      },
      // 医生工作站-住院医嘱
      {
        path: '/dowork',
        name: 'dowork',
        component: () => import(/* webpackChunkName: "about" */ '../components/TYH/zyyz')
      },
        // 护士工作站-住院医嘱执行
      {
        path: '/advice',
        name: 'advice',
        component: () => import(/* webpackChunkName: "about" */ '../components/TYH/hospitalExecuteManager')
      },
      // 护士工作站-门诊医嘱执行
      {
        path: '/opcExecuteManager',
        name: 'opcExecuteManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/opcExecuteManager')
      },
      // 护士工作站-床位管理
      {
        path: '/cwgl',
        name: 'cwgl',
        component: () => import(/* webpackChunkName: "about" */ '../components/TYH/cwgl')
      },
      {
        path: '/cwglx',
        name: 'cwglx',
        component: () => import(/* webpackChunkName: "about" */ '../components/TYH/cwglx')
      },
      // 门诊管理-挂号管理
      {
        path: '/registrationManager',
        name: 'registrationManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/registrationManager')
      },
      // 门诊管理-叫号管理
      {
        path: '/callNumberManager',
        name: 'callNumberManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/callNumberManager')
      },
      // 门诊管理-门诊收费
      {
        path: '/chargeManager',
        name: 'chargeManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/chargeManager')
      },
      // 门诊管理-诊疗卡管理
      {
        path: '/therapyManager',
        name: 'therapyManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/therapyManager')
      },
      // 手术管理-手术申请
      {
        path: '/surgeryForManager',
        name: 'surgeryForManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/surgeryForManager')
      },
      // 手术管理-手术安排
      {
        path: '/surgeryArrangeManager',
        name: 'surgeryArrangeManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/surgeryArrangeManager')
      },
      // 手术管理-手术治疗
      {
        path: '/operationManager',
        name: 'operationManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/operationManager')
      },
      // 手术管理-手术室管理
      {
        path: '/operationRoomManager',
        name: 'operationRoomManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/operationRoomManager')
      },
      // 手术管理-手术记录
      {
        path: '/operationNoteManager',
        name: 'operationNoteManager',
        component: () => import(/* webpackChunkName: "about" */ '../components/ZSX/operationNoteManager')
      },
      //住院-住院通知
      {
        path: '/zytz',
        name:'zytz',
        component:()=>import('../components/TYH/zytz.vue'),
      },
      {
        path: '/yzxq',
        name:'yzxq',
        component:()=>import('../components/TYH/yzxq.vue'),
      },
      {
        path: '/zydj',
        name:'zydj',
        component:()=>import('../components/TYH/zydj.vue'),
      },
      {
        path: '/yjsq',
        name:'yjsq',
        component:()=>import('../components/TYH/yjsq.vue'),
      },
      {
        path: '/cytz',
        name:'cytz',
        component:()=>import('../components/TYH/cytz.vue'),
      },
      {
        path: '/zyfyjz',
        name:'zyfyjz',
        component:()=>import('../components/TYH/zyfyjz.vue'),
      },
      {
        path: '/zyfyjzx',
        name:'zyfyjzx',
        component:()=>import('../components/TYH/zyfyjzx.vue'),
      },
      {
        path: '/yjtf',
        name:'yjtf',
        component:()=>import('../components/TYH/yjtf.vue'),
      },
      {
        path: '/cyjl',
        name:'cyjl',
        component:()=>import('../components/TYH/cyjl.vue'),
      },
      {
        path: '/zysd',
        name:'zysd',
        component:()=>import('../components/TYH/zysd.vue'),
      },


      //药房
      {
        path:'/recipe',
        name:'recipe',
        component:()=>import('../components/LYH/recipe.vue'),
      },
      {
        path: '/drugInfosC',
        name: 'drugInfosC',
        component:()=>import('../components/LYH/drugInfosC.vue')
      },{
        path: '/drugApplyC',
        name: 'drugApplyC',
        component:()=>import('../components/LYH/drugApplyC.vue')
      },
      {
        path:'/Xrecipe',
        name:'Xrecipe',
        component:()=>import('../components/LYH/Xrecipe.vue'),
      },
      {
        path: '/XdrugInfosC',
        name: 'XdrugInfosC',
        component:()=>import('../components/LYH/XdrugInfosc.vue')
      },{
        path: '/XdrugApplyC',
        name: 'XdrugApplyC',
        component:()=>import('../components/LYH/XdrugApplyC.vue')
      },
      {
        path: '/s',
        name: 'Test',
        component:()=>import('../components/LYH/Test.vue')
      },
      //药库
      {
        path: '/putlnStorage',
        name: 'putlnStorage'  ,
        component:()=>import('../components/LYH/putlnStorage.vue')
      },

      // {
      //   path: '/CheckDrugStorage',
      //   name: 'CheckDrugStorage',
      //     component:()=>import('src/components/LYH/CheckDrugStorage.vue')
      // },

      {
        path: '/CheckDrugStorage',
        name: 'CheckDrugStorage',
        component:()=>import('../components/LYH/CheckDrugStorage.vue')
      },

      {
        path: '/auditList',
        name: 'auditList',
        component:()=>import('../components/LYH/auditList.vue')
      },

      {
        path: '/diaobo',
        name: 'diaobo',
        component:()=>import('../components/LYH/diaobo.vue')
      },
      {
        path: '/drugCity',
        name: 'drugCity',
        component:()=>import('../components/LYH/drugCity.vue')
      },

      {
        path: '/supplier',
        name: 'supplier',
        component:()=>import('../components/LYH/supplier.vue')
      },


      {
        path: '/return',
        name:'return',
        component:()=>import('../components/LYH/return.vue')
      },
      {
        path: '/returnDetails',
        name: 'returnDetails',
        component:()=>import('../components/LYH/returnDetails.vue')
      },
      {
        path: '/returnDetails2',
        name: 'recipesDetails2',
        component:()=>import('../components/LYH/returnDetails2.vue')

      },
      {
        path: '/recipesDetails',
        name: 'recipesDetails',
        component:()=>import('../components/LYH/recipesDetails.vue')
      },

      {
        path: '/hsxq',
        name:'hsxq',
        component:()=>import('../components/TYH/hsxq.vue')
      },
      {
        path: '/Test2',
        name:'putlnTest',
        component:()=>import('../components/LYH/putlnTest.vue')
      },{
        path: '/Test3',
        name: 'DrugTest',
        component:()=>import('../components/LYH/DrugTest.vue')
      },
      {
        path: '/diaoboDetails',
        name: 'diaoboDetails',
        component:()=>import('../components/LYH/diaoboDetails.vue')
      },

      {
        path:'/diaoboWrite',
        name: 'diaoboWrite',
        component:()=>import('../components/LYH/diaoboWrite.vue')
      },

      {
        path: '/drug',
        name: 'drug',
        component:()=>import('../components/LYH/drug.vue')
      },
      {
        path: '/pan',
        name: 'pandian',
        component:()=>import('../components/LYH/pandian.vue')
      },
      {
        path: '/recipeDetails',
        name: 'recipeDetails',
        component:()=>import('../components/LYH/recipeDetails.vue')
      },
      // //  体检管理体检类别
      // {
      //   path: '/YxjCategory',
      //   name: 'YxjCategory',
      //   component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/health/YxjCategory.vue')
      // },
      // //  体检记录
      // {
      //   path: '/YxjPhysical',
      //   name: 'YxjPhysical',
      //   component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/health/YxjPhysical.vue')
      // },
    ],
  },
  {
    path: '/Dialog',
    name: 'Dialog',
    component: () => import(/* webpackChunkName: "about" */ '../components/YXJ/test/Dialog.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
