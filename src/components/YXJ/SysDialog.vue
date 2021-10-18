<template>
  <!-- 弹框子组件 -->

  <el-dialog
      top="13vh"
      :title="title"
      :model-value="visible"
      :width="width + 'px'"
      :before-close="onClose"
  >

    <div class="container" :style="{height:height+'px'}">

      <slot name="content"></slot>

    </div>

    <template #footer>

          <span class="dialog-footer">
            <el-button @click="onClose">取 消</el-button>
            <el-button type="primary" @click="onConfirm">确 定</el-button>
          </span>

    </template>
  </el-dialog>

</template>

<script>

export default {
  name: "SysDialog",

  props: {
    title: {
      type: String,
      default: '标题'
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    }

  },

  methods: {
    onClose() {//关闭弹窗
      this.$emit("onClose")
    },
    onConfirm() {// 确认弹窗
      this.$emit("onConfirm")
    },
  }

}
</script>

<style lang="scss" scoped>
.container{
  overflow-x: initial;
  overflow-y: auto;
}

</style>