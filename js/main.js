$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    var host = 'http://127.0.0.1:5000'
    var input = '#iron-input'

    function render_item_view(dirs, files) {
        tbody = $("#iron-tbody")
        tbody.empty()
        html = `
                        <tr>
                            <td>
                                <button class="uk-button uk-button-text uk-button-small iron-back">返回</button>
                            </td>
                            <td></td>
                            <td class="uk-flex uk-flex-left uk-margin-small-right">
                                <button id="iron-mkdir" class="uk-button uk-button-text uk-button-small">新建</button>
                                <div uk-dropdown="mode: click; pos: top-justify">
                                    <div class="uk-flex">
                                        <input id="iron-new-folder" class="uk-input" type="text" placeholder="folder name">
                                        <button class="uk-button-primary uk-button-small">OK</button>
                                    </div>
                                </div>
                                <div class="uk-padding-small"></div>
                                <button id="iron-upload" class="uk-button uk-button-text uk-button-small">上传</button>
                            </td>
                        </tr>
        `
        folder = `
                        <tr>
                            <td><span uk-icon="folder"></span></td>
                            <td class="uk-text-truncate iron-folder">_folder_</td>
                            <td class="uk-flex uk-flex-left uk-margin-small-right">
                                <button class="uk-button uk-button-text uk-button-small">删除</button>
                            </td>
                        </tr>
        `
        file = `
                        <tr>
                            <td><span uk-icon="file"></span></td>
                            <td class="uk-text-truncate">_file_</td>
                            <td class="uk-flex uk-flex-left uk-margin-small-right">
                                <button class="uk-button uk-button-text uk-button-small">删除</button>
                                <div class="uk-padding-small"></div>
                                <button class="uk-button uk-button-text uk-button-small iron-download">下载</button>
                            </td>
                        </tr>
        `
        for (i = 0; i < dirs.length; ++i) {
            html += folder.replace('_folder_', dirs[i])
        }
        for (i = 0; i < files.length; ++i) {
            html += file.replace('_file_', files[i])
        }
        tbody.html(html)
        setup_back()
        setup_open_folder()
        setup_download()
    }

    function goto_folder() {
        xhr.onreadystatechange = function () {
            state = xhr.readyState;
            status = xhr.status;
            if (XMLHttpRequest.DONE == state && 200 == status) {
                json = JSON.parse(xhr.responseText)['data']
                render_item_view(json['dirs'], json['files'])
            }
        }
        xhr.open('GET', host + '/directories/readdir?path=' + encodeURI($(input).val()), true)
        xhr.send();
    }

    function pardir(path) {
        var p = ''
        for (i = path.length - 1; i >= 0; --i) {
            if ('/' == path.charAt(i)) {
                p = path.slice(0, i);
                break;
            }
        }
        if (p == '') {
            return '/'
        }
        return p
    }

    function setup_open_folder() {
        $('.iron-folder').click(function (e) {
            var p = $(input).val()
            if (p == '/') {
                $(input).val(p + $(this).text())
            } else {
                $(input).val(p + '/' + $(this).text())
            }
            goto_folder()
        })
    }

    function setup_back() {
        $('.iron-back').click(function (e) {
            var path = $(input).val()
            $(input).val(pardir(path))
            goto_folder()
        })
    }

    function download_file(uri, name) {
        var fxhr = new XMLHttpRequest();
        fxhr.open('GET', uri, true);
        fxhr.responseType = 'blob';
        fxhr.onload = function (e) {
            download(e.target.response, name, 'application/octet-stream');
        };
        fxhr.send();
    }

    function setup_download() {
        $('.iron-download').click(function (e) {
            var file = $(this).parent().prev().text()
            var current_dir = $(input).val()
            var uri = host + '/files/get?path='
            if (current_dir == '/') {
                uri += encodeURI(current_dir + file)
            } else {
                uri += encodeURI(current_dir + '/' + file)
            }
            download_file(uri, file)
        })
    }

    function setup() {
        $(input).keyup(function (e) {
            if (e.keyCode == 13) {
                goto_folder()
            }
        });
        goto_folder()
    }

    setup()

});