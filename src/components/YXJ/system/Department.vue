<template>
  <!--部门 padding-top:10px-->
  <el-main>

    <!--  搜索新增板块  -->
    <el-form
        :model="searchPrm"
        ref="searchForm"
        label-width="80px"
        :inline="true"
        size="small"
    >
      <el-form-item>
        <el-input placeholder="请输入部门名称" v-model="searchPrm.searchName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search">查询</el-button>
        <el-button style="color:#FF7670" icon="el-icon-close">重置</el-button>
        <el-button v-if="hasPerm('sys:addDepartment')" @click="add" type="primary" icon="el-icon-plus">新增</el-button>
      </el-form-item>


    </el-form>


    <!--  表格显示  -->
    <el-table
        :height="tableHeight"
        :data="tableList"
        border stripe
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children'}"
    >

      <el-table-column prop="name" label="部门名称"/>
      <el-table-column prop="deptCode" label="部门编码"/>
      <el-table-column prop="deptPhone" label="部门电话"/>
      <el-table-column prop="deptAddress" label="部门地址"/>

      <el-table-column align="center" label="操作">

        <template #default="scope">

          <el-button
              v-if="hasPerm('sys:editDept')"
              icon="el-icon-edit-outline"
              type="primary"
              size="small"
              @click="editHandler(scope.row)"
          >编辑
          </el-button>

          <el-button
              v-if="hasPerm('sys:deleteDept')"
              icon="el-icon-close"
              type="danger"
              size="small"
              @click="deleteHandler(scope.row)"
          >删除
          </el-button>

        </template>

      </el-table-column>

    </el-table>

    <!--  新增机构弹窗  -->
    <SysDialog
        :title="addDialog.title"
        :height="addDialog.height"
        :width="addDialog.width"
        :visible="addDialog.visible"
        @onClose="onClose"
        @onConfirm="onConfirm"
    >

      <template #content>

        <el-form
            :model="addDeptModel"
            ref="addDeptForm"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small">

          <el-form-item prop="parentName" label="上级部门">
            <el-input @click="selectParent" v-model="addDeptModel.parentName"></el-input>
          </el-form-item>

          <el-form-item prop="name" label="部门名称">
            <el-input v-model="addDeptModel.name"></el-input>
          </el-form-item>

          <el-form-item label="部门编码">
            <el-input v-model="addDeptModel.deptCode"></el-input>
          </el-form-item>

          <el-form-item label="部门电话">
            <el-input v-model="addDeptModel.deptPhone"></el-input>
          </el-form-item>

          <el-form-item label="部门经理">
            <el-input v-model="addDeptModel.manager"></el-input>
          </el-form-item>

          <el-form-item label="部门地址">
            <el-input v-model="addDeptModel.deptAddress"></el-input>
          </el-form-item>

          <el-form-item label="部门序号">
            <el-input v-model="addDeptModel.orderNum"></el-input>
          </el-form-item>


        </el-form>

      </template>


    </SysDialog>

    <!--  选择上级机构弹框  -->
    <SysDialog
        :title="parentDialog.title"
        :height="parentDialog.height"
        :width="parentDialog.width"
        :visible="parentDialog.visible"
        @onClose="parentOnClose"
        @onConfirm="parentOnFirm"
    >

      <template #content>

        <!--   上级部门树     -->
        <el-tree
            ref="parentTree"
            :data="treeList"
            node-key="id"
            :props="defaultProps"
            default-expand-all
            highlight-current="true"
            @node-click="handleNodeClick"
        >
          <template class="customer-tree-node" v-slot:default{node,data}>


            <!-- 没有子元素时显示的图标 (即是最后一层) -->
            <span v-if="data.children.length == 0">
                <i class="el-icon-document"></i>
              </span>

            <!-- 有子元素显示的图标 -->
            <span v-else @click.stop="openBtn(data)">

              <!-- 这里的展开的显示隐藏即是 [+] [-]-->
              <i v-if="data.open" class="iconfont icon-jiahao"/>

              <i v-else class="iconfont icon-jianhao"/>

              </span>

            <!-- 名称 -->
            <span>{{ node.label }}</span>


          </template>

        </el-tree>

      </template>

    </SysDialog>


  </el-main>

</template>

<script>
import {getDeptListApi, getParentTreeApi, addSaveApi, editSaveApi , deleteDeptApi} from "@/api/department";
import SysDialog from "@/components/YXJ/SysDialog";

export default {
  components: {
    SysDialog
  },
  name: "Department",

  data() {
    return {

      //表格高度默认0
      tableHeight: 0,

      //上级部门树显示
      defaultProps: {
        children: 'children',
        label: 'name',// 树的名字跟后端名字对应
      },

      //上级机构弹框属性
      parentDialog: {
        title: '',
        height: 400,
        width: 300,
        visible: false
      },


      //表单验证规则
      rules: {
        parentName: [
          {
            required: true,
            trigger: 'change',
            message: '请选择上级部门'
          }
        ],

        name: [
          {
            required: true,
            trigger: 'change',
            message: '请填写部门名称'
          }
        ],
      },

      //新增表单数据域
      addDeptModel: {
        editType: '',// 0 表示新增，1 编辑
        id: '',
        pid: '',
        parentName: '',
        manager: '',
        deptAddress: '',
        deptPhone: '',
        name: '',
        deptCode: '',
        orderNum: ''
      },

      //

      //增加点击新增弹窗框属性
      addDialog: {
        title: '',
        height: '',
        width: '',
        visible: false
      },

      //搜索关键字
      searchPrm: {
        searchName: ''
      },//

      //表格数据
      tableList: [],

      //接受树的数据
      treeList: [],

    }
  },

  methods: {

    //获取部门列表
    async getDeptList() {
      let {data: res} = await getDeptListApi();
      console.log(res)
      this.tableList = res.data;
    },

    //新增按钮事件
    add() {
      //清空表单数据
      this.$restForm("addDeptForm", this.addDeptModel)
      this.addDialog.title = '新增部门'
      this.addDialog.visible = true
      this.addDeptModel.editType = '0'
    },

    //树节点加减号图标点击事件
    openBtn(data) {
      console.log("data", data)
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },

    //上级树节点点击事件
    handleNodeClick(data) {
      if (data) {
        this.addDeptModel.pid = data.id;
        this.addDeptModel.parentName = data.name;
      }
    },

    //选择上级机构事件
    async selectParent() {
      //获取上级部门树数据
      let {data: res} = await getParentTreeApi();
      console.log('树', res)
      if (res && res.code == 200) {
        this.treeList = res.data
      }
      this.parentDialog.title = '选择上级机构',
          this.parentDialog.visible = true
    },

    //上级部门确认事件
    parentOnFirm() {
      this.parentDialog.visible = false
    },

    //上级部门取消事件
    parentOnClose() {
      this.parentDialog.visible = false
      console.log("你好")
    },

    //新增部门或者编辑部门弹窗确认
    onConfirm() {
      this.$refs.addDeptForm.validate(async (valid) => {
        if (valid) {
          // let {data:res} = await addSaveApi(this.addDeptModel)
          let res = null;
          if (this.addDeptModel.editType == '0') {
            res = await addSaveApi(this.addDeptModel)
          } else {
            res = await editSaveApi(this.addDeptModel)
          }
          //如果新增成功
          if (res && res.data.code == 200) {
            this.$message.success(res.data.msg)
            //新增成功刷新列表
            this.getDeptList();
            //关闭弹窗
            this.addDialog.visible = false;
            console.log("hhh")
          }

        }
      })

    },

    //新增部门弹窗取消
    onClose() {
      this.addDialog.visible = false;
      console.log("hhh")
    },

    //编辑
    editHandler(row) {
      console.log("编辑", row)
      //清空表单editSaveApi
      this.$restForm("addDeptForm", this.addDeptModel);
      //把当前要清空的数据复制到表单域
      this.$objCoppy(row, this.addDeptModel);
      //设置弹框显示
      this.addDeptModel.editType = '1'
      this.addDialog.title = "编辑部门"
      this.addDialog.visible = true;
    },

    //删除
    async deleteHandler(row) {
      console.log("删除", row)

      let confirm = await this.$messageBox.confirm("确定删除改数据嘛")

      if (confirm){

        let parm = {
          id:row.id
        }
        let {data:res} = await deleteDeptApi(parm)

        if (res && res.code == 200){
          this.$message.success(res.msg)
          //刷新数据列表
          this.getDeptList()
        }//2

      }//1

    }
  },

  created() {
    this.getDeptList()
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 260
    })
  }

}
</script>


<style lang="scss" scoped>
//::v-deep .el-tree {
//  .el-tree-node {
//    position: relative;
//    padding-left: 10px;
//  }
//
//  .el-tree-node__children {
//    padding-left: 20px;
//  }
//
//  .el-tree-node :last-child:before {
//    height: 40px;
//  }
//
//  .el-tree > .el-tree-node:before {
//    border-left: none;
//  }
//
//  .el-tree > .el-tree-node:after {
//    border-top: none;
//  }
//
//  .el-tree-node:before,
//  .el-tree-node:after {
//    content: "";
//    left: -4px;
//    position: absolute;
//    right: auto;
//    border-width: 1px;
//  }
//
//  .tree :first-child .el-tree-node:before {
//    border-left: none;
//  }
//
//  .el-tree-node:before {
//    border-left: 1px dotted #d9d9d9;
//    bottom: 0px;
//    height: 100%;
//    top: -25px;
//    width: 1px;
//  }
//
//  .el-tree-node:after {
//    border-top: 1px dotted #d9d9d9;
//    height: 20px;
//    top: 14px;
//    width: 24px;
//  }
//
//  .el-tree-node__expand-icon.is-leaf {
//    width: 8px;
//  }
//
//  .el-tree-node__content > .el-tree-node__expand-icon {
//    display: none;
//  }
//
//  .el-tree-node__content {
//    line-height: 30px;
//    height: 30px;
//    padding-left: 10px !important;
//  }
//}
//
//::v-deep .el-tree > div {
//  ::before {
//    display: none;
//  }
//
//  ::after {
//    display: none;
//  }
//}
</style>