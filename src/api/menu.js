import http from "@/http/request";

//获取菜单列表
export async function getMenuListApi(){
    return await http.get("api/menu/list")
}

//获取上级菜单
export async function getParentMenu(){
    return await http.get("api/menu/parent")
}

//新增权限
export async function addMenuApi(params){
    return await http.post("api/menu",params)
}

//编辑权限
export async function editMenuApi(params){
    return await http.put("api/menu",params)
}

//删除权限
export async function deleteMenuApi(params){
    return await http.delete("api/menu",params)
}