
// 模拟 开发环境服务器路径地址
let baseUrl = 'http://api-breakingnews-web.itheima.net';

// 模拟 测试环境服务器路径地址
// let baseUrl = 'http://api-breakingnews-web.itheima.net';

// 模拟 生产环境服务器路径地址
// let baseUrl = 'http://api-breakingnews-web.itheima.net';


// $.ajaxPrefilter(); 可以在调用$.ajax 之前执行 拦截所有的ajax请求
// 在响应的时候也会触发这个事件
$.ajaxPrefilter(function (option) {
    option.url = baseUrl + option.url;
});