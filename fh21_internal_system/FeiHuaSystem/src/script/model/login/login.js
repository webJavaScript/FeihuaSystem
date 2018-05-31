import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Tooltip } from 'antd';
import fh_run from '../../fh_run';
// import { Promise } from 'es6-promise';
import fh_fetch from '../../utils/fh_fetch';
import fh_service from '../../service/service';
import '../../../style/model/login/login.css';
import '../../../third_party/antd/antd.min.css';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      rememberMe: false
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.login(values);
      } else {
        this.setState({
          loading: false
        })
      }
    });
  }
  login = (values) => {
    var fetch_data = JSON.stringify({
      "email": values.userName,
      "password": values.password
    });
    fh_fetch.urlPost(fh_service.fhSystemHost + 'common/login', fetch_data).then(res => {
      if(res.code) {
        fh_service.fhToken = res.token;
        fh_run.userInfo = res.userinfo;
        fh_run.isRootUser = parseFloat(res.userinfo.role_id) > 0;
        localStorage.setItem('token', res.token);
        localStorage.setItem('fh_userinfo', JSON.stringify(res.userinfo));
        localStorage.setItem('userInfo', JSON.stringify(values));
        this.props.onLoginSystem(true);
      } else if(res.code === 0){
        if(res.msg.indexOf('密码') > -1) {
          this.props.form.setFields({
            password: {
              errors: [new Error(res.msg)]
            }
          })
        }
        if(res.msg.indexOf('邮箱') > -1) {
          this.props.form.setFields({
            userName: {
              errors: [new Error(res.msg)]
            }
          })
        }
        this.setState({
          loading: false,
          login_msg: res.msg
        })
      }
    }, err => {
      console.log(fh_service.fhSystemHost + 'common/login >>> err:', err);
    })
  }

  rememberMe(userInfo){
    if(!userInfo) return;
    if(typeof userInfo !== 'object') return;
    if(!userInfo.remember) {
      userInfo.password = '';
    }
    this.setState({
      rememberMe: userInfo.remember
    })
  }
  loginWithUserInfo(){
    var token = localStorage.getItem('token');
    var fhUserinfo = JSON.parse(localStorage.getItem('fh_userinfo'));
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.rememberMe(userInfo);
    if(!!token) {
      fh_service.fhToken = token;
      fh_run.userInfo = fhUserinfo;
      fh_run.isRootUser = parseFloat(fhUserinfo.role_id) > 0;
      this.props.onLoginSystem(true);
    } else if(userInfo && userInfo.remember) {
      var data = JSON.stringify({
        "userName": userInfo.userName,
        "password": userInfo.password
      });
      console.log('记住密码： ', data);
      this.login(data);
    }
  }
  componentDidMount() {
    this.loginWithUserInfo();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '用户名不正确!' }],
          })(
            <Input type="email" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '密码不正确!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: this.state.rememberMe || false,
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          {/* <a className="login-form-forgot">Forgot password</a> */}
          <Tooltip placement="right" title={this.state.login_msg}>
            <Button loading={this.state.loading} type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Tooltip>
          {/* Or <a>register now!</a> */}
        </FormItem>
      </Form>
    );
  }
}
// const Login = Form.create()(NormalLoginForm);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.loginSystem = this.loginSystem.bind(this);
  }

  loginSystem(isLogged) {
    this.props.onLoginSystem(isLogged);
  }
  render() {
    var LoginForm = Form.create()(NormalLoginForm);
    return (
      <div className="login-dialog">
        <h2>阳光飞华科技发展股份有限公司</h2>
        <LoginForm onLoginSystem={this.loginSystem} />
      </div>
    )
  }
}
export default Login;