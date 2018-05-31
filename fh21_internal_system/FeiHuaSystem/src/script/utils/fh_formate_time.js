const num_cn = ['日', '一', '二', '三', '四', '五', '六'];
const holiday = [

];

/**
 * 格式化时间 默认 2018-09-09
 * @param {*} dateInfo {date, type, fullTime}
 */ 
var formateTime = (dateInfo={}) => {
    var date = dateInfo.date || new Date();
    var type = dateInfo.type || '-';
    var fullTime = dateInfo.fullTime || false;

    if(Number(date)) date = new Date(date);
    if(!date.getFullYear) date = new Date();
    var fullYear = date.getFullYear();
    var month = date.getMonth() + 1;
    var today = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var formate_time = [fullYear, parseNum10(month), parseNum10(today)].join(type);
    if(fullTime) {
        formate_time += ' ' + [parseNum10(hour), parseNum10(minute), parseNum10(second)].join(':');
    }
    return formate_time;
}

var parseNum10 = num => {
    if(num.toString()[1]) return num;
    return '0' + num;
}

export default {
    formateTime,
    holiday,
    num_cn
}