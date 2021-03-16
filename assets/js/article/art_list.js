$(function () {
    // 为 art_template 定义时间
    template.defaults.imports.dataFormat = function (dtStr) {
        // 初始化时间
        let dt = new Date(dtStr);

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss;

    }

    // 在个位数 的左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }




    // 定义提交参数
    let q = {
        cate_id: '', // 类型Id
        state: '', // 文章状态
        pagesize: 2, // 每页显示多少条数据
        pagenum: 1 // 页码值
    };

    // 初始化文章列表
    let layer = layui.layer;
    // 调用函数
    initTable();
    // 封装函数
    function initTable() {
        // 发送ajax
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败！');
                }

                // 成功
                let htmlStr = template('tpl-table', { data: res.data });
                // 渲染数据到tbody
                $("tbody").html(htmlStr);
                // 调用分页
                renderPage(res.total);
            }
        });
    }

    // 初始化分类
    let form = layui.form;
    // 调用函数
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 赋值
                let htmlStr = template("tpl-cate", { data: res.data });
                $('[name=cate_id]').html(htmlStr);
                // 对于select标签 在赋值之后 要查询渲染
                form.render();
            }
        });
    }

    // 筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();

        // 获取
        let state = $("[name=state]").val();
        let cate_id = $('[name=cate_id]').val();

        // 赋值
        q.state = state;
        q.cate_id = cate_id;

        // 初始化文章列表
        initTable();
    });

    // 分页功能
    let laypage = layui.laypage;
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 把最新的页码值，赋值到 q 这个查询参数对象中 
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit  // 每页显示几条数据
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }


    // 点击删除
    $('tbody').on('click', '.btn-delete', function () {
        let len = $('.btn-delete').length;
        // 获取到文章的 id
        let id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    layer.msg('删除文章成功！');
                    initTable();
                }
            })

            layer.close(index)
        })
    })



})