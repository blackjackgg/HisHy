import Mock from 'mockjs'
import loginData from './loginData'
//登录
Mock.mock('http://localhost:8080/api/user/login', 'post', loginData.login)
//获取菜单数据
Mock.mock(RegExp("http://localhost:8080/api/user/getMenuList" + ".*"), 'get', loginData.getMenuList)

export default Mock