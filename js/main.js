$(document).ready(function () {
    var xhr = new XMLHttpRequest();
    var host = 'http://127.0.0.1:5000'
    var input = 'body > div > div > div.uk-margin > input'

    function render_item_view(dirs, files) {
        console.log(dirs)
        console.log(files)
    }

    function setup() {
        $(input).keyup(function (e) {
            if (e.keyCode == 13) {
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
        });
    }

    setup()

});