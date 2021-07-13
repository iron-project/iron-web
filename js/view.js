function refresh() {
    request('GET', make_url('/directories/readdir?path=', $('#iron-input').val()),
        function (json) {
            refresh_view(json['dirs', json['files']])
        },
        function (xhr) {
            UIkit.notification({
                message: '访问服务端失败！',
                pos: 'bottom-center',
                status: 'danger'
            })
        }
    )
}

function refresh_view(dirs, files) {
    tbody = $("#iron-tbody")
    tbody.empty()
    html = `
    <tr>
        <td>
            <button class="uk-button uk-button-text uk-button-small iron-back">返回</button>
        </td>
        <td></td>
        <td class="uk-flex uk-flex-left uk-margin-small-right">
            <button class="uk-button uk-button-text uk-button-small">新建</button>
            <div uk-dropdown="mode: click; pos: top-justify">
                <div class="uk-flex">
                    <input class="uk-input" type="text" placeholder="folder">
                    <button id="iron-mkdir" class="uk-button-primary uk-button-small">OK</button>
                </div>
            </div>
            <div class="uk-padding-small"></div>
            <button class="uk-button uk-button-text uk-button-small">上传</button>
            <div uk-dropdown="mode: click; pos: top-justify">
                <div class="js-upload uk-flex">
                    <div uk-form-custom="target: true">
                        <input type="file">
                        <input class="uk-input" type="text" placeholder="选择文件" disabled>
                    </div>
                </div>
                <progress id="js-progressbar" class="uk-progress" value="0" max="100"></progress>
            </div>
        </td>
    </tr>
        `
    folder = `
     <tr>
         <td><span uk-icon="folder"></span></td>
         <td class="uk-text-truncate iron-folder">_d_</td>
         <td class="uk-flex uk-flex-left uk-margin-small-right">
             <button class="uk-button uk-button-text uk-button-small">删除</button>
             <div uk-dropdown="mode: click; pos: bottom-justify">
                 <button class="uk-button-default uk-align-center uk-button-small uk-margin-small iron-rmdir">确定？</button>
             </div>
         </td>
     </tr>
        `
    file = `
     <tr>
         <td><span uk-icon="file"></span></td>
         <td class="uk-text-truncate">_f_</td>
         <td class="uk-flex uk-flex-left uk-margin-small-right">
             <button class="uk-button uk-button-text uk-button-small">删除</button>
             <div uk-dropdown="mode: click; pos: bottom-justify">
                 <button class="uk-button-default uk-align-center uk-button-small uk-margin-small">确定？</button>
             </div>
             <div class="uk-padding-small"></div>
             <button class="uk-button uk-button-text uk-button-small iron-download">下载</button>
         </td>
     </tr>
        `
    for (i = 0; i < dirs.length; ++i) {
        html += folder.replace('_d_', dirs[i])
    }
    for (i = 0; i < files.length; ++i) {
        html += file.replace('_f_', files[i])
    }
    tbody.html(html)

    bind_click_open()
    bind_click_back()
    bind_click_rmdir()

    bind_click_upload()
    bind_click_download()
}