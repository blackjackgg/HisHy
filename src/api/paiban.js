import http from "@/http/request";

//获取班制
export async function getFreCaList(){
    return await http.get("api/FrequencyCategory/getFreCaList")
}

//获取班次
export async function getFrequency(fcId){
    return await http.get("api/Frequency/fcId",fcId)
}
//获取排班信息
export async function getWeekList(deptId){
    return await http.get("/api/PaiBan/week",deptId)
}

//查询弹窗信息
export async function getPaiDept(deptId){
    return await http.get("/api/PaiBan/paiDept",deptId)
}
//新增排班
export async function addPaiBan(garnt){
    return await http.post("/api/PaiBan/addPaiBan",garnt)
}