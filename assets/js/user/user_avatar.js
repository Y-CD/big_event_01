$(window).on("load", function () {

    // 获取裁剪区域的DOM元素
    let $image = $("#image");
    // 配置选项
    const option = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 创建裁剪区域
    $image.cropper(option);


    // 点击上传手动触发 #file
    $("#btnChooseImage").on("click", function () {
        $('#file').click();
    });

    // 修改裁剪的图片
    let layer = layui.layer;
    // $("#file") 这个按钮发送变化
    $("#file").on("change", function (e) {
        // console.log(e.target.files[0]);
        // 拿到用户选择的文件    e.target代表事件源
        let file = e.target.files[0];
        // 非空校验
        if (file == undefined) {
            return layer.msg("请选择图片！");
        }
        // 根据选择的文件 创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域 在重新设置图片路径 之后在创建裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(option) //创建裁剪区域
    });

    // 点击确定上传头像
    $("#btnUpload").on("click", function () {
        // 获取 base64 类型的 头像
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL("image/png");

        // 发送ajax
        $.ajax({
            url: '/my/update/avatar',
            // method 也是设置 请求类型
            method: 'post',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg("恭喜你，头像更换成功！");
                window.parent.getUserInfo();
            }
        });
    });


});