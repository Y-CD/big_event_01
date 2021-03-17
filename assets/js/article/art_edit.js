$(function () {
    // 设置表单信息
    // 用等号切割 然后使用后面的值
    // console.log(location.search.split("=")[1]);
    let layer = layui.layer;
    let form = layui.form;
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
                // 在分类之后 调用initForm() 初始化 表单数据
                initForm();
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

    // 封装函数渲染数据到页面上
    function initForm() {
        let id = location.search.split("=")[1];
        // console.log(id);
        $.ajax({
            url: '/my/article/' + id,
            type: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功
                // 渲染到表单中
                form.val("layui-form", res.data);
                // tinymce 赋值
                tinyMCE.activeEditor.setContent(res.data.content);

                // 图片
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传头像！");
                }
                let newURL = baseUrl + res.data.cover_img;
                $image
                    .cropper('destroy')
                    .attr("src", newURL)
                    .cropper(options)

            }
        });
    }


    // 设置状态
    let state = "已发布";

    $("#btnSave2").on("click", function () {
        state = "草稿";
    });

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
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    });

    // 修改文章
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

    // 封装 修改文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
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
                layer.msg("恭喜你，修改文章成功！");

                setTimeout(function () {
                    // 跳转
                    window.parent.document.getElementById("art_list").click();
                }, 1000);
            }
        });
    }
})