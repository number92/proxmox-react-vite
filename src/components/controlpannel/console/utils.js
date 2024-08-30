function urlEncode(object) {
    var i, value, params = [];

    for (i in object) {
        if (object.hasOwnProperty(i)) {
            value = object[i];
            if (value === undefined) value = '';
            params.push(encodeURIComponent(i) + '=' + encodeURIComponent(String(value)));
        }
    }

    return params.join('&');
}

var msgtimeout;
var severities = {
    normal: 1,
    warning: 2,
    error: 3,
};


function detectWebgl() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    return !!gl;
}

function showMsg(message, timeout, severity) {
    var status_bar = document.getElementById('status_bar');
    clearTimeout(msgtimeout);

    status_bar.classList.remove('normal');
    status_bar.classList.remove('warning');
    status_bar.classList.remove('error');

    status_bar.textContent = message;

    severity = severity || severities.normal;

    switch (severity) {
        case severities.normal:
            status_bar.classList.add('normal');
            break;
        case severities.warning:
            status_bar.classList.add('warning');
            break;
        case severities.error:
            status_bar.classList.add('error');
            break;
        default:
            throw "unknown severity";
    }

    status_bar.classList.add('open');

    if (timeout !== 0) {
        msgtimeout = setTimeout(hideMsg, timeout || 1500);
    }
}

function hideMsg() {
    clearTimeout(msgtimeout);
    status_bar.classList.remove('open');
}

function getQueryParameter(name) {
    var params = location.search.slice(1).split('&');
    var result = "";
    params.forEach(function (param) {
        var components = param.split('=');
        if (components[0] === name) {
            result = components.slice(1).join('=');
        }
    });
    return result;
}

async function API2Request(reqOpts) {
    const { method, url, params, success, failure, callback } = reqOpts;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Cache-Control': 'no-cache'
            },
            //body: method === 'POST' || method === 'PUT' ? urlEncode(params) : null
        });
        if (!response.ok) {
            console.log(response)

            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        let result;
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.match(/application\/json/)) {
            result = await response.json();
        } else {
            console.log(response)
            throw new Error('Unexpected content type: ' + contentType);
        }

        if (success) {
            success(result);
        }

        return result;
    } catch (error) {
        console.log(error)
        if (failure) {

            failure(error.message);
        }
        if (callback) {
            callback(false);
        }
    }
}

// function API2Request(reqOpts) {
//     var me = this;

//     reqOpts.method = reqOpts.method || 'GET';

//     var xhr = new XMLHttpRequest();

//     xhr.onload = function () {
//         var scope = reqOpts.scope || this;
//         console.log(scope)
//         var result;
//         var errmsg;

//         if (xhr.readyState === 4) {
//             var ctype = xhr.getResponseHeader('Content-Type');
//             if (xhr.status === 200) {

//                 if (ctype.match(/application\/json;/)) {
//                     result = JSON.parse(xhr.responseText);
//                 } else {
//                     errmsg = 'got unexpected content type ' + ctype;
//                 }
//             } else {
//                 errmsg = 'Error ' + xhr.status + ': ' + xhr.statusText;
//             }
//         } else {
//             errmsg = 'Connection error - server offline?';
//         }

//         if (errmsg !== undefined) {
//             if (reqOpts.failure) {
//                 reqOpts.failure.call(scope, errmsg);
//             }
//         } else {
//             if (reqOpts.success) {
//                 reqOpts.success.call(scope, result);
//             }
//         }
//         if (reqOpts.callback) {
//             reqOpts.callback.call(scope, errmsg === undefined);
//         }
//     }

//     var data = urlEncode(reqOpts.params || {});

//     if (reqOpts.method === 'GET') {
//         xhr.open(reqOpts.method, reqOpts.url);
//     } else {
//         xhr.open(reqOpts.method, reqOpts.url);
//     }
//     xhr.setRequestHeader('Cache-Control', 'no-cache');
//     if (reqOpts.method === 'POST' || reqOpts.method === 'PUT') {
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         // xhr.setRequestHeader('CSRFPreventionToken', PVE.CSRFPreventionToken);
//         xhr.send(data);
//     } else if (reqOpts.method === 'GET') {
//         console.log(xhr)
//         xhr.send();
//     } else {
//         throw "unknown method";
//     }
// }

function getTerminalSettings() {
    var res = {};
    var settings = ['fontSize', 'fontFamily', 'letterSpacing', 'lineHeight'];
    if (localStorage) {
        settings.forEach(function (setting) {
            var val = localStorage.getItem('pve-xterm-' + setting);
            if (val !== undefined && val !== null) {
                res[setting] = val;
            }
        });
    }
    return res;
}

export {
    urlEncode,
    showMsg,
    hideMsg,
    getQueryParameter,
    API2Request,
    getTerminalSettings,
    severities,
    detectWebgl
}
