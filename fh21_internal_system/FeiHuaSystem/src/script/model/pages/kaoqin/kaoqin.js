import React from 'react';
import {Row, Col, Button, Icon, Layout} from 'antd';
import PageHeader from '../page_header';
import fh_service from '../../../service/service';
import fh_fetch from '../../../utils/fh_fetch';
import fh_run from '../../../fh_run';
import fh_date from '../../../utils/fh_formate_time';
import '../../../../style/model/pages/kaoqin/kaoqin.css';

const {Header, Content, Footer} = Layout;
const KAOQIN_TODAY = fh_run.KAOQIN_TODAY;
const KAOQIN_NOW_DATE = !KAOQIN_TODAY ? new Date() : new Date(KAOQIN_TODAY);
const ROLE_ROOTER = fh_run.userInfo.id === 3;

/**
 * 考勤列表UI
 * 展示考勤 [姓名,]日期,星期,上班时间,下班时间,时长
 * 未打卡描红，迟到描红(管理员)
 */ 
class KaoqinList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }
    render(){
        var rows = ['正在加载…'];
        var username = this.props.queryOtherName;
        var isLate = this.props.kaoqinLate;
        rows = this.props['kaoqin-data'].map((kaoqin, index) => {
            var k_n = kaoqin.username || username;
            var k_d = kaoqin.time || kaoqin.min.split(' ')[0];
            var k_a = (!kaoqin.min || kaoqin.min === '未打卡') ? '未打卡' : kaoqin.min.split(' ')[1].slice(0, 5);
            var k_p = (!kaoqin.max || kaoqin.max === '未打卡') ? '未打卡' : kaoqin.max.split(' ')[1].slice(0, 5);
            var k_day = kaoqin.day || `星期${fh_date.num_cn[new Date(k_d).getDay()]}`;
            var k_l = kaoqin.long;
            var lateTimeColor = (isLate && fh_run.isRootUser) || (k_a === '未打卡') ? 'red' : '';
            var lateTimeColor_k_p = (k_p === '未打卡') ? 'red' : '';
            return (!(fh_run.isRootUser && username) ? <Row key={index}>
                <Col span={1} />
                <Col span={6}>{k_d}</Col>
                <Col span={3}>{k_day}</Col>
                <Col span={6} style={{color: lateTimeColor}}>{k_a}</Col>
                <Col span={6} style={{color: lateTimeColor_k_p}}>{k_p}</Col>
                <Col span={2}>{k_l}</Col>
            </Row> : <Row key={index}>
                <Col span={1} />
                <Col span={3}>{k_n}</Col>
                <Col span={3}>{k_d}</Col>
                <Col span={3}>{k_day}</Col>
                <Col span={6} style={{color: lateTimeColor}}>{k_a}</Col>
                <Col span={6} style={{color: lateTimeColor_k_p}}>{k_p}</Col>
                <Col span={2}>{k_l}</Col>
            </Row>)
        });
        if(!rows.length) {
            rows = ['暂无数据！'];
        }
        return (
            <Content className="page-kaoqin-content-content">
                {rows}
            </Content>
        )
    }
}
/**
 * 获取考勤数据
 * 默认获取本周数据
 */ 
class Kaoqin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kaoqin_data: {},
            kaoqin_pageSize: 7,
            kaoqin_currentPage: 1,
            queryOtherName: props.queryOtherName,
            queryBtnLoading: false
        }
        this.getKaoQinOfToday = this.getKaoQinOfToday.bind(this);
        this.getKaoQinOfDay = this.getKaoQinOfDay.bind(this);
        this.getKaoQinOfMonth = this.getKaoQinOfMonth.bind(this);
        this.queryKaoQin = this.queryKaoQin.bind(this);
        this.getKaoQinOfLastMonth = this.getKaoQinOfLastMonth.bind(this);
        this.paginationChange = this.paginationChange.bind(this);
    }
    /**
     * 当前用户使用，查询自己的考勤记录
     * @param {*} beginTime 考勤机开始时间
     * @param {*} endTime 考勤机结束时间
     * 废弃
     */ 
    getKaoQinJiForUser(beginTime, endTime) {
        var url = fh_service.fhSystemHost + 'api/attendance?s_time=' + beginTime + '&e_time=' + endTime + '&page=1&limit=500';
        return fh_fetch.urlGet(url).then(data => {
            return this.setState({
                kaoqin_data: data,
                kaoqin_total: parseFloat(data.Total)
            })
        });
    }
    /**
     * 管理员使用，根据用户名或用户id获取考勤机
     * @param {*} beginTime 考勤机开始时间
     * @param {*} endTime 考勤机结束时间
     * @param {*} uId 用户id
     * @param {*} userName 用户名
     * 废弃
     */ 
    getKaoQinJiForRoot(beginTime, endTime, uId, userName) {
        var url = fh_service.fhSystemHost + 'api/attendance?s_time=' + beginTime + '&e_time=' + endTime + '&uid=' + uId + '&userName=' + userName;
        return fh_fetch.urlGet(url).then(data => {
            return this.setState({
                kaoqin_data: data,
                kaoqin_total: parseFloat(data.Total)
            })
        });
    }
    /**
     * 根据查询类型和用户id获取考勤
     * @param {*} query.type 查询类型 可选 [week, month, lastmonth] 默认 week
     * @param {*} query.uId 用户id 管理员用户
     */ 
    queryKaoQin(query) {
        query = query || {};
        var type = query.type || 'week';
        var uId = query.uId || '';
        var url = fh_service.fhSystemHost + 'api/attendance?querytype=' + type + '&uid=' + uId;
        this.setState({
            queryBtnLoading: true
        })
        return fh_fetch.urlGet(url).then(data => {
            if(type === 'week') data.list.reverse();
            return this.setState({
                kaoqin_data: data,
                kaoqin_total: ((data.list && data.list.length) || 0),
                queryBtnLoading: false,
                kaoqin_currentPage: 1,
                queryOther: data.username
            })
        }).then(data => {
            this.paginationChange(this.state.kaoqin_currentPage, this.state.kaoqin_pageSize);
        });
    }
    /**
     * 
     * @param {*} beginTime 
     * @param {*} endTime 
     * @param {*} user 
     * 废弃
     */ 
    getKaoQinJi(beginTime, endTime, user) {
        this.setState({
            kaoqin_currentPage: 1
        })
        if(!!ROLE_ROOTER) {
            var uId, userName;
            if(Number(user)) uId = user;
            else userName = user;
            this.getKaoQinJiForRoot(beginTime, endTime, uId, userName).then(data => {
                this.paginationChange(this.state.kaoqin_currentPage, this.state.kaoqin_pageSize);
            });
        } else {
            this.getKaoQinJiForUser(beginTime, endTime).then(data => {
                this.paginationChange(this.state.kaoqin_currentPage, this.state.kaoqin_pageSize);
            });
        }
    }
    /**
     * 今日考勤
     * 管理员默认展示
     * 废弃
     */ 
    getKaoQinOfToday() {
        var date_now = new Date(KAOQIN_NOW_DATE.getTime());
        var endTime = fh_date.formateTime({date: date_now});
        var beginTime = fh_date.formateTime({date: date_now});
        this.getKaoQinJi(beginTime, endTime);
    }
    /**
     * 本周考勤
     * 本周一到今日考勤数据
     * 员工默认展示
     */
    getKaoQinOfDay() {
        var query = {type: 'week'};
        if(fh_run.isRootUser) {
            query.uId = this.state.queryOtherName;
        }
        this.queryKaoQin(query);
        // var chaDay = [6, 0, 1, 2, 3, 4, 5];
        // var date_now = new Date(KAOQIN_NOW_DATE.getTime());
        // var date = date_now.getDate();
        // var day = date_now.getDay();
        // var endTime = fh_date.formateTime({date: date_now});
        // var beginTime = fh_date.formateTime({date: date_now.setDate(date - chaDay[day])});
        // this.getKaoQinJi(beginTime, endTime);
    }
    /**
     * 本月考勤
     * 本月1日到今日考勤数据
     */ 
    getKaoQinOfMonth() {
        var query = {type: 'month'};
        if(fh_run.isRootUser) {
            query.uId = this.state.queryOtherName;
        }
        this.queryKaoQin(query);
        // var date_now = new Date(KAOQIN_NOW_DATE.getTime());
        // var endTime = fh_date.formateTime({date: date_now});
        // var beginTime = fh_date.formateTime({date: date_now.setDate(1)});
        // this.getKaoQinJi(beginTime, endTime);
    }
    /**
     * 上一个月考勤
     * 上月整月数据
     */ 
    getKaoQinOfLastMonth() {
        var query = {type: 'lastmonth'};
        if(fh_run.isRootUser) {
            query.uId = this.state.queryOtherName;
        }
        this.queryKaoQin(query);
        // var date_now = new Date(KAOQIN_NOW_DATE.getTime());
        // var month = date_now.getMonth();
        // var endTime = fh_date.formateTime({date: date_now.setMonth(month, 0)});
        // var beginTime = fh_date.formateTime({date: date_now.setDate(1)});
        // this.getKaoQinJi(beginTime, endTime);
    }
    paginationChange(page, pageSize){
        // console.log('paginationChange: ', page, pageSize);
        var total = this.state.kaoqin_data.list || [];
        this.setState({
            kaoqin_currentPageData: total.slice((page - 1) * pageSize, page * pageSize),
            kaoqin_currentPage: page
        })
    }
    componentDidMount() {
        this.getKaoQinOfDay();
    }
    render() {
        // console.log('this.state.kaoqin_data >> kaoqin: ', this.state.kaoqin_data);
        return(
            <Layout>
                <PageHeader className="page-kaoqin-title" title={<span><Icon type="windows-o" /><span>打卡记录</span></span>}>
                    <div className="page-header-kaoqin-tools">
                        <Button className="kaoqin-tools-query" loading={this.state.queryBtnLoading} onClick={this.getKaoQinOfDay}>本周</Button>
                        <Button className="kaoqin-tools-query" loading={this.state.queryBtnLoading} onClick={this.getKaoQinOfMonth}>本月</Button>
                        <Button className="kaoqin-tools-query" loading={this.state.queryBtnLoading} onClick={this.getKaoQinOfLastMonth}>上一月</Button>
                    </div>
                </PageHeader>
                <Content className="page-kaoqin-content">
                    <Header className="page-kaoqin-title page-kaoqin-content-title">
                        {(!(fh_run.isRootUser && this.state.queryOtherName)) ? 
                        <Row>
                            <Col span={1} />
                            <Col span={6}>日期</Col>
                            <Col span={3}>星期</Col>
                            <Col span={6}>上班</Col>
                            <Col span={6}>下班</Col>
                            <Col span={2}>时长</Col>
                        </Row> :
                        <Row>
                            <Col span={1} />
                            <Col span={3}>姓名</Col>
                            <Col span={3}>日期</Col>
                            <Col span={3}>星期</Col>
                            <Col span={6}>上班</Col>
                            <Col span={6}>下班</Col>
                            <Col span={2}>时长</Col>
                        </Row>}
                    </Header>
                    {/* <Content className="page-kaoqin-content-content"> */}
                        <KaoqinList kaoqin-data={this.state.kaoqin_data.list || []} queryOtherName={!!this.state.queryOtherName && this.state.queryOther} />
                    {/* </Content> */}
                </Content>
                <Footer>
                    {/* <Pagination
                        current={this.state.kaoqin_currentPage}
                        pageSize={this.state.kaoqin_total}
                        total={this.state.kaoqin_total}
                        showTotal={total => `共 ${total} 条`}
                        onChange={this.paginationChange}
                        hideOnSinglePage /> */}
                </Footer>
            </Layout>
        )
    }
}


export default Kaoqin;