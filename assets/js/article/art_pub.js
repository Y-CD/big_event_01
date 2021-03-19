$(function () {
    // 初始化分类
    let form = layui.form;
    let layer = layui.layer;
    // 调用函数
    initCate();

    // 封装函数
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function (res) {
                // console.log(res);
                // 校验
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功 赋值
                let htmlStr = template("tpl-cate", { data: res.data });
                $("[name=cate_id]").html(htmlStr);
                // 对于select标签 在赋值之后 要查询渲染
                form.render();
            }
        });
    }


    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击按钮 选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    });

    // 设置图片
    $("#coverFile").change(function (e) {
        // 拿到用户选择的图片
        let file = e.target.files[0];
        // 非空校验
        if (file == undefined) {
            return layer.msg("请选择图片！");
        }

        // 根据选择的文件 创建一个对应的URL地址
        let newURL = URL.createObjectURL(file);

        // 先销毁之前的区域  在重新设置图片路径 之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });


    // 设置状态 默认值是已发布
    let state = "已发布";
    // 点击 保存为草稿按钮 把值改成 草稿
    $("#btnSave2").on("click", function () {
        state = "草稿";
    });

    // 添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();

        // 创建FormData对象收集数据
        let fd = new FormData($(this)[0]);
        // 放入状态
        fd.append("state", state);

        // 放入图片
        $image
            .cropper("getCroppedCanvas", {
                // 创建一个canvas画布
                width: 400,
                height: 280,
            })
            // 将canvas 画布上的内容 转成文件对象
            .toBlob(function (blob) {
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发送ajax 要在toBlob 函数里面
                publishArticle(fd);
            })
    });

    // 封装 添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg("恭喜你，发布文章成功！");

                setTimeout(function () {
                    // 跳转
                    window.parent.document.getElementById("art_list").click();
                }, 1000);
            }
        });
    }

});