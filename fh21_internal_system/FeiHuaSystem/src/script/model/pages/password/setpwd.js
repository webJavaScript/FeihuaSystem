import React from 'react';
import { Input, Button, Layout, Form, notification, Icon } from 'antd';
import PageHeader from '../page_header';
import fh_service from '../../../service/service';
import fh_fetch from '../../../utils/fh_fetch';

import '../../../../style/model/pages/password/setpwd.css';

const { Content } = Layout;
const FormItem = Form.Item;
// const history = createHistory();
const WIDTH = '24em';

class SetPassword extends React.Component {
    constructor() {
        super();
        this.state ={
            setBtnLoading: false
        }
        this.handlerSetPwd = this.handlerSetPwd.bind(this);
        this.testRespons = this.testRespons.bind(this);
    }
    handlerSetPwd(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                console.log('setpwd: ', values);
                if((values.new_password.length !== 6) || !Number(values.new_password)) {
                    this.props.form.setFields({
                        new_password: {
                            errors: [new Error('请输入6位数字')]
                        }
                    });
                    return;
                }
                if(values.new_password === values.old_password) {
                    this.props.form.setFields({
                        new_password: {
                            errors: [new Error('您输入的密码与原密码相同')]
                        }
                    });
                    return;
                }
                if(values.new_password !== values.pre_password) {
                    this.props.form.setFields({
                        pre_password: {
                            errors: [new Error('两次输入密码不一致')]
                        }
                    });
                    return;
                }
                this.setState({
                    setBtnLoading: true
                });
                var url = fh_service.fhSystemHost + 'api/password';
                var data = JSON.stringify({
                    ...values
                });
                data = new FormData();
                data.append('old_password', values.old_password);
                data.append('new_password', values.new_password);
                data.append('pre_password', values.pre_password);
                var headers = new Headers({'X-FH-authtoken': fh_service.fhToken});
                fh_fetch.urlPost(url, data, headers).then(data => {
                    if(data && data.code) {
                        notification['success']({
                            message: '修改密码成功',
                            description: '密码修改成功，请使用新密码登录',
                            duration: 3
                        });
                        this.props.form.resetFields();
                        setTimeout(() => {
                            window.location.reload();
                        }, 3300);
                    } else {
                        notification['error']({
                            message: '修改密码失败',
                            description: data.msg,
                            duration: 3
                        });
                        this.props.form.setFields({
                            old_password: {
                                errors: [new Error('密码错误')]
                            }
                        });
                        // this.props.form.resetFields();
                    }
                    this.setState({
                        setBtnLoading: false
                    });
                })
            } else {
                console.log('setpwd: ', err);
            }
        })
    }
    testRespons(){
        var url = fh_service.fhSystemHost + 'api/test';
        var data = JSON.stringify({ demo: '我传了一个json格式字符串'});
        // data = new FormData();
        // data.append('demo', '我传了一个form格式字符串');
        var headers = new Headers({'X-FH-authtoken': fh_service.fhToken});
        fh_fetch.urlPost(url, data, headers).then(data => {
            var type = ['error', 'success'];
            notification[type[1]]({
                message: data
            })
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Layout className="fh-setpassword-layout">
                <PageHeader title={<span><Icon type="lock" /><span>修改密码</span></span>} />
                <Content className="fh-setpassword-content">
                    <Form onSubmit={this.handlerSetPwd} className="fh-setpassword-form">
                        <FormItem className="fh-setpassword-item">
                            <span className="fh-setpassword-item-name">原密码：</span>
                            {getFieldDecorator('old_password', {
                                rules: [{required: true, message: '密码不能为空'}]
                            })(
                                <Input style={{width: WIDTH}} type="password" placeholder="输入原密码" />
                            )}
                        </FormItem>
                        <FormItem className="fh-setpassword-item">
                            <span className="fh-setpassword-item-name">新密码：</span>
                            {getFieldDecorator('new_password', {
                                rules: [{required: true, message: '密码不能为空'}]
                            })(
                                <Input style={{width: WIDTH}} type="password" placeholder="输入新密码，6位数字" />
                            )}
                        </FormItem>
                        <FormItem className="fh-setpassword-item">
                            <span className="fh-setpassword-item-name">确认密码：</span>
                            {getFieldDecorator('pre_password', {
                                rules: [{required: true, message: '两次输入不同'}]
                            })(
                                <Input style={{width: WIDTH}} type="password" placeholder="再次输入密码，6位数字" />
                            )}
                        </FormItem>
                        <FormItem className="fh-setpassword-item">
                            <Button style={{width: '32em'}} loading={this.state.setBtnLoading} type="primary" htmlType="submit">
                                提交
                            </Button>
                            {/* <Button style={{width: '32em'}} onClick={this.testRespons} type="primary">
                                测试
                            </Button> */}
                        </FormItem>
                    </Form>
                </Content>
            </Layout>
        )
    }
}
SetPassword = Form.create()(SetPassword);
export default SetPassword;