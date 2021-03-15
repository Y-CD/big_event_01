$(function () {
    // 定义校验密码规则
    let form = layui.form;
    form.verify({
        // 1.密码
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6到16位，且不能出现空格"
        ],
        // 新旧密码 不重复
        samePwd: function (value) {
            // value是新密码 旧密码要获取
            if (value == $("[name=oldPwd]").val()) {
                return "新旧密码不能相同！";
            }
        },
        // 两次新密码必须相同
        rePwd: function (value) {
            // value 是再次输入的新密码，新密码需要获取
            if (value != $("[name=newPwd]").val()) {
                return "两次输入的密码不一致！"
            }
        }
    });

    // 表单提交
    $('#form').on('submit', function (e) {
        // 阻止默认的提交事件
        e.preventDefault();
        // 发送ajax
        $.ajax({
            url: '/my/updatepwd',
            type: 'post',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                // 成功提示
                layui.layer.msg('修改密码成功！');
                // 清空密码
                $("#form")[0].reset();

                // 清除token
                localStorage.removeItem("token");

                // 重新登录
                window.parent.location.href = "/login.html"

            }
        });
    });

    // 重置表单
    $("#btnReset").on("click", function (e) {
        // 阻止默认的提交事件
        e.preventDefault();

        $("#form")[0].reset();
    });


})