<template>
  <!-- 弹框父组件 -->
  <div>
    <el-button type="primary" size="default" @click="openDialog">新增</el-button>

    <sys-dialog
        :visible="visible"
        :title="title"
        :width="width"
        :height="height"
        @onClose="onClose"
        @onConfirm="onConfirm"
    >
      <template v-slot:content>我是你爹</template>

    </sys-dialog>


  </div>

</template>

<script>
//调用子组件
import SysDialog from "@/components/YXJ/SysDialog";

export default {
  name: "Dialog",
  components: {
    SysDialog,
  },

  data() {

    return {
      visible: false,
      title: '新增用户',
      width: 600,
      height: 200,
    }

  },

  methods: {

    openDialog() {
      this.visible = true
    },

    onClose() {
      this.visible = false
    },

    onConfirm() {
      this.visible = false
    }

  }

}
</script>

<style lang="scss" scoped>

</style>