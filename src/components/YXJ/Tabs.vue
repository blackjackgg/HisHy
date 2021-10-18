<template>
  <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab"
           @tab-click="tabClick">
    <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "Tabs",
  computed: {
    editableTabsValue: {
      get() {
        return this.$store.state.MenuStore.editableTabsValue
      },
      set(val) {
        this.$store.state.MenuStore.editableTabsValue = val;
      }
    },
    editableTabs: {
      get() {
        return this.$store.state.MenuStore.editableTabs
      },
      set(val) {
        this.$store.state.MenuStore.editableTabs = val;
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // tabs点击事件
    tabClick(tab) {
      console.log(tab.props)
      let obj = {};
      obj.title = tab.props.label;
      obj.name = tab.props.name;
      this.$store.commit('clickMenu',obj);
      this.$router.push({name:tab.props.name})
    },

    //关闭选项卡
    removeTab(targetName) {
      if(targetName === "DeskTop"){
        return;
      }
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);

      //设置当前激活的选项卡
      this.$store.commit('setActiveTabs',this.editableTabsValue)
      //激活当前选项卡存储到sessionStorage里面
      sessionStorage.setItem('tableList',JSON.stringify(this.editableTabs))
      //跳转到路由
      this.$router.push({name:this.editableTabsValue})

    }
  }
}
</script>

<style scoped>

</style>