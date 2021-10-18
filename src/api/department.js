import http from "@/http/request"
//获取部门列表
export async function getDeptListApi(){
    return await http.get("api/department/list",null)
}

//获取上级部门数据
export async function getParentTreeApi(){
    return await http.get("api/department/parent")
}

//保存机构数据
export async function addSaveApi(parm){
    return await http.post("api/department",parm)
}

//编辑部门保存
export async function editSaveApi(parm){
    return await http.put("api/department",parm)
}

//删除部门
export async function deleteDeptApi(params){
    return await http.delete("api/department",params)
}