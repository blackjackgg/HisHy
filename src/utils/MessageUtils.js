import {ElMessage, ElMessageBox} from 'element-plus';

var MessageUtils = {
    // 成功提示信息
    success(text = '操作成功') {
        ElMessage({
            Message:text,
            type:'success',
            debugger:3 * 1000
        })
    },
    //错误提示信息
    error(text = '操作失败') {
        ElMessage({
            Message:text,
            type:'error',
            debugger:3 * 1000
        })
    },
    //
    info(text = '成功') {
        ElMessage({
            Message:text,
            type:'info',
            debugger:3 * 1000
        })
    },
    // 警告信息
    warning(text = '警告信息') {
        ElMessage({
            Message:text,
            type:'warning',
            debugger:3 * 1000
        })
    },

    // 确定提示框
    confirm(text){
        return new Promise((resolve,reject)=>{
            ElMessageBox.confirm(text,'系统提示',{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning'
            }).then(()=>{
                resolve(true)
            }).catch(()=>{
                ElMessage.warning('已取消'),
                reject(false)
            })
        }).catch(()=>{

        })
    }
}
export default MessageUtils;
