//按钮权限判断
export default function hasPermisson(params){
    let hasTag = false
    let codeList = JSON.parse(sessionStorage.getItem('codeList'))
    for (let i=0;i<codeList.length;i++){
        if (codeList[i]=== params){
            hasTag = true
            break;
        }
    }
    return hasTag;
}