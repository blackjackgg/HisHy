import http from "@/http/request";
//登录
export async function login(parm){
    return await http.login("/api/user/login",parm)
}
//获取菜单数据
export async function getMenuList(){
    return await http.get("/api/sysUser/getPermissionList",null)
}
//刷新token
export async function refreshTokenApi(params){
    return await http.post("/api/sysUser/refreshToken",params)
}