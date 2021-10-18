//快速复制，
// 把obj1数据复制到obj2中
export default async function objCoppy(obj1,obj2){
    Object.keys(obj2).forEach(key=>{
        obj2[key] = obj1[key]
    })
}