import fh_config from '../fh_config';

const officeHoset = 'http://system.sandbox.fh21.com.cn/';
const testHoset = 'http://system.dev.fh21.com.cn/';
const fhSystemHost =  fh_config.experiment ? testHoset : officeHoset;
var fhToken = '';

export default {
    officeHoset,
    testHoset,
    fhSystemHost,
    fhToken
}