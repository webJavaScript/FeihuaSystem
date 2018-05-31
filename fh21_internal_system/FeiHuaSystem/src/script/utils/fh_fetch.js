import es6 from 'es6-promise';
import fetch from 'isomorphic-fetch';
import fh_service from '../service/service';

es6.polyfill();

var response = (res) => {
    if (res.status >= 400) {
        console.log('url response failed: ', res);
        throw new Error("Bad response from server");
    }
    return res.json();
}
var failed = (err) => {
    console.log('fetch url faild: ', err);
}

/**
 * post上传数据
 * @param {*} url 请求地址
 * @param {*} data 参数 默认使用json格式
 * @param {*} headers 设置头部 new Headers()
 */
var urlPost = (url, data, headers) => {
    console.log('urlPost >>> url: ', url);
    return fetch(url, {
        method: 'POST',
        headers: headers || new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: data || ''
    }).then(response, failed)
}

/**
 * get下载数据
 * @param {*} url 请求地址
 * @param {*} headers 设置头部 new Headers()
 */
var urlGet = (url, headers) => {
    console.log('urlGet >>> url: ', url);
    return fetch(url, {
        method: 'GET',
        headers: new Headers({
            'X-FH-authtoken': fh_service.fhToken,
        })
    }).then(response);
}

export default {
    urlPost,
    urlGet
}