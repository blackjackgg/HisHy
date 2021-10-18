//循环菜单判断是否是末级
export default function leafUtils() {
    const setLeaf = (arr) => {
        if (arr && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                //如果长度大于零，说明还有下级；就不是末级
                if (arr[i].children && arr[i].children.length > 0) {
                    arr[i].open = false;
                }else {
                    arr[i].open = true;
                }
            }
        }
        return arr
    }
    return{
        setLeaf
    }
}