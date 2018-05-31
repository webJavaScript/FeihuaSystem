import React from 'react';
import {Icon, Menu} from 'antd';
import fh_run from '../../fh_run';
import '../../../style/model/navigator/navigator.css';
const SubMenu = Menu.SubMenu;

class Navigator extends React.Component {
    state = {
      theme: 'light',
      current: '1',
      navName: ''
    }
    changeTheme = (value) => {
      this.setState({
        theme: value ? 'dark' : 'light',
      });
    }
    handleClick = (e) => {
      console.log('click ', e.item);
      this.setState({
        current: e.key,
      });
      this.props.onNavigatorTo(e.key);
    }
    render() {
      return (
        <nav className="fh-navigator">
          <Menu
            theme={this.state.theme}
            onClick={this.handleClick}
            style={{ width: 240 }}
            defaultOpenKeys={['kaoqin']}
            selectedKeys={[this.state.current]}
            mode="inline"
            className="fh-nav"
          >
            <Menu.Item key="kaoqin">
                <Icon type="clock-circle-o" />
                考勤
            </Menu.Item>
            <Menu.Item key="dinner">
                <Icon type="coffee" />
                订餐
            </Menu.Item>
            <Menu.Item key="weeklyreports">
              <Icon type="mail" />
                周报
            </Menu.Item>
            {fh_run.isRootUser ?
            <SubMenu key="fh_user" title={<span><Icon type="user" /><span>员工</span></span>} className="fh-nav-item">
              <Menu.Item key="alluser"><Icon type="team" />所有员工</Menu.Item>
              <Menu.Item key="adduser"><Icon type="user-add" />添加员工</Menu.Item>
            </SubMenu> : ''}
            <Menu.Item key="setpassword">
                <Icon type="lock" />
                修改密码
            </Menu.Item>
          </Menu>
        </nav>
      );
    }
  }

export default Navigator;