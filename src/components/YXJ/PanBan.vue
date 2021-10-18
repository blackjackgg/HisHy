<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-row :gutter="12" style="margin-bottom: 5px">
      <el-col :span="24">
        <el-card shadow="always">
          <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="88px">
            <el-form-item>
              <el-col :span="12">
                <el-form-item>
                  <el-select
                      @change="sx"
                      v-model="pbType"
                      clearable
                      size="small"
                      style="width: 200px"
                      value-key="bcTypeId"
                  >

                    <el-option
                        v-for="bcType in banZhi"
                        :key="bcType.fcId"
                        :label="bcType.fcName"
                        :value="bcType.fcId"
                    />

                  </el-select>
                </el-form-item>

              </el-col>
              <el-form-item>
                <el-select
                    v-model="deptId"
                    clearable
                    value-key="Id"
                    size="small"
                    style="width: 240px"
                >
                    <el-option
                        v-for="dept in deptBy"
                        :key="dept.id"
                        :label="dept.name"
                        :value="dept.id"
                    />
                </el-select>
              </el-form-item>
<!--              <el-form-item>-->
<!--                <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="resetQuery">打印</el-button>-->
<!--              </el-form-item>-->
              <el-form-item style="float: right">
                <el-button type="primary" round icon="el-icon-s-fold" size="small" @click="upWeek">上一周</el-button>
                <el-button type="success" round icon="el-icon-s-operation" size="small" @click="currentWeek">当前周</el-button>
                <el-button type="warning" round icon="el-icon-s-unfold" size="small" @click="nextWeek">下一周</el-button>
              </el-form-item>
            </el-form-item>

          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 查询条件结束 -->
    <!--    表头开始  -->
    <el-row class="div10">
      <el-col :span="2" class="div11" >
        日期\班次
      </el-col>
      <el-col :span="wid" class="div12" v-for="bc in schedulingTypeOptions" :key="bc.fid">
        {{bc.fstartTime}}至{{bc.fendTime}}
      </el-col>
    </el-row>
    <!--    表头结束  -->

    <!--    主体开始  -->
    <el-row class="div20 "  v-for="pb in pbtableData"  style="margin-top: 2px;height: 60px;">

      <el-col :span="2" class="div21 ">
        {{pb.xq}}<br>{{pb.rq}}
      </el-col>

      <el-col :span="wid" v-for="bc in schedulingTypeOptions" class="doc">
          <span v-for="ygpb in pb.slist" >
             <template v-if="ygpb.frId==bc.fid">
                {{ygpb.user.username+"&#32"}}
             </template>
          </span>
<!--        (pb.rq,bc.fid)-->
        <el-button type="primary" icon="el-icon-plus" v-show="!pb.state"  :disabled="pb.state" circle @click="dakai"></el-button>
      </el-col>

<!--      <el-col :span="wid" v-for="bc in schedulingTypeOptions">-->
<!--          <span v-for="ygpb in pb.paiBanList">-->
<!--            <template v-if="ygpb.bcId==bc.bc">-->
<!--              {{ygpb.yg.ygName}}-->
<!--            </template>-->
<!--          </span>-->
<!--        <el-button type="primary" icon="el-icon-plus"  circle @click="dialogVisible=true,this.getksYgs()"></el-button>-->
<!--      </el-col>-->

    </el-row>

    <!--    主体结束  -->
    <!--==========================弹框开始===========================-->
    <el-dialog v-model="dialogVisible" title='添加员工' >
      <el-form-item >
        <el-tree
            ref="tree"
            :data="deptYgs"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
        />
      </el-form-item>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false,this.reset()">关闭</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
    <!--    ========================弹框结束=======================-->

  </div>
</template>

<script>

import {getFreCaList,getFrequency,getWeekList,getPaiDept,addPaiBan} from "@/api/paiban"
import {getDeptListApi} from "@/api/department";

export default {
  data() {
    return {
      //部门树
      deptYgs: [],
      //级联选择
      defaultProps: {
        children: 'user',
        label: 'name'
      },

      // 遮罩层
      loading: false,

      // 对话框标题
      title: '',

      // 是否打开对话框
      open: false,

      //  班制类型
      pbType: 1,

      // 排班类型数据
      banZhi: [],

      // 部门数据
      deptList:[],
      //选择部门
      deptId: 12,

      // 医生数据
      userOptions: [],
      // 班次数据
      schedulingTypeOptions: [],
      // 排班时间段数据
      subsectionTypeOptions: [],
      // 查询参数
      queryParams: {
        queryDate: undefined
      },
      schedulingData: {
        startTimeThisWeek: undefined,
        endTimeThisWeek: undefined
      },
      // 排班表数据
      pbtableData: [],
      dialogVisible: false,
      // 修改的数据
      editData: [],
      week:[],
      length2: 0,
      deptBy:[],

      rb:{
        rq:'',
        fid:''
      },


    }
  },
  //  计算属性
  computed: {
    wid(){
      return Math.floor(22/this.length2)
    }
  },
  created() {
    //加载班制
    this.getFreCaList()

    //部门查询
    this.getDeptList()

    //班次查询
    this.getFrequencyList()

    //  加载班次数据
    this.getSchedulingTypeOptions()

    // 加载班制信息
    this.getPaiBanList()

    // //加载部门树
    // this.dakai()


    //查询班次类型数据
    this.getDeptOptions()
    //  查询员工的排班情况
    this.getPbtableData()
    //  加载科室数据
    this.getKeShi()

  },
  methods: {

    //获取班制列表
    async getFreCaList() {
      let {data: res} = await getFreCaList();
      console.log(res)
      this.banZhi = res.data;
    },

    //获取部门下拉框
    //获取部门列表
    async getDeptList() {
      let {data: res} = await getDeptListApi();
      console.log("hhhhhhhhhhhhh",res)
      this.deptList = res.data;
      this.deptList.forEach(v=>{
        v.children.forEach(e=>{
          // console.log(e)
          this.deptBy.push(e)
        })
      })
    },

    //查询班次
    async getFrequencyList(){
      let parm = {
        fcId:this.pbType
      }
      let {data:res} = await getFrequency(parm);
      console.log("ooooooooo",parm)
      this.schedulingTypeOptions = res
      this.length2 = res.length
      console.log("1111111111111",res)
    },

    //查询当前周排班信息
    async getPaiBanList(){
      let parm = {
        deptId:this.deptId
      }
      let {data:res} = await getWeekList(parm);
      this.pbtableData = res;
      console.log("22222222",this.pbtableData)
    },


    //部门树弹窗
    async dakai(){
      let parm = {
        deptId: this.deptId
      }
      let {data:res} = await getPaiDept(parm)
      this.deptYgs = res
      this.dialogVisible = true;
      console.log("jjjjjjjjjj",res)
    },

    //新增员工排班
    async confirmRole(){
      var funs=this.$refs.tree.getCheckedKeys();//员工id
      //日期
      var grant = JSON.stringify({rq:this.rb.rq,bcId:this.rb.bcId,funs:funs})
      await addPaiBan(grant)
      this.dialogVisible=false

    },


    //查询科室下的员工集合
    getksYgs(){
      this.axios("ksygs/"+this.ksId).then(response =>{
        this.ksYgs=response.data
        console.log(response.data)
      })
    },

    //查科室
    getKeShi(){
      this.axios.post("selectks").then(data =>{
        this.keShi=data.data;
      });
    },
    sx(){
      this.getFrequencyList()
    },
    //查询班次类型数据
    getDeptOptions(){
      this.axios("bctype").then(response =>{
        this.deptOptions=response.data
      })
    },
    // 查询班次数据
    getSchedulingTypeOptions(){
      this.axios("cxbc/"+this.pbType).then(response =>{
        // 这里进行赋值
        this.schedulingTypeOptions=response.data;
        // 输出响应回来的参数
        // console.log(response.data);
        this.length2=response.data.length
      })
    },
    // 查询员工的排班
    getPbtableData() {
      this.loading = true
      this.axios("hqpb").then(response =>{
        // 这里进行赋值
        this.pbtableData=response.data;
      })
    },
    // 查询
    handleQuery() {
    },
    // 重置查询
    resetQuery() {
    },
    // 上一周
    upWeek() {
    },
    // 当前周
    currentWeek() {
    },
    // 下一周
    nextWeek() {
    },
    // 排班时间转换数据
    subsectionTypeFormatter() {
      // return this.selectDictLabel(this.subsectionTypeOptions, row.subsectionType)
    },
    // 编辑
    editScheduling(userId) {
      this.editData = []
      this.open = true
      let name = ''
      this.userOptions.filter(item => {
        if (userId === item.id) {
          name = item.userName
        }
      })
      this.title = '修改【' + name + '】的排班信息'
      this.tableData.filter(item => {
        if (userId === item.userId) {
          this.editData.push(item)
        }
      })
    },
    userGroup(id) {
      return this.tableData.filter(o => o.userId === id).length
    },
    // 提交
    handleSubmit() {
      this.loading = true
    },
    // 取消
    cancel() {
      this.open = false
    }
  }



}

</script>

<style>
.div10{
  text-align: center;
  height: 30px;
  background-color: #99a9bf;
}
/*日期样式*/
.div10>.div11{
  background-color: #42b983;
}
/*  班次样式 */
.div10>.div12{
  border: 1px solid red;
  background-color: #b3c0d1;
}
.div20{
  text-align: center;
  background-color: #008489;
}
.div20>.div21{

  background-color: #42b983;
}
.border{
  border: 1px solid black;
}
</style>
