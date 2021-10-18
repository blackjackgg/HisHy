<template>
  <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      unique-opened>

    <!-- 循环输出菜单栏   -->
    <menu-item :menuList='menuList'></menu-item>
  </el-menu>

</template>

<script>
import MenuItem from "@/components/YXJ/MenuItem";
import {mapState} from 'vuex'

export default {
  name: "MenuBar",
  components: {MenuItem},

  //获取计算属性
  computed: {
    ...mapState({
      //菜单伸缩
      isCollapse: (state) => state.MenuStore.isCollapse,
      //菜单数据
      menuList: state => state.MenuStore.menuList
    })
  },

  data() {
    return {

    }
  },
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
}
</script>

<style scoped>
.el-menu {
  border-right: none!important;
}
</style>