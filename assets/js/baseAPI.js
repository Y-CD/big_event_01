
// 模拟 开发环境服务器路径地址
let baseUrl = 'http://api-breakingnews-web.itheima.net';

// 模拟 测试环境服务器路径地址
// let baseUrl = 'http://api-breakingnews-web.itheima.net';

// 模拟 生产环境服务器路径地址
// let baseUrl = 'http://api-breakingnews-web.itheima.net';


// $.ajaxPrefilter(); 可以在调用$.ajax 之前执行 拦截所有的ajax请求 会把拼接的地址给ajax请求的url
// 在响应的时候也会触发这个事件
$.ajaxPrefilter(function (option) {
    // 拼接地址
    option.url = baseUrl + option.url;

    // 身份验证  包含 /my/开头的路径的请求，就要手动添加 Authorization
    if (option.url.indexOf("/my/") != -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
        // 拦截所有响应 判断身份验证信息
        option.complete = function (res) {
            // console.log(res.responseJSON);
            let obj = res.responseJSON;
            if (obj.status == 1 && obj.message == "身份认证失败！") {
                // 清空本地token
                localStorage.removeItem('token');
                // 页面跳转
                location.href = '/login.html';
            }
        }
    }



});