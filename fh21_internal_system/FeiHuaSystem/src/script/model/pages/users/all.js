import React from 'react';
import { Row, Col, Layout, Pagination, Form, Input, Icon, Button, Radio, AutoComplete, Cascader, notification, Modal } from 'antd';
import fh_service from '../../../service/service';
import fh_fetch from '../../../utils/fh_fetch';
import fh_date from '../../../utils/fh_formate_time';
// import fh_run from '../../../fh_run';
import antd_form from '../../../template/antd_form';
import Kaoqin from '../../pages/kaoqin/kaoqin';
import '../../../../style/model/pages/kaoqin/kaoqin.css';
import '../../../../style/model/pages/users/all.css';

const { Header, Footer, Content } = Layout;
const AutoCompleteOption = AutoComplete.Option;
const { ChoiceDepartment, ChoiceUser, ChoiceUid, ChoiceState } = antd_form;
/**
 * 筛选员工
 */ 
class FilterUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_statu: 0,
            user_name: '',
            user_department: '',
            user_pageSize: 10,
            kaoqinji_department: [],
            kaoqinji_users: [],
            dataSource: []
        }
        this.userStatuChange = this.userStatuChange.bind(this);
        this.userNameChange = this.userNameChange.bind(this);
        this.userDepartmentChange = this.userDepartmentChange.bind(this);
        this.userPageSizeChange = this.userPageSizeChange.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.getKaoqinjiDepartment = this.getKaoqinjiDepartment.bind(this);
        this.getKaoqinjiUsers = this.getKaoqinjiUsers.bind(this);
        this.autoCompleteSelect = this.autoCompleteSelect.bind(this);
    }
    userStatuChange(e){
        var value = e.target.value;
        this.setState({
            user_statu: value
        })
    }
    autoCompleteSelect(value) {
        console.log(value);
        this.setState({
            user_name: value.split('-')[0],
        })
    }
    userNameChange(value) {
        // var value = e.target.value;
        console.log('userNameChange: ', value);
        this.setState({
            user_name: value.split('-')[0],
            dataSource: this.state.kaoqinji_users.filter(user => user.name.indexOf(value) > -1).map(user => 
                <AutoCompleteOption value={`${user.name}-${user.id}`} key={user.id} text={user.name}>
                    {`${user.name}-${user.id}`}
                </AutoCompleteOption>
            )
        })
    }
    userDepartmentChange(value) {
        // var value = e.target.value;
        console.log('userDepartmentChange: ', value);
        this.setState({
            user_department: value.slice(-1) || ''
        })
    }
    parseDepartmentList(department) {
        department.value = department.id;
        department.label = department.title;
        !!department.children && department.children.forEach(kid => this.parseDepartmentList(kid));
        return department;
    }
    userPageSizeChange(e) {
        var value = e.target.value;
        this.setState({
            user_pageSize: value > 4 ? value : 5
        })
    }
    fetchUsers() {
        var _this = this;
        this.props.onFetchUser({
            user_name: _this.state.user_name,
            user_department: _this.state.user_department,
            user_statu: _this.state.user_statu,
            user_pageSize: _this.state.user_pageSize
        })
        // console.log('查询信息: ', this.state);
    }
    /**
     * 获取考勤机部门数据
     */ 
    getKaoqinjiDepartment() {
        var url = fh_service.fhSystemHost + 'api/department';
        fh_fetch.urlGet(url).then(data => {
            this.setState({
                kaoqinji_department: data,
                optionsCascader: !data ? [] : data.map(department => 
                    this.parseDepartmentList(department)
                )
            })
        })
    }
    /**
     * 获取考勤机用户数据 
     */ 
    getKaoqinjiUsers() {
        var url = fh_service.fhSystemHost + 'api/attusers';
        fh_fetch.urlGet(url).then(data => {
            this.setState({
                kaoqinji_users: data.sort((a,b)=>a.id - b.id)
            })
        })
    }
    componentDidMount() {
        this.getKaoqinjiDepartment();
        this.getKaoqinjiUsers();
    }
    render() {
        const { dataSource, optionsCascader } = this.state;
        return(
            <Form className="fh-user-form">
                <Form.Item>
                    用户名: 
                    <AutoComplete
                        placeholder="输入员工姓名"
                        className="user-name"
                        dataSource={dataSource}
                        onSelect={this.autoCompleteSelect}
                        onChange={this.userNameChange}
                        optionLabelProp="text" />
                    {/* <Input placeholder="用户名" className="user-name" onChange={this.userNameChange} /> */}
                </Form.Item>
                <Form.Item>
                    部门: 
                    <Cascader options={optionsCascader} className="user-department" onChange={this.userDepartmentChange} placeholder="选择部门" />
                    {/* <Select defaultValue={this.state.user_department} className="user-department" onChange={this.userDepartmentChange}>
                        <Select.Option value={0}>请选择</Select.Option>
                        <Select.Option value={1}>技术部</Select.Option>
                    </Select> */}
                </Form.Item>
                <Form.Item>
                    状态: 
                    <Radio.Group value={this.state.user_statu} className="user-statu" onChange={this.userStatuChange}>
                        <Radio value={0} defaultChecked>全部</Radio>
                        <Radio value={1} >在职</Radio>
                        <Radio value={2} >离职</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    每页条数: 
                    <Input placeholder="10" type="number" min="5" className="user-pagesize" onChange={this.userPageSizeChange} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" className="user-fetch" onClick={this.fetchUsers}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}
/**
 *  查看员工考勤
 */ 
class FetchKaoqin extends React.Component {
    constructor(){
        super();
        this.state = {
            kaoqinLoading: false
        }
        this.getKaoqinOfUser = this.getKaoqinOfUser.bind(this);
    }
    getKaoqinOfUser() {
        Modal.info({
            title: '员工考勤',
            okText: '关闭',
            maskClosable: true,
            content: <Kaoqin queryOtherName={this.props.userId} />,
            width: 1000
        })
    }
    render() {
        return(
            <Button type="primary" loading={this.kaoqinLoading} onClick={this.getKaoqinOfUser}>
                考勤
            </Button>
        )
    }
}
/**
 * 重置密码
 */ 
class ResetPassword extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            resetLoading: false
        }
        this.resetUserPassword = this.resetUserPassword.bind(this);
    }
    resetUserPassword(){
        var _this = this;
        var uid = this.props.userId;
        Modal.confirm({
            title: '重置密码',
            okText: '确定',
            cancelText: '取消',
            onOk(){
                _this.setState({
                    resetLoading: true
                })
                var url = fh_service.fhSystemHost + 'api/managerpwd';
                var data = new FormData();
                data.append('uid', uid);
                data.append('new_password', '123456');
                data.append('pre_password', '123456');
                var headers = new Headers({'X-FH-authtoken': fh_service.fhToken});
                fh_fetch.urlPost(url, data, headers).then(data => {
                    _this.setState({
                        resetLoading: false
                    })
                    if(data.code !== 1) {
                        notification['error']({
                            message: data.msg || '修改密码失败'
                        });
                        return;
                    }
                    notification['success']({
                        message: '修改成功',
                        description: '新密码：123456'
                    })
                })
            }
        })
    }
    render() {
        return(
            <Button type="primary" loading={this.state.resetLoading} onClick={this.resetUserPassword}>
                重置密码
            </Button>
        )
    }
}
/**
 * 获取用户信息
 */ 
class GetUserInfo extends React.Component {
    constructor(){
        super();
        this.state = {
            isGetUserLoading: false,
            userInfo: {},
            user_department: []
        }
        this.getUserInfo = this.getUserInfo.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.updateUserValue = this.updateUserValue.bind(this);
    }
    getUserInfo() {
        var uid = this.props.userId;
        if(!uid) {
            notification['error']({
                message: '查询失败',
                description: '没有用户id'
            });
            return;
        }
        this.setState({
            isGetUserLoading: true
        });
        var url = fh_service.fhSystemHost + 'api/updateuser?uid=' + uid;
        fh_fetch.urlGet(url).then(data => {
            if(!data.userinfo) {
                notification['error']({
                    message: data.msg || '查询用户信息失败'
                });
                this.setState({
                    isGetUserLoading: false
                })
                return;
            }
            this.setState({
                isGetUserLoading: false,
                userInfo: data.userinfo,
                visible: true
            }, this.showUserInfo)
        })
    }
    showUserInfo(){
        const { userInfo, user_department, kaoqinji_users } = this.state;
        var obj = { ...userInfo };
        var info = [];
        var __ = {
            "id":"用户ID",
            "attendance_id":"考勤机ID",
            "d_id":"部门",
            "username":"姓名",
            "email":"邮箱",
            "phone":"手机",
            "state":"职位状态",
            "role_id":"系统角色",
            "addtime":"注册时间"
        };
        if(!!obj['d_id']){
            obj['d_id'] = user_department[obj['d_id']] || obj['d_id'];
        }
        if(!!obj['state']){
            var state = ['未知', '在职', '离职'];
            obj['state'] = state[parseFloat(obj['state'])] || obj['state'];
        }
        if(!!obj['role_id']){
            var roles = ['员工', '管理员'];
            obj['role_id'] = roles[obj['role_id']] || obj['role_id'];
        }
        if(!!obj['addtime']) {
            obj['addtime'] = fh_date.formateTime({date: obj['addtime'] * 1000, fullTime: true}) || obj['addtime'];
        }
        for(var key in obj) {
            var eType = '';
            var data = [];
            switch(key) {
                case 'state': 
                    eType = 'fh_state';
                    break;
                case 'd_id': 
                    eType = 'fh_department';
                    break;
                case 'username':
                    eType = 'fh_username';
                    data = kaoqinji_users;
                    break;
                case 'attendance_id':
                    eType = 'fh_useruid';
                    break;
                default:
            }
            info.push(<div className="fh-alluser-info" key={key}>
                <span style={{display: 'inline-block', width: '6em', textAlign: 'right', marginRight: '1em'}}>{__[key]}: </span>
                {['addtime', 'id', 'role_id'].indexOf(key) > -1 ? <span>{obj[key]}</span>
                : <EditableCell value={obj[key]} valueN={userInfo[key]} name={key} eType={eType} data={data} onChange={this.updateUserValue} />}
                
            </div>)
        }
        this.setState({
            info
        })
    }
    handleCancel(){
        this.setState({
            visible: false
        })
    }
    handleOk(){
        console.log('修改的员工信息: ', this.state.userInfo);
        var url = fh_service.fhSystemHost + 'api/updateuser';
        var headers = new Headers({ 'X-FH-authtoken': fh_service.fhToken });
        var data = this.getUpdateFormdata(this.state.userInfo);
        if(!this.state.updateInfo) {
            notification['warn']({
                message: '没有要更改的信息'
            });
            this.handleCancel();
            return;
        }
        fh_fetch.urlPost(url, data, headers).then(data => {
            if(!data.code) {
                notification['error']({
                    message: data.msg || '未知错误'
                });
                return;
            }
            notification['success']({
                message: '修改成功'
            });
            this.setState({
                updateInfo: undefined
            })
        })
    }
    updateUserValue(name, value) {
        console.log('name: ', name, 'value: ', value);
        var { userInfo } = this.state;
        userInfo[name] = value;
        this.setState({
            userInfo: userInfo,
            updateInfo: 1
        });
    }
    getUpdateFormdata(data) {
        var formdata = new FormData();
        var __ = name => {
            var obj = {
                "id": "uid",
                "attendance_id":"aid",
                "d_id":"did"
            }
            return obj[name] || name;
        }
        
        for(var key in data){
            if(data[key] && key !== 'addtime' && key !== 'role_id') {
                formdata.append(__(key), data[key]);
                // formdata[__(key)] = data[key];
            }
        }
        return formdata;
        // return JSON.stringify(formdata);
    }
    /**
     * 获取考勤机用户数据 
     */ 
    getKaoqinjiUsers() {
        var url = fh_service.fhSystemHost + 'api/attusers';
        fh_fetch.urlGet(url).then(data => {
            console.log('getKaoqinjiUsers: ', data.sort((a,b)=>a.id - b.id));
            this.setState({
                kaoqinji_users: data.sort((a,b)=>a.id - b.id)
            })
        })
    }

    /**
     * 获取考勤机部门数据
     */ 
    getKaoqinjiDepartment() {
        var url = fh_service.fhSystemHost + 'api/department';
        fh_fetch.urlGet(url).then(data => {
            this.setState({
                user_department: this.parseDepartmentList(data)
            })
        })
    }
    parseDepartmentList(dpts) {
        var obj = {};
        dpts.forEach(d => {
            obj[d.id] = d.title;
            var kids = dc => {
                obj[dc.id] = dc.title;
                !!dc.children && dc.children.forEach(kid => kids(kid));
            };
            kids(d);
        });
        return obj;
    }
    componentDidMount() {
        this.getKaoqinjiDepartment();
    }
    render(){
        var { userInfo, isGetUserLoading, visible, info } = this.state;
        return(
            <div>
                <Button loading={isGetUserLoading} type="primary" onClick={this.getUserInfo}>
                    基本信息
                </Button>
                <Modal
                    visible={visible}
                    title={`${userInfo.username}的信息`}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                            修改
                        </Button>,
                    ]}>
                    {info}
                </Modal>
            </div>
        )
    }
}
/**
 * 可编辑标签
 */  
class EditableCell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: props.name,
            value: props.value,
            valueN: props.valueN,
            eType: props.eType,
            data: props.data,
            editable: false
        }
        this.getChangeValue = this.getChangeValue.bind(this);
    }
    
    handleChange = (e) => {
        const value = e.target.value;
        const valueN = e.target.value;
        this.setState({value, valueN});
    }
    getChangeValue = (data) => {
        console.log('选择结果: ', data);
        this.setState({
            choiceData: data
        }, this.checkChangeValue)
    }
    check = () => {
        this.setState({editable: false});
        if (this.props.onChange) {
            this
                .props
                .onChange(this.state.name, this.state.value);
        }
    }
    checkChangeValue(){
        const { eType, choiceData } = this.state;
        if(eType === 'fh_state'){
            this.setState({
                value: choiceData.value,
                title: choiceData.title
            })
        }
        if(eType === 'fh_username'){
            this.setState({
                value: choiceData.userName,
                title: choiceData.userName
            })
        }
        if(eType === 'fh_useruid'){
            this.setState({
                value: choiceData.userId,
                title: choiceData.userId
            })
        }
        if(eType === 'fh_department'){
            this.setState({
                value: choiceData.slice(-1),
                title: ''
            })
        }
    }
    edit = () => {
        this.setState({editable: true});
    }
    /**
     * elProps.eType form标签 可选值有input, checkbox, radio, select
     * elProps.valueN  原值
     */ 
    editElement = (elProps) => {
        console.log('可选编辑：', elProps);
        const { eType, valueN } = elProps || {};
        switch(eType) {
            case 'fh_state': {
                return <ChoiceState onChange={this.getChangeValue} value={valueN} />
            }
            case 'fh_department': {
                return <ChoiceDepartment onChange={this.getChangeValue} value={valueN} />
            }
            case 'fh_username': {
                return <ChoiceUser onChange={this.getChangeValue} value={valueN} />
            }
            case 'fh_useruid': {
                return <ChoiceUid onChange={this.getChangeValue} value={valueN} />
            }
            default: {
                return <Input value={valueN} onChange={this.handleChange} onPressEnter={this.check}/>
            }
        }
    }
    render() {
        const {value, title, valueN, editable, eType, data} = this.state;
        
        return (
            <span>
                {/* {this.editElement({eType, valueN})} */}
                {editable
                    ? <span>
                            {this.editElement({eType, data, valueN})}
                            <Icon type="check" style={{position: 'relative', zIndex: '9999'}} onClick={this.check}/>
                        </span>
                    : <span>
                        {title || value || ' '}
                        <Icon type="edit" onClick={this.edit}/>
                    </span>
                }
            </span>
        );
    }
}
/**
 * 获取员工列表
 */ 
class GetUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            users_currentPage: 1,
            users_pageSize: 10,
            users_currentData: []
        }
        this.getUsersList = this.getUsersList.bind(this);
        this.pagniationChange = this.pagniationChange.bind(this);
    }
    getUsersList() {
        var url = fh_service.fhSystemHost + 'api/users?page=1&limit=500';
        var fetchInfo = this.props.fetchInfo;
        if(!!fetchInfo) {
            url += '&username=' + fetchInfo.user_name + '&did=' + fetchInfo.user_department + '&state=' + fetchInfo.user_statu;
        }
        fh_fetch.urlGet(url).then(data => {
            return this.setState({
                users: data.list,
                users_total: parseFloat(data.Total),
                users_pageSize: !fetchInfo ? 10 : parseFloat(fetchInfo.user_pageSize.toString())
            });
        }).then(data => {
            this.props.onChangeUpdate(false);
            this.pagniationChange(this.state.users_currentPage, this.state.users_pageSize);
        })
    }
    pagniationChange(page, pageSize){
        this.setState({
            users_currentData: this.state.users.slice((page - 1) * pageSize, page * pageSize),
            users_currentPage: page
        });
    }
    componentDidMount() {
        this.getUsersList();
    }
    componentWillUnmount() {
        // cnsole.log('卸载了')
    }
    componentDidUpdate() {
        if(this.props.update) {
            this.getUsersList();
        }
    }
    render() {        
        var rows = ['正在加载…'];
        rows = this.state.users_currentData.map(user => {
            var row = <Row key={user.uid} className={'fh-user fh-user-' + user.uid}>
                        <Col span={1} />
                        <Col span={2} className="fh-user-id">{user.uid}</Col>
                        <Col span={2}>{user.username}</Col>
                        <Col span={4}>{user.dname}</Col>
                        <Col span={4}>{user.email}</Col>
                        <Col span={2}>{fh_date.formateTime({date: user.addtime * 1000})}</Col>
                        <Col span={8}>
                            <Row>
                                <Col span={8}>
                                    <FetchKaoqin userId={user.uid} />
                                </Col>
                                <Col span={8}>
                                    <GetUserInfo userId={user.uid} />
                                </Col>
                                <Col span={8}>
                                    <ResetPassword userId={user.uid} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                    </Row>;
            return row;
        });
        if(!rows.length) {
            rows = ['暂无数据！'];
        }
        return (
            <Layout>
                <Header className="fh-users-header">
                    <Row className="fh-users-title">
                        <Col span={1} />
                        <Col span={2} className="fh-user-id">id</Col>
                        <Col span={2}>姓名</Col>
                        <Col span={4}>部门</Col>
                        <Col span={4}>邮箱</Col>
                        <Col span={2}>注册时间</Col>
                        <Col span={8}>操作</Col>
                        <Col span={1} />
                    </Row>
                </Header>
                <Content className="fh-users-content">
                    {rows}
                </Content>
                <Footer className="fh-users-pagination">
                    <Pagination
                        current={this.state.users_currentPage}
                        pageSize={this.state.users_pageSize}
                        total={this.state.users_total}
                        showTotal={total => `共 ${total} 条`}
                        onChange={this.pagniationChange}
                        hideOnSinglePage />
                </Footer>
            </Layout>
        )
    }
}
/**
 * 员工列表shell
 */ 
class AllUser extends React.Component {
    constructor() {
        super();
        this.state = {
            fetchInfo: null,
            update: false
        }
        this.fetchUser = this.fetchUser.bind(this);
        this.changeUpdate = this.changeUpdate.bind(this);
    }
    fetchUser(fetchInfo) {
        this.setState({
            fetchInfo: fetchInfo,
            update: true
        })
    }
    changeUpdate(bool){
        this.setState({
            update: bool
        })
    }
    render() {
        return (
            <div className="fh-allusers-list">
                <FilterUser onFetchUser={this.fetchUser} />
                <GetUser fetchInfo={this.state.fetchInfo} update={this.state.update} onChangeUpdate={this.changeUpdate} />
            </div>
        )
    }
}

export default AllUser;