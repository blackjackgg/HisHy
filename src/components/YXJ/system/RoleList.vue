<template>
  <!--角色-->
  <el-main>

    <!--  搜索新增板块  -->
    <el-form
        :model="parms"
        ref="searchForm"
        label-width="80px"
        :inline="true"
        size="small"
    >
      <el-form-item>
        <el-input placeholder="请输入角色名称" v-model="parms.name"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search">查询</el-button>
        <el-button style="color:#FF7670" icon="el-icon-close">重置</el-button>
        <el-button v-if="hasPerm('sys:role:add')" @click="addRole" type="primary" icon="el-icon-plus">新增</el-button>
      </el-form-item>


    </el-form>

    <!-- 角色表格显示数据   -->
    <el-table
        :height="tableHeight"
        :data="roleList"
        border stripe
    >
      <el-table-column prop="name" label="角色名称"/>
      <el-table-column prop="remark" label="角色备注"/>

      <el-table-column align="center" label="操作" width="290px">

        <template #default="scope">

          <el-button
              v-if="hasPerm('sys:role:edit')"
              icon="el-icon-edit-outline"
              type="primary"
              size="mini"
              @click="editRole(scope.row)"
          >编辑
          </el-button>

          <el-button
              v-if="hasPerm('sys:role:assign')"
              icon="el-icon-setting"
              type="danger"
              size="mini"
              @click="assignRole(scope.row)"
          >分配权限
          </el-button>

          <el-button
              v-if="hasPerm('sys:role:delete')"
              icon="el-icon-close"
              type="danger"
              size="mini"
              @click="deleteRole(scope.row)"
          >删除
          </el-button>

        </template>

      </el-table-column>

    </el-table>

    <!--  分页  -->

    <el-pagination
        @size-change="SizeChange"
        @current-change="CurrentChange"
        :current-page="parms.currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="parms.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="parms.total">
    </el-pagination>


    <!--  新增编辑弹窗  -->
    <sys-dialog
        :title="addDialog.title"
        :width="addDialog.width"
        :height="addDialog.height"
        :visible="addDialog.visible"
        @onClose="onClose"
        @onConfirm="onConfirm"
    >

      <template #content>

        <el-form
            :model="addRoleModel"
            ref="addRoleForm"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small"
        >
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="addRoleModel.name"></el-input>
          </el-form-item>

          <el-form-item label="角色备注">
            <el-input v-model="addRoleModel.remark"></el-input>
          </el-form-item>

        </el-form>


      </template>

    </sys-dialog>

    <!--  分配角色权限弹窗  -->
    <sys-dialog
        :title="assignDialog.title"
        :width="assignDialog.width"
        :height="assignDialog.height"
        :visible="assignDialog.visible"
        @onClose="assignClose"
        @onConfirm="assignConfirm"
    >

      <template #content>

        <!--   权限树     -->
        <el-tree
            ref="assignTree"
            :data="assignTreeData"
            node-key="id"
            :props="defaultProps"
            default-expand-all
            empty-text="暂无数据"
            :show-checkbox="true"
            highlight-current="true"
            :default-checked-keys="assignTreeChecked"
            @node-click="handleNodeClick"
        >

        </el-tree>

      </template>

    </sys-dialog>


  </el-main>

</template>

<script>
import {getRoleListApi, addRoleApi, editRoleApi, deleteRoleApi, getAssignTreeApi, assignSaveApi} from "@/api/role";
import {getUserId} from "@/utils/auth"
import SysDialog from "@/components/YXJ/SysDialog";
// import leafUtils from "@/utils/leafUtils";

export default {

  name: "RoleList",
  components: {SysDialog},
  data() {
    return {

      //权限树的数据域
      assignTreeData: [],
      //树
      assignTreeChecked: [],

      //角色id
      roleId: '',

      //配置权限树的属性
      defaultProps: {
        children: 'children',
        label: 'label',
      },

      // 新增或编辑弹窗数据域
      addRoleModel: {
        id: '',
        editType: '',// 0 新增 1 编辑
        name: '',
        remark: '',
        createUser: '',//当前登录用户id
      },

      //表单验证规则
      rules: {
        name: [
          {
            required: true,
            trigger: 'change',
            message: '请填写角色名称'
          }
        ],
      },

      //表格高度
      tableHeight: 0,

      //表格角色列表数据域
      roleList: [],


      //分页查询数据域
      parms: {
        name: '',
        userId: '',
        currentPage: 1,//第几页
        pageSize: 5,//每页查询几条数据
        total: 0,//总条数
      },

      //新增或编辑弹窗属性
      addDialog: {
        title: '',
        height: 310,
        width: 610,
        visible: false,
      },

      // 分配角色权限弹窗属性
      assignDialog: {
        title: '',
        height: 310,
        width: 310,
        visible: false,
      },

    };

  },


  methods: {

    //分配权限按钮
    async assignRole(row) {
      //分配权限之前，清空原来的数据
      this.assignTreeData = [];
      this.assignTreeChecked = [];
      this.roleId = row.id
      //获取分配权限树数据
      let parm = {
        userId: getUserId(),
        roleId: row.id
      }
      let {data: res} = await getAssignTreeApi(parm)
      if (res && res.code == 200) {
        //树数据
        this.assignTreeData = res.data.listmenu;
        //默认选中的数据
        this.assignTreeChecked = res.data.checkList;
        //如果有默认回显的数据
        if (this.assignTreeChecked.length > 0) {
          let newArr = [];
          this.assignTreeChecked.forEach((item) => {
            this.checked(item, this.assignTreeData, newArr);
          });
          this.assignTreeChecked = newArr;
        }
      }
      this.assignDialog.visible = true
      this.assignDialog.title = '为【' + row.name + '】分配权限'
    },

    //排除选中父节点，会把所有子节点选中的问题
    checked(id, data, newArr) {
      data.forEach((item) => {
        if (item.id == id) {
          if (item.children && item.children.length == 0) {
            newArr.push(item.id);
          }
        } else {
          if (item.children && item.children.length != 0) {
            this.checked(id, item.children, newArr);
          }
        }
      });
    },

    //权限树节点点击事件
    handleNodeClick(data) {
      console.log(data)
    },

    //分配权限取消
    assignClose() {
      this.assignDialog.visible = false
    },

    //分配权限提交
    async assignConfirm() {
      let ids = this.$refs.assignTree.getCheckedKeys().concat(this.$refs.assignTree.getHalfCheckedKeys());
      console.log("idd", ids)
      if (ids.length == 0) {
        this.$message.warning("请勾选权限!");
        return
      }
      let parm = {
        roleId: this.roleId,
        list: ids
      }
      let {data: res} = await assignSaveApi(parm)
      if (res && res.code == 200) {
        this.assignDialog.visible = false;
        this.$message.success(res.msg)
      }

    },


    //获取角色列表
    async getRoleList() {
      this.parms.userId = getUserId()
      let {data: res} = await getRoleListApi(this.parms)
      console.log("角色", res)
      if (res && res.code == 200) {
        this.roleList = res.data.records
        this.parms.total = res.data.total
      }
    },


    //新增按钮
    addRole() {
      //清空表单
      this.$restForm('addRoleForm', this.addRoleModel)
      this.addDialog.title = '新增角色'
      this.addDialog.visible = true
      this.addRoleModel.editType = 0 //0新增
    },


    //编辑按钮
    editRole(row) {
      //清空表单数据
      this.$restForm("addRoleForm", this.addRoleModel)
      //设置标识
      this.addRoleModel.editType = '1' //编辑
      //设置弹窗属性
      this.addDialog.title = '编辑角色'
      this.addDialog.visible = true
      //把当前行数据复制到表单数据域回显
      this.$objCoppy(row, this.addRoleModel)
    },

    //删除角色按钮
    async deleteRole(row) {
      let parm = {
        id: row.id
      }
      let confirm = await this.$messageBox.confirm("确定删除该角色嘛")
      if (confirm) {
        let {data: res} = await deleteRoleApi(parm)
        if (res && res.code == 200) {
          this.$message.success(res.msg)
          this.getRoleList()
        }
      }
    },

    //分页-页容量改变触发
    SizeChange(val) {
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getRoleList(this.parms)
    },

    // 页数改变时候触发
    CurrentChange(val) {
      this.parms.currentPage = val;
      this.getRoleList(this.parms)
    },


    //新增或弹窗取消
    onClose() {
      this.addDialog.visible = false
    },


    //新增或弹窗确认事件
    onConfirm() {
      this.$refs.addRoleForm.validate(async (valid) => {
        if (valid) {
          let res = null
          if (this.addRoleModel.editType == 0) {//新增
            this.addRoleModel.createUser = getUserId()
            res = await addRoleApi(this.addRoleModel);
          } else {//编辑
            res = await editRoleApi(this.addRoleModel)
          }
          if (res && res.data.code == 200) {
            //刷新列表
            this.getRoleList()
            this.addDialog.visible = false
          }

        }
      })

    },


  },

  created() {
    this.getRoleList()
  },

  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 293;
    })
  }
}
</script>

<style scoped>

</style>