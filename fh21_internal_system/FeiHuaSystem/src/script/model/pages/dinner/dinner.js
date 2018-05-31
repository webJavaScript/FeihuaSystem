import React from 'react';
import { Button, Layout, notification, Row, Col, Icon, Modal } from 'antd';
import PageHeader from '../page_header';
import fh_fetch from '../../../utils/fh_fetch';
import fh_service from '../../../service/service';
import fh_date from '../../../utils/fh_formate_time';
import fh_run from '../../../fh_run';

import '../../../../style/model/pages/dinner/dinner.css';

const { Content } = Layout;
var timerDinner = null;

class DinnerUserData extends React.Component {
    constructor(props){
        super(props);
        this.state = {}
    }
    render() {
        var dinnerData = this.props.dinnerList || {};
        var dinners = dinnerData.list || [];
        dinners = dinners.map(dinner => 
            <span key={dinner.addtime}>{dinner.username}</span>
        )
        return(
            <Layout>
                <Content className="fh-dinner-user-content">
                    <div>{dinnerData.total || 0}人订餐：今日({fh_date.formateTime()})</div>
                    {dinners}
                </Content>
            </Layout>
        )
    }
}

class DinnerData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dinnerData: {}
        }
    }
    render() {
        var dinnerData = this.props.dinnerList || {};
        var dinners = dinnerData.list || [];
        dinners = dinners.map(dinner => 
            <Row key={dinner.addtime} className="fh-dinner-list-list">
                <Col span={1} />
                <Col span={4}>{fh_date.formateTime({date: dinner.addtime * 1000})}</Col>
                <Col span={2}>{dinnerData.state === '1' ? '已订餐' : '已取消'}</Col>
                <Col span={17} />
            </Row>
        )
        return(
            <Layout>
                <Content className="fh-dinner-list-content">
                    <Row className="fh-dinner-list-state">
                        <Col span={1} />
                        <Col span={8}>
                        您今日{dinnerData.state === '1' ? '已' : '未'}订餐
                        </Col>
                        <Col span={15} />
                    </Row>
                    {dinners.length ? <Row className="fh-dinner-list-title">
                        <Col span={1} />
                        <Col span={4}>日期</Col>
                        <Col span={2}>订餐</Col>
                        <Col span={17} />
                    </Row> : ''}
                    {dinners}
                </Content>
            </Layout>
        )
    }
}

class DinnerBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBookDinner: false,
            dinnerBtnLoading: false,
            isDisabled: false
        }
        this.bookDinner = this.bookDinner.bind(this);
        this.cancelDinner = this.cancelDinner.bind(this);
        this.disableBookDinnerBtn = this.disableBookDinnerBtn.bind(this);
    }
    bookDinner() {
        var url = fh_service.fhSystemHost + 'api/dinner?state=1';
        this.setState({
            dinnerBtnLoading: true
        })
        fh_fetch.urlGet(url).then(data => {
            if(data.code === 1){
                notification['success']({
                    message: '订餐成功'
                });
                this.setState({
                    isBookDinner: true
                });
                this.props.onChangeBookDinner();
            } else {
                notification['error']({
                    message: data.msg || '订餐失败'
                });
            }
            this.setState({
                dinnerBtnLoading: false
            })
        })
    }
    cancelDinner() {
        this.setState({
            dinnerBtnLoading: true
        });
        var _this = this;
        Modal.confirm({
            title: '提示',
            content: '取消订餐后，今日不能再次订餐，确定取消订餐吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                var url = fh_service.fhSystemHost + 'api/dinner?state=2';
                fh_fetch.urlGet(url).then(data => {
                    if(data.code === 1){
                        notification['success']({
                            message: '取消订餐成功',
                            description: '今日不可再次订餐'
                        });
                        _this.setState({
                            isBookDinner: false
                        })
                        // this.disableBookDinnerBtn();
                        _this.props.onChangeBookDinner();
                    } else {
                        notification['error']({
                            message: data.msg || '取消订餐失败'
                        });
                    }
                    _this.setState({
                        dinnerBtnLoading: false
                    })
                });        
            },
            onCancel() {}
        })
    }
    /**
     * 临时冻结订餐功能
     * 默认 1分钟
     */ 
    disableBookDinnerBtn(){
        this.setState({
            isDisabled: true
        })
        setTimeout(() => {
            console.log('请继续订餐……');
            this.setState({
                isDisabled: false
            })
        },60000)
    }
    componentDidMount() {
        
    }
    render() {
        var isDinner = this.props.isBookDinner || this.state.isBookDinner;
        return (
            <Layout>
                <Content className="fh-dinner-btn">
                    {!isDinner ? <Button type="primary" loading={this.state.dinnerBtnLoading} disabled={this.state.isDisabled} onClick={this.bookDinner}>
                        订餐
                    </Button>:
                    <Button loading={this.state.dinnerBtnLoading} onClick={this.cancelDinner}>
                        取消订餐
                    </Button>}
                    <span className="dinner-limit">* 下午5:50前订餐或取消订餐</span>
                </Content>
            </Layout>
        ) 
    }
}

class Dinner extends React.Component {
    constructor() {
        super();
        this.state = {
            dinnerUserData: fh_run.dinnerUserList
        }
        this.checkDinner = this.checkDinner.bind(this);
        this.checkDinnerRoot = this.checkDinnerRoot.bind(this);
    }
    checkDinner() {
        var url = fh_service.fhSystemHost + 'api/dinner';
        fh_fetch.urlGet(url).then(data => {
            if(data.state === '2'){
                this.setState({
                    isBookDinner: false,
                    dinnerData: data
                })
            } else {
                this.setState({
                    isBookDinner: true,
                    dinnerData: data
                });
            }
        });
    }
    checkDinnerRoot() {
        if(!fh_run.isRootUser) return;
        var url = fh_service.fhSystemHost + 'api/dinners';
        fh_fetch.urlGet(url).then(data => {
            this.setState({
                dinnerUserData: data
            });
            fh_run.dinnerUserList = data;
        });
        clearInterval(timerDinner);
        timerDinner = setTimeout(this.checkDinnerRoot, 3000);
    }
    componentWillMount() {
        this.checkDinner();
        this.checkDinnerRoot();
    }
    componentWillUnmount() {
        clearTimeout(timerDinner);
    }
    render() {
        return (
            <Layout className="fh-dinner-layout">
                <PageHeader title={<span><Icon type="coffee" /><span>订餐系统</span></span>} />
                <Content className="fh-dinner-content">
                    <DinnerBtn isBookDinner={this.state.isBookDinner} onChangeBookDinner={this.checkDinner} className="fh-dinner-btn-content" />
                    {fh_run.isRootUser ? <DinnerUserData dinnerList={this.state.dinnerUserData} /> : ''}
                    <DinnerData dinnerList={this.state.dinnerData} />
                </Content>
            </Layout>
        )
    }
}

export default Dinner;