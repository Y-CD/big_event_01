$(function () {
    // 获取用户信息 渲染到页面上
    getUserInfo();

    // 点击退出按钮 实现退出功能
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('是否确认退出？', { icon: 3 }, function (index) {
            // 清空本地的token
            localStorage.removeItem('token');
            // 页面跳转
            location.href = "/login.html"
            // 关闭询问框
            layer.close(index);
        });
    })






});

// 封装函数  用于获取用户信息 
// 封装到入口函数的外面
function getUserInfo() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     // 重新登录 因为token信息12小时过期
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            // 请求失败
            if (res.status != 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功
            renderAvatar(res.data);
        }
    });
};

// 渲染文字和头像的函数
function renderAvatar(user) {
    // 渲染名称
    let name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);

    // 渲染头像
    if (user.user_pic != null) {
        // 有头像 渲染图片头像 隐藏文字头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 无头像 渲染文字头像 隐藏图片头像
        $('.layui-nav-img').hide();
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}