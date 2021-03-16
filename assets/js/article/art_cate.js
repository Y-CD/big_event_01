$(function () {

    let layer = layui.layer;
    // 调用函数 渲染数据
    initArtCateList();
    // 封装函数 获取数据
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                let str = template("tpl-art-cate", { data: res.data });
                $('tbody').html(str);
            }
        });
    }
    // 添加文章分类列表
    // 为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAdd').on('click', function () {
        // 利用框架代码，提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ["500px", "260px"],
            content: $('#dialog-add').html()
        });
    });

    // 通过代理的形式，为 form-add 表单绑定 submit 事件 添加分类
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 添加成功 重新渲染数据
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    });

    // 修改文章分类 展示表单
    let indexEdit = null;
    let form = layui.form;
    //  为编辑按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 利用框架代码，提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ["500px", "260px"],
            content: $('#dialog-edit').html()
        });

        // 获取id 发送ajax 获取数据 渲染到页面
        let id = $(this).attr("data-id");
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    });
    // 修改文章-提交
    $('body').on("submit", "#form-edit", function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功  

                layer.msg("恭喜你，文章类别修改成功！");
                layer.close(indexEdit);
                // 重新渲染数据
                initArtCateList();

            }
        });
    });


    // 删除
    $('tbody').on('click', ".btn-delete", function () {
        // 先获取id
        let id = $(this).attr("data-id");
        // 弹出确认框提示是否要删除
        layer.confirm('是否确认要删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                type: 'get',
                success: function (res) {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    // 删除成功 重新渲染
                    initArtCateList();
                    layer.msg("恭喜你，文章类别删除成功！");
                    layer.close(index);

                }
            });
        });
    });

})