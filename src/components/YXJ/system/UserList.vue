<template>
  <!--用户-->
  <el-container
      :direction="vartical"
      :style="{ height: containerHeight + 'px' }"
  >
    <!--  左侧部门菜单  -->
    <el-aside width="200px" style="background: #FFF;border: 1px solid #dfe6ec;padding: 10px 0px 0px 0px">
      <!--  左侧部门树    -->
      <el-tree
          ref="leftTree"
          :data="deptList"
          node-key="id"
          :props="defaultProps"
          highlight-current="true"
          @node-click="NodeClick">

      </el-tree>

    </el-aside>


    <!--  右侧中间体，用户列表  -->
    <el-main>

      <!--   搜索框   -->

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
          <el-button v-if="hasPerm('sys:user:add')" @click="addUser" type="primary" icon="el-icon-plus">新增</el-button>
        </el-form-item>


      </el-form>

      <!--  表格显示  -->
      <el-table
          :data="tableList"
          :height="tableHeight"
          border stripe
      >

        <el-table-column prop="loginName" label="用户名称"/>
        <el-table-column prop="deptName" label="所属部门"/>
        <el-table-column prop="mobile" label="电话"/>
        <el-table-column prop="email" label="邮箱"/>

        <el-table-column align="center" label="操作" width="290px">

          <template #default="scope">

            <el-button
                v-if="hasPerm('sys:user:edit')"
                icon="el-icon-edit-outline"
                type="primary"
                size="small"
                @click="editUser(scope.row)"
            >编辑
            </el-button>

            <el-button
                v-if="hasPerm('sys:user:assign')"
                icon="el-icon-close"
                type="danger"
                size="small"
                @click="assignUser(scope.row)"
            >分配角色
            </el-button>

            <el-button
                v-if="hasPerm('sys:user:delete')"
                icon="el-icon-close"
                type="danger"
                size="small"
                @click="deleteUser(scope.row)"
            >删除
            </el-button>

          </template>

        </el-table-column>

      </el-table>

      <!--  分页    -->
      <el-pagination
          @size-change="SizeChange"
          @current-change="CurrentChange"
          :current-page="parms.currentPage"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="parms.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-main>

    <!-- 新增或编辑弹窗   -->
    <SysDialog
        :title="addDialog.title"
        :height="addDialog.height"
        :width="addDialog.width"
        :visible="addDialog.visible"
        @onClose="addClose"
        @onConfirm="addConfirm"
    >

      <template #content>

        <el-form
            :model="addUserModel"
            ref="addUserForm"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small">

          <el-form-item prop="deptName" label="所属部门">
            <el-input @click="selectDept" v-model="addUserModel.deptName"></el-input>
          </el-form-item>

          <el-form-item prop="loginName" label="姓名">
            <el-input v-model="addUserModel.loginName"></el-input>
          </el-form-item>

          <el-form-item prop="mobile" label="电话">
            <el-input v-model="addUserModel.mobile"></el-input>
          </el-form-item>

          <el-form-item label="昵称">
            <el-input v-model="addUserModel.nickName"></el-input>
          </el-form-item>

          <el-form-item prop="username" label="登录名">
            <el-input v-model="addUserModel.username"></el-input>
          </el-form-item>

          <el-form-item v-if="addUserModel.editType == 0 " prop="password" label="登录密码">
            <el-input show-password v-model="addUserModel.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="addUserModel.email"></el-input>
          </el-form-item>

          <el-form-item prop="sex" label="性别">

            <el-radio-group v-model="addUserModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>

          </el-form-item>


        </el-form>

      </template>


    </SysDialog>

    <!--  上级部门弹窗  -->
    <SysDialog
        :title="parentDialog.title"
        :height="parentDialog.height"
        :width="parentDialog.width"
        :visible="parentDialog.visible"
        @onClose="parentClose"
        @onConfirm="parentConfirm"
    >
      <template #content>

        <!--   上级部门树     -->
        <el-tree
            ref="parentTree"
            :data="parentList"
            node-key="id"
            :props="parentProps"
            default-expand-all
            highlight-current="true"
            @node-click="selectParentNode"
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


    <!--  分配角色弹窗  -->
    <sys-dialog
        :title="assignRoleDialog.title"
        :height="assignRoleDialog.height"
        :width="assignRoleDialog.width"
        :visible="assignRoleDialog.visible"
        @onClose="assignClose"
        @onConfirm="assignConfirm"
    >

      <template #content>

        <!--  角色表格显示  -->
        <el-table
            :style="{ height: RoleHeight + 'px' }"
            :data="assignList"
            :height="tableHeight"
            border stripe
        >

          <el-table-column width="50" label="选择">

            <template #default="scope">

              <el-radio v-model="raido" :label="scope.row.id" @change="getCurrentRow(scope.row)">
                {{ "" }}
              </el-radio>

            </template>

          </el-table-column>

          <el-table-column prop="name" label="角色名称">

          </el-table-column>

          <el-table-column prop="remark" label="角色备注">

          </el-table-column>

        </el-table>

        <!--   角色分配分页     -->
        <!--  分页    -->
        <el-pagination
            @size-change="assignSizeChange"
            @current-change="assignCurrentChange"
            :current-page="assignParm.currentPage"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="assignParm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="assignParm.total">
        </el-pagination>

      </template>

    </sys-dialog>

  </el-container>

</template>

<script>
import {getDeptListApi} from "@/api/department";
import {
  getUserListApi,
  addUserApi,
  editUserApi,
  deleteUserApi,
  getRoleListForAssign,
  getRoleIdByUserId,
  assignSaveApi
} from "@/api/user";
import SysDialog from "@/components/YXJ/SysDialog";
import {getUserId} from "@/utils/auth";

export default {
  name: "UserList",

  components: {
    SysDialog
  },

  data() {

    return {

      //分配角色选择参数
      selectAssignParm: {
        roleId: '',
        userId: '',
      },

      //角色表格高度
      RoleHeight: 0,

      //角色表格列表单选按钮数据
      raido: '',

      //分配角色列表分页数据
      assignParm: {
        total: 0,
        currentPage: 1,
        pageSize: 5,
        userId: ''
      },

      //保存
      assignList: [],

      //搜索框
      searchPrm: {
        name: '',

      },

      selectNode: {
        id: '',
        name: ''
      },

      //新增或编辑表单数据域
      addUserModel: {
        id: '',
        editType: '', //0新增 1编辑
        deptId: '',
        deptName: '',
        loginName: '',
        mobile: '',
        nickName: '',
        email: '',
        username: '',
        password: '',
        sex: '',
      },

      //新增或编辑弹窗属性
      //增加点击新增弹窗框属性
      addDialog: {
        title: '',
        height: '',
        width: '',
        visible: false
      },

      //上级部门弹窗
      parentDialog: {
        title: '',
        height: 400,
        width: 300,
        visible: false
      },

      //分配角色弹窗属性
      assignRoleDialog: {
        title: '',
        height: 400,
        width: 800,
        visible: false
      },

      //表单验证规则
      rules: {

        deptName: [
          {
            required: true,
            trigger: 'change',
            message: '请选择上级部门'
          }
        ],

        loginName: [
          {
            required: true,
            trigger: 'change',
            message: '请填写姓名'
          }
        ],

        mobile: [
          {
            required: true,
            trigger: 'change',
            message: '请填写电话'
          }
        ],

        username: [
          {
            required: true,
            trigger: 'change',
            message: '请填写登录名'
          }
        ],

        password: [
          {
            required: true,
            trigger: 'change',
            message: '请填写密码'
          }
        ],

        sex: [
          {
            required: true,
            trigger: 'change',
            message: '请选择性别'
          }
        ],

      },


      //右侧用户列表数据域
      tableList: [],

      //存放树形数据
      parentList: [],

      //分页总条数
      total: 0,

      //分页参数
      parms: {
        deptId: '',
        currentPage: 1,
        pageSize: 5,
      },

      //左
      //左侧部门树
      deptList: [],

      //容器高度
      containerHeight: 0,

      //表格高度
      tableHeight: 0,

      //配置部门树的属性
      defaultProps: {
        children: 'children',
        label: 'name',
      },

      //上级部门树的属性
      parentProps: {
        children: 'children',
        label: 'name',
      },
    }

  },

  methods: {

    //选择上级部门点击事件
    async selectDept() {
      this.selectNode.id = ''
      this.selectNode.name = ''
      let {data: res} = await getDeptListApi()
      if (res && res.code == 200) {
        this.parentList = res.data
      }
      this.parentDialog.visible = true
    },

    //上级部门节点点击事件
    selectParentNode(data) {
      this.selectNode.id = data.id
      this.selectNode.name = data.name
      console.log("1111", data)
    },

    //选择上级部门取消事件
    parentClose() {
      this.parentDialog.visible = false
    },

    //选择上级部门确认事件
    parentConfirm() {
      this.addUserModel.deptId = this.selectNode.id
      this.addUserModel.deptName = this.selectNode.name
      this.parentDialog.visible = false
    },


    //新增按钮
    addUser() {
      //清空表单数据域
      this.$restForm('addUserForm', this.addUserModel)
      //设置标识 0 新增 1 编辑
      this.addUserModel.editType = 0
      //设置弹窗属性
      this.addDialog.title = '新增用户'
      this.addDialog.visible = true
    },

    //新增或编辑取消事件
    addClose() {
      this.addDialog.visible = false
    },

    //新增或编辑确认事件
    addConfirm() {

      this.$refs.addUserForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addUserModel.editType == '0') {
            //新增
            res = await addUserApi(this.addUserModel)
          } else {
            //编辑
            res = await editUserApi(this.addUserModel)
          }
          if (res.data.code == 200) {
            this.$message.success(res.data.msg)
            //刷新数据列表
            this.getUserList()
          }
          console.log(res)
          this.addDialog.visible = false
        }
      })

    },

    //表格编辑按钮
    editUser(row) {
      //清空表单
      this.$restForm('addUserForm', this.addUserModel)
      // 设置编辑状态
      this.addUserModel.editType = '1'
      // 设置弹窗属性
      this.addDialog.title = '编辑用户'
      this.addDialog.visible = true
      //把要编辑的数据回显到页面
      this.$objCoppy(row, this.addUserModel)
    },


    //分配角色按钮
    async assignUser(row) {
      //  设置分配角色弹窗属性
      this.selectAssignParm.userId = ''
      this.selectAssignParm.roleId = ''
      this.raido = ''
      this.selectAssignParm.userId = row.id
      this.assignRoleDialog.title = '为【' + row.loginName + '】分配角色'
      this.assignRoleDialog.visible = true
      this.assignParm.userId = getUserId()
      this.getAssignRoleList(this.assignParm)
      //回显被分配用户的角色
      let parm = {
        userId: row.id
      }
      let {data: res} = await getRoleIdByUserId(parm)
      console.log("pppp", res)
      if (res.code == 200 && res.data) {
        this.raido = res.data.roleId
        this.selectAssignParm.roleId = res.data.roleId
      }
    },

    //获取所有角色
    async getAssignRoleList(parm) {
      //查询当前用户所有角色
      let {data: res} = await getRoleListForAssign(parm)
      if (res && res.code == 200) {
        this.assignList = res.data.records
        this.assignParm.total = res.data.total
      }
    },

    //表格单选按钮事件
    getCurrentRow(row) {
      this.selectAssignParm.roleId = row.id
    },

    //分配角色取消
    assignClose() {
      this.assignRoleDialog.visible = false
    },

    //分配角色确认
    async assignConfirm() {
      if (!this.selectAssignParm.roleId) {
        this.$message.warning('请选择角色')
        return
      }
      let {data: res} = await assignSaveApi(this.selectAssignParm)
      if (res && res.code == 200) {
        this.$message.success(res.msg)
        this.assignRoleDialog.visible = false
      }
    },

    //删除用户按钮
    async deleteUser(row) {
      //提示信息
      let confirm = await this.$messageBox.confirm('确定删除该用户吗？')
      //确定删除
      if (confirm) {
        let parm = {
          userId: row.id
        }
        let {data: res} = await deleteUserApi(parm)
        if (res.code == 200) {
          this.$message.success(res.msg)
          //  刷新数据列表
          this.getUserList()
        }
      }
    },


    //获取右侧用户列表
    async getUserList() {
      let {data: res} = await getUserListApi(this.parms)
      if (res && res.code == 200) {
        this.tableList = res.data.records
        this.total = res.data.total
      }
      console.log("获取列表", res)
    },


    //获得左侧部门菜单树
    async getDeptList() {
      let {data: res} = await getDeptListApi()
      console.log(res)
      if (res && res.code == 200) {
        this.deptList = res.data
        //设置树节点点击
        this.$nextTick(() => {
          const firstNode = document.querySelector(".el-tree-node")
          firstNode.click();
        })
      }
    },

    //左侧部门树节点点击事件,
    NodeClick(data) {
      //通过点击id和部门id匹配
      this.parms.deptId = data.id
      //查询部门下的用户列表
      this.getUserList()
    },

    //分页-页容量改变触发
    SizeChange(val) {
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getUserList(this.parms)
    },

    // 页数改变时候触发
    CurrentChange(val) {
      this.parms.currentPage = val;
      this.getUserList(this.parms)
    },

    //
    //角色-页容量改变触发
    assignSizeChange(val) {
      this.assignParm.currentPage = 1;
      this.assignParm.pageSize = val;
      this.getAssignRoleList(this.assignParm)
    },

    // 页数改变时候触发
    assignCurrentChange(val) {
      this.assignParm.currentPage = val;
      this.getAssignRoleList(this.assignParm)
    },


    //树节点加减号图标点击事件
    openBtn(data) {
      console.log("data", data)
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },

  },

  created() {
    this.getDeptList()
  },

  mounted() {
    this.$nextTick(() => {
      this.containerHeight = window.innerHeight - 170
      this.tableHeight = window.innerHeight - 295
      this.RoleHeight = window.innerHeight - 500
    })
  }
}
</script>

<style scoped>


</style>