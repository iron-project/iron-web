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

function combine(current, name) {
    if (current == '/') {
        return current + name;
    } else {
        return current + '/' + name;
    }
}

function make_url(prefix, current, name) {
    url = host + prefix
    return url + encodeURI(combine(current, name))
}
