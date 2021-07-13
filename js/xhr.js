
function request(type, url, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        state = xhr.readyState;
        status = xhr.status;
        if (XMLHttpRequest.DONE == state && 200 == status) {
            json = JSON.parse(xhr.responseText)['data']
            success(json)
        } else {
            error(xhr)
        }
    }
    xhr.open(type, url, true)
    xhr.send();
}

function file_download(url, name) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
        download(e.target.response, name, 'application/octet-stream');
    };
    xhr.send();
}