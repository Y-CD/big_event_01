$(function () {
    // 自定义验证规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 2 || value.trim().length > 6) {
                return "昵称长度在2 ~ 6位之间！"
            }
        }
    });

    let layer = layui.layer;
    // 用户渲染
    initUserInfo();
    // 封装获取用户信息的函数
    function initUserInfo() {
        // 发送ajax
        $.ajax({
            url: '/my/userinfo',
            type: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功后渲染
                form.val('formUserInfo', res.data);

            }
        });
    };


    // 表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认提交事件
        e.preventDefault();
        // 重新用户渲染
        initUserInfo();
    });

    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/my/userinfo',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg("用户信息修改失败！");
                }
                // 修改成功
                layer.msg("用户信息修改成功！");

                // 调用父页面中更新用户信息和头像的方法
                window.parent.getUserInfo();
            }
        });
    });




});