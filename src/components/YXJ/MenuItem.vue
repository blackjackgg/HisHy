<template>
<!--标签-->
  <fragment>

        <template v-for="menu in menuList">

          <el-submenu v-if='menu.children.length > 0 ' :index="menu.path" :key='menu.path'>

            <!--     通过循环取到menu的名称       -->
            <template #title>
              <i :class="menu.icon"></i>
              <span style="font-size:15px;font-weight:600;" >{{ menu.label }}</span>
            </template>

            <!--     利用组件找到一级下面循环出的子机       -->
            <menu-item :menuList='menu.children'></menu-item>

          </el-submenu>

          <el-menu-item @click="clickMenu(menu)" v-else :index="menu.path" :key='menu.path'>
            <i :class="menu.icon"></i>
            <span >{{ menu.label }}</span>
          </el-menu-item>

        </template>

  </fragment>

</template>

<script>
import MenuItem from './MenuItem'
export default {
  name: "MenuItem",
  props: ['menuList'],
  components:{MenuItem},
  methods: {
    clickMenu(item) {
      // 1.把当前点中的菜单节点放入tabs
      // //设置选项卡
      this.$store.commit('clickMenu',item);
      // console.log(item)
      // //设置跳转路由
      this.$router.push({name: item.name})
    }
  }
}
</script>

<style scoped>

</style>