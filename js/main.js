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
                                <button class="uk-button uk-button-text uk-button-small iron-back">
                                    <span uk-icon="reply"></span>
                                </button>
                            </td>
                            <td></td>
                            <td class="uk-text-nowrap">
                                <button class="uk-button uk-button-default uk-width-1-3 uk-button-small">
                                    <span uk-icon="plus"></span>
                                </button>
                                <button class="uk-button uk-button-default uk-width-1-3 uk-button-small">
                                    <span uk-icon="upload"></span>
                                </button>
                            </td>
                        </tr>
        `
        folder = `
                        <tr>
                            <td><span uk-icon="folder"></span></td>
                            <td class="uk-text-truncate iron-folder">_folder_</td>
                            <td class="uk-text-nowrap">
                                <button class="uk-button uk-button-default uk-width-1-3 uk-button-small">
                                    <span uk-icon="minus"></span>
                                </button>
                            </td>
                        </tr>
        `
        file = `
                        <tr>
                            <td><span uk-icon="file"></span></td>
                            <td class="uk-text-truncate">_file_</td>
                            <td class="uk-text-nowrap">
                                <button class="uk-button uk-button-default uk-width-1-3 uk-button-small">
                                    <span uk-icon="minus"></span>
                                </button>
                                <button class="uk-button uk-button-default uk-width-1-3 uk-button-small">
                                    <span uk-icon="download"></span>
                                </button>
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