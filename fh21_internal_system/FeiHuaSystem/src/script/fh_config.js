// 实验特性
var experiment = false;
var setExperiment = function() {
    const fh_href = window.location.href;
    const fh_search = window.location.search;
    if(fh_search.slice(1) === 'x'){
        experiment = true;
        return;
    }
    // sandbox 为正式环境
    // system.sandbox.fh21.com.cn
    if(fh_href.indexOf('sandbox') > -1) {
        experiment = false;
        return;
    }
    if(fh_href.indexOf('dev') > -1) {
        experiment = true;
        return;
    }
}
setExperiment();

export default {
    experiment,
    setExperiment
}