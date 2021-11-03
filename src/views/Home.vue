<template>

  <el-container class="home">

    <el-header style="background-color: gray;
    color: aliceblue;
    display: flex;
    justify-content: space-between;
    align-items: center;">

      <div style="font-size: 20px">寰宇医疗管理系统</div>

      <!--   头部右侧   -->
      <div class="header-right">
        <!--   下拉菜单     -->
        <el-dropdown>
            <span class="el-dropdown-link">
                <img class="uimg" src="../assets//images/gm.jpg">
            </span>
          <template #dropdown>
            <el-dropdown-menu>

              <el-dropdown-item @click="loginOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="userInfo">
          <div class="userNames">欢迎您 ->->->->->   {{showUserName}}</div>
          <div>{{ date }}</div>
        </div>

      </div>
      <!--   头部右侧结束   -->

    </el-header>
    <!--  头部结束    -->


    <!--  全局  -->
    <el-container>

      <!--   菜单栏     -->

      <el-aside width="auto" style="border-right: 1px solid #e6e6e6;">

        <menu-bar></menu-bar>

      </el-aside>
      <!--     菜单栏结束  -->

      <!--      -->
      <el-container>

        <!--     显示页面     -->
        <el-main style="padding: 0px">
          <i class="arrowIcon" :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="iconClick"></i>
          <Tabs></Tabs>
          <router-view></router-view>
        </el-main>


        <!--    底部显示    -->
        <el-footer style="
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid rgb(230,230,230);
        height: 50px">
          Copyright © 1999-2105 . 寰宇医疗 . All rights reserved.
        </el-footer>
        <!--     底部结束     -->

      </el-container>


    </el-container>
    <!--  全局左侧结束  -->


  </el-container>

</template>

<script>
import {loginOutApi} from "@/api/user";

import {getToken,removeToken,removeUserId,clearStorage} from "@/utils/auth";

import MenuBar from "@/components/YXJ/MenuBar";
// tabs
import Tabs from "@/components/YXJ/Tabs";

//导入全局store变量
import {mapState} from "vuex";
import Cookies from 'js-cookie';

var $vueIndex;
export default {
  name: "Home",

  components: {
    MenuBar,
    Tabs
  },


  //获取折叠计算属性
  computed: {
    ...mapState({
      isCollapse: state => state.MenuStore.isCollapse,
    }),
    showUserName(){
      return Cookies.get('username')
    }
  },
  data() {
    return {
      date: "",
    }
  },

  mounted() {
    $vueIndex = this;
    this.showTime();
    setInterval(function () {
      $vueIndex.showTime();
    }, 1000);
  },

  methods: {

    //退出登录
    async loginOut() {
      let parm = {
        token:getToken()
      }
      let {data:res} = await loginOutApi(parm)
      if(res && res.code == 200 ){
        //清除相关信息
        removeToken()
        removeUserId()
        clearStorage()
        //跳到登录
        window.location.href = '/login'
      }
    },

    iconClick() {//图片收缩方法
      this.$store.commit('setOpenOrClose')
    },

    showTime() { // 时间轴开始方法
      var week = new Array(
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
      );
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var second = date.getSeconds();
      this.date =
          year +
          "." +
          (month < 10 ? "0" + month : month) +
          "." +
          day +
          "" +
          " " +
          hour +
          ":" +
          minutes +
          ":" +
          (second < 10 ? "0" + second : second) +
          " " +
          (week[date.getDay()] || "");
    },
    // 当前时间轴结束方法


  },//methods 结束



}
</script>

<style scoped>
.home {
  height: 100%;
}

.header-right {
  display: flex;
}

.uimg {
  height: 50px;
  width: 50px;
  border-radius: 50px;
}

.userInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 10px;
}

.userNames {
  font-weight: 600;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.arrowIcon {
  font-size: 24px;
  border: 1px solid transparent;
  float: left;
  height: 39px;
  width: 50px;
  background: #eaedf1;
  text-align: center;
  line-height: 39px !important;
}

.el-main /deep/ .el-tabs__header {
  position: static !important;
}

</style>
