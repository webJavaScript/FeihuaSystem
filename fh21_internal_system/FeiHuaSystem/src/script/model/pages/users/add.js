import React from 'react';
import { Layout, Form, Button, AutoComplete, Cascader, Input, Select, notification, Icon} from 'antd';
import PageHeader from '../page_header';
import fh_run from '../../../fh_run';
import fh_service from '../../../service/service';
import fh_fetch from '../../../utils/fh_fetch';

import '../../../../style/model/pages/users/add.css';

const { Content } = Layout;
const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;
const WIDTH = '24em';

class AddUserForm extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSourceEmail: [],
            dataSourceUserName: [],
            dataSourceUserId: [],
            kaoqinji_department: [],
            kaoqinji_users: [],
            add_email: '',
            add_uid: '',
            add_name: '',
            add_department: '',
            add_phone: '',
            addBtnLoading: false
        }
        this.emailAutoCompleteChange = this.emailAutoCompleteChange.bind(this);
        this.emailAutoCompleteSelect = this.emailAutoCompleteSelect.bind(this);
        this.emailAutoCompleteBlur = this.emailAutoCompleteBlur.bind(this);
        this.userDepartmentChange = this.userDepartmentChange.bind(this);
        this.getKaoqinjiDepartment = this.getKaoqinjiDepartment.bind(this);
        this.getKaoqinjiUsers = this.getKaoqinjiUsers.bind(this);
        this.userIdSelect = this.userIdSelect.bind(this);
        this.userNameSelect = this.userNameSelect.bind(this);
        this.userNameChange = this.userNameChange.bind(this);
        this.userIdChange = this.userIdChange.bind(this);
        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerChange = this.handlerChange.bind(this);
        this.userPhoneChange = this.userPhoneChange.bind(this);
    }
    handlerSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                var url = fh_service.fhSystemHost + 'api/adduser';
                values.d_id = parseFloat(values.d_id.slice(-1)[0]);
                values.attendance_id = parseFloat(values.attendance_id);
                var data = JSON.stringify(values); // 参数格式？
                data = new FormData();
                data.append('email', values.email);
                data.append('d_id', values.d_id);
                data.append('username', values.username);
                data.append('attendance_id', values.attendance_id);
                data.append('phone', values.phone);
                var headers = new Headers({'X-FH-authtoken': fh_service.fhToken});
                this.setState({
                    addBtnLoading: true
                })
                fh_fetch.urlPost(url, data, headers).then(data => {
                    this.setState({
                        addBtnLoading: false
                    });
                    if(data.code === 1) {
                        this.props.form.resetFields(['email']);
                        notification['success']({
                            message: '用户添加成功',
                            description: '账号:' + values.email + ' \n 密码:123456',
                            duration: 0
                        });
                    }else {
                        notification['error']({
                            message: '用户添加失败',
                            description: data.msg
                        })
                    }
                    console.log('添加用户结果: ', data);
                })
            } else {
                console.log('添加用户错误: ', err);
            }
        })
    }
    handlerChange(values){
        console.log('form change value: ', values);
        
        this.props.form.setFieldsValue({
            attendance_id: values.attendance_id.split('-').slice(-1),
            username: values.username.split('-')[0]
        })
    }
    userIdSelect(value) {
        setTimeout(() => {
            this.props.form.validateFields(['attendance_id'], (err, values) => {
                if(!err) {
                    this.props.form.setFieldsValue({
                        attendance_id: values.attendance_id.split('-').slice(-1)[0],
                        username: values.attendance_id.split('-')[0]
                    })
                } else {
                    console.log('err: ', err, values);
                }
            })
        },0)
        this.setState({
            add_name: value.split('-')[0],
            add_uid: value.split('-')[1],
        })
    }
    userNameSelect(value) {
        setTimeout(() => {
            this.props.form.validateFields(['username'], (err, values) => {
                if(!err) {
                    this.props.form.setFieldsValue({
                        attendance_id: values.username.split('-').slice(-1)[0],
                        username: values.username.split('-')[0]
                    })
                } else {
                    console.log('err: ', err, values);
                }
            })
        },0)
        this.setState({
            add_name: value.split('-')[0],
            add_uid: value.split('-')[1],
        })
    }
    userIdChange(value) {
        this.setState({
            add_uid: value.split('-').slice(-1)[0],
            dataSourceUserId: this.state.kaoqinji_users.filter(user => user.id.indexOf(value) > -1).map(user => 
                <AutoCompleteOption value={`${user.name}-${user.id}`} key={user.id} text={user.id}>
                    {`${user.name}-${user.id}`}
                </AutoCompleteOption>
            )
        })
    }
    userNameChange(value) {
        // var value = e.target.value;
        console.log('userNameChange: ', value);
        this.setState({
            add_name: value.split('-')[0],
            dataSourceUserName: this.state.kaoqinji_users.filter(user => user.name.indexOf(value) > -1).map(user => 
                <AutoCompleteOption value={`${user.name}-${user.id}`} key={user.id} text={user.name}>
                    {`${user.name}-${user.id}`}
                </AutoCompleteOption>
            )
        })
    }
    emailAutoCompleteBlur(value){
        fh_fetch.urlGet(fh_service.fhSystemHost + 'api/checkmail?email=' + value).then(data => {
            if(data.code === 1) {
                this.setState({
                    add_email: value
                });
            } else {
                console.log('this: ', this);
                this.props.form.setFields({
                    email: {
                        value,
                        errors: [new Error(data.msg || '邮箱验证失败')]
                    }
                })
            }
        })
    }
    emailAutoCompleteSelect(value){
        this.setState({
            add_email: value
        });
    }
    emailAutoCompleteChange(value) {
        let dataSourceEmail;
        if (!value || value.indexOf('@') >= 0) {
            dataSourceEmail = [];
        } else {
            dataSourceEmail = fh_run.autoCompleteOptions.map(domain => `${value}${domain}`).map((email) => {
                return <AutoCompleteOption key={email}>{email}</AutoCompleteOption>;
              });
        }
        this.setState({ dataSourceEmail, add_email: value });
    }
    userDepartmentChange(value) {
        this.setState({
            add_department: value.slice(-1) || ''
        })
    }
    userPhoneChange(value){
        this.setState({
            add_phone: value
        })
    }
    /**
     * 获取考勤机部门数据
     */ 
    getKaoqinjiDepartment() {
        var url = fh_service.fhSystemHost + 'api/department';
        fh_fetch.urlGet(url).then(data => {
            console.log('getUserDepartment: ', data);
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
            console.log('getKaoqinjiUsers: ', data.sort((a,b)=>a.id - b.id));
            this.setState({
                kaoqinji_users: data.sort((a,b)=>a.id - b.id)
            })
        })
    }
    parseDepartmentList(department) {
        department.value = department.id;
        department.label = department.title;
        !!department.children && department.children.forEach(kid => this.parseDepartmentList(kid));
        return department;
    }
    componentDidMount() {
        this.getKaoqinjiDepartment();
        this.getKaoqinjiUsers();
    }
    render() {
        const { dataSourceEmail, optionsCascader } = this.state;
        const { getFieldDecorator } = this.props.form;
        var selects = this.state.kaoqinji_users.map(user => 
            <Select.Option key={user.id} value={`${user.name}-${user.id}`}>
                {`${user.name}-${user.id}`}
            </Select.Option>
        )
        return(
            <Layout className="fh-adduser-form-layout">
                <PageHeader title={<span><Icon type="user-add" /><span>添加员工</span></span>} />
                <Content className="fh-adduser-content">
                    <Form className="fh-adduser-form" onSubmit={this.handlerSubmit}>
                        <FormItem className="fh-adduser-email">
                            <span className="fh-adduser-form-name">* 邮箱:</span>
                            {getFieldDecorator('email', {
                                    rules: [{
                                        required: true,
                                        message: '邮箱不能为空'
                                    }]
                                })(
                                <AutoComplete
                                    style={{width: WIDTH}}
                                    dataSource={dataSourceEmail}
                                    onSelect={this.emailAutoCompleteSelect}
                                    onChange={this.emailAutoCompleteChange}
                                    onBlur={this.emailAutoCompleteBlur}
                                    placeholder="绑定邮箱" />
                            )}
                        </FormItem>
                        <FormItem className="fh-adduser-kaoqinji-name">
                            <span className="fh-adduser-form-name">* 考勤机姓名:</span>
                                {getFieldDecorator('username', {
                                        rules: [{
                                            required: true,
                                            message: '员工姓名不能为空'
                                        }]
                                    })(
                                    // <AutoComplete
                                    //     placeholder="输入员工姓名"
                                    //     className="user-name"
                                    //     dataSource={dataSourceUserName}
                                    //     onSelect={this.userNameSelect}
                                    //     onChange={this.userNameChange}
                                    //     optionLabelProp="text"
                                    //     style={{width: WIDTH}} />
                                    <Select
                                        placeholder="选择员工姓名"
                                        className="user-name"
                                        style={{width: WIDTH}}
                                        onChange={this.userNameSelect}>
                                        {selects}
                                    </Select>
                                )}
                        </FormItem>
                        <FormItem className="fh-adduser-kaoqinji-id">
                            <span className="fh-adduser-form-name">* 考勤机ID:</span>
                            {getFieldDecorator('attendance_id', {
                                    rules: [{
                                        required: true,
                                        message: '考勤机ID不能为空'
                                    }]
                                })(
                                <AutoComplete
                                    placeholder="输入员工考勤机ID"
                                    className="user-id"
                                    // dataSource={dataSourceUserId}
                                    // onSelect={this.userIdSelect}
                                    // onChange={this.userIdChange}
                                    // optionLabelProp="text"
                                    style={{width: WIDTH}}
                                    disabled />
                            )}
                        </FormItem>
                        <FormItem className="fh-adduser-department">
                            <span className="fh-adduser-form-name">* 部门:</span>
                            {getFieldDecorator('d_id', {
                                    rules: [{
                                        required: true,
                                        message: '部门不能为空'
                                    }]
                                })(
                                <Cascader style={{width: WIDTH}} options={optionsCascader} className="user-department" onChange={this.userDepartmentChange} placeholder="选择部门" />
                            )}
                        </FormItem>
                        <FormItem className="fh-adduser-phone">
                            <span className="fh-adduser-form-name">电话:</span>
                            {getFieldDecorator('phone', {
                                    rules: [{
                                        required: false
                                    }]
                                })(
                                <Input type="tel" placeholder="输入电话号码" style={{width: WIDTH}} onChange={this.phoneChange} />
                            )}
                        </FormItem>
                        <FormItem className="fh-adduser-submit">
                            <Button loading={this.state.addBtnLoading} type="primary" htmlType="submit" style={{width: '32em', margin: '0 auto'}}>
                                提交
                            </Button>
                        </FormItem>
                    </Form>
                </Content>
            </Layout>
        )
    }
}

const AddUser = Form.create({})(AddUserForm);
export default AddUser;