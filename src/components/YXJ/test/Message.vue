<template>
  <div>
    <el-button type="primary" size="default" @click="message">信息提示</el-button>
    <el-button type="primary" size="default" @click="confirmBtn">删除</el-button>
    <el-button type="primary" size="default" @click="messageUtil">messageUtil</el-button>
    <el-button type="primary" size="default" @click="messageBoxUtil">messageBoxUtil</el-button>
  </div>
</template>

<script>
export default {
  name: "Message",
  data(){

  },
  methods:{

    //
    messageUtil(){
      this.$message.error('删除失败')
    },

    //消息盒子提示
    async messageBoxUtil(){
      let res = await this.$messageBox.confirm('您确定删除该用户嘛?');
      if(res){
        this.$message.success('删除成功')
      }
    },

    //信息提示
    message(){
      this.$message({
        message:'信息提示',
        type:'success'
      })
    },

    //盒子
    confirmBtn(){
      this.$confirm('您确定删除嘛, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

  }
}
</script>

<style scoped>

</style>