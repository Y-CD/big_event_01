// 入口函数
$(function () {
    // 登录和注册区域显示和隐藏 切换
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    // 登录和注册区域显示和隐藏 切换
    $('#link_login').on('click', function () {
        $('.reg_box').hide();
        $('.login_box').show();
    });


    // 需求2 
    // 自定义验证规则
    let form = layui.form;
    // verify 里面是一个对象 对象的属性是校验的规则名
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6到16位，且不能输入空格"
        ],
        // 确认密码规则
        repwd: function (value) {
            let pwd = $('.reg_box input[name=password]').val();
            // 比较
            if (value != pwd) {
                return "两次输入的密码不一致!"
            }
        }
    });


    // 注册功能
    let layer = layui.layer;
    $('#form_reg').on("submit", function (e) {
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $('.reg_box input[name=username]').val(),
                password: $('.reg_box input[name=password]').val(),
            },
            success: function (res) {
                // console.log(res);
                // 判断返回状态
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                // 提交成功
                // alert(res.message);
                layer.msg('注册成功，请登录!', { icon: 6 });

                // 手动转换到登录页面
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset();
            }
        });
    });


    // 登录功能
    $('#form_login').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            type: 'post',
            // $(this).serialize() 可以获取到表单里面带name的input的表单的值 而且是键值对的形式
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }

                // 提示信息
                layer.msg('登录成功', { icon: 6 });
                // 保存token 将来要用
                localStorage.setItem('token', res.token);
                // 跳转
                location.href = "/index.html";
            }
        });

    });


});