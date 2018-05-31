import React from 'react';
import {Row, Col, Button, Icon, Modal} from 'antd';
// import fh_fetch from '../../utils/fh_fetch';
import fh_service from '../../service/service';
import '../../../style/model/titleBar/titleBar.css';

const confirm = Modal.confirm;

class TitleBar extends React.Component {


    render() {
        return (
            <div className="fh-title-bar">
                <h2>阳光飞华科技发展有限公司</h2>
            </div>
        )
    }
}

class Greettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '阳光飞华',
        }
        this.loginSystem = this.loginSystem.bind(this);
    }
    componentWillMount() {
        // console.log('componentWillMount');
    }
    componentDidMount() {
        // console.log('componentDidMount');
        this.setState({
            user: this.props.userInfo.username
        });
        console.log('fh_service.fhToken:', fh_service.fhToken);
    }
    loginSystem() {
        const _this = this;
        confirm({
            title: '提示',
            content: '是否退出管理系统',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                _this.props.onLoginSystem(false);
            },
            onCancel() {}
        })
    }

    render() {
        const user = this.state.user;
        const greettingTime = (time => {
            var now = new Date();
            var noon = now.setHours(12,0,0);
            var afternoon = now.setHours(13,0,0);
            if(noon > time.getTime()) {
                return '上午';
            }
            if(afternoon > time.getTime()) {
                return '中午';
            }
            return '下午';
        })(new Date())
        return(
            <div className="fh-greetting">
                <Row>
                    <Col span={4}> {/* greeting*/}
                        <div className="user-info">
                            <Icon type="user" />
                            <span>{user}</span>,{greettingTime}好!
                        </div>
                    </Col>
                    <Col span={16} />{/* devide */}
                    <Col span={1}>{/* badge message */}
                        <div className="fh-greetting-tools">
                            {/* <Badge count={5} className="fh-badge" showZero>
                                <a href="">消息</a>
                            </Badge> */}
                        </div>
                    </Col>
                    <Col span={1}>{/* badge message */}
                        <div className="fh-greetting-tools">
                            {/* <Badge count={0} className="fh-badge" showZero>
                                <a href="">消息</a>
                            </Badge> */}
                        </div>
                    </Col>
                    <Col span={1}>{/* badge message */}
                        <div className="fh-greetting-tools">
                            {/* <Badge count={25} className="fh-badge" showZero>
                                <a href="">消息</a>
                            </Badge> */}
                        </div>
                    </Col>
                    <Col span={1}>{/* logout system */}
                        <div className="fh-greetting-logout">
                            <Button type="dashed" onClick={this.loginSystem}>
                                退出
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

class Header extends React.Component {
    loginSystem = (isLogged) => {
        this.props.onLoginSystem(isLogged);
    }
    render() {
        return(
            <header>
                <TitleBar />
                <Greettings onLoginSystem={this.loginSystem} userInfo={this.props.userInfo} />
            </header>
        )
    }
}

export default Header;