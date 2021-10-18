<template>
  <!-- 菜单 -->
  <el-main style="padding:0px 20px">

    <!--  搜索新增板块  -->
    <el-form
        :model="searchPrm"
        ref="searchForm"
        label-width="80px"
        :inline="true"
        size="small"
    >
      <el-form-item style="margin-bottom: 10px">
        <el-button v-if="hasPerm('sys:menu:add')" @click="addMenu" type="primary" icon="el-icon-plus">新增</el-button>
      </el-form-item>


    </el-form>

    <!-- 菜单显示数据   -->
    <el-table
        :height="tableHeight"
        :data="menuList"
        border stripe
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children'}"
    >

      <el-table-column prop="label" label="菜单名称"/>

      <el-table-column align="center" prop="type" label="菜单类型">

        <template #default="scope">
          <el-tag size="small" v-if="scope.row.type == '0' ">目录</el-tag>
          <el-tag type="warning" size="small" v-if="scope.row.type == '1' ">菜单</el-tag>
          <el-tag type="success" size="small" v-if="scope.row.type == '2' ">按钮</el-tag>
        </template>

      </el-table-column>

      <el-table-column align="center" prop="icon" label="菜单图标">

        <template #default="scope">
          <i :class="scope.row.icon"></i>
        </template>

      </el-table-column>

      <el-table-column prop="name" label="路由名称"/>
      <el-table-column prop="path" label="路由地址"/>
      <el-table-column prop="url" label="组件路径"/>
      <el-table-column prop="code" label="权限字段"/>


      <el-table-column align="center" label="操作" width="200px">

        <template #default="scope">

          <el-button
              v-if="hasPerm('sys:menu:edit')"
              icon="el-icon-edit-outline"
              type="primary"
              size="mini"
              @click="editMenu(scope.row)"
          >编辑
          </el-button>

          <el-button
              v-if="hasPerm('sys:menu:delete')"
              icon="el-icon-close"
              type="danger"
              size="mini"
              @click="deleteMenu(scope.row)"
          >删除
          </el-button>

        </template>

      </el-table-column>

    </el-table>

    <!-- 新增弹框   -->
    <sys-dialog
        :title="addDialog.title"
        :height="addDialog.height"
        :width="addDialog.width"
        :visible="addDialog.visible"
        @onClose="onclose"
        @onConfirm="onConfirm"
    >

      <template #content>

        <el-form
            :model="addMenuModel"
            ref="addMenuForm"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small">

          <el-form-item prop="type" label="菜单类型">
            <el-radio-group v-model="addMenuModel.type">
              <el-radio :label="'0'">目录</el-radio>
              <el-radio :label="'1'">菜单</el-radio>
              <el-radio :label="'2'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="parentName" label="上级菜单">
            <el-input @click="selectParent" v-model="addMenuModel.parentName" placeholder="请选择上级菜单"
                      size="small"></el-input>
          </el-form-item>

          <el-form-item prop="label" label="菜单名称">
            <el-input v-model="addMenuModel.label" placeholder="请填写菜单名称" size="small"></el-input>
          </el-form-item>

          <!--    做判断点击按钮就不需要图标    -->
          <el-form-item v-if="addMenuModel.type != '2' " label="菜单图标">
            <el-input v-model="addMenuModel.icon" placeholder="请填写菜单图标" size="small"></el-input>
          </el-form-item>

          <!--    做判断路由名称等于1是菜单的时候才要显示路由名称    -->
          <el-form-item prop="name" v-if="addMenuModel.type == '1' " label="路由名称">
            <el-input v-model="addMenuModel.name" placeholder="请填写路由名称" size="small"></el-input>
          </el-form-item>

          <!--    做判断路由地址不等于2才要显示路由地址   -->
          <el-form-item prop="path" v-if="addMenuModel.type != '2' " label="路由地址">
            <el-input v-model="addMenuModel.path" placeholder="请填写路由地址" size="small"></el-input>
          </el-form-item>

          <!--    做判断路由名称等于1菜单的时候才要显示组件路径    -->
          <el-form-item prop="url" v-if="addMenuModel.type == '1' " label="组件路径">
            <el-input v-model="addMenuModel.url" placeholder="请填写组件路径" size="small"></el-input>
          </el-form-item>

          <el-form-item label="权限字段">
            <el-input v-model="addMenuModel.code" placeholder="请填写权限字段" size="small"></el-input>
          </el-form-item>

          <el-form-item label="权限备注">
            <el-input v-model="addMenuModel.remark" placeholder="请填写权限备注" size="small"></el-input>
          </el-form-item>

          <el-form-item label="权限序号">
            <el-input-number :min="0" v-model="addMenuModel.orderNum" placeholder="数值" size="small"></el-input-number>
          </el-form-item>

        </el-form>

      </template>

    </sys-dialog>


    <!--  选择上级菜单树  -->
    <sys-dialog
        :title="parentDialog.title"
        :height="parentDialog.height"
        :width="parentDialog.width"
        :visible="parentDialog.visible"
        @onClose="onParentClose"
        @onConfirm="onParentConfirm"
    >
      <template #content>

        <!--   上级部门树     -->
        <el-tree
            ref="parentTree"
            :data="parentList"
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

    </sys-dialog>

  </el-main>

</template>

<script>

import {getMenuListApi, getParentMenu, addMenuApi, editMenuApi, deleteMenuApi} from "@/api/menu";
// import {getMenuList} from "@/api/login";
import SysDialog from "@/components/YXJ/SysDialog";

export default {
  name: "MenuList",
  components: {SysDialog},
  data() {
    return {

      //新增或编辑表单作用域
      addMenuModel: {
        editType: '', //0 新增 1 编辑
        parentId: '',
        id: '',
        label: '',
        type: '',
        parentName: '',
        icon: '',
        name: '',
        path: '',
        url: '',
        code: '',
        remark: '',
        orderNum: ''
      },

      //变得规则
      //表单验证规则
      rules: {

        type: [
          {
            required: true,
            trigger: 'change',
            message: '请选择菜单类型'
          }
        ],

        parentName: [
          {
            required: true,
            trigger: 'change',
            message: '请选择上级菜单'
          }
        ],

        label: [
          {
            required: true,
            trigger: 'change',
            message: '请选择菜单名称'
          }
        ],

        name: [
          {
            required: true,
            trigger: 'change',
            message: '请填写路由名称'
          }
        ],

        path: [
          {
            required: true,
            trigger: 'change',
            message: '请选择路由地址'
          }
        ],

        url: [
          {
            required: true,
            trigger: 'change',
            message: '请填写组件路径'
          }
        ],

      },


      //新增或编辑弹窗属性
      addDialog: {
        title: '',
        height: 310,
        width: 610,
        visible: false,
      },


      //上级菜单弹窗属性
      parentDialog: {
        title: '选择上级菜单',
        height: 400,
        width: 280,
        visible: false,
      },

      //表格高度
      tableHeight: 0,

      //  菜单数据列表
      menuList: [],

      //接收上级菜单
      parentList: [],

    }
  },

  methods: {

    //选择上级菜单
    async selectParent() {
      let {data: res} = await getParentMenu();

      if (res && res.code == 200) {
        this.parentList = res.data
      }
      console.log("上级", this.parentList)
      this.parentDialog.visible = true
    },

    //上级树节点点击事件
    handleNodeClick(data) {
      if (data) {
        this.addMenuModel.parentId = data.id;
        this.addMenuModel.parentName = data.label;
      }
    },

    //树节点加减号图标点击事件
    openBtn(data) {
      console.log("data", data)
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },

    //取消上级菜单事件
    onParentClose() {
      this.parentDialog.visible = false
    },

    //选择上级菜单确认事件
    onParentConfirm() {
      this.parentDialog.visible = false
    },


    //获取菜单数据
    async getMenuList() {
      let {data: res} = await getMenuListApi()
      if (res && res.code == 200) {
        this.menuList = res.data;
        console.log("菜单", this.menuList)
      }
    },


    //新增或编辑取消
    onclose() {
      this.addDialog.visible = false
      this.$restForm("addMenuForm", this.addMenuModel)
    },

    //新增或编辑的确认
    onConfirm() {
      this.$refs.addMenuForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addMenuModel.editType == '0') {//新增
            res = await addMenuApi(this.addMenuModel)
          } else {//编辑
            res = await editMenuApi(this.addMenuModel)
          }

          if (res.data && res.data.code == 200) {
            //刷新数据
            this.getMenuList()
            this.$message.success(res.data.msg)
            this.addDialog.visible = false
          }
        }
      })

    },

    //新增按钮方法
    addMenu() {
      //清空表单
      this.$restForm("addMenuForm", this.addMenuModel)
      this.addDialog.title = "新增权限";
      this.addDialog.visible = true;
      //设为新增状态
      this.addMenuModel.editType = "0";
    },


    //编辑按钮方法
    editMenu(row) {
      console.log("编辑", row)
      //清空表单
      this.$restForm("addMenuForm", this.addMenuModel)
      //把当前编辑的数据复制到表单数据1
      this.$objCoppy(row, this.addMenuModel);
      //把当前的标识设为编辑状态
      this.addMenuModel.editType = '1'
      //设置弹窗属性
      this.addDialog.title = '编辑权限'
      this.addDialog.visible = true
    },

    //删除菜单按钮方法
    async deleteMenu(row) {
      console.log("删除", row)
      let confirm = await this.$messageBox.confirm("确定删除该数据嘛")
      if (confirm) {
        let parm = {
          id: row.id
        };
        let {data: res} = await deleteMenuApi(parm)
        if (res && res.code == 200) {
          //刷新列表
          this.getMenuList();
          this.$message.success(res.msg);
        }
      }
    }


  },

  created() {
    this.getMenuList()
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 210
    })
  }

}
</script>

<style scoped>

</style>