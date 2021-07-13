var host = 'http://127.0.0.1:5000'
var input = '#iron-input'

function bind_click_open() {
    $('.iron-folder').click(function (e) {
        var p = $(input).val()
        $(input).val(combine(p, $(this).text()))
        refresh()
    })
}

function bind_click_back() {
    $('.iron-back').click(function (e) {
        var path = $(input).val()
        $(input).val(pardir(path))
        refresh()
    })
}

function bind_click_download() {
    $('.iron-download').click(function (e) {
        var name = $(this).parent().prev().text()
        var url = make_url('/files/get?path=', $(input).val(), name)
        file_download(url, name)
    })
}

function bind_click_mkdir() {
    $('#iron-mkdir').click(function (e) {
        var name = $(this).prev().val()
        if (name == '') {
            return
        }
        var url = make_url('/directories/mkdir?path=', $(input).val(), name)
        request('POST', url,
            function (json) {
                if (json['status']) {
                    refresh()
                }
            },
            function (xhr) {
                UIkit.notification({
                    message: '访问服务端失败！',
                    pos: 'bottom-center',
                    status: 'danger'
                })
            })
    })
}

function bind_click_rmdir() {
    $('.iron-rmdir').click(function (e) {
        var name = $(this).parent().parent().prev().text()
        if (name == '') {
            return
        }
        var url = make_url('/directories/rmdir?path=', $(input).val(), name)
        request('DELETE', url,
            function (json) {
                if (json['status']) {
                    refresh()
                }
            },
            function (xhr) {
                UIkit.notification({
                    message: '访问服务端失败！',
                    pos: 'bottom-center',
                    status: 'danger'
                })
            })
    })
}

function bind_click_upload() {
    UIkit.upload('.js-upload', {
        method: 'POST',
        name: 'file',
        url: host,
        beforeAll: function () {
            this.url = make_url('/files/put?path=', $(input).val(), arguments[1][0].name)
        },
        progress: function (e) {
            var load = parseInt(e.loaded * 100 / e.total)
            $('#js-progressbar').val(load)
        },
        completeAll: function () {
            UIkit.notification({
                message: '上传完成！',
                pos: 'bottom-center',
            })
            refresh()
        }
    })
}

function bind_input_enter() {
    $(input).keyup(function (e) {
        if (e.keyCode == 13) {
            refresh()
        }
    });
}