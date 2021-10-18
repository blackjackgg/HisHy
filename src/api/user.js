import http from "@/http/request";

//获取验证码
export async function getImageApi(){
    return await http.getImage("/api/sysUser/image")
}

//获取用户列表
export async function getUserListApi(params){
    return await http.getRestApi("/api/user/list",params)
}

//新增用户
export async function addUserApi(params){
    return await http.post("/api/user",params)
}

//编辑用户
export async function editUserApi(params){
    return await http.put("/api/user",params)
}

//删除用户
export async function deleteUserApi(params){
    return await http.delete("/api/user",params)
}

//获取分配角色列表
export async function getRoleListForAssign(params){
    return await http.get("/api/user/getRolistForAssign",params)
}

// 获取被分配用的角色id
export async function getRoleIdByUserId(params){
    return await http.getRestApi("/api/user/getRoleIdByUserId",params)
}

// 分配角色保存
export async function assignSaveApi(params){
    return await http.post("/api/user/assignRole",params)
}

// 退出登录
export async function loginOutApi(params){
    return await http.post("/api/sysUser/loginOut",params)
}