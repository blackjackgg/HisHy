import http from "@/http/request";
//获取角色列表
export async function getRoleListApi(params){
    return await http.get("/api/role/list",params)
}

//新增角色
export async function addRoleApi(params){
    return await http.post("/api/role",params)
}
//编辑角色
export async function editRoleApi(params){
    return await http.put("/api/role",params)
}
//删除角色
export async function deleteRoleApi(params){
    return await http.delete("/api/role",params)
}
//分配权限树数据
export async function getAssignTreeApi(params){
    return await http.get("/api/role/getAssignPermissionTree",params)
}
// 分配权限保存
export async function assignSaveApi(param){
    return await http.post("/api/role/roleAssignSave",param)
}
